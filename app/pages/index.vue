<template>
  <div>
    <UPageHero
      description="Explorez et comparez les objets de notre univers."
      orientation="horizontal"
      :links="[{
        label: 'Commencer',
        icon: 'i-solar-rocket-outline',
        to: '/catalog',
        size: 'xl'
      }]"
    >
      <template #title>
        Le cosmos,<br>
        <span class="bg-linear-to-r from-primary-500 to-secondary-300 bg-clip-text text-transparent">
          en données.
        </span>
      </template>

      <SolarSystem />
    </UPageHero>
  </div>
</template>
