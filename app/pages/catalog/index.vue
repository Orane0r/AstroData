<script lang="ts" setup>
import type { TableColumn, TableRow } from '@nuxt/ui'
import { sum } from 'lodash'
import { refDebounced } from '@vueuse/core'

const UBadge = resolveComponent('UBadge')
const UAvatar = resolveComponent('UAvatar')

const { t } = useI18n()

const selectedTypes = ref<CelestialBodyType[]>(['Moon', 'Planet'])

const search = ref('')
const debouncedSearch = refDebounced(search, 300)

const page = ref(1)
const pageSize = ref(15)

const { data: count, pending: countLoading } = await useFetch('/api/celestial-bodies/count')
const {
  data: bodiesResult,
  pending: bodiesLoading,
  status: bodiesStatus,
  error: bodiesError,
  refresh: bodiesRefresh
} = await useFetch('/api/celestial-bodies', {
  query: {
    types: selectedTypes,
    search: debouncedSearch,
    page,
    pageSize
  },
  watch: [selectedTypes, debouncedSearch, page, pageSize]
})

const bodies = computed(() => bodiesResult.value?.data ?? [])
const total = computed(() => bodiesResult.value?.total ?? 0)

const { data: types } = await useFetch('/api/celestial-bodies/types')

const columns: TableColumn<CelestialBody>[] = [
  {
    accessorKey: 'imageUrl',
    header: '',
    meta: {
      class: {
        th: 'w-0',
        td: 'w-0 whitespace-nowrap'
      }
    },
    cell: ({ row }) => {
      const image = row.getValue('imageUrl')
      return image
        ? h(UAvatar, {
            src: image,
            alt: row.original.name,
            size: '2xl',
            class: 'rounded-xl'
          })
        : '–'
    }
  },
  {
    accessorKey: 'name',
    header: t('catalog.columns.name'),
    cell: ({ getValue }) => {
      const name = getValue()
      return name || '–'
    }
  },
  {
    accessorKey: 'type',
    header: t('catalog.columns.type'),
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
    header: t('catalog.columns.size'),
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
    header: t('catalog.columns.volume'),
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
    header: t('catalog.columns.mass'),
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

watch([debouncedSearch, selectedTypes], () => {
  page.value = 1
})

const onClickType = (type: CelestialBodyType) => {
  if (selectedTypes.value.includes(type)) {
    selectedTypes.value = selectedTypes.value.filter(t => t !== type)
  } else {
    selectedTypes.value.push(type)
  }
}

const onClickRow = (row: TableRow<CelestialBody>) => {
  navigateTo(`/catalog/${row.id}`)
}
</script>

<template>
  <UPage>
    <UPageHeader
      :title="$t('catalog.title')"
    >
      <template #description>
        <template v-if="countLoading">
          <USkeleton class="h-6 w-150" />
        </template>
        <template v-else>
          {{ $t('catalog.description', { count: totalCount }) }}
        </template>
      </template>
    </UPageHeader>

    <UPageBody
      :ui="{ base: 'mt-5 space-y-5 pb-5' }"
    >
      <UInput
        v-model="search"
        type="search"
        class="sm:min-w-100"
        :placeholder="$t('catalog.search_placeholder')"
        clear
      />

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
            v-for="type in types"
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
        @select="(_, row) => onClickRow(row)"
      >
        <template #empty>
          <EmptyState
            :status="bodiesStatus"
            :error="bodiesError"
            @retry="bodiesRefresh"
          />
        </template>
      </UTable>

      <UPagination
        v-if="bodiesStatus === 'success' && bodies.length > 0"
        v-model:page="page"
        :total="total"
        :items-per-page="pageSize"
        show-edges
        class="flex justify-center"
      />
    </UPageBody>
  </UPage>
</template>
