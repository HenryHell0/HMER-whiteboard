function serializeSVG(svgElement) {
	// try to fix to get this stuff working lololol
	for (let path of svgElement.children) {
		path.style.stroke = getComputedStyle(path).stroke
		path.style.fill = getComputedStyle(path).fill
		path.style.strokeWidth = getComputedStyle(path).strokeWidth
	}

	const serializer = new XMLSerializer()
	return serializer.serializeToString(svgElement)
}

export function cropCanvas(finalCanvas, originalCanvas, x, y, w, h) {
	finalCanvas.width = w
	finalCanvas.height = h
	const finalCtx = finalCanvas.getContext('2d')

	finalCtx.drawImage(originalCanvas, x, y, w, h, 0, 0, w, h)
}

export function downloadCanvasPNG(canvas) {
	const URL = canvas.toDataURL()
	const downloadLinkElement = document.createElement('a')
	downloadLinkElement.href = URL
	downloadLinkElement.download = 'canvas-screenshot.png'
	document.body.appendChild(downloadLinkElement)
	downloadLinkElement.click()
	document.body.removeChild(downloadLinkElement)
}

export async function svgToCanvas(id) {
	return new Promise((resolve, reject) => {
		const svgElement = document.getElementById(id)
		// ! fix styles
		// TODO fix styles
		const svgString = serializeSVG(svgElement)
		const svgRect = svgElement.getBoundingClientRect()

		const canvas = document.createElement('canvas')
		const ctx = canvas.getContext('2d')

		const blob = new Blob([svgString], { type: 'image/svg+xml' })
		const blobUrl = URL.createObjectURL(blob)

		const img = new Image()
		img.src = blobUrl
		img.width = svgRect.width
		img.height = svgRect.height
		img.onerror = reject
		img.onload = () => {
			// draw image to canvas
			canvas.width = img.width
			canvas.height = img.height
			ctx.fillStyle = 'white'
			ctx.fillRect(0, 0, img.width, img.height)
			ctx.drawImage(img, 0, 0)
			URL.revokeObjectURL(img.src)

			resolve(canvas)
		}
	})
}

async function canvasToBlob(canvas) {
	return new Promise((resolve) => {
		canvas.toBlob(resolve, 'image/png')
	})
}

export async function recognizeCanvas(canvas) {
	const blob = await canvasToBlob(canvas)
	const formData = new FormData()
	formData.append('img', blob, 'image.png')

	const response = await fetch('/api/predict', {
		method: 'POST',
		body: formData,
	})
	const latex = await response.text()

	return latex
}
