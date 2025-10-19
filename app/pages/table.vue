<script setup lang="ts">
import { generateTableFromJson, generateTableFromCsv, generateTableFromYaml, analyzeTableData, exportTableData } from '~/utils/tools/table'
import type { TableData, TableColumn } from '@nuxt/ui'

useHead({
  title: 'Table Tools - Programming Tools',
  meta: [
    {
      name: 'description',
      content: 'Generate interactive tables from JSON, CSV, and YAML data with sorting, filtering, and pagination.'
    }
  ]
})

const tools = [
  {
    id: 'json-table',
    name: 'JSON to Table',
    description: 'Convert JSON data into an interactive table with sorting and filtering capabilities.',
    icon: 'i-lucide-file-code',
    color: 'primary' as const,
    function: generateTableFromJson
  },
  {
    id: 'csv-table',
    name: 'CSV to Table',
    description: 'Parse CSV data and display it in a feature-rich table format.',
    icon: 'i-lucide-table',
    color: 'success' as const,
    function: generateTableFromCsv
  },
  {
    id: 'yaml-table',
    name: 'YAML to Table',
    description: 'Transform YAML data into a structured table for easy viewing and analysis.',
    icon: 'i-lucide-file-text',
    color: 'info' as const,
    function: generateTableFromYaml
  }
]

// Table state
const tableData = ref<TableData[]>([])
const tableColumns = ref<TableColumn<TableData>[]>([])
const tableAnalysis = ref<{
  rowCount: number
  columnCount: number
  columnTypes: Record<string, string>
  sampleData: TableData[]
} | null>(null)
const currentTool = ref('json-table')
const includeIndex = ref(false)
const maxColumns = ref(20)

// Input data
const inputData = ref('')

// Table options
const pagination = ref({ pageIndex: 0, pageSize: 10 })
const sorting = ref([])
const columnFilters = ref([])
const globalFilter = ref('')
const columnVisibility = ref({})

// Generate table based on current tool and input
const generateTable = () => {
  if (!inputData.value.trim()) {
    tableData.value = [] as TableData[]
    tableColumns.value = []
    tableAnalysis.value = null
    return
  }

  try {
    const tool = tools.find(t => t.id === currentTool.value)
    if (!tool) return

    const result = tool.function(inputData.value, {
      includeIndex: includeIndex.value,
      maxColumns: maxColumns.value
    }) as { data: TableData[], columns: TableColumn<TableData>[] }

    tableData.value = result.data as TableData[]
    tableColumns.value = result.columns
    // @ts-expect-error - Type assertion needed for table data
    tableAnalysis.value = analyzeTableData(result.data as TableData[])
  } catch (error) {
    console.error('Error generating table:', error)
    // You could show a toast notification here
  }
}

// Watch for changes and regenerate table
watch([currentTool, inputData, includeIndex, maxColumns], generateTable, { immediate: true })

