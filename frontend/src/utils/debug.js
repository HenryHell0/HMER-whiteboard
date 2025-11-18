import { ExpressionData, GraphData } from './widgetData'
import { useWidgetStore } from '@/stores/useWidgetStore'

export const DEBUG = {
	createTestExpression: true,
	createTestGraph: true,
	logMouseMovements: false,
	downloadPNG: false,
	logLatex: true,
}

export function addTestWidgets() {
	const widgetStore = useWidgetStore()

	if (DEBUG.createTestExpression) {
		widgetStore.addWidget(new ExpressionData(100, 100, 515, 150, 'x^2+2x-1'))
	}

	if (DEBUG.createTestGraph) {
		widgetStore.widgets.push(new GraphData(410, 300, 714, 615, ['x^2+2x-1', '\\sin(x)']))
	}
}
