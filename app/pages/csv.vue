<script setup lang="ts">
import {
  validateCsv,
  csvToJson,
  jsonToCsv,
  csvToYaml,
  yamlToCsv,
  formatCsv,
  getCsvInfo
} from '~/utils/tools/csv'

useHead({
  title: 'CSV Tools - Programming Tools',
  meta: [
    { name: 'description', content: 'CSV parsing, validation, formatting, and conversion tools for developers.' }
  ]
})

const delimiter = ref(',')
const computedDelimiter = computed(() => delimiter.value || ',')

const tools = [
  {
    id: 'validator',
    name: 'CSV Validator',
    description: 'Validate CSV format and structure with detailed error reporting.',
    icon: 'i-lucide-check-circle',
    color: 'success' as const,
    function: (input: string) => {
      const validation = validateCsv(input, computedDelimiter.value)
      return JSON.stringify({
        isValid: validation.isValid,
        rowCount: validation.rowCount,
        columnCount: validation.columnCount,
        headers: validation.headers,
        errors: validation.errors,
        delimiter: computedDelimiter.value
      }, null, 2)
    }
  },
  {
    id: 'formatter',
    name: 'CSV Formatter',
    description: 'Format and beautify CSV data with proper structure.',
    icon: 'i-lucide-align-left',
    color: 'primary' as const,
    function: (input: string) => {
      return formatCsv(input, computedDelimiter.value)
    }
  },
  {
    id: 'csv-to-json',
    name: 'CSV to JSON',
    description: 'Convert CSV data to JSON format.',
    icon: 'i-lucide-file-code',
    color: 'primary' as const,
    function: (input: string) => {
      return csvToJson(input, computedDelimiter.value)
    }
  },
  {
    id: 'json-to-csv',
    name: 'JSON to CSV',
    description: 'Convert JSON data to CSV format.',
    icon: 'i-lucide-table',
    color: 'error' as const,
    function: (input: string) => {
      return jsonToCsv(input, computedDelimiter.value)
    }
  },
  {
    id: 'csv-to-yaml',
    name: 'CSV to YAML',
    description: 'Convert CSV data to YAML format.',
    icon: 'i-lucide-file-text',
    color: 'secondary' as const,
    function: (input: string) => {
      return csvToYaml(input, computedDelimiter.value)
    }
  },
  {
    id: 'yaml-to-csv',
    name: 'YAML to CSV',
    description: 'Convert YAML data to CSV format.',
    icon: 'i-lucide-table-2',
    color: 'warning' as const,
    function: (input: string) => {
      return yamlToCsv(input, computedDelimiter.value)
    }
  },
  {
    id: 'analyzer',
    name: 'CSV Analyzer',
    description: 'Analyze CSV structure and get detailed information.',
    icon: 'i-lucide-search',
    color: 'info' as const,
    function: (input: string) => {
      const info = getCsvInfo(input, computedDelimiter.value)
      return JSON.stringify(info, null, 2)
    }
  }
]
</script>

<template>
  <ToolPageBase
    title="CSV Tools"
    description="Parse, validate, format, and convert CSV data with our comprehensive set of tools."
    icon="i-lucide-table"
    icon-color="text-red-500"
    :tools="tools"
    default-tool="validator"
    input-language="csv"
    output-language="json"
    input-placeholder="Enter CSV data here..."
    output-placeholder="Output will appear here..."
  >
    <template #parameters>
      Delimiter:
      <UInput
        v-model="delimiter"
        placeholder="Enter delimiter (e.g., , ; | \t)"
      />
    </template>
  </ToolPageBase>
</template>
