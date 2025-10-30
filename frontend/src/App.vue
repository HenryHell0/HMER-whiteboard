<script setup>
/*

/*
NAMING CONVENTIONS:
path - d prop for <path> element - a string with path data
stroke - user input (position stuff)
*/
import { ref } from 'vue'
import Expression from './components/Expression.vue'
import Toolbar from './components/Toolbar.vue'

var currentStroke = ref([])
const paths = ref([]) // consider putting this inside pen object? consideration of format etc ykyk
const previousMousePos = { x: -1, y: -1 }
const previousOffsetPos = { x: -1, y: -1 }
const expressions = ref([])
const isDragging = ref(false)

class ExpressionData {
	constructor(formula, x, y, width, height) {
		this.formula = formula
		this.x = x
		this.y = y
		this.width = width
		this.height = height
		this.id = crypto.randomUUID()
	}
}
// expressions.value.push(new ExpressionData('x^2+2x-1', 249, 326, 515, 150))

// TODO make this change the converted SVG styles to these for optimization
// const svgToPngStyles = {
// 	stroke: 'black',
// 	fill: 'none',
// 	strokeWidth: '100px',
// }

const DEBUG = {
	logMouseMovements: false,
	downloadPNG: false,
	logLatex: true,
}

function serializeSVG(svgElement) {
	// try to fix to get this stuff working lololol
	for (let path of svgElement.children) {
		path.style.stroke = getComputedStyle(path).stroke
		path.style.fill = getComputedStyle(path).fill
		path.style.strokeWidth = getComputedStyle(path).strokeWidth
	}

	const serializer = new XMLSerializer()
	return serializer.serializeToString(svgElement)
}

function cropCanvas(finalCanvas, originalCanvas, x, y, w, h) {
	finalCanvas.width = w
	finalCanvas.height = h
	const finalCtx = finalCanvas.getContext('2d')

	finalCtx.drawImage(originalCanvas, x, y, w, h, 0, 0, w, h)
}

function downloadCanvasPNG(canvas) {
	const URL = canvas.toDataURL()
	const downloadLinkElement = document.createElement('a')
	downloadLinkElement.href = URL
	downloadLinkElement.download = 'canvas-screenshot.png'
	document.body.appendChild(downloadLinkElement)
	downloadLinkElement.click()
	document.body.removeChild(downloadLinkElement)
}

async function svgToCanvas(id) {
	return new Promise((resolve, reject) => {
		const svgElement = document.getElementById(id)
		// ! fix styles
		// TODO fix styles
		const svgString = serializeSVG(svgElement)
		const svgRect = svgElement.getBoundingClientRect()

		const canvas = document.createElement('canvas')
		const ctx = canvas.getContext('2d')

		const blob = new Blob([svgString], { type: 'image/svg+xml' })
		const blobUrl = URL.createObjectURL(blob)

		const img = new Image()
		img.src = blobUrl
		img.width = svgRect.width
		img.height = svgRect.height
		img.onerror = reject
		img.onload = () => {
			// draw image to canvas
			canvas.width = img.width
			canvas.height = img.height
			ctx.fillStyle = 'white'
			ctx.fillRect(0, 0, img.width, img.height)
			ctx.drawImage(img, 0, 0)
			URL.revokeObjectURL(img.src)

			resolve(canvas)
		}
	})
}

function erasePathsInRect(x, y, width, height) {
	// this function also deletes something if you intersect the edge of a bbox, so it can erase things even if you aren't over it completely - especially if it is a diagonal.

	const rectLeft = x
	const rectRight = x + width
	const rectTop = y
	const rectBottom = y + height

	paths.value = paths.value.filter((path) => {
		const element = document.querySelector(`[data-id="${path.id}"]`)
		if (!element) return true

		const bbox = element.getBBox()
		const boxLeft = bbox.x
		const boxRight = bbox.x + bbox.width
		const boxTop = bbox.y
		const boxBottom = bbox.y + bbox.height

		// fully inside
		const fullyInside =
			boxLeft >= rectLeft &&
			boxRight <= rectRight &&
			boxTop >= rectTop &&
			boxBottom <= rectBottom

		// partial overlap
		const intersects = !(
			boxRight < rectLeft ||
			boxLeft > rectRight ||
			boxBottom < rectTop ||
			boxTop > rectBottom
		)

		// selection fully inside path bbox (path contains selection)
		const containsSelection =
			rectLeft >= boxLeft &&
			rectRight <= boxRight &&
			rectTop >= boxTop &&
			rectBottom <= boxBottom

		// erase if fully inside or intersecting, but not if it contains selection
		const shouldErase = (fullyInside || intersects) && !containsSelection

		return !shouldErase
	})
}

async function canvasToBlob(canvas) {
	return new Promise((resolve) => {
		canvas.toBlob(resolve, 'image/png')
	})
}
async function recognizeCanvas(canvas) {
	const blob = await canvasToBlob(canvas)
	const formData = new FormData()
	formData.append('img', blob, 'image.png')

	const response = await fetch('/api/predict', {
		method: 'POST',
		body: formData,
	})
	const latex = await response.text()

	return latex
}

