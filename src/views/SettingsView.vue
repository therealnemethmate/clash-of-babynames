<script setup lang="ts">
import { ref } from 'vue';
import { useNameStore, HUNGARIAN_ALPHABET, type Gender } from '../stores/name';

const store = useNameStore();
const showResetConfirm = ref(false);

function handleReset() {
  store.resetAll();
  showResetConfirm.value = false;
  window.location.reload(); // Reload to ensure fresh state
}
</script>

<template>
  <div class="flex flex-col h-full max-w-lg mx-auto w-full p-4 overflow-y-auto">
    <h1 class="text-2xl font-bold text-center mb-6">Beállítások</h1>

    <!-- Preferences -->
    <section class="mb-8">
      <h2 class="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">Beállítások</h2>
      <div class="bg-white rounded-xl shadow-sm overflow-hidden">
        <div class="p-4 flex items-center justify-between">
          <span class="font-medium">Alapértelmezett nem</span>
          <select 
            :value="store.selectedGender"
            @change="store.setGender(($event.target as HTMLSelectElement).value as Gender)"
            class="bg-gray-100 border-none rounded-lg py-1.5 px-3 text-sm font-medium focus:ring-2 focus:ring-accent"
          >
            <option value="boy">Fiú</option>
            <option value="girl">Lány</option>
          </select>
        </div>
      </div>
      <p class="text-xs text-gray-500 mt-2 px-2">Ez a beállítás határozza meg, melyik nem legyen kiválasztva az app indításakor.</p>
    </section>

    <!-- Filters -->
    <section class="mb-8">
      <h2 class="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">Szűrők</h2>
      <div class="bg-white rounded-xl shadow-sm p-4">
        <p class="text-sm font-medium mb-3">Csak ezekkel a betűkkel kezdődő nevek:</p>
        
        <div class="flex flex-wrap gap-2 mb-4">
          <button
            v-for="letter in HUNGARIAN_ALPHABET"
            :key="letter"
            class="letter-chip text-sm font-medium transition-colors"
            :class="store.letterFilter.includes(letter) ? 'bg-accent text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'"
            @click="store.toggleLetterFilter(letter)"
          >
            {{ letter }}
          </button>
        </div>

        <div class="flex gap-3 pt-2 border-t border-gray-100">
          <button @click="store.toggleLetterFilter('ALL')" class="text-sm text-accent font-medium">Mind</button>
          <button @click="store.toggleLetterFilter('NONE')" class="text-sm text-gray-500 font-medium">Egyik sem</button>
        </div>
      </div>
      <p class="text-xs text-gray-500 mt-2 px-2">Ha nincs kiválasztva egy betű sem, minden név megjelenik.</p>
    </section>

    <!-- Statistics -->
    <section class="mb-8">
      <h2 class="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">Statisztikák</h2>
      <div class="bg-white rounded-xl shadow-sm overflow-hidden divide-y divide-gray-100">
        <div class="p-4 flex justify-between items-center">
          <span class="flex items-center gap-2"><span class="text-lg">📋</span> Összes név</span>
          <span class="font-bold">{{ store.totalCount }}</span>
        </div>
        <div class="p-4 flex justify-between items-center">
          <span class="flex items-center gap-2"><span class="text-lg">❤</span> Kedvelt nevek</span>
          <span class="font-bold text-green-600">{{ store.likedNames.length }}</span>
        </div>
        <div class="p-4 flex justify-between items-center">
          <span class="flex items-center gap-2"><span class="text-lg">💔</span> Elutasított nevek</span>
          <span class="font-bold text-red-600">{{ store.dislikedNames.length }}</span>
        </div>
        <div class="p-4 flex justify-between items-center">
          <span class="flex items-center gap-2"><span class="text-lg">❓</span> Még nem értékelt</span>
          <span class="font-bold text-gray-500">{{ store.totalCount - store.votedCount }}</span>
        </div>
      </div>
    </section>

    <!-- Danger Zone -->
    <section class="mb-8">
      <h2 class="text-sm font-semibold text-red-500 uppercase tracking-wider mb-3">Veszélyzóna</h2>
      <div class="bg-red-50 rounded-xl border border-red-100 p-4">
        <button 
          @click="showResetConfirm = true"
          class="w-full bg-white border border-red-200 text-red-600 font-bold py-3 rounded-lg shadow-sm hover:bg-red-50 transition-colors"
        >
          🔄 Alaphelyzetbe állítás
        </button>
        <p class="text-xs text-red-400 mt-2 text-center">Az összes szavazat törlődik és újrakezdheted a választást.</p>
      </div>
    </section>

    <!-- About -->
    <section class="text-center text-gray-400 text-sm pb-8">
      <p>Verzió 1.0.0</p>
      <p>Készítette: Németh Máté</p>
    </section>

    <!-- Confirmation Modal -->
    <div v-if="showResetConfirm" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div class="bg-white rounded-2xl shadow-xl max-w-sm w-full p-6 animate-scale-in">
        <h3 class="text-xl font-bold mb-2">Alaphelyzetbe állítás</h3>
        <p class="text-gray-600 mb-6">Biztosan törölni szeretnéd az összes szavazatot? Ez a művelet nem vonható vissza.</p>
        <div class="flex gap-3">
          <button 
            @click="showResetConfirm = false"
            class="flex-1 py-2.5 font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
          >
            Mégsem
          </button>
          <button 
            @click="handleReset"
            class="flex-1 py-2.5 font-bold text-white bg-red-500 rounded-lg hover:bg-red-600"
          >
            Törlés
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.letter-chip {
  min-width: 36px;
  height: 32px;
  padding: 0 8px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.text-accent {
  color: var(--color-accent);
}

.bg-accent {
  background-color: var(--color-accent);
}

.focus\:ring-accent:focus {
  --tw-ring-color: var(--color-accent);
}

.animate-scale-in {
  animation: scaleIn 0.2s cubic-bezier(0.34, 1.56, 0.64, 1);
}

@keyframes scaleIn {
  from { opacity: 0; transform: scale(0.9); }
  to { opacity: 1; transform: scale(1); }
}
</style>
