<script setup lang="ts">
useHead({
  title: 'JSON Tools - Programming Tools',
  meta: [
    {
      name: 'description',
      content: 'JSON parsing, escaping, formatting, and minification tools for developers.'
    }
  ]
})

const jsonInput = ref('')
const jsonOutput = ref('')
</script>

<template>
  <div class="px-4 py-8">
    <div class="mb-8">
      <div class="flex items-center space-x-3 mb-4">
        <UIcon
          name="i-lucide-file-code"
          class="w-8 h-8 text-blue-500"
        />
        <h1 class="text-3xl font-bold text-gray-900 dark:text-white">
          JSON Tools
        </h1>
      </div>
      <p class="text-lg text-gray-600 dark:text-gray-300">
        Parse, format, escape, and minify JSON data with our comprehensive set
        of tools.
      </p>
    </div>
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <InputOutputEditor
        v-model:input="jsonInput"
        v-model:output="jsonOutput"
      />
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-4">
      <UCard class="hover:shadow-lg transition-shadow duration-200">
        <template #header>
          <div class="flex items-center space-x-2">
            <UIcon
              name="i-lucide-code"
              class="w-5 h-5 text-blue-500"
            />
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
              JSON Parser
            </h3>
          </div>
        </template>

        <p class="text-gray-600 dark:text-gray-300 text-sm mb-4">
          Parse and validate JSON strings with detailed error reporting.
        </p>

        <UButton
          color="primary"
          variant="soft"
          class="w-full"
          disabled
        >
          Coming Soon
        </UButton>
      </UCard>

      <UCard class="hover:shadow-lg transition-shadow duration-200">
        <template #header>
          <div class="flex items-center space-x-2">
            <UIcon
              name="i-lucide-shield"
              class="w-5 h-5 text-green-500"
            />
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
              JSON Escaper
            </h3>
          </div>
        </template>

        <p class="text-gray-600 dark:text-gray-300 text-sm mb-4">
          Escape special characters in JSON strings for safe usage.
        </p>

        <UButton
          color="primary"
          variant="soft"
          class="w-full"
          disabled
        >
          Coming Soon
        </UButton>
      </UCard>

      <UCard class="hover:shadow-lg transition-shadow duration-200">
        <template #header>
          <div class="flex items-center space-x-2">
            <UIcon
              name="i-lucide-align-left"
              class="w-5 h-5 text-purple-500"
            />
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
              JSON Formatter
            </h3>
          </div>
        </template>

        <p class="text-gray-600 dark:text-gray-300 text-sm mb-4">
          Format and beautify JSON with proper indentation and spacing.
        </p>

        <UButton
          color="info"
          variant="soft"
          class="w-full"
          disabled
        >
          Coming Soon
        </UButton>
      </UCard>

      <UCard class="hover:shadow-lg transition-shadow duration-200">
        <template #header>
          <div class="flex items-center space-x-2">
            <UIcon
              name="i-lucide-minimize-2"
              class="w-5 h-5 text-orange-500"
            />
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
              JSON Minifier
            </h3>
          </div>
        </template>

        <p class="text-gray-600 dark:text-gray-300 text-sm mb-4">
          Minify JSON by removing unnecessary whitespace and characters.
        </p>

        <UButton
          color="warning"
          variant="soft"
          class="w-full"
          disabled
        >
          Coming Soon
        </UButton>
      </UCard>
    </div>
  </div>
</template>
