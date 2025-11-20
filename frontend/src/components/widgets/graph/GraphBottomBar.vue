<script setup lang="ts">
import PopMenu from '@/components/core/ui/PopMenu.vue'
import { useWidgetStore } from '@/stores/useWidgetStore'
import { GraphData, type ExpressionData } from '@/utils/widgetData'
import { ref } from 'vue'

const props = defineProps<{
	id: string
}>()
const widgetStore = useWidgetStore()
const widget = widgetStore.getWidgetById(props.id)
if (!(widget instanceof GraphData)) throw new Error('this aint no graph')
const expressionListElement = ref<HTMLElement | null>(null)

function convertToExpression(expression: ExpressionData) {
	// remove expression from graph
	if (!(widget instanceof GraphData)) throw new Error('this aint no graph')
	widget.deleteExpression(expression)

	// get rectange
	if (!expressionListElement.value) throw new Error('expression list element is undefined')
	const rect = expressionListElement.value.getBoundingClientRect()

	// set expression to be at the bottom.
	expression.x = rect.left
	expression.y = rect.bottom + 12
	// if we removed all the expressions, put it at the top of the graph
	if (widget.expressions.length == 0) {
		expression.x = rect.left
		expression.y = rect.top
	}
	// add the widget to store
	widgetStore.addWidget(expression)
}
</script>
<template>
	<div class="expressionList" v-if="widget.expressions.length > 0" ref="expressionListElement">
		<div class="expression-container" v-for="expression in widget.expressions" :key="expression.id">
			<!-- expression -->
			<vue-mathjax
				:formula="`$$${expression.latex}$$`"
				class="typeset-expression"
				:options="{ messageStyle: 'none' }"
			/>

			<!-- menu for options -->
			<PopMenu :closeOnClick="true">
				<template #activator>
					<div class="popmenu-activator">
						<img class="three-dot-image" src="/assets/vertical-dots.svg" />
					</div>
				</template>
				<template #menu>
					<div @click="convertToExpression(expression)">Convert to Expression</div>
					<div @click="widget.deleteExpression(expression)" style="color: red">Delete</div>
				</template>
			</PopMenu>
		</div>
	</div>
</template>

<style scoped>
.expressionList {
	margin: 0.2em;
	margin-left: 0.1em;
	display: flex;
	flex-direction: row;
	gap: 0.3em;
	position: relative;
	width: 100%;
	min-height: 0px;
}

.expression-container {
	box-sizing: border-box;

	display: flex;
	align-items: center;
	justify-content: center;
	position: relative;

	border: 2px solid rgba(53, 215, 255, 0.5);
	border-radius: 0.5em;
}

.typeset-expression {
	margin: 5px;
}

.popmenu-activator {
	display: flex;
	align-items: center;
	justify-content: center;

	margin: 3px;

	background-color: rgb(221, 221, 221);
	border-radius: 3px;

	transition: background ease-in-out 0.1s;
}

.popmenu-activator:hover {
	background-color: rgb(184, 184, 184);
}

.three-dot-image {
	height: 1.2em; /* small consistent size */
	width: auto; /* preserve aspect ratio */
	display: block; /* remove inline descender whitespace */
	margin: 0 auto; /* horizontally center */
	object-fit: contain;
	padding: 0.2em;
}
</style>
