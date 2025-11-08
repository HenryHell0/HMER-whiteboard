<script setup>
import Toolbar from './components/core/Toolbar.vue'
import WidgetContainer from './components/core/WidgetContainer.vue'
import OverlaySvg from './components/overlay/OverlaySvg.vue'
import MainCanvas from './components/core/MainCanvas.vue'

import { toolList, tools } from './utils/drawingTools'
</script>

<template>
	<div class="template">
		<Toolbar :toolList> </Toolbar>

		<MainCanvas></MainCanvas>

		<OverlaySvg :tools="tools"></OverlaySvg>

		<WidgetContainer></WidgetContainer>
	</div>
</template>

<style>
.template {
	font-family: roboto;
}
</style>
