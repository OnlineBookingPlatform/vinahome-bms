<script setup lang="ts">
import { Plus, Delete, Edit } from "@element-plus/icons-vue";
import { ElMessage, ElMessageBox, type FormInstance } from "element-plus";
import { getRoutesNameAPI } from "~/api/routeAPI";
import { createScheduleAPI, getSchedulesByCompanyAPI, deleteScheduleAPI, updateScheduleAPI } from "~/api/scheduleAPI";
import { getSeatMapNameByCompanyAPI } from "~/api/seatAPI";
import TitleSectionDeclare from "~/components/UI/TitleSectionDeclare.vue";
import { formatDate } from "~/lib/dateUtils";
import { formatTime } from "~/lib/timeUtils";
import { useAuthStore } from "~/stores/authStore";
import type { RouteNameType } from "~/types/RouteType";
import type { ScheduleType } from "~/types/ScheduleType";
import type { SeatMapNameType } from "~/types/SeatType";
const dialogVisible = ref(false);
const isEditMode = ref(false);
const ruleFormRef = ref<FormInstance>();
const tableData = ref<ScheduleType[]>([]);
const authStore = useAuthStore();
const loading = ref<boolean>(false);
const schedule = ref<ScheduleType>({
  id: 0,
  route_id: null,
  route_name: null,
  seat_map_id: null,
  seat_map_name: null,
  start_date: null,
  end_date: null,
  start_time: null,
  is_end_date_set: false,
  company_id: authStore.storeCompanyId ?? 0,
});
const rules = {
  route_id: [
    {
      required: true,
      message: "Vui lòng chọn tuyến",
      trigger: "blur",
    },
  ],
  start_date: [
    {
      required: true,
      message: "Vui lòng chọn ngày bắt đầu",
      trigger: "blur",
    },
  ],
  start_time: [
    {
      required: true,
      message: "Vui lòng chọn thời gian khởi hành",
      trigger: "blur",
    },
  ],
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
const resetForm = () => {
  schedule.value = {
    id: 0,
    route_id: null,
    route_name: null,
    seat_map_id: null,
    seat_map_name: null,
    start_date: null,
    end_date: null,
    start_time: null,
    is_end_date_set: false,
    company_id: authStore.storeCompanyId ?? 0,
  };
  isEditMode.value = false;
  ruleFormRef.value?.clearValidate();
};
const handleSubmit = () => {
  ruleFormRef.value?.validate(async (valid) => {
    if (valid) {
      if (isEditMode.value) {
        // await updateOffice();
        console.log("Update:", schedule.value);
        try {
          const response = await updateScheduleAPI(schedule.value);
          console.log("Update: ", response);
          if (response.result) {
            ElMessage.success("Cập nhật lịch chạy thành công!");
            console.log("Update: ", response.result);
            const index = tableData.value.findIndex(
              (item) => item.id === response.result.id
            );
            if (index !== -1) {
              tableData.value[index] = response.result;
            }
          } else {
            ElMessage.error(response.message || "Có lỗi xảy ra!");
          }
        } catch (error) {
          ElMessage.error("Không thể cập nhật lịch chạy, vui lòng thử lại!");
        } finally {
          loading.value = false;
          dialogVisible.value = false;
          resetForm();
        }
      } else {
        console.log("Add");
        console.log(schedule.value);
        try {
          const response = await createScheduleAPI(schedule.value);
          if (response.result) {
            ElMessage.success("Tạo tuyến thành công!");
            console.log(response.result);
            tableData.value.push(response.result);
          } else {
            ElMessage.error(response.message || "Có lỗi xảy ra!");
            console.error(response.message);
          }
        } catch (error) {
          ElMessage.error("Không thể tạo tuyến, vui lòng thử lại!");
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
const handleEdit = (index: number, row: ScheduleType) => {
  console.log(index, row);
  isEditMode.value = true;
  schedule.value = { ...row };
  dialogVisible.value = true;
};
const routeName = ref<RouteNameType[]>([]);
const fetchRoutes = async () => {
  loading.value = true;
  try {
    const response = await getRoutesNameAPI(authStore.storeCompanyId ?? 0);
    routeName.value = response.result;
    console.log("routeName", routeName.value);
  } catch (err) {
    console.error(err);
  } finally {
    loading.value = false;
  }
};
const fetchSchedules = async () => {
  loading.value = true;
  try {
    const response = await getSchedulesByCompanyAPI(
      authStore.storeCompanyId ?? 0
    );
    if (response.result) {
      tableData.value = response.result;
      console.log("Schedule",response.result);
    } else {
      ElMessage.error(response.message || "Có lỗi xảy ra!");
    }
  } catch (err) {
    ElMessage.error("Có lỗi xảy ra khi tải dữ liệu!");
    console.error(err);
  } finally {
    loading.value = false;
  }
};
const seatMapName = ref<SeatMapNameType[]>([]);
const fetchSeatMaps = async () => {
  loading.value = true;
  try {
    const response = await getSeatMapNameByCompanyAPI(authStore.storeCompanyId ?? 0);
    seatMapName.value = response.result;
    console.log("seatMapName", seatMapName.value);
  } catch (err) {
    console.error(err);
  } finally {
    loading.value = false;
  }
};
const handleDelete = (index: number, row: ScheduleType) => {
  ElMessageBox.confirm(
    `Bạn có chắc chắn muốn xóa lịch chạy này không?`,
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
        await deleteScheduleAPI(row.id);
        ElMessage.success("Xóa lịch chạy thành công!");

        tableData.value.splice(index, 1);
      } catch (error) {
        ElMessage.error("Không thể xóa lịch chạy, vui lòng thử lại!");
      } finally {
        loading.value = false;
      }
    })
    .catch(() => {
      ElMessage.info("Đã hủy xóa lịch chạy.");
    });
};
onMounted(() => {
  fetchSeatMaps();
  fetchRoutes();
  fetchSchedules();
});
watch(
  () => schedule.value.is_end_date_set,
  (newValue) => {
    if (!newValue) {
      schedule.value.end_date = null;
    }
  }
);
</script>
<template>
  <section class="px-4 py-4 flex justify-between items-center">
    <TitleSectionDeclare title="LỊCH CHẠY" />
    <el-button type="primary" @click="dialogVisible = true" :icon="Plus">
      Thêm lịch chạy
    </el-button>
  </section>
  <section class="px-4">
    <el-table :data="tableData" stripe style="width: 100%" v-loading="loading">
      <el-table-column type="index" label="STT" width="50" />
      <el-table-column prop="route_name" label="Tuyến" />
      <el-table-column prop="start_time" label="Giờ khởi hành">
        <template v-slot="scope">
          {{ formatTime(scope.row.start_time) }}
        </template>
      </el-table-column>
      <el-table-column prop="seat_map_name" label="Sơ đồ ghế" />
      <el-table-column prop="start_date" label="Ngày bắt đầu">
        <template v-slot="scope">
          {{ formatDate(scope.row.start_date) }}
        </template>
      </el-table-column>
      <el-table-column prop="end_date" label="Ngày kết thúc">
        <template v-slot="scope">
          {{ formatDate(scope.row.end_date) }}
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
    :title="isEditMode ? 'Chỉnh sửa lịch chạy' : 'Thêm lịch chạy'"
    width="500"
    :before-close="handleClose"
  >
    <el-form :model="schedule" :rules="rules" ref="ruleFormRef">
      <div class="flex flex-col items-start mt-3 p-2">
        <span class="text-base font-medium">Tuyến</span>
        <el-form-item prop="route_id" class="w-full">
          <el-select v-model="schedule.route_id" placeholder="Chọn tuyến">
            <el-option
              v-for="item in routeName"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
      </div>
      <div class="flex flex-col items-start p-2">
        <span class="text-base font-medium">Sơ đồ ghế</span>
        <el-form-item prop="seat_map_id" class="w-full">
          <el-select v-model="schedule.seat_map_id" placeholder="Chọn sơ đồ ghế">
            <el-option
              v-for="item in seatMapName"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
      </div>

      <el-row>
        <el-col :span="12">
          <div class="flex flex-col items-start mt-3 p-2">
            <span class="text-base font-medium">Ngày bắt đầu</span>
            <el-form-item prop="start_date" class="w-full">
              <el-date-picker
                v-model="schedule.start_date"
                type="date"
                placeholder="Chọn ngày bắt đầu"
                format="DD/MM/YYYY"
                value-format="YYYY-MM-DD"
              />
            </el-form-item>
          </div>
        </el-col>
        <el-col :span="12">
          <div class="flex flex-col items-start mt-3 p-2">
            <span class="text-base font-medium">Thời gian khởi hành</span>
            <el-form-item prop="start_time" class="w-full">
              <el-time-select
                v-model="schedule.start_time"
                start="00:05"
                step="00:05"
                end="23:55"
                placeholder="Chọn thời gian khởi hành"
              />
            </el-form-item>
          </div>
        </el-col>
      </el-row>
      <div class="flex flex-col items-start p-2">
        <el-form-item prop="is_end_date_set" class="w-full">
          <el-switch
            v-model="schedule.is_end_date_set"
            active-text="Đã biết ngày dừng"
            inactive-text="Chưa biết ngày dừng"
          />
        </el-form-item>
      </div>
      <el-row v-if="schedule.is_end_date_set">
        <el-col :span="12">
          <div class="flex flex-col items-start p-2">
            <span class="text-base font-medium">Ngày kết thúc</span>
            <el-form-item prop="end_date" class="w-full">
              <el-date-picker
                v-model="schedule.end_date"
                type="date"
                placeholder="Chọn ngày kết thúc"
                format="DD/MM/YYYY"
                value-format="YYYY-MM-DD"
              />
            </el-form-item>
          </div>
        </el-col>
      </el-row>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="handleClose">Thoát</el-button>
        <el-button type="primary" @click="handleSubmit">
          {{ isEditMode ? "Cập nhật" : "Thêm mới" }}
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>
