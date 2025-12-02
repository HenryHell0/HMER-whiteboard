<script setup lang="ts">
//TODO add more stuff to this directory with the buttons, setction etc. See chat's idea
import { ref } from 'vue'
import { useSessionStore } from '@/stores/useSessionStore'
import { useDrawingOpacity } from '@/composables/useDrawingOpacity'
import { toolList } from '@/utils/drawingTools'
const sessionStore = useSessionStore()

// make elemnt transparent when drawing over it
const element = ref<HTMLElement | null>(null)
useDrawingOpacity(element)
</script>
<template>
	<div ref="element" class="toolbar" @mouseenter="sessionStore.inputMode = 'idle'">
		<!-- todo split into sections and improve scalability for undo, redo, etc. -->
		<!-- drawing tool buttons - later this will be for tool in drawingToolList, and we will also have panTools and undoRedoTools -->
		<button
			v-for="tool in toolList"
			:key="tool"
			@click="sessionStore.activeTool = tool"
			:class="{ active: sessionStore.activeTool === tool }"
			class="toolbar-button"
		>
			<img :src="`./assets/${tool}.svg`" class="toolbar-image" draggable="false" />
		</button>
	</div>
</template>
<style scoped>
.toolbar {
	position: absolute;
	top: 10px;
	left: 50%;
	transform: translateX(-50%);
	display: flex;
	justify-content: center;
	gap: 10px;
	padding: 10px 10px;
	background-color: white;
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
	/* background-color: #eee; */
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
</style>
