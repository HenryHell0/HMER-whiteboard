<script setup>
/*
NEXT STEP:
- Lasso/rectangle HMER select tool

CONSIDER:
  - HMER thing will take PNG snippit of the canvas and export it
    - if we do lasso we will need to take a bounding box - alggorithm??
*/

/*
NAMING CONVENTIONS:
path - d prop for <path> element - a string with path data
stroke - user input (position stuff)
*/
import { ref } from 'vue'

//! CHANGE this to NOT REF and put a ctx canvas on top of the svg to render active stroke. way faster and smoother and better.
var currentStroke = ref([])
const paths = ref([])
const activeTool = ref('pen')
const previousMousePos = { x: -1, y: -1 }
const previousOffsetPos = { x: -1, y: -1 }

const pen = {
  onDown(event) {
    let startPos = { x: event.offsetX, y: event.offsetY }
    currentStroke.value = [startPos]
  },
  onMove(event) {
    if (event.buttons !== 1) return

    let point = { x: event.offsetX, y: event.offsetY }
    currentStroke.value.push(point)
  },
  onUp() {
    // "d" is the path param for <path> elemtn
    let d = ''

    /*
    go through currentPath, and then adds
      index 1: M x, y
      index ...: C x, y
    */

    if (currentStroke.value.length == 1) {
      // lil circle
      //? maybe switcch this to do a filled in circle somehow
      let radius = 1
      d += `M ${currentStroke.value[0].x},${currentStroke.value[0].y - radius}`
      d += `a ${radius} ${radius} 0 1 0 0.0001 0`
    } else {
      // line
      d += `M ${currentStroke.value[0].x},${currentStroke.value[0].y} `
      d += 'L '

      for (let i = 1; i < currentStroke.value.length; i++) {
        d += `${currentStroke.value[i].x},${currentStroke.value[i].y} `
      }
    }

    paths.value.push({ d: d, id: crypto.randomUUID() })
    // clear path
    currentStroke.value = []
  },
}
const eraser = {
  onMove(event) {
    if (event.buttons !== 1) return

    const current = { x: event.clientX, y: event.clientY }
    const prev = previousMousePos

    const dx = current.x - prev.x
    const dy = current.y - prev.y
    const distance = Math.hypot(dx, dy)
    const steps = Math.max(1, Math.ceil(distance))

    for (let i = 0; i <= steps; i++) {
      const x = prev.x + (dx * i) / steps
      const y = prev.y + (dy * i) / steps

      const elements = document.elementsFromPoint(x, y)

      for (let pathElement of elements) {
        if (pathElement.tagName != 'path') continue

        const id = pathElement.dataset.id
        // NOTICE this changes in indicies
        // we could instead just set it to 0 or something
        paths.value = paths.value.filter((p) => p.id != id)
      }
    }
  },
}

const toolList = ['pen', 'eraser']
const tools = new Map([
  ['pen', pen],
  ['eraser', eraser],
])

function SVGMouseDown(event) {
  tools.get(activeTool.value).onDown?.(event)
}

function SVGMouseMove(event) {
  tools.get(activeTool.value).onMove?.(event)
  previousMousePos.x = event.clientX
  previousMousePos.y = event.clientY
  previousOffsetPos.x = event.offsetX
  previousOffsetPos.y = event.offsetY
}

function SVGMouseUp(event) {
  tools.get(activeTool.value).onUp?.(event)
}

// attempt at mobile support
// function getTouchPosition(event) {
//   const touch = event.touches[0] || event.changedTouches[0]
//   return {
//     x: touch.clientX,
//     y: touch.clientY,
//   }
// }

// function SVGTouchStart(event) {
//   SVGTouchEnd(event)
//   event.preventDefault()
//   const pos = getTouchPosition(event)
//   SVGMouseDown({ offsetX: pos.x, offsetY: pos.y, buttons: 1, clientX: pos.x, clientY: pos.y })
// }

// function SVGTouchMove(event) {
//   event.preventDefault()
//   const pos = getTouchPosition(event)
//   SVGMouseMove({ offsetX: pos.x, offsetY: pos.y, buttons: 1, clientX: pos.x, clientY: pos.y })
// }

// function SVGTouchEnd(event) {
//   console.log('touching u rn')
//   event.preventDefault()
//   const pos = getTouchPosition(event)
//   SVGMouseUp({ offsetX: pos.x, offsetY: pos.y, buttons: 1, clientX: pos.x, clientY: pos.y })
// }
</script>

<template>
  <div class="toolbar">
    <button
      v-for="tool in toolList"
      :key="tool"
      @click="activeTool = tool"
      :class="{ active: activeTool === tool }"
      class="toolbar-button"
    >
      <img :src="`./assets/${tool}.svg`" class="toolbar-image" draggable="false" />
    </button>
  </div>

  <!--
  @touchstart.prevent="SVGTouchStart"
  @touchmove.prevent="SVGTouchMove"
  @touchend.prevent="SVGTouchEnd"
  @touchcancel.prevent="SVGTouchEnd" -->
  <svg class="SVGCanvas" @mousedown="SVGMouseDown" @mouseup="SVGMouseUp" @mousemove="SVGMouseMove">
    <path v-for="path in paths" :d="path.d" class="stroke" :key="path.id" :data-id="path.id" />

    <!-- evil live path (slow?) (bad?)  -->
    <path
      v-if="currentStroke.length > 1"
      :d="
        `M ${currentStroke[0].x},${currentStroke[0].y} ` +
        currentStroke
          .slice(1)
          .map((p) => `L ${p.x},${p.y}`)
          .join(' ')
      "
      class="stroke"
    />
  </svg>
</template>

<style>
/*
TODO:

- work on toolbar styles,
- add some color to the toolbar (blue active tool?)
- add custom cursor for eraser etc (only applies for mouse not stylus)
*/
.SVGCanvas {
  position: absolute;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  border: none;
  cursor: crosshair;
}

.stroke {
  stroke-linejoin: round;
  stroke-linecap: round;
  fill: none;
  stroke: black;
  stroke-width: 2;
  pointer-events: stroke;
}

.toolbar {
  position: absolute;
  top: 10px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  justify-content: center;
  gap: 10px;
  padding: 10px 10px;
  background-color: rgba(255, 255, 255, 0.8);
  border-radius: 1000000px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
  z-index: 100;
  user-select: none;
}

/* .toolbar:hover {
  transform: scale(1.1);
} */

.toolbar-image {
  width: 1.5rem;
  height: 1.5rem;
  fill: black;
  transition: rotate 0.2s ease;
}

.toolbar-button {
  all: unset;
  padding: 8px 10px;
  border-radius: 10000px;
  border: none;
  /* background-color: #eee; */
  cursor: pointer;
  user-select: none;
  transition:
    transform 0.15s ease,
    background 0.3s ease;
}

.toolbar-button:hover {
  transform: scale(1.1);
  background: rgb(226, 226, 226);
}

.toolbar-button.active {
  background-color: #c0c0c0;
  transform: scale(1.1);
}

.toolbar-button.active:hover {
  background-color: #c0c0c0;
  transform: scale(1.2);
}
</style>
