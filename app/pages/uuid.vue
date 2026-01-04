<script setup lang="ts">
import { generateUuidV4, generateUuidV7 } from '~/utils/tools/uuid'

useHead({
  title: 'UUID Tools - Programming Tools',
  meta: [
    {
      name: 'description',
      content: 'Generate UUID v4 and v7 using browser crypto utilities.'
    }
  ]
})

const uuidV4 = ref('')
const uuidV7 = ref('')
const generatedUuids = ref<Array<{ version: 'v4' | 'v7', uuid: string, timestamp: number }>>([])
const count = ref(1)
const toast = useToast()

function generateV4() {
  try {
    uuidV4.value = generateUuidV4()
    generatedUuids.value.unshift({
      version: 'v4',
      uuid: uuidV4.value,
      timestamp: Date.now()
    })
    // Automatically copy to clipboard
    navigator.clipboard.writeText(uuidV4.value)
    toast.add({
      title: 'UUID v4 generated and copied to clipboard',
      color: 'success'
    })
  } catch (error) {
    toast.add({
      title: 'Error generating UUID v4',
      description: error instanceof Error ? error.message : 'Unknown error',
      color: 'error'
    })
  }
}

function generateV7() {
  try {
    uuidV7.value = generateUuidV7()
    generatedUuids.value.unshift({
      version: 'v7',
      uuid: uuidV7.value,
      timestamp: Date.now()
    })
    // Automatically copy to clipboard
    navigator.clipboard.writeText(uuidV7.value)
    toast.add({
      title: 'UUID v7 generated and copied to clipboard',
      color: 'success'
    })
  } catch (error) {
    toast.add({
      title: 'Error generating UUID v7',
      description: error instanceof Error ? error.message : 'Unknown error',
      color: 'error'
    })
  }
}

function copyToClipboard(text: string) {
  navigator.clipboard.writeText(text)
  toast.add({
    title: 'UUID copied to clipboard',
    color: 'info'
  })
}

function clearHistory() {
  generatedUuids.value = []
}

function generateMultiple(version: 'v4' | 'v7') {
  try {
    const generator = version === 'v4' ? generateUuidV4 : generateUuidV7
    const uuids = Array.from({ length: count.value }, () => generator())
    uuids.forEach((uuid) => {
      generatedUuids.value.unshift({
        version,
        uuid,
        timestamp: Date.now()
      })
    })
    toast.add({
      title: `Generated ${count.value} UUID ${version}`,
      color: 'success'
    })
  } catch (error) {
    toast.add({
      title: `Error generating UUID ${version}`,
      description: error instanceof Error ? error.message : 'Unknown error',
      color: 'error'
    })
  }
}
</script>

