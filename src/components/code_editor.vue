<script setup>
import { ref, onMounted, watch } from 'vue';
import * as monaco from 'monaco-editor';
import 'monaco-editor/min/vs/editor/editor.main.css';

const codeInput = ref(''); // 初始化編輯器內容
const drawInput = ref(''); // 初始化編輯器內容
const emits = defineEmits(['drawinput']);

onMounted(() => {
  const code_editor_conatiner = document.getElementById('code-editor');
  const draw_editor_conatiner = document.getElementById('draw-editor');
  const resizer = document.getElementById('resizer');
  if (!code_editor_conatiner) {
    console.error('Monaco Editor container not found!');
    return;
  }

  const code_editor = monaco.editor.create(code_editor_conatiner, {
    value: codeInput.value,
    language: 'cpp',
    theme: 'vs',
    minimap: { enabled: false }, // 關閉右側 minimap
    automaticLayout: true, // 自動適配容器大小
  });

  if (!draw_editor_conatiner) {
    console.error('Monaco Editor container not found!');
    return;
  }

  const draw_editor = monaco.editor.create(draw_editor_conatiner, {
    value: drawInput.value,
    language: 'cpp',
    theme: 'vs',
    minimap: { enabled: false }, // 關閉右側 minimap
    automaticLayout: true, // 自動適配容器大小
  });

  code_editor.onDidChangeModelContent(() => {
    codeInput.value = code_editor.getValue();
  });
  draw_editor.onDidChangeModelContent(() => {
    drawInput.value = draw_editor.getValue();
  });

});

watch(drawInput, (input) => {
  emits('drawinput', input);
});
</script>

<template>
  <div id="code-editor" class="editor"></div>
  <div class="resizer" id="resizer"></div>
  <div id="draw-editor" class="editor"></div>
</template>

<style>
#code-editor{
  flex: 1;
  box-sizing: border-box;
}

#draw-editor{
  flex: 1;
}

.resizer {
  height: 2px;
  background: #888;
  cursor: row-resize;
  position: relative;
}
</style>