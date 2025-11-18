<script setup>
import { useWidgetStore } from '@/stores/useWidgetStore'
import { useSessionStore } from '@/stores/useSessionStore'
import GraphBottomBar from './GraphBottomBar.vue'
import GraphContent from './GraphContent.vue'

const widgetStore = useWidgetStore()
const sessionStore = useSessionStore()

const props = defineProps({ id: String })
const widget = widgetStore.getWidgetById(props.id)

async function importExpression() {
	if (!sessionStore.heldWidgetId) return
	const heldWidget = widgetStore.getWidgetById(sessionStore.heldWidgetId)
	if (heldWidget.type == 'Graph') return

	// delete expression
	widgetStore.deleteWidget(heldWidget.id)

	// add it
	widget.addGraph(await heldWidget.latex)
}
</script>
<template>
	<div class="content" @mouseup="importExpression">
		<div class="no-graphs-overlay" v-if="widget.graphs.length == 0">
			<div class="no-graphs-text">Nothing to graph! <br />Drag something here to graph it!</div>
		</div>
		<GraphContent :id="props.id"></GraphContent>
		<GraphBottomBar :id="props.id"></GraphBottomBar>
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
