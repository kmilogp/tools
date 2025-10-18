<script setup lang="ts">
useHead({
  meta: [
    { name: 'viewport', content: 'width=device-width, initial-scale=1' }
  ],
  link: [
    { rel: 'icon', href: '/favicon.ico' }
  ],
  htmlAttrs: {
    lang: 'en'
  }
})

const title = 'Programming Tools'
const description = 'A collection of useful tools for daily programming tasks including JSON, Base64, Timestamp, YAML, CSV, and Chart utilities.'

useSeoMeta({
  title,
  description,
  ogTitle: title,
  ogDescription: description,
  ogImage: 'https://ui.nuxt.com/assets/templates/nuxt/starter-light.png',
  twitterImage: 'https://ui.nuxt.com/assets/templates/nuxt/starter-light.png',
  twitterCard: 'summary_large_image'
})
</script>

<template>
  <UApp>
    <div class="flex h-screen">
      <!-- Sidebar -->
      <ToolsSidebar />
      
      <!-- Main Content -->
      <div class="flex-1 flex flex-col">
        <UHeader>
          <template #left>
            <NuxtLink to="/" class="flex items-center space-x-2">
              <UIcon name="i-lucide-wrench" class="w-6 h-6 text-primary-500" />
              <span class="text-lg font-semibold text-gray-900 dark:text-white">
                Programming Tools
              </span>
            </NuxtLink>
          </template>

          <template #right>
            <UColorModeButton />
          </template>
        </UHeader>

        <UMain class="flex-1 overflow-auto">
          <NuxtPage />
        </UMain>

        <UFooter>
          <template #left>
            <p class="text-sm text-muted">
              Built with Nuxt UI • © {{ new Date().getFullYear() }}
            </p>
          </template>
        </UFooter>
      </div>
    </div>
  </UApp>
</template>
