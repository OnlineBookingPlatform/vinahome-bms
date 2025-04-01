<script setup lang="ts">
import TitleSectionDeclare from "~/components/UI/TitleSectionDeclare.vue";
import { SuccessFilled, ArrowDown, ArrowUp } from "@element-plus/icons-vue";
import type { PointNameType, PointOfRouteType } from "~/types/PointType";
import { useAuthStore } from "~/stores/authStore";
import {
  createPointOfRouteAPI,
  getPointOfRouteByRouteAPI,
  getPointsNameByCompanyAPI,
} from "~/api/pointAPI";
import { ElMessage } from "element-plus";
const route = useRoute();

const name = computed(() => route.query.name || "");
const routeId = ref<number>(0);
onMounted(() => {
  routeId.value = Number(route.params.id) || 0;
  console.log("Route ID:", routeId.value);
});
const nameFromState = computed(() => history.state.rowData?.name || "");
const routeName = computed(() => name.value || nameFromState.value);
console.log("Tên:", name);
const authStore = useAuthStore();
const allStopPoints = ref<PointNameType[]>([]);
const tableData = ref<PointOfRouteType[]>([]);
const loading = ref(false);
const newStopPoint = ref<number | null>(null);
const fetchAllStopPoints = async () => {
  loading.value = true;
  try {
    const response = await getPointsNameByCompanyAPI(
      authStore.storeCompanyId ?? 0
    );
    if (response.result) {
      allStopPoints.value = response.result;
      console.log("Tất cả điểm dừng:", allStopPoints.value);
    }
  } catch (error) {
    console.error("Error fetching stop points:", error);
  } finally {
    loading.value = false;
  }
};
const deleteRow = (index: number) => {
  tableData.value.splice(index, 1);
};
const addStopPoint = () => {
  if (!newStopPoint.value) return;

  const selectedStop = allStopPoints.value.find(
    (stop) => stop.id === newStopPoint.value
  );
  if (
    selectedStop &&
    !tableData.value.some((stop) => stop.id === selectedStop.id)
  ) {
    tableData.value.push({
      id: selectedStop.id,
      name: selectedStop.name,
      time: null,
      display_order: tableData.value.length + 1,
      point_id: selectedStop.id,
      route_id: routeId.value,
      company_id: authStore.storeCompanyId ?? 0,
    } as PointOfRouteType);
    newStopPoint.value = null;
  }
};
const saveRouteStops = async () => {
  try {
    loading.value = true;

    const stopPointsToSave: PointOfRouteType[] = tableData.value.map(
      (stop) => ({
        id: stop.id,
        name: stop.name,
        time: stop.time,
        display_order: stop.display_order,
        point_id: stop.point_id,
        route_id: stop.route_id,
        company_id: stop.company_id,
      })
    );

    const response = await createPointOfRouteAPI(stopPointsToSave);

    if (response.result) {
      tableData.value = response.result;
      ElMessage.success("Lưu điểm dừng thành công!");
    } else {
      console.error("Lỗi khi lưu điểm dừng:", response.message);
      ElMessage.error(`Lỗi khi lưu điểm dừng: ${response.message}`);
    }
  } catch (error) {
    console.error("Lỗi khi lưu điểm dừng:", error);
    ElMessage.error("Đã có lỗi xảy ra khi lưu điểm dừng!");
  } finally {
    loading.value = false;
  }
};

const moveRowUp = (index: number) => {
  if (index <= 0) return;
  const temp = tableData.value[index - 1];
  tableData.value[index - 1] = tableData.value[index];
  tableData.value[index] = temp;
  updateDisplayOrders();
};

const moveRowDown = (index: number) => {
  if (index >= tableData.value.length - 1) return;
  const temp = tableData.value[index + 1];
  tableData.value[index + 1] = tableData.value[index];
  tableData.value[index] = temp;
  updateDisplayOrders();
};
const updateDisplayOrders = () => {
  tableData.value.forEach((item, index) => {
    item.display_order = index + 1;
  });
};
const fetchPointOfRoute = async () => {
  loading.value = true;
  try {
    const response = await getPointOfRouteByRouteAPI(routeId.value);
    if (response.result) {
      console.log("Các điểm dừng của tuyến:", response.result);
      tableData.value = response.result.map((item) => ({
        ...item,
        time: item.time || null,
      }));
    }
  } catch (error) {
    console.error("Error fetching stop points:", error);
  } finally {
    loading.value = false;
  }
};
onMounted(() => {
  fetchAllStopPoints();
  fetchPointOfRoute();
});
</script>
<template>
  <section class="px-4 py-4 flex justify-between items-center">
    <TitleSectionDeclare :title="`DANH SÁCH ĐIỂM DỪNG TUYẾN: ${routeName}`" />
    <el-button type="primary" :icon="SuccessFilled" @click="saveRouteStops">
      Lưu danh sách
    </el-button>
  </section>

  <section class="px-4 pb-5">
    <el-table :data="tableData" style="width: 100%" v-loading="loading">
      <el-table-column type="index" label="STT" width="50" />
      <el-table-column prop="name" label="Điểm dừng" />
      <el-table-column label="Thứ tự">
        <template #default="{ $index }">
          <div class="flex space-x-2">
            <el-button
              circle
              size="small"
              :disabled="$index === 0"
              @click="moveRowUp($index)"
              class="hover:bg-gray-100 disabled:opacity-50"
            >
              <span class="text-sm">↑</span>
            </el-button>
            <span class="text-gray-700 font-medium w-6 text-center">{{
              $index + 1
            }}</span>
            <el-button
              circle
              size="small"
              :disabled="$index === tableData.length - 1"
              @click="moveRowDown($index)"
              class="hover:bg-gray-100 disabled:opacity-50"
            >
              <span class="text-sm">↓</span>
            </el-button>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="Thời gian dự kiến (tính từ lúc khởi hành)">
        <template #default="{ $index }">
          <el-time-select
            v-model="tableData[$index].time"
            style="width: 240px"
            start="00:00"
            step="00:05"
            end="23:55"
            placeholder="Chọn thời gian"
            format="HH:mm"
          />
        </template>
      </el-table-column>

      <el-table-column label="Tùy chọn" align="right" width="120">
        <template #default="scope">
          <el-button
            link
            type="danger"
            size="small"
            @click.prevent="deleteRow(scope.$index)"
          >
            Xóa
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <div class="mt-4 flex gap-2 w-[500px]">
      <el-select
        v-model="newStopPoint"
        placeholder="Chọn điểm dừng"
        filterable
        clearable
        style="flex: 1"
      >
        <el-option
          v-for="stop in allStopPoints"
          :key="stop.id"
          :label="stop.name"
          :value="stop.id"
          :disabled="tableData.some((item) => item.id === stop.id)"
        >
        </el-option>
      </el-select>

      <el-button type="primary" @click="addStopPoint" :disabled="!newStopPoint">
        Thêm
      </el-button>
    </div>
  </section>
</template>
