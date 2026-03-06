import { defineStore } from 'pinia';
import { computed, ref, watch } from 'vue';

import boyNamesData from '../assets/boy-names.json';
import girlNamesData from '../assets/girl-names.json';
import namesMetadata from '../assets/names-metadata.json';

export type Gender = 'boy' | 'girl';
export type Vote = 'like' | 'dislike';

export type Player = 1 | 2;

export interface BabyName {
    id: string;
    name: string;
    gender: Gender;
    vote: Vote | null;
    votedAt: Date | null;
    vote2: Vote | null;
    votedAt2: Date | null;
    meaning?: string;
    nameDays?: string;
}

export const HUNGARIAN_ALPHABET: string[] = [
    'A',
    'Á',
    'B',
    'C',
    'Cs',
    'D',
    'Dz',
    'Dzs',
    'E',
    'É',
    'F',
    'G',
    'Gy',
    'H',
    'I',
    'Í',
    'J',
    'K',
    'L',
    'Ly',
    'M',
    'N',
    'Ny',
    'O',
    'Ó',
    'Ö',
    'Ő',
    'P',
    'Q',
    'R',
    'S',
    'Sz',
    'T',
    'Ty',
    'U',
    'Ú',
    'Ü',
    'Ű',
    'V',
    'W',
    'X',
    'Y',
    'Z',
    'Zs',
];

const STORAGE_KEYS = {
    SELECTED_GENDER: 'selectedGender',
    LETTER_FILTER: 'letterFilter',
    NAMES_DATA: 'namesData',
    IS_DARK_MODE: 'isDarkMode',
    COUPLE_MODE: 'coupleMode',
    ACTIVE_PLAYER: 'activePlayer',
};

