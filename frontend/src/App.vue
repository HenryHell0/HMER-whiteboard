<script setup>
import Toolbar from './components/core/toolbar/Toolbar.vue'
import WidgetContainer from './components/core/WidgetContainer.vue'
import OverlaySvg from './components/core/overlay/OverlaySvg.vue'
import MainCanvas from './components/core/MainCanvas.vue'
</script>

<template>
	<div class="template">
		<Toolbar> </Toolbar>

		<MainCanvas></MainCanvas>

		<OverlaySvg></OverlaySvg>

		<WidgetContainer></WidgetContainer>
	</div>
</template>

<style>
.template {
	font-family: roboto;
}
</style>
