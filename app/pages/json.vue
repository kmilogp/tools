<script setup lang="ts">
import { formatJson, minifyJson, escapeJson, unescapeJson, validateJson } from '~/utils/tools/json'

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
const errorMessage = ref('')
const selectedTool = ref('formatter')
const toast = useToast()

const tools = [
  {
    id: 'formatter',
    name: 'JSON Formatter',
    description: 'Format and beautify JSON with proper indentation and spacing.',
    icon: 'i-lucide-align-left',
    color: 'primary' as const,
    function: formatJson
  },
  {
    id: 'minifier',
    name: 'JSON Minifier',
    description: 'Minify JSON by removing unnecessary whitespace and characters.',
    icon: 'i-lucide-minimize-2',
    color: 'warning' as const,
    function: minifyJson
  },
  {
    id: 'escaper',
    name: 'JSON Escaper',
    description: 'Escape special characters in JSON strings for safe usage.',
    icon: 'i-lucide-shield',
    color: 'success' as const,
    function: escapeJson
  },
  {
    id: 'unescaper',
    name: 'JSON Unescaper',
    description: 'Unescape JSON strings by parsing escaped characters.',
    icon: 'i-lucide-shield-check',
    color: 'info' as const,
    function: unescapeJson
  },
  {
    id: 'validator',
    name: 'JSON Validator',
    description: 'Parse and validate JSON strings with detailed error reporting.',
    icon: 'i-lucide-code',
    color: 'primary' as const,
    function: (input: string) => {
      const parsed = validateJson(input)
      return JSON.stringify(parsed, null, 2)
    }
  }
]

function switchInputAndOutput() {
  const temp = jsonInput.value
  jsonInput.value = jsonOutput.value
  jsonOutput.value = temp
}

function copyOutput() {
  navigator.clipboard.writeText(jsonOutput.value)
  toast.add({
    title: 'Output copied to clipboard',
    color: 'info'
  })
}

function clearError() {
  errorMessage.value = ''
}

function executeSelectedTool() {
  clearError()
  if (!jsonInput.value.trim()) {
    jsonOutput.value = ''
    return
  }

  const tool = tools.find(t => t.id === selectedTool.value)

  if (!tool) {
    return
  }

  try {
    jsonOutput.value = tool.function(jsonInput.value)
  } catch (error) {
    errorMessage.value = error instanceof Error ? error.message : 'Unknown error occurred'
    jsonOutput.value = ''
  }
}

// Watch for input changes and auto-execute
watch(jsonInput, () => {
  if (jsonInput.value.trim()) {
    executeSelectedTool()
  } else {
    jsonOutput.value = ''
    clearError()
  }
})

// Watch for tool selection changes
watch(selectedTool, () => {
  if (jsonInput.value.trim()) {
    executeSelectedTool()
  }
})
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
        Format, minify, escape, unescape, and validate JSON data with our comprehensive set
        of tools.
      </p>
    </div>

    <div class="mb-6">
      <UCard>
        <template #header>
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
            Select Tool
          </h3>
        </template>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
          <UButton
            v-for="tool in tools"
            :key="tool.id"
            :color="selectedTool === tool.id ? tool.color : 'neutral'"
            :variant="selectedTool === tool.id ? 'solid' : 'soft'"
            class="justify-start h-auto p-4"
            @click="selectedTool = tool.id"
          >
            <div class="flex items-center space-x-3 w-full">
              <UIcon
                :name="tool.icon"
                class="w-5 h-5"
              />
              <div class="text-left">
                <div class="font-medium">
                  {{ tool.name }}
                </div>
                <div class="text-xs opacity-75">
                  {{ tool.description }}
                </div>
              </div>
            </div>
          </UButton>
        </div>
      </UCard>
    </div>

    <UAlert
      v-if="errorMessage"
      color="error"
      variant="soft"
      class="mb-6"
      :title="errorMessage"
      :description="'Please check your input and try again.'"
    />

    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div>
        <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">
          Input
        </h3>
        <ClientOnly>
          <MonacoEditor
            v-model="jsonInput"
            lang="json"
            class="border rounded-lg"
          />
        </ClientOnly>
      </div>

      <div>
        <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">
          Output
        </h3>
        <ClientOnly>
          <MonacoEditor
            v-model="jsonOutput"
            lang="json"
            class="border rounded-lg"
            :read-only="true"
          />
        </ClientOnly>
      </div>
    </div>

    <div class="flex flex-wrap gap-4 mt-6">
      <UButton
        :disabled="!jsonInput.trim()"
        color="primary"
        @click="executeSelectedTool"
      >
        <UIcon
          name="i-lucide-play"
          class="w-4 h-4 mr-2"
        />
        Execute Tool
      </UButton>

      <UButton
        color="warning"
        @click="switchInputAndOutput"
      >
        <UIcon
          name="i-lucide-arrow-left-right"
          class="w-4 h-4 mr-2"
        />
        Switch Input and Output
      </UButton>

      <UButton
        color="info"
        @click="copyOutput"
      >
        <UIcon
          name="i-lucide-copy"
          class="w-4 h-4 mr-2"
        />
        Copy Output
      </UButton>

      <UButton
        color="neutral"
        variant="soft"
        @click="jsonInput = ''; jsonOutput = ''; clearError()"
      >
        <UIcon
          name="i-lucide-refresh-cw"
          class="w-4 h-4 mr-2"
        />
        Clear All
      </UButton>
    </div>
  </div>
</template>
