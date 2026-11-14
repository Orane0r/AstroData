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
  <!-- TODO ajout prop pour texte personnalisé exemple : "aucune image" pour les images de la gallerie -->
  <UEmpty
    v-if="status === 'error'"
    :title="$t('state.error_code', { code: error?.statusCode ?? '' })"
    :description="error?.statusMessage ?? $t('state.error_message')"
  >
    <template #actions>
      <UButton
        :label="$t('buttons.retry')"
        icon="i-solar-refresh-outline"
        @click="emit('retry')"
      />
    </template>
  </UEmpty>

  <UEmpty
    v-else-if="status != 'pending'"
    icon="i-solar-inbox-outline"
    :title="$t('state.no_data')"
  />

  <div v-else />
</template>
