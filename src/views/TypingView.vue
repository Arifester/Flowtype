<script setup>
import { ref } from 'vue'
import Settings from '../components/Settings.vue'
import CodeDisplay from '../components/CodeDisplay.vue'

// Data dummy untuk sementara
const codeSnippet = ref(`function sayHello(name) {\n  console.log(\`Hello, \${name}!\`);\n}\n\nsayHello('World');`);

</script>

<template>
  <div class="w-full">
    <Settings />
    <CodeDisplay :code="codeSnippet" />
    </div>
</template>
