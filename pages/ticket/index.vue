<script setup lang="ts">
import { Refresh } from "@element-plus/icons-vue";
import dayjs from "dayjs";
import { ElMessage, type TabsPaneContext } from "element-plus";
import { formatTime } from "~/lib/timeUtils";
import { getRoutesNameAPI } from "~/api/routeAPI";
import { getTripsByDateAndRouteAPI } from "~/api/tripAPI";
import { useAuthStore } from "~/stores/authStore";
import type { RouteNameType } from "~/types/RouteType";
import type { TripType } from "~/types/TripType";
import { TripItemTripCard } from "#components";
import { formatDate } from "~/lib/dateUtils";
import {
  Printer,
  Clock,
  Plus,
  Delete,
  WindPower,
  RefreshLeft,
  Operation,
} from "@element-plus/icons-vue";
const authStore = useAuthStore();
const selectedDate = ref<string>(dayjs().format("YYYY-MM-DD"));
const selectedRoute = ref<string | null>(null);
const routeOptions = ref<RouteNameType[]>([]);
const loadingListRoute = ref(false);
const loadingListTrip = ref(false);
const loadingInfoTrip = ref(false);
const setToday = () => {
  selectedDate.value = dayjs().format("YYYY-MM-DD");
};

const fetchRouteName = async () => {
  loadingListRoute.value = true;
  try {
    const response = await getRoutesNameAPI(authStore.storeCompanyId ?? 0);
    if (response.result) {
      routeOptions.value = response.result;
      console.log(response.result);
    } else {
      ElMessage.error("Có lỗi xảy ra khi lấy danh sách tuyến");
    }
  } catch (error) {
    ElMessage.error("Có lỗi kết nối khi lấy danh sách tuyến");
    console.error("Fetch route name error:", error);
  } finally {
    loadingListRoute.value = false;
  }
};
const tripWrapper = ref<TripType[]>([]);
const fetchTrips = async () => {
  loadingListTrip.value = true;
  try {
    const response = await getTripsByDateAndRouteAPI({
      company_id: authStore.storeCompanyId ?? 0,
      date: selectedDate.value,
      route_id: Number(selectedRoute.value),
    });
    if (response.result) {
      tripWrapper.value = response.result;
      console.log(response.result);
    } else {
      ElMessage.error("Có lỗi xảy ra khi lấy danh sách chuyến");
    }
  } catch (error) {
    ElMessage.error("Có lỗi kết nối khi lấy danh sách tuyến");
    console.error("Fetch route name error:", error);
  } finally {
    loadingListTrip.value = false;
  }
};
const selectedTrip = ref<TripType | null>(null);
const handleSelectTrip = (trip: TripType) => {
  selectedTrip.value = trip;
  console.log("Selected trip:", trip);
};
const activeName = ref("1");

const handleClick = (tab: TabsPaneContext, event: Event) => {
  switch(tab.paneName) {
    case '1':
      console.log('Đang chọn tab Sơ đồ ghế');
      break;
    case '2':
      console.log('Đang chọn tab Danh sách vé');
      break;
    case '3':
      console.log('Đang chọn tab Trung chuyển');
      break;
    case '4':
      console.log('Đang chọn tab Thu chi chuyến');
      break;
    case '5':
      console.log('Đang chọn tab Hàng hóa');
      break;
    default:
      console.log('Tab không xác định');
  }
};

