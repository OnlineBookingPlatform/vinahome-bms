<script setup lang="ts">
import { Plus, Delete, Edit } from "@element-plus/icons-vue";
import {
  ElMessage,
  ElMessageBox,
  type FormInstance,
  type FormRules,
} from "element-plus";
import {
  createVehicleAPI,
  deleteVehicleAPI,
  getVehiclesAPI,
  updateVehicleAPI,
} from "~/api/vehicleAPI";
import TitleSectionDeclare from "~/components/UI/TitleSectionDeclare.vue";
import { useAuthStore } from "~/stores/authStore";
import type { VehicleType } from "~/types/VehicleType";
import { formatDate } from "@/lib/dateUtils";
const dialogVisible = ref(false);
const isEditMode = ref(false);
const tableData = ref<VehicleType[]>([]);
const loading = ref<boolean>(false);
const search = ref("");
const authStore = useAuthStore();
const brands = ref([
  { id: 1, name: "Thaco" },
  { id: 2, name: "Hyundai" },
  { id: 3, name: "Mercedes Benz" },
  { id: 4, name: "Tracomeco" },
  { id: 5, name: "Kim Long" },
  { id: 6, name: "Kia" },
  { id: 7, name: "SAMCO" },
  { id: 8, name: "Haeco" },
  { id: 9, name: "Iveco" },
  { id: 10, name: "Gaz" },
  { id: 11, name: "King Long" },
  { id: 12, name: "Ford" },
  { id: 13, name: "Khác" },
]);
const vehicleTypes = ref([
  { id: 1, name: "Ghế ngồi" },
  { id: 2, name: "Ghế ngồi limousine" },
  { id: 3, name: "Giường nằm" },
  { id: 4, name: "Giường nằm limousine" },
  { id: 5, name: "Phòng VIP (cabin)" },
  { id: 6, name: "Xe trung chuyển" },
]);
const formatVehicleType = (row: any) => {
  const type = vehicleTypes.value.find((v) => v.id === row.type);
  return type ? type.name : "Không xác định";
};
const status = ref([
  { id: 1, name: "Đang sử dụng", type: "success" },
  { id: 2, name: "Đang bảo dưỡng", type: "warning" },
  { id: 3, name: "Ngừng hoạt động", type: "danger" },
]);
const getStatusName = (statusId: number) => {
  const item = status.value.find((s) => s.id === statusId);
  return item ? item.name : "Không xác định";
};

