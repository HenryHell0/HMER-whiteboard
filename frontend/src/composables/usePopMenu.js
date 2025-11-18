// /src/composables/usePopMenu.js
import { ref, onMounted, onBeforeUnmount, nextTick } from 'vue'

export function usePopMenu() {
	const isOpen = ref(false)
	const activatorRef = ref(null)
	const menuRef = ref(null)

	const position = ref({ top: 0, left: 0 })

	function toggle() {
		isOpen.value = !isOpen.value
		if (isOpen.value) positionMenu()
	}

	function close() {
		isOpen.value = false
	}

	function onClickOutside(e) {
		if (
			activatorRef.value &&
			!activatorRef.value.contains(e.target) &&
			menuRef.value &&
			!menuRef.value.contains(e.target)
		) {
			close()
		}
	}

	function positionMenu() {
		nextTick(() => {
			const act = activatorRef.value
			const menu = menuRef.value
			if (!act || !menu) return

			const aRect = act.getBoundingClientRect()
			const mRect = menu.getBoundingClientRect()

			let top = aRect.bottom + 4
			let left = aRect.left

			// prevent going off right edge
			if (left + mRect.width > window.innerWidth) {
				left = window.innerWidth - mRect.width - 8
			}

			// prevent going off bottom
			if (top + mRect.height > window.innerHeight) {
				top = aRect.top - mRect.height - 4
			}

			// prevent going off left
			if (left < 0) left = 4

			// prevent going off top
			if (top < 0) top = 4

			position.value = { top, left }
		})
	}

	// Reposition on scroll/resize
	function forceRecalc() {
		if (isOpen.value) positionMenu()
	}

	onMounted(() => {
		document.addEventListener('mousedown', onClickOutside)
		window.addEventListener('scroll', forceRecalc, true)
		window.addEventListener('resize', forceRecalc)

		// Recalculate on every frame if you want super reactive positioning:
		const observer = new MutationObserver(forceRecalc)
		observer.observe(document.body, { attributes: true, childList: true, subtree: true })
	})

	onBeforeUnmount(() => {
		document.removeEventListener('mousedown', onClickOutside)
		window.removeEventListener('scroll', forceRecalc)
		window.removeEventListener('resize', forceRecalc)
	})

	return {
		isOpen,
		position,
		activatorRef,
		menuRef,
		toggle,
		close,
		positionMenu,
	}
}
