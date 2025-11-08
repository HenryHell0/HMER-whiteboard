import { watch, onUnmounted } from 'vue'
import { useSessionStore } from '@/stores/useSessionStore'

export function useDrawingOpacity(element, options = {}) {
	const sessionStore = useSessionStore()
	const {
		drawOpacity = 0.8,
		drawPointerEvents = 'none',
		normalOpacity = 1,
		normalPointerEvents = 'auto',
	} = options

	function changeDrawingOpacity(event) {
		if (!element.value) return
		if (sessionStore.inputMode !== 'drawing') return

		const bbox = element.value.getBoundingClientRect()
		if (
			event.clientX > bbox.left &&
			event.clientX < bbox.right &&
			event.clientY > bbox.top &&
			event.clientY < bbox.bottom
		) {
			element.value.style.opacity = drawOpacity.toString()
		} else {
			element.value.style.opacity = normalOpacity.toString()
		}
	}

	watch(
		() => sessionStore.inputMode,
		(mode) => {
			if (!element.value) return
			if (mode === 'drawing') {
				document.addEventListener('mousemove', changeDrawingOpacity)
				element.value.style.pointerEvents = drawPointerEvents
			} else {
				document.removeEventListener('mousemove', changeDrawingOpacity)
				element.value.style.pointerEvents = normalPointerEvents
				element.value.style.opacity = normalOpacity.toString()
			}
		},
		{ immediate: true },
	)

	onUnmounted(() => {
		document.removeEventListener('mousemove', changeDrawingOpacity)
	})
}
