<template>
  <span>{{ value }} × 10<sup class="pl-1">{{ exponent }}</sup> {{ unit }}</span>
</template>

<script lang="ts" setup>
defineProps<{
  value: number
  exponent: number
  unit: string
}>()
</script>
