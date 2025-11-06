<script setup>
/*

/*
NAMING CONVENTIONS:
path - d prop for <path> element - a string with path data
stroke - user input (position stuff)
*/
import Toolbar from './components/Toolbar.vue'
import Widget from './components/Widget.vue'
import Expression from './components/Expression.vue'
import { WidgetData, ExpressionData, widgets, stopCanvasInput } from './utils/widgets'
import {
	activeTool,
	toolList,
	tools,
	paths,
	currentStroke,
	previousMousePos,
} from './utils/drawingTools'

const widgetComponents = {
	Expression: Expression,
}

const DEBUG = {
	createTestExpression: true,
}

if (DEBUG.createTestExpression) {
	widgets.value.push(new WidgetData(249, 326, 515, 150, new ExpressionData('x^2+2x-1')))
	// expressions.value.push(new ExpressionData('x^2+2x-1', 249, 326, 515, 150))
}

function SVGMouseDown(event) {
	if (stopCanvasInput.value) return
	tools[activeTool.value].onDown?.(event)
}

function SVGMouseMove(event) {
	if (stopCanvasInput.value) return
	tools[activeTool.value].onMove?.(event)
	previousMousePos.x = event.clientX
	previousMousePos.y = event.clientY

	if (DEBUG.logMouseMovements) {
		console.log(
			`ClientX: ${event.clientX}  ClientY: ${event.clientY}. \n OffsetX: ${event.offsetX}  OffsetY: ${event.offsetY}`,
		)
	}
}

function SVGMouseUp(event) {
	if (stopCanvasInput.value) return
	tools[activeTool.value].onUp?.(event)
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
				v-if="tools['selector'].isActive.value"
				class="selection-rect"
				:x="Math.min(tools['selector'].startX.value, tools['selector'].endX.value)"
				:y="Math.min(tools['selector'].startY.value, tools['selector'].endY.value)"
				:width="Math.abs(tools['selector'].endX.value - tools['selector'].startX.value)"
				:height="Math.abs(tools['selector'].endY.value - tools['selector'].startY.value)"
			/>
			\
		</svg>

		<Widget
			v-for="widget in widgets"
			v-bind="widget"
			v-model:stopCanvasInput="stopCanvasInput"
			:key="widget.id"
			@deleteWidget="(id) => (widgets = widgets.filter((e) => e.id != id))"
		>
			<component :is="widgetComponents[widget.type]" :data="widget.data"></component>
		</Widget>
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
