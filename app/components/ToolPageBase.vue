<script setup lang="ts">
interface Tool {
  id: string
  name: string
  description: string
  icon: string
  color: 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info'
  function: (input: string) => string
}

interface Props {
  title: string
  description: string
  icon: string
  iconColor: string
  tools: Tool[]
  defaultTool: string
  inputLanguage: string
  outputLanguage: string
  inputPlaceholder?: string
  outputPlaceholder?: string
}

const props = withDefaults(defineProps<Props>(), {
  inputPlaceholder: '',
  outputPlaceholder: ''
})

const input = ref('')
const output = ref('')
const errorMessage = ref('')
const selectedTool = ref(props.defaultTool)
const toast = useToast()

function switchInputAndOutput() {
  const temp = input.value
  input.value = output.value
  output.value = temp
}

function copyOutput() {
  navigator.clipboard.writeText(output.value)
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
  if (!input.value.trim()) {
    output.value = ''
    return
  }

  const tool = props.tools.find(t => t.id === selectedTool.value)

  if (!tool) {
    return
  }

  try {
    output.value = tool.function(input.value)
  } catch (error) {
    errorMessage.value = error instanceof Error ? error.message : 'Unknown error occurred'
    output.value = ''
  }
}

function clearAll() {
  input.value = ''
  output.value = ''
  clearError()
}

// Watch for input changes and auto-execute
watch(input, () => {
  if (input.value.trim()) {
    executeSelectedTool()
  } else {
    output.value = ''
    clearError()
  }
})

// Watch for tool selection changes
watch(selectedTool, () => {
  if (input.value.trim()) {
    executeSelectedTool()
  }
})

// Expose reactive values for parent components
defineExpose({
  input,
  output,
  errorMessage,
  selectedTool,
  executeSelectedTool,
  clearAll
})
</script>

<template>
  <div class="px-4 py-8">
    <div class="mb-8">
      <div class="flex items-center space-x-3 mb-4">
        <UIcon
          :name="icon"
          :class="`w-8 h-8 ${iconColor}`"
        />
        <h1 class="text-3xl font-bold text-gray-900 dark:text-white">
          {{ title }}
        </h1>
      </div>
      <p class="text-lg text-gray-600 dark:text-gray-300">
        {{ description }}
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
            v-model="input"
            :lang="inputLanguage"
            class="border rounded-lg"
            :placeholder="inputPlaceholder"
          />
        </ClientOnly>
      </div>

      <div>
        <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">
          Output
        </h3>
        <ClientOnly>
          <MonacoEditor
            v-model="output"
            :lang="outputLanguage"
            class="border rounded-lg"
            :read-only="true"
            :placeholder="outputPlaceholder"
          />
        </ClientOnly>
      </div>
    </div>

    <div class="flex flex-wrap gap-4 mt-6 justify-between items-center">
      <div class="space-x-4">
        <UButton
          :disabled="!input.trim()"
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
          @click="clearAll"
        >
          <UIcon
            name="i-lucide-refresh-cw"
            class="w-4 h-4 mr-2"
          />
          Clear All
        </UButton>
      </div>
      <div>
        <slot name="parameters" />
      </div>
    </div>
  </div>
</template>
