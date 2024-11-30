<script setup lang="ts">
import { ref, onMounted } from 'vue';
import * as monaco from 'monaco-editor';

const codeInput = ref('');

const handleSubmit = () => {
  console.log('Submitted Code:', codeInput.value);
  alert('Code submitted!');
};

onMounted(() => {
  const editor = monaco.editor.create(document.getElementById('monaco-editor')!, {
  value: codeInput.value,
  language: 'cpp',
  theme: 'vs-dark',
  });

  editor.onDidChangeModelContent(() => {
    codeInput.value = editor.getValue();
  });
});
</script>

<template>
  <header class="header">
    <h1 class="title">Online Code Editor</h1>
  </header>

  <main>
    <div id="monaco-editor" class="monaco-editor"></div>
    <button @click="handleSubmit" class="submit-btn">Run Code</button>
  </main>
</template>

<style>
body {
  font-family: 'Courier New', Courier, monospace;
  background: #333840;
  color: #f0f0f0;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  margin: 0;
}

.header {
  width: 100%;
  padding: 1rem;
  text-align: center;
}

.title {
  font-size: 1.75rem;
  color: #ffffff;
  font-weight: bold;
  margin: 0;
}

.monaco-editor {
  width: 100%;
  height: 600px;
  margin-bottom: 1rem;
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
</style>
