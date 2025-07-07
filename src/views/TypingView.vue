<script setup>
import { ref } from 'vue'
import Settings from '../components/Settings.vue'
import CodeDisplay from '../components/CodeDisplay.vue'

// Import data statis kita
import allSnippets from '../data/snippets.json'; 
// Import service Gemini (kita akan buat ini nanti)
// import { generateSnippet } from '../services/geminiService.js';

// --- STATE MANAGEMENT ---
const codeSnippet = ref('Pilih bahasa dan tekan Start untuk memulai...');
const isLoading = ref(false);

// State untuk pilihan user
const selectedLanguage = ref('javascript');
const selectedDuration = ref(60);
const useAI = ref(false); // Defaultnya tidak pakai AI

// --- LOGIC ---

// Fungsi untuk mengambil snippet dari file JSON lokal
const getRandomSnippet = () => {
  const filteredSnippets = allSnippets.filter(s => s.language === selectedLanguage.value);
  if (filteredSnippets.length === 0) {
    codeSnippet.value = `Maaf, belum ada snippet untuk bahasa ${selectedLanguage.value}.`;
    return;
  }
  const randomIndex = Math.floor(Math.random() * filteredSnippets.length);
  codeSnippet.value = filteredSnippets[randomIndex].code;
};

// Fungsi untuk memulai game
const startGame = async () => {
  isLoading.value = true;
  
  if (useAI.value) {
    // Mode AI: Panggil Gemini API
    try {
      // codeSnippet.value = await generateSnippet(selectedLanguage.value, selectedDuration.value);
      // Untuk sekarang, kita simulasi saja
      codeSnippet.value = `// Kode ini di-generate oleh AI untuk ${selectedLanguage.value}...\nconsole.log("AI Power!");`;
    } catch (error) {
      console.error("Gagal fetch dari AI:", error);
      codeSnippet.value = "Gagal mengambil kode dari AI. Silakan coba lagi.";
    }
  } else {
    // Mode Default: Ambil dari JSON lokal (instan!)
    getRandomSnippet();
  }

  isLoading.value = false;
};

</script>

<template>
  <div class="w-full">
    <Settings v-model="useAI" />

    <div v-if="isLoading" class="text-center p-8">
      <p>Mempersiapkan kode...</p>
    </div>

    <CodeDisplay v-else :code="codeSnippet" />
    
    </div>
</template>
