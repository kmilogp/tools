<script setup lang="ts">
useHead({
  title: 'Chart Tools - Programming Tools',
  meta: [
    { name: 'description', content: 'Chart generation from JSON, CSV, and YAML data for developers.' }
  ]
})
</script>

<template>
  <div class="container mx-auto px-4 py-8">
    <div class="mb-8">
      <div class="flex items-center space-x-3 mb-4">
        <UIcon name="i-lucide-bar-chart-3" class="w-8 h-8 text-indigo-500" />
        <h1 class="text-3xl font-bold text-gray-900 dark:text-white">
          Chart Tools
        </h1>
      </div>
      <p class="text-lg text-gray-600 dark:text-gray-300">
        Generate beautiful charts and visualizations from your JSON, CSV, and YAML data.
      </p>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <!-- JSON Chart Generator Tool -->
      <UCard class="hover:shadow-lg transition-shadow duration-200">
        <template #header>
          <div class="flex items-center space-x-2">
            <UIcon name="i-lucide-file-code" class="w-5 h-5 text-blue-500" />
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
              JSON Chart Generator
            </h3>
          </div>
        </template>
        
        <p class="text-gray-600 dark:text-gray-300 text-sm mb-4">
          Create interactive charts from JSON data with various chart types.
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

      <!-- CSV Chart Generator Tool -->
      <UCard class="hover:shadow-lg transition-shadow duration-200">
        <template #header>
          <div class="flex items-center space-x-2">
            <UIcon name="i-lucide-table" class="w-5 h-5 text-red-500" />
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
              CSV Chart Generator
            </h3>
          </div>
        </template>
        
        <p class="text-gray-600 dark:text-gray-300 text-sm mb-4">
          Generate charts directly from CSV data with automatic column detection.
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

      <!-- YAML Chart Generator Tool -->
      <UCard class="hover:shadow-lg transition-shadow duration-200">
        <template #header>
          <div class="flex items-center space-x-2">
            <UIcon name="i-lucide-file-text" class="w-5 h-5 text-purple-500" />
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
              YAML Chart Generator
            </h3>
          </div>
        </template>
        
        <p class="text-gray-600 dark:text-gray-300 text-sm mb-4">
          Create visualizations from YAML configuration files and data.
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

    <!-- Chart Types Preview -->
    <div class="mt-12">
      <h2 class="text-2xl font-bold text-gray-900 dark:text-white text-center mb-8">
        Supported Chart Types
      </h2>
      
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div class="text-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <UIcon name="i-lucide-bar-chart" class="w-8 h-8 text-indigo-500 mx-auto mb-2" />
          <p class="text-sm font-medium text-gray-900 dark:text-white">Bar Charts</p>
        </div>
        
        <div class="text-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <UIcon name="i-lucide-pie-chart" class="w-8 h-8 text-green-500 mx-auto mb-2" />
          <p class="text-sm font-medium text-gray-900 dark:text-white">Pie Charts</p>
        </div>
        
        <div class="text-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <UIcon name="i-lucide-trending-up" class="w-8 h-8 text-orange-500 mx-auto mb-2" />
          <p class="text-sm font-medium text-gray-900 dark:text-white">Line Charts</p>
        </div>
        
        <div class="text-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <UIcon name="i-lucide-scatter" class="w-8 h-8 text-purple-500 mx-auto mb-2" />
          <p class="text-sm font-medium text-gray-900 dark:text-white">Scatter Plots</p>
        </div>
      </div>
    </div>

    <!-- Coming Soon Notice -->
    <UAlert
      icon="i-lucide-info"
      color="indigo"
      variant="soft"
      title="Tools Under Development"
      description="These Chart tools are currently being developed and will be available soon. Check back later for updates!"
      class="mt-8"
    />
  </div>
</template>
