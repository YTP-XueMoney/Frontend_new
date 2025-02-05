<script setup>
import { ref, onMounted, watch } from 'vue';
import * as monaco from 'monaco-editor';
import 'monaco-editor/min/vs/editor/editor.main.css';

class Runcode{
  outputValue = ref('');
  inputValue = '';
  constructor(code, input) {
    this.code = code;
    this.inputValue = input;
    this.outputValue = ref('');
  }
  modifyCode(s){
    this.code = s;
  }

  modifyinput(s){
    this.inputValue = s;
  }

  output(s){
    this.outputValue.value += s;
  }

  input(){
    return this.inputValue;
  }

  run(){
    this.outputValue.value = '';
    eval(this.code);
    area1.value = 'output';
  }
}

const coderun = new Runcode('', '');

const codeInput = ref(''); // 初始化編輯器內容
const inputInput = ref(''); // 初始化編輯器內容
const output = ref('');
const area1 = ref('input');
const emits = defineEmits(['drawinput']);
defineExpose({coderun});

onMounted(() => {
  const code_editor_conatiner = document.getElementById('code-editor');
  if (!code_editor_conatiner) {
    console.error('Monaco Editor container not found!');
    return;
  }

  const code_editor = monaco.editor.create(code_editor_conatiner, {
    value: codeInput.value,
    language: 'javascript',
    theme: 'vs',
    minimap: { enabled: false }, // 關閉右側 minimap
    automaticLayout: true, // 自動適配容器大小
  });

  // monaco.editor.colorizeElement(document.getElementById("output-area"));

  const input_editor_conatiner = document.getElementById('input-area');
  if (!input_editor_conatiner) {
    console.error('Monaco Editor container not found!');
    return;
  }

  const input_editor = monaco.editor.create(input_editor_conatiner, {
    value: inputInput.value,
    theme: 'vs',
    minimap: { enabled: false }, // 關閉右側 minimap
    automaticLayout: true, // 自動適配容器大小
    lineNumbers: false
  });

  code_editor.onDidChangeModelContent(() => {
    codeInput.value = code_editor.getValue();
  });
  input_editor.onDidChangeModelContent(() => {
    inputInput.value = input_editor.getValue();
  });

});

watch(inputInput, (input) => {
  coderun.modifyinput(input);
  console.log(coderun.outputValue)
});

watch(codeInput, (input) => {
  coderun.modifyCode(input);
});

watch(() => coderun.outputValue, (s) => {
  console.log(s)
  output.value = s;
});
</script>

<template>
  <div id="code-editor" class="editor-con"></div>
  <div class="pagebar">
    <button class="pagebtn" @click="area1 = 'input'" :class="{'active-btn': area1 === 'input'}">input</button>
    <button class="pagebtn" @click="area1 = 'output'" :class="{'active-btn': area1 === 'output'}">output</button>
  </div>
  <div class="editor-con">
    <div id="input-area" v-show="area1 === 'input'" class="console"></div>
    <div id="output-area" v-show="area1 === 'output'" class="console">{{ coderun.outputValue }}</div>
  </div>
</template>

<style>
.editor-con{
  flex: 1;
}

.pagebar{
  display: flex;
  background-color: #888;
}

.pagebtn{
  height: 100%;
  background: transparent;
  flex: 1;
  font-size: 15px;
  line-height: 20px;
  border: none;
  cursor: pointer;
  color: #fff;
}

#input-area{
  background-color: #fff;
}
#output-area{
  background-color: #fff;
  padding: 5px;
  white-space: pre-line;
}

.console{
  height: 100%;
}

.active-btn{
  background-color: #fff;
  border-top: 2px solid #888;
  border-left: 2px solid #888;
  border-radius: 5px 5px 0 0;
  color: #000;
}
</style>