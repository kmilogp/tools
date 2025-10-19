<script setup lang="ts">
import {
  getCurrentTimestamp,
  getCurrentTimestampSeconds,
  timestampToDate,
  timestampToIso,
  timestampToUtc,
  dateToTimestamp,
  unixToTimestamp,
  timestampToUnix,
  isValidTimestamp,
  getTimestampInfo,
  getRelativeTime,
  formatTimestampWithTimezone
} from '~/utils/tools/timestamp'

useHead({
  title: 'Timestamp Tools - Programming Tools',
  meta: [
    {
      name: 'description',
      content: 'Timestamp generation, conversion, and translation tools for developers.'
    }
  ]
})

// Real-time current timestamp
const currentTimestamp = ref(getCurrentTimestamp())
const currentTimestampSeconds = ref(getCurrentTimestampSeconds())
const currentDate = ref('')
const currentIso = ref('')
const currentUtc = ref('')
const currentRelative = ref('')

// Input timestamp
const inputTimestamp = ref('')
const inputDate = ref('')
const inputIso = ref('')
const inputUtc = ref('')
const inputRelative = ref('')
const inputUnix = ref('')
const inputMilliseconds = ref('')
const inputTimezone = ref('')

// User locale
const userLocale = ref('en-US')

// Update real-time timestamp every second
const updateCurrentTimestamp = () => {
  const now = getCurrentTimestamp()
  currentTimestamp.value = now
  currentTimestampSeconds.value = getCurrentTimestampSeconds()
  currentDate.value = timestampToDate(now, userLocale.value)
  currentIso.value = timestampToIso(now)
  currentUtc.value = timestampToUtc(now)
  currentRelative.value = getRelativeTime(now)
}

// Process input timestamp
const processInputTimestamp = () => {
  if (!inputTimestamp.value.trim()) {
    clearInputResults()
    return
  }

  try {
    let timestamp: number

    if (isValidTimestamp(inputTimestamp.value)) {
      const num = Number(inputTimestamp.value)
      // Determine if it's Unix timestamp (seconds) or milliseconds
      if (num < 10000000000) { // Less than year 2001 in seconds
        timestamp = unixToTimestamp(num)
      } else {
        timestamp = num
      }
    } else {
      // Try to parse as date string
      timestamp = dateToTimestamp(inputTimestamp.value)
    }

    inputDate.value = timestampToDate(timestamp, userLocale.value)
    inputIso.value = timestampToIso(timestamp)
    inputUtc.value = timestampToUtc(timestamp)
    inputRelative.value = getRelativeTime(timestamp)
    inputUnix.value = timestampToUnix(timestamp).toString()
    inputMilliseconds.value = timestamp.toString()
    inputTimezone.value = formatTimestampWithTimezone(timestamp, userLocale.value)
  } catch (error) {
    clearInputResults()
    console.error('Error processing timestamp:', error)
  }
}

const clearInputResults = () => {
  inputDate.value = ''
  inputIso.value = ''
  inputUtc.value = ''
  inputRelative.value = ''
  inputUnix.value = ''
  inputMilliseconds.value = ''
  inputTimezone.value = ''
}

// Watch for input changes
watch(inputTimestamp, processInputTimestamp)

// Initialize and start timer
onMounted(() => {
  updateCurrentTimestamp()
  const interval = setInterval(updateCurrentTimestamp, 1000)

  onUnmounted(() => {
    clearInterval(interval)
  })
})

// Copy to clipboard functions
const copyToClipboard = async (text: string) => {
  try {
    await navigator.clipboard.writeText(text)
  } catch (err) {
    console.error('Failed to copy to clipboard:', err)
  }
}
</script>

