import { defineStore } from 'pinia'
import { computed, ref } from 'vue'

export const useSessionStore = defineStore('session', () => {
	const currentStroke = ref([])
	const currentPath = computed(() => {
		return (
			`M ${currentStroke.value[0].x},${currentStroke.value[0].y} ` +
			currentStroke.value
				.slice(1)
				.map((p) => `L ${p.x},${p.y}`)
				.join(' ')
		)
	})
	const previousMousePos = { x: -1, y: -1 }
	const activeTool = ref('pen')
	const heldWidgetId = ref('')

	const inputMode = ref('idle')
	// possible values:
	// 'idle' — no special input mode
	// 'drawing' — writing/drawing on canvas
	// 'widget' — moving a widget/on a widget sommehow

	return { currentStroke, currentPath, previousMousePos, activeTool, inputMode, heldWidgetId }
})
