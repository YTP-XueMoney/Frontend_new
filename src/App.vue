<script setup>
import {ref} from 'vue'; 
import code_editor from './components/code_editor.vue';
import canva from './components/canva.vue';
import headerBar from './components/headerBar.vue';

const code = ref('');

const handelDrawinput = (drawinput) => {
  code.value = drawinput;
  console.log(code.value);
};

</script>

<template>
  <headerBar/>
  <div class="main">
    <div class="left">
      <code_editor @drawinput="handelDrawinput"/>
    </div>
    <div class="right">
      <canva :drawinput="code"/>
    </div>
  </div>
</template>

<style>
#app{
  height: 100%;
  display: flex;
  flex-direction: column;

}
.main {
  display: flex;
  flex: 1;
}
.left, .right {
  box-sizing: border-box;
  width: 100%;
  height: 100%;
}
.left{
  flex: 1;
  border-right: 2px solid #888;
  display: flex;
  flex-direction: column;
  position: relative;
}
.right{
  flex: 2;
}
</style>