<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900">
    <div class="container mx-auto px-4 py-8">
      <!-- Header -->
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
        <!-- Current Timestamp Section -->
        <div class="space-y-6">
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
              <!-- Milliseconds -->
              <div class="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div>
                  <div class="text-sm font-medium text-gray-600 dark:text-gray-400">
                    Milliseconds
                  </div>
                  <div class="text-lg font-mono text-gray-900 dark:text-white">
                    {{ currentTimestamp.toLocaleString() }}
                  </div>
                </div>
                <UButton
                  size="sm"
                  variant="ghost"
                  icon="i-lucide-copy"
                  @click="copyToClipboard(currentTimestamp.toString())"
                />
              </div>

              <!-- Unix (Seconds) -->
              <div class="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div>
                  <div class="text-sm font-medium text-gray-600 dark:text-gray-400">
                    Unix (Seconds)
                  </div>
                  <div class="text-lg font-mono text-gray-900 dark:text-white">
                    {{ currentTimestampSeconds.toLocaleString() }}
                  </div>
                </div>
                <UButton
                  size="sm"
                  variant="ghost"
                  icon="i-lucide-copy"
                  @click="copyToClipboard(currentTimestampSeconds.toString())"
                />
              </div>

              <!-- Local Date -->
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
                  icon="i-lucide-copy"
                  @click="copyToClipboard(currentDate)"
                />
              </div>

              <!-- ISO String -->
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
                  icon="i-lucide-copy"
                  @click="copyToClipboard(currentIso)"
                />
              </div>

              <!-- UTC String -->
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
                  icon="i-lucide-copy"
                  @click="copyToClipboard(currentUtc)"
                />
              </div>

              <!-- Relative Time -->
              <div class="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div>
                  <div class="text-sm font-medium text-gray-600 dark:text-gray-400">
                    Relative Time
                  </div>
                  <div class="text-lg text-gray-900 dark:text-white">
                    {{ currentRelative }}
                  </div>
                </div>
              </div>
            </div>
          </UCard>
        </div>

        <!-- Input Timestamp Section -->
        <div class="space-y-6">
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
              <!-- Input Field -->
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

              <!-- Locale Selector -->
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Locale
                </label>
                <USelect
                  v-model="userLocale"
                  :options="[
                    { label: 'English (US)', value: 'en-US' },
                    { label: 'English (UK)', value: 'en-GB' },
                    { label: 'Spanish', value: 'es-ES' },
                    { label: 'French', value: 'fr-FR' },
                    { label: 'German', value: 'de-DE' },
                    { label: 'Japanese', value: 'ja-JP' },
                    { label: 'Chinese', value: 'zh-CN' }
                  ]"
                />
              </div>

              <!-- Results -->
              <div
                v-if="inputDate"
                class="space-y-3"
              >
                <div class="border-t pt-4">
                  <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-3">
                    Converted Results
                  </h3>

                  <!-- Local Date -->
                  <div class="flex items-center justify-between p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                    <div>
                      <div class="text-sm font-medium text-gray-600 dark:text-gray-400">
                        Local Date
                      </div>
                      <div class="text-lg text-gray-900 dark:text-white">
                        {{ inputDate }}
                      </div>
                    </div>
                    <UButton
                      size="sm"
                      variant="ghost"
                      icon="i-lucide-copy"
                      @click="copyToClipboard(inputDate)"
                    />
                  </div>

                  <!-- With Timezone -->
                  <div class="flex items-center justify-between p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
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
                      icon="i-lucide-copy"
                      @click="copyToClipboard(inputTimezone)"
                    />
                  </div>

                  <!-- ISO String -->
                  <div class="flex items-center justify-between p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
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
                      icon="i-lucide-copy"
                      @click="copyToClipboard(inputIso)"
                    />
                  </div>

                  <!-- UTC String -->
                  <div class="flex items-center justify-between p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
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
                      icon="i-lucide-copy"
                      @click="copyToClipboard(inputUtc)"
                    />
                  </div>

                  <!-- Unix Timestamp -->
                  <div class="flex items-center justify-between p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
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
                      icon="i-lucide-copy"
                      @click="copyToClipboard(inputUnix)"
                    />
                  </div>

                  <!-- Milliseconds -->
                  <div class="flex items-center justify-between p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
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
                      icon="i-lucide-copy"
                      @click="copyToClipboard(inputMilliseconds)"
                    />
                  </div>

                  <!-- Relative Time -->
                  <div class="flex items-center justify-between p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
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
        </div>
      </div>
    </div>
  </div>
</template>
