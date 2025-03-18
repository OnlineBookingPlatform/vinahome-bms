<script setup lang="ts">
import type { FormInstance, FormRules } from "element-plus";
import type { AuthType } from "@/types/AuthType";
const ruleFormRef = ref<FormInstance>();
const form = reactive<AuthType>({
  username: "",
  password: "",
});
const rules = reactive<FormRules<AuthType>>({
  username: [
    { required: true, message: "Vui lòng nhập tài khoản", trigger: "blur" },
    { min: 3, max: 50, message: "Tài khoản không hợp lệ", trigger: "blur" },
  ],
  password: [
    { required: true, message: "Vui lòng nhập mật khẩu", trigger: "blur" },
    { min: 3, max: 50, message: "Mật khẩu không hợp lệ", trigger: "blur" },
  ],
});
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
