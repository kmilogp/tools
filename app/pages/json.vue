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
</script>

<template>
  <ToolPageBase
    title="JSON Tools"
    description="Format, minify, escape, unescape, and validate JSON data with our comprehensive set of tools."
    icon="i-lucide-file-code"
    icon-color="text-blue-500"
    :tools="tools"
    default-tool="formatter"
    input-language="json"
    output-language="json"
  />
</template>
