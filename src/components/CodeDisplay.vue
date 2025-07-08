<script setup>
defineProps({
  code: {
    type: String,
    required: true,
  },
  charStates: {
    type: Array,
    required: true,
  },
  currentIndex: {
    type: Number,
    required: true,
  }
});
</script>

<template>
  <div class="bg-slate-800 p-6 rounded-lg text-lg leading-relaxed shadow-lg flex">
    <div class="whitespace-pre-wrap break-words w-full">
      <span
        v-for="(char, index) in code"
        :key="index"
        :class="[
          {
            'text-emerald-400': charStates[index] === 'correct',
            'text-red-500 bg-red-900/50 rounded-sm': charStates[index] === 'incorrect',
            'text-slate-400': charStates[index] === 'untyped',
            'bg-slate-600 rounded-sm': index === currentIndex && charStates[index] !== 'incorrect',
            'outline-red-500 outline': index === currentIndex && charStates[index] === 'incorrect',
          }
        ]"
      >{{ char }}</span> </div>
  </div>
</template>

<style scoped>
</style>
