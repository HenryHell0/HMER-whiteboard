import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useSessionStore = defineStore('session', () => {
	const currentStroke = ref([])
	const previousMousePos = { x: -1, y: -1 }
	const activeTool = ref('pen')
	const stopCanvasInput = ref(false)
	const heldWidgetId = ref('')

	return { currentStroke, previousMousePos, activeTool, stopCanvasInput, heldWidgetId }
})
