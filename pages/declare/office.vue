<script setup lang="ts">
import { Plus, Delete, Edit } from "@element-plus/icons-vue";
import {
  ElMessage,
  ElMessageBox,
  type FormInstance,
  type FormRules,
} from "element-plus";
import { fa } from "element-plus/es/locales.mjs";
import { createOfficeAPI, deleteOfficeAPI, getOfficesByCompanyAPI, updateOfficeAPI } from "~/api/officeAPI";
import TitleSectionDeclare from "~/components/UI/TitleSectionDeclare.vue";
import { useAuthStore } from "~/stores/authStore";
import type { OfficeType } from "~/types/OfficeType";
const dialogVisible = ref(false);
const isEditMode = ref(false);
const tableData = ref<OfficeType[]>([]);
const loading = ref<boolean>(false);
const search = ref("");
const ruleFormRef = ref<FormInstance>();
const authStore = useAuthStore();
const office = ref<OfficeType>({
  id: 0,
  name: null,
  code: null,
  address: null,
  type_ticket: false,
  type_goods: false,
  phone_ticket: null,
  phone_goods: null,
  note: null,
  company_id: authStore.storeCompanyId ?? 0,
});
const rules = reactive<FormRules<OfficeType>>({
  name: [
    { required: true, message: "Vui lòng nhập tên văn phòng", trigger: "blur" },
  ],
  code: [
    { required: true, message: "Vui lòng nhập mã văn phòng", trigger: "blur" },
  ],
  address: [
    { required: true, message: "Vui lòng nhập địa chỉ", trigger: "blur" },
  ],
});
const resetForm = () => {
  office.value = {
    id: 0,
    name: null,
    code: null,
    address: null,
    type_ticket: false,
    type_goods: false,
    phone_ticket: null,
    phone_goods: null,
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
        // console.log("Update:", office);
        try {
          const response = await updateOfficeAPI(office.value);
          console.log("Update: ", response);
          if (response.result) {
            ElMessage.success("Cập nhật văn phòng thành công!");
            console.log("Update: ",response.result);
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
          ElMessage.error("Không thể cập nhật văn phòng, vui lòng thử lại!");
        } finally {
          loading.value = false;
          dialogVisible.value = false;
          resetForm();
        }
      } else {
        console.log("Add");
        try {
          const response = await createOfficeAPI(office.value);
          if (response.result) {
            ElMessage.success("Tạo văn phòng thành công!");
            console.log(response.result);
            tableData.value.push(response.result);
          } else {
            ElMessage.error(response.message || "Có lỗi xảy ra!");
            console.error(response.message);
          }
        } catch (error) {
          ElMessage.error("Không thể tạo văn phòng, vui lòng thử lại!");
          console.error("Error creating office:", error);
        } finally {
          loading.value = false;
          dialogVisible.value = false;
          resetForm();
        }
      }
    }
  });
};
const handleEdit = (index: number, row: OfficeType) => {
  console.log(index, row);
  isEditMode.value = true;
  office.value = { ...row };
  dialogVisible.value = true;
};
const handleDelete = (index: number, row: OfficeType) => {
  ElMessageBox.confirm(
    `Bạn có chắc chắn muốn xóa văn phòng "${row.name}" không?`,
    "Xác nhận",
    {
      confirmButtonText: "Xóa",
      cancelButtonText: "Hủy",
      type: "warning",
    }
  ).then(async () => {
    try {
      loading.value = true;
      await deleteOfficeAPI(row.id);
      ElMessage.success("Xóa văn phòng thành công!");
      
      tableData.value.splice(index, 1);
    } catch (error) {
      ElMessage.error("Không thể xóa văn phòng, vui lòng thử lại!");
    } finally {
      loading.value = false;
    }
  }).catch(() => {
    ElMessage.info("Đã hủy xóa văn phòng.");
  });
};
const filterTableData = computed(() =>
  tableData.value.filter(
    (data) =>
      !search.value ||
      data.name?.toLowerCase().includes(search.value.toLowerCase())
  )
);
const fetchOffices = async () => {
  loading.value = true;
  try {
    const response = await getOfficesByCompanyAPI(authStore.storeCompanyId ?? 0);
    if (response.result) {
      tableData.value = response.result;
      console.log(response.result);
    }
    else {
      ElMessage.error(response.message || "Có lỗi xảy ra!");
    }
  } catch (error) {
    ElMessage.error("Có lỗi xảy ra khi tải dữ liệu văn phòng!");
    console.error("🚨 Error fetching:", error);
  } finally {
    loading.value = false;
  }
};
watch(
  () => office.value.type_ticket,
  (newValue) => {
    if (!newValue) {
      office.value.phone_ticket = null;
    }
  }
);

