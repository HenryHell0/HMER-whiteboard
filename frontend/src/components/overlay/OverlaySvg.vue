<script setup>
const { tools } = defineProps(['tools'])
</script>
<template>
	<svg class="overlaySVG">
		<rect
			v-if="tools['selector'].isActive.value"
			class="selection-rect"
			:x="Math.min(tools['selector'].startX.value, tools['selector'].endX.value)"
			:y="Math.min(tools['selector'].startY.value, tools['selector'].endY.value)"
			:width="Math.abs(tools['selector'].endX.value - tools['selector'].startX.value)"
			:height="Math.abs(tools['selector'].endY.value - tools['selector'].startY.value)"
		/>
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
.selection-rect {
	stroke: black;
	fill: rgba(0, 0, 0, 0.1);
	stroke-width: 3;
	stroke-dasharray: 12 10;
	stroke-linecap: round;
	rx: 8;
	ry: 8;
	animation: ants 0.8s linear infinite;
}

@keyframes ants {
	to {
		stroke-dashoffset: -22; /* 12 + 10 */
	}
}
</style>
