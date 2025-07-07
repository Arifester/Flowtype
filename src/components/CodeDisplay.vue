<script setup>
defineProps({
  code: {
    type: String,
    required: true,
  }
});
</script>

<template>
  <div class="bg-slate-800 p-6 rounded-lg text-lg leading-relaxed shadow-lg">
    <pre><code><span v-for="(char, index) in code" :key="index">{{ char }}</span></code></pre>
  </div>
</template>
