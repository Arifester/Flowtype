<script setup>
import { ref, watch, nextTick } from 'vue';
import { ArrowPathIcon, ArrowUturnLeftIcon } from '@heroicons/vue/24/solid'
import Settings from '../components/Settings.vue';
import CodeDisplay from '../components/CodeDisplay.vue';
import Results from '../components/Results.vue';
import allSnippets from '../data/snippets.json';

const dedent = (str) => {
  const lines = str.split('\n');
  if (lines[0] === '') lines.shift();
  let baseIndent = Infinity;
  for (const line of lines) {
    if (line.trim().length > 0) {
      const indent = line.match(/^\s*/)[0].length;
      if (indent < baseIndent) baseIndent = indent;
    }
  }
  if (baseIndent < Infinity) return lines.map(line => line.substring(baseIndent)).join('\n');
  return str;
};

// State dengan nilai default yang akan jadi "sumber kebenaran"
const selectedLanguage = ref('javascript');
const selectedDuration = ref(60);
const codeSnippet = ref('Selamat datang! Atur bahasa dan waktu, lalu tekan Start.');
const userInput = ref('');
const charStates = ref([]);
const currentIndex = ref(0);
const inputField = ref(null);
const gameStatus = ref('waiting');
const timer = ref(60);
let timerId = null;
const wpm = ref(0);
const accuracy = ref(0);
const errors = ref(0);
const totalCorrectChars = ref(0);
const totalTypedChars = ref(0);

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
  totalTypedChars.value = 0;
  errors.value = 0;
  timer.value = selectedDuration.value;
  if (timerId) clearInterval(timerId);
  loadNextSnippet();
  nextTick(() => inputField.value?.focus());
};

const startTimer = () => {
  gameStatus.value = 'typing';
  timerId = setInterval(() => {
    if (timer.value > 0) timer.value--;
    else finishGame();
  }, 1000);
};

const finishGame = () => {
  clearInterval(timerId);
  gameStatus.value = 'finished';
  calculateResults();
};

const backToMenu = () => {
  gameStatus.value = 'waiting';
  if (timerId) clearInterval(timerId);
  
  // Reset state ke nilai default
  selectedLanguage.value = 'javascript';
  selectedDuration.value = 60;
  timer.value = 60;

  codeSnippet.value = 'Selamat datang! Atur bahasa dan waktu, lalu tekan Start.';
};

const calculateResults = () => {
  const correctInLastSnippet = charStates.value.slice(0, userInput.value.length).filter(state => state === 'correct').length;
  const errorsInLastSnippet = charStates.value.slice(0, userInput.value.length).filter(state => state === 'incorrect').length;
  const grandTotalCorrect = totalCorrectChars.value + correctInLastSnippet;
  const grandTotalTyped = totalTypedChars.value + userInput.value.length;
  errors.value += errorsInLastSnippet;
  if (grandTotalTyped > 0) accuracy.value = Math.round((grandTotalCorrect / grandTotalTyped) * 100);
  else accuracy.value = 0;
  const timeInMinutes = selectedDuration.value / 60;
  wpm.value = Math.round((grandTotalCorrect / 5) / timeInMinutes);
};

const focusInput = () => inputField.value?.focus();
const handleTab = () => { userInput.value += '  '; };

// --- WATCHER DENGAN LOGIKA YANG DIPERBAIKI (BUG #1) ---
watch(userInput, (newInput) => {
  if (gameStatus.value !== 'ready' && gameStatus.value !== 'typing') return;
  if (gameStatus.value === 'ready' && newInput.length > 0) startTimer();

  // Buat array status baru, jangan modifikasi yang lama
  const newStates = Array.from(codeSnippet.value).map((originalChar, index) => {
    const typedChar = newInput[index];
    if (typedChar === undefined) {
      return 'untyped';
    } else if (typedChar === originalChar) {
      return 'correct';
    } else {
      return 'incorrect';
    }
  });

  charStates.value = newStates; // Ganti array lama dengan yang baru
  currentIndex.value = newInput.length;

  if (currentIndex.value === codeSnippet.value.length) {
    const correctInSnippet = charStates.value.filter(state => state === 'correct').length;
    const errorsInSnippet = charStates.value.filter(state => state === 'incorrect').length;
    totalCorrectChars.value += correctInSnippet;
    totalTypedChars.value += codeSnippet.value.length;
    errors.value += errorsInSnippet;
    loadNextSnippet();
  }
});

watch(currentIndex, () => {
  nextTick(() => {
    const cursorEl = document.getElementById('cursor');
    if (cursorEl) cursorEl.scrollIntoView({ block: 'nearest' });
  });
});
</script>

<template>
  <div class="w-full">
    <Settings
      v-if="gameStatus === 'waiting'"
      :language="selectedLanguage" :duration="selectedDuration" @languageChange="updateLanguage"
      @durationChange="updateDuration"
      @start="startGame"
    />

    <div v-show="gameStatus === 'typing' || gameStatus === 'ready'">
      <div class="flex justify-center items-center gap-4 md:gap-6 mb-6">
        <button @click="backToMenu" title="Kembali ke Menu" class="text-slate-500 hover:text-emerald-400 transition-colors">
          <ArrowUturnLeftIcon class="h-8 w-8" />
        </button>
        <div class="text-center text-5xl font-bold text-emerald-400 w-28">
          {{ timer }}
        </div>
        <button @click="startGame" title="Ulangi Sesi" class="text-slate-500 hover:text-emerald-400 transition-colors">
          <ArrowPathIcon class="h-8 w-8" />
        </button>
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
          :disabled="gameStatus !== 'ready' && gameStatus !== 'typing'"
          autofocus
        />
      </div>
    </div>

    <Results
      v-if="gameStatus === 'finished'"
      :wpm="wpm"
      :accuracy="accuracy"
      :errors="errors"
      :language="selectedLanguage"
      :duration="selectedDuration"
      @retry="backToMenu"
    />

    <div v-if="gameStatus === 'waiting'" class="text-center text-slate-500 p-10 bg-slate-800 rounded-lg">
      {{ codeSnippet }}
    </div>
  </div>
</template>
