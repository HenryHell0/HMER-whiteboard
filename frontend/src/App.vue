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

import { widgetComponents } from './utils/widgets'
import { toolList, tools } from './utils/drawingTools'

import { DEBUG, baseDebug } from './utils/debug'

import { useWidgetStore } from './stores/useWidgetStore'
import { useCanvasStore } from './stores/useCanvasStore'
import { useSessionStore } from './stores/useSessionStore'
const widgetStore = useWidgetStore()
const canvasStore = useCanvasStore()
const sessionStore = useSessionStore()

baseDebug()

function SVGMouseDown(event) {
	if (sessionStore.inputMode != 'idle') return
	sessionStore.inputMode = 'drawing'

	tools[sessionStore.activeTool].onDown?.(event)
}

function SVGMouseMove(event) {
	if (sessionStore.inputMode != 'drawing') return
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
	if (sessionStore.inputMode != 'drawing') return
	sessionStore.inputMode = 'idle'

	tools[sessionStore.activeTool].onUp?.(event)
}
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
			<Widget v-for="widget in widgetStore.widgets" :key="widget.id" :id="widget.id">
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
