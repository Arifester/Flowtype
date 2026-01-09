<script setup>
import { useNotification } from './composables/useNotification.js';
import TypingView from './views/TypingView.vue';
// Hapus impor ThemeSwitcher
import Notification from './components/Notification.vue';

const { notification } = useNotification();
</script>

<template>
  <div class="bg-slate-900 text-slate-300 min-h-screen font-mono flex flex-col p-4 sm:p-8 md:p-12">
    <Notification 
      :show="notification.show"
      :message="notification.message"
      :type="notification.type"
    />

    <header class="text-center mb-10">
      <h1 class="text-4xl sm:text-5xl font-bold text-emerald-400">Flowtype</h1>
      <p class="text-slate-400 mt-2">Unlock your coding flow through muscle memory.</p>
    </header>

    <main class="w-full max-w-4xl mx-auto flex-grow">
      <TypingView />
    </main>

    <footer class="w-full text-center mt-12 text-slate-500 text-sm">
      <p>Built with Vue.js & Tailwind CSS</p>
    </footer>
  </div>
</template>