// Export functions
const exportData = (format: 'json' | 'csv' | 'yaml') => {
  if (tableData.value.length === 0) return

  // @ts-expect-error - Type assertion needed for table data
  const exported = exportTableData(tableData.value as TableData[], format)
  const blob = new Blob([exported], { type: 'text/plain' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `table-data.${format}`
  a.click()
  URL.revokeObjectURL(url)
}

// Sample data for each tool
const sampleData = {
  'json-table': `[
  {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "age": 30,
    "department": "Engineering",
    "salary": 75000,
    "active": true
  },
  {
    "id": 2,
    "name": "Jane Smith",
    "email": "jane@example.com",
    "age": 28,
    "department": "Marketing",
    "salary": 65000,
    "active": true
  },
  {
    "id": 3,
    "name": "Bob Johnson",
    "email": "bob@example.com",
    "age": 35,
    "department": "Sales",
    "salary": 70000,
    "active": false
  }
]`,
  'csv-table': `name,email,age,department,salary,active
John Doe,john@example.com,30,Engineering,75000,true
Jane Smith,jane@example.com,28,Marketing,65000,true
Bob Johnson,bob@example.com,35,Sales,70000,false
Alice Brown,alice@example.com,32,Engineering,80000,true
Charlie Wilson,charlie@example.com,29,Marketing,60000,false`,
  'yaml-table': `- name: John Doe
  email: john@example.com
  age: 30
  department: Engineering
  salary: 75000
  active: true
- name: Jane Smith
  email: jane@example.com
  age: 28
  department: Marketing
  salary: 65000
  active: true
- name: Bob Johnson
  email: bob@example.com
  age: 35
  department: Sales
  salary: 70000
  active: false`
}

const loadSampleData = () => {
  inputData.value = sampleData[currentTool.value as keyof typeof sampleData] || ''
}
</script>

<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="text-center">
      <h1 class="text-3xl font-bold text-gray-900 dark:text-white">
        Table Tools
      </h1>
      <p class="mt-2 text-lg text-gray-600 dark:text-gray-400">
        Generate interactive tables from JSON, CSV, and YAML data with advanced features
      </p>
    </div>

    <!-- Tool Selection -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
      <UCard
        v-for="tool in tools"
        :key="tool.id"
        :class="[
          'cursor-pointer transition-all duration-200',
          currentTool === tool.id
            ? 'ring-2 ring-primary-500 bg-primary-50 dark:bg-primary-900/20'
            : 'hover:shadow-md'
        ]"
        @click="currentTool = tool.id"
      >
        <div class="flex items-center space-x-3">
          <UIcon
            :name="tool.icon"
            :class="[
              'w-8 h-8',
              currentTool === tool.id ? 'text-primary-600' : 'text-gray-500'
            ]"
          />
          <div>
            <h3 class="font-semibold text-gray-900 dark:text-white">
              {{ tool.name }}
            </h3>
            <p class="text-sm text-gray-600 dark:text-gray-400">
              {{ tool.description }}
            </p>
          </div>
        </div>
      </UCard>
    </div>

    <!-- Input and Analysis Section -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- Input Section -->
      <UCard>
        <template #header>
          <div class="flex items-center justify-between">
            <h3 class="text-lg font-semibold">
              Input Data
            </h3>
            <div class="flex space-x-2">
              <UButton
                variant="outline"
                size="sm"
                @click="loadSampleData"
              >
                Load Sample
              </UButton>
              <UButton
                variant="outline"
                size="sm"
                @click="inputData = ''"
              >
                Clear
              </UButton>
            </div>
          </div>
        </template>

        <div class="space-y-4">
          <UTextarea
            v-model="inputData"
            :placeholder="`Enter your ${currentTool.replace('-table', '').toUpperCase()} data here...`"
            :rows="8"
            class="font-mono text-sm w-full"
          />

          <!-- Options -->
          <div class="flex flex-wrap gap-4">
            <UCheckbox
              v-model="includeIndex"
              label="Include row numbers"
            />
            <div class="flex items-center space-x-2">
              <label class="text-sm font-medium">Max columns:</label>
              <UInputNumber
                v-model="maxColumns"
                :min="1"
                :max="50"
                size="sm"
                class="w-20"
              />
            </div>
          </div>
        </div>
      </UCard>

      <!-- Table Analysis -->
      <UCard v-if="tableAnalysis">
        <template #header>
          <h3 class="text-lg font-semibold">
            Data Analysis
          </h3>
        </template>

        <div class="grid grid-cols-2 gap-4">
          <div class="text-center">
            <div class="text-2xl font-bold text-primary-600">
              {{ tableAnalysis.rowCount }}
            </div>
            <div class="text-sm text-gray-600 dark:text-gray-400">
              Rows
            </div>
          </div>
          <div class="text-center">
            <div class="text-2xl font-bold text-success-600">
              {{ tableAnalysis.columnCount }}
            </div>
            <div class="text-sm text-gray-600 dark:text-gray-400">
              Columns
            </div>
          </div>
          <div class="text-center">
            <div class="text-2xl font-bold text-info-600">
              {{ Object.keys(tableAnalysis.columnTypes).length }}
            </div>
            <div class="text-sm text-gray-600 dark:text-gray-400">
              Data Types
            </div>
          </div>
          <div class="text-center">
            <div class="text-2xl font-bold text-warning-600">
              {{ Math.round((tableAnalysis.rowCount * tableAnalysis.columnCount) / 100) }}
            </div>
            <div class="text-sm text-gray-600 dark:text-gray-400">
              Complexity
            </div>
          </div>
        </div>
      </UCard>

      <!-- Placeholder for analysis when no data -->
      <UCard v-else>
        <template #header>
          <h3 class="text-lg font-semibold">
            Data Analysis
          </h3>
        </template>

        <div class="text-center py-8">
          <UIcon
            name="i-lucide-bar-chart-3"
            class="w-8 h-8 text-gray-400 mx-auto mb-2"
          />
          <p class="text-sm text-gray-600 dark:text-gray-400">
            Analysis will appear here when data is loaded
          </p>
        </div>
      </UCard>
    </div>

    <!-- Table Display -->
    <UCard v-if="tableData.length > 0">
      <template #header>
        <div class="flex items-center justify-between">
          <h3 class="text-lg font-semibold">
            Generated Table
          </h3>
          <div class="flex space-x-2">
            <UDropdownMenu
              :items="[
                [
                  { label: 'Export as JSON', icon: 'i-lucide-file-code', onSelect: () => exportData('json') },
                  { label: 'Export as CSV', icon: 'i-lucide-file-spreadsheet', onSelect: () => exportData('csv') },
                  { label: 'Export as YAML', icon: 'i-lucide-file-text', onSelect: () => exportData('yaml') }
                ]
              ]"
            >
              <UButton
                variant="outline"
                size="sm"
                trailing-icon="i-lucide-download"
              >
                Export
              </UButton>
            </UDropdownMenu>
          </div>
        </div>
      </template>

      <div class="space-y-4">
        <!-- Global Filter -->
        <div class="flex justify-between items-center">
          <UInput
            v-model="globalFilter"
            placeholder="Search all columns..."
            icon="i-lucide-search"
            class="max-w-sm"
          />
          <div class="text-sm text-gray-600 dark:text-gray-400">
            {{ tableData.length }} rows
          </div>
        </div>

        <!-- Table -->
        <div class="overflow-x-auto">
          <UTable
            v-model:pagination="pagination"
            v-model:sorting="sorting"
            v-model:column-filters="columnFilters"
            v-model:global-filter="globalFilter"
            v-model:column-visibility="columnVisibility"
            :data="tableData"
            :columns="tableColumns"
            class="min-w-full"
          />
        </div>

        <!-- Pagination -->
        <div class="flex justify-center">
          <UPagination
            :page="pagination.pageIndex + 1"
            :page-count="Math.ceil(tableData.length / pagination.pageSize)"
            :total="tableData.length"
            @update:page="(page) => pagination.pageIndex = page - 1"
          />
        </div>
      </div>
    </UCard>

    <!-- Empty State -->
    <UCard v-else-if="inputData.trim()">
      <div class="text-center py-12">
        <UIcon
          name="i-lucide-table"
          class="w-12 h-12 text-gray-400 mx-auto mb-4"
        />
        <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">
          No Data to Display
        </h3>
        <p class="text-gray-600 dark:text-gray-400">
          Please check your input data format and try again.
        </p>
      </div>
    </UCard>

    <!-- Instructions -->
    <UCard v-else>
      <div class="text-center py-12">
        <UIcon
          name="i-lucide-table"
          class="w-12 h-12 text-gray-400 mx-auto mb-4"
        />
        <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">
          Ready to Generate Tables
        </h3>
        <p class="text-gray-600 dark:text-gray-400 mb-4">
          Select a tool above and enter your data to generate an interactive table.
        </p>
        <UButton @click="loadSampleData">
          Try Sample Data
        </UButton>
      </div>
    </UCard>
  </div>
</template>
