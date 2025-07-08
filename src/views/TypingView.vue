<script setup>
import { ref, watch, nextTick } from 'vue';
import Settings from '../components/Settings.vue';
import CodeDisplay from '../components/CodeDisplay.vue';
import allSnippets from '../data/snippets.json';

// --- STATE MANAGEMENT ---
const selectedLanguage = ref('javascript');
const selectedDuration = ref(60);
const codeSnippet = ref('Pilih bahasa dan tekan Start untuk memulai...');

// State untuk logika pengetikan
const userInput = ref(''); // Menyimpan semua yang diketik user
const charStates = ref([]); // Array untuk status tiap karakter [untyped, correct, incorrect]
const currentIndex = ref(0); // Posisi kursor
const inputField = ref(null); // Referensi ke elemen input

// --- FUNCTIONS ---
const updateLanguage = (language) => {
  selectedLanguage.value = language;
};
const updateDuration = (duration) => {
  selectedDuration.value = duration;
};

// Fungsi untuk me-reset state dan memulai game baru
const startGame = () => {
  const filteredSnippets = allSnippets.filter(s => s.language === selectedLanguage.value);
  const randomIndex = Math.floor(Math.random() * filteredSnippets.length);
  codeSnippet.value = filteredSnippets[randomIndex].code;

  // Reset semua state pengetikan
  userInput.value = '';
  currentIndex.value = 0;
  // Inisialisasi 'charStates' dengan status 'untyped' untuk setiap karakter
  charStates.value = Array(codeSnippet.value.length).fill('untyped');

  // Fokus otomatis ke input field setelah kode baru dimuat
  nextTick(() => {
    inputField.value?.focus();
  });
};

// Menjalankan validasi setiap kali user mengetik
watch(userInput, (newInput) => {
  for (let i = 0; i < charStates.value.length; i++) {
    const typedChar = newInput[i];
    const originalChar = codeSnippet.value[i];

    if (typedChar === undefined) {
      // Karakter yang belum diketik atau sudah dihapus
      charStates.value[i] = 'untyped';
    } else if (typedChar === originalChar) {
      // Karakter benar
      charStates.value[i] = 'correct';
    } else {
      // Karakter salah
      charStates.value[i] = 'incorrect';
    }
  }
  // Update posisi kursor
  currentIndex.value = newInput.length;
});

// Fungsi untuk memastikan input field selalu fokus saat user mengklik area kode
const focusInput = () => {
  inputField.value?.focus();
}

</script>

<template>
  <div class="w-full">
    <Settings
      @languageChange="updateLanguage"
      @durationChange="updateDuration"
      @start="startGame"
    />

    <div @click="focusInput" class="relative cursor-text">
      <CodeDisplay
        :code="codeSnippet"
        :char-states="charStates"
        :current-index="currentIndex"
      />
      <input
        ref="inputField"
        v-model="userInput"
        type="text"
        class="absolute top-0 left-0 w-full h-full opacity-0 p-6"
        autofocus
      />
    </div>
  </div>
</template>
