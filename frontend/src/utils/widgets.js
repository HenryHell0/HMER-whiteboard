import { ref } from 'vue'

export const widgets = ref([])
export const stopCanvasInput = ref(false)

export class WidgetData {
	constructor(x, y, width, height, data) {
		this.x = x
		this.y = y
		this.width = width
		this.height = height
		this.id = crypto.randomUUID()
		this.data = data
		this.type = this.data.type
	}
}

export class ExpressionData {
	constructor(formula) {
		this.type = 'Expression'
		this.formula = formula
	}
}
