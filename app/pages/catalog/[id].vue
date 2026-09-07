<script setup lang="ts">
import type { BreadcrumbItem } from '@nuxt/ui'

const route = useRoute()

const { data: body } = await useFetch<CelestialBody>(`/api/celestial-bodies/${route.params.id}`)

const items = ref<BreadcrumbItem[]>([
  {
    label: 'Catalog',
    to: '/catalog'
  },
  {
    label: body.value?.name,
    active: true
  }
])
</script>

<template>
  <UPage>
    <UPageBody>
      <UBreadcrumb :items="items" />
      <div class="flex flex-row gap-4">
        <div class="flex-1 min-h-50">
          <!-- TODO bouton 3d + vue 3d -->
          <NuxtImg
            v-if="body?.imageUrl"
            :src="body.imageUrl"
            alt="Moon"
            fit="contain"
            class="rounded-xl"
          />
        </div>
        <div class="flex-2 min-h-50">
          <!-- TODO UCard  -->
          <div>nom</div>
          <div>description wikipedia + lien wikipedia</div>
        </div>
      </div>
      <div>cadre caractéristiques</div>
      <div>cadre profil vs moyenne</div>
      <div>cadre galerie</div>
      <div>objets liés (à voir)</div>
    </UPageBody>
  </UPage>
</template>
