import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useWidgetStore = defineStore('widgets', () => {
	const widgets = ref([])
	const zIndexCount = ref(2)

	function addWidget(widgetData) {
		widgets.value.push(widgetData)
	}
	function getWidgetById(id) {
		const widget = widgets.value.find((e) => e.id === id)
		if (!widget) console.error('Widget not found in getWidgetById')
		return widget
	}

	function deleteWidget(id) {
		widgets.value = widgets.value.filter((e) => e.id != id)
	}

	return { widgets, getWidgetById, deleteWidget, addWidget, zIndexCount }
})
