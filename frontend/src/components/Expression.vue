<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'

var element = ref(null)
const props = defineProps({
	formula: undefined,
	x: Number,
	y: Number,
	width: Number,
	height: Number,
	id: String,
})
const isDragging = defineModel('isDragging')

var x = ref(props.x)
var y = ref(props.y)
var width = ref(props.width)
var height = ref(props.height)
const elementStyles = computed(() => {
	return {
		left: x.value.toString() + 'px',
		top: y.value.toString() + 'px',
		width: width.value.toString() + 'px',
		height: height.value.toString() + 'px',
	}
})

var offsetX
var offsetY

function mouseDown(event) {
	isDragging.value = true

	const rect = element.value.getBoundingClientRect()

	offsetX = event.clientX - rect.left
	offsetY = event.clientY - rect.top
}

function mouseMove(event) {
	if (!isDragging.value || event.buttons !== 1) return

	x.value = event.clientX - offsetX
	y.value = event.clientY - offsetY
}

function mouseUp() {
	isDragging.value = false
}

onMounted(() => {
	document.addEventListener('mousemove', mouseMove)
	document.addEventListener('mouseup', mouseUp)
})

onUnmounted(() => {
	document.removeEventListener('mousemove', mouseMove)
	document.removeEventListener('mouseup', mouseUp)
})

// TODO draggability & resizing!!!
</script>
<template>
	<div ref="element" class="template" :style="elementStyles">
		<div class="toolbar" @mousedown="mouseDown">
			<div class="title">Expression</div>
			<div class="x-button-container">
				<img
					src="./../../assets/x.svg"
					@click="$emit('removeExpression', id)"
					class="x-button"
					draggable="false"
				/>
			</div>
		</div>

		<div class="content">
			<vue-mathjax
				v-if="typeof formula == 'string'"
				:formula="`$$${formula}$$`"
				class="expression"
			/>
			<div v-else class="loading">loading...</div>
		</div>
	</div>
</template>
<style scoped>
.template {
	user-select: none;
	z-index: 2;
	position: absolute;

	display: flex;
	flex-direction: column;
	overflow: hidden;

	/* border: 0.1em solid gray; */
	border-radius: 0.5em;
	background: rgb(250, 250, 250);
	box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);

	pointer-events: fill;
}

.toolbar {
	border-top-left-radius: inherit;
	border-top-right-radius: inherit;
	background-color: rgb(240, 240, 240);
	flex-shrink: 0;

	display: flex;
	flex-direction: row;

	cursor: move;
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

.content {
	flex: 1;
	display: flex;
	justify-content: center;
	align-items: center;
	overflow: hidden;
}

/* .loading {
	width: 100%;
	height: 100%;
	display: flex;
	justify-content: center;
	align-items: center;
	font-size: clamp(0.5em, 100vh, 1000em);
} */

.expression :deep(.MathJax) {
	width: 100%;
	height: 100%;
	display: flex;
	justify-content: center;
	align-items: center;
	font-size: clamp(0.5em, 200vh, 900%);

	transform: translateY(-20px);
}
</style>
