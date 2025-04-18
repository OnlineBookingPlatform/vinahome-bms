<script setup lang="ts">
import { CaretBottom, FolderChecked } from "@element-plus/icons-vue";
import { ElMessage } from "element-plus";
import { useAuthStore } from "~/stores/authStore";
import { useOfficeStore } from "~/stores/officeStore";
import { useRouter } from "vue-router";

const menuItems = [
  {
    label: "Hành khách",
    icon: {
      viewBox: "0 0 576 512",
      path: "M64 64C28.7 64 0 92.7 0 128l0 64c0 8.8 7.4 15.7 15.7 18.6C34.5 217.1 48 235 48 256s-13.5 38.9-32.3 45.4C7.4 304.3 0 311.2 0 320l0 64c0 35.3 28.7 64 64 64l448 0c35.3 0 64-28.7 64-64l0-64c0-8.8-7.4-15.7-15.7-18.6C541.5 294.9 528 277 528 256s13.5-38.9 32.3-45.4c8.3-2.9 15.7-9.8 15.7-18.6l0-64c0-35.3-28.7-64-64-64L64 64zm64 112l0 160c0 8.8 7.2 16 16 16l288 0c8.8 0 16-7.2 16-16l0-160c0-8.8-7.2-16-16-16l-288 0c-8.8 0-16 7.2-16 16zM96 160c0-17.7 14.3-32 32-32l320 0c17.7 0 32 14.3 32 32l0 192c0 17.7-14.3 32-32 32l-320 0c-17.7 0-32-14.3-32-32l0-192z",
    },
    items: [
      { label: "Vé hành khách", path: "/ticket" },
      { label: "Hành khách 2", path: "/passenger/2" },
    ],
  },
  {
    label: "Hàng hóa",
    icon: {
      viewBox: "0 0 640 512",
      path: "M58.9 42.1c3-6.1 9.6-9.6 16.3-8.7L320 64 564.8 33.4c6.7-.8 13.3 2.7 16.3 8.7l41.7 83.4c9 17.9-.6 39.6-19.8 45.1L439.6 217.3c-13.9 4-28.8-1.9-36.2-14.3L320 64 236.6 203c-7.4 12.4-22.3 18.3-36.2 14.3L37.1 170.6c-19.3-5.5-28.8-27.2-19.8-45.1L58.9 42.1zM321.1 128l54.9 91.4c14.9 24.8 44.6 36.6 72.5 28.6L576 211.6l0 167c0 22-15 41.2-36.4 46.6l-204.1 51c-10.2 2.6-20.9 2.6-31 0l-204.1-51C79 419.7 64 400.5 64 378.5l0-167L191.6 248c27.8 8 57.6-3.8 72.5-28.6L318.9 128l2.2 0z",
    },
    items: [
      { label: "Phiếu hàng hóa", path: "/goods" },
      { label: "Hàng hóa 2", path: "/goods/2" },
    ],
  },
  {
    label: "Điều hành",
    icon: {
      viewBox: "0 0 640 512",
      path: "M384 96l0 224L64 320 64 96l320 0zM64 32C28.7 32 0 60.7 0 96L0 320c0 35.3 28.7 64 64 64l117.3 0-10.7 32L96 416c-17.7 0-32 14.3-32 32s14.3 32 32 32l256 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-74.7 0-10.7-32L384 384c35.3 0 64-28.7 64-64l0-224c0-35.3-28.7-64-64-64L64 32zm464 0c-26.5 0-48 21.5-48 48l0 352c0 26.5 21.5 48 48 48l64 0c26.5 0 48-21.5 48-48l0-352c0-26.5-21.5-48-48-48l-64 0zm16 64l32 0c8.8 0 16 7.2 16 16s-7.2 16-16 16l-32 0c-8.8 0-16-7.2-16-16s7.2-16 16-16zm-16 80c0-8.8 7.2-16 16-16l32 0c8.8 0 16 7.2 16 16s-7.2 16-16 16l-32 0c-8.8 0-16-7.2-16-16zm32 160a32 32 0 1 1 0 64 32 32 0 1 1 0-64z",
    },
    items: [{ label: "Nhân viên", path: "/declare/employee" }],
  },

  {
    label: "Quản lý",
    icon: {
      viewBox: "0 0 640 512",
      path: "M256 64l128 0 0 64-128 0 0-64zM240 0c-26.5 0-48 21.5-48 48l0 96c0 26.5 21.5 48 48 48l48 0 0 32L32 224c-17.7 0-32 14.3-32 32s14.3 32 32 32l96 0 0 32-48 0c-26.5 0-48 21.5-48 48l0 96c0 26.5 21.5 48 48 48l160 0c26.5 0 48-21.5 48-48l0-96c0-26.5-21.5-48-48-48l-48 0 0-32 256 0 0 32-48 0c-26.5 0-48 21.5-48 48l0 96c0 26.5 21.5 48 48 48l160 0c26.5 0 48-21.5 48-48l0-96c0-26.5-21.5-48-48-48l-48 0 0-32 96 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-256 0 0-32 48 0c26.5 0 48-21.5 48-48l0-96c0-26.5-21.5-48-48-48L240 0zM96 448l0-64 128 0 0 64L96 448zm320-64l128 0 0 64-128 0 0-64z",
    },
    items: [{ label: "Nhân viên", path: "/declare/employee" }],
  },
  {
    label: "Hệ thống",
    icon: {
      viewBox: "0 0 640 512",
      path: "M308.5 135.3c7.1-6.3 9.9-16.2 6.2-25c-2.3-5.3-4.8-10.5-7.6-15.5L304 89.4c-3-5-6.3-9.9-9.8-14.6c-5.7-7.6-15.7-10.1-24.7-7.1l-28.2 9.3c-10.7-8.8-23-16-36.2-20.9L199 27.1c-1.9-9.3-9.1-16.7-18.5-17.8C173.9 8.4 167.2 8 160.4 8l-.7 0c-6.8 0-13.5 .4-20.1 1.2c-9.4 1.1-16.6 8.6-18.5 17.8L115 56.1c-13.3 5-25.5 12.1-36.2 20.9L50.5 67.8c-9-3-19-.5-24.7 7.1c-3.5 4.7-6.8 9.6-9.9 14.6l-3 5.3c-2.8 5-5.3 10.2-7.6 15.6c-3.7 8.7-.9 18.6 6.2 25l22.2 19.8C32.6 161.9 32 168.9 32 176s.6 14.1 1.7 20.9L11.5 216.7c-7.1 6.3-9.9 16.2-6.2 25c2.3 5.3 4.8 10.5 7.6 15.6l3 5.2c3 5.1 6.3 9.9 9.9 14.6c5.7 7.6 15.7 10.1 24.7 7.1l28.2-9.3c10.7 8.8 23 16 36.2 20.9l6.1 29.1c1.9 9.3 9.1 16.7 18.5 17.8c6.7 .8 13.5 1.2 20.4 1.2s13.7-.4 20.4-1.2c9.4-1.1 16.6-8.6 18.5-17.8l6.1-29.1c13.3-5 25.5-12.1 36.2-20.9l28.2 9.3c9 3 19 .5 24.7-7.1c3.5-4.7 6.8-9.5 9.8-14.6l3.1-5.4c2.8-5 5.3-10.2 7.6-15.5c3.7-8.7 .9-18.6-6.2-25l-22.2-19.8c1.1-6.8 1.7-13.8 1.7-20.9s-.6-14.1-1.7-20.9l22.2-19.8zM112 176a48 48 0 1 1 96 0 48 48 0 1 1 -96 0zM504.7 500.5c6.3 7.1 16.2 9.9 25 6.2c5.3-2.3 10.5-4.8 15.5-7.6l5.4-3.1c5-3 9.9-6.3 14.6-9.8c7.6-5.7 10.1-15.7 7.1-24.7l-9.3-28.2c8.8-10.7 16-23 20.9-36.2l29.1-6.1c9.3-1.9 16.7-9.1 17.8-18.5c.8-6.7 1.2-13.5 1.2-20.4s-.4-13.7-1.2-20.4c-1.1-9.4-8.6-16.6-17.8-18.5L583.9 307c-5-13.3-12.1-25.5-20.9-36.2l9.3-28.2c3-9 .5-19-7.1-24.7c-4.7-3.5-9.6-6.8-14.6-9.9l-5.3-3c-5-2.8-10.2-5.3-15.6-7.6c-8.7-3.7-18.6-.9-25 6.2l-19.8 22.2c-6.8-1.1-13.8-1.7-20.9-1.7s-14.1 .6-20.9 1.7l-19.8-22.2c-6.3-7.1-16.2-9.9-25-6.2c-5.3 2.3-10.5 4.8-15.6 7.6l-5.2 3c-5.1 3-9.9 6.3-14.6 9.9c-7.6 5.7-10.1 15.7-7.1 24.7l9.3 28.2c-8.8 10.7-16 23-20.9 36.2L315.1 313c-9.3 1.9-16.7 9.1-17.8 18.5c-.8 6.7-1.2 13.5-1.2 20.4s.4 13.7 1.2 20.4c1.1 9.4 8.6 16.6 17.8 18.5l29.1 6.1c5 13.3 12.1 25.5 20.9 36.2l-9.3 28.2c-3 9-.5 19 7.1 24.7c4.7 3.5 9.5 6.8 14.6 9.8l5.4 3.1c5 2.8 10.2 5.3 15.5 7.6c8.7 3.7 18.6 .9 25-6.2l19.8-22.2c6.8 1.1 13.8 1.7 20.9 1.7s14.1-.6 20.9-1.7l19.8 22.2zM464 304a48 48 0 1 1 0 96 48 48 0 1 1 0-96z",
    },
    items: [{ label: "Nhân viên", path: "/declare/employee" }],
  },
  {
    label: "Khai báo",
    icon: {
      viewBox: "0 0 512 512",
      path: "M40 48C26.7 48 16 58.7 16 72l0 48c0 13.3 10.7 24 24 24l48 0c13.3 0 24-10.7 24-24l0-48c0-13.3-10.7-24-24-24L40 48zM192 64c-17.7 0-32 14.3-32 32s14.3 32 32 32l288 0c17.7 0 32-14.3 32-32s-14.3-32-32-32L192 64zm0 160c-17.7 0-32 14.3-32 32s14.3 32 32 32l288 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-288 0zm0 160c-17.7 0-32 14.3-32 32s14.3 32 32 32l288 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-288 0zM16 232l0 48c0 13.3 10.7 24 24 24l48 0c13.3 0 24-10.7 24-24l0-48c0-13.3-10.7-24-24-24l-48 0c-13.3 0-24 10.7-24 24zM40 368c-13.3 0-24 10.7-24 24l0 48c0 13.3 10.7 24 24 24l48 0c13.3 0 24-10.7 24-24l0-48c0-13.3-10.7-24-24-24l-48 0z",
    },
    items: [
      { label: "Nhân viên", path: "/declare/employee" },
      { label: "Văn phòng", path: "/declare/office" },
      { label: "Phương tiện", path: "/declare/vehicle" },
      { label: "Sơ đồ ghế", path: "/declare/seat" },
      { label: "Lịch chạy", path: "/declare/schedule" },
      { label: "Tuyến", path: "/declare/route" },
      { label: "Điểm dừng", path: "/declare/point" },
      { label: "Đại lý", path: "/declare/agency" },
    ],
  },
  {
    label: "CSKH",
    icon: {
      viewBox: "0 0 512 512",
      path: "M256 48C141.1 48 48 141.1 48 256l0 40c0 13.3-10.7 24-24 24s-24-10.7-24-24l0-40C0 114.6 114.6 0 256 0S512 114.6 512 256l0 144.1c0 48.6-39.4 88-88.1 88L313.6 488c-8.3 14.3-23.8 24-41.6 24l-32 0c-26.5 0-48-21.5-48-48s21.5-48 48-48l32 0c17.8 0 33.3 9.7 41.6 24l110.4 .1c22.1 0 40-17.9 40-40L464 256c0-114.9-93.1-208-208-208zM144 208l16 0c17.7 0 32 14.3 32 32l0 112c0 17.7-14.3 32-32 32l-16 0c-35.3 0-64-28.7-64-64l0-48c0-35.3 28.7-64 64-64zm224 0c35.3 0 64 28.7 64 64l0 48c0 35.3-28.7 64-64 64l-16 0c-17.7 0-32-14.3-32-32l0-112c0-17.7 14.3-32 32-32l16 0z",
    },
    items: [{ label: "Đăng ký VietQR", path: "/support/bank-registration" }],
  },
];
const authStore = useAuthStore();
const officeStore = useOfficeStore();
const nameUser = ref("");
const router = useRouter();


