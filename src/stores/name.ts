import { defineStore } from 'pinia';
import { ref, watch } from 'vue';

import boyNamesData from '../assets/boy-names.json';
//import girlNamesData from '../assets/girl-names.json';
import { createLocalStorageWatcher } from '../utils';

export const useNameStore = defineStore('name', () => {
    const namesFromLocalStorage = localStorage.getItem('names');
    const likedNamesFromLocalStorage = localStorage.getItem('likedNames') ?? '[]';
    const dislikedNamesFromLocalStorage = localStorage.getItem('dislikedNames') ?? '[]';

    // TODO - Add a way to switch between boy and girl names
    const names = ref<string[]>(namesFromLocalStorage ? JSON.parse(namesFromLocalStorage) : boyNamesData.names);
    watch(names, createLocalStorageWatcher('names'));

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

        return names.value[Math.floor(Math.random() * names.value.length)];
    }
    
    function appendInCollection(liked: boolean) {
        liked
            ? likedNames.value.push(randomName.value) 
            : dislikedNames.value.push(randomName.value);
    }
    
    function removeName() {
        names.value = names.value.filter((name) => name !== randomName.value);
    }

    function clearLocalStorage() {
        localStorage.removeItem('names');
        localStorage.removeItem('likedNames');
        localStorage.removeItem('dislikedNames');
    }

    return {
        names,
        randomName,
        likedNames,
        dislikedNames,
        pickRandomName,
        appendInCollection,
        removeName,
        clearLocalStorage,
    };
});
