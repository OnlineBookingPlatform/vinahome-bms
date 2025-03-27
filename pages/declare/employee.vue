<script setup lang="ts">
import { Plus } from "@element-plus/icons-vue";
import { ElMessage, ElMessageBox, type FormInstance, type FormRules } from "element-plus";
import { createAccountAPI } from "~/api/employeeAPI";
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
const dialogVisible = ref(false);
const ruleFormRef = ref<FormInstance>();
const isEditMode = ref(false);
const account = reactive<AccountType>({
  _id: null,
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
  license_class: null,
  license_expiry_date: null,
  area: null,
  company_id: 41,
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
      if (isEditMode.value) {
        // Chế độ sửa
        console.log("Edit")
      } else {
        // Chế độ thêm
        console.log("Add")

        try {
          const response = await createAccountAPI(account);
          if (response.result) {
            ElMessage.success("Tạo tài khoản thành công!");
            console.log(response.result)
            // resetForm(); // Reset form sau khi tạo thành công
          } else {
            ElMessage.error(response.message || "Có lỗi xảy ra!");
          }
        } catch (error) {
          ElMessage.error("Không thể tạo tài khoản, vui lòng thử lại!");
        }
      }
    } else {
      ElMessage.error("Vui lòng kiểm tra lại thông tin!");
    }
  });
};


const resetForm = () => {
  Object.assign(account, {
    id: 0,
    username: "",
    password: "",
    status: false,
    name: "",
    phone: "",
    email: "",
    date_birth: null,
    citizen_id: "",
    gender: 0,
    role: null,
    license_class: null,
    license_expiry_date: null,
    area: "",
    company_id: 41,
  });
};





watch(() => account.role, (newRole) => {
  if (newRole === 4 || newRole === 5) {
    account.license_class = null; 
    account.license_expiry_date = null;
  }
});

</script>
<template>
  <section class="px-4 py-4 flex justify-between items-center">
    <TitleSectionDeclare title="DANH SÁCH NHÂN VIÊN" />
    <el-button type="primary" @click="dialogVisible = true" :icon="Plus">
      Thêm nhân viên
    </el-button>
  </section>
  <el-dialog v-model="dialogVisible" title="Thêm nhân viên" width="1000" :before-close="handleClose">
    <el-form :model="account" :rules="rules" ref="ruleFormRef">
      <el-row>
        <el-col :span="8">
          <div class="p-2">
            <el-tag type="primary" class="w-full">THÔNG TIN TÀI KHOẢN</el-tag>
            <div class="flex flex-col items-start mt-5">
              <span class="text-base font-medium">Tài khoản</span>
              <el-form-item prop="username" class="w-full">
                <el-input v-model="account.username" placeholder="Nhập tên tài khoản" type="text" />
              </el-form-item>
            </div>
            <div class="flex flex-col items-start mt-3">
              <span class="text-base font-medium">Mật khẩu</span>
              <el-form-item prop="password" class="w-full">
                <el-input v-model="account.password" placeholder="Nhập mật khẩu" type="password" />
              </el-form-item>
            </div>
            <div class="flex flex-col items-start mt-3">
              <span class="text-base font-medium">Trạng thái</span>
              <el-switch v-model="account.status" size="large" active-text="Kích hoạt"
                inactive-text="Ngưng kích hoạt" />
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
              <el-date-picker v-model="account.date_birth" type="date" placeholder="Chọn ngày sinh" />
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
                  <el-option v-for="item in optionsRole" :key="item.value" :label="item.label" :value="item.value" />
                </el-select>
              </el-form-item>
            </div>
            <div class="flex flex-col items-start mt-3" v-if="account.role === 3 || account.role === 2">
              <span class="text-base font-medium">Hạng bằng lái</span>
              <el-select v-model="account.license_class" placeholder="Chọn hạng bằng lái">
                <el-option v-for="item in optionsLicenseClass" :key="item.value" :label="item.label"
                  :value="item.value" />
              </el-select>
            </div>
            <div class="flex flex-col items-start mt-3" v-if="account.role === 3 || account.role === 2">
              <span class="text-base font-medium">Ngày hết hạn</span>
              <el-date-picker v-model="account.license_expiry_date" type="date"
                placeholder="Chọn ngày hết hạn bằng lái" />
            </div>
            <div class="flex flex-col items-start mt-3">
              <span class="text-base font-medium">Khu vực</span>
              <el-input v-model="account.area" type="text" />
            </div>
          </div>
        </el-col>
      </el-row>


    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button type="danger" @click="dialogVisible = false">Xóa</el-button>
        <el-button @click="handleClose">Thoát</el-button>
        <el-button type="primary" @click="handleSubmit">
          Lưu
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>
