<script setup lang="ts">
import { ref } from 'vue'
import namesData from '../assets/girl-names.json';

const names = ref<string[]>(namesData.names);

</script>

<template>
  <div>
    <h1>Girl names</h1>
    <div v-for="name in names" :key="name">{{ name }}</div>
  </div>
</template>
