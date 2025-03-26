<script setup lang="ts">
defineProps<{
  title: string;
}>();
</script>

<template>
  <h2 class="text-[20px] font-medium">
    {{ title }}
  </h2>
</template>