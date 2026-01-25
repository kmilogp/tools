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
  twitterCard: 'summary_large_image'
})
</script>

<template>
  <UApp>
    <UDashboardGroup>
      <ToolsSidebar />

      <UDashboardPanel>
        <template #header>
          <UDashboardNavbar title="Programming Tools">
            <template #right>
              <UButton
                color="primary"
                href="https://github.com/kmilogp8496/tools"
                leading-icon="i-logos-github-icon"
              >
                <span class="hidden lg:inline-block">
                  Tools are now open source!
                </span>
              </UButton>
              <UButton href="https://buymeacoffee.com/kmilogp">
                <UIcon name="i-lucide-coffee" />
                Buy me a coffee
              </UButton>
            </template>
          </UDashboardNavbar>
        </template>

        <template #body>
          <NuxtPage keepalive />
        </template>

        <template #footer>
          <UFooter>
            <p class="text-sm text-muted">
              Built with
              <UIcon name="i-logos-nuxt-icon" /> and
              <UIcon
                name="i-lucide-heart"
                class="text-red-500 text-md"
              /> • © {{ new Date().getFullYear() }}
            </p>
          </UFooter>
        </template>
      </UDashboardPanel>
    </UDashboardGroup>
  </UApp>
</template>
