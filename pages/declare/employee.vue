<script setup lang="ts">
import { Plus, Delete, Edit } from "@element-plus/icons-vue";
import {
  ElMessage,
  ElMessageBox,
  type FormInstance,
  type FormRules,
} from "element-plus";
import { tr } from "element-plus/es/locales.mjs";
import { createAccountAPI, deleteAccountAPI, getAllAccountByCompanyAPI, updateAccountAPI } from "~/api/employeeAPI";
import TitleSectionDeclare from "~/components/UI/TitleSectionDeclare.vue";
import type { AccountType } from "~/types/AccountType";
const optionsRole = [
  { value: 2, label: "Phụ xe" },
  { value: 3, label: "Tài xế" },
  { value: 4, label: "Nhân viên hành chính" },
  { value: 5, label: "Quản trị viên" },
];
const optionsLicenseClass = [
  { value: "B1", label: "Hạng B1" },
  { value: "B2", label: "Hạng B2" },
  { value: "C", label: "Hạng C" },
  { value: "D", label: "Hạng D" },
  { value: "E", label: "Hạng E" },
];

const companyId = "41";

const dialogVisible = ref(false);
const ruleFormRef = ref<FormInstance>();
const isEditMode = ref(false);
const tableData = ref<AccountType[]>([]);
const loading = ref<boolean>(false);
const search = ref("");
const account = reactive<AccountType>({
  _id: "",
  username: null,
  password: null,
  status: false,
  name: null,
  phone: null,
  email: null,
  date_birth: null,
  citizen_id: null,
  gender: 1,
  role: null,
  note: null,
  license_class: null,
  license_expiry_date: null,
  area: null,
  company_id: Number(companyId),
});
const rules = reactive<FormRules<AccountType>>({
  username: [
    { required: true, message: "Vui lòng nhập tên tài khoản", trigger: "blur" },
  ],
  password: [
    { required: true, message: "Vui lòng nhập mật khẩu", trigger: "blur" },
  ],
  name: [
    { required: true, message: "Vui lòng nhập họ và tên", trigger: "blur" },
  ],
  role: [
    { required: true, message: "Vui lòng chọn chức vụ", trigger: "change" },
  ],
  phone: [
    { required: true, message: "Vui lòng nhập số điện thoại", trigger: "blur" },
  ],
});

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
      loading.value = true; // Bắt đầu loading
      if (isEditMode.value) {
        console.log("Edit");
        console.log(account);
        try {
          const response = await updateAccountAPI(account);
          if (response.result) {
            ElMessage.success("Cập nhật tài khoản thành công!");
            console.log(response.result);
            const index = tableData.value.findIndex(
              (item) => item._id === response.result._id
            );
            if (index !== -1) {
              tableData.value[index] = response.result;
            }
          } else {
            ElMessage.error(response.message || "Có lỗi xảy ra!");
          }
        } catch (error) {
          ElMessage.error("Không thể cập nhật tài khoản, vui lòng thử lại!");
        } finally {
          loading.value = false;
          dialogVisible.value = false;
          resetForm();
        }
      } else {
        console.log("Add");
        try {
          const response = await createAccountAPI(account);
          if (response.result) {
            ElMessage.success("Tạo tài khoản thành công!");
            console.log(response.result);
            tableData.value.push(response.result);
          } else {
            ElMessage.error(response.message || "Có lỗi xảy ra!");
          }
        } catch (error) {
          ElMessage.error("Không thể tạo tài khoản, vui lòng thử lại!");
        } finally {
          loading.value = false;
          dialogVisible.value = false;
          resetForm();
        }
      }
    } else {
      ElMessage.error("Vui lòng kiểm tra lại thông tin!");
    }
  });
};

const resetForm = () => {
  Object.assign(account, {
    id: "",
    username: null,
    password: null,
    status: false,
    name: null,
    phone: null,
    email: null,
    date_birth: null,
    citizen_id: null,
    gender: 0,
    role: null,
    license_class: null,
    license_expiry_date: null,
    area: null,
    note: null,
    company_id: Number(companyId),
  });
  isEditMode.value = false;
  ruleFormRef.value?.clearValidate();
};

