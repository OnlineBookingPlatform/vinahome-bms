<script setup lang="ts">
import { ElMessage, type FormInstance, type FormRules } from "element-plus";
import type { AuthStoreType, LoginType } from "@/types/AuthType";
import { bmsLoginAPI } from "../api/authAPI";
import { useAuthStore } from "~/stores/authStore";
import { useRouter } from 'vue-router';
const authStore = useAuthStore();
const router = useRouter();
const ruleFormRef = ref<FormInstance>();
const form = reactive<LoginType>({
  username: "",
  password: "",
});
const rules = reactive<FormRules<LoginType>>({
  username: [
    { required: true, message: "Vui lòng nhập tài khoản", trigger: "blur" },
    { min: 3, max: 50, message: "Tài khoản không hợp lệ", trigger: "blur" },
  ],
  password: [
    { required: true, message: "Vui lòng nhập mật khẩu", trigger: "blur" },
    { min: 3, max: 50, message: "Mật khẩu không hợp lệ", trigger: "blur" },
  ],
});
const onSubmit = async (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  try {
    await formEl.validate();
    console.log("Form Login:", form);
    const response = await bmsLoginAPI(form);
    if (response.status !== 200) {
      ElMessage.error("Đăng nhập thất bại! Vui lòng thử lại.");
      return;
    }
    ElMessage.success("Đăng nhập thành công!");
    console.log("Login Success:", response);
    const userData: AuthStoreType = response.result;
    authStore.setUser(userData);
    console.log("User stored in Pinia:", authStore.user);
    router.push('/room-work');
  } catch (error: any) {
    console.error("Login Failed:", error);
    if (error.password && Array.isArray(error.password)) {
      ElMessage.error(error.password[0].message);
    } else if (error.message) {
      ElMessage.error(error.message);
    } else {
      ElMessage.error("Đăng nhập thất bại! Vui lòng thử lại.");
    }
  }
};


</script>
<template>
  <el-form
    ref="ruleFormRef"
    :rules="rules"
    :model="form"
    label-width="auto"
    label-position="top"
  >
    <el-form-item prop="username">
      <span class="text-black font-semibold">Tài khoản</span>
      <el-input v-model="form.username" size="large" />
    </el-form-item>
    <el-form-item prop="password">
      <span class="text-black font-semibold">Mật khẩu</span>
      <el-input v-model="form.password" type="password" size="large" />
    </el-form-item>
    <el-form-item class="mt-10">
      <el-button
        type="primary"
        @click="onSubmit(ruleFormRef)"
        class="w-full"
        size="large"
        >Đăng nhập</el-button
      >
    </el-form-item>
  </el-form>
</template>
