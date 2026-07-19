<script lang="ts" setup>
import type { TableColumn } from '@nuxt/ui'

const { data: count } = await useFetch('/api/celestial-bodies/count')
const { data: bodies, pending: loading } = await useFetch('/api/celestial-bodies')
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
  // TODO mettre un badge
  {
    accessorKey: 'type',
    header: 'Type'
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
</script>

<template>
  <UPage>
    <UPageHeader
      title="Catalogue"
      :description="`${count} objets · filtrez, triez, explorez`"
    />

    <UPageBody :ui="{ base: 'mt-2  space-y-5' }">
      <div class="flex flex-row gap-2">
        <UBadge
          v-for="type in types"
          :key="type"
          :label="type"
          variant="subtle"
          class="rounded-full"
        />
      </div>

      <!-- TODO prendre la hauteur restante du screen -->
      <UTable
        class="border border-accented rounded-lg h-100"
        :data="bodies"
        :columns
        :loading
        sticky
        virtualize
      />
    </UPageBody>
  </UPage>
</template>
