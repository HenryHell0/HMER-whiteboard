import { ref } from 'vue'
export const stopCanvasInput = ref(false)

export function useMouseDelta() {
	// this also updates stopCanvasInput because thats all I'm usin it for
	var startX = 0
	var startY = 0
	const deltaX = ref(0)
	const deltaY = ref(0)
	var moving = ref(false)

	function start(event) {
		moving.value = true
		stopCanvasInput.value = true

		startX = event.clientX
		startY = event.clientY
		deltaX.value = 0
		deltaY.value = 0
	}
	function move(event) {
		// returns true if succesful and false if not dragging/clicking :)
		if (!moving.value || event.buttons !== 1) return false

		deltaX.value = event.clientX - startX
		deltaY.value = event.clientY - startY

		return true
	}
	function end() {
		moving.value = false
		stopCanvasInput.value = false
	}

	return { deltaX, deltaY, start, move, end, moving }
}

export function useDrag(baseX, baseY) {
	const { start, move, end, deltaX, deltaY, moving: dragging } = useMouseDelta()

	const elementX = ref(baseX)
	const elementY = ref(baseY)
	let initialElementX
	let initialElementY

	function dragStart(event) {
		start(event)

		initialElementX = elementX.value
		initialElementY = elementY.value
	}

	function dragMove(event) {
		if (!move(event)) return

		elementX.value = initialElementX + deltaX.value
		elementY.value = initialElementY + deltaY.value
	}

	function dragEnd() {
		end()
	}

	return { dragStart, dragMove, dragEnd, dragging, x: elementX, y: elementY }
}

export function useResize(baseWidth, baseHeight) {
	const { start, move, end, deltaX, deltaY, moving: resizing } = useMouseDelta()
	const elementWidth = ref(baseWidth)
	const elementHeight = ref(baseHeight)
	let initialWidth
	let initialHeight

	function resizeStart(event) {
		start(event)
		initialWidth = elementWidth.value
		initialHeight = elementHeight.value
	}

	function resizeMove(event) {
		if (!move(event)) return

		elementWidth.value = initialWidth + deltaX.value
		elementHeight.value = initialHeight + deltaY.value
	}

	function resizeEnd() {
		end()
	}

	return {
		resizeStart,
		resizeMove,
		resizeEnd,
		width: elementWidth,
		height: elementHeight,
		resizing,
	}
}
