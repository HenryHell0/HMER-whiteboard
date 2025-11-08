<script setup>
import Widget from '@/components/core/widget/Widget.vue'
import { useWidgetStore } from '@/stores/useWidgetStore'
import { widgetComponents } from '@/utils/widgets'
import { addTestWidgets } from '@/utils/debug'

addTestWidgets()

const widgetStore = useWidgetStore()
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
