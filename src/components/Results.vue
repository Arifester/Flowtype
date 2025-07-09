<script setup>
defineProps({
  wpm: { type: Number, required: true },
  accuracy: { type: Number, required: true },
  errors: { type: Number, required: true },
  language: { type: String, required: true },
  duration: { type: Number, required: true },
});

const emit = defineEmits(['retry']);

const handleRetry = () => {
  emit('retry');
}

// Mengubah 'javascript' menjadi 'JavaScript' untuk tampilan
const capitalize = (s) => s.charAt(0).toUpperCase() + s.slice(1);

</script>

<template>
  <div class="bg-slate-800 p-8 rounded-lg text-center shadow-lg w-full max-w-2xl mx-auto">
    <div class="text-slate-400 text-sm uppercase font-semibold tracking-wider mb-4">
      {{ capitalize(language) }} - {{ duration / 60 }} Menit
    </div>
    
    <div class="flex justify-around my-6">
      <div class="w-1/3">
        <p class="text-slate-400 text-lg">WPM</p>
        <p class="text-5xl font-bold text-white">{{ wpm }}</p>
      </div>
      <div class="w-1/3 border-x-2 border-slate-600">
        <p class="text-slate-400 text-lg">Akurasi</p>
        <p class="text-5xl font-bold text-white">{{ accuracy }}<span class="text-2xl">%</span></p>
      </div>
      <div class="w-1/3">
        <p class="text-slate-400 text-lg">Kesalahan</p>
        <p class="text-5xl font-bold text-red-500">{{ errors }}</p>
      </div>
    </div>

    <button 
      @click="handleRetry"
      class="bg-emerald-500 text-slate-900 font-bold px-6 py-3 rounded-md hover:bg-emerald-400 transition-colors text-lg"
    >
      Coba Lagi
    </button>
  </div>
</template>
