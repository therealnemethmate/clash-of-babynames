<script setup lang="ts">
import { ref, watch } from 'vue';

import girlNamesData from '../assets/girl-names.json';
import { createLocalStorageWatcher } from '../utils';

const names = ref(girlNamesData.names);
const randomName = ref(pickRandomName());

const rawLikedNames = localStorage.getItem('likedNames') ?? '[]';
const likedNames = ref<string[]>(JSON.parse(rawLikedNames));
watch(likedNames, createLocalStorageWatcher('likedNames'));

function pickRandomName() {
    const randomIndex = Math.floor(Math.random() * names.value.length);
    return names.value[randomIndex];
}

function appendInCollection() {
    likedNames.value = likedNames.value.concat(randomName.value);
}

function removeName() {
    names.value = names.value.filter((name) => name !== randomName.value);
}

function handleLike() {
    appendInCollection();
    randomName.value = pickRandomName();
}

function handleDislike() {
    removeName();
    randomName.value = pickRandomName();
}

</script>

<template>
    <div>
        <h1>Girl names</h1>
        <h3>Current name: {{ randomName }}</h3>
        <div class="button-container">
            <button class="like-button"
                    @click="handleLike">Like</button>
            <button class="dislike-button"
                    @click="handleDislike">Dislike</button>
        </div>
    </div>

    <div class="liked-names-list-container">
        <h2>Liked names</h2>
        <ul class="liked-names-list">
            <li class="liked-names-item" v-for="name in likedNames" :key="name">{{ name }}</li>
        </ul>
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

.like-button {
    margin: 0.5rem;
    background-color: #35495e;
    color: #fff;
    border: none;
    border-radius: 4px;
    padding: 1em 1em;
    font-size: 1em;
    cursor: pointer;
}

.dislike-button {
    margin: 0.5rem;
    background-color: #ff4b5c;
    color: #fff;
    border: none;
    border-radius: 4px;
    padding: 1em 1em;
    font-size: 1em;
    cursor: pointer;
}

.button-container {
    margin-top: 1em;
}

.liked-names-list-container {
    margin-top: 2em;
}

.liked-names-list {
    list-style: square inside;
    padding: 0;
}

.liked-names-item {
    margin-bottom: 0.5em;
}
</style>
