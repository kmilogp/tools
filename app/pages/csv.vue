<script setup lang="ts">
useHead({
  title: 'CSV Tools - Programming Tools',
  meta: [
    { name: 'description', content: 'CSV parsing and formatting tools for developers.' }
  ]
})
</script>

<template>
  <div class="container mx-auto px-4 py-8">
    <div class="mb-8">
      <div class="flex items-center space-x-3 mb-4">
        <UIcon name="i-lucide-table" class="w-8 h-8 text-red-500" />
        <h1 class="text-3xl font-bold text-gray-900 dark:text-white">
          CSV Tools
        </h1>
      </div>
      <p class="text-lg text-gray-600 dark:text-gray-300">
        Parse and format CSV data with our reliable and efficient tools.
      </p>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <!-- CSV Parser Tool -->
      <UCard class="hover:shadow-lg transition-shadow duration-200">
        <template #header>
          <div class="flex items-center space-x-2">
            <UIcon name="i-lucide-file-spreadsheet" class="w-5 h-5 text-red-500" />
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
              CSV Parser
            </h3>
          </div>
        </template>
        
        <p class="text-gray-600 dark:text-gray-300 text-sm mb-4">
          Parse CSV data and convert it to JSON or other formats.
        </p>
        
        <UButton 
          color="red" 
          variant="soft" 
          class="w-full"
          disabled
        >
          Coming Soon
        </UButton>
      </UCard>

      <!-- CSV Formatter Tool -->
      <UCard class="hover:shadow-lg transition-shadow duration-200">
        <template #header>
          <div class="flex items-center space-x-2">
            <UIcon name="i-lucide-align-left" class="w-5 h-5 text-blue-500" />
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
              CSV Formatter
            </h3>
          </div>
        </template>
        
        <p class="text-gray-600 dark:text-gray-300 text-sm mb-4">
          Format and beautify CSV data with proper alignment and structure.
        </p>
        
        <UButton 
          color="blue" 
          variant="soft" 
          class="w-full"
          disabled
        >
          Coming Soon
        </UButton>
      </UCard>
    </div>

    <!-- Coming Soon Notice -->
    <UAlert
      icon="i-lucide-info"
      color="red"
      variant="soft"
      title="Tools Under Development"
      description="These CSV tools are currently being developed and will be available soon. Check back later for updates!"
      class="mt-8"
    />
  </div>
</template>
