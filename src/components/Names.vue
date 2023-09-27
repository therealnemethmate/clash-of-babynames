<script setup lang="ts">
import { ref } from 'vue'
import namesData from '../assets/girl-names.json';

const names = ref(namesData.names);
const randomName = ref(pickRandomName());

function pickRandomName() {
  const randomIndex = Math.floor(Math.random() * names.value.length);
  return names.value[randomIndex];
}

function appendName(collection: string, name: string) {
  const raw = localStorage.getItem(collection);
  if (raw) {
    const names = JSON.parse(raw);
    names.push(name);
    localStorage.setItem(collection, JSON.stringify(names));
    return;
  }

  localStorage.setItem(collection, JSON.stringify([name]));
}

</script>

<template>
  <div>
    <h1>Girl names</h1>
    <p>Click the button to get a random name!</p>
    <p>Current name: {{ randomName }}</p>
    <button class="random-button" @click="randomName = pickRandomName()">Get a random name</button>

    <p>Click the button to save the current name to your collection.</p>
    <button class="save-button" @click="appendName('likedNames', randomName)">Save name</button>
  </div>
</template>

<style scoped>
h1 {
  color: #42b883;
}

p {
  color: #35495e;
}

.random-button {
  background-color: #42b883;
  color: #fff;
  border: none;
  border-radius: 4px;
  padding: 0.5em 1em;
  font-size: 1em;
  cursor: pointer;
}
</style>
```
