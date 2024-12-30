<script setup>
    import * as d3 from "d3";
    import { onMounted } from "vue";
    onMounted(() =>{

        const edges = [
          ['a', 'b', 'c', 'd', 'e'],
          ['c', 'f', 'g'],
          ['c', 'h', 'i']
        ];
    
        const animationOrder = ['a', 'b', 'c', 'd', 'e', 'd', 'c', 'f', 'g', 'f', 'c', 'h', 'i'];
    
        // 生成節點與邊
        const nodes = new Set();
        const links = [];
        edges.forEach(path => {
          for (let i = 0; i < path.length - 1; i++) {
            nodes.add(path[i]);
            nodes.add(path[i + 1]);
            links.push({ source: path[i], target: path[i + 1] });
          }
        });
    
        const graph = {
          nodes: Array.from(nodes).map(id => ({ id })),
          links: links
        };
    
        // 設置 SVG 畫布
        /*const width = 600, height = 600;
        const svg = d3.select('#canva').append('svg')
          .attr('width', '100%')
          .attr('height', '100%');*/
    
        // 力導向圖佈局
        const simulation = d3.forceSimulation(graph.nodes)
          .force('link', d3.forceLink(graph.links).id(d => d.id).distance(100))
          .force('charge', d3.forceManyBody().strength(-400))
          .force('center', d3.forceCenter(width / 2, height / 2));
    
        // 繪製連線
        const link = svg.append('g')
          .selectAll('.link')
          .data(graph.links)
          .enter().append('line')
          .attr('class', 'link');
    
        // 繪製節點
        const node = svg.append('g')
          .selectAll('.node')
          .data(graph.nodes)
          .enter().append('g')
          .attr('class', 'node')
          .call(d3.drag()
            .on('start', dragstarted)
            .on('drag', dragged)
            .on('end', dragended));
    
        node.append('circle')
          .attr('r', 20);
    
        node.append('text')
          .attr('dy', 3)
          .attr('x', 25)
          .text(d => d.id);
    
        // 更新圖位置
        simulation.on('tick', () => {
          link
            .attr('x1', d => d.source.x)
            .attr('y1', d => d.source.y)
            .attr('x2', d => d.target.x)
            .attr('y2', d => d.target.y);
    
          node
            .attr('transform', d => `translate(${d.x},${d.y})`);
        });
        animateNodes();
    });
    
    // 節點動畫
    let index = 0;
    function animateNodes() {
      if (index < animationOrder.length) {
        const currentNode = animationOrder[index];
        node.classed('active', d => d.id === currentNode);
        index++;
        setTimeout(animateNodes, 500);
      }
    }

    // 拖拽函數
    function dragstarted(event, d) {
      if (!event.active) simulation.alphaTarget(0.3).restart();
      d.fx = d.x;
      d.fy = d.y;
    }

    function dragged(event, d) {
      d.fx = event.x;
      d.fy = event.y;
    }

    function dragended(event, d) {
      if (!event.active) simulation.alphaTarget(0);
      d.fx = null;
      d.fy = null;
    }
</script>

<template>
    <div id="canva"></div>
</template>

<style>
#canva{
    height: 100%;
    box-sizing: border-box;
}
</style>