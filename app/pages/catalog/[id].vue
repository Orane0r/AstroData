<script setup lang="ts">
import type { BreadcrumbItem } from '@nuxt/ui'

const route = useRoute()
const { t } = useI18n()

const { data: body } = await useFetch<CelestialBody>(`/api/celestial-bodies/${route.params.id}`)

// TODO
const formatNumber = (value: number, maximumFractionDigits = 2) => new Intl.NumberFormat('fr-FR', {
  maximumFractionDigits
}).format(value)

// TODO
const toSuperscript = (value: number) => String(value).replace(/[0-9-]/g, character => '⁰¹²³⁴⁵⁶⁷⁸⁹⁻'[character === '-' ? 10 : Number(character)])

const characteristics = computed(() => {
  if (!body.value) {
    return []
  }

  // TODO icones solar
  return [
    { label: 'Rayon moyen', value: `${formatNumber(body.value.meanRadius)} km`, icon: 'i-lucide-circle-dashed' },
    { label: 'Masse', value: body.value.massValue && body.value.massExponent ? `${formatNumber(body.value.massValue)} × 10${toSuperscript(body.value.massExponent)} kg` : '—', icon: 'i-lucide-weight' },
    { label: 'Densité', value: `${formatNumber(body.value.density)} g/cm³`, icon: 'i-lucide-box' },
    { label: 'Gravité', value: `${formatNumber(body.value.gravity)} m/s²`, icon: 'i-lucide-gauge' },
    { label: 'Température moy.', value: `${formatNumber(body.value.averageTemperature - 273.15)} °C`, icon: 'i-lucide-thermometer' },
    { label: 'Période orbitale', value: `${formatNumber(body.value.sideralOrbit / 365.25, 1)} ans`, icon: 'i-lucide-orbit' },
    { label: 'Rotation sidérale', value: `${formatNumber(body.value.sideralRotation, 1)} h`, icon: 'i-lucide-refresh-cw' },
    { label: 'Distance au Soleil', value: `${formatNumber(body.value.semimajorAxis)} km`, icon: 'i-lucide-sun' }
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
        >
          <template #header>
            <h2 class="text-sm font-semibold tracking-wide text-dimmed">
              CARACTÉRISTIQUES
            </h2>
          </template>
          <!-- TODo enlever marge y -->
          <!-- TODO voir si je peux mettre mieux que divide-white/10 -->
          <div class="divide-y divide-white/10">
            <div
              v-for="characteristic in characteristics"
              :key="characteristic.label"
              class="flex items-center gap-3 py-2.5"
            >
              <!-- TODO voir si je peux mettre mieux que que bg blue et text-blue -->
              <div class="flex size-8 shrink-0 items-center justify-center rounded-lg bg-blue-950/60 text-blue-300">
                <UIcon
                  :name="characteristic.icon"
                  class="size-4"
                />
              </div>
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
