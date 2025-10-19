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
    <UDashboardGroup>
      <!-- Sidebar -->
      <ToolsSidebar />

      <!-- Main Content -->
      <UDashboardPanel>
        <template #header>
          <UDashboardNavbar title="Programming Tools">
            <template #trailing>
              <UColorModeButton />
            </template>
          </UDashboardNavbar>
        </template>

        <template #body>
          <NuxtPage keepalive />
        </template>

        <template #footer>
          <UFooter>
            <template #left>
              <p class="text-sm text-muted">
                Built with Nuxt UI • © {{ new Date().getFullYear() }}
              </p>
            </template>
          </UFooter>
        </template>
      </UDashboardPanel>
    </UDashboardGroup>
  </UApp>
</template>
