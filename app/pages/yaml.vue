<script setup lang="ts">
useHead({
  title: 'YAML Tools - Programming Tools',
  meta: [
    { name: 'description', content: 'YAML parsing, formatting, and generation tools for developers.' }
  ]
})
</script>

<template>
  <div class="container mx-auto px-4 py-8">
    <div class="mb-8">
      <div class="flex items-center space-x-3 mb-4">
        <UIcon name="i-lucide-file-text" class="w-8 h-8 text-purple-500" />
        <h1 class="text-3xl font-bold text-gray-900 dark:text-white">
          YAML Tools
        </h1>
      </div>
      <p class="text-lg text-gray-600 dark:text-gray-300">
        Parse, format, and generate YAML data with our comprehensive set of tools.
      </p>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <!-- YAML Parser Tool -->
      <UCard class="hover:shadow-lg transition-shadow duration-200">
        <template #header>
          <div class="flex items-center space-x-2">
            <UIcon name="i-lucide-code" class="w-5 h-5 text-purple-500" />
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
              YAML Parser
            </h3>
          </div>
        </template>
        
        <p class="text-gray-600 dark:text-gray-300 text-sm mb-4">
          Parse and validate YAML strings with detailed error reporting.
        </p>
        
        <UButton 
          color="purple" 
          variant="soft" 
          class="w-full"
          disabled
        >
          Coming Soon
        </UButton>
      </UCard>

      <!-- YAML Formatter Tool -->
      <UCard class="hover:shadow-lg transition-shadow duration-200">
        <template #header>
          <div class="flex items-center space-x-2">
            <UIcon name="i-lucide-align-left" class="w-5 h-5 text-blue-500" />
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
              YAML Formatter
            </h3>
          </div>
        </template>
        
        <p class="text-gray-600 dark:text-gray-300 text-sm mb-4">
          Format and beautify YAML with proper indentation and structure.
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

      <!-- YAML Generator Tool -->
      <UCard class="hover:shadow-lg transition-shadow duration-200">
        <template #header>
          <div class="flex items-center space-x-2">
            <UIcon name="i-lucide-plus-circle" class="w-5 h-5 text-green-500" />
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
              YAML Generator
            </h3>
          </div>
        </template>
        
        <p class="text-gray-600 dark:text-gray-300 text-sm mb-4">
          Generate YAML from JSON or other data formats.
        </p>
        
        <UButton 
          color="green" 
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
      color="purple"
      variant="soft"
      title="Tools Under Development"
      description="These YAML tools are currently being developed and will be available soon. Check back later for updates!"
      class="mt-8"
    />
  </div>
</template>
