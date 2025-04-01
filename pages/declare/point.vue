<script setup lang="ts">
import { Plus, Delete, Edit, Top } from "@element-plus/icons-vue";
import {
  ElMessage,
  ElMessageBox,
  type FormInstance,
  type FormRules,
} from "element-plus";
import { useAuthStore } from "~/stores/authStore";
import TitleSectionDeclare from "~/components/UI/TitleSectionDeclare.vue";
import type { PointType } from "~/types/PointType";
import type { District, Province, Ward } from "~/types/LocationTyoe";
import { getDistricts, getProvinces, getWards } from "~/api/locationApi";
import { createPointAPI, deletePointAPI, getPointsByCompanyAPI, updatePointAPI } from "~/api/pointAPI";
const dialogVisible = ref(false);
const isEditMode = ref(false);
const tableData = ref<PointType[]>([]);
const loading = ref<boolean>(false);
const ruleFormRef = ref<FormInstance>();
const authStore = useAuthStore();
const rules = reactive<FormRules<PointType>>({
  name: [
    { required: true, message: "Vui lòng nhập tên điểm dừng", trigger: "blur" },
  ],
  provinces_id: [
    {
      required: true,
      message: "Vui lòng chọn tỉnh/thành phố",
      trigger: "change",
    },
  ],
  districts_id: [
    {
      required: true,
      message: "Vui lòng chọn quận/huyện",
      trigger: "change",
    },
  ],
});
const point = ref<PointType>({
  id: 0,
  name: null,
  address: null,
  provinces_id: null,
  districts_id: null,
  wards_id: null,
  company_id: authStore.storeCompanyId ?? 0,
});
const resetForm = () => {
  point.value = {
    id: 0,
    name: null,
    address: null,
    provinces_id: null,
    districts_id: null,
    wards_id: null,
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
        try {
          const response = await updatePointAPI(point.value);
          console.log("Update: ", response);
          if (response.result) {
            ElMessage.success("Cập nhật điểm dừng thành công!");
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
          ElMessage.error("Không thể cập nhật điểm dừng, vui lòng thử lại!");
        } finally {
          loading.value = false;
          dialogVisible.value = false;
          resetForm();
        }
      } else {
        console.log("Add");
        console.log(point.value);
        try {
          const response = await createPointAPI(point.value);
          if (response.result) {
            ElMessage.success("Tạo điểm dừng thành công!");
            console.log(response.result);
            tableData.value.push(response.result);
          } else {
            ElMessage.error(response.message || "Có lỗi xảy ra!");
            console.error(response.message);
          }
        } catch (error) {
          ElMessage.error("Không thể tạo điểm dừng, vui lòng thử lại!");
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


const provinces = ref<Province[]>([]);
const districts = ref<District[]>([]);
const wards = ref<Ward[]>([]);

const loadingProvinces = ref(false);
const loadingDistricts = ref(false);
const loadingWards = ref(false);

const loadProvinces = async () => {
  loadingProvinces.value = true;
  try {
    const response = await getProvinces();
    provinces.value = response.result;
  } catch (error) {
    console.error("Error fetching provinces", error);
    ElMessage.error("Lỗi khi tải tỉnh/thành phố");
    provinces.value = [];
  } finally {
    loadingProvinces.value = false;
  }
};

const loadDistricts = async (provinceId: number) => {
  if (provinceId) {
    loadingDistricts.value = true;
    try {
      const response = await getDistricts(provinceId);
      districts.value = response.result;
    } catch (error) {
      console.error("Error fetching districts", error);
      ElMessage.error("Lỗi khi tải quận/huyện");
      districts.value = [];
    } finally {
      loadingDistricts.value = false;
    }
  }
};

const loadWards = async (districtId: number) => {
  if (districtId) {
    loadingWards.value = true;
    try {
      const response = await getWards(districtId);
      wards.value = response.result;
    } catch (error) {
      console.error("Error fetching wards", error);
      ElMessage.error("Lỗi khi tải phường/xã");
      wards.value = [];
    } finally {
      loadingWards.value = false;
    }
  }
};
const fetchPoints = async () => {
  loading.value = true;
  try {
    const response = await getPointsByCompanyAPI(authStore.storeCompanyId ?? 0);
    console.log("Points: ", response);
    if (response.result) {
      tableData.value = response.result;
      
    } else {
      ElMessage.error(response.message || "Có lỗi xảy ra!");
    }
  } catch (error) {
    console.error("Error fetching points", error);
    ElMessage.error("Có lỗi xảy ra khi tải dữ liệu!");
  } finally {
    loading.value = false;
  }
};
const isInitializing = ref(false);

const handleEdit = async (index: number, row: PointType) => {
  isInitializing.value = true;

  point.value = { ...row };
  isEditMode.value = true;
  dialogVisible.value = true;

  if (point.value.provinces_id) {
    await loadDistricts(point.value.provinces_id);
  }
  if (point.value.districts_id) {
    await loadWards(point.value.districts_id);
  }

  isInitializing.value = false;
};

watch(
  () => point.value.provinces_id,
  (newProvinceId) => {
    if (isInitializing.value) return;
    point.value.districts_id = null;
    point.value.wards_id = null;
    districts.value = [];
    wards.value = [];
    if (newProvinceId) {
      loadDistricts(newProvinceId);
    }
  }
);

watch(
  () => point.value.districts_id,
  (newDistrictId) => {
    if (isInitializing.value) return; 
    point.value.wards_id = null;
    wards.value = [];
    if (newDistrictId) {
      loadWards(newDistrictId);
    }
  }
);


const handleDelete = (index: number, row: PointType) => {
  ElMessageBox.confirm(
    `Bạn có chắc chắn muốn xóa điểm dừng ${row.name} không?`,
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
        await deletePointAPI(row.id);
        ElMessage.success("Xóa điểm thành công!");

        tableData.value.splice(index, 1);
      } catch (error) {
        ElMessage.error("Không thể xóa điểm, vui lòng thử lại!");
      } finally {
        loading.value = false;
      }
    })
    .catch(() => {
      ElMessage.info("Đã hủy xóa điểm dừng.");
    });
};
onMounted(() => {
  fetchPoints();
  loadProvinces();
});

</script>
<template>
  <section class="px-4 py-4 flex justify-between items-center">
    <TitleSectionDeclare title="DANH SÁCH ĐIỂM DỪNG" />
    <el-button type="primary" @click="dialogVisible = true" :icon="Plus">
      Thêm điểm dừng
    </el-button>
  </section>
  <section class="px-4">
    <el-table :data="tableData" stripe style="width: 100%" v-loading="loading">
      <el-table-column type="index" label="STT" width="50" />
      <el-table-column prop="name" label="Tên điểm dừng" />
      <el-table-column prop="address" label="Địa chỉ" />
      <el-table-column align="right">
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
    :title="isEditMode ? 'Chỉnh sửa điểm dừng' : 'Thêm điểm dừng'"
    width="500"
    :before-close="handleClose"
  >
    <el-form :model="point" :rules="rules" ref="ruleFormRef">
      <div class="flex flex-col items-start mt-3">
        <span class="text-base font-medium">Tên điểm dừng</span>
        <el-form-item prop="name" class="w-full">
          <el-input v-model="point.name" type="text" />
        </el-form-item>
      </div>
      <div class="flex flex-col items-start mt-3">
        <span class="text-base font-medium">Địa chỉ</span>
        <el-form-item prop="address" class="w-full">
          <el-input v-model="point.address" type="text" />
        </el-form-item>
      </div>
      <div class="flex flex-col items-start mt-3">
        <span class="text-base font-medium">Tỉnh/Thành phố</span>
        <el-form-item prop="provinces_id" class="w-full">
          <el-select
            v-model="point.provinces_id"
            placeholder="Chọn Tỉnh/Thành Phố"
            @change="loadDistricts"
            :loading="loadingProvinces"
            filterable
          >
            <el-option
              v-for="item in provinces"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
      </div>
      <div class="flex flex-col items-start mt-3">
        <span class="text-base font-medium">Quận/Huyện</span>
        <el-form-item prop="districts_id" class="w-full">
          <el-select
            v-model="point.districts_id"
            placeholder="Chọn Quận/Huyện"
            @change="loadWards"
            :disabled="!point.provinces_id"
            :loading="loadingDistricts"
            filterable
          >
            <el-option
              v-for="item in districts"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
      </div>
      <div class="flex flex-col items-start mt-3">
        <span class="text-base font-medium">Phường/Xã</span>
        <el-form-item prop="wards_id" class="w-full">
          <el-select
            v-model="point.wards_id"
            placeholder="Chọn Phường/Xã"
            :disabled="!point.districts_id"
            :loading="loadingWards"
            filterable
          >
            <el-option
              v-for="item in wards"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
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
