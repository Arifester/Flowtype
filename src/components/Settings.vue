<script setup>
// 1. TERIMA PROPS BARU UNTUK MODE AI
defineProps({
  language: String,
  duration: Number,
  aiMode: Boolean, // Prop untuk status toggle AI
});

// 2. DAFTARKAN EMIT BARU
const emit = defineEmits([
  'languageChange', 
  'durationChange', 
  'start',
  'update:aiMode' // Emit untuk v-model
]);

// Fungsi-fungsi lama tetap sama
const handleLanguageChange = (event) => {
  emit('languageChange', event.target.value);
};
const handleDurationChange = (event) => {
  emit('durationChange', parseInt(event.target.value, 10)); 
};
const handleStartClick = () => {
  emit('start');
};
</script>

<template>
  <div class="flex flex-wrap justify-center items-center gap-4 mb-8">
    <div class="flex items-center gap-2">
      <label for="language" class="text-slate-400">Language:</label>
      <select 
        id="language"
        :value="language"
        @change="handleLanguageChange" 
        class="bg-slate-700 text-emerald-400 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono"
      >
        <option value="javascript">JavaScript</option>
        <option value="python">Python</option>
        <option value="java">Java</option>
        <option value="php">PHP</option>
      </select>
    </div>

    <div class="flex items-center gap-2">
      <label for="duration" class="text-slate-400">Time:</label>
      <select 
        id="duration"
        :value="duration"
        @change="handleDurationChange" 
        class="bg-slate-700 text-emerald-400 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono"
      >
        <option value="60">1 minute</option>
        <option value="180">3 minutes</option>
        <option value="300">5 minutes</option>
      </select>
    </div>

    <div class="flex items-center gap-2 p-2 rounded-md bg-slate-700">
      <label for="ai-toggle" class="text-slate-400 cursor-pointer text-sm font-semibold">✨ AI Mode</label>
      <input 
        type="checkbox" 
        id="ai-toggle" 
        :checked="aiMode"
        @change="$emit('update:aiMode', $event.target.checked)"
        class="w-4 h-4 text-emerald-600 bg-gray-700 border-gray-600 rounded focus:ring-emerald-500 focus:ring-2"
      >
    </div>
    
    <button 
      @click="handleStartClick" 
      class="bg-emerald-500 text-slate-900 font-bold px-6 py-2 rounded-md hover:bg-emerald-400 transition-colors"
    >
      Start
    </button>
  </div>
</template>
