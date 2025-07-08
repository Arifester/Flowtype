<script setup>
import { ref, watch, nextTick } from 'vue';
import Settings from '../components/Settings.vue';
import CodeDisplay from '../components/CodeDisplay.vue';
import Results from '../components/Results.vue'; // Impor komponen hasil
import allSnippets from '../data/snippets.json';

// --- STATE MANAGEMENT ---
const selectedLanguage = ref('javascript');
const selectedDuration = ref(60);
const codeSnippet = ref('Pilih bahasa dan tekan Start untuk memulai...');

// State untuk logika pengetikan
const userInput = ref('');
const charStates = ref([]);
const currentIndex = ref(0);
const inputField = ref(null);

// State untuk game flow
const gameStatus = ref('ready'); // 'ready', 'typing', 'finished'
const timer = ref(60);
let timerId = null;

// State untuk hasil
const wpm = ref(0);
const accuracy = ref(0);
const errors = ref(0);

// --- FUNCTIONS ---
const updateLanguage = (language) => { selectedLanguage.value = language; };
const updateDuration = (duration) => { 
  selectedDuration.value = duration;
  timer.value = duration;
};

const startGame = () => {
  const filteredSnippets = allSnippets.filter(s => s.language === selectedLanguage.value);
  const randomIndex = Math.floor(Math.random() * filteredSnippets.length);
  codeSnippet.value = filteredSnippets[randomIndex].code;

  // Reset semua state
  gameStatus.value = 'ready';
  userInput.value = '';
  currentIndex.value = 0;
  charStates.value = Array(codeSnippet.value.length).fill('untyped');
  timer.value = selectedDuration.value;
  if(timerId) clearInterval(timerId);

  nextTick(() => inputField.value?.focus());
};

const startTimer = () => {
  gameStatus.value = 'typing';
  timerId = setInterval(() => {
    if (timer.value > 0) {
      timer.value--;
    } else {
      finishGame();
    }
  }, 1000);
};

const finishGame = () => {
  clearInterval(timerId);
  gameStatus.value = 'finished';
  calculateResults();
};

const calculateResults = () => {
  const typedChars = userInput.value.length;
  const correctChars = charStates.value.filter(state => state === 'correct').length;
  const errorCount = charStates.value.filter(state => state === 'incorrect').length;

  errors.value = errorCount;
  
  if (typedChars > 0) {
    accuracy.value = Math.round((correctChars / typedChars) * 100);
  } else {
    accuracy.value = 0;
  }
  
  // WPM = (jumlah karakter benar / 5) / (waktu dalam menit)
  const timeInMinutes = selectedDuration.value / 60;
  wpm.value = Math.round((correctChars / 5) / timeInMinutes);
};

watch(userInput, (newInput) => {
  if (gameStatus.value === 'finished') return;
  
  if (gameStatus.value === 'ready' && newInput.length > 0) {
    startTimer();
  }

  for (let i = 0; i < codeSnippet.value.length; i++) {
    const typedChar = newInput[i];
    const originalChar = codeSnippet.value[i];

    if (typedChar === undefined) {
      charStates.value[i] = 'untyped';
    } else if (typedChar === originalChar) {
      charStates.value[i] = 'correct';
    } else {
      charStates.value[i] = 'incorrect';
    }
  }
  currentIndex.value = newInput.length;

  // Cek jika user selesai mengetik sebelum waktu habis
  if (currentIndex.value === codeSnippet.value.length) {
    finishGame();
  }
});

const focusInput = () => inputField.value?.focus();
</script>

<template>
  <div class="w-full">
    <Settings 
      v-if="gameStatus !== 'typing'"
      @languageChange="updateLanguage"
      @durationChange="updateDuration"
      @start="startGame"
    />

    <div v-if="gameStatus !== 'finished'">
      <div class="text-center text-5xl font-bold text-emerald-400 mb-6">
        {{ timer }}
      </div>
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
          :disabled="gameStatus === 'finished'"
        />
      </div>
    </div>

    <Results 
      v-if="gameStatus === 'finished'"
      :wpm="wpm"
      :accuracy="accuracy"
      :errors="errors"
    />
  </div>
</template>
