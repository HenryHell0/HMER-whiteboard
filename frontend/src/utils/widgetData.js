import Expression from '@/components/widgets/Expression.vue'
import Graph from '@/components/widgets/graph/Graph.vue'
import { useWidgetStore } from '@/stores/useWidgetStore'

export const widgetComponents = {
	Expression: Expression,
	Graph: Graph,
}

export class WidgetData {
	constructor(x, y, width, height) {
		this.x = x
		this.y = y
		this.width = width
		this.height = height
		this.id = crypto.randomUUID()
		this.zIndex = 1
	}
}

export class ExpressionData extends WidgetData {
	constructor(x, y, width, height, latex) {
		super(x, y, width, height)
		this.type = 'Expression'
		this.latex = latex

		const self = this
		this.toolbarButtons = [
			{
				name: 'graph',
				icon: 'graph',
				onClick: function () {
					const widgetStore = useWidgetStore()
					widgetStore.addWidget(
						new GraphData(self.x, self.y, self.width / 1.5, self.width / 1.5, [self.latex]),
					) // self.width twice is intentional
					widgetStore.deleteWidget(self.id)
				},
			},
		]
	}
}

export class GraphData extends WidgetData {
	constructor(x, y, width, height, latexExpressions = []) {
		super(x, y, width, height)
		this.type = 'Graph'
		this.graphs = []
		this.calculator

		for (const [i, latex] of latexExpressions.entries()) {
			this.graphs[i] = { latex, color: '#000000', id: crypto.randomUUID() }
		}
	}
	addGraph(latex) {
		const graph = { latex, color: '#000000', id: crypto.randomUUID() }
		this.graphs.push(graph)
		this.calculator.setExpression({ latex: graph.latex, color: graph.color, id: graph.id })
	}
	deleteGraph(graph) {
		this.graphs = this.graphs.filter((e) => e.id != graph.id)
		this.calculator.removeExpression({ id: graph.id })
	}
}