watch(
  () => account.role,
  (newRole) => {
    if (newRole === 4 || newRole === 5) {
      account.license_class = null;
      account.license_expiry_date = null;
    }
  }
);

const fetchAccounts = async () => {
  loading.value = true;
  try {
    const response = await getAllAccountByCompanyAPI(companyId);
    if (response.result) {
      tableData.value = Array.isArray(response.result)
        ? response.result
        : [response.result];
    }
  } catch (error) {
    console.error("🚨 Error fetching accounts:", error);
  } finally {
    loading.value = false;
  }
};

const filterTableData = computed(() =>
  tableData.value.filter(
    (data) =>
      !search.value ||
      data.name?.toLowerCase().includes(search.value.toLowerCase()) ||
      data.phone?.toLowerCase().includes(search.value.toLowerCase())
  )
);
const handleEdit = (index: number, row: AccountType) => {
  console.log(index, row);
  isEditMode.value = true;
  dialogVisible.value = true;
  Object.assign(account, row);
};
const handleDelete = async (index: number, row: AccountType) => {
  ElMessageBox.confirm(
    `Bạn có chắc chắn muốn xóa tài khoản "${row.username}" không?`,
    "Xác nhận",
    {
      confirmButtonText: "Xóa",
      cancelButtonText: "Hủy",
      type: "warning",
    }
  ).then(async () => {
    try {
      loading.value = true;
      await deleteAccountAPI(row._id);
      ElMessage.success("Xóa tài khoản thành công!");
      
      tableData.value.splice(index, 1);
    } catch (error) {
      ElMessage.error("Không thể xóa tài khoản, vui lòng thử lại!");
    } finally {
      loading.value = false;
    }
  }).catch(() => {
    ElMessage.info("Đã hủy xóa tài khoản.");
  });
};


