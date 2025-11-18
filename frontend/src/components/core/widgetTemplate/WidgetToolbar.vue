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

		<div class="button-container" v-if="widget.toolbarButtons">
			<img
				class="toolbar-button"
				v-for="(button, i) in widget.toolbarButtons"
				:key="i"
				:src="`./assets/${button.icon}.svg`"
				@click="button.onClick"
				draggable="false"
			/>
		</div>

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
	width: 100%;
	position: relative;

	display: flex;
	flex-direction: row;
	justify-content: space-between; /* NEW */

	cursor: grab;
}

.title {
	color: rgb(29, 29, 29);
	font-size: 100%;
	padding: 0.5em;
	align-self: flex-start;
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

.button-container {
	position: absolute;
	left: 50%;
	transform: translateX(-50%);

	box-sizing: border-box;
	height: 100%;
	padding-top: 2px;
	padding-bottom: 2px;
}

.toolbar-button {
	border: none;
	border-radius: 0.4em;

	height: 100%;
	min-height: 10px;
	aspect-ratio: 1 / 1;

	cursor: pointer;

	background-color: rgb(201, 201, 201);
	box-shadow: 0 0 4px rgb(243, 243, 243);
	transition: background ease-in-out 0.1s;
}

.toolbar-button:hover {
	background-color: rgb(172, 172, 172);
	box-shadow: 0 0 6px rgb(192, 192, 192);
}
</style>
