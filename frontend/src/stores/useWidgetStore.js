import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useWidgetStore = defineStore('widgets', () => {
	const widgets = ref([])
	const zIndexCount = ref(2)

	return { widgets, zIndexCount }
})
