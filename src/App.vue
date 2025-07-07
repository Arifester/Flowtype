<script setup>
import TypingView from './views/TypingView.vue';
</script>

<template>
  <div class="bg-slate-900 text-slate-300 min-h-screen font-mono flex flex-col items-center p-8">
    <header class="mb-8">
      <h1 class="text-4xl font-bold text-emerald-400">🔥 Flowtype</h1>
      <p class="text-center text-slate-400">Unlock your coding flow through muscle memory.</p>
    </header>

    <main class="w-full max-w-4xl">
      <TypingView />
    </main>
  </div>
</template>
