import { defineStore } from 'pinia'
import { ref } from 'vue'

interface pathElement {
	d: string
	id: string
}

export const useCanvasStore = defineStore('canvas', () => {
	const paths = ref<pathElement[]>([])

	return { paths }
})
