<script setup>
import { onMounted, watchEffect } from "vue";
import drawGraph from "@/assets/script/drawGraph";
import draw from "@/assets/script/draw";
import parseCode from "@/assets/script/parseCode";

const props = defineProps(['drawinput']);

let Graph = {
  direct: false,
  shape: 'circle', 
  index: {
    1: ['2'],
    2: ['3'],
    3: ['1']
  },
  arr: { 
    1: ['0', 'a'],
    2: ['b']
  }
};
let test = 4;
onMounted(() => {
  const input = props.drawinput;
  console.log(input);
  // const graph = parseCode(input);
  draw.drawGraph("graph", Graph);
  // watchEffect(() => {
  //   const input = props.drawinput;
  //   // console.log(input);
  //   const graph = parseCode(input);
  //   Graph.index[test++] = ['1'];
  //   console.log(Graph);
  //   draw.drawGraph("graph", Graph);
  // })
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