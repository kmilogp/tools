<script setup lang="ts">
import {
  timestampToIso,
  timestampToUtc
} from '~/utils/tools/timestamp'
import { useClipboard, useNow, useDateFormat } from '@vueuse/core'

const { copy, copied } = useClipboard()

const now = useNow({ interval: 1000 })
const currentTimestamp = computed(() => now.value.getTime())
const currentTimestampSeconds = computed(() => Math.floor(now.value.getTime() / 1000))

const currentDate = useDateFormat(now, 'YYYY-MM-DD HH:mm:ss', { locales: 'en-US' })
const currentIso = computed(() => timestampToIso(currentTimestamp.value))
const currentUtc = computed(() => timestampToUtc(currentTimestamp.value))

// Copy to clipboard function using VueUse
const copyToClipboard = async (text: string) => {
  await copy(text)
}
</script>

<template>
  <UCard>
    <template #header>
      <div class="flex items-center gap-2">
        <UIcon
          name="i-lucide-clock"
          class="text-orange-500"
        />
        <h2 class="text-xl font-semibold">
          Current Timestamp
        </h2>
      </div>
    </template>

    <div class="space-y-4">
      <div class="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
        <div>
          <div class="text-sm font-medium text-gray-600 dark:text-gray-400">
            Milliseconds
          </div>
          <div class="text-lg font-mono text-gray-900 dark:text-white">
            {{ currentTimestamp.toString() }}
          </div>
        </div>
        <UButton
          size="sm"
          variant="ghost"
          :icon="copied ? 'i-lucide-check' : 'i-lucide-copy'"
          :color="copied ? 'success' : 'neutral'"
          @click="copyToClipboard(currentTimestamp.toString())"
        />
      </div>

      <div class="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
        <div>
          <div class="text-sm font-medium text-gray-600 dark:text-gray-400">
            Unix (Seconds)
          </div>
          <div class="text-lg font-mono text-gray-900 dark:text-white">
            {{ currentTimestampSeconds.toString() }}
          </div>
        </div>
        <UButton
          size="sm"
          variant="ghost"
          :icon="copied ? 'i-lucide-check' : 'i-lucide-copy'"
          :color="copied ? 'success' : 'neutral'"
          @click="copyToClipboard(currentTimestampSeconds.toString())"
        />
      </div>

      <div class="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
        <div>
          <div class="text-sm font-medium text-gray-600 dark:text-gray-400">
            Local Date
          </div>
          <div class="text-lg text-gray-900 dark:text-white">
            {{ currentDate }}
          </div>
        </div>
        <UButton
          size="sm"
          variant="ghost"
          :icon="copied ? 'i-lucide-check' : 'i-lucide-copy'"
          :color="copied ? 'success' : 'neutral'"
          @click="copyToClipboard(currentDate)"
        />
      </div>

      <div class="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
        <div>
          <div class="text-sm font-medium text-gray-600 dark:text-gray-400">
            ISO String
          </div>
          <div class="text-lg font-mono text-gray-900 dark:text-white">
            {{ currentIso }}
          </div>
        </div>
        <UButton
          size="sm"
          variant="ghost"
          :icon="copied ? 'i-lucide-check' : 'i-lucide-copy'"
          :color="copied ? 'success' : 'neutral'"
          @click="copyToClipboard(currentIso)"
        />
      </div>

      <div class="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
        <div>
          <div class="text-sm font-medium text-gray-600 dark:text-gray-400">
            UTC String
          </div>
          <div class="text-lg font-mono text-gray-900 dark:text-white">
            {{ currentUtc }}
          </div>
        </div>
        <UButton
          size="sm"
          variant="ghost"
          :icon="copied ? 'i-lucide-check' : 'i-lucide-copy'"
          :color="copied ? 'success' : 'neutral'"
          @click="copyToClipboard(currentUtc)"
        />
      </div>
    </div>
  </UCard>
</template>
