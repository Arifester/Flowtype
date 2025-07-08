<script setup>
import { ref } from 'vue'
import Settings from '../components/Settings.vue'
import CodeDisplay from '../components/CodeDisplay.vue'

// Import data statis kita
import allSnippets from '../data/snippets.json';

// --- STATE MANAGEMENT ---
// Menyimpan state atau data yang bisa berubah-ubah.
const selectedLanguage = ref('javascript'); // Nilai default saat aplikasi dimuat
const selectedDuration = ref(60); // Nilai default
const codeSnippet = ref('Pilih bahasa dan tekan Start untuk memulai...');
const isLoading = ref(false);

// --- FUNCTIONS ---

// Fungsi ini dipanggil oleh Settings.vue ketika dropdown bahasa berubah
const updateLanguage = (language) => {
  selectedLanguage.value = language;
  console.log('Bahasa dipilih:', selectedLanguage.value);
};

// Fungsi ini dipanggil oleh Settings.vue ketika dropdown waktu berubah
const updateDuration = (duration) => {
  selectedDuration.value = duration;
  console.log('Durasi dipilih:', selectedDuration.value);
};

// Fungsi utama yang dipanggil saat tombol "Start" ditekan
const startGame = () => {
  console.log('Memulai game!');
  isLoading.value = true;

  // Filter snippets berdasarkan bahasa yang dipilih
  const filteredSnippets = allSnippets.filter(
    s => s.language === selectedLanguage.value
  );

  if (filteredSnippets.length === 0) {
    codeSnippet.value = `Maaf, belum ada snippet untuk bahasa ${selectedLanguage.value}.`;
    isLoading.value = false;
    return;
  }

  // Pilih satu snippet secara acak dari yang sudah difilter
  const randomIndex = Math.floor(Math.random() * filteredSnippets.length);
  codeSnippet.value = filteredSnippets[randomIndex].code;

  isLoading.value = false;
};
</script>

<template>
  <div class="w-full">
    <Settings 
      @languageChange="updateLanguage"
      @durationChange="updateDuration"
      @start="startGame"
    />

    <div v-if="isLoading" class="text-center p-8">
      <p>Memuat...</p>
    </div>

    <CodeDisplay v-else :code="codeSnippet" />
    
    </div>
</template>