const pen = {
	onDown(event) {
		let startPos = { x: event.offsetX, y: event.offsetY }
		currentStroke.value = [startPos]
	},
	onMove(event) {
		if (event.buttons !== 1) return

		let point = { x: event.offsetX, y: event.offsetY }
		currentStroke.value.push(point)
	},
	onUp() {
		// "d" is the path param for <path> elemtn
		let d = ''

		/*
    go through currentPath, and then adds
      index 1: M x, y
      index ...: C x, y
    */

		if (currentStroke.value.length == 1) {
			// lil circle
			//? maybe switcch this to do a filled in circle somehow
			let radius = 1
			d += `M ${currentStroke.value[0].x},${currentStroke.value[0].y - radius}`
			d += `a ${radius} ${radius} 0 1 0 0.0001 0`
		} else {
			// line
			d += `M ${currentStroke.value[0].x},${currentStroke.value[0].y} `
			d += 'L '

			for (let i = 1; i < currentStroke.value.length; i++) {
				d += `${currentStroke.value[i].x},${currentStroke.value[i].y} `
			}
		}

		paths.value.push({ d: d, id: crypto.randomUUID() })
		// clear path
		currentStroke.value = []
	},
}
const eraser = {
	onMove(event) {
		if (event.buttons !== 1) return

		const startPos = previousMousePos
		const endPos = { x: event.clientX, y: event.clientY }

		const dx = endPos.x - startPos.x
		const dy = endPos.y - startPos.y
		const distance = Math.hypot(dx, dy)
		const steps = Math.max(1, Math.ceil(distance))

		for (let i = 0; i <= steps; i++) {
			const x = startPos.x + (dx * i) / steps
			const y = startPos.y + (dy * i) / steps

			const elements = document.elementsFromPoint(x, y)

			for (let pathElement of elements) {
				if (pathElement.tagName != 'path') continue

				const id = pathElement.dataset.id
				// NOTICE this changes in indicies
				// we could instead just set it to 0 or something
				paths.value = paths.value.filter((p) => p.id != id)
			}
		}
	},
}
const selector = {
	//? consider adding a confirmation/additional editing of selection (a lot of work for a small feature)

	startX: ref(-1),
	startY: ref(-1),
	endX: ref(-1),
	endY: ref(-1),
	isActive: ref(false),

	onDown(event) {
		this.startX.value = event.clientX
		this.startY.value = event.clientY
		this.endX.value = event.clientX
		this.endY.value = event.clientY
		this.isActive.value = true
	},
	onMove(event) {
		if (!this.isActive.value) return
		this.endX.value = event.clientX
		this.endY.value = event.clientY
	},
	async onUp(event) {
		// convert svg to png!!
		const fullCanvas = await svgToCanvas('inputSVG')

		// crop canvas
		const croppedCanvas = document.createElement('canvas')
		const x = Math.min(this.startX.value, this.endX.value)
		const y = Math.min(this.startY.value, this.endY.value)
		const width = Math.abs(this.endX.value - this.startX.value)
		const height = Math.abs(this.endY.value - this.startY.value)
		cropCanvas(croppedCanvas, fullCanvas, x, y, width, height)

		// reset
		this.endX.value = event.clientX
		this.endY.value = event.clientY
		this.isActive.value = false

		// erase strokes and switch to pen
		erasePathsInRect(x, y, width, height)

		activeTool.value = 'pen'

		// recognize expression
		const latex = recognizeCanvas(croppedCanvas)

		/* TODO
		- create expression component with "loading"
		- add latex to expression component
		*/

		expressions.value.push(new ExpressionData(latex, x, y, width, height)) // make it first so it can load and say loading...
		expressions.value.at(-1).formula = await latex // update latex when its done

		// debug stuff
		if (DEBUG.downloadPNG) downloadCanvasPNG(croppedCanvas)
		if (DEBUG.logLatex) console.log(await latex)
	},
}

const activeTool = ref('pen')
const toolList = ['pen', 'eraser', 'selector']
const tools = new Map([
	['pen', pen],
	['eraser', eraser],
	['selector', selector],
])

function SVGMouseDown(event) {
	if (isDragging.value) return
	tools.get(activeTool.value).onDown?.(event)
}

function SVGMouseMove(event) {
	if (isDragging.value) return
	tools.get(activeTool.value).onMove?.(event)
	previousMousePos.x = event.clientX
	previousMousePos.y = event.clientY
	previousOffsetPos.x = event.offsetX
	previousOffsetPos.y = event.offsetY

	if (DEBUG.logMouseMovements) {
		console.log(
			`ClientX: ${event.clientX}  ClientY: ${event.clientY}. \n OffsetX: ${event.offsetX}  OffsetY: ${event.offsetY}`,
		)
	}
}

function SVGMouseUp(event) {
	if (isDragging.value) return
	tools.get(activeTool.value).onUp?.(event)
}

