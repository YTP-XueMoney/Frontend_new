<script setup>
import draw from '@/assets/script/draw';
import { defineEmits } from 'vue';

const emit = defineEmits(['run']);
</script>

<template>
<div class="header">
    <h1>算法漫步</h1>
    <nav>
        <ul>
            <li><button @click="emit('run')" class="btn">run</button></li>
            <li><i class="fa-solid fa-gear"></i></li>
        </ul>
    </nav>
</div>
</template>

<style>
.header{
    display: flex;
    justify-content: space-between;
    box-sizing: border-box;
    border-bottom: 2px solid #888;
    font-size: 25px;
    padding: 10px;
}
.header h1{
    font-family: "Noto Sans TC", serif;
    font-weight: 600;

}
.header nav ul{
    display: flex;
    align-items: center;
}
.header nav ul li{
    margin-left: 10px;
}
.btn{
    font-size: 20px;
    background: #fff;
    border: 1px solid #000;
}

.btn:hover{
    background-color: #ddd;
}
</style>