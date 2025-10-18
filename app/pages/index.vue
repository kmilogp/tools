<script setup lang="ts">
const toolCategories = [
  {
    name: 'JSON',
    path: '/json',
    icon: 'i-lucide-file-code',
    description: 'JSON parsing, escaping, formatting, and minification tools',
    color: 'blue'
  },
  {
    name: 'Base64',
    path: '/base64',
    icon: 'i-lucide-shield',
    description: 'Base64 encoding and decoding tools',
    color: 'green'
  },
  {
    name: 'Timestamp',
    path: '/timestamp',
    icon: 'i-lucide-clock',
    description: 'Timestamp generation, conversion, and translation tools',
    color: 'orange'
  },
  {
    name: 'YAML',
    path: '/yaml',
    icon: 'i-lucide-file-text',
    description: 'YAML parsing, formatting, and generation tools',
    color: 'purple'
  },
  {
    name: 'CSV',
    path: '/csv',
    icon: 'i-lucide-table',
    description: 'CSV parsing and formatting tools',
    color: 'red'
  },
  {
    name: 'Charts',
    path: '/charts',
    icon: 'i-lucide-bar-chart-3',
    description: 'Chart generation from JSON, CSV, and YAML data',
    color: 'indigo'
  }
]
</script>

<template>
  <div class="container mx-auto px-4 py-8">
    <!-- Hero Section -->
    <div class="text-center mb-12">
      <h1 class="text-4xl font-bold text-gray-900 dark:text-white mb-4">
        Programming Tools
      </h1>
      <p class="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
        A collection of essential tools for daily programming tasks. 
        Parse, format, convert, and visualize data with ease.
      </p>
    </div>

    <!-- Tool Categories Grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <UCard
        v-for="category in toolCategories"
        :key="category.name"
        :to="category.path"
        class="hover:shadow-lg transition-shadow duration-200 cursor-pointer"
      >
        <template #header>
          <div class="flex items-center space-x-3">
            <UIcon 
              :name="category.icon" 
              :class="`w-8 h-8 text-${category.color}-500`"
            />
            <h3 class="text-xl font-semibold text-gray-900 dark:text-white">
              {{ category.name }}
            </h3>
          </div>
        </template>

        <p class="text-gray-600 dark:text-gray-300">
          {{ category.description }}
        </p>

        <template #footer>
          <UButton 
            :to="category.path"
            color="primary"
            variant="soft"
            class="w-full"
          >
            Explore {{ category.name }} Tools
          </UButton>
        </template>
      </UCard>
    </div>

    <!-- Features Section -->
    <div class="mt-16">
      <h2 class="text-2xl font-bold text-gray-900 dark:text-white text-center mb-8">
        Why Choose Our Tools?
      </h2>
      
      <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div class="text-center">
          <UIcon name="i-lucide-zap" class="w-12 h-12 text-yellow-500 mx-auto mb-4" />
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            Fast & Efficient
          </h3>
          <p class="text-gray-600 dark:text-gray-300">
            Process your data quickly with optimized algorithms and modern web technologies.
          </p>
        </div>
        
        <div class="text-center">
          <UIcon name="i-lucide-shield-check" class="w-12 h-12 text-green-500 mx-auto mb-4" />
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            Secure & Private
          </h3>
          <p class="text-gray-600 dark:text-gray-300">
            All processing happens in your browser. Your data never leaves your device.
          </p>
        </div>
        
        <div class="text-center">
          <UIcon name="i-lucide-code" class="w-12 h-12 text-blue-500 mx-auto mb-4" />
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            Developer Friendly
          </h3>
          <p class="text-gray-600 dark:text-gray-300">
            Built with modern web standards and designed for developers by developers.
          </p>
        </div>
      </div>
    </div>
  </div>
</template>