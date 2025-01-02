<script setup>
  import * as d3 from "d3";
  import { onMounted } from "vue";
  const input = `
a-b-c-d-e-f-g
c-h-i
d-j-k-l
h-m
`;

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
        graph[source].push(target); // 增加連線
        console.log(source + '->' + target);
      }
    });
    return graph;
  };

  const createCanvas = (containerId) => {
    const container = d3.select(containerId);
    const width = container.node().clientWidth;
    const height = container.node().clientHeight;

    const svg = container.append("svg")
      .attr("width", '100%')
      .attr("height", '100%');

    return { svg, width, height };
  };

  const createForceSimulation = (graph, width, height) => {
    const nodes = Object.keys(graph).map((key) => ({ id: key }));
    const links = [];

    Object.entries(graph).forEach(([source, targets]) => {
      targets.forEach((target) => {
        links.push({ source, target });
      });
    });

    const simulation = d3.forceSimulation(nodes)
    .force("link", d3.forceLink(links).id(d => d.id).distance(100).strength(1))
    .force("charge", d3.forceManyBody().strength(-600)) // 強排斥力
    .force("center", d3.forceCenter(width / 2, height / 2)) // 圖形置中
    .force("y", d3.forceY().strength(0.1)) // 控制節點按Y軸排列
    .force("x", d3.forceX((d, i) => width / 2).strength(0.1)); // 水平保持在中心附近

    for (let i = 0; i < 300; i++) simulation.tick();

    return { nodes, links };
  };

  const drawGraph = (svg, nodes, links) => {
  // 繪製邊
    svg.selectAll(".link")
      .data(links)
      .enter()
      .append("line")
      .attr("class", "link")
      .attr("x1", d => d.source.x)
      .attr("y1", d => d.source.y)
      .attr("x2", d => d.target.x)
      .attr("y2", d => d.target.y)
      .attr("stroke", "#aaa")
      .attr("stroke-width", 2);

    // 繪製節點
    svg.selectAll(".node")
      .data(nodes)
      .enter()
      .append("circle")
      .attr("class", "node")
      .attr("cx", d => d.x)
      .attr("cy", d => d.y)
      .attr("r", 20)
      .attr("fill", "#fff")
      .attr("stroke", "#000")
      .attr("stroke-width", 2);

    // 繪製節點標籤
    svg.selectAll(".label")
      .data(nodes)
      .enter()
      .append("text")
      .attr("class", "label")
      .attr("x", d => d.x)
      .attr("y", d => d.y+4 )
      .attr("text-anchor", "middle")
      .text(d => d.id)
      .attr("fill", "#000") // 黑色文字
      .attr("font-size", "16px")
      .attr("font-family", "Noto Sans TC") // 標籤字體
      .attr("font-weight", "500");
  };

  onMounted(() => {
    const graph = parseCode(input);
    console.log('graph: ');
    console.log(graph);
    const { svg, width, height } = createCanvas('#graph');
    const { nodes, links } = createForceSimulation(graph, width, height);
    console.log(nodes);
    console.log(links);
    drawGraph(svg, nodes, links);
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
</style>