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
    :title="$t('state.error_code', { code: error?.statusCode ?? '' })"
    :description="error?.statusMessage ?? $t('state.error_message')"
  >
    <template #actions>
      <UButton
        :label="$t('state.retry')"
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