// attempt at mobile support
// function getTouchPosition(event) {
//   const touch = event.touches[0] || event.changedTouches[0]
//   return {
//     x: touch.clientX,
//     y: touch.clientY,
//   }
// }

// function SVGTouchStart(event) {
//   SVGTouchEnd(event)
//   event.preventDefault()
//   const pos = getTouchPosition(event)
//   SVGMouseDown({ offsetX: pos.x, offsetY: pos.y, buttons: 1, clientX: pos.x, clientY: pos.y })
// }

// function SVGTouchMove(event) {
//   event.preventDefault()
//   const pos = getTouchPosition(event)
//   SVGMouseMove({ offsetX: pos.x, offsetY: pos.y, buttons: 1, clientX: pos.x, clientY: pos.y })
// }

// function SVGTouchEnd(event) {
//   console.log('touching u rn')
//   event.preventDefault()
//   const pos = getTouchPosition(event)
//   SVGMouseUp({ offsetX: pos.x, offsetY: pos.y, buttons: 1, clientX: pos.x, clientY: pos.y })
// }
</script>

<template>
	<div class="template">
		<Toolbar @updateTool="(tool) => (activeTool = tool)" :toolList :activeTool> </Toolbar>

		<svg
			id="inputSVG"
			class="inputSVG"
			@mousedown="SVGMouseDown"
			@mouseup="SVGMouseUp"
			@mousemove="SVGMouseMove"
		>
			<path
				v-for="path in paths"
				:d="path.d"
				class="stroke"
				:key="path.id"
				:data-id="path.id"
			/>

			<path
				v-if="currentStroke.length > 1"
				:d="
					`M ${currentStroke[0].x},${currentStroke[0].y} ` +
					currentStroke
						.slice(1)
						.map((p) => `L ${p.x},${p.y}`)
						.join(' ')
				"
				class="stroke"
			/>
		</svg>

		<svg class="overlaySVG">
			<rect
				v-if="selector.isActive.value"
				class="selection-rect"
				:x="Math.min(selector.startX.value, selector.endX.value)"
				:y="Math.min(selector.startY.value, selector.endY.value)"
				:width="Math.abs(selector.endX.value - selector.startX.value)"
				:height="Math.abs(selector.endY.value - selector.startY.value)"
			/>
			\
		</svg>

		<!-- test formula -->
		<Expression
			v-for="expression in expressions"
			v-bind="expression"
			v-model:isDragging="isDragging"
			:key="expression.id"
			@removeExpression="(id) => (expressions = expressions.filter((e) => e.id != id))"
		></Expression>
	</div>
</template>

<style>
/*
TODO:
- work on toolbar styles,
- add some color to the toolbar (blue active tool?)
- add custom cursor for eraser etc (only applies for mouse not stylus)
*/

/* ========= WHOLE THING ===== */

.template {
	font-family: roboto;
}

/* ============================== */

/* =========== SVG STYLES ========== */

.inputSVG {
	position: absolute;
	top: 0;
	left: 0;
	width: 100vw;
	height: 100vh;
	border: none;
	cursor: crosshair;
}

.stroke {
	stroke-linejoin: round;
	stroke-linecap: round;
	fill: none;
	stroke: black;
	stroke-width: 2;
	pointer-events: stroke;
}

.overlaySVG {
	position: absolute;
	top: 0;
	left: 0;
	width: 100vw;
	height: 100vh;
	pointer-events: none;
	z-index: 1;
}

.selection-rect {
	stroke: black;
	fill: rgba(0, 0, 0, 0.1);
	stroke-width: 3;
	stroke-dasharray: 12 10;
	stroke-linecap: round;
	rx: 8;
	ry: 8;
	animation: ants 0.8s linear infinite;
}

@keyframes ants {
	to {
		stroke-dashoffset: -22; /* 12 + 10 */
	}
}
/* ============================================== */

/* ============== toolbar styles ==================
.toolbar {
	position: absolute;
	top: 10px;
	left: 50%;
	transform: translateX(-50%);
	display: flex;
	justify-content: center;
	gap: 10px;
	padding: 10px 10px;
	background-color: rgba(255, 255, 255, 0.8);
	border-radius: 1000000px;
	box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
	z-index: 100;
	user-select: none;
}

.toolbar-image {
	width: 1.5rem;
	height: 1.5rem;
	fill: black;
	transition: rotate 0.2s ease;
}

.toolbar-button {
	all: unset;
	padding: 8px 10px;
	border-radius: 10000px;
	border: none;
	cursor: pointer;
	user-select: none;
	transition:
		transform 0.15s ease,
		background 0.3s ease;
}

.toolbar-button:hover {
	transform: scale(1.1);
	background: rgb(226, 226, 226);
}

.toolbar-button.active {
	background-color: #c0c0c0;
	transform: scale(1.1);
}

.toolbar-button.active:hover {
	background-color: #c0c0c0;
	transform: scale(1.2);
}

======================== */
</style>
