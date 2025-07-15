Tentu, gan. Ini adalah kode lengkap final untuk `TypingView.vue` yang sudah menggabungkan semua perbaikan bug, fitur, dan perubahan teks ke Bahasa Inggris.

Anda bisa langsung salin dan tempel seluruh isi kode ini ke dalam file `src/views/TypingView.vue` Anda.

### Kode Lengkap Final `TypingView.vue`

```vue
<script setup>
import { ref, watch, nextTick } from 'vue';
import { ArrowPathIcon, ArrowUturnLeftIcon } from '@heroicons/vue/24/solid'
import Settings from '../components/Settings.vue';
import CodeDisplay from '../components/CodeDisplay.vue';
import Results from '../components/Results.vue';
import allSnippets from '../data/snippets.json';
import { generateCodeSnippet } from '../services/geminiService.js';
import { useNotification } from '../composables/useNotification.js';

const { showNotification } = useNotification();

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
const useAI = ref(false);
const isLoadingSnippet = ref(false);
const selectedLanguage = ref('javascript');
const selectedDuration = ref(60);
const codeSnippet = ref('Welcome! Set your language and time, then press Start.');
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

// --- FUNCTIONS ---
const updateLanguage = (language) => { selectedLanguage.value = language; };
const updateDuration = (duration) => {
  selectedDuration.value = duration;
  timer.value = duration;
};

const loadNextSnippet = async () => {
  isLoadingSnippet.value = true;
  userInput.value = '';
  
  try {
    if (useAI.value) {
      const generatedCode = await generateCodeSnippet(selectedLanguage.value);
      codeSnippet.value = dedent(generatedCode);
    } else {
      const filteredSnippets = allSnippets.filter(s => s.language === selectedLanguage.value);
      const randomIndex = Math.floor(Math.random() * filteredSnippets.length);
      const rawSnippet = filteredSnippets[randomIndex].code;
      codeSnippet.value = dedent(rawSnippet);
    }
  } catch (error) {
    console.warn("AI snippet failed, falling back to static snippet.", error);
    showNotification('AI snippet failed. Loading a static one instead.', 'info');
    const filteredSnippets = allSnippets.filter(s => s.language === selectedLanguage.value);
    const randomIndex = Math.floor(Math.random() * filteredSnippets.length);
    if (filteredSnippets.length > 0) {
      const rawSnippet = filteredSnippets[randomIndex].code;
      codeSnippet.value = dedent(rawSnippet);
    } else {
      codeSnippet.value = "Failed to load AI & static snippets.";
    }
  } finally {
    isLoadingSnippet.value = false;
    currentIndex.value = 0;
    charStates.value = Array(codeSnippet.value.length).fill('untyped');
  }
};

const startGame = async () => {
  gameStatus.value = 'ready';
  totalCorrectChars.value = 0;
  totalTypedChars.value = 0;
  errors.value = 0;
  timer.value = selectedDuration.value;
  if (timerId) clearInterval(timerId);
  await loadNextSnippet();
  
  nextTick(() => {
    inputField.value?.focus();
  });
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
  selectedLanguage.value = 'javascript';
  selectedDuration.value = 60;
  timer.value = 60;
  codeSnippet.value = 'Welcome! Set your language and time, then press Start.';
  if (document.activeElement) document.activeElement.blur();
};

const calculateResults = () => {
  const correctInLastSnippet = charStates.value.slice(0, userInput.value.length).filter(state => 'correct' === state).length;
  const errorsInLastSnippet = charStates.value.slice(0, userInput.value.length).filter(state => 'incorrect' === state).length;
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

// --- WATCHERS ---
watch(userInput, async (newInput) => {
  if (gameStatus.value !== 'ready' && gameStatus.value !== 'typing') return;
  if (gameStatus.value === 'ready' && newInput.length > 0) startTimer();

  const newStates = Array.from(codeSnippet.value).map((originalChar, index) => {
    const typedChar = newInput[index];
    if (typedChar === undefined) return 'untyped';
    else if (typedChar === originalChar) return 'correct';
    else return 'incorrect';
  });
  charStates.value = newStates;
  currentIndex.value = newInput.length;

  if (currentIndex.value === codeSnippet.value.length) {
    const correctInSnippet = charStates.value.filter(state => 'correct' === state).length;
    const errorsInSnippet = charStates.value.filter(state => 'incorrect' === state).length;
    totalCorrectChars.value += correctInSnippet;
    totalTypedChars.value += codeSnippet.value.length;
    errors.value += errorsInSnippet;
    await loadNextSnippet();
  }
});

watch(currentIndex, () => {
  nextTick(() => {
    const cursorEl = document.getElementById('cursor');
    if (cursorEl) cursorEl.scrollIntoView({ block: 'nearest' });
  });
});

watch(inputField, (newEl) => {
  if (newEl) {
    newEl.focus();
  }
});
</script>

<template>
  <div class="w-full">
    <Settings
      v-if="gameStatus === 'waiting'"
      :language="selectedLanguage"
      :duration="selectedDuration"
      v-model:aiMode="useAI"
      @languageChange="updateLanguage"
      @durationChange="updateDuration"
      @start="startGame"
    />

    <Transition name="fade" mode="out-in">
      <div v-if="gameStatus === 'typing' || gameStatus === 'ready'">
        <div class="flex justify-center items-center gap-4 md:gap-6 mb-6">
          <button @click="backToMenu" title="Back to Menu" class="text-slate-500 hover:text-emerald-400 transition-colors">
            <ArrowUturnLeftIcon class="h-8 w-8" />
          </button>
          <div class="text-center text-5xl font-bold text-emerald-400 w-28">
            {{ timer }}
          </div>
          <button @click="startGame" title="Restart Session" class="text-slate-500 hover:text-emerald-400 transition-colors">
            <ArrowPathIcon class="h-8 w-8" />
          </button>
        </div>
        <div @click="focusInput" class="relative cursor-text">
          <div v-if="isLoadingSnippet" class="text-center text-slate-500 p-10 bg-slate-800 rounded-lg">
            ✨ Generating AI snippet...
          </div>
          <CodeDisplay
            v-else
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
            :disabled="isLoadingSnippet || (gameStatus !== 'ready' && gameStatus !== 'typing')"
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
        @retry="backToMenu"
      />

      <div v-else class="text-center text-slate-500 p-10 bg-slate-800 rounded-lg">
        {{ codeSnippet }}
      </div>
    </Transition>
  </div>
</template>
