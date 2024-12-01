<script setup>
import { ref, onMounted } from 'vue';
import * as monaco from 'monaco-editor';
import 'monaco-editor/min/vs/editor/editor.main.css';

const codeInput = ref(''); // 初始化編輯器內容
const drawInput = ref(''); // 初始化編輯器內容

const handleSubmit = () => {
  console.log('Submitted Code:', codeInput.value);
  alert('Code submitted!');
};

// onMounted(() => {
//   const code_editor_conatiner = document.getElementById('code-editor');
//   if (!code_editor_conatiner) {
//     console.error('Monaco Editor container not found!');
//     return;
//   }

//   const code_editor = monaco.editor.create(code_editor_conatiner, {
//     value: codeInput.value,
//     language: 'cpp',
//     theme: 'vs-dark',
//     minimap: { enabled: false }, // 關閉右側 minimap
//     automaticLayout: true, // 自動適配容器大小
//   });

//   const draw_editor_conatiner = document.getElementById('draw-editor');
//   if (!draw_editor_conatiner) {
//     console.error('Monaco Editor container not found!');
//     return;
//   }

//   const draw_editor = monaco.editor.create(draw_editor_conatiner, {
//     value: drawInput.value,
//     language: 'cpp',
//     theme: 'vs-dark',
//     minimap: { enabled: false }, // 關閉右側 minimap
//     automaticLayout: true, // 自動適配容器大小
//   });

//   code_editor.onDidChangeModelContent(() => {
//     codeInput.value = code_editor.getValue();
//   });
//   draw_editor.onDidChangeModelContent(() => {
//     drawInput.value = draw_editor.getValue();
//   });
// });
</script>

<template>
  <button class="submit-btn" @click="handleSubmit">Submit Code</button>
  <div class="editor">
    <div id="code-editor" class="code-editor"></div>
    <div id="draw-editor" class="draw-editor"></div>
  </div>
</template>

<style>
.editor{
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  height: 100%;
}

.code-editor {
  width: 100%;
  height: 300px;
  padding: 20px 0 0;
  border: 2px solid #ddd;
}

.submit-btn {
  padding: 0.75rem 2rem;
  font-size: 1rem;
  background-color: #4e5a6e;
  color: #f0f0f0;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s, transform 0.1s;
}

.submit-btn:hover {
  background-color: #3d485c;
}

.submit-btn:active {
  transform: scale(0.95);
}

.draw-editor{
  width: 100%;
  height: 200px;
  padding: 20px 0 0;
  border: 2px solid #ddd;
}
/* .monaco-editor{
  border: 1px solid #ddd;
} */
</style>