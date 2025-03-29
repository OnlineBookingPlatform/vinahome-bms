<script setup lang="ts">
import { ElMessage } from "element-plus";
import { useRouter } from "vue-router";
import { getOfficesNameAPI } from "~/api/officeAPI";
import { useAuthStore } from "~/stores/authStore";
import { useOfficeStore } from "~/stores/officeStore";
import type { OfficeNameType } from "~/types/OfficeType";
const router = useRouter();
const value = ref<string | null>(null);
const loading = ref(false);
const options = ref<OfficeNameType[]>([]);
const authStore = useAuthStore();
const officeStore = useOfficeStore();
const logout = () => {
  router.push("/");
  officeStore.resetOffice();
  authStore.logout();
  ElMessage({
    message: "Đăng xuất thành công!",
    type: "success",
  });
};
const startWorking = () => {
  if (officeStore.office) {
    console.log("Selected office:", officeStore.office);
    router.push("/dashboard");
  } else {
    console.warn("No office selected");
  }
};
const fetchOfficesName = async () => {
  loading.value = true;
  try {
    const response = await getOfficesNameAPI(authStore.storeCompanyId ?? 0);
    if (response.result) {
      options.value = response.result;
      console.log(response.result);
    }
  } catch (error) {
    console.error("Error fetching office names:", error);
  } finally {
    loading.value = false;
  }
};
onMounted(fetchOfficesName);

watch(
  () => officeStore.office,
  (newOffice, oldOffice) => {
    console.log(`Office changed from ${oldOffice} to ${newOffice}`);

  }
);
const handleOfficeChange = (value: number) => {
  officeStore.setOffice(value);
};
</script>
<template>
  <el-select
    v-model="officeStore.office"
    @change="handleOfficeChange"
    placeholder="Chọn văn phòng làm việc"
    size="large"
    style="width: 250px"
    v-loading="loading"
  >
    <el-option
      v-for="item in options"
      :key="item.id"
      :label="item.name"
      :value="item.id"
    />
  </el-select>
  <div class="button-container">
    <el-button
      type="primary"
      class="button-start"
      :disabled="!officeStore.office"
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
