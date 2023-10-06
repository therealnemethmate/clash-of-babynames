<script setup lang="ts">
import { ref } from 'vue';

import { useNameStore } from '../stores/name'; 

const nameStore = useNameStore();
const showDislikedNames = ref(false);

function handleLike() {
    nameStore.removeName();
    nameStore.appendInCollection(true);
    nameStore.randomName = nameStore.pickRandomName();
}

function handleDislike() {
    nameStore.removeName();
    nameStore.appendInCollection(false);
    nameStore.randomName = nameStore.pickRandomName();
}

function toggleDislikedNames() {
    showDislikedNames.value = !showDislikedNames.value;
}
</script>

<template>
    <div>
        <h1>Lány nevek</h1>
        <h3 class="current-name">Név: {{ nameStore.randomName }}</h3>
        <div class="button-container">
            <button class="like-button"
                    @click="handleLike">Like</button>
            <button class="dislike-button"
                    @click="handleDislike">Dislike</button>
        </div>
    </div>

    <div class="names-container">
        <div class="names-list-container">
            <h2>Tetszik:</h2>
            <ul class="names-list">
                <li class="names-item" v-for="name in nameStore.likedNames" :key="name">{{ name }}</li>
            </ul>
        </div>

        <div class="names-list-container">
            <h2>Nem tetszik: </h2>
            <button class="show-hide-button" @click="toggleDislikedNames">{{ showDislikedNames ? 'Rejtsd el' : 'Mutatsd' }} ami NEM tetszik!</button>
            <ul class="names-list" v-show="showDislikedNames">
                <li class="names-item" v-for="name in nameStore.dislikedNames" :key="name">{{ name }}</li>
            </ul>
        </div>
    </div>
</template>

<style scoped>
h1 {
    color: #42b883;
}

p {
    color: #35495e;
}

.current-name {
    color: #d89e00;
    font-size: 1.5em;
    font-weight: bold;
    margin-bottom: 1em;
}

.show-hide-button {
    margin-top: 1em;
    background-color: #24292e;
    color: #fff;
    border: none;
    border-radius: 4px;
    padding: 0.5em 1em;
    font-size: 1em;
    cursor: pointer;
    align-items: center;
}

.show-hide-button:hover {
    background-color: #2f363d;
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

.show-hide-button {
    margin-top: 1em;
    background-color: #24292e;
    color: #fff;
    border: none;
    border-radius: 4px;
    padding: 0.5em 1em;
    font-size: 1em;
    cursor: pointer;
    align-items: center;
}

.show-hide-button:hover {
    background-color: #2f363d;
}

.show-hide-button[aria-expanded="true"] svg {
    transform: rotate(180deg);
}

.like-button {
    margin: 0.5rem;
    background-color: #3b7a00;
    color: #fff;
    border: none;
    border-radius: 4px;
    padding: 1em 1em;
    font-size: 1em;
    cursor: pointer;
}

.like-button[aria-expanded="true"] svg {
    transform: rotate(180deg);
}

.like-button:hover {
    background-color: #059b11;
}

.dislike-button {
    margin: 0.5rem;
    background-color: #cc4b5c;
    color: #fff;
    border: none;
    border-radius: 4px;
    padding: 1em 1em;
    font-size: 1em;
    cursor: pointer;
}

.dislike-button[aria-expanded="true"] svg {
    transform: rotate(180deg);
}

.dislike-button:hover {
    background-color: #ff4b5c;
}

.button-container {
    margin-top: 1em;
}

.names-list-container {
    margin-top: 2em;
}

.names-list {
    list-style: square inside;
    padding: 0;
    font-size: 1.2em;
    font-weight: bold;
    color: #6684a5;
}

.names-list li {
    margin-bottom: 0.5em;
    text-transform: capitalize;
}
.names-item {
    margin-bottom: 0.5em;
}

</style>
