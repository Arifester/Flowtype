<script setup>
// Nanti akan tambahkan logika di sini
</script>

<template>
  <div class="flex justify-center items-center gap-4 mb-8">
    <div class="flex items-center gap-2">
      <label for="language" class="text-slate-400">Language:</label>
      <select id="language" class="bg-slate-700 text-emerald-400 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-emerald-500">
        <option value="javascript">JavaScript</option>
        <option value="python">Python</option>
        <option value="java">Java</option>
        <option value="php">PHP</option>
      </select>
    </div>

    <div class="flex items-center gap-2">
      <label for="duration" class="text-slate-400">Time:</label>
      <select id="duration" class="bg-slate-700 text-emerald-400 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-emerald-500">
        <option value="60">1 menit</option>
        <option value="180">3 menit</option>
        <option value="300">5 menit</option>
      </select>
    </div>

    <button class="bg-emerald-500 text-slate-900 font-bold px-4 py-2 rounded-md hover:bg-emerald-400 transition-colors">
      Start
    </button>
  </div>
</template>
