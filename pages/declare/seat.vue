<script setup lang="ts">
import {
  ElMessage,
  ElMessageBox,
  type FormInstance,
  type FormRules,
} from "element-plus";
import { Plus, Delete, Edit } from "@element-plus/icons-vue";
import TitleSectionDeclare from "~/components/UI/TitleSectionDeclare.vue";
import type { SeatType, SeatMapType } from "~/types/SeatType";
import {
  createSeatMapAPI,
  deleteSeatMapAPI,
  getSeatMapByCompanyAPI,
  updateSeatMapAPI,
} from "~/api/seatAPI";
import { useAuthStore } from "~/stores/authStore";
const dialogVisible = ref(false);
const isEditMode = ref(false);
const tableData = ref<SeatMapType[]>([]);
const loading = ref<boolean>(false);
const ruleFormRef = ref<FormInstance>();
const authStore = useAuthStore();
const floorOptions = Array.from({ length: 3 }, (_, i) => ({
  label: `${i + 1} tầng`,
  value: i + 1,
}));
const rowOptions = Array.from({ length: 10 }, (_, i) => ({
  label: `${i + 1} hàng`,
  value: i + 1,
}));
const columnOptions = Array.from({ length: 9 }, (_, i) => ({
  label: `${i + 1} cột`,
  value: i + 1,
}));