watchEffect(() => {
  if (authStore.user?.name) {
    nameUser.value = authStore.user.name;
  }
});
const logout = async () => {
  try {
    await authStore.logout();
    officeStore.resetOffice();
    router.push("/");
    ElMessage.success("Đăng xuất thành công!");
  } catch (error) {
    ElMessage.error("Có lỗi xảy ra khi đăng xuất.");
    console.error(error);
  }
};
</script>
<template>
  <header class="bg-[#0072bc] p-2">
    <nav class="flex items-center justify-between">
      <ul class="flex space-x-6">
        <li class="flex items-center ml-2">
          <NuxtLink to="/dashboard">
            <span class="text-white text-base flex items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 576 512"
                width="17"
                height="17"
                fill="currentColor"
                class="mb-[2px]"
              >
                <path
                  d="M575.8 255.5c0 18-15 32.1-32 32.1l-32 0 .7 160.2c0 2.7-.2 5.4-.5 8.1l0 16.2c0 22.1-17.9 40-40 40l-16 0c-1.1 0-2.2 0-3.3-.1c-1.4 .1-2.8 .1-4.2 .1L416 512l-24 0c-22.1 0-40-17.9-40-40l0-24 0-64c0-17.7-14.3-32-32-32l-64 0c-17.7 0-32 14.3-32 32l0 64 0 24c0 22.1-17.9 40-40 40l-24 0-31.9 0c-1.5 0-3-.1-4.5-.2c-1.2 .1-2.4 .2-3.6 .2l-16 0c-22.1 0-40-17.9-40-40l0-112c0-.9 0-1.9 .1-2.8l0-69.7-32 0c-18 0-32-14-32-32.1c0-9 3-17 10-24L266.4 8c7-7 15-8 22-8s15 2 21 7L564.8 231.5c8 7 12 15 11 24z"
                />
              </svg>
            </span>
          </NuxtLink>
        </li>
        <li v-for="(menu, index) in menuItems" :key="index">
          <el-dropdown>
            <span
              class="el-dropdown-link text-white text-base flex items-center"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                :viewBox="menu.icon.viewBox"
                width="17"
                height="17"
                fill="currentColor"
                class="mb-[1px]"
              >
                <path :d="menu.icon.path" />
              </svg>
              <span class="ml-1">{{ menu.label }}</span>
              <el-icon class="el-icon--right"><CaretBottom /></el-icon>
            </span>
            <template #dropdown>
              <el-dropdown-menu>
                <template
                  v-for="(item, subIndex) in menu.items"
                  :key="subIndex"
                >
                  <NuxtLink v-if="item.path" :to="item.path">
                    <el-dropdown-item>
                      <span class="text-base mx-2">{{ item.label }}</span>
                    </el-dropdown-item>
                  </NuxtLink>
                </template>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </li>
      </ul>
      <ul class="flex space-x-6">
        <li>
          <span class="text-white text-base flex items-center mr-5"
            >{{ nameUser }}</span
          >
        </li>
        <li>
          <el-dropdown trigger="click">
            <span
              class="el-dropdown-link text-white text-base flex items-center p-[1px]"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 512 512"
                width="17"
                height="17"
                fill="currentColor"
                class="mt-[2px]"
              >
                <path
                  d="M416 208c0 45.9-14.9 88.3-40 122.7L502.6 457.4c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L330.7 376c-34.4 25.2-76.8 40-122.7 40C93.1 416 0 322.9 0 208S93.1 0 208 0S416 93.1 416 208zM208 352a144 144 0 1 0 0-288 144 144 0 1 0 0 288z"
                />
              </svg>
            </span>
            <template #dropdown>
              <div class="px-2 py-1">
                <el-input style="width: 500px" placeholder="Tìm kiếm vé" />
              </div>
            </template>
          </el-dropdown>
        </li>
        <li>
          <el-dropdown>
            <span
              class="el-dropdown-link text-white text-base flex items-center p-[1px]"
            >
              <el-badge :value="0" class="item">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 448 512"
                  width="17"
                  height="17"
                  fill="currentColor"
                  class="mt-[2px]"
                >
                  <path
                    d="M224 0c-17.7 0-32 14.3-32 32l0 19.2C119 66 64 130.6 64 208l0 18.8c0 47-17.3 92.4-48.5 127.6l-7.4 8.3c-8.4 9.4-10.4 22.9-5.3 34.4S19.4 416 32 416l384 0c12.6 0 24-7.4 29.2-18.9s3.1-25-5.3-34.4l-7.4-8.3C401.3 319.2 384 273.9 384 226.8l0-18.8c0-77.4-55-142-128-156.8L256 32c0-17.7-14.3-32-32-32zm45.3 493.3c12-12 18.7-28.3 18.7-45.3l-64 0-64 0c0 17 6.7 33.3 18.7 45.3s28.3 18.7 45.3 18.7s33.3-6.7 45.3-18.7z"
                  />
                </svg>
              </el-badge>
            </span>
            <template #dropdown>
              <div class="w-[300px] p-2">
                <el-tabs class="demo-tabs">
                  <el-tab-pane label="Vé Online" name="first"
                    >Vé online</el-tab-pane
                  >
                  <el-tab-pane label="Vé Đại lý" name="second"
                    >Vé đại lý</el-tab-pane
                  >
                </el-tabs>
              </div>
            </template>
          </el-dropdown>
        </li>
        <li>
          <el-dropdown>
            <span
              class="el-dropdown-link text-white text-base flex items-center p-[1px]"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 576 512"
                width="17"
                height="17"
                fill="currentColor"
                class="mt-[2px]"
              >
                <path
                  d="M64 0C28.7 0 0 28.7 0 64L0 352c0 35.3 28.7 64 64 64l176 0-10.7 32L160 448c-17.7 0-32 14.3-32 32s14.3 32 32 32l256 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-69.3 0L336 416l176 0c35.3 0 64-28.7 64-64l0-288c0-35.3-28.7-64-64-64L64 0zM512 64l0 224L64 288 64 64l448 0z"
                />
              </svg>
            </span>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item>
                  <span class="text-base mx-2"
                    >Hỗ trợ kỹ thuật: 0877 71 7575</span
                  >
                </el-dropdown-item>
                <NuxtLink
                  to="https://remotedesktop.google.com/support?pli=1"
                  target="_blank"
                >
                  <el-dropdown-item>
                    <span class="text-base mx-2">Điều khiển từ xa</span>
                  </el-dropdown-item>
                </NuxtLink>
                <el-dropdown-item>
                  <span class="text-base mx-2">Gửi phản hồi cho VinaHome</span>
                </el-dropdown-item>
                <el-dropdown-item>
                  <span class="text-base mx-2">Lịch sử phản hồi</span>
                </el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </li>
        <li>
          <el-dropdown>
            <span
              class="el-dropdown-link text-white text-base flex items-center p-[1px]"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 448 512"
                width="17"
                height="17"
                fill="currentColor"
                class="mt-[2px]"
              >
                <path
                  d="M224 256A128 128 0 1 0 224 0a128 128 0 1 0 0 256zm-45.7 48C79.8 304 0 383.8 0 482.3C0 498.7 13.3 512 29.7 512l388.6 0c16.4 0 29.7-13.3 29.7-29.7C448 383.8 368.2 304 269.7 304l-91.4 0z"
                />
              </svg>
            </span>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 448 512"
                    width="17"
                    height="17"
                    fill="currentColor"
                    class="mb-[3px]"
                  >
                    <path
                      d="M144 144l0 48 160 0 0-48c0-44.2-35.8-80-80-80s-80 35.8-80 80zM80 192l0-48C80 64.5 144.5 0 224 0s144 64.5 144 144l0 48 16 0c35.3 0 64 28.7 64 64l0 192c0 35.3-28.7 64-64 64L64 512c-35.3 0-64-28.7-64-64L0 256c0-35.3 28.7-64 64-64l16 0z"
                    />
                  </svg>
                  <span class="text-base mx-2">Đổi mật khẩu</span>
                </el-dropdown-item>
                <el-dropdown-item @click="logout">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 512 512"
                    width="17"
                    height="17"
                    fill="currentColor"
                    class="mb-[1px]"
                  >
                    <path
                      d="M377.9 105.9L500.7 228.7c7.2 7.2 11.3 17.1 11.3 27.3s-4.1 20.1-11.3 27.3L377.9 406.1c-6.4 6.4-15 9.9-24 9.9c-18.7 0-33.9-15.2-33.9-33.9l0-62.1-128 0c-17.7 0-32-14.3-32-32l0-64c0-17.7 14.3-32 32-32l128 0 0-62.1c0-18.7 15.2-33.9 33.9-33.9c9 0 17.6 3.6 24 9.9zM160 96L96 96c-17.7 0-32 14.3-32 32l0 256c0 17.7 14.3 32 32 32l64 0c17.7 0 32 14.3 32 32s-14.3 32-32 32l-64 0c-53 0-96-43-96-96L0 128C0 75 43 32 96 32l64 0c17.7 0 32 14.3 32 32s-14.3 32-32 32z"
                    />
                  </svg>
                  <span class="text-base mx-2">Đăng xuất</span>
                </el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </li>
      </ul>
    </nav>
  </header>
</template>
<style>
.el-dropdown-link {
  outline: none !important;
  border: none !important;
  box-shadow: none !important;
}

.el-header {
  height: 40px !important;
}
</style>
