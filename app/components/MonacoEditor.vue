<script setup lang="ts">
import { init } from 'modern-monaco'
import type { editor as monacoEditorType } from 'modern-monaco/editor-core'

const { lang = 'json', modelValue = '' } = defineProps<{
  lang?: string
  modelValue?: string
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

onMounted(async () => {
  monacoEditor = monaco.editor.create(editor.value as HTMLElement)
  monacoModel = monaco.editor.createModel(localModelValue.value, lang)
  monacoEditor.setModel(monacoModel)

  monacoEditor.onDidChangeModelContent(() => {
    localModelValue.value = monacoEditor.getValue()
  })
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
    class="h-96 w-full border border-gray-200 dark:border-gray-800 p-2"
  />
</template>
