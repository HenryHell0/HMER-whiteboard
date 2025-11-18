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
						new GraphData(self.x, self.y, self.width, self.width, [self]),
					) // self.width twice is intentional
					widgetStore.deleteWidget(self.id)
				},
			},
		]
	}
}

export class GraphData extends WidgetData {
	constructor(x, y, width, height, expressions) {
		super(x, y, width, height)
		this.type = 'Graph'
		this.expressions = []
		this.calculator

		for (const expression of expressions) {
			this.expressions.push(expression)
		}
	}
	addExpression(expression) {
		this.expressions.push(expression)
		const graph = { latex: expression.latex, color: '#000000', id: expression.id }
		this.calculator.setExpression({ latex: graph.latex, color: graph.color, id: graph.id })
	}
	deleteExpression(expression) {
		const widgetStore = useWidgetStore()

		this.expressions = this.expressions.filter((e) => e.id != expression.id)
		this.calculator.removeExpression({ id: expression.id })

		if (this.expressions.length  == 0 ) {
			widgetStore.deleteWidget(this.id)
		}
	}
}
