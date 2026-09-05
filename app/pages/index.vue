<script setup lang="ts">
const { t } = useI18n()
</script>

<template>
  <div>
    <UPageHero
      :description="t('hero.subtitle')"
      orientation="horizontal"
      :links="[{
        label: t('hero.get_started'),
        icon: 'i-solar-rocket-outline',
        to: '/catalog',
        size: 'xl'
      }]"
    >
      <template #title>
        {{ $t('hero.title') }}<br>
        <span class="bg-linear-to-r from-primary-500 to-secondary-300 bg-clip-text text-transparent">
          {{ $t('hero.title2') }}
        </span>
      </template>

      <SolarSystem />
    </UPageHero>
  </div>
</template>
