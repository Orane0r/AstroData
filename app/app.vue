<script setup lang="ts">
import type { NavigationMenuItem } from '@nuxt/ui'

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

const { t } = useI18n()

const title = 'AstroData'
const description = 'A production-ready starter template powered by Nuxt UI. Build beautiful, accessible, and performant applications in minutes, not hours.'

useSeoMeta({
  title,
  description,
  ogTitle: title,
  ogDescription: description,
  ogImage: 'https://ui.nuxt.com/assets/templates/nuxt/starter-light.png',
  twitterCard: 'summary_large_image'
})

const items = ref<NavigationMenuItem[]>([
  {
    label: t('menus.catalog'),
    to: '/catalog'
  },
  {
    label: t('menus.charts'),
    to: '/graphs'
  },
  {
    label: t('menus.comparator'),
    to: '/comparator'
  }
])
</script>

<template>
  <UApp>
    <UHeader>
      <template #left>
        <NuxtLink to="/">
          <AppLogo class="w-auto h-6 shrink-0" />
        </NuxtLink>

        <UNavigationMenu
          :items="items"
          variant="link"
          class="pl-10"
          color="neutral"
        />
      </template>

      <template #right>
        <UButton
          to="https://github.com/Orane0r/AstroData"
          target="_blank"
          icon="i-simple-icons-github"
          aria-label="GitHub"
          color="neutral"
          variant="ghost"
        />
      </template>
    </UHeader>

    <UMain>
      <NuxtPage />
    </UMain>

    <USeparator />

    <UFooter>
      <template #left>
        <p class="text-sm text-muted">
          {{ $t('footer.developed_by') }}
        </p>
      </template>

      <template #right>
        <UButton
          to="https://www.linkedin.com/in/orane-orveillon-9aab7a1b7"
          target="_blank"
          icon="i-simple-icons-linkedin"
          aria-label="LinkedIn"
          color="neutral"
          variant="ghost"
        />
        <UButton
          to="https://github.com/Orane0r"
          target="_blank"
          icon="i-simple-icons-github"
          aria-label="GitHub"
          color="neutral"
          variant="ghost"
        />
      </template>
    </UFooter>
  </UApp>
</template>
