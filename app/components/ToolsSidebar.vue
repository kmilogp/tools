<script setup lang="ts">
const toolCategories = [
  {
    name: 'JSON',
    path: '/json',
    icon: 'i-lucide-file-code',
    description: 'JSON parsing, escaping, formatting, and minification tools'
  },
  {
    name: 'Base64',
    path: '/base64',
    icon: 'i-lucide-shield',
    description: 'Base64 encoding and decoding tools'
  },
  {
    name: 'Timestamp',
    path: '/timestamp',
    icon: 'i-lucide-clock',
    description: 'Timestamp generation, conversion, and translation tools'
  },
  {
    name: 'YAML',
    path: '/yaml',
    icon: 'i-lucide-file-text',
    description: 'YAML parsing, formatting, and generation tools'
  },
  {
    name: 'CSV',
    path: '/csv',
    icon: 'i-lucide-table',
    description: 'CSV parsing and formatting tools'
  },
  {
    name: 'Charts',
    path: '/charts',
    icon: 'i-lucide-bar-chart-3',
    description: 'Chart generation from JSON, CSV, and YAML data'
  }
]
</script>

<template>
  <div class="w-64 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 h-full">
    <div class="p-6">
      <h2 class="text-lg font-semibold text-gray-900 dark:text-white mb-6">
        Tools Categories
      </h2>
      
      <nav class="space-y-2">
        <NuxtLink
          v-for="category in toolCategories"
          :key="category.name"
          :to="category.path"
          class="flex items-center space-x-3 p-3 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200 group"
        >
          <UIcon :name="category.icon" class="w-5 h-5 text-gray-500 dark:text-gray-400 group-hover:text-primary-500" />
          <div class="flex-1 min-w-0">
            <p class="text-sm font-medium text-gray-900 dark:text-white">
              {{ category.name }}
            </p>
            <p class="text-xs text-gray-500 dark:text-gray-400 truncate">
              {{ category.description }}
            </p>
          </div>
        </NuxtLink>
      </nav>
    </div>
  </div>
</template>