onMounted(() => {
  fetchRouteName();
});
watch([selectedDate, selectedRoute], () => {
  fetchTrips();
  selectedTrip.value = null;
});
</script>
<template>
  <section
    class="flex justify-between items-center px-4 bg-gray-200 w-full pb-1 pt-1"
  >
    <div class="flex gap-4 items-center">
      <div>
        <el-button type="warning" size="small" @click="setToday"
          >Hôm nay</el-button
        >
      </div>
      <div>
        <el-date-picker
          v-model="selectedDate"
          type="date"
          placeholder="Chọn ngày"
          value-format="YYYY-MM-DD"
          format="DD-MM-YYYY"
        />
      </div>
      <div>
        <el-select
          v-model="selectedRoute"
          placeholder="Chọn tuyến"
          style="width: 300px"
          :loading="loadingListRoute"
        >
          <el-option
            v-for="route in routeOptions"
            :key="route.id"
            :label="route.name"
            :value="route.id"
          />
        </el-select>
      </div>
    </div>
    <div>
      <div>
        <el-button :icon="Refresh" circle size="small" />
      </div>
    </div>
  </section>
  <section class="mt-1">
    <div v-if="loadingListTrip">
      <el-skeleton :animated="true" :count="3" class="w-full">
        <template #template>
          <el-skeleton-item
            class="w-full h-10 bg-gray-200 rounded-lg"
          ></el-skeleton-item>
        </template>
      </el-skeleton>
    </div>
    <div class="bg-gray-50 w-full px-4 pt-1 pb-2" v-else>
      <div class="grid gap-2 grid-cols-[repeat(auto-fill,minmax(200px,1fr))]">
        <TripItemTripCard
          v-for="(trip, index) in tripWrapper"
          class="item-trip-card"
          :key="index"
          :trip="trip"
          @click="handleSelectTrip(trip)"
        />
      </div>
    </div>
  </section>
  <section v-if="selectedTrip" class="mt-1">
    <div v-if="loadingInfoTrip">
      <el-skeleton :animated="true" :count="3" class="w-full">
        <template #template>
          <el-skeleton-item
            class="w-full h-10 bg-gray-200 rounded-lg"
          ></el-skeleton-item>
        </template>
      </el-skeleton>
    </div>
    <div v-else>
      <el-collapse>
        <el-collapse-item name="1" class="px-4">
          <template #title>
            <div class="flex justify-between items-center">
              <span class="text-base font-semibold"
                >{{ formatTime(selectedTrip.time_departure) }} •
                {{ formatDate(selectedTrip.date_departure) }} •
                {{ selectedTrip.route.name }}</span
              >
            </div>
          </template>
          <el-row :gutter="20">
            <el-col :span="6">
              <div>
                <span class="text-[14px]">Biển số:</span>
                <span class="text-[#0072bc] font-semibold text-[14px] mx-2"
                  >51B - 292.63 (0877717575)</span
                >
              </div>
              <div>
                <span class="text-[14px]">Sơ đồ ghế:</span>
                <span class="text-[#0072bc] font-semibold text-[14px] mx-2">{{
                  selectedTrip.seat_map.name
                }}</span>
              </div>
            </el-col>
            <el-col :span="6">
              <div>
                <span class="text-[14px]">Tài xế:</span>
                <span class="text-[#0072bc] font-semibold text-[14px] mx-2"
                  >Nguyễn Văn A (0877717575)</span
                >
              </div>
              <div>
                <span class="text-[14px]">Phụ xe:</span>
                <span class="text-[#0072bc] font-semibold text-[14px] mx-2"
                  >Nguyễn Văn B (0877717575)</span
                >
              </div>
            </el-col>
            <el-col :span="6">
              <div>
                <span class="text-[14px]">Số vé:</span>
                <span class="text-[#0072bc] font-semibold text-[14px] mx-2"
                  >{{ selectedTrip.total_ticket_booking }}/
                  {{ selectedTrip.total_ticket }}</span
                >
              </div>
              <div>
                <span class="text-[14px]">Tiền vé:</span>
                <span class="text-[#0072bc] font-semibold text-[14px] mx-2"
                  >5.000.000</span
                >
              </div>
            </el-col>
            <el-col :span="6">
              <div>
                <span class="text-[14px]">Số hàng:</span>
                <span class="text-[#0072bc] font-semibold text-[14px] mx-2"
                  >12</span
                >
              </div>
              <div>
                <span class="text-[14px]">Tiền hàng:</span>
                <span class="text-[#0072bc] font-semibold text-[14px] mx-2"
                  >4.000.000</span
                >
              </div>
            </el-col>
          </el-row>
        </el-collapse-item>
      </el-collapse>
      <div class="mt-1 px-4">
        <el-button :icon="Operation" plain color="#0072bc">Cập nhật</el-button>
        <el-button :icon="Printer">In phơi</el-button>
        <el-button :icon="RefreshLeft" plain>Lịch sử</el-button>
        <el-button :icon="WindPower" plain>Xuất bến</el-button>
        <el-button :icon="Delete" type="danger" plain>Hủy chuyến</el-button>
        <el-button :icon="Plus" plain>Thêm hàng</el-button>
        <el-button :icon="Clock" plain>Đổi giờ</el-button>
      </div>
    </div>
  </section>
  <section v-if="selectedTrip" class="mt-1">
    <div></div>
    <div class="mt-1 px-4">
      <el-tabs v-model="activeName" class="demo-tabs" @tab-click="handleClick">
        <el-tab-pane label="Sơ đồ ghế" name="1">User</el-tab-pane>
        <el-tab-pane label="Danh sách vé" name="2">Config</el-tab-pane>
        <el-tab-pane label="Trung chuyển" name="3">Role</el-tab-pane>
        <el-tab-pane label="Thu chi chuyến" name="4">Task</el-tab-pane>
        <el-tab-pane label="Hàng hóa" name="5">Task</el-tab-pane>
      </el-tabs>
    </div>
  </section>
</template>
<style>
.item-trip-card {
  box-shadow: rgba(0, 0, 0, 0.25) 0px 4px 4px -2px,
    rgba(0, 0, 0, 0.3) 0px 3px 12px -3px;
}
</style>
