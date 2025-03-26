<script setup lang="ts">
import { ElMessage, ElMessageBox } from "element-plus";
import { Plus } from "@element-plus/icons-vue";
import TitleSectionDeclare from "~/components/UI/TitleSectionDeclare.vue";
import type { Seat, SeatMap } from "~/types/SeatType";
import { createSeatMap } from "~/api/seatAPI";
const dialogVisible = ref(false);

const handleClose = (done: () => void) => {
  ElMessageBox.confirm("Bạn có chắc chắn muốn đóng không?")
    .then(() => {
      done();
    })
    .catch(() => {
      // catch error
    });
};
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

const seatMap = reactive<SeatMap>({
  id: 0,
  name: "",
  total_floor: 1,
  total_column: 3,
  total_row: 1,
  seats: [],
});

const generateSeats = () => {
  const seats: Seat[] = [];
  let seatId = 1;
  for (let floor = 1; floor <= seatMap.total_floor; floor++) {
    for (let row = 1; row <= seatMap.total_row; row++) {
      for (let column = 1; column <= seatMap.total_column; column++) {
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
  seatMap.seats = seats;
};

const seatLayout = computed(() => {
  generateSeats();
  return seatMap.seats;
});

const toggleSeat = (seat: Seat) => {
  seat.status = !seat.status;
};

const updateSeatName = (seat: Seat, event: Event) => {
  const target = event.target as HTMLInputElement;
  seat.name = target.value;
};
const saveSeatMap = async () => {
  try {
    console.log("Sơ đồ ghế:", seatMap);
    const response = await createSeatMap(seatMap);
    console.log("Sơ đồ ghế đã lưu:", response);
    ElMessage.success("Lưu sơ đồ ghế thành công!");
    dialogVisible.value = false;
  } catch (error) {
    console.error("Error:", error);
    ElMessage.error("Lưu thất bại!");
  }
};

</script>
<template>
  <section class="px-4 py-4 flex justify-between items-center">
    <TitleSectionDeclare title="SƠ ĐỒ GHẾ" />
    <el-button type="primary" @click="dialogVisible = true" :icon="Plus">
      Thêm sơ đồ ghế
    </el-button>
  </section>
  <section class="px-4 py-4">a</section>

  <el-dialog
    v-model="dialogVisible"
    title="Thêm sơ đồ ghế"
    width="1000"
    :before-close="handleClose"
  >
    <div>
      <el-row :gutter="20">
        <el-col :span="9">
          <span>Tên sơ đồ</span>
          <el-input v-model="seatMap.name" placeholder="Nhập tên sơ đồ" />
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
            :key="seat.id"
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
        <el-button type="primary" @click="saveSeatMap">Lưu</el-button>
      </div>
    </template>
  </el-dialog>
</template>
