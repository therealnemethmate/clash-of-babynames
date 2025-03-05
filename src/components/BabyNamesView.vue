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
            <span class="label">Név:</span> {{ nameStore.randomName }}
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
        <div class="names-list-container liked-names">
            <h2 class="section-title">Tetszik:</h2>
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

        <div class="danger-zone-container">
            <div class="danger-zone">
                <h2 class="section-title">Danger zone</h2>
                <button @click="handleReset">
                    Alaphelyzetbe állítás
                </button>
            </div>
        </div>

        <div class="names-list-container disliked-names">
            <h2 class="section-title">Nem tetszik:</h2>
            <button
                class="show-hide-button"
                @click="toggleDislikedNames"
            >
                {{ showDislikedNames ? 'Rejtsd el' : 'Mutatsd' }} ami NEM tetszik!
            </button>
            <div class="names-list-wrapper" :class="{ 'hidden': !showDislikedNames }">
                <ul class="names-list">
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
    </div>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap');

body {
    background-color: #121212;
    color: #ffffff;
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
}

h1 {
    color: #4ecca3;
    font-weight: 600;
    margin-bottom: 1.5rem;
    font-size: 2.2rem;
}

p {
    color: #e0e0e0;
}

.current-name {
    color: #ffffff;
    font-size: 2em;
    font-weight: 500;
    margin-bottom: 1.5em;
}

.label {
    font-weight: 600;
    color: #ffffff;
}

.section-title {
    color: #ffffff;
    font-weight: 600;
    font-size: 1.5rem;
    margin-bottom: 1rem;
}

.button-container {
    margin-top: 1.5em;
    display: flex;
    justify-content: center;
    gap: 1rem;
}

.like-button, .dislike-button, .show-hide-button {
    border: none;
    border-radius: 8px;
    padding: 0.8em 1.5em;
    font-size: 1em;
    cursor: pointer;
    transition: all 0.2s ease;
    font-weight: 500;
}

.like-button {
    background-color: #42b883;
    color: white;
}

.like-button:hover {
    background-color: #3aa876;
}

.dislike-button {
    background-color: #ff4b5c;
    color: white;
}

.dislike-button:hover {
    background-color: #e6435c;
}

.show-hide-button {
    background-color: #2c2c2c;
    color: #ffffff;
    margin-top: 1em;
    font-weight: 500;
}

.show-hide-button:hover {
    background-color: #3c3c3c;
}

.names-container {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    margin-top: 3em;
    gap: 2rem;
}

.names-list-container {
    flex: 1 1 300px;
    min-width: 0;
}

.danger-zone-container {
    display: flex;
    justify-content: center;
    width: 100%;
    order: 2;
}

.danger-zone {
    border: 1px solid #ff4b5c;
    border-radius: 8px;
    padding: 1.5em;
    margin: 2em auto;
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 250px;
    background-color: rgba(255, 75, 92, 0.1);
}

.danger-zone button {
    background-color: #ff4b5c;
    color: white;
    border: none;
    border-radius: 8px;
    padding: 0.8em 1.5em;
    font-size: 1em;
    cursor: pointer;
    transition: background-color 0.2s ease;
    width: 100%;
    max-width: 200px;
    font-weight: 500;
}

.danger-zone button:hover {
    background-color: #e6435c;
}

.names-list {
    list-style: none;
    padding: 0;
    font-size: 1.2em;
    font-weight: 400;
    color: #e0e0e0;
}

.names-list li {
    margin-bottom: 0.8em;
    text-transform: capitalize;
    padding: 0.5em;
    border-radius: 6px;
    background-color: #2c2c2c;
}

.gender-toggle {
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 30px;
}

.gender-toggle span {
    color: #ffffff;
    font-weight: 600;
    font-size: 1.1rem;
}

.switch {
    position: relative;
    display: inline-block;
    width: 60px;
    height: 34px;
    margin: 0 15px;
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
    background-color: #555;
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
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

input:checked + .slider {
    background-color: #42b883;
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

.baby-names-view {
    max-width: 800px;
    margin: 0 auto;
    padding: 2rem;
    background-color: #121212;
    border-radius: 12px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
}

h2 {
    color: #ffffff;
    font-weight: 600;
    margin-bottom: 1rem;
}

.names-list li, .current-name, h1, h2, button {
    word-break: break-word;
    overflow-wrap: break-word;
}

/* Responsive styles */
@media (max-width: 768px) {
    .baby-names-view {
        padding: 1rem;
    }
    
    h1 {
        font-size: 1.8rem;
    }
    
    .current-name {
        font-size: 1.6em;
    }
    
    .names-container {
        flex-direction: column;
        gap: 1.5rem;
    }
    
    .danger-zone-container {
        order: 3;
        width: 100%;
    }
    
    .danger-zone {
        width: 100%;
        max-width: 400px;
        margin: 1em auto;
    }
    
    .button-container {
        gap: 0.5rem;
    }
    
    .like-button, .dislike-button {
        padding: 0.7em 1.2em;
    }
    
    .section-title {
        font-size: 1.3rem;
    }
}

/* Small mobile devices */
@media (max-width: 480px) {
    .baby-names-view {
        padding: 0.8rem;
    }
    
    h1 {
        font-size: 1.5rem;
        margin-bottom: 1rem;
    }
    
    .current-name {
        font-size: 1.4em;
        margin-bottom: 1em;
    }
    
    .button-container {
        flex-direction: column;
        width: 100%;
        gap: 0.8rem;
    }
    
    .like-button, .dislike-button {
        width: 100%;
    }
    
    .gender-toggle span {
        font-size: 0.9rem;
    }
    
    .switch {
        width: 50px;
        height: 28px;
        margin: 0 10px;
    }
    
    .slider:before {
        height: 20px;
        width: 20px;
    }
    
    input:checked + .slider:before {
        transform: translateX(22px);
    }
    
    .names-list {
        font-size: 1em;
    }
    
    .names-list li {
        padding: 0.4em;
    }
    
    .show-hide-button {
        width: 100%;
        padding: 0.6em 1em;
    }
}

.names-list-wrapper {
    min-height: 50px;
    transition: opacity 0.3s ease, max-height 0.3s ease;
    max-height: 500px;
    overflow: hidden;
}

.names-list-wrapper.hidden {
    opacity: 0;
    max-height: 0;
    overflow: hidden;
}

.names-list-container {
    flex: 1 1 300px;
    min-width: 0;
    display: flex;
    flex-direction: column;
}

.names-list {
    list-style: none;
    padding: 0;
    font-size: 1.2em;
    font-weight: 400;
    color: #e0e0e0;
    flex-grow: 1;
}

/* Ensure consistent layout for both columns */
.liked-names, .disliked-names {
    display: flex;
    flex-direction: column;
    min-height: 300px;
}
</style>
