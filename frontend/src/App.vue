<script setup>
/*

/*
NAMING CONVENTIONS:
path - d prop for <path> element - a string with path data
stroke - user input (position stuff)
*/
import Toolbar from './components/core/Toolbar.vue'
import Widget from './components/core/Widget.vue'
import OverlaySvg from './components/overlay/OverlaySvg.vue'

import { WidgetData, ExpressionData, GraphData, widgetComponents } from './utils/widgets'
import { toolList, tools } from './utils/drawingTools'

import DEBUG from './utils/debug'

import { useWidgetStore } from './stores/useWidgetStore'
import { useCanvasStore } from './stores/useCanvasStore'
import { useSessionStore } from './stores/useSessionStore'

const widgetStore = useWidgetStore()
const canvasStore = useCanvasStore()
const sessionStore = useSessionStore()

if (DEBUG.createTestExpression) {
	widgetStore.widgets.push(new WidgetData(100, 100, 515, 150, new ExpressionData('x^2+2x-1')))
	// expressions.value.push(new ExpressionData('x^2+2x-1', 249, 326, 515, 150))
}

if (DEBUG.createTestGraph) {
	widgetStore.widgets.push(
		new WidgetData(410, 300, 714, 615, new GraphData(['x^2+2x-1', '\\sin(x)'])),
	)
}

function SVGMouseDown(event) {
	if (sessionStore.stopCanvasInput) return
	tools[sessionStore.activeTool].onDown?.(event)
}

function SVGMouseMove(event) {
	if (sessionStore.stopCanvasInput) return
	tools[sessionStore.activeTool].onMove?.(event)
	sessionStore.previousMousePos.x = event.clientX
	sessionStore.previousMousePos.y = event.clientY

	if (DEBUG.logMouseMovements) {
		console.log(
			`ClientX: ${event.clientX}  ClientY: ${event.clientY}. \n OffsetX: ${event.offsetX}  OffsetY: ${event.offsetY}`,
		)
	}
}

function SVGMouseUp(event) {
	if (sessionStore.stopCanvasInput) return
	tools[sessionStore.activeTool].onUp?.(event)
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
		<Toolbar :toolList> </Toolbar>

		<svg
			id="inputSVG"
			class="inputSVG"
			@mousedown="SVGMouseDown"
			@mouseup="SVGMouseUp"
			@mousemove="SVGMouseMove"
		>
			<path
				v-for="path in canvasStore.paths"
				:d="path.d"
				class="stroke"
				:key="path.id"
				:data-id="path.id"
			/>

			<path
				v-if="sessionStore.currentStroke.length > 1"
				:d="
					`M ${sessionStore.currentStroke[0].x},${sessionStore.currentStroke[0].y} ` +
					sessionStore.currentStroke
						.slice(1)
						.map((p) => `L ${p.x},${p.y}`)
						.join(' ')
				"
				class="stroke"
			/>
		</svg>

		<OverlaySvg :tools="tools"></OverlaySvg>

		<div class="widget-container">
			<Widget
				v-for="widget in widgetStore.widgets"
				v-bind="widget"
				:key="widget.id"
				@deleteWidget="
					(id) => (widgetStore.widgets = widgetStore.widgets.filter((e) => e.id != id))
				"
			>
				<component :is="widgetComponents[widget.type]" :data="widget.data"></component>
			</Widget>
		</div>
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
/* ============================================== */

.widget-container {
	isolation: isolate;
}
</style>
