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
	if (heldWidget.type != 'Expression') return

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
