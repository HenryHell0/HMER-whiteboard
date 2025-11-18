<script setup>
import PopMenu from '@/components/core/ui/PopMenu.vue'
import { useWidgetStore } from '@/stores/useWidgetStore'
import { ref } from 'vue'

const props = defineProps({id: String})
const widgetStore = useWidgetStore()
const widget = widgetStore.getWidgetById(props.id)
const expressionListElement = ref(null)

function convertToExpression(expression) {
	// remove expression from graph
	widget.deleteExpression(expression)
	const rect = expressionListElement.value.getBoundingClientRect()

	// move it to bottom if there are still expressions (not super robust)
	if (widget.expressions.length != 0) {
		expression.x = rect.left
		expression.y = rect.bottom + 12
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
					<div @click="widget.deleteExpression(expression)" style="color: red;">Delete</div>
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
