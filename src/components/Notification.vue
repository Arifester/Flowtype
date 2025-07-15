<script setup>
defineProps({
  show: Boolean,
  message: String,
  type: String,
});
</script>

<template>
  <Transition name="fade">
    <div
      v-if="show"
      class="fixed top-5 right-5 z-50 p-4 rounded-md shadow-lg text-white max-w-sm"
      :class="{
        'bg-blue-500': type === 'info',
        'bg-red-500': type === 'error'
      }"
    >
      {{ message }}
    </div>
  </Transition>
</template>
