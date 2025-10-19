<script setup lang="ts">
import {
  timestampToIso,
  timestampToUtc,
  dateToTimestamp,
  unixToTimestamp,
  timestampToUnix,
  isValidTimestamp
} from '~/utils/tools/timestamp'
import { useClipboard, useNow, useCountdown, useDateFormat, useTimeAgoIntl } from '@vueuse/core'

useHead({
  title: 'Timestamp Tools - Programming Tools',
  meta: [
    {
      name: 'description',
      content: 'Timestamp generation, conversion, and translation tools for developers.'
    }
  ]
})

const { copy, copied, isSupported: clipboardSupported } = useClipboard()

const now = useNow({ interval: 1000 })
const currentTimestamp = computed(() => now.value.getTime())
const currentTimestampSeconds = computed(() => Math.floor(now.value.getTime() / 1000))

const currentDate = useDateFormat(now, 'YYYY-MM-DD HH:mm:ss', { locales: 'en-US' })
const currentIso = computed(() => timestampToIso(currentTimestamp.value))
const currentUtc = computed(() => timestampToUtc(currentTimestamp.value))

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

const countdownTarget = ref('')
const countdownSeconds = ref(0)
const countdown = useCountdown(countdownSeconds, {
  immediate: false
})

const setCountdownTarget = () => {
  if (!countdownTarget.value.trim()) {
    countdownSeconds.value = 0
    return
  }

  try {
    let targetTimestamp: number

    if (isValidTimestamp(countdownTarget.value)) {
      const num = Number(countdownTarget.value)
      if (num < 10000000000) {
        targetTimestamp = unixToTimestamp(num)
      } else {
        targetTimestamp = num
      }
    } else {
      targetTimestamp = dateToTimestamp(countdownTarget.value)
    }

    const now = Date.now()
    const diff = targetTimestamp - now

    if (diff > 0) {
      countdownSeconds.value = Math.floor(diff / 1000)
      countdown.start()
    } else {
      countdownSeconds.value = 0
    }
  } catch (error) {
    console.error('Error setting countdown target:', error)
    countdownSeconds.value = 0
  }
}

watch(countdownTarget, setCountdownTarget)

// Copy to clipboard function using VueUse
const copyToClipboard = async (text: string) => {
  if (clipboardSupported.value) {
    await copy(text)
  } else {
    console.error('Clipboard API not supported')
  }
}
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
          <UCard>
            <template #header>
              <div class="flex items-center gap-2">
                <UIcon
                  name="i-lucide-timer"
                  class="text-purple-500"
                />
                <h2 class="text-xl font-semibold">
                  Countdown Timer
                </h2>
              </div>
            </template>

            <div class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Target date/time
                </label>
                <UInput
                  v-model="countdownTarget"
                  placeholder="e.g., 2024-12-31T23:59:59 or 1704067199000"
                  size="lg"
                />
                <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Enter a future date/time to start countdown
                </p>
              </div>

              <div
                v-if="countdownSeconds > 0 && countdown.isActive.value"
                class="space-y-3"
              >
                <div class="border-t pt-4">
                  <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-3">
                    Countdown
                  </h3>

                  <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div class="text-center p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                      <div class="text-2xl font-bold text-purple-600 dark:text-purple-400">
                        {{ Math.floor(countdown.remaining.value / 86400) }}
                      </div>
                      <div class="text-sm text-gray-600 dark:text-gray-400">
                        Days
                      </div>
                    </div>

                    <div class="text-center p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                      <div class="text-2xl font-bold text-purple-600 dark:text-purple-400">
                        {{ Math.floor((countdown.remaining.value % 86400) / 3600) }}
                      </div>
                      <div class="text-sm text-gray-600 dark:text-gray-400">
                        Hours
                      </div>
                    </div>

                    <div class="text-center p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                      <div class="text-2xl font-bold text-purple-600 dark:text-purple-400">
                        {{ Math.floor((countdown.remaining.value % 3600) / 60) }}
                      </div>
                      <div class="text-sm text-gray-600 dark:text-gray-400">
                        Minutes
                      </div>
                    </div>

                    <div class="text-center p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                      <div class="text-2xl font-bold text-purple-600 dark:text-purple-400">
                        {{ countdown.remaining.value % 60 }}
                      </div>
                      <div class="text-sm text-gray-600 dark:text-gray-400">
                        Seconds
                      </div>
                    </div>
                  </div>

                  <div class="mt-4 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <div class="text-sm font-medium text-gray-600 dark:text-gray-400">
                      Target Date
                    </div>
                    <div class="text-lg text-gray-900 dark:text-white">
                      {{ new Date(Date.now() + countdown.remaining.value * 1000).toLocaleString() }}
                    </div>
                  </div>

                  <div class="flex gap-2 mt-4">
                    <UButton
                      v-if="!countdown.isActive.value"
                      color="primary"
                      @click="countdown.start()"
                    >
                      Start Countdown
                    </UButton>
                    <UButton
                      v-if="countdown.isActive.value"
                      color="warning"
                      @click="countdown.pause()"
                    >
                      Pause
                    </UButton>
                    <UButton
                      v-if="!countdown.isActive.value && countdownSeconds > 0"
                      color="success"
                      @click="countdown.start()"
                    >
                      Resume
                    </UButton>
                    <UButton
                      color="error"
                      variant="outline"
                      @click="countdown.stop()"
                    >
                      Stop
                    </UButton>
                  </div>
                </div>
              </div>

              <div
                v-if="countdownSeconds > 0 && countdown.remaining.value <= 0"
                class="text-center p-6 bg-green-50 dark:bg-green-900/20 rounded-lg"
              >
                <UIcon
                  name="i-lucide-check-circle"
                  class="text-4xl text-green-500 mx-auto mb-2"
                />
                <h3 class="text-lg font-semibold text-green-800 dark:text-green-200">
                  Countdown Finished!
                </h3>
                <p class="text-green-600 dark:text-green-400">
                  The target date has been reached
                </p>
              </div>
            </div>
          </UCard>
        </div>

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

                  <div class="flex items-center justify-between p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
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
                      :icon="copied ? 'i-lucide-check' : 'i-lucide-copy'"
                      :color="copied ? 'success' : 'neutral'"
                      @click="copyToClipboard(inputTimezone)"
                    />
                  </div>

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
                      :icon="copied ? 'i-lucide-check' : 'i-lucide-copy'"
                      :color="copied ? 'success' : 'neutral'"
                      @click="copyToClipboard(inputIso)"
                    />
                  </div>

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
                      :icon="copied ? 'i-lucide-check' : 'i-lucide-copy'"
                      :color="copied ? 'success' : 'neutral'"
                      @click="copyToClipboard(inputUtc)"
                    />
                  </div>

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
                      :icon="copied ? 'i-lucide-check' : 'i-lucide-copy'"
                      :color="copied ? 'success' : 'neutral'"
                      @click="copyToClipboard(inputUnix.toString())"
                    />
                  </div>

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
                      :icon="copied ? 'i-lucide-check' : 'i-lucide-copy'"
                      :color="copied ? 'success' : 'neutral'"
                      @click="copyToClipboard(inputMilliseconds.toString())"
                    />
                  </div>

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

        <div class="space-y-6" />
      </div>
    </div>
  </div>
</template>
