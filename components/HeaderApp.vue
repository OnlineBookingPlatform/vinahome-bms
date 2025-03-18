<script setup lang="ts">
import { CaretBottom } from "@element-plus/icons-vue";
</script>
<template>
  <header class="bg-[#0072bc] p-2">
    <nav>
      <ul class="flex space-x-6">
        <li>
          <el-dropdown>
            <span
              class="el-dropdown-link text-white text-base flex items-center"
            >
              Hành khách
              <el-icon class="el-icon--right"><CaretBottom /></el-icon>
            </span>

            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item>
                  <span class="text-base">Vé hành khách</span>
                </el-dropdown-item>
                <el-dropdown-item>Action 2</el-dropdown-item>
                <el-dropdown-item>Action 3</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </li>
        <li>
          <el-dropdown>
            <span
              class="el-dropdown-link text-white text-base flex items-center"
            >
              Hàng hóa
              <el-icon class="el-icon--right"><CaretBottom /></el-icon>
            </span>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item>
                  <span class="text-md">Vé hành khách</span>
                </el-dropdown-item>
                <el-dropdown-item>Action 2</el-dropdown-item>
                <el-dropdown-item>Action 3</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </li>
        <li>
          <el-dropdown>
            <span
              class="el-dropdown-link text-white text-base flex items-center"
            >
                Khai báo
              <el-icon class="el-icon--right"><CaretBottom /></el-icon>
            </span>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item>
                  <span class="text-base">Nhân viên</span>
                </el-dropdown-item>
                <el-dropdown-item>
                    <span class="text-base">Văn phòng</span>
                </el-dropdown-item>
                <el-dropdown-item>Action 3</el-dropdown-item>
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

/* .el-dropdown:focus,
.el-dropdown:hover {
  outline: none !important;
  border: none !important;
  box-shadow: none !important;
} */
</style>
