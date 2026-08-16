<script setup lang="ts">
import type { AsyncDataRequestStatus } from '#app'
import type { FetchError } from 'ofetch'

defineProps<{
  status: AsyncDataRequestStatus
  error?: FetchError
}>()

const emit = defineEmits<{ retry: [] }>()
</script>

<template>
  <UEmpty
    v-if="status === 'error'"
    :title="`Erreur ${error?.statusCode ?? ''}`"
    :description="error?.statusMessage ?? 'Impossible de charger les données.'"
  >
    <template #actions>
      <UButton
        label="Réessayer"
        icon="i-solar-refresh-outline"
        @click="emit('retry')"
      />
    </template>
  </UEmpty>

  <UEmpty
    v-else-if="status != 'pending'"
    icon="i-solar-inbox-outline"
    title="Aucune donnée"
  />

  <div v-else />
</template>
