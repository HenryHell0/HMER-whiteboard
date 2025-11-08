<script setup>
import { ref, onMounted } from 'vue'
import { useWidgetStore } from '@/stores/useWidgetStore'
import { useSessionStore } from '@/stores/useSessionStore'
import Desmos from 'desmos'
//!!!!!!!!!!!!!!!!!!!!!!!!!!! refactor to use ID and whatchamacallit

const widgetStore = useWidgetStore()
const sessionStore = useSessionStore()

const props = defineProps(['data']) //* will be defineModel later casue we will be removing some of them
const data = props.data //! not reactive
let graphs = ref(data.graphs)
const graphElement = ref(null)
var calculator

function deleteGraph(graph) {
	graphs.value = graphs.value.filter((e) => e.id != graph.id)
	calculator.removeExpression({ id: graph.id })
}

function addGraph(latex) {
	const graph = { latex, color: '#000000', id: crypto.randomUUID() }
	graphs.value.push(graph)
	calculator.setExpression({ latex: graph.latex, color: graph.color, id: graph.id })
}

async function importExpression() {
	if (!sessionStore.heldWidgetId) return
	const heldWidget = widgetStore.widgets.find((e) => e.id === sessionStore.heldWidgetId)
	if (!heldWidget) return

	// delete expression
	widgetStore.widgets = widgetStore.widgets.filter((e) => e.id != heldWidget.id)

	// add it
	addGraph(await heldWidget.data.latex)
}

onMounted(() => {
	// make da thing
	calculator = Desmos.GraphingCalculator(graphElement.value, {
		expressions: false,
		border: false,
	})

	// Optional: Set an initial expression
	for (let graph of graphs.value) {
		calculator.setExpression({
			// could shorten this to just "graph" :)
			latex: graph.latex,
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
	<div class="content" @mouseup="importExpression">
		<div class="no-graphs-overlay" v-if="graphs.length == 0">
			<div class="no-graphs-text">
				Nothing to graph! <br />Drag something here to graph it!
			</div>
		</div>

		<div ref="graphElement" class="graph"></div>

		<div class="expressionList" v-if="graphs.length > 0">
			<div class="expression-container" v-for="graph in graphs" :key="graph.id">
				<vue-mathjax
					:formula="`$$${graph.latex}$$`"
					class="typeset-expression"
					:options="{ messageStyle: 'none' }"
					@click="deleteGraph(graph)"
				/>
			</div>
		</div>
	</div>
</template>
<style scoped>
.content {
	position: relative;
	display: flex;
	flex-direction: column;
	align-items: flex-start;

	width: 100%;
	height: 100%;
}

.graph {
	width: 100%;
	height: 100%;

	border-bottom: 1px solid rgb(235, 235, 235);
}

.expressionList {
	margin: 0.2em;
	display: flex;
	flex-direction: row;
	gap: 0.3em;
	position: relative;
	width: 100%;
	min-height: 0px;
}

.expression-container {
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

.no-graphs-overlay {
	z-index: 2;
	position: absolute;
	width: 100%;
	height: 100%;
	display: flex;
	align-items: center;
	justify-content: center;
	background-color: rgba(255, 255, 255, 0.3);
	backdrop-filter: blur(5px);
}

.no-graphs-text {
	width: 33%;
	text-align: center;
}
</style>
