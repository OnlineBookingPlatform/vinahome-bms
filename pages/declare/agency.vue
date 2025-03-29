<script setup lang="ts">
import { Plus, Delete, Edit } from "@element-plus/icons-vue";
import TitleSectionDeclare from "~/components/UI/TitleSectionDeclare.vue";
const dialogVisible = ref(false);
</script>
<template>
  <section class="px-4 py-4 flex justify-between items-center">
    <TitleSectionDeclare title="DANH SÁCH NHÂN VIÊN" />
    <el-button type="primary" @click="dialogVisible = true" :icon="Plus">
      Thêm nhân viên
    </el-button>
  </section>
</template>
