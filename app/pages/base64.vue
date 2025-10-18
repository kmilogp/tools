<script setup lang="ts">
useHead({
  title: 'Base64 Tools - Programming Tools',
  meta: [
    { name: 'description', content: 'Base64 encoding and decoding tools for developers.' }
  ]
})
</script>

<template>
  <div class="container mx-auto px-4 py-8">
    <div class="mb-8">
      <div class="flex items-center space-x-3 mb-4">
        <UIcon name="i-lucide-shield" class="w-8 h-8 text-green-500" />
        <h1 class="text-3xl font-bold text-gray-900 dark:text-white">
          Base64 Tools
        </h1>
      </div>
      <p class="text-lg text-gray-600 dark:text-gray-300">
        Encode and decode data using Base64 encoding with our reliable tools.
      </p>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <!-- Base64 Encoder Tool -->
      <UCard class="hover:shadow-lg transition-shadow duration-200">
        <template #header>
          <div class="flex items-center space-x-2">
            <UIcon name="i-lucide-lock" class="w-5 h-5 text-green-500" />
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
              Base64 Encoder
            </h3>
          </div>
        </template>
        
        <p class="text-gray-600 dark:text-gray-300 text-sm mb-4">
          Convert text or binary data to Base64 encoded format.
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

      <!-- Base64 Decoder Tool -->
      <UCard class="hover:shadow-lg transition-shadow duration-200">
        <template #header>
          <div class="flex items-center space-x-2">
            <UIcon name="i-lucide-unlock" class="w-5 h-5 text-blue-500" />
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
              Base64 Decoder
            </h3>
          </div>
        </template>
        
        <p class="text-gray-600 dark:text-gray-300 text-sm mb-4">
          Decode Base64 encoded data back to its original format.
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
      color="green"
      variant="soft"
      title="Tools Under Development"
      description="These Base64 tools are currently being developed and will be available soon. Check back later for updates!"
      class="mt-8"
    />
  </div>
</template>
