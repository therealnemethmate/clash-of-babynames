<script setup lang="ts">
import { computed, ref } from 'vue';

import { useNameStore } from '../stores/name';

const store = useNameStore();

const voteFilter = ref<'like' | 'dislike'>('like');
const genderFilter = ref<'all' | 'boy' | 'girl'>('all');

const displayedNames = computed(() => {
    const source = voteFilter.value === 'like' ? store.likedNames : store.dislikedNames;
  
    if (genderFilter.value === 'all') return source;
    return source.filter((n) => n.gender === genderFilter.value);
});

function toggleVote(id: string) {
    store.toggleVote(id);
}
</script>

<template>
    <div class="flex flex-col h-full max-w-lg mx-auto w-full p-4">
        <h1 class="text-2xl font-bold text-center mb-4 text-text-primary">
            Kedvencek
        </h1>

        <!-- Vote Filter -->
        <div class="flex bg-gray-5 rounded-lg p-1 mb-4">
            <button
                class="flex-1 py-1.5 text-sm font-medium rounded-md transition-all"
                :class="voteFilter === 'like' ? 'bg-card shadow text-green-600' : 'text-text-secondary'"
                @click="voteFilter = 'like'"
            >
                Tetszik ({{ store.likedNames.length }})
            </button>
            <button
                class="flex-1 py-1.5 text-sm font-medium rounded-md transition-all"
                :class="voteFilter === 'dislike' ? 'bg-card shadow text-red-600' : 'text-text-secondary'"
                @click="voteFilter = 'dislike'"
            >
                Nem tetszik ({{ store.dislikedNames.length }})
            </button>
        </div>

        <!-- Gender Filter -->
        <div class="flex justify-center gap-2 mb-6">
            <button
                v-for="option in ['all', 'boy', 'girl'] as const"
                :key="option"
                class="px-4 py-1.5 rounded-full text-sm font-medium transition-colors"
                :class="genderFilter === option ? 'bg-accent text-white' : 'bg-gray-5 text-text-secondary'"
                @click="genderFilter = option"
            >
                {{ option === 'all' ? 'Mind' : (option === 'boy' ? 'Fiú' : 'Lány') }}
            </button>
        </div>

        <!-- List -->
        <div class="flex-1 overflow-y-auto -mx-4 px-4">
            <div
                v-if="displayedNames.length === 0"
                class="flex flex-col items-center justify-center h-64 text-center text-text-secondary"
            >
                <div class="text-4xl mb-4 text-gray-300 dark:text-gray-700">
                    {{ voteFilter === 'like' ? '❤' : '💔' }}
                </div>
                <p v-if="voteFilter === 'like'">
                    Még nincs kedvenc neved.
                </p>
                <p v-else>
                    Még nem utasítottál el nevet.
                </p>
            </div>

            <ul
                v-else
                class="space-y-2 pb-4"
            >
                <li 
                    v-for="name in displayedNames" 
                    :key="name.id"
                    class="bg-card rounded-xl p-4 shadow-sm flex items-center justify-between group border border-transparent dark:border-gray-800"
                >
                    <div class="flex items-center gap-3">
                        <span class="text-2xl">{{ name.gender === 'boy' ? '👤' : '👗' }}</span>
                        <span class="text-lg font-bold text-text-primary">{{ name.name }}</span>
                    </div>
          
                    <button 
                        class="w-10 h-10 rounded-full flex items-center justify-center transition-colors"
                        :class="voteFilter === 'like' ? 'text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30' : 'text-green-500 hover:bg-green-50 dark:hover:bg-green-900/30'"
                        @click="toggleVote(name.id)"
                    >
                        <span class="text-xl leading-none mt-1">{{ voteFilter === 'like' ? '💔' : '❤' }}</span>
                    </button>
                </li>
            </ul>
        </div>
    </div>
</template>

<style scoped>
.bg-accent {
  background-color: var(--color-accent);
}
</style>
