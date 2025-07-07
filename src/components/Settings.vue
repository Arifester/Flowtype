<script setup>
// Mendefinisikan event apa saja yang bisa dikirim komponen ini ke parent
const emit = defineEmits(['languageChange', 'durationChange', 'start']);

// Fungsi yang akan dijalankan ketika dropdown bahasa berubah
const handleLanguageChange = (event) => {
  emit('languageChange', event.target.value);
};

// Fungsi yang akan dijalankan ketika dropdown waktu berubah
const handleDurationChange = (event) => {
  // Mengirim nilai sebagai angka, bukan string
  emit('durationChange', parseInt(event.target.value, 10)); 
};

// Fungsi untuk memberitahu parent bahwa game harus dimulai
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
        @change="handleDurationChange" 
        class="bg-slate-700 text-emerald-400 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono"
      >
        <option value="60">1 menit</option>
        <option value="180">3 menit</option>
        <option value="300">5 menit</option>
      </select>
    </div>

    <button 
      @click="handleStartClick" 
      class="bg-emerald-500 text-slate-900 font-bold px-6 py-2 rounded-md hover:bg-emerald-400 transition-colors"
    >
      Start
    </button>
  </div>
</template>
