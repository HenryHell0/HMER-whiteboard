<script setup lang="ts">
import { useWidgetStore } from '@/stores/useWidgetStore'
import { useSessionStore } from '@/stores/useSessionStore'
import GraphBottomBar from './GraphBottomBar.vue'
import GraphContent from './GraphContent.vue'
import { ExpressionData, GraphData } from '@/utils/widgetData'

const widgetStore = useWidgetStore()
const sessionStore = useSessionStore()

const props = defineProps<{
	id: string
}>()
const widget = widgetStore.getWidgetById(props.id)

async function importExpression() {
	if (!sessionStore.heldWidgetId) return
	if (!(widget instanceof GraphData)) throw new Error('this widget is not a graph!!! aah!')
	const heldWidget = widgetStore.getWidgetById(sessionStore.heldWidgetId)
	if (!(heldWidget instanceof ExpressionData)) return
	// add it

	widget.addExpression(heldWidget)

	// delete expression
	widgetStore.deleteWidget(heldWidget.id)
}
</script>
<template>
	<div class="content" @mouseup="importExpression">
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
</style>