watch(
  () => office.value.type_goods,
  (newValue) => {
    if (!newValue) {
      office.value.phone_goods = null;
    }
  }
);
onMounted(fetchOffices);
</script>
<template>
  <section class="px-4 py-4 flex justify-between items-center">
    <TitleSectionDeclare title="DANH SÁCH VĂN PHÒNG" />
    <el-button type="primary" @click="dialogVisible = true" :icon="Plus">
      Thêm văn phòng
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
      <el-table-column prop="name" label="Tên văn phòng" />
      <el-table-column prop="code" label="Mã văn phòng" />
      <el-table-column label="Số điện thoại" >
        <template #default="scope">
          <div class="flex flex-col">
            <el-tag v-if="scope.row.type_ticket" class="text-sm font-medium my-1">
              {{ scope.row.phone_ticket }}
            </el-tag>
            <el-tag v-if="scope.row.type_goods" class="text-sm font-medium">
              {{ scope.row.phone_goods }}
            </el-tag>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="address" label="Địa chỉ" />
      <el-table-column label="Loại văn phòng">
        <template #default="scope">
          <el-tag v-if="scope.row.type_ticket" type="success" class="m-1 text-sm font-medium">Đặt vé</el-tag>
          <el-tag v-if="scope.row.type_goods" type="danger" class="text-sm font-medium">Gửi hàng</el-tag>
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
    :title="isEditMode ? 'Chỉnh sửa văn phòng' : 'Thêm văn phòng'"
    width="500"
    :before-close="handleClose"
  >
    <el-form :model="office" :rules="rules" ref="ruleFormRef">
      <el-row>
        <el-col :span="12" class="p-2">
          <div class="flex flex-col items-start mt-3">
            <span class="text-base font-medium">Tên văn phòng</span>
            <el-form-item prop="name" class="w-full">
              <el-input v-model="office.name" type="text" />
            </el-form-item>
          </div>
          <div class="flex flex-col items-start mt-3">
            <span class="text-base font-medium">Mã văn phòng</span>
            <el-form-item prop="code" class="w-full">
              <el-input v-model="office.code" type="text" />
            </el-form-item>
          </div>
          <div class="flex flex-col items-start mt-3">
            <span class="text-base font-medium">Địa chỉ</span>
            <el-form-item prop="address" class="w-full">
              <el-input v-model="office.address" type="textarea" />
            </el-form-item>
          </div>
          <div class="flex flex-col items-start mt-3">
            <span class="text-base font-medium">Ghi chú</span>
            <el-form-item prop="note" class="w-full">
              <el-input v-model="office.note" type="textarea" />
            </el-form-item>
          </div>
        </el-col>
        <el-col :span="12" class="p-2">
          <div class="flex flex-col items-start mt-3">
            <span class="text-base font-medium">Loại văn phòng</span>
            <el-form-item prop="typeTicket" class="w-full">
              <el-checkbox
                v-model="office.type_ticket"
                label="Văn phòng đặt vé"
                size="large"
              />
            </el-form-item>
            <el-form-item
              prop="phoneTicket"
              class="w-full"
              v-if="office.type_ticket === true"
            >
              <el-input
                v-model="office.phone_ticket"
                type="text"
                placeholder="SĐT văn phòng đặt vé"
              />
            </el-form-item>
          </div>
          <div class="flex flex-col items-start">
            <el-form-item prop="typeGoods" class="w-full">
              <el-checkbox
                v-model="office.type_goods"
                label="Văn phòng gửi hàng"
                size="large"
              />
            </el-form-item>
            <el-form-item
              prop="phoneGoods"
              class="w-full"
              v-if="office.type_goods === true"
            >
              <el-input
                v-model="office.phone_goods"
                type="text"
                placeholder="SĐT văn phòng gửi hàng"
              />
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
