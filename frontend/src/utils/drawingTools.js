import { ref } from 'vue'
import { cropCanvas, downloadCanvasPNG, svgToCanvas, recognizeCanvas } from './svgCanvasTools'
import { WidgetData, widgets, ExpressionData } from '@/utils/widgets'

const DEBUG = {
	logMouseMovements: false,
	downloadPNG: false,
	logLatex: true,
	createTestExpression: true,
}

export const currentStroke = ref([])
export const paths = ref([]) // consider putting this inside pen object? consideration of format etc ykyk
export const previousMousePos = { x: -1, y: -1 }

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
	erasePathsInRect(x, y, width, height) {
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
	},
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
		eraser.erasePathsInRect(x, y, width, height)

		activeTool.value = 'pen'

		// recognize expression
		const latex = recognizeCanvas(croppedCanvas)

		/* TODO
		- create expression component with "loading"
		- add latex to expression component
		*/

		widgets.value.push(new WidgetData(x, y, width, height, new ExpressionData(latex))) // make it first so it can load and say loading...
		widgets.value.at(-1).data.latex = await latex // update latex when its done

		// debug stuff
		if (DEBUG.downloadPNG) downloadCanvasPNG(croppedCanvas)
		if (DEBUG.logLatex) console.log(await latex)
	},
}

export const activeTool = ref('pen')
export const toolList = ['pen', 'eraser', 'selector']
export const tools = {
	pen: pen,
	eraser: eraser,
	selector: selector,
}
