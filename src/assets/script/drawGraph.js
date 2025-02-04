import * as d3 from "d3";
export default (containerId, graph) => {
  document.getElementById(containerId).innerHTML = '';
  const width = document.getElementById(containerId).clientWidth;
  const height = document.getElementById(containerId).clientHeight;

  const svg = d3.select(`#${containerId}`)
    .append("svg")
    .attr("width", "100%")
    .attr("height", "100%");

  if (graph.direct) {
    console.log('direct');
    svg.append("defs").selectAll("marker")
      .data(["arrow"]) // 箭頭標記的 ID
      .enter().append("marker")
      .attr("id", (d) => d)
      .attr("viewBox", "0 -5 10 10") // 箭頭的視圖範圍
      .attr("refX", (d) => {
        // 根據 shape 調整箭頭的位置
        if (graph.shape === "circle") return 25;
        else if (graph.shape === "rectangle") return 30;
        else if (graph.shape === "square") return 25;
        return 25;
      })
      .attr("refY", 0)
      .attr("markerWidth", 6) // 箭頭的寬度
      .attr("markerHeight", 6) // 箭頭的高度
      .attr("orient", "auto") // 自動旋轉
      .append("path")
      .attr("d", "M0,-5L10,0L0,5") // 箭頭的形狀
      .attr("fill", "#aaa"); // 箭頭的顏色
  }

  // 處理 index 數據
  const indexNodes = Object.keys(graph.index).map((id) => ({ id, x: Math.random() * width, y: Math.random() * height }));
  const indexLinks = Object.entries(graph.index).flatMap(([source, targets]) =>
    targets.map((target) => ({ source, target }))
  );

  // 處理 arr 數據
  const arrNodes = Object.keys(graph.arr).flatMap((source) =>
    graph.arr[source].map((target, i) => ({
      id: target,
      x: 0, // 初始位置
      y: 0,
      parent: source, // 記錄父節點
      offset: (i + 1) * 50, // 距離父節點的偏移量
      visible: true // 初始狀態為可見
    }))
  );

  // 合併所有節點
  const nodes = [...indexNodes, ...arrNodes];

  // 創建物理模擬（僅對 index 節點生效）
  const simulation = d3.forceSimulation(indexNodes)
    .force("link", d3.forceLink(indexLinks).id((d) => d.id).distance(150).strength(0.05))
    .force("charge", d3.forceManyBody().strength(-100))
    .on("tick", ticked);

  // 繪製連接線（僅 index 的連接線）
  const link = svg.selectAll(".link")
    .data(indexLinks)
    .enter()
    .append("line")
    .attr("stroke", "#aaa")
    .attr("stroke-width", 2)
    .attr("marker-end", graph.direct ? "url(#arrow)" : null); // 如果是無向圖，則不添加箭頭

  // 繪製節點
  const node = svg.selectAll(".node")
    .data(nodes)
    .enter()
    .append((d) => {
      // 根據 shape 變數創建不同形狀的節點
      if (graph.shape === "rectangle") {
        return document.createElementNS("http://www.w3.org/2000/svg", "rect");
      }
      else if (graph.shape === "square") {
        return document.createElementNS("http://www.w3.org/2000/svg", "rect");
      }
      else {
        return document.createElementNS("http://www.w3.org/2000/svg", "circle");
      }
    })
    .attr("r", 20)
    .attr("fill", "#fff")
    .attr("stroke", "#000")
    .attr("stroke-width", 2)
    .attr("class", (d) => (d.parent ? "arrnode" : "indexnode"))
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

  // 根據 shape 變數設置節點的屬性
  if (graph.shape === "circle") {
    node.attr("r", 20);
  }
  else if (graph.shape === "rectangle") {
    node.attr("width", 50)
      .attr("height", 30);
  }
  else if (graph.shape === "square") {
    node.attr("width", 40)
      .attr("height", 40);
  }

  // 繪製節點標籤
  const label = svg.selectAll(".label")
    .data(nodes)
    .enter()
    .append("text")
    .attr("text-anchor", "middle")
    .attr("dy", ".35em")
    .text((d) => d.id)
    .attr("fill", "#000")
    .attr("font-size", "16px")
    .attr("font-family", "Noto Sans TC")
    .attr("font-weight", "500");

  // 更新節點和連接線位置
  function ticked() {
    // 更新 index 的連接線
    link
      .attr("x1", (d) => d.source.x)
      .attr("y1", (d) => d.source.y)
      .attr("x2", (d) => d.target.x)
      .attr("y2", (d) => d.target.y);

    // 更新 index 節點的位置
    if (graph.shape === "circle") {
      node.attr("cx", (d) => d.x)
        .attr("cy", (d) => d.y);
    }
    else if (graph.shape === "rectangle") {
      node.attr("x", (d) => d.x - 25)
        .attr("y", (d) => d.y - 15);
    }
    else if (graph.shape === "square") {
      node.attr("x", (d) => d.x - 20)
        .attr("y", (d) => d.y - 20);
    }

    // 更新 arr 節點的位置（根據父節點的位置計算）
    arrNodes.forEach((d) => {
      const parentNode = nodes.find((node) => node.id === d.parent);
      if (parentNode) {
        d.x = parentNode.x + d.offset; // 水平偏移
        d.y = parentNode.y; // 垂直方向與父節點一致
      }
    });

    // 更新 arr 節點的顯示位置
    if (graph.shape === "circle") {
      node.filter((d) => d.parent)
        .attr("cx", (d) => d.x)
        .attr("cy", (d) => d.y);
    }
    else if (graph.shape === "rectangle") {
      node.filter((d) => d.parent)
        .attr("x", (d) => d.x - 25)
        .attr("y", (d) => d.y - 15);
    }
    else if (graph.shape === "square") {
      node.filter((d) => d.parent)
        .attr("x", (d) => d.x - 20)
        .attr("y", (d) => d.y - 20);
    }

    // 更新所有標籤的位置
    label
      .attr("x", (d) => d.x)
      .attr("y", (d) => d.y);
  }

  node.filter((d) => !d.parent).on("click", (event, d) => {
    console.log('dbclick');
    // 切換 c 和 d 的可見性
    const children = arrNodes.filter((arrNode) => arrNode.parent === d.id);

    // 切換子節點的可見性
    children.forEach((child) => {
      child.visible = !child.visible;
    });

    // 更新子節點的顯示狀態
    node.filter((n) => n.parent == d.id)
      .attr("display", (n) => (n.visible ? "block" : "none"));
    label.filter((n) => n.parent == d.id)
      .attr("display", (n) => (n.visible ? "block" : "none"));
  });
};