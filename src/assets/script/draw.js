import * as d3 from "d3";
let svg = {
  width: 0,
  height: 0,
  element: null
}
let simulation; // 物理模擬器
let arrNodes;
let indexNodes;
let nodes; // 節點資料
let links; // 連接線資料
let link; // 連接線選擇器
let node; // 節點選擇器
let label; // 標籤選擇器

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
  else {
    node.attr("cx", (d) => d.x)
      .attr("cy", (d) => d.y);
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

export default {
  drawGraph: (containerId, graph) => {
    document.getElementById(containerId).innerHTML = '';
    svg.width = document.getElementById(containerId).clientWidth;
    svg.height = document.getElementById(containerId).clientHeight;

    svg.element = d3.select(`#${containerId}`)
      .append("svg")
      .attr("width", "100%")
      .attr("height", "100%");

    // 定義箭頭標記
    if (graph.direct) {
      svg.element.append("defs").selectAll("marker")
        .data(["arrow"]) // 箭頭標記的 ID
        .enter().append("marker")
        .attr("id", (d) => d)
        .attr("viewBox", "0 -5 10 10") // 箭頭的視圖範圍
        .attr("refX", (d) => {
          // 根據 shape 調整箭頭的位置
          if (graph.shape === "circle") return 25; // 圓形
          else if (graph.shape === "rectangle") return 25; // 長方形
          else if (graph.shape === "square") return 20; // 正方形
          return 25; // 默認
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
    indexNodes = Object.keys(graph.index).map((id) => ({ id, x: Math.random() * svg.width, y: Math.random() * svg.height }));
    links = Object.entries(graph.index).flatMap(([source, targets]) =>
      targets.map((target) => ({ source, target }))
    );

    // 處理 arr 數據
    arrNodes = Object.keys(graph.arr).flatMap((source) =>
      graph.arr[source].map((target, i) => ({
        id: target,
        x: 0, // 初始位置，稍後根據父節點的位置計算
        y: 0,
        parent: source, // 記錄父節點
        offset: (i + 1) * 50, // 距離父節點的偏移量
        visible: true // 初始狀態為可見
      }))
    );

    // 合併所有節點
    nodes = [...indexNodes, ...arrNodes];
    console.log(nodes);
    console.log(links);

    // 創建物理模擬
    simulation = d3.forceSimulation(indexNodes)
      .force("link", d3.forceLink(links).id((d) => d.id).distance(100).strength(0.5)) // 減弱連接力的強度
      .force("charge", d3.forceManyBody().strength(-100)) // 排斥力
      .on("tick", ticked);

    // 繪製連接線
    link = svg.element.selectAll(".link")
      .data(links)
      .enter()
      .append("line")
      .attr("stroke", "#aaa")
      .attr("stroke-width", 2)
      .attr("marker-end", graph.direct ? "url(#arrow)" : null); // 如果是無向圖，則不添加箭頭

    // 繪製節點
    node = svg.element.selectAll(".node")
      .data(nodes)
      .enter()
      .append((d) => {
        // 根據 shape 變數創建不同形狀的節點
        if (graph.shape === "circle") {
          return document.createElementNS("http://www.w3.org/2000/svg", "circle");
        } else if (graph.shape === "rectangle") {
          return document.createElementNS("http://www.w3.org/2000/svg", "rect");
        } else if (graph.shape === "square") {
          return document.createElementNS("http://www.w3.org/2000/svg", "rect");
        } else {
          return document.createElementNS("http://www.w3.org/2000/svg", "circle"); // 默認為圓形
        }
      })
      .attr("class", "node")
      .attr("fill", (d) => (d.parent ? "#ffcc00" : "#fff")) // arr 節點用黃色標記
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

    // 根據 shape 變數設置節點的屬性
    if (graph.shape === "circle") {
      node.attr("r", 20); // 圓形的半徑
    } else if (graph.shape === "rectangle") {
      node.attr("width", 40) // 長方形的寬度
        .attr("height", 20); // 長方形的高度
    } else if (graph.shape === "square") {
      node.attr("width", 30) // 正方形的寬度
        .attr("height", 30); // 正方形的高度
    }

    // 繪製節點標籤
    label = svg.element.selectAll(".label")
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

    // 為所有有子陣列的點綁定點擊事件
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
  },

  // 更新圖形資料
  updateGraph: (graph) => {
    // 更新節點和連接線資料
    let newindexNodes = Object.keys(graph.index).map((id) => ({ id, x: Math.random() * svg.width, y: Math.random() * svg.height }));
    let newlinks = Object.entries(graph.index).flatMap(([source, targets]) =>
      targets.map((target) => ({ source, target }))
    );

    // 處理 arr 數據
    let newarrNodes = Object.keys(graph.arr).flatMap((source) =>
      graph.arr[source].map((target, i) => ({
        id: target,
        x: 0, // 初始位置，稍後根據父節點的位置計算
        y: 0,
        parent: source, // 記錄父節點
        offset: (i + 1) * 50, // 距離父節點的偏移量
        visible: true // 初始狀態為可見
      }))
    );

    // 合併所有節點
    let newnodes = [...newindexNodes, ...newarrNodes];

    console.log(nodes);
    console.log(links);

    // 重新綁定資料到圖形
    link.data(newlinks)
    .enter()
    .append("line")
    .attr("stroke", "#aaa")
    .attr("stroke-width", 2)
    .attr("marker-end", graph.direct ? "url(#arrow)" : null);

    node.data(newnodes)
    .enter()
    .append((d) => {
      // 根據 shape 變數創建不同形狀的節點
      if (graph.shape === "circle") {
        return document.createElementNS("http://www.w3.org/2000/svg", "circle");
      } else if (graph.shape === "rectangle") {
        return document.createElementNS("http://www.w3.org/2000/svg", "rect");
      } else if (graph.shape === "square") {
        return document.createElementNS("http://www.w3.org/2000/svg", "rect");
      } else {
        return document.createElementNS("http://www.w3.org/2000/svg", "circle"); // 默認為圓形
      }
    })
    .attr("class", "node")
    .attr("fill", (d) => (d.parent ? "#ffcc00" : "#fff")) // arr 節點用黃色標記
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

    label.data(newnodes)
    .enter()
    .append("text")
    .attr("text-anchor", "middle")
    .attr("dy", ".35em")
    .text((d) => d.id)
    .attr("fill", "#000")
    .attr("font-size", "16px")
    .attr("font-family", "Noto Sans TC")
    .attr("font-weight", "500");

    // 更新物理模擬的資料
    simulation.nodes(newindexNodes);
    simulation.force("link").links(newlinks);


    // 重新啟動模擬
    simulation.restart();
  },
  change: () => {
    node.filter((d) => d.id == '1').attr("fill", "#bbcc00")
  }
}