<script setup lang="ts">
import {
  encodeBase64,
  decodeBase64,
  encodeBase64Url,
  decodeBase64Url,
  getBase64Info
} from '~/utils/tools/base64'

useHead({
  title: 'Base64 Tools - Programming Tools',
  meta: [
    {
      name: 'description',
      content: 'Base64 encoding, decoding, validation, and URL-safe conversion tools for developers.'
    }
  ]
})

const base64Input = ref('')
const base64Output = ref('')
const errorMessage = ref('')
const selectedTool = ref('encoder')
const toast = useToast()

const tools = [
  {
    id: 'encoder',
    name: 'Base64 Encoder',
    description: 'Encode text to Base64 format with proper padding.',
    icon: 'i-lucide-lock',
    color: 'primary' as const,
    function: encodeBase64
  },
  {
    id: 'decoder',
    name: 'Base64 Decoder',
    description: 'Decode Base64 strings back to original text.',
    icon: 'i-lucide-unlock',
    color: 'success' as const,
    function: decodeBase64
  },
  {
    id: 'encoder-url',
    name: 'Base64 URL Encoder',
    description: 'Encode text to URL-safe Base64 format.',
    icon: 'i-lucide-link',
    color: 'warning' as const,
    function: encodeBase64Url
  },
  {
    id: 'decoder-url',
    name: 'Base64 URL Decoder',
    description: 'Decode URL-safe Base64 strings to original text.',
    icon: 'i-lucide-link-external',
    color: 'info' as const,
    function: decodeBase64Url
  },
  {
    id: 'validator',
    name: 'Base64 Validator',
    description: 'Validate and analyze Base64 strings with detailed information.',
    icon: 'i-lucide-shield-check',
    color: 'primary' as const,
    function: (input: string) => {
      const info = getBase64Info(input)
      return JSON.stringify({
        isValid: info.isValid,
        length: info.length,
        padding: info.padding,
        isUrlSafe: info.isUrlSafe,
        decodedLength: info.decodedLength,
        message: info.isValid ? 'Valid Base64 string' : 'Invalid Base64 string'
      }, null, 2)
    }
  }
]

function switchInputAndOutput() {
  const temp = base64Input.value
  base64Input.value = base64Output.value
  base64Output.value = temp
}

function copyOutput() {
  navigator.clipboard.writeText(base64Output.value)
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
  if (!base64Input.value.trim()) {
    base64Output.value = ''
    return
  }

  const tool = tools.find(t => t.id === selectedTool.value)

  if (!tool) {
    return
  }

  try {
    base64Output.value = tool.function(base64Input.value)
  } catch (error) {
    errorMessage.value = error instanceof Error ? error.message : 'Unknown error occurred'
    base64Output.value = ''
  }
}

// Watch for input changes and auto-execute
watch(base64Input, () => {
  if (base64Input.value.trim()) {
    executeSelectedTool()
  } else {
    base64Output.value = ''
    clearError()
  }
})

// Watch for tool selection changes
watch(selectedTool, () => {
  if (base64Input.value.trim()) {
    executeSelectedTool()
  }
})
</script>

<template>
  <div class="px-4 py-8">
    <div class="mb-8">
      <div class="flex items-center space-x-3 mb-4">
        <UIcon
          name="i-lucide-shield"
          class="w-8 h-8 text-green-500"
        />
        <h1 class="text-3xl font-bold text-gray-900 dark:text-white">
          Base64 Tools
        </h1>
      </div>
      <p class="text-lg text-gray-600 dark:text-gray-300">
        Encode, decode, validate, and convert data using Base64 encoding with our comprehensive set
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
            v-model="base64Input"
            lang="plaintext"
            class="border rounded-lg"
            placeholder="Enter text to encode/decode..."
          />
        </ClientOnly>
      </div>

      <div>
        <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">
          Output
        </h3>
        <ClientOnly>
          <MonacoEditor
            v-model="base64Output"
            lang="plaintext"
            class="border rounded-lg"
            :read-only="true"
            placeholder="Output will appear here..."
          />
        </ClientOnly>
      </div>
    </div>

    <div class="flex flex-wrap gap-4 mt-6">
      <UButton
        :disabled="!base64Input.trim()"
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
        @click="base64Input = ''; base64Output = ''; clearError()"
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
