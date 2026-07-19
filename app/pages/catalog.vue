<script lang="ts" setup>
const { data: countData } = await useFetch('/api/celestial-bodies/count')
</script>

<template>
  <UPage>
    <UPageHeader
      title="Catalog"
      :description="`${countData?.count ?? 0} objets · filtrez, triez, explorez`"
    />

    <UPageBody />
  </UPage>
</template>
