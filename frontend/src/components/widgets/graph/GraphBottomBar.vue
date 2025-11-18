<script setup>
import { useWidgetStore } from '@/stores/useWidgetStore'
import Desmos from 'desmos'

const props = defineProps({
	id: String,
	calculator: Desmos.GraphingCalculator,
})
const widgetStore = useWidgetStore()
const widget = widgetStore.getWidgetById(props.id)
</script>
<template>
	<div class="expressionList" v-if="widget.graphs.length > 0">
		<div class="expression-container" v-for="graph in widget.graphs" :key="graph.id">
			<vue-mathjax
				:formula="`$$${graph.latex}$$`"
				class="typeset-expression"
				:options="{ messageStyle: 'none' }"
				@click="widget.deleteGraph(graph)"
			/>
		</div>
	</div>
</template>

<style scoped>
.expressionList {
	margin: 0.5em;
	margin-left: 0.25em;
	display: flex;
	flex-direction: row;
	gap: 0.3em;
	position: relative;
	width: 100%;
	min-height: 0px;
}

.expression-container {
	box-sizing: border-box;

	display: flex;
	align-items: center;
	justify-content: center;
	position: relative;
}

.typeset-expression {
	background: rgb(245, 245, 245);
	font-size: 1em;
	padding: 0.3em;
	border: 2px solid rgba(43, 174, 255, 0.5);
	border-radius: 0.5em;
	transition: background 0.1s ease-in-out;
}

.typeset-expression:hover {
	background-color: lightgray;
}

.typeset-expression:hover::before {
	content: ''; /* Required for pseudo-elements */
	position: absolute;
	top: 50%; /* Center vertically */
	left: 0;
	right: 0;
	height: 2px;
	border-radius: 1000px;
	width: calc(100% - 10px);
	background-color: black;
	transform: translateX(5px);
}
</style>
