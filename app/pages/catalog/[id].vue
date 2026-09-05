<script setup lang="ts">

</script>

<template>
  <UContainer class="flex flex-col gap-4">
    <div>fil d'Ariane</div>
    <div class="flex flex-row gap-4">
      <div class="flex-1 min-h-50">
        <!-- TODO bouton 3d -->
        <NuxtImg
          src="https://upload.wikimedia.org/wikipedia/commons/e/e1/FullMoon2010.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail_unscaled"
          alt="Moon"
          fit="contain"
          class="rounded-xl"
        />
      </div>
      <div class="flex-2 min-h-50">
        <div>nom</div>
        <div>description wikipedia + lien wikipedia</div>
      </div>
    </div>
    <div>cadre caractéristiques</div>
    <div>cadre profil vs moyenne</div>
    <div>cadre galerie</div>
    <div>objets liés (à voir)</div>
  </UContainer>
</template>
