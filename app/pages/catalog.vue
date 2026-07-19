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

    <UPageBody>
      <UTable
        :data="bodies"
        :columns
        :loading
        sticky
      />
    </UPageBody>
  </UPage>
</template>
