import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useCanvasStore = defineStore('canvas', () => {
	const paths = ref([])

	return { paths }
})
