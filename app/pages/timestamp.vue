<script setup lang="ts">
useHead({
  title: 'Timestamp Tools - Programming Tools',
  meta: [
    {
      name: 'description',
      content: 'Timestamp generation, conversion, and translation tools for developers.'
    }
  ]
})
</script>

<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900">
    <div class="container mx-auto px-4 py-8">
      <div class="mb-8">
        <div class="flex items-center gap-3 mb-4">
          <UIcon
            name="i-lucide-clock"
            class="text-4xl text-orange-500"
          />
          <div>
            <h1 class="text-3xl font-bold text-gray-900 dark:text-white">
              Timestamp Tools
            </h1>
            <p class="text-gray-600 dark:text-gray-400">
              Generate, convert, and translate timestamps in real-time
            </p>
          </div>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div class="space-y-6">
          <TimestampCurrentTimestamp />
          <TimestampCountdownTimer />
        </div>

        <div class="space-y-6">
          <TimestampConvertTimestamp />
        </div>
      </div>
    </div>
  </div>
</template>
