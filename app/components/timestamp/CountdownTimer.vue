<script setup lang="ts">
import {
  dateToTimestamp,
  unixToTimestamp,
  isValidTimestamp
} from '~/utils/tools/timestamp'
import { useCountdown } from '@vueuse/core'

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
</script>

<template>
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
        v-if="countdownSeconds > 0 && countdown.remaining.value"
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
</template>
