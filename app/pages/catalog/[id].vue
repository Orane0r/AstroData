<script setup lang="ts">
import type { BreadcrumbItem } from '@nuxt/ui'

import { formatNumber } from '~/utils/format-number'

const route = useRoute()
const { t } = useI18n()

const { data: body } = await useFetch<CelestialBody>(`/api/celestial-bodies/${route.params.id}`)

interface Characteristic {
  label: string
  icon: string
  value?: string
  scientific?: {
    value: number
    exponent: number
    unit: string
  }
}

const characteristics = computed<Characteristic[]>(() => {
  if (!body.value) {
    return []
  }

  return [
    {
      label: t('attributes.mean_radius'),
      value: `${formatNumber(body.value.meanRadius)} ${t('units.km')}`,
      icon: 'i-solar-radar-outline'
    },
    {
      label: t('attributes.mass'),
      icon: 'i-solar-dumbbell-large-minimalistic-outline',
      value: '—',
      scientific: body.value.massValue && body.value.massExponent
        ? {
            value: body.value.massValue,
            exponent: body.value.massExponent,
            unit: t('units.kg')
          }
        : undefined
    },
    {
      label: t('attributes.density'),
      value: `${formatNumber(body.value.density)} ${t('units.g/cm3')}`,
      icon: 'i-solar-box-minimalistic-outline'
    },
    {
      label: t('attributes.gravity'),
      value: `${formatNumber(body.value.gravity)} ${t('units.m/s²')}`,
      icon: 'i-solar-speedometer-max-outline'
    },
    {
      label: t('attributes.average_temperature'),
      value: `${formatNumber(body.value.averageTemperature - 273.15)} ${t('units.C')}`,
      icon: 'i-solar-temperature-outline'
    },
    {
      label: t('attributes.sideral_orbit'),
      value: `${formatNumber(body.value.sideralOrbit / 365.25, 1)} ${t('units.years')}`,
      icon: 'i-solar-round-graph-outline'
    },
    {
      label: t('attributes.sideral_rotation'),
      value: `${formatNumber(body.value.sideralRotation, 1)} ${t('units.h')}`,
      icon: 'i-solar-planet-2-outline'
    },
    {
      label: t('attributes.distance_from_sun'),
      value: `${formatNumber(body.value.semimajorAxis)} ${t('units.km')}`,
      icon: 'i-solar-sun-outline'
    }
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
            <h2 class="font-semibold tracking-wide text-dimmed uppercase">
              {{ $t('body_sheet.characteristics') }}
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
                <ScientificNotation
                  v-if="characteristic.scientific"
                  v-bind="characteristic.scientific"
                />
                <template v-else>
                  {{ characteristic.value }}
                </template>
              </span>
            </div>
          </div>
        </UCard>
        <UCard
          class="flex-1"
        >
          <template #header>
            <h2 class="font-semibold tracking-wide text-dimmed uppercase">
              {{ $t('body_sheet.profile') }}
            </h2>
          </template>
        </UCard>
      </div>
      <div>cadre galerie</div>
      <div>objets liés (à voir)</div>
    </UPageBody>
  </UPage>
</template>
