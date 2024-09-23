import { defineStore } from 'pinia';
import { ref, watch } from 'vue';

import boyNamesData from '../assets/boy-names.json';
import girlNamesData from '../assets/girl-names.json';
import { createLocalStorageWatcher } from '../utils';

export const useNameStore = defineStore('name', () => {
    const names = ref<string[]>([]);
    const isBoyNames = ref(JSON.parse(localStorage.getItem('isBoyNames') ?? 'true'));
    watch(isBoyNames, (value) => localStorage.setItem('isBoyNames', JSON.stringify(value)));

    const boyNamesFromLocalStorage = localStorage.getItem('boyNames');
    const girlNamesFromLocalStorage = localStorage.getItem('girlNames');
    const likedNamesFromLocalStorage = localStorage.getItem('likedNames') ?? '[]';
    const dislikedNamesFromLocalStorage = localStorage.getItem('dislikedNames') ?? '[]';

    const likedNames = ref<string[]>(JSON.parse(likedNamesFromLocalStorage));
    const dislikedNames = ref<string[]>(JSON.parse(dislikedNamesFromLocalStorage));

    const boyNames = ref<string[]>(boyNamesFromLocalStorage ? JSON.parse(boyNamesFromLocalStorage) : boyNamesData.names);
    const girlNames = ref<string[]>(girlNamesFromLocalStorage ? JSON.parse(girlNamesFromLocalStorage) : girlNamesData.names);

    const randomName = ref(pickRandomName());

    watch(boyNames, createLocalStorageWatcher('boyNames'));
    watch(girlNames, createLocalStorageWatcher('girlNames'));
    
    function updateNames() {
        names.value = isBoyNames.value ? boyNames.value : girlNames.value;
        names.value = names.value.filter(
            (name) => !likedNames.value.includes(name) && !dislikedNames.value.includes(name),
        );
        randomName.value = pickRandomName();
    }

    watch(isBoyNames, updateNames, { immediate: true });

    function pickRandomName() {
        if (names.value.length === 0) {
            return 'No more names left :(';
        }
    
        const cryptoRandom = new Uint32Array(1);
        window.crypto.getRandomValues(cryptoRandom);
        const randomIndex = cryptoRandom[0] % names.value.length;
    
        return names.value[randomIndex];
    }
    
    function appendInCollection(liked: boolean) {
        if (randomName.value !== 'No more names left :(') {
            liked
                ? likedNames.value.push(randomName.value) 
                : dislikedNames.value.push(randomName.value);
            updateNames();
        }
    }
    
    function removeName() {
        if (isBoyNames.value) {
            boyNames.value = boyNames.value.filter((name) => name !== randomName.value);
        } else {
            girlNames.value = girlNames.value.filter((name) => name !== randomName.value);
        }
        updateNames();
    }

    function toggleNameGender() {
        isBoyNames.value = !isBoyNames.value;
        updateNames();
    }

    function clearLocalStorage() {
        localStorage.removeItem('boyNames');
        localStorage.removeItem('girlNames');
        localStorage.removeItem('likedNames');
        localStorage.removeItem('dislikedNames');
        localStorage.removeItem('isBoyNames');
    }

    return {
        names,
        randomName,
        likedNames,
        dislikedNames,
        isBoyNames,
        pickRandomName,
        appendInCollection,
        removeName,
        clearLocalStorage,
        toggleNameGender,
    };
});
