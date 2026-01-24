<script setup lang="ts">
import { computed, ref } from 'vue';
import type { BabyName } from '../stores/name';

const props = defineProps<{
  name: BabyName;
  index: number;
}>();
// Use props to avoid unused variable error
// eslint-disable-next-line @typescript-eslint/no-unused-expressions
props;

const emit = defineEmits<{
  (e: 'swipe', direction: 'left' | 'right'): void;
}>();

// Touch/Drag logic
const isDragging = ref(false);
const startX = ref(0);
const currentX = ref(0);
const startY = ref(0);
const currentY = ref(0);

const SWIPE_THRESHOLD = 80;

// Animation state
const isSwipingAway = ref(false);
const swipeDirection = ref<'left' | 'right' | null>(null);

const cardStyle = computed(() => {
  // Exit animation
  if (isSwipingAway.value && swipeDirection.value) {
    const xTrans = swipeDirection.value === 'right' ? 400 : -400;
    const rotation = swipeDirection.value === 'right' ? 15 : -15;
    return {
      transform: `translateX(${xTrans}px) rotate(${rotation}deg)`,
      opacity: 0,
      transition: 'transform 0.15s ease-out, opacity 0.15s ease-out',
    };
  }

  if (!isDragging.value) return {};
  
  const xDiff = currentX.value - startX.value;
  const rotation = xDiff / 25;
  
  return {
    transform: `translateX(${xDiff}px) rotate(${rotation}deg)`,
    transition: 'none',
  };
});

const overlayStyle = computed(() => {
  if (!isDragging.value) return { opacity: 0 };
  
  const xDiff = currentX.value - startX.value;
  const opacity = Math.min(Math.abs(xDiff) / (SWIPE_THRESHOLD * 2), 0.6);
  
  if (xDiff > 0) {
    return { backgroundColor: 'var(--color-like)', opacity };
  } else {
    return { backgroundColor: 'var(--color-dislike)', opacity };
  }
});

const hintOpacity = computed(() => {
  if (!isDragging.value) return 0;
  const xDiff = currentX.value - startX.value;
  return Math.min(Math.abs(xDiff) / (SWIPE_THRESHOLD), 1);
});

function onTouchStart(e: TouchEvent | MouseEvent) {
  isDragging.value = true;
  if ('touches' in e) {
    startX.value = e.touches[0].clientX;
    startY.value = e.touches[0].clientY;
  } else {
    startX.value = e.clientX;
    startY.value = e.clientY;
  }
  currentX.value = startX.value;
  currentY.value = startY.value;
}

function onTouchMove(e: TouchEvent | MouseEvent) {
  if (!isDragging.value) return;
  
  // Prevent scrolling while dragging
  if (e.cancelable) {
    e.preventDefault();
  }
  
  let clientX, clientY;
  if ('touches' in e) {
    clientX = e.touches[0].clientX;
    clientY = e.touches[0].clientY;
  } else {
    clientX = e.clientX;
    clientY = e.clientY;
  }
  
  currentX.value = clientX;
  currentY.value = clientY;
}

function onTouchEnd() {
  if (!isDragging.value) return;
  isDragging.value = false;
  
  const xDiff = currentX.value - startX.value;
  
  if (xDiff > SWIPE_THRESHOLD) {
    triggerSwipe('right');
  } else if (xDiff < -SWIPE_THRESHOLD) {
    triggerSwipe('left');
  }
}

function triggerSwipe(direction: 'left' | 'right') {
  isSwipingAway.value = true;
  swipeDirection.value = direction;
  
  // Wait for animation to finish before emitting
  setTimeout(() => {
    emit('swipe', direction);
    // Reset state (though component will likely be destroyed)
    isSwipingAway.value = false;
    swipeDirection.value = null;
  }, 150);
}
</script>

<template>
  <div
    class="card absolute w-full h-full bg-card rounded-3xl shadow-xl overflow-hidden select-none cursor-grab active:cursor-grabbing touch-none"
    :style="cardStyle"
    @mousedown="onTouchStart"
    @mousemove="onTouchMove"
    @mouseup="onTouchEnd"
    @mouseleave="onTouchEnd"
    @touchstart.passive="onTouchStart"
    @touchmove="onTouchMove"
    @touchend="onTouchEnd"
  >
    <!-- Overlay for color tint -->
    <div class="absolute inset-0 z-10 pointer-events-none transition-colors" :style="overlayStyle"></div>

    <!-- Content -->
    <div class="flex flex-col items-center justify-center h-full relative z-20">
      <div class="text-6xl mb-6">
        {{ name.gender === 'boy' ? '👤' : '👗' }}
      </div>
      
      <h2 class="text-4xl font-bold mb-2 text-center text-text-primary">
        {{ name.name }}
      </h2>
      
      <p class="text-lg text-text-secondary font-medium">
        {{ name.gender === 'boy' ? 'Fiú' : 'Lány' }}
      </p>
      
      <!-- Swipe Hints -->
      <div 
        class="absolute left-6 top-6 border-4 border-red-500 rounded-lg px-4 py-2 transform -rotate-12 opacity-0 transition-opacity"
        :style="{ opacity: (currentX - startX) < 0 ? hintOpacity : 0 }"
      >
        <span class="text-red-500 font-bold text-2xl uppercase">Nem tetszik</span>
      </div>
      
      <div 
        class="absolute right-6 top-6 border-4 border-green-500 rounded-lg px-4 py-2 transform rotate-12 opacity-0 transition-opacity"
        :style="{ opacity: (currentX - startX) > 0 ? hintOpacity : 0 }"
      >
        <span class="text-green-500 font-bold text-2xl uppercase">Tetszik</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.card {
  transition: transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
  will-change: transform;
}
</style>
