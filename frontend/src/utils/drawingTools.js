import { ref } from 'vue'
import { cropCanvas, downloadCanvasPNG, svgToCanvas, recognizeCanvas } from './svgCanvasTools'
import { WidgetData, ExpressionData } from '@/utils/widgets'
import { erasePathsInRect } from './svgCanvasTools'
import { useWidgetStore } from '@/stores/useWidgetStore'
import { useCanvasStore } from '@/stores/useCanvasStore'
import { useSessionStore } from '@/stores/useSessionStore'
import { DEBUG } from './debug'

const pen = {
	onDown(event) {
		const sessionStore = useSessionStore()
		let startPos = { x: event.offsetX, y: event.offsetY }
		sessionStore.currentStroke = [startPos]
	},
	onMove(event) {
		if (event.buttons !== 1) return
		const sessionStore = useSessionStore()

		let point = { x: event.offsetX, y: event.offsetY }
		sessionStore.currentStroke.push(point)
	},
	onUp() {
		const sessionStore = useSessionStore()
		const canvasStore = useCanvasStore()
		// "d" is the path param for <path> elemtn
		let d = ''

		/*
    go through currentPath, and then adds
      index 1: M x, y
      index ...: C x, y
    */

		if (sessionStore.currentStroke.length == 1) {
			// lil circle
			//? maybe switcch this to do a filled in circle somehow
			let radius = 1
			d += `M ${sessionStore.currentStroke[0].x},${sessionStore.currentStroke[0].y - radius}`
			d += `a ${radius} ${radius} 0 1 0 0.0001 0`
		} else {
			// line
			d += `M ${sessionStore.currentStroke[0].x},${sessionStore.currentStroke[0].y} `
			d += 'L '

			for (let i = 1; i < sessionStore.currentStroke.length; i++) {
				d += `${sessionStore.currentStroke[i].x},${sessionStore.currentStroke[i].y} `
			}
		}

		canvasStore.paths.push({ d: d, id: crypto.randomUUID() })
		// clear path
		sessionStore.currentStroke = []
	},
}
const eraser = {
	onMove(event) {
		if (event.buttons !== 1) return
		const sessionStore = useSessionStore()
		const canvasStore = useCanvasStore()

		const startPos = sessionStore.previousMousePos
		const endPos = { x: event.clientX, y: event.clientY }

		const dx = endPos.x - startPos.x
		const dy = endPos.y - startPos.y
		const distance = Math.hypot(dx, dy)
		const steps = Math.max(1, Math.ceil(distance))

		for (let i = 0; i <= steps; i++) {
			const x = startPos.x + (dx / steps) * i
			const y = startPos.y + (dy / steps) * i

			const elements = document.elementsFromPoint(x, y)

			for (let pathElement of elements) {
				if (pathElement.tagName != 'path') continue

				const id = pathElement.dataset.id
				// NOTICE this changes in indicies
				// we could instead just set it to 0 or something
				canvasStore.paths = canvasStore.paths.filter((p) => p.id != id)
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
		const widgetStore = useWidgetStore()
		const sessionStore = useSessionStore()

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

		sessionStore.activeTool = 'pen'

		// recognize expression
		const latex = recognizeCanvas(croppedCanvas)

		/* TODO
		- create expression component with "loading"
		- add latex to expression component
		*/
		widgetStore.widgets.push(new WidgetData(x, y, width, height, new ExpressionData(latex))) // make it first so it can load and say loading...
		widgetStore.widgets.at(-1).data.latex = await latex // update latex when its done

		// debug stuff
		if (DEBUG.downloadPNG) downloadCanvasPNG(croppedCanvas)
		if (DEBUG.logLatex) console.log(await latex)
	},
}

export const toolList = ['pen', 'eraser', 'selector']
export const tools = {
	pen: pen,
	eraser: eraser,
	selector: selector,
}
