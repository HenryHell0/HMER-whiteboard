<script setup>
import Desmos from 'desmos'
import { onMounted, ref } from 'vue'
import { useWidgetStore } from '@/stores/useWidgetStore'

const props = defineProps({
	id: String,
})
const graphElement = ref(null)
const widgetStore = useWidgetStore()
const widget = widgetStore.getWidgetById(props.id)

onMounted(async () => {
	// make da thing
	widget.calculator = Desmos.GraphingCalculator(graphElement.value, {
		expressions: false,
		border: false,
	})

	// Optional: Set an initial expression
	for (let graph of widget.graphs) {
		widget.calculator.setExpression({
			// could shor.this to just "graph" :) (see desmos api docs)
			latex: await graph.latex,
			color: graph.color,
			id: graph.id,
		})
	}

	// see this
	// calculator.setMathBounds({
	// 	left: 0,
	// 	right: 10,
	// 	bottom: 0,
	// 	top: 10,
	// })
})
</script>
<template>
	<div ref="graphElement" class="graph"></div>
</template>
<style scoped>
.graph {
	width: 100%;
	height: 100%;

	border-bottom: 1px solid rgb(235, 235, 235);
}
</style>
