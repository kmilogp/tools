<script setup lang="ts">
const input = defineModel<string>('input')
const output = defineModel<string>('output')
</script>

<template>
  <ClientOnly>
    <MonacoEditor
      v-model="input"
      lang="json"
    />
  </ClientOnly>

  <ClientOnly>
    <MonacoEditor
      v-model="output"
      lang="json"
    />
  </ClientOnly>
</template>
