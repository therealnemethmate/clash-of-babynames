import { defineStore } from 'pinia';
import { computed, ref, watch } from 'vue';

import boyNamesData from '../assets/boy-names.json';
import girlNamesData from '../assets/girl-names.json';

export type Gender = 'boy' | 'girl';
export type Vote = 'like' | 'dislike';

export interface BabyName {
    id: string;
    name: string;
    gender: Gender;
    vote: Vote | null;
    votedAt: Date | null;
}

export const HUNGARIAN_ALPHABET: string[] = [
    'A', 'Á', 'B', 'C', 'Cs', 'D', 'Dz', 'Dzs', 'E', 'É',
    'F', 'G', 'Gy', 'H', 'I', 'Í', 'J', 'K', 'L', 'Ly',
    'M', 'N', 'Ny', 'O', 'Ó', 'Ö', 'Ő', 'P', 'Q', 'R',
    'S', 'Sz', 'T', 'Ty', 'U', 'Ú', 'Ü', 'Ű', 'V', 'W',
    'X', 'Y', 'Z', 'Zs',
];

const STORAGE_KEYS = {
    SELECTED_GENDER: 'selectedGender',
    LETTER_FILTER: 'letterFilter',
    NAMES_DATA: 'namesData',
};

export const useNameStore = defineStore('name', () => {
    // State
    const selectedGender = ref<Gender>(
        (localStorage.getItem(STORAGE_KEYS.SELECTED_GENDER) as Gender) || 'boy'
    );
    const letterFilter = ref<string[]>(
        localStorage.getItem(STORAGE_KEYS.LETTER_FILTER)
            ? JSON.parse(localStorage.getItem(STORAGE_KEYS.LETTER_FILTER)!)
            : []
    );
    
    // Initialize names
    const storedNames = localStorage.getItem(STORAGE_KEYS.NAMES_DATA);
    let initialNames: BabyName[] = [];

    if (storedNames) {
        initialNames = JSON.parse(storedNames).map((n: any) => ({
            ...n,
            votedAt: n.votedAt ? new Date(n.votedAt) : null
        }));
    } else {
        const boys = boyNamesData.names.map(name => ({
            id: name,
            name,
            gender: 'boy' as Gender,
            vote: null,
            votedAt: null
        }));
        const girls = girlNamesData.names.map(name => ({
            id: name,
            name,
            gender: 'girl' as Gender,
            vote: null,
            votedAt: null
        }));
        initialNames = [...boys, ...girls];
        shuffleArray(initialNames);
    }

    const names = ref<BabyName[]>(initialNames);
    
    // If we loaded from storage but it seems sorted (or we just want to ensure randomness on reload),
    // we could shuffle. However, to preserve the "deck" order across reloads, we might not want to.
    // But since the previous implementation relied on computed shuffle, the underlying storage might be alphabetical.
    // Let's shuffle if it's a fresh load OR if we want to ensure randomness. 
    // Actually, shuffling on every app load is a good "feature" - you get a fresh mix of the remaining names.
    // As long as we don't shuffle *during* the session (on vote), we are good.
    if (storedNames) {
        // Optional: Reshuffle on reload to give a fresh feeling? 
        // Or keep it stable? The user complained about stability during swipe.
        // Shuffling here (once per session) is stable during swipe.
        shuffleArray(names.value);
    }
    const lastVotedId = ref<string | null>(null); // For undo functionality

    // Persistence
    watch(selectedGender, (val) => localStorage.setItem(STORAGE_KEYS.SELECTED_GENDER, val));
    watch(letterFilter, (val) => localStorage.setItem(STORAGE_KEYS.LETTER_FILTER, JSON.stringify(val)), { deep: true });
    watch(names, (val) => localStorage.setItem(STORAGE_KEYS.NAMES_DATA, JSON.stringify(val)), { deep: true });

    // Helpers
    function shuffleArray<T>(array: T[]): T[] {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

    function nameMatchesFilter(name: string, selectedLetters: string[]): boolean {
        if (selectedLetters.length === 0) return true;
        
        const upperName = name.toUpperCase();
        // Sort by length descending to match digraphs first
        const sortedLetters = [...selectedLetters].sort((a, b) => b.length - a.length);
        
        for (const letter of sortedLetters) {
            if (upperName.startsWith(letter.toUpperCase())) {
                return true;
            }
        }
        return false;
    }

    // Computed
    const filteredNames = computed(() => {
        return names.value.filter(name => 
            name.gender === selectedGender.value &&
            name.vote === null &&
            nameMatchesFilter(name.name, letterFilter.value)
        );
    });

    // We need a stable shuffled list for the current session/filter
    // Since we shuffle 'names' on init, 'filteredNames' is already in a random, stable order.
    const shuffledNames = computed(() => {
        return filteredNames.value;
    });

    const votedCount = computed(() => 
        names.value.filter(n => n.vote !== null && n.gender === selectedGender.value).length
    );

    const totalCount = computed(() => 
        names.value.filter(n => n.gender === selectedGender.value).length
    );

    const progress = computed(() => {
        return totalCount.value > 0 ? votedCount.value / totalCount.value : 0;
    });

    const likedNames = computed(() => 
        names.value.filter(n => n.vote === 'like').sort((a, b) => b.votedAt!.getTime() - a.votedAt!.getTime())
    );

    const dislikedNames = computed(() => 
        names.value.filter(n => n.vote === 'dislike').sort((a, b) => b.votedAt!.getTime() - a.votedAt!.getTime())
    );

    // Actions
    function setGender(gender: Gender) {
        selectedGender.value = gender;
    }

    function toggleLetterFilter(letter: string) {
        if (letter === 'ALL') {
             letterFilter.value = [...HUNGARIAN_ALPHABET];
             return;
        }
        if (letter === 'NONE') {
            letterFilter.value = [];
            return;
        }

        const index = letterFilter.value.indexOf(letter);
        if (index === -1) {
            letterFilter.value.push(letter);
        } else {
            letterFilter.value.splice(index, 1);
        }
    }

    function voteName(id: string, vote: Vote) {
        const name = names.value.find(n => n.id === id);
        if (name) {
            name.vote = vote;
            name.votedAt = new Date();
            lastVotedId.value = id;
        }
    }

    function undoLastVote() {
        if (!lastVotedId.value) return;
        
        const name = names.value.find(n => n.id === lastVotedId.value);
        if (name && name.gender === selectedGender.value) {
            name.vote = null;
            name.votedAt = null;
            lastVotedId.value = null;
        }
    }

    function toggleVote(id: string) {
        const name = names.value.find(n => n.id === id);
        if (name && name.vote) {
            name.vote = name.vote === 'like' ? 'dislike' : 'like';
            name.votedAt = new Date();
        }
    }

    function resetAll() {
        names.value.forEach(n => {
            n.vote = null;
            n.votedAt = null;
        });
        lastVotedId.value = null;
    }

    return {
        // State
        selectedGender,
        letterFilter,
        names,
        
        // Computed
        filteredNames,
        shuffledNames,
        votedCount,
        totalCount,
        progress,
        likedNames,
        dislikedNames,
        canUndo: computed(() => !!lastVotedId.value),

        // Actions
        setGender,
        toggleLetterFilter,
        voteName,
        undoLastVote,
        toggleVote,
        resetAll
    };
});
