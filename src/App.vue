<script setup>
import code_editor from './components/code_editor.vue';
import draw from './components/draw.vue'

</script>

<template>
  <div class="main">
    <div class="left">
      <code_editor />
    </div>
    <div class="right">
      <draw />
    </div>
  </div>
</template>

<style>
body {
  font-family: 'Courier New', Courier, monospace;
  background: #222;
  color: #f0f0f0;
  height: 100%;
  width: 100%;
  margin: 0;
  padding: 0;
}
.title {
  font-size: 1.75rem;
  color: #ffffff;
  font-weight: bold;
  margin: 0;
}
.main {
  display: flex;
  flex-direction: row; /* 水平排列子項目 */
  height: 100%; /* 填滿父元素高度 */
  min-width: 1000px;
  width: 100%; /* 填滿父元素寬度 */
  align-items: stretch;
}
.left, .right {
  width: 100%;
  height: 100%;
  flex: 1;
}
.left {
  padding: 1rem;
}
.right {
  padding: 1rem;
}
</style>
