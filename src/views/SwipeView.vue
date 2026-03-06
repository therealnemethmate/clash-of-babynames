<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue';

import NameDetailsModal from '../components/NameDetailsModal.vue';
import SwipeCard from '../components/SwipeCard.vue';
import { type Player, useNameStore } from '../stores/name';

const store = useNameStore();

const currentCard = computed(() => store.shuffledNames[0]);
const nextCard = computed(() => store.shuffledNames[1]);

const showDetails = ref(false);

function handleSwipe(direction: 'left' | 'right') {
    if (!currentCard.value) return;
    store.voteName(currentCard.value.id, direction === 'right' ? 'like' : 'dislike');
}

function handleKeydown(e: KeyboardEvent) {
    if (showDetails.value) return;
    if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') {
        handleSwipe('right');
    } else if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') {
        handleSwipe('left');
    } else if (e.key === 'z' || e.key === 'Z') {
        store.undoLastVote();
    }
}

onMounted(() => window.addEventListener('keydown', handleKeydown));
onUnmounted(() => window.removeEventListener('keydown', handleKeydown));

function clearFilter() {
    store.toggleLetterFilter('NONE');
}

const filterText = computed(() => {
    const letters = store.letterFilter;
    if (letters.length <= 5) {
        return `Szűrő: ${letters.join(', ')}`;
    }
    return `Szűrő: ${letters.slice(0, 4).join(', ')} +${letters.length - 4}`;
});
</script>

