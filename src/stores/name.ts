import { defineStore } from 'pinia';
import { ref, watch } from 'vue';

import girlNamesData from '../assets/girl-names.json';
import { createLocalStorageWatcher } from '../utils';

export const useNameStore = defineStore('name', () => {
    const names = ref(girlNamesData.names);
    const likedNamesFromLocalStorage = localStorage.getItem('likedNames') ?? '[]';
    const dislikedNamesFromLocalStorage = localStorage.getItem('dislikedNames') ?? '[]';

    const likedNames = ref<string[]>(JSON.parse(likedNamesFromLocalStorage));
    watch(likedNames, createLocalStorageWatcher('likedNames'));

    const dislikedNames = ref<string[]>(JSON.parse(dislikedNamesFromLocalStorage));
    watch(dislikedNames, createLocalStorageWatcher('dislikedNames'));

    const randomName = ref(pickRandomName());
    names.value = names.value.filter(
        (name) => !likedNames.value.includes(name) || !dislikedNames.value.includes(name),
    );

    function pickRandomName() {
        if (names.value.length === 0) {
            return 'No more names left :(';
        }

        const randomIndex = Math.floor(Math.random() * names.value.length);
        if (likedNames.value.includes(names.value[randomIndex])) {
            return pickRandomName();
        }
        
        if (dislikedNames.value.includes(names.value[randomIndex])) {
            return pickRandomName();
        }

        return names.value[randomIndex];
    }
    
    function appendInCollection(liked: boolean) {
        liked
            ? likedNames.value.push(randomName.value) 
            : dislikedNames.value.push(randomName.value);
    }
    
    function removeName() {
        names.value = names.value.filter((name) => name !== randomName.value);
    }

    return {
        names,
        randomName,
        likedNames,
        dislikedNames,
        pickRandomName,
        appendInCollection,
        removeName,
    };
});
