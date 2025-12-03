<script setup lang="ts">
//TODO add more stuff to this directory with the buttons, setction etc. See chat's idea
import { onMounted, ref, toRef } from 'vue'
import { useSessionStore } from '@/stores/useSessionStore'
import { useDrawingOpacity } from '@/composables/useDrawingOpacity'
import { toolList } from '@/utils/drawingTools'
import { isThrowStatement } from 'typescript'
const sessionStore = useSessionStore()

// make elemnt transparent when drawing over it
const element = ref<HTMLElement | null>(null)

onMounted(() => {
	if (element.value) {
		for (const child of element.value.children) {
			if (!(child instanceof HTMLElement)) throw new Error('not an HTMLElement (wont happen)')
			useDrawingOpacity(ref(child))
		}
	}
})
</script>
<template>
	<div ref="element" class="toolbar-container">
		<!-- <div class="toolbar-section"  @mouseenter="sessionStore.inputMode = 'idle'">
		hey
		</div> -->

		<!-- ========== DRAWING TOOLS ============= -->
		<!-- later we will have this be its own little thing and add undo/redo and pan tools -->
		<div class="toolbar-section center-toolbar" @mouseenter="sessionStore.inputMode = 'idle'">
			<button
				v-for="tool in toolList"
				:key="tool"
				@click="sessionStore.activeTool = tool"
				:class="{ active: sessionStore.activeTool === tool }"
			>
				<img :src="`./assets/${tool}.svg`" draggable="false" />
			</button>
		</div>

		<!-- ===========feedback button ================-->
		<div class="toolbar-section" @mouseenter="sessionStore.inputMode = 'idle'">
			<button @click="" class="toolbar-button">
				<img :src="`./assets/feedback.svg`" draggable="false" />
			</button>
		</div>
	</div>
</template>
<style scoped>
.toolbar-container {
	width: 100%;
	display: flex;
	flex-direction: row;

	align-items: center;
	justify-content: space-between;
}

.toolbar-section {
	padding: 8px 8px;

	display: flex;
	justify-content: center;
	gap: 10px;

	background-color: white;
	border-radius: 1000px;
	box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
	z-index: 100;
	user-select: none;

}

.center-toolbar {
	margin: 0 auto;
}

img {
	width: 1.5em;
	height: 1.5em;
	fill: black;
	transition: rotate 0.2s ease;
	transform: scale(1.2);
}

button {
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

button:hover {
	transform: scale(1.1);
	background: rgb(226, 226, 226);
}

button.active {
	background-color: #c0c0c0;
	transform: scale(1.1);
}

button.active:hover {
	background-color: #c0c0c0;
	transform: scale(1.2);
}
</style>
