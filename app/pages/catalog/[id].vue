<script setup lang="ts">
import type { BreadcrumbItem } from '@nuxt/ui'

import { formatNumber } from '~/utils/format-number'

const route = useRoute()
const { t } = useI18n()

const { data: body } = await useFetch<CelestialBody>(`/api/celestial-bodies/${route.params.id}`)

// TODO
const toSuperscript = (value: number) => String(value).replace(/[0-9-]/g, character => '⁰¹²³⁴⁵⁶⁷⁸⁹⁻'[character === '-' ? 10 : Number(character)])

const characteristics = computed(() => {
  if (!body.value) {
    return []
  }

  return [
    { label: t('attributes.mean_radius'), value: `${formatNumber(body.value.meanRadius)} km`, icon: 'i-solar-radar-outline' },
    { label: t('attributes.mass'), value: body.value.massValue && body.value.massExponent ? `${formatNumber(body.value.massValue)} × 10${toSuperscript(body.value.massExponent)} kg` : '—', icon: 'i-solar-dumbbell-large-minimalistic-outline' },
    { label: t('attributes.density'), value: `${formatNumber(body.value.density)} g/cm³`, icon: 'i-solar-box-minimalistic-outline' },
    { label: t('attributes.gravity'), value: `${formatNumber(body.value.gravity)} m/s²`, icon: 'i-solar-speedometer-max-outline' },
    { label: t('attributes.average_temperature'), value: `${formatNumber(body.value.averageTemperature - 273.15)} °C`, icon: 'i-solar-temperature-outline' },
    { label: t('attributes.orbital_period'), value: `${formatNumber(body.value.sideralOrbit / 365.25, 1)} ans`, icon: 'i-solar-round-graph-outline' },
    { label: t('attributes.sideral_rotation'), value: `${formatNumber(body.value.sideralRotation, 1)} h`, icon: 'i-solar-planet-2-outline' },
    { label: t('attributes.distance_from_sun'), value: `${formatNumber(body.value.semimajorAxis)} km`, icon: 'i-solar-sun-outline' }
  ]
})

const items = ref<BreadcrumbItem[]>([
  {
    label: t('menus.catalog'),
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
          <!-- TODO fenêtre agrandie au clic -->
          <NuxtImg
            v-if="body?.imageUrl"
            :src="body.imageUrl"
            :alt="body.name"
            fit="contain"
            class="rounded-xl"
          />
        </div>
        <div class="flex-2 min-h-50">
          <div>nom</div>
          <div>description wikipedia + lien wikipedia</div>
        </div>
      </div>
      <div class="flex flex-row gap-4">
        <UCard
          class="flex-1"
          :ui="{ body: 'py-2 sm:py-2' }"
        >
          <template #header>
            <h2 class="text-sm font-semibold tracking-wide text-dimmed">
              CARACTÉRISTIQUES
            </h2>
          </template>
          <div class="divide-y divide-default">
            <div
              v-for="characteristic in characteristics"
              :key="characteristic.label"
              class="flex items-center gap-3 py-3"
            >
              <UAvatar
                class="rounded-lg"
                color="secondary"
                :icon="characteristic.icon"
              />
              <span class="text-sm text-muted">
                {{ characteristic.label }}
              </span>
              <span class="ml-auto text-right text-sm font-semibold tabular-nums text-highlighted">
                {{ characteristic.value }}
              </span>
            </div>
          </div>
        </UCard>
        <UCard
          class="flex-1"
          :title="'Profil'.toLocaleUpperCase()"
          description="Profil"
        />
      </div>
      <div>cadre galerie</div>
      <div>objets liés (à voir)</div>
    </UPageBody>
  </UPage>
</template>
