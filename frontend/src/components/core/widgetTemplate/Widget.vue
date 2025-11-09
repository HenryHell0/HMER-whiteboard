<script setup>
import { ref, toRef, computed, onMounted, onUnmounted } from 'vue'

import { useDrag, useResize } from '@/composables/useDraggables'
import { useDrawingOpacity } from '@/composables/useDrawingOpacity'

import { useWidgetStore } from '@/stores/useWidgetStore'
import { useSessionStore } from '@/stores/useSessionStore'
import WidgetToolbar from './WidgetToolbar.vue'

const widgetStore = useWidgetStore()
const sessionStore = useSessionStore()

const props = defineProps({ id: String })
const widget = widgetStore.getWidgetById(props.id)

var element = ref(null)
useDrawingOpacity(element)

const { dragStart, dragMove, dragEnd, isDragging } = useDrag(toRef(widget, 'x'), toRef(widget, 'y'))
const { resizeStart, resizeMove, resizeEnd, isResizing } = useResize(toRef(widget, 'width'), toRef(widget, 'height'))

const classes = computed(() => {
	return {
		dragging: isDragging.value,
		resizing: isResizing.value,
	}
})
const styles = computed(() => {
	return {
		left: widget.x.toString() + 'px',
		top: widget.y.toString() + 'px',
		width: widget.width.toString() + 'px',
		height: widget.height.toString() + 'px',
		zIndex: widget.zIndex.toString(),
	}
})

function toolbarClicked(event) {
	dragStart(event)

	sessionStore.heldWidgetId = widget.id

	// update zindex
	widgetStore.zIndexCount++
	widget.zIndex = widgetStore.zIndexCount
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

	// reset widget ID and reset mode
	sessionStore.heldWidgetId = ''
}

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
		<WidgetToolbar @toolbarClicked="toolbarClicked" :isDragging :widget></WidgetToolbar>

		<slot></slot>

		<img class="resizer" @mousedown="resizeStart" :src="'./assets/resize.svg'" draggable="false" />
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
