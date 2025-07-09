<script setup>
import { ref, watch, nextTick } from 'vue';
import { ArrowPathIcon } from '@heroicons/vue/24/solid'
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

// --- STATE MANAGEMENT ---
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

// --- AKUMULATOR SKOR YANG DIPERBAIKI ---
const totalCorrectChars = ref(0); // Total karakter BENAR dari semua snippet
const totalTypedChars = ref(0); // Total karakter DIKETIK dari semua snippet

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
  // Reset semua akumulator
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

// --- FUNGSI PERHITUNGAN SKOR YANG DIPERBAIKI ---
const calculateResults = () => {
  // Hitung karakter benar & salah dari snippet TERAKHIR (yang mungkin belum selesai)
  const correctInLastSnippet = charStates.value.slice(0, userInput.value.length).filter(state => state === 'correct').length;
  const errorsInLastSnippet = charStates.value.slice(0, userInput.value.length).filter(state => state === 'incorrect').length;

  // Gabungkan dengan akumulator dari snippet sebelumnya
  const grandTotalCorrect = totalCorrectChars.value + correctInLastSnippet;
  const grandTotalTyped = totalTypedChars.value + userInput.value.length;
  errors.value += errorsInLastSnippet; // Tambahkan error dari snippet terakhir

  // Hitung Akurasi
  if (grandTotalTyped > 0) {
    accuracy.value = Math.round((grandTotalCorrect / grandTotalTyped) * 100);
  } else {
    accuracy.value = 0;
  }
  
  // Hitung WPM HANYA dari karakter yang BENAR
  const timeInMinutes = selectedDuration.value / 60;
  wpm.value = Math.round((grandTotalCorrect / 5) / timeInMinutes);
};

const focusInput = () => inputField.value?.focus();
const handleTab = () => { userInput.value += '  '; };

// --- WATCHER DENGAN LOGIKA SKOR YANG DIPERBAIKI ---
watch(userInput, (newInput) => {
  if (gameStatus.value === 'finished' || gameStatus.value === 'waiting') return;
  if (gameStatus.value === 'ready' && newInput.length > 0) startTimer();

  for (let i = 0; i < codeSnippet.value.length; i++) {
    const typedChar = newInput[i];
    const originalChar = codeSnippet.value[i];
    if (typedChar === undefined) charStates.value[i] = 'untyped';
    else if (typedChar === originalChar) charStates.value[i] = 'correct';
    else charStates.value[i] = 'incorrect';
  }
  currentIndex.value = newInput.length;

  // Jika snippet selesai diketik
  if (currentIndex.value === codeSnippet.value.length) {
    // <-- AWAL DARI LOGIKA YANG BENAR
    const correctInSnippet = charStates.value.filter(state => state === 'correct').length;
    const errorsInSnippet = charStates.value.filter(state => state === 'incorrect').length;
    
    // Tambahkan HANYA yang benar ke total benar
    totalCorrectChars.value += correctInSnippet;
    // Tambahkan total ketikan dari snippet ini
    totalTypedChars.value += codeSnippet.value.length;
    // Tambahkan total kesalahan
    errors.value += errorsInSnippet;
    // <-- AKHIR DARI LOGIKA YANG BENAR

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
      v-if="gameStatus !== 'typing'"
      @languageChange="updateLanguage"
      @durationChange="updateDuration"
      @start="startGame"
    />

    <Transition name="fade" mode="out-in">
      <div v-if="gameStatus === 'typing' || gameStatus === 'ready'">
        <div class="flex justify-center items-center gap-4 mb-6">
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
        v-else-if="gameStatus === 'finished'"
        :wpm="wpm"
        :accuracy="accuracy"
        :errors="errors"
        :language="selectedLanguage"
        :duration="selectedDuration"
        @retry="startGame"
      />

      <div v-else class="text-center text-slate-500 p-10 bg-slate-800 rounded-lg">
        {{ codeSnippet }}
      </div>
    </Transition>
  </div>
</template>
