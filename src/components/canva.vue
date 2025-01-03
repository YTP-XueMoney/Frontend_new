<script setup>
  import * as d3 from "d3";
  import { onMounted, watch, watchEffect } from "vue";
  const props = defineProps(['drawinput']);

  const parseCode = (input) => {
    const lines = input.split('\n'); // 將文字分行
    const graph = {};
    // 遍歷每一行，解析 draw 和 anime 部分
    lines.forEach((line) => {
      // console.log(line);
      // 解析 draw 部分
      const connections = line.trim().split('-'); // 分離節點
      for(let i = 0 ; i < connections.length ; i++){
        if (connections[i] != '' && !graph[connections[i]]) {
          graph[connections[i]] = []; // 初始化節點
        }
      }
      for (let i = 0; i < connections.length - 1; i++) {
        const source = connections[i];
        const target = connections[i + 1];
        if(source == '' || target == '')continue;
        graph[source].push(target); // 增加連線
        console.log(source + '->' + target);
      }
    });
    return graph;
  };

  const drawGraph = (containerId, graph) => {
    document.getElementById(containerId).innerHTML = '';
  const width = document.getElementById(containerId).clientWidth;
  const height = document.getElementById(containerId).clientHeight;

  const svg = d3.select(`#${containerId}`)
    .append("svg")
    .attr("width", "100%")
    .attr("height", "100%");

  const nodes = Object.keys(graph).map((id) => ({ id, x: Math.random() * width, y: Math.random() * height }));
  const links = Object.entries(graph).flatMap(([source, targets]) =>
    targets.map((target) => ({ source, target }))
  );

  const simulation = d3.forceSimulation(nodes)
    .force("link", d3.forceLink(links).id((d) => d.id).distance(100).strength(1))
    .force("charge", d3.forceManyBody().strength(-1))
    .force("center", d3.forceCenter(width / 2, height / 2))
    .on("tick", ticked);

  const link = svg.selectAll(".link")
    .data(links)
    .enter()
    .append("line")
    .attr("stroke", "#aaa")
    .attr("stroke-width", 2);

  const node = svg.selectAll(".node")
    .data(nodes)
    .enter()
    .append("circle")
    .attr("r", 20)
    .attr("fill", "#fff")
    .attr("stroke", "#000")
    .attr("stroke-width", 2)
    .call(
      d3.drag()
        .on("start", (event, d) => {
          if (!event.active) simulation.alphaTarget(0.3).restart();
          d.fx = d.x;
          d.fy = d.y;
        })
        .on("drag", (event, d) => {
          d.fx = event.x;
          d.fy = event.y;
        })
        .on("end", (event, d) => {
          if (!event.active) simulation.alphaTarget(0);
          d.fx = null;
          d.fy = null;
        })
    );

  const label = svg.selectAll(".label")
    .data(nodes)
    .enter()
    .append("text")
    .attr("text-anchor", "middle")
    .attr("dy", ".35em")
    .text((d) => d.id)
    .attr("fill", "#000") // 黑色文字
    .attr("font-size", "16px")
    .attr("font-family", "Noto Sans TC") // 標籤字體
    .attr("font-weight", "500");

  function ticked() {
    link
      .attr("x1", (d) => d.source.x)
      .attr("y1", (d) => d.source.y)
      .attr("x2", (d) => d.target.x)
      .attr("y2", (d) => d.target.y);

    node
      .attr("cx", (d) => d.x)
      .attr("cy", (d) => d.y);

    label
      .attr("x", (d) => d.x)
      .attr("y", (d) => d.y);
  }
};

onMounted(() => {
  const input = props.drawinput;
  console.log(input);
  const graph = parseCode(input);
  drawGraph("graph", graph);
  watchEffect(() => {
    const input = props.drawinput;
    console.log(input);
    const graph = parseCode(input);
    drawGraph("graph", graph);
  })
});

</script>

<template>
    <div id="graph"></div>
</template>

<style>
#graph{
    height: 100%;
    box-sizing: border-box;
}
svg text{
  pointer-events: none;
}
</style>