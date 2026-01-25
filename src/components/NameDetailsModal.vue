<script setup lang="ts">
import type { BabyName } from '../stores/name';

defineProps<{
  name: BabyName;
  isOpen: boolean;
}>();

const emit = defineEmits<{
  (e: 'close'): void;
}>();
</script>

<template>
  <div v-if="isOpen" class="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
    <!-- Backdrop -->
    <div 
      class="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity" 
      @click="emit('close')"
    ></div>

    <!-- Modal Content -->
    <div 
      class="relative w-full max-w-md bg-card rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh] animate-scale-in"
      role="dialog"
      aria-modal="true"
    >
      <!-- Header -->
      <div class="p-4 sm:p-6 pb-2 flex items-start justify-between">
        <div>
          <div class="text-4xl sm:text-5xl mb-2">
            {{ name.gender === 'boy' ? '👤' : '👗' }}
          </div>
          <h2 class="text-2xl sm:text-3xl font-bold text-text-primary">{{ name.name }}</h2>
          <p class="text-base sm:text-lg text-text-secondary font-medium">
            {{ name.gender === 'boy' ? 'Fiú' : 'Lány' }}
          </p>
        </div>
        <button 
          @click="emit('close')"
          class="p-2 rounded-full hover:bg-gray-5 dark:hover:bg-gray-700 transition-colors text-text-secondary"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <!-- Scrollable Body -->
      <div class="p-4 sm:p-6 pt-2 overflow-y-auto custom-scrollbar">
        <!-- Name Days -->
        <div v-if="name.nameDays" class="mb-4 sm:mb-6">
          <h3 class="text-sm font-bold text-text-secondary uppercase tracking-wider mb-2">Névnap(ok)</h3>
          <p class="text-text-primary leading-relaxed">{{ name.nameDays }}</p>
        </div>

        <!-- Meaning -->
        <div v-if="name.meaning">
          <h3 class="text-sm font-bold text-text-secondary uppercase tracking-wider mb-2">Jelentése</h3>
          <p class="text-text-primary leading-relaxed text-base sm:text-lg italic">"{{ name.meaning }}"</p>
        </div>
      </div>

      <!-- Footer Action -->
      <div class="p-4 border-t border-gray-5 dark:border-gray-800 bg-gray-5/50 dark:bg-gray-800/50">
        <button 
          @click="emit('close')"
          class="w-full py-3 rounded-xl bg-accent text-white font-bold shadow-lg hover:opacity-90 transition-opacity"
        >
          Bezárás
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.animate-scale-in {
  animation: scaleIn 0.2s cubic-bezier(0.34, 1.56, 0.64, 1);
}

@keyframes scaleIn {
  from { opacity: 0; transform: scale(0.95) translateY(10px); }
  to { opacity: 1; transform: scale(1) translateY(0); }
}

/* Custom Scrollbar for the modal content */
.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background-color: var(--color-text-secondary);
  border-radius: 20px;
  opacity: 0.5;
}
</style>
