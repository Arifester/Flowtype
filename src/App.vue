<script setup>
import TypingView from './views/TypingView.vue';
import ThemeSwitcher from './components/ThemeSwitcher.vue'; // Import komponen
</script>

<template>
  <div class="bg-slate-100 dark:bg-slate-900 text-slate-800 dark:text-slate-300 min-h-screen font-mono flex flex-col p-4 sm:p-8 md:p-12 transition-colors duration-300">
    <div class="absolute top-4 right-4">
      <ThemeSwitcher />
    </div>

    <header class="text-center mb-10">
      <h1 class="text-4xl sm:text-5xl font-bold text-emerald-600 dark:text-emerald-400">Flowtype</h1>
      <p class="text-slate-600 dark:text-slate-400 mt-2">Unlock your coding flow through muscle memory.</p>
    </header>

    <main class="w-full max-w-4xl mx-auto flex-grow">
      <TypingView />
    </main>

    <footer class="w-full text-center mt-12 text-slate-500 dark:text-slate-500 text-sm">
      <p>Built with Cihuy using Vue.js & Tailwind CSS.</p>
    </footer>
  </div>
</template>
