<script setup>
import { onMounted, watchEffect } from "vue";
import drawGraph from "@/assets/script/drawGraph";
import parseCode from "@/assets/script/parseCode";

const props = defineProps(['drawinput']);

const Graph = {
  direct: true,
  shape: 'circle', 
  index: {
    1: ['2'],
    2: [],
    3: ['1', '4'],
    4: ['2'],
    5: ['4', '1'],
  },
  arr: { 
    1: ['6', '4'],
    2: ['4', '1', '2']
  }
};

onMounted(() => {
  const input = props.drawinput;
  console.log(input);
  // const graph = parseCode(input);
  drawGraph("graph", Graph);
  watchEffect(() => {
    const input = props.drawinput;
    // console.log(input);
    const graph = parseCode(input);
    console.log(Graph);
    drawGraph("graph", Graph);
  })
});

</script>

<template>
  <div id="graph"></div>
</template>

<style>
#graph {
  height: 100%;
  box-sizing: border-box;
}

svg text {
  pointer-events: none;
  user-select: none;
}

.indexnode:hover {
  cursor: grab;
}

.indexnode:active {
  cursor: grabbing;
}
</style>