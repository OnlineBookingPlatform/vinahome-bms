<script setup lang="ts">
import { ElMessage } from 'element-plus';
import { useRouter } from 'vue-router';
const router = useRouter();
const value = ref<string | null>(null);
const loading = ref(false);
const options = ref([
  { label: 'Văn phòng Hà Nội', value: 'hanoi' },
  { label: 'Văn phòng Hồ Chí Minh', value: 'hcm' },
  { label: 'Văn phòng Đà Nẵng', value: 'danang' },
]);
const logout = () => {
  router.push('/');
  ElMessage({
    message: 'Đăng xuất thành công!',
    type: 'success',
  });
}
const startWorking = () => {
  if (value.value) {
    router.push('/dashboard');
  } else {
    console.warn('No office selected');
  }
};
</script>
<template>
  <el-select
    v-model="value"
    placeholder="Chọn văn phòng làm việc"
    size="large"
    style="width: 250px"
    v-loading="loading"
  >
    <el-option
      v-for="item in options"
      :key="item.value"
      :label="item.label"
      :value="item.value"
    />
  </el-select>
  <div class="button-container">
    <el-button
      type="primary"
      class="button-start"
      :disabled="!value"
      @click="startWorking"
    >
      Bắt đầu làm việc
    </el-button>
    <el-button type="warning" class="button-start" @click="logout">
      Đăng xuất
    </el-button>
  </div>
</template>
<style scoped>
.button-start {
  margin-top: 20px;
  width: 250px;
}
.button-container {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-top: 15px;
}
.el-button + .el-button {
  margin-left: 0px !important;
}
</style>