export const useNameStore = defineStore('name', () => {
    // State
    const selectedGender = ref<Gender>(
        (localStorage.getItem(STORAGE_KEYS.SELECTED_GENDER) as Gender) || 'boy',
    );
    const letterFilter = ref<string[]>(
        localStorage.getItem(STORAGE_KEYS.LETTER_FILTER)
            ? JSON.parse(localStorage.getItem(STORAGE_KEYS.LETTER_FILTER)!)
            : [],
    );
    const isDarkMode = ref<boolean>(
        localStorage.getItem(STORAGE_KEYS.IS_DARK_MODE) === 'true',
    );
    const coupleMode = ref<boolean>(
        localStorage.getItem(STORAGE_KEYS.COUPLE_MODE) === 'true',
    );
    const activePlayer = ref<Player>(
        (Number(localStorage.getItem(STORAGE_KEYS.ACTIVE_PLAYER)) || 1) as Player,
    );

    // Initialize names
    const storedNames = localStorage.getItem(STORAGE_KEYS.NAMES_DATA);
    let initialNames: BabyName[] = [];

    // Helper to get metadata
    const getMetadata = (name: string) => {
        const meta = (namesMetadata as Record<string, { meaning: string; nameDays: string }>)[name];
        // console.log(`Metadata for ${name}:`, meta);
        return meta ? { meaning: meta.meaning, nameDays: meta.nameDays } : {};
    };

    if (storedNames) {
        initialNames = JSON.parse(storedNames).map((n: { votedAt: string | number | Date; vote2?: Vote | null; votedAt2?: string | number | Date; name: string; }) => ({
            ...n,
            votedAt: n.votedAt ? new Date(n.votedAt) : null,
            vote2: n.vote2 ?? null,
            votedAt2: n.votedAt2 ? new Date(n.votedAt2) : null,
            // Ensure metadata is populated even for stored names (in case of update)
            ...getMetadata(n.name),
        }));
    } else {
        const boys = boyNamesData.names.map((name) => ({
            id: name,
            name,
            gender: 'boy' as Gender,
            vote: null,
            votedAt: null,
            vote2: null,
            votedAt2: null,
            ...getMetadata(name),
        }));
        const girls = girlNamesData.names.map((name) => ({
            id: name,
            name,
            gender: 'girl' as Gender,
            vote: null,
            votedAt: null,
            vote2: null,
            votedAt2: null,
            ...getMetadata(name),
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
    const UNDO_HISTORY_LIMIT = 10;
    const undoHistory = ref<string[]>([]); // Stack of voted IDs for multi-level undo

    // Persistence
    watch(selectedGender, (val) => localStorage.setItem(STORAGE_KEYS.SELECTED_GENDER, val));
    watch(letterFilter, (val) => localStorage.setItem(STORAGE_KEYS.LETTER_FILTER, JSON.stringify(val)), { deep: true });
    watch(names, (val) => localStorage.setItem(STORAGE_KEYS.NAMES_DATA, JSON.stringify(val)), { deep: true });
    watch(coupleMode, (val) => localStorage.setItem(STORAGE_KEYS.COUPLE_MODE, String(val)));
    watch(activePlayer, (val) => localStorage.setItem(STORAGE_KEYS.ACTIVE_PLAYER, String(val)));
    watch(isDarkMode, (val) => {
        localStorage.setItem(STORAGE_KEYS.IS_DARK_MODE, String(val));
        if (val) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    }, { immediate: true });

    // Helpers
    function shuffleArray<T>(array: T[]): T[] {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

    // Sort alphabet by length descending to match longest digraphs first (e.g. Dzs before Dz before D)
    const SORTED_ALPHABET_BY_LENGTH = [...HUNGARIAN_ALPHABET].sort((a, b) => b.length - a.length);

    function getFirstLetter(name: string): string {
        const upper = name.toUpperCase();
        for (const letter of SORTED_ALPHABET_BY_LENGTH) {
            if (upper.startsWith(letter.toUpperCase())) {
                return letter;
            }
        }
        return upper.charAt(0);
    }

    function nameMatchesFilter(name: string, selectedLetters: string[]): boolean {
        if (selectedLetters.length === 0) return true;
        const firstLetter = getFirstLetter(name);
        return selectedLetters.includes(firstLetter);
    }

    function getVote(n: BabyName): Vote | null {
        return activePlayer.value === 1 ? n.vote : n.vote2;
    }

    function getVotedAt(n: BabyName): Date | null {
        return activePlayer.value === 1 ? n.votedAt : n.votedAt2;
    }

    // Computed
    const filteredNames = computed(() => {
        return names.value.filter((name) =>
            name.gender === selectedGender.value
            && getVote(name) === null
            && nameMatchesFilter(name.name, letterFilter.value),
        );
    });

    // We need a stable shuffled list for the current session/filter
    // Since we shuffle 'names' on init, 'filteredNames' is already in a random, stable order.
    const shuffledNames = computed(() => {
        return filteredNames.value;
    });

    const votedCount = computed(() =>
        names.value.filter((n) =>
            getVote(n) !== null
            && n.gender === selectedGender.value
            && nameMatchesFilter(n.name, letterFilter.value),
        ).length,
    );

    const totalCount = computed(() => 
        names.value.filter((n) => 
            n.gender === selectedGender.value
            && nameMatchesFilter(n.name, letterFilter.value),
        ).length,
    );

    const progress = computed(() => {
        return totalCount.value > 0 ? votedCount.value / totalCount.value : 0;
    });

    const likedNames = computed(() =>
        names.value.filter((n) => getVote(n) === 'like').sort((a, b) => getVotedAt(b)!.getTime() - getVotedAt(a)!.getTime()),
    );

    const dislikedNames = computed(() =>
        names.value.filter((n) => getVote(n) === 'dislike').sort((a, b) => getVotedAt(b)!.getTime() - getVotedAt(a)!.getTime()),
    );

    const matchedNames = computed(() =>
        names.value.filter((n) => n.vote === 'like' && n.vote2 === 'like'),
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
        const name = names.value.find((n) => n.id === id);
        if (name) {
            if (activePlayer.value === 1) {
                name.vote = vote;
                name.votedAt = new Date();
            } else {
                name.vote2 = vote;
                name.votedAt2 = new Date();
            }
            undoHistory.value.push(id);
            if (undoHistory.value.length > UNDO_HISTORY_LIMIT) {
                undoHistory.value.shift();
            }
        }
    }

    function undoLastVote() {
        if (undoHistory.value.length === 0) return;

        const lastId = undoHistory.value.pop()!;
        const name = names.value.find((n) => n.id === lastId);
        if (name && name.gender === selectedGender.value) {
            if (activePlayer.value === 1) {
                name.vote = null;
                name.votedAt = null;
            } else {
                name.vote2 = null;
                name.votedAt2 = null;
            }
        }
    }

    function toggleVote(id: string) {
        const name = names.value.find((n) => n.id === id);
        if (name && getVote(name)) {
            const newVote = getVote(name) === 'like' ? 'dislike' : 'like';
            if (activePlayer.value === 1) {
                name.vote = newVote;
                name.votedAt = new Date();
            } else {
                name.vote2 = newVote;
                name.votedAt2 = new Date();
            }
        }
    }

    function resetAll() {
        names.value.forEach((n) => {
            n.vote = null;
            n.votedAt = null;
            n.vote2 = null;
            n.votedAt2 = null;
        });
        undoHistory.value = [];
    }

    function setActivePlayer(player: Player) {
        activePlayer.value = player;
        undoHistory.value = [];
    }

    function toggleCoupleMode() {
        coupleMode.value = !coupleMode.value;
        if (!coupleMode.value) {
            activePlayer.value = 1;
        }
    }

    function toggleDarkMode() {
        isDarkMode.value = !isDarkMode.value;
    }

    return {
        // State
        selectedGender,
        letterFilter,
        names,
        isDarkMode,
        coupleMode,
        activePlayer,

        // Computed
        filteredNames,
        shuffledNames,
        votedCount,
        totalCount,
        progress,
        likedNames,
        dislikedNames,
        matchedNames,
        canUndo: computed(() => undoHistory.value.length > 0),
        undoCount: computed(() => undoHistory.value.length),

        // Actions
        setGender,
        toggleLetterFilter,
        voteName,
        undoLastVote,
        toggleVote,
        resetAll,
        toggleDarkMode,
        setActivePlayer,
        toggleCoupleMode,
    };
});
