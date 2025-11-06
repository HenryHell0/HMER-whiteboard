<script setup>
import { toRef } from 'vue'
const { data } = defineProps(['data'])
const formula = toRef(() => data.formula)
</script>
<template>
	<div class="content">
		<vue-mathjax
			v-if="typeof formula == 'string'"
			:formula="`$$${formula}$$`"
			class="expression"
			:options="{ messageStyle: 'none' }"
		/>
		<div v-else class="loading">loading...</div>
	</div>
</template>
<style scoped>
.content {
	display: flex;
	justify-content: center;
	align-items: center;
	overflow: hidden;

	width: 100%;
	height: 100%;
}

.expression :deep(.MathJax) {
	display: flex;
	justify-content: center;
	align-items: center;
	/* width: 100%;
	height: 100%; */
	font-size: clamp(1em, 400vh, 400%);
	transform: translateY(-10px);
}

/* ? bruh idk */
/* Scale math text relative to widget */
/* .expression :deep(mjx-container) {
	display: flex !important;
	justify-content: center;
	align-items: center;
	width: 100%;
	height: 100%;
	font-size: max(100vh, 100vw);
	transform: scale(1.2);
 }*/

/* Optional: tweak inline <mjx-math> layout
.expression :deep(mjx-math) {
	width: auto !important;
	height: auto !important;
}*/
</style>
