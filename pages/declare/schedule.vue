<script setup lang="ts">
import { Plus, Delete, Edit } from "@element-plus/icons-vue";
import { ElMessageBox, type FormInstance } from "element-plus";
import TitleSectionDeclare from "~/components/UI/TitleSectionDeclare.vue";
import { useAuthStore } from "~/stores/authStore";
import type { ScheduleType } from "~/types/ScheduleType";
const dialogVisible = ref(false);
const isEditMode = ref(false);
const ruleFormRef = ref<FormInstance>();
const authStore = useAuthStore();
const loading = ref<boolean>(false);
const schedule = ref<ScheduleType>({
  id: 0,
  company_id: authStore.storeCompanyId ?? 0,
});
const rules = {
  name: [
    {
      required: true,
      message: "Tên văn phòng không được để trống",
      trigger: "blur",
    },
  ],
  code: [
    {
      required: true,
      message: "Mã văn phòng không được để trống",
      trigger: "blur",
    },
  ],
  address: [
    { required: true, message: "Địa chỉ không được để trống", trigger: "blur" },
  ],
};
const handleClose = (done: () => void) => {
  ElMessageBox.confirm("Bạn có chắc chắn muốn đóng không?")
    .then(() => {
    //   resetForm();
      dialogVisible.value = false;
      done();
    })
    .catch(() => {
      // catch error
    });
};
const handleSubmit = () => {};
</script>
<template>
  <section class="px-4 py-4 flex justify-between items-center">
    <TitleSectionDeclare title="LỊCH CHẠY" />
    <el-button type="primary" @click="dialogVisible = true" :icon="Plus">
      Thêm lịch chạy
    </el-button>
  </section>
  <el-dialog
    v-model="dialogVisible"
    :title="isEditMode ? 'Chỉnh sửa lịch chạy' : 'Thêm lịch chạy'"
    width="1000"
    :before-close="handleClose"
  >
    <el-form :model="schedule" :rules="rules" ref="ruleFormRef">
      <el-row>
        <el-col :span="12" class="p-2">
          
        </el-col>
        <el-col :span="12" class="p-2">
          
        </el-col>
      </el-row>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="handleClose">Thoát</el-button>
        <el-button type="primary" @click="handleSubmit">
          {{ isEditMode ? "Cập nhật" : "Thêm mới" }}
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>
