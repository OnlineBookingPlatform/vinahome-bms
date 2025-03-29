<script setup lang="ts">
import SelectOffice from "~/components/Office/SelectOffice.vue";
definePageMeta({
  layout: false,
});
</script>
<template>
  <section
    class="flex min-h-screen flex-col items-center justify-center bg-gray-100 p-4"
  >
    <img src="/static/logo-2.png" alt="App Logo" class="mb-8 w-96" />
    <h2 class="mb-4 text-xl font-semibold text-blue-600">
      Lựa chọn văn phòng làm việc
    </h2>
    <SelectOffice />
  </section>
</template>
