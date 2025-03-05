<script setup lang="ts">
import { ref } from 'vue';

import { useNameStore } from '../stores/name'; 

const nameStore = useNameStore();
const showDislikedNames = ref(false);

function handleLike() {
    nameStore.appendInCollection(true);
}

function handleDislike() {
    nameStore.appendInCollection(false);
}

function toggleDislikedNames() {
    showDislikedNames.value = !showDislikedNames.value;
}

function handleReset() {
    nameStore.clearLocalStorage();
    window.location.reload();
}
</script>

<template>
    <div class="baby-names-view">
        <div class="gender-toggle">
            <span>Lány</span>
            <label class="switch">
                <input
                    type="checkbox"
                    :checked="nameStore.isBoyNames"
                    @change="nameStore.toggleNameGender"
                >
                <span class="slider round" />
            </label>
            <span>Fiú</span>
        </div>

        <h1>{{ nameStore.isBoyNames ? 'Fiú nevek' : 'Lány nevek' }}</h1>
        <h3 class="current-name">
            Név: {{ nameStore.randomName }}
        </h3>
        <div class="button-container">
            <button
                class="like-button"
                @click="handleLike"
            >
                Like
            </button>
            <button
                class="dislike-button"
                @click="handleDislike"
            >
                Dislike
            </button>
        </div>
    </div>

    <div class="names-container">
        <div class="names-list-container">
            <h2>Tetszik:</h2>
            <ul class="names-list">
                <li
                    v-for="name in nameStore.likedNames"
                    :key="name"
                    class="names-item"
                >
                    {{ name }}
                </li>
            </ul>
        </div>

        <div class="danger-zone">
            <h2>Danger zone</h2>
            <button @click="handleReset">
                Alaphelyzetbe állítás
            </button>
        </div>

        <div class="names-list-container">
            <h2>Nem tetszik: </h2>
            <button
                class="show-hide-button"
                @click="toggleDislikedNames"
            >
                {{ showDislikedNames ? 'Rejtsd el' : 'Mutatsd' }} ami NEM tetszik!
            </button>
            <ul
                v-show="showDislikedNames"
                class="names-list"
            >
                <li
                    v-for="name in nameStore.dislikedNames"
                    :key="name"
                    class="names-item"
                >
                    {{ name }}
                </li>
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

.danger-zone {
    border: 1px solid red;
    padding: 1em;
    margin-top: 2em;
}

.gender-toggle {
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 20px;
}

.switch {
    position: relative;
    display: inline-block;
    width: 60px;
    height: 34px;
    margin: 0 10px;
}

.switch input {
    opacity: 0;
    width: 0;
    height: 0;
}

.slider {
    position: absolute;
    cursor: pointer;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: #ccc;
    transition: .4s;
}

.slider:before {
    position: absolute;
    content: "";
    height: 26px;
    width: 26px;
    left: 4px;
    bottom: 4px;
    background-color: white;
    transition: .4s;
}

input:checked + .slider {
    background-color: #277802;
}

input:checked + .slider:before {
    transform: translateX(26px);
}

.slider.round {
    border-radius: 34px;
}

.slider.round:before {
    border-radius: 50%;
}
</style>
