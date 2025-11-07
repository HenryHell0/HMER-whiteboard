import Expression from '@/components/widgets/Expression.vue'
import Graph from '@/components/widgets/Graph.vue'

export const widgetComponents = {
	Expression: Expression,
	Graph: Graph,
}

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
	constructor(latex) {
		this.type = 'Expression'
		this.latex = latex
	}
}

export class GraphData {
	constructor(latexExpressions = []) {
		this.type = 'Graph'
		this.graphs = []

		for (const [i, latex] of latexExpressions.entries()) {
			this.graphs[i] = { latex, color: '#000000', id: crypto.randomUUID() }
		}
		// TODO add viewbox, etc
	}
}