const getStatusTagType = (statusId: number) => {
  const item = status.value.find((s) => s.id === statusId);
  return item ? item.type : "info";
};
const rules = reactive<FormRules<VehicleType>>({
  license_plate: [
    { required: true, message: "Vui lòng nhập biển số xe", trigger: "blur" },
  ],
  status: [
    { required: true, message: "Vui lòng chọn tình trạng xe", trigger: "blur" },
  ],
  brand: [
    { required: true, message: "Vui lòng chọn hãng xe", trigger: "blur" },
  ],
  type: [{ required: true, message: "Vui lòng chọn loại xe", trigger: "blur" }],
});
const ruleFormRef = ref<FormInstance>();
const filterTableData = computed(() =>
  tableData.value.filter(
    (data) =>
      !search.value ||
      data.license_plate?.toLowerCase().includes(search.value.toLowerCase())
  )
);
const resetForm = () => {
  vehicle.value = {
    id: 0,
    license_plate: null,
    phone: null,
    brand: null,
    type: null,
    status: null,
    color: null,
    registration_expiry: null,
    insurance_expiry: null,
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
const vehicle = ref<VehicleType>({
  id: 0,
  license_plate: null,
  phone: null,
  brand: null,
  type: null,
  status: null,
  color: null,
  registration_expiry: null,
  insurance_expiry: null,
  note: null,
  company_id: authStore.storeCompanyId ?? 0,
});

const handleSubmit = () => {
  ruleFormRef.value?.validate(async (valid) => {
    if (valid) {
      if (isEditMode.value) {
        // Call API to update vehicle
        console.log("Updating vehicle:", vehicle.value);
        try {
          const response = await updateVehicleAPI(vehicle.value);
          console.log("Update: ", response);
          if (response.result) {
            ElMessage.success("Cập nhật phương tiện thành công!");
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
          ElMessage.error("Không thể cập nhật phương tiện, vui lòng thử lại!");
        } finally {
          loading.value = false;
          dialogVisible.value = false;
          resetForm();
        }
      } else {
        // Call API to add new vehicle
        console.log("Adding new vehicle:", vehicle.value);
        try {
          const response = await createVehicleAPI(vehicle.value);
          if (response.result) {
            ElMessage.success("Tạo phương tiện thành công!");
            console.log(response.result);
            tableData.value.push(response.result);
          } else {
            ElMessage.error(response.message || "Có lỗi xảy ra!");
            console.error(response.message);
          }
        } catch (error) {
          ElMessage.error("Không thể tạo phương tiện, vui lòng thử lại!");
          console.error("Error creating:", error);
        } finally {
          loading.value = false;
          dialogVisible.value = false;
          resetForm();
        }
      }
    } else {
      console.log("Validation failed");
    }
  });
};
const handleEdit = (index: number, row: VehicleType) => {
  isEditMode.value = true;
  vehicle.value = { ...row };
  dialogVisible.value = true;
};
const handleDelete = (index: number, row: VehicleType) => {
  ElMessageBox.confirm(
    `Bạn có chắc chắn muốn xóa phương tiện "${row.license_plate}" không?`,
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
        await deleteVehicleAPI(row.id);
        ElMessage.success("Xóa phương tiện thành công!");

        tableData.value.splice(index, 1);
      } catch (error) {
        ElMessage.error("Không thể xóa phương tiện, vui lòng thử lại!");
      } finally {
        loading.value = false;
      }
    })
    .catch(() => {
      ElMessage.info("Đã hủy xóa phương tiện.");
    });
};
const fetchVehicles = async () => {
  loading.value = true;
  try {
    const response = await getVehiclesAPI(authStore.storeCompanyId ?? 0);
    if (response.result) {
      tableData.value = response.result;
      console.log(response.result);
    } else {
      ElMessage.error(response.message || "Có lỗi xảy ra!");
    }
  } catch (error) {
    ElMessage.error("Không thể tải danh sách phương tiện, vui lòng thử lại!");
    console.error("Error fetching vehicles:", error);
  } finally {
    loading.value = false;
  }
};
onMounted(fetchVehicles);
</script>
<template>
  <section class="px-4 py-4 flex justify-between items-center">
    <TitleSectionDeclare title="DANH SÁCH PHƯƠNG TIỆN" />
    <el-button type="primary" @click="dialogVisible = true" :icon="Plus">
      Thêm phương tiện
    </el-button>
  </section>
  <section class="px-4">
    <el-table
      :data="filterTableData"
      stripe
      style="width: 100%"
      v-loading="loading"
    >
      <el-table-column type="index" label="STT" width="50" />
      <el-table-column prop="license_plate" label="Biển số" />
      <el-table-column prop="phone" label="Số điện thoại xe" />
      <el-table-column prop="color" label="Màu xe" />
      <el-table-column prop="registration_expiry" label="Hạn đăng kiểm">
        <template v-slot="scope">
          {{ formatDate(scope.row.registration_expiry) }}
        </template>
      </el-table-column>

      <el-table-column prop="insurance_expiry" label="Hạn bảo hiểm" >
        <template v-slot="scope">
          {{ formatDate(scope.row.insurance_expiry) }}
        </template>
      </el-table-column>
      <el-table-column
        prop="type"
        label="Loại xe"
        :formatter="formatVehicleType"
      />
      <el-table-column prop="status" label="Tình trạng">
        <template v-slot="scope">
          <el-tag :type="getStatusTagType(scope.row.status)">
            {{ getStatusName(scope.row.status) }}
          </el-tag>
        </template>
      </el-table-column>

      <el-table-column prop="note" label="Ghi chú" />
      <el-table-column align="right">
        <template #header>
          <el-input
            v-model="search"
            size="small"
            placeholder="Tìm kiếm nhân viên"
          />
        </template>
        <template #default="scope">
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
    :title="isEditMode ? 'Chỉnh sửa phương tiện' : 'Thêm phương tiện'"
    width="500"
    :before-close="handleClose"
  >
    <el-form :model="vehicle" :rules="rules" ref="ruleFormRef">
      <el-row>
        <el-col :span="12" class="p-2">
          <div class="flex flex-col items-start mt-3">
            <span class="text-base font-medium">Biển số xe</span>
            <el-form-item prop="license_plate" class="w-full">
              <el-input v-model="vehicle.license_plate" type="text" />
            </el-form-item>
          </div>
          <div class="flex flex-col items-start mt-3">
            <span class="text-base font-medium">Số điện thoại xe</span>
            <el-form-item prop="phone" class="w-full">
              <el-input v-model="vehicle.phone" type="text" />
            </el-form-item>
          </div>
          <div class="flex flex-col items-start mt-3">
            <span class="text-base font-medium">Màu xe</span>
            <el-form-item prop="color" class="w-full">
              <el-input v-model="vehicle.color" type="text" />
            </el-form-item>
          </div>
          <div class="flex flex-col items-start mt-3">
            <span class="text-base font-medium">Hạn đăng kiểm</span>
            <el-form-item prop="phone" class="w-full">
              <el-date-picker
                v-model="vehicle.registration_expiry"
                type="date"
                placeholder="Chọn hạn đăng kiểm"
              />
            </el-form-item>
          </div>
          <div class="flex flex-col items-start mt-3">
            <span class="text-base font-medium">Hạn bảo hiểm</span>
            <el-form-item prop="phone" class="w-full">
              <el-date-picker
                v-model="vehicle.insurance_expiry"
                type="date"
                placeholder="Chọn hạn bảo hiểm"
              />
            </el-form-item>
          </div>
        </el-col>
        <el-col :span="12" class="p-2">
          <div class="flex flex-col items-start mt-3">
            <span class="text-base font-medium">Hãng xe</span>
            <el-form-item prop="brand" class="w-full">
              <el-select
                v-model="vehicle.brand"
                placeholder="Chọn hãng xe"
                class="w-full"
              >
                <el-option
                  v-for="item in brands"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                />
              </el-select>
            </el-form-item>
          </div>
          <div class="flex flex-col items-start mt-3">
            <span class="text-base font-medium">Loại xe</span>
            <el-form-item prop="type" class="w-full">
              <el-select
                v-model="vehicle.type"
                placeholder="Chọn loại xe"
                class="w-full"
              >
                <el-option
                  v-for="item in vehicleTypes"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                />
              </el-select>
            </el-form-item>
          </div>
          <div class="flex flex-col items-start mt-3">
            <span class="text-base font-medium">Tình trạng</span>
            <el-form-item prop="status" class="w-full">
              <el-select
                v-model="vehicle.status"
                placeholder="Chọn tình trạng"
                class="w-full"
              >
                <el-option
                  v-for="item in status"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                />
              </el-select>
            </el-form-item>
          </div>
          <div class="flex flex-col items-start mt-3">
            <span class="text-base font-medium">Ghi chú</span>
            <el-form-item prop="note" class="w-full">
              <el-input v-model="vehicle.note" type="textarea" />
            </el-form-item>
          </div>
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