<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900">
    <div class="container mx-auto p-4">
      <div class="mb-8">
        <div class="flex items-center gap-3 mb-4">
          <UIcon
            name="i-lucide-fingerprint"
            class="text-4xl text-purple-500"
          />
          <div>
            <h1 class="text-3xl font-bold text-gray-900 dark:text-white">
              UUID Tools
            </h1>
            <p class="text-gray-600 dark:text-gray-400">
              Generate UUID v4 and v7 using browser crypto utilities
            </p>
          </div>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <!-- UUID v4 Generator -->
        <UCard>
          <template #header>
            <div class="flex items-center gap-2">
              <UIcon
                name="i-lucide-hash"
                class="w-5 h-5 text-blue-500"
              />
              <h2 class="text-xl font-semibold text-gray-900 dark:text-white">
                UUID v4 (Random)
              </h2>
            </div>
          </template>

          <div class="space-y-4">
            <p class="text-sm text-gray-600 dark:text-gray-400">
              Generates a random UUID using crypto.randomUUID()
            </p>

            <div class="flex items-center gap-2">
              <UInput
                :model-value="uuidV4"
                placeholder="Click Generate to create a UUID v4"
                readonly
                class="flex-1"
              />
              <UButton
                color="primary"
                @click="generateV4"
              >
                <UIcon
                  name="i-lucide-sparkles"
                  class="w-4 h-4 mr-2"
                />
                Generate
              </UButton>
              <UButton
                v-if="uuidV4"
                color="info"
                variant="soft"
                @click="copyToClipboard(uuidV4)"
              >
                <UIcon
                  name="i-lucide-copy"
                  class="w-4 h-4"
                />
              </UButton>
            </div>

            <div class="flex items-center gap-2">
              <UInput
                v-model.number="count"
                type="number"
                min="1"
                max="100"
                class="w-24"
              />
              <UButton
                color="primary"
                variant="soft"
                @click="generateMultiple('v4')"
              >
                Generate {{ count }} UUID{{ count !== 1 ? 's' : '' }}
              </UButton>
            </div>
          </div>
        </UCard>

        <!-- UUID v7 Generator -->
        <UCard>
          <template #header>
            <div class="flex items-center gap-2">
              <UIcon
                name="i-lucide-clock"
                class="w-5 h-5 text-green-500"
              />
              <h2 class="text-xl font-semibold text-gray-900 dark:text-white">
                UUID v7 (Time-ordered)
              </h2>
            </div>
          </template>

          <div class="space-y-4">
            <p class="text-sm text-gray-600 dark:text-gray-400">
              Generates a time-ordered UUID with timestamp using crypto.getRandomValues()
            </p>

            <div class="flex items-center gap-2">
              <UInput
                :model-value="uuidV7"
                placeholder="Click Generate to create a UUID v7"
                readonly
                class="flex-1"
              />
              <UButton
                color="success"
                @click="generateV7"
              >
                <UIcon
                  name="i-lucide-sparkles"
                  class="w-4 h-4 mr-2"
                />
                Generate
              </UButton>
              <UButton
                v-if="uuidV7"
                color="info"
                variant="soft"
                @click="copyToClipboard(uuidV7)"
              >
                <UIcon
                  name="i-lucide-copy"
                  class="w-4 h-4"
                />
              </UButton>
            </div>

            <div class="flex items-center gap-2">
              <UInput
                v-model.number="count"
                type="number"
                min="1"
                max="100"
                class="w-24"
              />
              <UButton
                color="success"
                variant="soft"
                @click="generateMultiple('v7')"
              >
                Generate {{ count }} UUID{{ count !== 1 ? 's' : '' }}
              </UButton>
            </div>
          </div>
        </UCard>
      </div>

      <!-- Generated UUIDs History -->
      <UCard v-if="generatedUuids.length > 0">
        <template #header>
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-2">
              <UIcon
                name="i-lucide-history"
                class="w-5 h-5 text-gray-500"
              />
              <h2 class="text-xl font-semibold text-gray-900 dark:text-white">
                Generated UUIDs ({{ generatedUuids.length }})
              </h2>
            </div>
            <UButton
              color="neutral"
              variant="soft"
              size="sm"
              @click="clearHistory"
            >
              <UIcon
                name="i-lucide-trash-2"
                class="w-4 h-4 mr-2"
              />
              Clear
            </UButton>
          </div>
        </template>

        <div class="space-y-2 max-h-96 overflow-y-auto">
          <div
            v-for="(item, index) in generatedUuids"
            :key="`${item.uuid}-${index}`"
            class="flex items-center gap-3 p-3 bg-gray-100 dark:bg-gray-800 rounded-lg"
          >
            <UBadge
              :color="item.version === 'v4' ? 'primary' : 'success'"
              variant="soft"
            >
              v{{ item.version }}
            </UBadge>
            <code class="flex-1 text-sm font-mono text-gray-900 dark:text-white">
              {{ item.uuid }}
            </code>
            <UButton
              color="info"
              variant="ghost"
              size="sm"
              @click="copyToClipboard(item.uuid)"
            >
              <UIcon
                name="i-lucide-copy"
                class="w-4 h-4"
              />
            </UButton>
          </div>
        </div>
      </UCard>
    </div>
  </div>
</template>
