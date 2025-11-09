<script setup>
import Widget from '@/components/core/widgetTemplate/Widget.vue'
import { useWidgetStore } from '@/stores/useWidgetStore'
import { widgetComponents } from '@/utils/widgetData'
import { addTestWidgets } from '@/utils/debug'

const widgetStore = useWidgetStore()

addTestWidgets()
</script>
<template>
	<div class="widget-container">
		<Widget v-for="widget in widgetStore.widgets" :key="widget.id" :id="widget.id">
			<component :is="widgetComponents[widget.type]" :id="widget.id"></component>
		</Widget>
	</div>
</template>
<style scoped>
.widget-container {
	isolation: isolate;
}
</style>
