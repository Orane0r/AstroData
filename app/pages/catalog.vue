<script lang="ts" setup>
const { data: countData } = await useFetch('/api/celestial-bodies/count')
const { data: bodies, pending: loading } = await useFetch('/api/celestial-bodies')
</script>

<template>
  <UPage>
    <UPageHeader
      title="Catalogue"
      :description="`${countData?.count ?? 0} objets · filtrez, triez, explorez`"
    />

    <UPageBody>
      <UTable
        :data="bodies"
        :loading
      />
    </UPageBody>
  </UPage>
</template>
