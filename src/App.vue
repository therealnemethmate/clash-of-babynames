<script setup lang="ts">
import { RouterView } from 'vue-router';

import TheTabBar from './components/TheTabBar.vue';
</script>

<template>
    <div class="app-container">
        <main class="main-content">
            <RouterView />
        </main>
        <TheTabBar />
    </div>
</template>

<style scoped>
.app-container {
  display: flex;
  flex-direction: column;
  height: 100vh;
  width: 100vw;
  overflow: hidden;
  background-color: var(--color-background);
}

.main-content {
  flex: 1;
  overflow-y: auto;
  padding-bottom: 80px; /* Space for tab bar */
  scrollbar-width: none; /* Firefox */
  -ms-overflow-style: none; /* IE and Edge */
}

.main-content::-webkit-scrollbar {
  display: none; /* Chrome, Safari and Opera */
}
</style>
