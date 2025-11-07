<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { useDrag, useResize } from '@/composables/useDraggables'
import { stopCanvasInput } from '@/composables/useDraggables'
import { useWidgetStore } from '@/stores/useWidgetStore'
import { useSessionStore } from '@/stores/useSessionStore'

const widgetStore = useWidgetStore()
const sessionStore = useSessionStore()

var element = ref(null)
const props = defineProps({
	x: Number,
	y: Number,
	width: Number,
	height: Number,
	id: String,
	data: Object,
})
const zIndex = ref(2)
//! fix
watch(stopCanvasInput, () => {
	sessionStore.stopCanvasInput = stopCanvasInput.value
})

const { dragStart, dragMove, dragEnd, dragging, x, y } = useDrag(props.x, props.y)
const { resizeStart, resizeMove, resizeEnd, width, height, resizing } = useResize(
	props.width,
	props.height,
)

const classes = computed(() => {
	return {
		dragging: dragging.value,
		resizing: resizing.value,
	}
})

const styles = computed(() => {
	return {
		left: x.value.toString() + 'px',
		top: y.value.toString() + 'px',
		width: width.value.toString() + 'px',
		height: height.value.toString() + 'px',
		zIndex: zIndex.value.toString(),
	}
})

function toolbarClicked(event) {
	dragStart(event)

	sessionStore.heldWidgetId = props.id

	widgetStore.zIndexCount++
	zIndex.value = widgetStore.zIndexCount
}

function toolBarMove(event) {
	if (!dragMove(event)) return
	element.value.style.pointerEvents = 'none'
}

function toolbarReleased() {
	dragEnd()

	// check if user is over the toolbar
	if (!element.value) return
	element.value.style.pointerEvents = 'fill'

	sessionStore.heldWidgetId = ''
}

// draggability stuff
onMounted(() => {
	document.addEventListener('mousemove', toolBarMove)
	document.addEventListener('mouseup', toolbarReleased)

	document.addEventListener('mousemove', resizeMove)
	document.addEventListener('mouseup', resizeEnd)
})
onUnmounted(() => {
	document.removeEventListener('mousemove', dragMove)
	document.removeEventListener('mouseup', dragEnd)

	document.removeEventListener('mousemove', resizeMove)
	document.removeEventListener('mouseup', resizeEnd)
})
</script>
<template>
	<div ref="element" class="template" :class="classes" :style="styles">
		<div
			class="toolbar"
			@mousedown="toolbarClicked"
			:style="{ cursor: dragging ? 'grabbing' : 'grab' }"
		>
			<div class="title">{{ data.type }}</div>
			<div class="x-button-container">
				<img
					src="/assets/x.svg"
					@click="$emit('deleteWidget', id)"
					class="x-button"
					draggable="false"
				/>
			</div>
		</div>

		<slot></slot>

		<img
			class="resizer"
			@mousedown="resizeStart"
			:src="'./assets/resize.svg'"
			draggable="false"
		/>
	</div>
</template>
<style scoped>
.template {
	/*? change this to work with future graphs. this should be in expression prolly */
	user-select: none;
	z-index: 2;
	position: absolute;

	display: flex;
	flex-direction: column;
	overflow: hidden;

	border-radius: 0.5em;
	background: rgb(250, 250, 250);
	box-shadow: 0px 2px 10px rgba(0, 0, 0, 0.2);

	pointer-events: fill;
}

.dragging {
	box-shadow: 0px 12px 20px rgba(0, 0, 0, 0.4);
	opacity: 80%;
}

.resizing {
	opacity: 80%;
}

.toolbar {
	border-top-left-radius: inherit;
	border-top-right-radius: inherit;
	background-color: rgb(240, 240, 240);
	flex-shrink: 0;

	display: flex;
	flex-direction: row;

	cursor: grab;
}

.title {
	color: rgb(29, 29, 29);
	font-size: 80%;
	padding: 0.5em;
	flex-grow: 2;
}

.x-button-container {
	display: flex;
	align-items: center;
	justify-content: center;
}

.x-button {
	height: 100%;
	box-sizing: border-box;
	padding: 0.1em;
	border-radius: 100px;
	transition: background 0.3s ease;
	cursor: pointer;
}

.x-button:hover {
	background-color: darkgray;
}

.resizer {
	position: absolute;
	right: 0;
	bottom: 0;
	width: 1em;
	height: 1em;
	cursor: se-resize;
	fill: black;
	z-index: 2;
}
</style>
