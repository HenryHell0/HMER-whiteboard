<script setup>
import { useWidgetStore } from '@/stores/useWidgetStore'
const widgetStore = useWidgetStore()
const { isDragging, widget } = defineProps(['isDragging', 'widget'])
</script>
<template>
	<div
		class="toolbar"
		@mousedown="(e) => $emit('toolbarClicked', e)"
		:style="{ cursor: isDragging ? 'grabbing' : 'grab' }"
	>
		<div class="title">{{ widget.type }}</div>
		<div class="x-button-container">
			<img src="/assets/x.svg" @click="widgetStore.deleteWidget(widget.id)" class="x-button" draggable="false" />
		</div>
	</div>
</template>
<style scoped>
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
</style>
