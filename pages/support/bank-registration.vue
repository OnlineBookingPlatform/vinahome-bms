<script setup lang="ts">
import { ElMessage, type ComponentSize, type FormInstance, type FormRules } from "element-plus";

interface RuleForm {
  accountNumber: string;
  accountHolder: string;
  phoneNumber: string;
  idNumber: string;
  bankName: string;
  branchName?: string;
}

const formSize = ref<ComponentSize>("default");
const ruleFormRef = ref<FormInstance>();
const ruleForm = reactive<RuleForm>({
  accountNumber: "",
  accountHolder: "",
  phoneNumber: "",
  idNumber: "",
  bankName: "",
  branchName: ""
});

const rules = reactive<FormRules<RuleForm>>({
  accountNumber: [
    { required: true, message: "Vui lòng nhập số tài khoản", trigger: "blur" },
    { min: 10, max: 16, message: "Số tài khoản từ 10-16 ký tự", trigger: "blur" }
  ],
  accountHolder: [
    { required: true, message: "Vui lòng nhập tên chủ tài khoản", trigger: "blur" }
  ],
  phoneNumber: [
    { required: true, message: "Vui lòng nhập số điện thoại", trigger: "blur" },
    { pattern: /(84|0[3|5|7|8|9])+([0-9]{8})\b/, message: "Số điện thoại không hợp lệ", trigger: "blur" }
  ],
  idNumber: [
    { required: true, message: "Vui lòng nhập số CCCD", trigger: "blur" },
    { min: 9, max: 12, message: "Số CCCD từ 9-12 ký tự", trigger: "blur" }
  ],
  bankName: [
    { required: true, message: "Vui lòng chọn ngân hàng", trigger: "change" }
  ]
});

const bankOptions = [
  { value: 'vietcombank', label: 'Vietcombank' },
  { value: 'agribank', label: 'Agribank' },
  { value: 'bidv', label: 'BIDV' },
  { value: 'vietinbank', label: 'VietinBank' },
  { value: 'techcombank', label: 'Techcombank' },
  { value: 'mbbank', label: 'MB Bank' },
  { value: 'acb', label: 'ACB' },
  { value: 'sacombank', label: 'Sacombank' },
  { value: 'vpbank', label: 'VPBank' },
  { value: 'shb', label: 'SHB' }
];

const submitForm = async (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  
  await formEl.validate((valid, fields) => {
    if (valid) {
      ElMessage.success('Đăng ký thành công!');
      console.log('Form data:', ruleForm);
      // Gọi API đăng ký ở đây
    } else {
      ElMessage.error('Vui lòng kiểm tra lại thông tin');
      console.log('Validation errors:', fields);
    }
  });
};

const resetForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  formEl.resetFields();
};

const generateSampleQR = () => {
  // Trong thực tế sẽ gọi API để tạo QR code từ thông tin tài khoản
  return 'https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=' + 
    encodeURIComponent(`STK: ${ruleForm.accountNumber}|TEN:${ruleForm.accountHolder}|NH:${ruleForm.bankName}`);
};
</script>

<template>
  <section class="container mx-auto px-4 py-8">
    <div class="flex flex-col items-center bg-gray-50 p-6 rounded-lg shadow-sm mb-8">
      <h3 class="text-2xl font-bold text-center text-gray-800 mb-4">
        Đăng ký tích hợp tạo Mã QR chuyển khoản
      </h3>
      <p class="text-gray-600 text-center">
        Cho tất cả các dịch vụ trên nền tảng của VinaHome
      </p>
    </div>
    
    <el-row :gutter="24">
      <el-col :xs="24" :sm="24" :md="12" :lg="12">
        <el-card shadow="hover" class="mb-4">
          <div class="p-6">
            <el-form
              ref="ruleFormRef"
              :model="ruleForm"
              :rules="rules"
              label-width="200px"
              label-position="top"
              :size="formSize"
              status-icon
            >
              <el-form-item label="Số tài khoản ngân hàng" prop="accountNumber">
                <el-input 
                  v-model="ruleForm.accountNumber" 
                  placeholder="Nhập số tài khoản"
                  clearable
                />
              </el-form-item>
              
              <el-form-item label="Tên chủ tài khoản" prop="accountHolder">
                <el-input 
                  v-model="ruleForm.accountHolder" 
                  placeholder="Nhập tên chủ tài khoản"
                  clearable
                />
              </el-form-item>
              
              <el-form-item label="Ngân hàng" prop="bankName">
                <el-select
                  v-model="ruleForm.bankName"
                  placeholder="Chọn ngân hàng"
                  class="w-full"
                  clearable
                  filterable
                >
                  <el-option
                    v-for="item in bankOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
              </el-form-item>
              
              <el-form-item label="Chi nhánh (nếu có)" prop="branchName">
                <el-input 
                  v-model="ruleForm.branchName" 
                  placeholder="Nhập chi nhánh ngân hàng"
                  clearable
                />
              </el-form-item>
              
              <el-form-item label="Số điện thoại đăng ký" prop="phoneNumber">
                <el-input 
                  v-model="ruleForm.phoneNumber" 
                  placeholder="Nhập số điện thoại"
                  clearable
                />
              </el-form-item>
              
              <el-form-item label="Số CCCD/CMND" prop="idNumber">
                <el-input 
                  v-model="ruleForm.idNumber" 
                  placeholder="Nhập số CCCD/CMND"
                  clearable
                />
              </el-form-item>
              
              <el-form-item class="mt-8">
                <el-button 
                  type="primary" 
                  @click="submitForm(ruleFormRef)"
                  class="w-full sm:w-auto mr-5"
                >
                  Đăng ký tích hợp
                </el-button>
                <el-button 
                  @click="resetForm(ruleFormRef)"
                  class="w-full sm:w-auto mt-2 sm:mt-0 sm:ml-2"
                >
                  Làm mới
                </el-button>
              </el-form-item>
            </el-form>
          </div>
        </el-card>
      </el-col>
      
      <el-col :xs="24" :sm="24" :md="12" :lg="12">
        <el-card shadow="hover">
          <div class="p-6 flex flex-col items-center">
            <h4 class="text-lg font-semibold text-gray-700 mb-4">
              Mã QR mẫu
            </h4>
            <div class="border border-dashed border-gray-300 p-4 rounded-lg mb-4">
              <img 
                :src="generateSampleQR()" 
                alt="QR Code Sample" 
                class="w-48 h-48"
                v-if="ruleForm.accountNumber"
              >
              <div v-else class="w-48 h-48 flex items-center justify-center text-gray-400">
                Nhập thông tin để xem QR code
              </div>
            </div>
            <p class="text-sm text-gray-500 text-center">
              Mã QR sẽ tự động cập nhật khi bạn nhập thông tin tài khoản
            </p>
            
            <div class="mt-6 w-full">
              <h5 class="font-medium text-gray-700 mb-2">Thông tin tài khoản:</h5>
              <div class="bg-gray-50 p-4 rounded-lg">
                <p v-if="ruleForm.accountNumber" class="text-sm">
                  <span class="font-medium">Số TK:</span> {{ ruleForm.accountNumber }}<br>
                  <span class="font-medium">Chủ TK:</span> {{ ruleForm.accountHolder }}<br>
                  <span class="font-medium">Ngân hàng:</span> 
                  {{ bankOptions.find(b => b.value === ruleForm.bankName)?.label || 'Chưa chọn' }}
                </p>
                <p v-else class="text-sm text-gray-400">
                  Chưa có thông tin tài khoản
                </p>
              </div>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </section>
</template>