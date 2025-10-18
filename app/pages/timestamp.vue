<script setup lang="ts">
useHead({
  title: 'Timestamp Tools - Programming Tools',
  meta: [
    { name: 'description', content: 'Timestamp generation, conversion, and translation tools for developers.' }
  ]
})
</script>

<template>
  <div class="container mx-auto px-4 py-8">
    <div class="mb-8">
      <div class="flex items-center space-x-3 mb-4">
        <UIcon name="i-lucide-clock" class="w-8 h-8 text-orange-500" />
        <h1 class="text-3xl font-bold text-gray-900 dark:text-white">
          Timestamp Tools
        </h1>
      </div>
      <p class="text-lg text-gray-600 dark:text-gray-300">
        Generate, convert, and translate timestamps between different formats and timezones.
      </p>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <!-- Timestamp Generator Tool -->
      <UCard class="hover:shadow-lg transition-shadow duration-200">
        <template #header>
          <div class="flex items-center space-x-2">
            <UIcon name="i-lucide-plus" class="w-5 h-5 text-orange-500" />
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
              Timestamp Generator
            </h3>
          </div>
        </template>
        
        <p class="text-gray-600 dark:text-gray-300 text-sm mb-4">
          Generate current timestamps in various formats (Unix, ISO, etc.).
        </p>
        
        <UButton 
          color="orange" 
          variant="soft" 
          class="w-full"
          disabled
        >
          Coming Soon
        </UButton>
      </UCard>

      <!-- Timestamp Converter Tool -->
      <UCard class="hover:shadow-lg transition-shadow duration-200">
        <template #header>
          <div class="flex items-center space-x-2">
            <UIcon name="i-lucide-refresh-cw" class="w-5 h-5 text-blue-500" />
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
              Timestamp Converter
            </h3>
          </div>
        </template>
        
        <p class="text-gray-600 dark:text-gray-300 text-sm mb-4">
          Convert timestamps between different formats and timezones.
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

      <!-- Timestamp Translator Tool -->
      <UCard class="hover:shadow-lg transition-shadow duration-200">
        <template #header>
          <div class="flex items-center space-x-2">
            <UIcon name="i-lucide-globe" class="w-5 h-5 text-purple-500" />
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
              Timestamp Translator
            </h3>
          </div>
        </template>
        
        <p class="text-gray-600 dark:text-gray-300 text-sm mb-4">
          Translate timestamps to human-readable format in different languages.
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
    </div>

    <!-- Coming Soon Notice -->
    <UAlert
      icon="i-lucide-info"
      color="orange"
      variant="soft"
      title="Tools Under Development"
      description="These Timestamp tools are currently being developed and will be available soon. Check back later for updates!"
      class="mt-8"
    />
  </div>
</template>
