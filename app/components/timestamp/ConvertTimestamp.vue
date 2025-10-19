<script setup lang="ts">
import {
  timestampToUnix
} from '~/utils/tools/timestamp'
import { useClipboard, useTimeAgoIntl, useDateFormat } from '@vueuse/core'

const { copy, copied } = useClipboard()

const inputTimestamp = ref('')

const timestampInputDate = computed(() => {
  if (!inputTimestamp.value.trim()) {
    return new Date()
  }

  const num = Number(inputTimestamp.value)
  if (num < 10000000000) {
    return new Date(num * 1000)
  } else {
    return new Date(num)
  }
})

const inputIso = computed(() => {
  return timestampInputDate.value.toISOString()
})
const inputUtc = computed(() => {
  return timestampInputDate.value.toUTCString()
})
const inputRelative = useTimeAgoIntl(timestampInputDate, { locale: 'en-US', updateInterval: 1000 })

const inputUnix = computed(() => {
  return timestampToUnix(timestampInputDate.value.getTime())
})

const inputMilliseconds = computed(() => {
  return timestampInputDate.value.getTime()
})

const inputTimezone = useDateFormat(timestampInputDate, 'YYYY-MM-DD HH:mm:ss zzz', { locales: 'en-US' })

const copyToClipboard = async (text: string) => {
  await copy(text)
}
</script>

<template>
  <UCard>
    <template #header>
      <div class="flex items-center gap-2">
        <UIcon
          name="i-lucide-edit"
          class="text-blue-500"
        />
        <h2 class="text-xl font-semibold">
          Convert Timestamp
        </h2>
      </div>
    </template>

    <div class="space-y-4">
      <div>
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Enter timestamp or date
        </label>
        <UInput
          v-model="inputTimestamp"
          placeholder="e.g., 1703123456789 or 2023-12-21T10:30:00Z or Dec 21, 2023"
          size="lg"
        />
        <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">
          Supports: milliseconds, Unix timestamp, ISO date, or any valid date string
        </p>
      </div>

      <div
        v-if="inputTimestamp"
        class="space-y-3"
      >
        <div class="border-t pt-4">
          <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-3">
            Converted Results
          </h3>

          <div class="flex items-center justify-between p-3 rounded-lg">
            <div>
              <div class="text-sm font-medium text-gray-600 dark:text-gray-400">
                Local Date
              </div>
              <div class="text-lg text-gray-900 dark:text-white">
                {{ timestampInputDate.toLocaleString() }}
              </div>
            </div>
            <UButton
              size="sm"
              variant="ghost"
              :icon="copied ? 'i-lucide-check' : 'i-lucide-copy'"
              :color="copied ? 'success' : 'neutral'"
              @click="copyToClipboard(timestampInputDate.toLocaleString())"
            />
          </div>

          <div class="flex items-center justify-between p-3 rounded-lg">
            <div>
              <div class="text-sm font-medium text-gray-600 dark:text-gray-400">
                With Timezone
              </div>
              <div class="text-lg text-gray-900 dark:text-white">
                {{ inputTimezone }}
              </div>
            </div>
            <UButton
              size="sm"
              variant="ghost"
              :icon="copied ? 'i-lucide-check' : 'i-lucide-copy'"
              :color="copied ? 'success' : 'neutral'"
              @click="copyToClipboard(inputTimezone)"
            />
          </div>

          <div class="flex items-center justify-between p-3 rounded-lg">
            <div>
              <div class="text-sm font-medium text-gray-600 dark:text-gray-400">
                ISO String
              </div>
              <div class="text-lg font-mono text-gray-900 dark:text-white">
                {{ inputIso }}
              </div>
            </div>
            <UButton
              size="sm"
              variant="ghost"
              :icon="copied ? 'i-lucide-check' : 'i-lucide-copy'"
              :color="copied ? 'success' : 'neutral'"
              @click="copyToClipboard(inputIso)"
            />
          </div>

          <div class="flex items-center justify-between p-3 rounded-lg">
            <div>
              <div class="text-sm font-medium text-gray-600 dark:text-gray-400">
                UTC String
              </div>
              <div class="text-lg font-mono text-gray-900 dark:text-white">
                {{ inputUtc }}
              </div>
            </div>
            <UButton
              size="sm"
              variant="ghost"
              :icon="copied ? 'i-lucide-check' : 'i-lucide-copy'"
              :color="copied ? 'success' : 'neutral'"
              @click="copyToClipboard(inputUtc)"
            />
          </div>

          <div class="flex items-center justify-between p-3 rounded-lg">
            <div>
              <div class="text-sm font-medium text-gray-600 dark:text-gray-400">
                Unix (Seconds)
              </div>
              <div class="text-lg font-mono text-gray-900 dark:text-white">
                {{ inputUnix }}
              </div>
            </div>
            <UButton
              size="sm"
              variant="ghost"
              :icon="copied ? 'i-lucide-check' : 'i-lucide-copy'"
              :color="copied ? 'success' : 'neutral'"
              @click="copyToClipboard(inputUnix.toString())"
            />
          </div>

          <div class="flex items-center justify-between p-3 rounded-lg">
            <div>
              <div class="text-sm font-medium text-gray-600 dark:text-gray-400">
                Milliseconds
              </div>
              <div class="text-lg font-mono text-gray-900 dark:text-white">
                {{ inputMilliseconds }}
              </div>
            </div>
            <UButton
              size="sm"
              variant="ghost"
              :icon="copied ? 'i-lucide-check' : 'i-lucide-copy'"
              :color="copied ? 'success' : 'neutral'"
              @click="copyToClipboard(inputMilliseconds.toString())"
            />
          </div>

          <div class="flex items-center justify-between p-3 rounded-lg">
            <div>
              <div class="text-sm font-medium text-gray-600 dark:text-gray-400">
                Relative Time
              </div>
              <div class="text-lg text-gray-900 dark:text-white">
                {{ inputRelative }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </UCard>
</template>