const seatMap = ref<SeatMapType>({
  id: 0,
  name: "",
  total_floor: 1,
  total_column: 3,
  total_row: 1,
  seats: [],
  company_id: authStore.storeCompanyId ?? 0,
});
const rules = reactive<FormRules<SeatMapType>>({
  name: [
    { required: true, message: "Vui lòng nhập tên sơ đồ", trigger: "blur" },
  ],
});
const resetForm = () => {
  seatMap.value = {
    id: 0,
    name: "",
    total_floor: 1,
    total_column: 3,
    total_row: 1,
    seats: isEditMode.value ? seatMap.value.seats : [],
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

const generateSeats = () => {
  if (seatMap.value.seats.length > 0) return; // Nếu đã có ghế, không tạo lại

  const seats: SeatType[] = [];
  for (let floor = 1; floor <= seatMap.value.total_floor; floor++) {
    for (let row = 1; row <= seatMap.value.total_row; row++) {
      for (let column = 1; column <= seatMap.value.total_column; column++) {
        seats.push({
          id: 0,
          floor,
          row,
          column,
          code: `T${floor}-H${row}-C${column}`,
          status: false,
          name: "",
        });
      }
    }
  }
  seatMap.value.seats = seats;
};

watch(
  () => [
    seatMap.value.total_floor,
    seatMap.value.total_row,
    seatMap.value.total_column,
  ],
  () => {
    if (isEditMode.value) {
      seatMap.value.seats = generateSeatsForEdit(seatMap.value);
    } else {
      seatMap.value.seats = [];
      generateSeats();
    }
  },
  { deep: true, immediate: true }
);
const generateSeatsForEdit = (seatMapData: SeatMapType) => {
  const seats: SeatType[] = [];

  for (let floor = 1; floor <= seatMapData.total_floor; floor++) {
    for (let r = 1; r <= seatMapData.total_row; r++) {
      for (let c = 1; c <= seatMapData.total_column; c++) {
        // Tìm ghế cũ theo floor, row, column
        const existingSeat = seatMapData.seats.find(
          (s) => s.floor === floor && s.row === r && s.column === c
        );

        seats.push(
          existingSeat ?? {
            id: 0,
            floor,
            row: r,
            column: c,
            code: `T${floor}-H${r}-C${c}`,
            status: false,
            name: "",
          }
        );
      }
    }
  }
  return seats;
};

const seatLayout = computed(() => seatMap.value.seats);

const toggleSeat = (seat: SeatType) => {
  seat.status = !seat.status;
};

const updateSeatName = (seat: SeatType, event: Event) => {
  const target = event.target as HTMLInputElement;
  seat.name = target.value;
};
const handleEdit = (index: number, row: SeatMapType) => {
  isEditMode.value = true;
  seatMap.value = {
    ...row,
    seats: generateSeatsForEdit(row),
  };
  dialogVisible.value = true;
};

const handleCreate = () => {
  isEditMode.value = false;
  seatMap.value = {
    id: 0,
    name: "",
    total_floor: 1,
    total_column: 3,
    total_row: 1,
    seats: [],
    company_id: authStore.storeCompanyId ?? 0,
  };

  generateSeats(); // Tạo danh sách ghế mặc định
  dialogVisible.value = true;
};
const handleSubmit = () => {
  ruleFormRef.value?.validate(async (valid) => {
    if (valid) {
      if (isEditMode.value) {
        console.log("Updating seat map:", seatMap);
        try {
          const response = await updateSeatMapAPI(seatMap.value);
          if (response.result) {
            ElMessage.success("Cập nhật sơ đồ ghế thành công!");
            console.log("Data server:", response.result);
            const index = tableData.value.findIndex(
              (item) => item.id === response.result.id
            );
            if (index !== -1) {
              tableData.value[index] = response.result;
            } 
          } else {
            ElMessage.error(response.message || "Có lỗi xảy ra!");
            console.error(response.message);
          }
        } catch (error) {
          ElMessage.error("Không thể cập nhật sơ đồ ghế, vui lòng thử lại!");
          console.error("Error updating:", error);
        } finally {
          loading.value = false;
          dialogVisible.value = false;
          resetForm();
        }
      } else {
        console.log("Creating new seat map:", seatMap.value);
        try {
          const response = await createSeatMapAPI(seatMap.value);
          if (response.result) {
            ElMessage.success("Tạo sơ đồ ghế thành công!");
            console.log(response.result);
            tableData.value.push(response.result);
          } else {
            ElMessage.error(response.message || "Có lỗi xảy ra!");
            console.error(response.message);
          }
        } catch (error) {
          ElMessage.error("Không thể tạo sơ đồ ghế, vui lòng thử lại!");
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

const handleDelete = (index: number, row: SeatMapType) => {
  ElMessageBox.confirm(
    `Bạn có chắc chắn muốn xóa "${row.name}" không?`,
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
        await deleteSeatMapAPI(row.id);
        ElMessage.success("Xóa sơ đồ thành công!");

        tableData.value.splice(index, 1);
      } catch (error) {
        ElMessage.error("Không thể xóa sơ đồ, vui lòng thử lại!");
      } finally {
        loading.value = false;
      }
    })
    .catch(() => {
      ElMessage.info("Đã hủy xóa sơ đồ.");
    });
};
const fetchSeatMapByCompanyAPI = async () => {
  loading.value = true;
  try {
    const response = await getSeatMapByCompanyAPI(
      authStore.storeCompanyId ?? 0
    );
    if (response.result) {
      tableData.value = response.result;
    } else {
      ElMessage.error(response.message || "Có lỗi xảy ra!");
      console.error(response.message);
    }
  } catch (error) {
    ElMessage.error("Không thể lấy danh sách sơ đồ ghế, vui lòng thử lại!");
    console.error("Error fetching seat maps:", error);
  } finally {
    loading.value = false;
  }
};
onMounted(fetchSeatMapByCompanyAPI);
</script>
<template>
  <section class="px-4 py-4 flex justify-between items-center">
    <TitleSectionDeclare title="SƠ ĐỒ GHẾ" />
    <el-button type="primary" @click="handleCreate" :icon="Plus">
      Thêm sơ đồ ghế
    </el-button>
  </section>
  <section class="px-4">
    <el-table :data="tableData" stripe style="width: 100%" v-loading="loading">
      <el-table-column type="index" label="STT" width="50" />
      <el-table-column prop="name" label="Tên sơ đồ" />
      <el-table-column prop="total_floor" label="Loại xe">
        <template #default="scope">
          <span>{{ scope.row.total_floor }} tầng</span>
        </template>
      </el-table-column>

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
    title="Thêm sơ đồ ghế"
    width="1000"
    :before-close="handleClose"
  >
    <div>
      <el-form :model="seatMap" :rules="rules" ref="ruleFormRef">
        <el-row :gutter="20">
          <el-col :span="9">
            <span>Tên sơ đồ</span>
            <el-form-item prop="name" class="w-full">
              <el-input v-model="seatMap.name" placeholder="Nhập tên sơ đồ" />
            </el-form-item>
          </el-col>
          <el-col :span="5">
            <span>Số tầng</span>
            <el-select v-model="seatMap.total_floor" placeholder="Chọn số tầng">
              <el-option
                v-for="item in floorOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-col>
          <el-col :span="5">
            <span>Số cột</span>
            <el-select v-model="seatMap.total_column" placeholder="Chọn số cột">
              <el-option
                v-for="item in columnOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-col>
          <el-col :span="5">
            <span>Số hàng</span>
            <el-select v-model="seatMap.total_row" placeholder="Chọn số hàng">
              <el-option
                v-for="item in rowOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-col>
        </el-row>
      </el-form>
    </div>

    <div>
      <h2 class="mt-4 text-lg font-bold text-center">Hiển thị sơ đồ ghế</h2>
      <div v-for="floor in seatMap.total_floor" :key="floor" class="mb-4">
        <h3 class="font-semibold text-blue-600 text-center">
          Tầng {{ floor }}
        </h3>
        <div
          class="grid gap-2 justify-center"
          :style="{
            gridTemplateColumns: `repeat(${seatMap.total_column}, minmax(100px, 1fr))`,
          }"
        >
          <div
            v-for="seat in seatLayout.filter((s) => s.floor === floor)"
            :key="seat.code"
            @click="toggleSeat(seat)"
            class="border border-gray-300 p-2 flex flex-col items-center justify-center cursor-pointer"
            :class="{
              'bg-green-400 text-white': seat.status,
              'bg-gray-100': !seat.status,
            }"
          >
            <span class="text-sm">{{ seat.code }}</span>
            <input
              :value="seat.name"
              type="text"
              placeholder="Nhập tên ghế"
              class="w-full px-1 mt-1 text-center border rounded text-black"
              @click.stop
              @input="updateSeatName(seat, $event)"
            />
            <el-switch v-model="seat.status" @click.stop />
          </div>
        </div>
      </div>
    </div>

    <template #footer>
      <div class="dialog-footer">
        <el-button @click="dialogVisible = false">Thoát</el-button>
        <el-button type="primary" @click="handleSubmit" :loading="loading"
          >Lưu</el-button
        >
      </div>
    </template>
  </el-dialog>
</template>
