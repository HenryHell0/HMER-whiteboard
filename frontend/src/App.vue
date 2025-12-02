<script setup>
import Toolbar from '@/components/core/Toolbar.vue'
import WidgetContainer from '@/components/core/WidgetContainer.vue'
import OverlaySvg from '@/components/core/OverlaySvg.vue'
import MainCanvas from '@/components/core/MainCanvas.vue'
</script>

<template>
	<div class="template">
		<Toolbar></Toolbar>

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
