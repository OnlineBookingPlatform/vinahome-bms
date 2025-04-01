<script setup lang="ts">
import {
  ElMessage,
  ElMessageBox,
  type FormInstance,
  type FormRules,
} from "element-plus";
import { useAuthStore } from "~/stores/authStore";
import type { RouteType } from "~/types/RouteType";
import { Plus, Delete, Edit, Top } from "@element-plus/icons-vue";
import TitleSectionDeclare from "~/components/UI/TitleSectionDeclare.vue";
import {
  createRouteAPI,
  deleteRouteAPI,
  getRoutesByCompanyAPI,
  moveTopRouteAPI,
  updateRouteAPI,
} from "~/api/routeAPI";
const dialogVisible = ref(false);
const isEditMode = ref(false);
const tableData = ref<RouteType[]>([]);
const loading = ref<boolean>(false);
const ruleFormRef = ref<FormInstance>();
const authStore = useAuthStore();
const rules = reactive<FormRules<RouteType>>({
  name: [
    { required: true, message: "Vui lòng nhập tên tuyến", trigger: "blur" },
  ],
  shorten_name: [
    {
      required: true,
      message: "Vui lòng nhập tên tuyến rút gọn",
      trigger: "blur",
    },
  ],
  base_price: [
    { required: true, message: "Vui lòng nhập giá cơ bản", trigger: "blur" },
  ],
});
const route = ref<RouteType>({
  id: 0,
  name: null,
  shorten_name: null,
  base_price: null,
  status: false,
  note: null,
  company_id: authStore.storeCompanyId ?? 0,
});
const resetForm = () => {
  route.value = {
    id: 0,
    name: null,
    shorten_name: null,
    base_price: null,
    status: false,
    note: null,
    company_id: authStore.storeCompanyId ?? 0,
  };
  isEditMode.value = false;
  ruleFormRef.value?.clearValidate();
};
const handleClose = (done: () => void) => {
  ElMessageBox.confirm("Bạn có chắc chắn muốn đóng không?")
    .then(() => {
      resetForm();
      dialogVisible.value = false;
      done();
    })
    .catch(() => {
      // catch error
    });
};
const handleSubmit = () => {
  ruleFormRef.value?.validate(async (valid) => {
    if (valid) {
      if (isEditMode.value) {
        // await updateOffice();
        console.log("Update:", route.value);
        try {
          const response = await updateRouteAPI(route.value);
          console.log("Update: ", response);
          if (response.result) {
            ElMessage.success("Cập nhật tuyến thành công!");
            console.log("Update: ", response.result);
            const index = tableData.value.findIndex(
              (item) => item.id === response.result.id
            );
            if (index !== -1) {
              tableData.value[index] = response.result;
            }
          } else {
            ElMessage.error(response.message || "Có lỗi xảy ra!");
          }
        } catch (error) {
          ElMessage.error("Không thể cập nhật tuyến, vui lòng thử lại!");
        } finally {
          loading.value = false;
          dialogVisible.value = false;
          resetForm();
        }
      } else {
        console.log("Add");
        console.log(route.value);
        try {
          const response = await createRouteAPI(route.value);
          if (response.result) {
            ElMessage.success("Tạo tuyến thành công!");
            console.log(response.result);
            tableData.value.push(response.result);
          } else {
            ElMessage.error(response.message || "Có lỗi xảy ra!");
            console.error(response.message);
          }
        } catch (error) {
          ElMessage.error("Không thể tạo tuyến, vui lòng thử lại!");
          console.error("Error creating:", error);
        } finally {
          loading.value = false;
          dialogVisible.value = false;
          resetForm();
        }
      }
    }
  });
};
const handleEdit = (index: number, row: RouteType) => {
  console.log(index, row);
  isEditMode.value = true;
  route.value = { ...row };
  dialogVisible.value = true;
};
const handleDelete = (index: number, row: RouteType) => {
  ElMessageBox.confirm(
    `Bạn có chắc chắn muốn xóa tuyến "${row.name}" không?`,
    "Xác nhận",
    {
      confirmButtonText: "Xóa",
      cancelButtonText: "Hủy",
      type: "warning",
    }
  )
    .then(async () => {
      try {
        loading.value = true;
        await deleteRouteAPI(row.id);
        ElMessage.success("Xóa tuyến thành công!");

        tableData.value.splice(index, 1);
      } catch (error) {
        ElMessage.error("Không thể xóa tuyến, vui lòng thử lại!");
      } finally {
        loading.value = false;
      }
    })
    .catch(() => {
      ElMessage.info("Đã hủy xóa tuyến.");
    });
};
const handleMoveTop = (index: number, row: RouteType) => {
  ElMessageBox.confirm(
    `Bạn có chắc chắn muốn di chuyển tuyến "${row.name}" lên trên không?`,
    "Xác nhận",
    {
      confirmButtonText: "Di chuyển",
      cancelButtonText: "Hủy",
      type: "warning",
    }
  )
    .then(async () => {
      try {
        loading.value = true;
        const response = await moveTopRouteAPI(row.id);

        // 2. Kiểm tra response hợp lệ
        if (!response || !response.result) {
          throw new Error("Dữ liệu trả về không hợp lệ");
        }
        ElMessage.success("Di chuyển tuyến lên thành công!");
        if (Array.isArray(response.result)) {
          tableData.value = response.result.map((item) => ({
            ...item,
            created_at: item.created_at
              ? new Date(item.created_at).toISOString()
              : null,
          }));
        }
      } catch (error) {
        ElMessage.error("Không thể di chuyển tuyến, vui lòng thử lại!");
      } finally {
        loading.value = false;
      }
    })
    .catch(() => {
      ElMessage.info("Đã hủy di chuyển tuyến.");
    });
};
const fetchRoutes = async () => {
  loading.value = true;
  try {
    const response = await getRoutesByCompanyAPI(authStore.storeCompanyId ?? 0);
    if (response.result) {
      tableData.value = response.result;
      console.log(response.result);
    } else {
      ElMessage.error(response.message || "Có lỗi xảy ra!");
    }
  } catch (error) {
    ElMessage.error("Có lỗi xảy ra khi tải dữ liệu!");
    console.error("🚨 Error fetching:", error);
  } finally {
    loading.value = false;
  }
};
onMounted(fetchRoutes);
</script>
<template>
  <section class="px-4 py-4 flex justify-between items-center">
    <TitleSectionDeclare title="DANH SÁCH TUYẾN" />
    <el-button type="primary" @click="dialogVisible = true" :icon="Plus">
      Thêm tuyến
    </el-button>
  </section>
  <section class="px-4">
    <el-table :data="tableData" stripe style="width: 100%" v-loading="loading">
      <el-table-column type="index" label="STT" width="50" />
      <el-table-column prop="name" label="Tên tuyến" />
      <el-table-column prop="shorten_name" label="Tên tuyến rút gọn" />
      <el-table-column prop="base_price" label="Giá cơ bản" />
      <el-table-column prop="status" label="Trạng thái">
        <template #default="{ row }">
          <el-tag :type="row.status ? 'success' : 'danger'">
            {{ row.status ? "Kích hoạt" : "Ngưng hoạt động" }}
          </el-tag>
        </template>
      </el-table-column>

      <el-table-column prop="note" label="Ghi chú" />
      <el-table-column align="right">
        <template #default="scope">
          <el-button
            type="warning"
            :icon="Top"
            circle
            @click="handleMoveTop(scope.$index, scope.row)"
          />
          <el-button
            type="primary"
            :icon="Edit"
            circle
            @click="handleEdit(scope.$index, scope.row)"
          />
          <el-button
            type="danger"
            :icon="Delete"
            circle
            @click="handleDelete(scope.$index, scope.row)"
          />
        </template>
      </el-table-column>
    </el-table>
  </section>
  <el-dialog
    v-model="dialogVisible"
    :title="isEditMode ? 'Chỉnh sửa tuyến' : 'Thêm tuyến'"
    width="500"
    :before-close="handleClose"
  >
    <el-form :model="route" :rules="rules" ref="ruleFormRef">
      <div class="flex flex-col items-start mt-3">
        <span class="text-base font-medium">Tên tuyến</span>
        <el-form-item prop="name" class="w-full">
          <el-input v-model="route.name" type="text" />
        </el-form-item>
      </div>
      <div class="flex flex-col items-start mt-3">
        <span class="text-base font-medium">Tên tuyến rút gọn</span>
        <el-form-item prop="shorten_name" class="w-full">
          <el-input v-model="route.shorten_name" type="text" />
        </el-form-item>
      </div>
      <div class="flex flex-col items-start mt-3">
        <span class="text-base font-medium">Giá cơ bản</span>
        <el-form-item prop="base_price" class="w-full">
          <el-input v-model.number="route.base_price" />
        </el-form-item>
      </div>
      <div class="flex flex-col items-start mt-3">
        <span class="text-base font-medium">Trạng thái</span>
        <el-form-item prop="status" class="w-full">
          <el-switch
            v-model="route.status"
            active-text="Kích hoạt"
            inactive-text="Ngưng kích hoạt"
          />
        </el-form-item>
      </div>
      <div class="flex flex-col items-start mt-3">
        <span class="text-base font-medium">Ghi chú</span>
        <el-form-item prop="note" class="w-full">
          <el-input v-model="route.note" type="textarea" />
        </el-form-item>
      </div>
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
