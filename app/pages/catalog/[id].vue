<script setup lang="ts">
import type { BreadcrumbItem } from '@nuxt/ui'

import { formatNumber } from '~/utils/format-number'
import { kelvinToCelsius, scientificToValue } from '~~/shared/utils/conversion'
import { scaleToMax } from '~~/shared/utils/maths'
import { useBodyTypeConfig } from '../../utils/body-config.ts'

interface PanzoomImage extends HTMLImageElement {
  panzoom?: {
    zoomWithWheel: (event: WheelEvent) => void
  }
}

type RadarDatum = {
  metric: string
  body: number
  average: number
}

const route = useRoute()
const { t } = useI18n()

const BODY_TYPE_CONFIG = useBodyTypeConfig()

const isDialogOpened = ref(false)
const zoom = ref<PanzoomImage | null>(null)

const { data: body } = await useFetch<CelestialBody>(`/api/celestial-bodies/${route.params.id}`)
const { data: averages } = await useFetch<CelestialBodyAverages>(`/api/celestial-bodies/averages`, {
  query: {
    type: body.value?.type
  }
})
const { data: moons } = await useFetch<CelestialBody[]>(`/api/celestial-bodies/${route.params.id}/moons`)

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
      value: `${formatNumber(kelvinToCelsius(body.value.averageTemperature))} ${t('units.C')}`,
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

// Each metric is scaled on its own: the larger of (body, average) = 100.
// `decades` = log scale for metrics spanning several orders of magnitude.
const radarChartData = computed<RadarDatum[]>(() => {
  if (!body.value || !averages.value) {
    return []
  }

  const { data: avg } = averages.value
  const b = body.value
  const metrics: { label: string, body: number, average: number | null, decades?: number }[] = [
    {
      label: t('attributes.mass'),
      body: b.massValue && b.massExponent ? scientificToValue({ value: b.massValue, exponent: b.massExponent }) : 0,
      average: avg.mass && scientificToValue(avg.mass),
      decades: 6
    },
    { label: t('attributes.radius'), body: b.meanRadius, average: avg.meanRadius, decades: 3 },
    { label: t('attributes.gravity'), body: b.gravity, average: avg.gravity },
    // Kelvin, not Celsius: a ratio needs a zero that means "nothing"
    { label: t('attributes.abbreviated.temperature'), body: b.averageTemperature, average: avg.averageTemperature },
    { label: t('attributes.moons'), body: moons.value?.length ?? 0, average: avg.moons, decades: 2 }
  ]

  return metrics.map(({ label, body, average, decades }) => {
    const [scaledBody = 0, scaledAverage = 0] = scaleToMax([body, average ?? 0], decades)
    return { metric: label, body: scaledBody, average: scaledAverage }
  })
})

const categories: Record<string, BulletLegendItemInterface> = {
  body: { name: body.value?.name ?? '' },
  // TODO mettre moyenne des <type> (<nombre d'objets>)
  average: { name: t('radar.average', { type: BODY_TYPE_CONFIG[body.value!.type].pluralLabel.toLocaleLowerCase() }) }
}
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
        <div class="flex-2 min-h-50 flex flex-col gap-4">
          <h1 class="text-3xl  sm:text-4xl font-bold text-highlighted">
            {{ body?.name }}
          </h1>
          <div>description wikipedia</div>
          <ULink
            v-if="body?.wikipedia"
            :to="body.wikipedia"
            target="_blank"
            class="inline-flex items-center gap-1 text-sm text-primary"
          >
            {{ $t('body_sheet.wikipedia') }}
          </ULink>
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
          class="flex flex-1 flex-col"
          :ui="{ body: 'flex flex-1 flex-col p-0 sm:p-0' }"
        >
          <template #header>
            <h2 class="font-semibold tracking-wide text-dimmed uppercase">
              {{ $t('body_sheet.profile') }}
            </h2>
          </template>
          <div
            class="min-h-0 flex-1 [&_.vue-chrts]:h-full [&_.vcharts-responsive-container]:h-full!"
          >
            <!-- TODO adapter les indicateurs en fonction du type de l'objet (ex : ne pas mettre le nombre de lunes si c'est une lune) -->
            <RadarChart
              :data="radarChartData"
              :categories="categories"
              data-key="metric"
              :height="480"
              :fill-opacity="0.15"
              :legend-position="LegendPosition.BottomCenter"
              hide-radius-axis
              hide-tooltip
            />
          </div>
        </UCard>
      </div>
      <div>cadre galerie</div>
      <div>objets liés (à voir)</div>
    </UPageBody>
  </UPage>
</template>
