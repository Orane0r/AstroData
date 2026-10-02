<script setup lang="ts">
import type { BreadcrumbItem } from '@nuxt/ui'

import { formatNumber } from '~/utils/format-number'

interface PanzoomImage extends HTMLImageElement {
  panzoom?: {
    zoomWithWheel: (event: WheelEvent) => void
  }
}

const route = useRoute()
const { t } = useI18n()

const isDialogOpened = ref(false)
const zoom = ref<PanzoomImage | null>(null)

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

function handleImageWheel(event: WheelEvent) {
  zoom.value?.panzoom?.zoomWithWheel(event)
}

function handlePanzoomChange(event: Event) {
  const { scale } = (event as CustomEvent<{ scale: number }>).detail
  if (zoom.value) {
    zoom.value.style.cursor = scale > 1.001 ? 'grab' : 'zoom-in'
  }
}

interface RadarDatum {
  metric: string;
  productA: number;
  productB: number;
}

const radarChartData: RadarDatum[] = [
  { metric: "Performance", productA: 90, productB: 72 },
  { metric: "Reliability", productA: 78, productB: 85 },
  { metric: "Comfort", productA: 66, productB: 80 },
  { metric: "Safety", productA: 88, productB: 74 },
  { metric: "Efficiency", productA: 70, productB: 90 },
  { metric: "Design", productA: 82, productB: 68 },
];

const categories: Record<string, BulletLegendItemInterface> = {
  productA: { name: "Product A", color: "var(--color-blue-400)" },
  productB: { name: "Product B", color: "var(--color-pink-400)" },
};
</script>

<template>
  <UPage>
    <UPageBody>
      <UBreadcrumb :items="items" />
      <div class="flex flex-row gap-4">
        <div class="flex-1 min-h-50">
          <!-- TODO bouton 3d + vue 3d -->
          <UModal
            v-model:open="isDialogOpened"
            :title="$t('body_sheet.interactive_view')"
            :ui="{ content: 'sm:max-w-3xl' }"
          >
            <NuxtImg
              v-if="body?.imageUrl"
              :src="body.imageUrl"
              :alt="body.name"
              fit="contain"
              class="rounded-xl cursor-pointer"
              @click="isDialogOpened = true"
            />

            <template #body>
              <div
                class="overflow-hidden rounded-xl"
                @wheel.prevent="handleImageWheel"
              >
                <img
                  v-if="body?.imageUrl"
                  ref="zoom"
                  v-panzoom="{ contain: 'outside', cursor: 'zoom-in' }"
                  :src="body.imageUrl"
                  :alt="body.name"
                  fit="contain"
                  class="w-full h-auto"
                  @panzoomchange="handlePanzoomChange"
                >
              </div>
            </template>
          </UModal>
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

            <RadarChart
              :data="radarChartData"
              :categories="categories"
              data-key="metric"
              :height="320"
              :fill-opacity="0.35"
              :legend-position="LegendPosition.BottomCenter"
            />
          </template>
        </UCard>
      </div>
      <div>cadre galerie</div>
      <div>objets liés (à voir)</div>
    </UPageBody>
  </UPage>
</template>
