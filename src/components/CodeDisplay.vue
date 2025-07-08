<script setup>
defineProps({
  code: {
    type: String,
    required: true,
  },
  // Menerima array status untuk setiap karakter
  charStates: {
    type: Array,
    required: true,
  },
  // Menerima posisi kursor saat ini
  currentIndex: {
    type: Number,
    required: true,
  }
});
</script>

<template>
  <div class="bg-slate-800 p-6 rounded-lg text-lg leading-relaxed shadow-lg relative">
    <pre><code class="whitespace-pre-wrap break-words">
      <span
        v-for="(char, index) in code"
        :key="index"
        :class="[
          // Terapkan class berdasarkan status dari 'charStates'
          {
            'text-emerald-400': charStates[index] === 'correct',
            'text-red-500 bg-red-900/50 rounded-sm': charStates[index] === 'incorrect',
            'text-slate-400': charStates[index] === 'untyped',
            // Class untuk kursor
            'bg-slate-600 rounded-sm': index === currentIndex
          }
        ]"
      >{{ char }}</span>
    </code></pre>
  </div>
</template>
