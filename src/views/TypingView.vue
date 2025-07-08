<script setup>
import { ref, watch, nextTick } from 'vue';
import Settings from '../components/Settings.vue';
import CodeDisplay from '../components/CodeDisplay.vue';
import Results from '../components/Results.vue';
import allSnippets from '../data/snippets.json';

// --- FUNGSI PINTAR UNTUK INDENTASI ---
const dedent = (str) => {
  const lines = str.split('\n');
  if (lines[0] === '') lines.shift();

  let baseIndent = Infinity;
  for (const line of lines) {
    if (line.trim().length > 0) {
      const indent = line.match(/^\s*/)[0].length;
      if (indent < baseIndent) {
        baseIndent = indent;
      }
    }
  }

  if (baseIndent < Infinity) {
    return lines.map(line => line.substring(baseIndent)).join('\n');
  }
  return str;
};

// --- STATE MANAGEMENT ---
const selectedLanguage = ref('javascript');
const selectedDuration = ref(60);
const codeSnippet = ref('Pilih bahasa dan tekan Start untuk memulai...');
const userInput = ref('');
const charStates = ref([]);
const currentIndex = ref(0);
const inputField = ref(null);
const gameStatus = ref('ready'); // 'ready', 'typing', 'finished'
const timer = ref(60);
let timerId = null;

// State untuk hasil
const wpm = ref(0);
const accuracy = ref(0);
const errors = ref(0);
const totalCorrectChars = ref(0); // Akumulator skor

// --- FUNCTIONS ---
const updateLanguage = (language) => { selectedLanguage.value = language; };
const updateDuration = (duration) => { 
  selectedDuration.value = duration;
  timer.value = duration;
};

const loadNextSnippet = () => {
  const filteredSnippets = allSnippets.filter(s => s.language === selectedLanguage.value);
  const randomIndex = Math.floor(Math.random() * filteredSnippets.length);
  const rawSnippet = filteredSnippets[randomIndex].code;
  
  codeSnippet.value = dedent(rawSnippet);

  userInput.value = '';
  currentIndex.value = 0;
  charStates.value = Array(codeSnippet.value.length).fill('untyped');
};

const startGame = () => {
  gameStatus.value = 'ready';
  totalCorrectChars.value = 0;
  errors.value = 0;
  timer.value = selectedDuration.value;
  if(timerId) clearInterval(timerId);

  loadNextSnippet();
  
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
  const finalCorrectCharsInCurrentSnippet = userInput.value.split('').filter((char, index) => char === codeSnippet.value[index]).length;
  const finalTotalCorrect = totalCorrectChars.value + finalCorrectCharsInCurrentSnippet;
  const totalTyped = totalCorrectChars.value + userInput.value.length;
  
  if (totalTyped > 0) {
    accuracy.value = Math.round((finalTotalCorrect / totalTyped) * 100);
  } else {
    accuracy.value = 0;
  }
  
  const timeInMinutes = selectedDuration.value / 60;
  wpm.value = Math.round((finalTotalCorrect / 5) / timeInMinutes);
};

const focusInput = () => inputField.value?.focus();

const handleTab = () => {
  userInput.value += '  '; // Tambah 2 spasi untuk indentasi
};

// --- WATCHERS ---
watch(userInput, (newInput) => {
  if (gameStatus.value === 'finished') return;
  if (gameStatus.value === 'ready' && newInput.length > 0) startTimer();

  for (let i = 0; i < codeSnippet.value.length; i++) {
    const typedChar = newInput[i];
    const originalChar = codeSnippet.value[i];
    if (typedChar === undefined) charStates.value[i] = 'untyped';
    else if (typedChar === originalChar) charStates.value[i] = 'correct';
    else charStates.value[i] = 'incorrect';
  }
  currentIndex.value = newInput.length;

  if (currentIndex.value === codeSnippet.value.length) {
    totalCorrectChars.value += codeSnippet.value.length;
    const errorCount = charStates.value.filter(state => state === 'incorrect').length;
    errors.value += errorCount;
    loadNextSnippet();
  }
});

watch(currentIndex, () => {
  nextTick(() => {
    const cursorEl = document.getElementById('cursor');
    if (cursorEl) {
      cursorEl.scrollIntoView({ block: 'nearest' });
    }
  });
});

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
          @keydown.tab.prevent="handleTab"
          type="text"
          class="absolute top-0 left-0 w-full h-full opacity-0 p-6"
          :disabled="gameStatus === 'finished'"
          autofocus
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
