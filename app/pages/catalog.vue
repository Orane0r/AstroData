<script lang="ts" setup>
import type { TableColumn } from '@nuxt/ui'
import { sum } from 'lodash'

const UBadge = resolveComponent('UBadge')

const selectedTypes = ref<CelestialBodyType[]>(['Moon', 'Planet'])

const page = ref(1)
const pageSize = ref(15)

// TODO gestion des erreurs
const { data: count, pending: countLoading } = await useFetch('/api/celestial-bodies/count')
const { data: bodiesResult, pending: bodiesLoading } = await useFetch('/api/celestial-bodies', {
  query: {
    types: selectedTypes,
    page,
    pageSize
  },
  watch: [selectedTypes, page, pageSize]
})
const bodies = computed(() => bodiesResult.value?.data ?? [])
const total = computed(() => bodiesResult.value?.total ?? 0)

const { data: types } = await useFetch('/api/celestial-bodies/types')

const columns: TableColumn<CelestialBody>[] = [
  {
    accessorKey: 'name',
    header: 'Nom',
    cell: ({ getValue }) => {
      const name = getValue()
      return name || '–'
    }
  },
  {
    accessorKey: 'type',
    header: 'Type',
    cell: ({ row }) => {
      const type = row.getValue('type')
      const config = BODY_TYPE_CONFIG[type as keyof typeof BODY_TYPE_CONFIG]
      return config
        ? h(UBadge, {
            class: 'rounded-full',
            variant: 'subtle',
            color: config.color,
            icon: config.icon
          }, () => config.label)
        : '–'
    }
  },
  {
    accessorKey: 'meanRadius',
    header: 'Taille',
    cell: ({ row }) => {
      const meanRadius = row.getValue('meanRadius')
      return meanRadius ? `${meanRadius} km` : '–'
    },
    meta: {
      class: {
        td: 'text-right'
      }
    }
  },
  {
    id: 'volume',
    header: 'Volume',
    accessorFn: (row) => {
      if (row.volumeValue == null || row.volumeExponent == null) return null
      return row.volumeValue * 10 ** row.volumeExponent
    },
    cell: ({ getValue }) => {
      const volume = getValue<number | null>()
      return volume === null ? '–' : `${volume.toExponential(2)} m³`
    },
    meta: {
      class: {
        td: 'text-right'
      }
    }
  },
  {
    id: 'mass',
    header: 'Masse',
    accessorFn: (row) => {
      if (row.massValue == null || row.massExponent == null) return null
      return row.massValue * 10 ** row.massExponent
    },
    cell: ({ getValue }) => {
      const mass = getValue<number | null>()
      return mass === null ? '–' : `${mass.toExponential(2)} kg`
    },
    meta: {
      class: {
        td: 'text-right'
      }
    }
  }
]

const totalCount = computed(() => {
  if (!count.value) return 0
  return sum(Object.values(count.value))
})

const sortedTypes = computed(() => {
  if (types.value) {
    return [...types.value].sort((a, b) => BODY_TYPE_CONFIG[a].order - BODY_TYPE_CONFIG[b].order)
  }
  return []
})

const onClickType = (type: CelestialBodyType) => {
  if (selectedTypes.value.includes(type)) {
    selectedTypes.value = selectedTypes.value.filter(t => t !== type)
  } else {
    selectedTypes.value.push(type)
  }
}
</script>

<template>
  <UPage>
    <UPageHeader
      title="Catalogue"
    >
      <template #description>
        <template v-if="countLoading">
          <USkeleton class="h-6 w-150" />
        </template>
        <template v-else>
          {{ `${totalCount} objets · filtrez, triez, explorez` }}
        </template>
      </template>
    </UPageHeader>

    <UPageBody
      :ui="{ base: 'mt-5 space-y-5 pb-5' }"
    >
      <div class="flex flex-row gap-2">
        <template v-if="countLoading">
          <USkeleton
            v-for="i in 6"
            :key="i"
            class="h-6 w-20 rounded-full"
          />
        </template>
        <template v-else>
          <UBadge
            v-for="type in sortedTypes"
            :key="type"
            :label="type"
            :variant="selectedTypes.includes(type) ? 'subtle' : 'outline'"
            :color="selectedTypes.includes(type) ? BODY_TYPE_CONFIG[type]!.color : 'neutral'"
            :icon="BODY_TYPE_CONFIG[type]!.icon"
            class="rounded-full cursor-pointer"
            @click="onClickType(type)"
          >
            <template #trailing>
              <span class="text-dimmed pl-2">
                {{ count![type] }}
              </span>
            </template>
          </UBadge>
        </template>
      </div>

      <!-- TODO sorting -->
      <UTable
        :data="bodies"
        :columns
        :loading="bodiesLoading"
        sticky
      />

      <UPagination
        v-model:page="page"
        :total="total"
        :items-per-page="pageSize"
        class="flex justify-center"
      />
    </UPageBody>
  </UPage>
</template>
