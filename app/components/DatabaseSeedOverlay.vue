<script setup lang="ts">
const { t } = useI18n()
const { status, retry } = useDatabaseSeed()

const progress = computed(() => {
  const done = status.value.progress?.done ?? 0
  const total = status.value.progress?.total ?? 0

  return total > 0 ? Math.round((done / total) * 100) : 0
})

const isStarting = computed(() => (status.value.progress?.total ?? 0) === 0)
</script>

<template>
  <div class="fixed inset-0 z-50 flex flex-col items-center justify-center gap-6 bg-default p-6 text-center">
    <AppLogo class="h-8 w-auto" />

    <template v-if="status.state === 'error'">
      <UIcon
        name="i-lucide-triangle-alert"
        class="size-10 text-error"
      />
      <div class="space-y-1">
        <p class="text-lg font-semibold text-highlighted">
          {{ t('database.error.title') }}
        </p>
        <p class="max-w-md text-sm text-muted">
          {{ status.error }}
        </p>
      </div>
      <UButton
        icon="i-lucide-refresh-cw"
        @click="retry"
      >
        {{ t('buttons.retry') }}
      </UButton>
    </template>

    <template v-else>
      <UIcon
        name="i-lucide-loader-circle"
        class="size-10 animate-spin text-primary"
      />
      <div class="space-y-1">
        <p class="text-lg font-semibold text-highlighted">
          {{ t('database.seeding.title') }}
        </p>
        <p class="max-w-md text-sm text-muted">
          {{ t('database.seeding.description') }}
        </p>
      </div>
      <UProgress
        v-if="!isStarting"
        :model-value="progress"
        class="w-64"
      />
      <p
        v-if="isStarting"
        class="text-xs text-dimmed"
      >
        {{ t('database.seeding.starting') }}
      </p>
      <p
        v-else
        class="text-xs text-dimmed"
      >
        {{ t('database.seeding.progress', { done: status.progress?.done ?? 0, total: status.progress?.total ?? 0 }) }}
      </p>
    </template>
  </div>
</template>
