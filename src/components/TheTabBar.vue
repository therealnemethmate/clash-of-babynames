<script setup lang="ts">
const tabs = [
    { name: 'swipe', label: 'Nevek', icon: 'M4 6h16M4 12h16M4 18h16' }, // Stack icon placeholder
    { name: 'favorites', label: 'Kedvencek', icon: 'M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z' }, // Heart icon
    { name: 'settings', label: 'Beállítások', icon: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z M15 12a3 3 0 11-6 0 3 3 0 016 0z' }, // Cog icon
];
</script>

<template>
    <nav class="tabbar fixed bottom-0 left-0 right-0 z-40 bg-card/95 border-t border-gray-5 pb-safe backdrop-blur-sm">
        <div class="mx-auto flex justify-around items-center h-16 max-w-lg">
            <router-link
                v-for="tab in tabs"
                :key="tab.name"
                :to="{ name: tab.name }"
                class="flex flex-col items-center justify-center w-full h-full text-text-secondary hover:text-accent transition-colors active:scale-95"
                active-class="text-accent"
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="h-6 w-6 mb-1"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                >
                    <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        :d="tab.icon"
                    />
                </svg>
                <span class="text-xs font-medium">{{ tab.label }}</span>
            </router-link>
        </div>
    </nav>
</template>

<style scoped>
.tabbar {
  height: calc(var(--tab-bar-height) + env(safe-area-inset-bottom));
}

.pb-safe {
  padding-bottom: env(safe-area-inset-bottom);
}
.text-accent {
  color: var(--color-accent);
}
</style>