onMounted(fetchAccounts);
</script>
<template>
  <section class="px-4 py-4 flex justify-between items-center">
    <TitleSectionDeclare title="DANH SÁCH NHÂN VIÊN" />
    <el-button type="primary" @click="dialogVisible = true" :icon="Plus">
      Thêm nhân viên
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
      <el-table-column prop="name" label="Họ tên" />
      <el-table-column prop="username" label="Tài khoản" />
      <el-table-column prop="phone" label="Số điện thoại" />
      <el-table-column prop="role" label="Chức vụ">
        <template #default="{ row }">
          <el-tag v-if="row.role === 2" type="success">Phụ xe</el-tag>
          <el-tag v-if="row.role === 3" type="warning">Tài xế</el-tag>
          <el-tag v-if="row.role === 4" type="danger">Nhân viên</el-tag>
          <el-tag v-if="row.role === 5" type="primary">Quản trị viên</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="gender" label="Giới tính">
        <template #default="{ row }">
          <el-tag v-if="row.gender === 1" type="success">Nam</el-tag>
          <el-tag v-if="row.gender === 2" type="danger">Nữ</el-tag>
          <el-tag v-if="row.gender === 3" type="info">Khác</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="status" label="Trạng thái">
        <template #default="{ row }">
          <el-tag v-if="row.status" type="success">Kích hoạt</el-tag>
          <el-tag v-else type="danger">Ngưng kích hoạt</el-tag>
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
          <el-button type="primary" :icon="Edit" circle @click="handleEdit(scope.$index, scope.row)"/>
          <el-button type="danger" :icon="Delete" circle @click="handleDelete(scope.$index, scope.row)"/>
        </template>
      </el-table-column>
    </el-table>
  </section>

  <el-dialog
    v-model="dialogVisible"
    :title="isEditMode ? 'Chỉnh sửa nhân viên' : 'Thêm nhân viên'"
    width="1000"
    :before-close="handleClose"
  >
    <el-form :model="account" :rules="rules" ref="ruleFormRef">
      <el-row>
        <el-col :span="8">
          <div class="p-2">
            <el-tag type="primary" class="w-full">THÔNG TIN TÀI KHOẢN</el-tag>
            <div class="flex flex-col items-start mt-5">
              <span class="text-base font-medium">Tài khoản</span>
              <el-form-item prop="username" class="w-full">
                <el-input
                  v-model="account.username"
                  :disabled="isEditMode"
                  placeholder="Nhập tên tài khoản"
                  type="text"
                />
              </el-form-item>
            </div>
            <div class="flex flex-col items-start mt-3" v-if="!isEditMode">
              <span class="text-base font-medium">Mật khẩu</span>
              <el-form-item prop="password" class="w-full">
                <el-input
                  v-model="account.password"
                  placeholder="Nhập mật khẩu"
                  type="password"
                />
              </el-form-item>
            </div>
            <div class="flex flex-col items-start mt-3">
              <span class="text-base font-medium">Trạng thái</span>
              <el-switch
                v-model="account.status"
                size="large"
                active-text="Kích hoạt"
                inactive-text="Ngưng kích hoạt"
              />
            </div>
          </div>
        </el-col>
        <el-col :span="8">
          <div class="p-2">
            <el-tag type="primary" class="w-full">THÔNG TIN NHÂN VIÊN</el-tag>
            <div class="flex flex-col items-start mt-5">
              <span class="text-base font-medium">Họ và tên</span>
              <el-form-item prop="name" class="w-full">
                <el-input v-model="account.name" type="text" />
              </el-form-item>
            </div>
            <div class="flex flex-col items-start mt-3">
              <span class="text-base font-medium">Số điện thoại</span>
              <el-form-item prop="phone" class="w-full">
                <el-input v-model="account.phone" type="text" />
              </el-form-item>
            </div>
            <div class="flex flex-col items-start mt-3">
              <span class="text-base font-medium">Email</span>
              <el-input v-model="account.email" type="email" />
            </div>
            <div class="flex flex-col items-start mt-3">
              <span class="text-base font-medium">Số CCCD</span>
              <el-input v-model="account.citizen_id" type="text" />
            </div>
            <div class="flex flex-col items-start mt-3">
              <span class="text-base font-medium">Giới tính</span>
              <el-radio-group v-model="account.gender">
                <el-radio :value="1" size="large">Nam</el-radio>
                <el-radio :value="2" size="large">Nữ</el-radio>
                <el-radio :value="3" size="large">Khác</el-radio>
              </el-radio-group>
            </div>
            <div class="flex flex-col items-start mt-3">
              <span class="text-base font-medium">Ngày sinh</span>
              <el-date-picker
                v-model="account.date_birth"
                type="date"
                placeholder="Chọn ngày sinh"
              />
            </div>
          </div>
        </el-col>
        <el-col :span="8">
          <div class="p-2">
            <el-tag type="primary" class="w-full">THÔNG TIN VỚI CÔNG TY</el-tag>
            <div class="flex flex-col items-start mt-5">
              <span class="text-base font-medium">Chức vụ</span>
              <el-form-item prop="role" class="w-full">
                <el-select v-model="account.role" placeholder="Chọn chức vụ">
                  <el-option
                    v-for="item in optionsRole"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
              </el-form-item>
            </div>
            <div
              class="flex flex-col items-start mt-3"
              v-if="account.role === 3 || account.role === 2"
            >
              <span class="text-base font-medium">Hạng bằng lái</span>
              <el-select
                v-model="account.license_class"
                placeholder="Chọn hạng bằng lái"
              >
                <el-option
                  v-for="item in optionsLicenseClass"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </div>
            <div
              class="flex flex-col items-start mt-3"
              v-if="account.role === 3 || account.role === 2"
            >
              <span class="text-base font-medium">Ngày hết hạn</span>
              <el-date-picker
                v-model="account.license_expiry_date"
                type="date"
                placeholder="Chọn ngày hết hạn bằng lái"
              />
            </div>
            <div class="flex flex-col items-start mt-3">
              <span class="text-base font-medium">Khu vực</span>
              <el-form-item prop="area" class="w-full">
                <el-input v-model="account.area" type="text" />
              </el-form-item>
              
            </div>
            <div class="flex flex-col items-start mt-3">
              <span class="text-base font-medium">Ghi chú</span>
              <el-form-item prop="note" class="w-full">
                <el-input v-model="account.note" type="textarea" />
              </el-form-item>
              
            </div>
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
