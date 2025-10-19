<script setup lang="ts">
import {
  formatYaml,
  validateYaml,
  yamlToJson,
  jsonToYaml,
  minifyYaml
} from '~/utils/tools/yaml'

useHead({
  title: 'YAML Tools - Programming Tools',
  meta: [
    {
      name: 'description',
      content: 'YAML parsing, formatting, validation, and conversion tools for developers.'
    }
  ]
})

const tools = [
  {
    id: 'parser',
    name: 'YAML Parser',
    description: 'Parse and validate YAML strings with detailed error reporting.',
    icon: 'i-lucide-code',
    color: 'primary' as const,
    function: (input: string) => {
      const parsed = validateYaml(input)
      return JSON.stringify(parsed, null, 2)
    }
  },
  {
    id: 'formatter',
    name: 'YAML Formatter',
    description: 'Format and beautify YAML with proper indentation and structure.',
    icon: 'i-lucide-align-left',
    color: 'primary' as const,
    function: formatYaml
  },
  {
    id: 'validator',
    name: 'YAML Validator',
    description: 'Validate YAML syntax and structure with comprehensive error checking.',
    icon: 'i-lucide-shield-check',
    color: 'success' as const,
    function: (input: string) => {
      const parsed = validateYaml(input)
      return JSON.stringify(parsed, null, 2)
    }
  },
  {
    id: 'yaml-to-json',
    name: 'YAML to JSON',
    description: 'Convert YAML data to JSON format with proper formatting.',
    icon: 'i-lucide-arrow-right',
    color: 'info' as const,
    function: yamlToJson
  },
  {
    id: 'json-to-yaml',
    name: 'JSON to YAML',
    description: 'Convert JSON data to YAML format with proper structure.',
    icon: 'i-lucide-arrow-left',
    color: 'warning' as const,
    function: jsonToYaml
  },
  {
    id: 'minifier',
    name: 'YAML Minifier',
    description: 'Minify YAML by removing unnecessary whitespace and comments.',
    icon: 'i-lucide-minimize-2',
    color: 'secondary' as const,
    function: minifyYaml
  }
]
</script>

<template>
  <ToolPageBase
    title="YAML Tools"
    description="Parse, format, validate, and convert YAML data with our comprehensive set of tools."
    icon="i-lucide-file-text"
    icon-color="text-purple-500"
    :tools="tools"
    default-tool="formatter"
    input-language="yaml"
    output-language="yaml"
  />
</template>
