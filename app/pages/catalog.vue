<script lang="ts" setup>
import type { TableColumn } from '@nuxt/ui'
import { sum } from 'lodash'

const UBadge = resolveComponent('UBadge')

const page = ref(1)
const pageSize = ref(15)

const { data: count } = await useFetch('/api/celestial-bodies/count')
const { data: response, pending: loading } = await useFetch('/api/celestial-bodies', {
  query: {
    page,
    pageSize
  },
  watch: [page, pageSize]
})
const bodies = computed(() => response.value?.data ?? [])
const total = computed(() => response.value?.total ?? 0)

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
</script>

<template>
  <UPage>
    <!-- TODO gérer chargement du count (pareil pour badges) -->
    <UPageHeader
      title="Catalogue"
      :description="`${totalCount} objets · filtrez, triez, explorez`"
    />

    <UPageBody
      :ui="{ base: 'mt-5 space-y-5 pb-5' }"
    >
      <div class="flex flex-row gap-2">
        <UBadge
          v-for="type in sortedTypes"
          :key="type"
          :label="type"
          variant="subtle"
          :color="BODY_TYPE_CONFIG[type]!.color"
          :icon="BODY_TYPE_CONFIG[type]!.icon"
          class="rounded-full"
        >
          <template #trailing>
            <span class="text-dimmed pl-2">
              {{ count![type] }}
            </span>
          </template>
        </UBadge>
      </div>

      <!-- TODO sorting -->
      <UTable
        :data="bodies"
        :columns
        :loading
        sticky
      />

      <UPagination
        v-model:page="page"
        :total="total"
        :items-per-page="pageSize"
      />
    </UPageBody>
  </UPage>
</template>
