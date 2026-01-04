<script setup lang="ts">
import { init } from 'modern-monaco'
import type { editor as monacoEditorType } from 'modern-monaco/editor-core'

const { lang = 'json', modelValue = '', minHeight } = defineProps<{
  lang?: string
  modelValue?: string
  minHeight?: number
}>()

const emit = defineEmits<{
  'update:modelValue': [string]
}>()

const localModelValue = ref(modelValue)

const darkMode = useColorMode()
const theme = computed(() =>
  darkMode.value === 'dark' ? 'github-dark' : 'github-light'
)

const editor = useTemplateRef('editor')

const monaco = await init({
  theme: theme.value
})

let monacoEditor: monacoEditorType.IStandaloneCodeEditor
let monacoModel: monacoEditorType.ITextModel

let resizeObserver: ResizeObserver | null = null

onMounted(async () => {
  monacoEditor = monaco.editor.create(editor.value as HTMLElement)
  monacoModel = monaco.editor.createModel(localModelValue.value, lang)
  monacoEditor.setModel(monacoModel)

  monacoEditor.onDidChangeModelContent(() => {
    localModelValue.value = monacoEditor.getValue()
  })

  // Handle resize
  resizeObserver = new ResizeObserver(() => {
    monacoEditor.layout()
  })
  resizeObserver.observe(editor.value as HTMLElement)
})

onUnmounted(() => {
  if (resizeObserver) {
    resizeObserver.disconnect()
  }
  if (monacoEditor) {
    monacoEditor.dispose()
  }
  if (monacoModel) {
    monacoModel.dispose()
  }
})

watch(theme, () => {
  monaco.editor.setTheme(theme.value)
})

watch(localModelValue, () => {
  emit('update:modelValue', localModelValue.value)
})

watch(
  () => modelValue,
  () => {
    if (modelValue !== localModelValue.value) {
      monacoModel.setValue(modelValue)
      console.log('modelValue changed', modelValue)
    }
  }
)
</script>

<template>
  <div
    ref="editor"
    :theme
    :class="[
      'w-full border border-gray-200 dark:border-gray-800 p-2',
      minHeight ? '' : 'h-full'
    ]"
    :style="minHeight ? `height: ${minHeight}px; min-height: ${minHeight}px;` : ''"
  />
</template>
