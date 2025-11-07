<script setup>
import SelectionRect from './SelectionRect.vue'

const { tools } = defineProps(['tools'])
</script>
<template>
	<svg class="overlaySVG">
		<SelectionRect :tools="tools"></SelectionRect>
	</svg>
</template>
<style scoped>
.overlaySVG {
	position: absolute;
	top: 0;
	left: 0;
	width: 100vw;
	height: 100vh;
	pointer-events: none;
	z-index: 1;
}
</style>
