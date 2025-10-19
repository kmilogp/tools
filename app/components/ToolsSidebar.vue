<script setup lang="ts">
import type { NavigationMenuItem } from '@nuxt/ui'

const toolCategories: NavigationMenuItem[] = [
  {
    label: 'JSON',
    icon: 'i-lucide-file-code',
    to: '/json'
  },
  {
    label: 'Base64',
    icon: 'i-lucide-shield',
    to: '/base64'
  },
  {
    label: 'Timestamp',
    icon: 'i-lucide-clock',
    to: '/timestamp'
  },
  {
    label: 'YAML',
    icon: 'i-lucide-file-text',
    to: '/yaml'
  },
  {
    label: 'CSV',
    icon: 'i-lucide-file-spreadsheet',
    to: '/csv'
  },
  {
    label: 'Table',
    icon: 'i-lucide-table',
    to: '/table'
  }
]

const collapsed = ref(false)
</script>

<template>
  <UDashboardSidebar
    v-model:collapsed="collapsed"
    collapsible
  >
    <template #header>
      <div
        v-if="!collapsed"
        class="flex items-center space-x-2"
      >
        <UIcon
          name="i-lucide-wrench"
          class="w-6 h-6 text-primary-500"
        />
        <span class="text-lg font-semibold text-gray-900 dark:text-white">
          Programming Tools
        </span>
      </div>
      <UIcon
        v-else
        name="i-lucide-wrench"
        class="w-6 h-6 text-primary-500 mx-auto"
      />
    </template>

    <template #default>
      <UNavigationMenu
        :collapsed="collapsed"
        :items="toolCategories"
        orientation="vertical"
      />
    </template>

    <template #footer>
      <UButton
        variant="solid"
        size="sm"
        :trailing-icon="collapsed ? 'i-lucide-chevron-right' : 'i-lucide-chevron-left'"
        class="ml-auto"
        @click="collapsed = !collapsed"
      />
    </template>
  </UDashboardSidebar>
</template>
