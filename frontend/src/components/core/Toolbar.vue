<script setup>
import { useSessionStore } from '@/stores/useSessionStore'
import { toolList } from '@/utils/drawingTools'
const sessionStore = useSessionStore()
</script>
<template>
	<div class="toolbar">
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
