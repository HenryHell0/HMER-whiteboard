<script setup lang="ts">
import { selector } from '@/utils/drawingTools'
</script>
<template>
	<svg class="overlaySVG">
		<rect
			class="selection-rect"
			v-if="selector.isActive"
			:x="selector.x"
			:y="selector.y"
			:width="selector.width"
			:height="selector.height"
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
