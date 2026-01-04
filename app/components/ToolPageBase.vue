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
  <div
    class="p-2 flex flex-col"
    style="height: calc(100vh - 200px); min-height: 600px;"
  >
    <div class="mb-2 flex-shrink-0">
      <div class="flex items-center space-x-2 mb-1">
        <UIcon
          :name="icon"
          :class="`w-5 h-5 ${iconColor}`"
        />
        <h1 class="text-xl font-bold text-gray-900 dark:text-white">
          {{ title }}
        </h1>
      </div>
      <p class="text-xs text-gray-600 dark:text-gray-300">
        {{ description }}
      </p>
    </div>

    <div class="mb-2 flex-shrink-0">
      <div class="flex flex-wrap gap-1">
        <UButton
          v-for="tool in tools"
          :key="tool.id"
          :color="selectedTool === tool.id ? tool.color : 'neutral'"
          :variant="selectedTool === tool.id ? 'solid' : 'soft'"
          size="xs"
          class="text-xs"
          @click="selectedTool = tool.id"
        >
          <UIcon
            :name="tool.icon"
            class="w-3 h-3 mr-1"
          />
          {{ tool.name }}
        </UButton>
      </div>
    </div>

    <UAlert
      v-if="errorMessage"
      color="error"
      variant="soft"
      class="mb-2 flex-shrink-0 text-xs"
      :title="errorMessage"
      :description="'Please check your input and try again.'"
    />

    <div class="grid grid-cols-1 md:grid-cols-2 gap-3 flex-grow min-h-0">
      <div class="flex flex-col min-h-0">
        <h3 class="text-sm font-semibold text-gray-900 dark:text-white mb-1">
          Input
        </h3>
        <div class="flex-grow min-h-0">
          <ClientOnly>
            <MonacoEditor
              v-model="input"
              :lang="inputLanguage"
              class="border rounded-lg h-full"
              :placeholder="inputPlaceholder"
            />
          </ClientOnly>
        </div>
      </div>

      <div class="flex flex-col min-h-0">
        <h3 class="text-sm font-semibold text-gray-900 dark:text-white mb-1">
          Output
        </h3>
        <div class="flex-grow min-h-0">
          <ClientOnly>
            <MonacoEditor
              v-model="output"
              :lang="outputLanguage"
              class="border rounded-lg h-full"
              :read-only="true"
              :placeholder="outputPlaceholder"
            />
          </ClientOnly>
        </div>
      </div>
    </div>

    <div class="flex flex-wrap gap-1 mt-2 justify-between items-center flex-shrink-0">
      <div class="flex flex-wrap gap-1">
        <UButton
          :disabled="!input.trim()"
          color="primary"
          size="xs"
          @click="executeSelectedTool"
        >
          <UIcon
            name="i-lucide-play"
            class="w-3 h-3"
          />
        </UButton>

        <UButton
          color="warning"
          size="xs"
          @click="switchInputAndOutput"
        >
          <UIcon
            name="i-lucide-arrow-left-right"
            class="w-3 h-3"
          />
        </UButton>

        <UButton
          color="info"
          size="xs"
          @click="copyOutput"
        >
          <UIcon
            name="i-lucide-copy"
            class="w-3 h-3"
          />
        </UButton>

        <UButton
          color="neutral"
          variant="soft"
          size="xs"
          @click="clearAll"
        >
          <UIcon
            name="i-lucide-refresh-cw"
            class="w-3 h-3"
          />
        </UButton>
      </div>
      <div>
        <slot name="parameters" />
      </div>
    </div>
  </div>
</template>