<template>
    <div class="flex flex-col h-full max-w-lg mx-auto w-full p-2 sm:p-4">
        <!-- Gender Toggle -->
        <div class="flex bg-gray-5 rounded-lg p-1 mb-2">
            <button
                class="flex-1 py-1.5 text-sm font-medium rounded-md transition-all"
                :class="store.selectedGender === 'boy' ? 'bg-card shadow text-blue-600' : 'text-text-secondary'"
                @click="store.setGender('boy')"
            >
                Fiú
            </button>
            <button
                class="flex-1 py-1.5 text-sm font-medium rounded-md transition-all"
                :class="store.selectedGender === 'girl' ? 'bg-card shadow text-pink-600' : 'text-text-secondary'"
                @click="store.setGender('girl')"
            >
                Lány
            </button>
        </div>

        <!-- Player Switcher (Couple Mode) -->
        <div
            v-if="store.coupleMode"
            class="flex bg-gray-5 rounded-lg p-1 mb-2"
        >
            <button
                v-for="p in ([1, 2] as Player[])"
                :key="p"
                class="flex-1 py-1.5 text-sm font-medium rounded-md transition-all"
                :class="store.activePlayer === p ? 'bg-card shadow text-accent' : 'text-text-secondary'"
                @click="store.setActivePlayer(p)"
            >
                {{ p === 1 ? 'Szülő 1' : 'Szülő 2' }}
            </button>
        </div>

        <!-- Filter Indicator -->
        <div
            v-if="store.letterFilter.length > 0"
            class="flex items-center justify-between bg-orange-100 dark:bg-orange-900/30 text-orange-800 dark:text-orange-200 px-3 py-2 rounded-lg mb-2 text-sm animate-fade-in"
        >
            <div class="flex items-center">
                <span class="mr-2">🔽</span>
                <span class="font-medium">{{ filterText }}</span>
            </div>
            <button
                class="text-orange-800 dark:text-orange-200 hover:text-orange-900 font-bold px-2"
                @click="clearFilter"
            >
                ✕
            </button>
        </div>

        <!-- Progress Bar -->
        <div class="mb-2">
            <div class="h-2 bg-gray-5 rounded-full overflow-hidden">
                <div
                    class="h-full transition-all duration-500 ease-out"
                    :class="store.selectedGender === 'boy' ? 'bg-blue-500' : 'bg-pink-500'"
                    :style="{ width: `${store.progress * 100}%` }"
                />
            </div>
            <div class="text-center text-xs text-text-secondary mt-1">
                {{ Math.round(store.progress * 100) }}% kész
            </div>
        </div>

        <!-- Stats Row -->
        <div class="flex justify-between items-center px-4 mb-4">
            <div class="text-center">
                <div class="text-lg font-bold text-text-primary">
                    {{ store.totalCount - store.votedCount }}
                </div>
                <div class="text-xs text-text-secondary uppercase tracking-wide">
                    Hátravan
                </div>
            </div>

            <div class="text-center">
                <div class="text-lg font-bold text-text-primary">
                    {{ store.votedCount }}
                </div>
                <div class="text-xs text-text-secondary uppercase tracking-wide">
                    Szavazva
                </div>
            </div>

            <button
                class="relative w-10 h-10 rounded-full bg-card shadow flex items-center justify-center transition-opacity text-text-primary"
                :class="{ 'opacity-50 cursor-not-allowed': !store.canUndo }"
                :disabled="!store.canUndo"
                @click="store.undoLastVote"
            >
                <span class="text-xl leading-none mt-1">↩</span>
                <span
                    v-if="store.undoCount > 1"
                    class="absolute -top-1 -right-1 min-w-[18px] h-[18px] rounded-full bg-accent text-white text-xs font-bold flex items-center justify-center"
                >
                    {{ store.undoCount }}
                </span>
            </button>
        </div>

        <!-- Card Stack -->
        <div class="relative flex-1 w-full max-h-[400px] min-h-[280px]">
            <div
                v-if="!currentCard"
                class="flex flex-col items-center justify-center h-full text-center p-6 text-text-primary"
            >
                <div class="text-4xl mb-4">
                    ✓
                </div>
                <h3 class="text-xl font-bold mb-2">
                    Nincs több név!
                </h3>
                <p class="text-text-secondary mb-6">
                    Az összes {{ store.selectedGender === 'boy' ? 'fiú' : 'lány' }} nevet megnézted.
                </p>
                <button
                    v-if="store.canUndo"
                    class="text-blue-600 font-medium"
                    @click="store.undoLastVote"
                >
                    Visszavonás
                </button>
            </div>

            <template v-else>
                <!-- Next Card (Background) -->
                <div
                    v-if="nextCard"
                    class="absolute inset-0 transform scale-95 translate-y-2 opacity-60 z-0"
                >
                    <SwipeCard
                        :name="nextCard"
                        :index="1"
                        class="pointer-events-none"
                    />
                </div>

                <!-- Current Card (Foreground) -->
                <div class="absolute inset-0 z-10">
                    <SwipeCard
                        :key="currentCard.id"
                        :name="currentCard"
                        :index="0"
                        @swipe="handleSwipe"
                        @show-details="showDetails = true"
                    />
                </div>
            </template>
        </div>

        <!-- Swipe Buttons -->
        <div
            v-if="currentCard"
            class="flex justify-center items-center gap-6 mt-4"
        >
            <button
                class="w-14 h-14 rounded-full bg-red-100 dark:bg-red-900/30 text-red-500 flex items-center justify-center shadow-md hover:scale-110 active:scale-95 transition-transform"
                @click="handleSwipe('left')"
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="h-7 w-7"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                >
                    <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2.5"
                        d="M6 18L18 6M6 6l12 12"
                    />
                </svg>
            </button>
            <button
                class="w-14 h-14 rounded-full bg-green-100 dark:bg-green-900/30 text-green-500 flex items-center justify-center shadow-md hover:scale-110 active:scale-95 transition-transform"
                @click="handleSwipe('right')"
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="h-7 w-7"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                >
                    <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2.5"
                        d="M5 13l4 4L19 7"
                    />
                </svg>
            </button>
        </div>

        <!-- Details Modal -->
        <NameDetailsModal
            v-if="currentCard"
            :name="currentCard"
            :is-open="showDetails"
            @close="showDetails = false"
        />
    </div>
</template>

<style scoped>
.animate-fade-in {
  animation: fadeIn 0.2s ease-out;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(-5px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>
