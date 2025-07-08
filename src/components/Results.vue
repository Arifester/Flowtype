<script setup>
defineProps({
  wpm: { type: Number, required: true },
  accuracy: { type: Number, required: true },
  errors: { type: Number, required: true },
});

const emit = defineEmits(['retry']);

const refreshPage = () => {
  window.location.reload();
}
</script>

<template>
  <div class="bg-slate-800 p-8 rounded-lg text-center shadow-lg w-full max-w-xl mx-auto">
    <h2 class="text-2xl font-bold text-emerald-400">Hasil Akhir</h2>
    
    <div class="flex justify-around my-8">
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
      @click="refreshPage"
      class="bg-emerald-500 text-slate-900 font-bold px-6 py-3 rounded-md hover:bg-emerald-400 transition-colors text-lg"
    >
      Coba Lagi
    </button>
  </div>
</template>
