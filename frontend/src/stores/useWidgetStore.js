import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useWidgetStore = defineStore('widgets', () => {
	const widgets = ref([])
	const zIndexCount = ref(2)

	function getWidgetById(id) {
		return widgets.value.find((e) => e.id === id)
	}

	function deleteWidget(id) {
		widgets.value = widgets.value.filter((e) => e.id != id)
	}

	return { widgets, getWidgetById, deleteWidget, zIndexCount }
})
