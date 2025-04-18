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
  Timer,
  Rank,
  CopyDocument,
  Phone,
  InfoFilled,
} from "@element-plus/icons-vue";
import { getTicketByTripIdAPI } from "~/api/ticketAPI";
import type { BookingForm, TicketType } from "~/types/TicketType";
import ItemTicketCard from "~/components/Ticket/ItemTicketCard.vue";
import { ref as dbRef, onValue, remove, set } from 'firebase/database'
import { database } from '~/config/firebase'
const authStore = useAuthStore();
const selectedDate = ref<string>(dayjs().format("YYYY-MM-DD"));
const selectedRoute = ref<string | null>(null);
const routeOptions = ref<RouteNameType[]>([]);
const loadingListRoute = ref(false);
const loadingListTrip = ref(false);
const loadingInfoTrip = ref(false);
const selectedTickets = ref<TicketType[]>([]);
const firstTicketPrice = ref(0);
const tripItems = ref<TripType[]>([]);
const activeTabs = ref("1");
const activeBookingForm = ref('1')
const selectedTrip = ref<TripType | null>(null);
const listItemTicket = ref<TicketType[]>([]);

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

const fetchTrips = async () => {
  loadingListTrip.value = true;
  try {
    const response = await getTripsByDateAndRouteAPI({
      company_id: authStore.storeCompanyId ?? 0,
      date: selectedDate.value,
      route_id: Number(selectedRoute.value),
    });
    if (response.result) {
      tripItems.value = response.result;
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

const handleSelectTrip = async (trip: TripType) => {
  selectedTrip.value = trip;
  console.log("Selected trip:", trip);
  activeTabs.value = "1";

  if (trip.id) {
    const response = await getTicketByTripIdAPI(trip.id);
    if (response.result) {
      console.log("Danh sách vé:", response.result);
      listItemTicket.value = response.result;
      selectedTickets.value = [];
    } else {
      ElMessage.error("Có lỗi xảy ra khi lấy danh sách vé");
    }
  }
};

const handleClickSelectTabs = async (tab: TabsPaneContext, event: Event) => {
  selectedTickets.value = [];
  switch (tab.paneName) {
    case "1":
      if (!selectedTrip.value) {
        ElMessage.warning("Vui lòng chọn chuyến trước");
        return;
      }

      const response = await getTicketByTripIdAPI(selectedTrip.value?.id ?? 0);
      if (response.result) {
        console.log(response.result);
        listItemTicket.value = response.result;
      } else {
        ElMessage.error("Có lỗi xảy ra khi lấy danh sách vé");
      }
      console.log("Đang chọn tab Sơ đồ ghế");
      break;
    case "2":
      console.log("Đang chọn tab Danh sách vé");
      break;
    case "3":
      console.log("Đang chọn tab Trung chuyển");
      break;
    case "4":
      console.log("Đang chọn tab Thu chi chuyến");
      break;
    case "5":
      console.log("Đang chọn tab Hàng hóa");
      break;
    default:
      console.log("Tab không xác định");
  }
};



const availableFloats = computed(() => {
  const floors = new Set<number>();
  listItemTicket.value.forEach((ticket) => floors.add(ticket.seat_floor));
  return Array.from(floors).sort((a, b) => a - b);
});

const getRows = (floor: number): number[] => {
  const rows = new Set<number>();
  listItemTicket.value
    .filter((ticket) => ticket.seat_floor === floor)
    .forEach((ticket) => rows.add(ticket.seat_row));
  return Array.from(rows).sort((a, b) => a - b);
};

const getSeatsByFloorAndRow = (floor: number, row: number): TicketType[] => {
  return listItemTicket.value
    .filter((ticket) => ticket.seat_floor === floor && ticket.seat_row === row)
    .sort((a, b) => a.seat_column - b.seat_column);
};


const formBooking = reactive<BookingForm>({
  passenger_phone: null,
  passenger_name: null,
  email: null,
  point_up: null,
  point_down: null,
  note: null,
  birth_date: null,
  gender: null,
  payment_method: 2,
  amount_received: null,
  selectedTickets: [],
})

const handleSelectTicket = (ticket: TicketType) => {
  const index = selectedTickets.value.findIndex((t) => t.id === ticket.id);
  const ticketRef = dbRef(database, `selectedTickets/${ticket.id}`)
  if (index > -1) {
    selectedTickets.value.splice(index, 1); // Bỏ chọn
    remove(ticketRef)
  } else {
    selectedTickets.value.push(ticket); // Thêm vào danh sách
    // console.log("Selected tickets:", selectedTickets.value);
    firstTicketPrice.value = selectedTickets.value[ 0 ].base_price;
    formBooking.amount_received = firstTicketPrice.value;

  }
};
const removeTagTicket = (ticketToRemove: TicketType) => {
  selectedTickets.value = selectedTickets.value.filter(
    (ticket) => ticket.id !== ticketToRemove.id
  );
};








const optionsPayment = [
  { value: 1, label: 'Thanh toán trực tuyến (online)' },
  { value: 2, label: 'Thanh toán trên xe' },
  { value: 3, label: 'Thanh toán tại quầy' },
  { value: 4, label: 'Chuyển khoản' },
]
const handleSubmitBookingForm = () => {
  if (selectedTickets.value.length === 0) {
    ElMessage.warning("Vui lòng chọn vé trước khi đặt");
    return;
  }
  formBooking.selectedTickets = selectedTickets.value;
  console.log("Form booking data:", formBooking);
  // Gửi dữ liệu đến API hoặc thực hiện hành động khác
  ElMessage.success("Đặt vé thành công!");
};
onMounted(() => {
  fetchRouteName();
});
watch([ selectedDate, selectedRoute ], () => {
  fetchTrips();
  selectedTrip.value = null;
});

watch(
  () => selectedTickets.value,
  (newSelectedTickets, oldSelectedTickets) => {
    if (newSelectedTickets && Array.isArray(newSelectedTickets)) {
      // Lặp qua các vé mới và thêm vào Firebase
      newSelectedTickets.forEach((ticket) => {
        const ticketRef = dbRef(database, `selectedTickets/${ticket.id}`);
        const ticketData = {
          name: authStore.user?.name || "",
          id: authStore.user?.id || "",
        };
        set(ticketRef, ticketData)
          .then(() => {
            console.log("Vé đã được thêm vào Firebase:", ticket.id);
          })
          .catch((error) => {
            console.error("Lỗi khi ghi vào Firebase:", error);
          });
      });

      // Kiểm tra và xoá các vé bị bỏ chọn
      oldSelectedTickets.forEach((ticket) => {
        const ticketStillSelected = newSelectedTickets.some(
          (newTicket) => newTicket.id === ticket.id
        );

        if (!ticketStillSelected) {
          const ticketRef = dbRef(database, `selectedTickets/${ticket.id}`);
          remove(ticketRef)
            .then(() => {
              console.log("Vé đã bị xoá khỏi Firebase:", ticket.id);
            })
            .catch((error) => {
              console.error("Lỗi khi xoá vé khỏi Firebase:", error);
            });
        }
      });
    } else {
      console.warn("selectedTickets không hợp lệ hoặc không phải là mảng");
    }
  },
  { deep: true }
);

const selectedTicketsFirebase = ref<Record<string, { id: string; name: string }>>({});
onMounted(() => {
  const ticketsRef = dbRef(database, "selectedTickets");

  onValue(ticketsRef, (snapshot) => {
    const data = snapshot.val();
    if (data) {
      selectedTicketsFirebase.value = data;
    } else {
      selectedTicketsFirebase.value = {};
    }
  });
});
const getSelectorName = (ticketId: string) => {
  return selectedTicketsFirebase.value[ ticketId ]?.name || null;
};

const isSelectedByCurrentUser = (ticketId: string) => {
  return selectedTicketsFirebase.value[ ticketId ]?.id === authStore.user?.id;
};
const isTicketSelected = (ticketId: string) => {
  return ticketId in selectedTicketsFirebase.value;
};


</script>
<template>
  <!-- Bộ lọc chọn Ngày, Tuyến -->
  <section class="flex justify-between items-center px-4 bg-gray-200 w-full pb-1 pt-1"
    :style="{ 'padding-right': selectedTickets.length > 0 ? '20%' : '0' }">
    <div class="flex gap-4 items-center">
      <div>
        <el-button type="warning" size="small" @click="setToday">Hôm nay</el-button>
      </div>
      <div>
        <el-date-picker v-model="selectedDate" type="date" placeholder="Chọn ngày" value-format="YYYY-MM-DD"
          format="DD-MM-YYYY" />
      </div>
      <div>
        <el-select v-model="selectedRoute" placeholder="Chọn tuyến" style="width: 300px" :loading="loadingListRoute">
          <el-option v-for="route in routeOptions" :key="route.id" :label="route.name" :value="route.id" />
        </el-select>
      </div>
    </div>
    <div>
      <div class="px-4">
        <el-button :icon="Refresh" circle size="small" />
      </div>
    </div>
  </section>
  <!-- Hiển thị danh sách chuyến (Trip) -->
  <section class="mt-1" :style="{ 'padding-right': selectedTickets.length > 0 ? '20%' : '0' }">
    <div v-if="loadingListTrip">
      <el-skeleton :animated="true" :count="3" class="w-full">
        <template #template>
          <el-skeleton-item class="w-full h-10 bg-gray-200 rounded-lg"></el-skeleton-item>
        </template>
      </el-skeleton>
    </div>
    <div class="bg-gray-50 w-full px-4 pt-1 pb-2" v-else>
      <div class="grid gap-2 grid-cols-[repeat(auto-fill,minmax(200px,1fr))]">
        <TripItemTripCard v-for="(trip, index) in tripItems" class="item-trip-card" :key="index" :trip="trip"
          @click="handleSelectTrip(trip)" />
      </div>
    </div>
  </section>
  <!-- Thông tin chi tiết của chuyến được chọn -->
  <section v-if="selectedTrip" class="mt-1" :style="{ 'padding-right': selectedTickets.length > 0 ? '20%' : '0' }">
    <div v-if="loadingInfoTrip">
      <el-skeleton :animated="true" :count="3" class="w-full">
        <template #template>
          <el-skeleton-item class="w-full h-10 bg-gray-200 rounded-lg"></el-skeleton-item>
        </template>
      </el-skeleton>
    </div>
    <div v-else>
      <el-collapse>
        <el-collapse-item name="1" class="px-4">
          <template #title>
            <div class="flex justify-between items-center">
              <span class="text-base font-semibold">{{ formatTime(selectedTrip.time_departure) }} •
                {{ formatDate(selectedTrip.date_departure) }} •
                {{ selectedTrip.route.name }}</span>
            </div>
          </template>
          <el-row :gutter="20">
            <el-col :span="6">
              <div>
                <span class="text-[14px]">Biển số:</span>
                <span class="text-[#0072bc] font-semibold text-[14px] mx-2">51B - 292.63 (0877717575)</span>
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
                <span class="text-[#0072bc] font-semibold text-[14px] mx-2">Nguyễn Văn A (0877717575)</span>
              </div>
              <div>
                <span class="text-[14px]">Phụ xe:</span>
                <span class="text-[#0072bc] font-semibold text-[14px] mx-2">Nguyễn Văn B (0877717575)</span>
              </div>
            </el-col>
            <el-col :span="6">
              <div>
                <span class="text-[14px]">Số vé:</span>
                <span class="text-[#0072bc] font-semibold text-[14px] mx-2">{{ selectedTrip.total_ticket_booking }}/
                  {{ selectedTrip.total_ticket }}</span>
              </div>
              <div>
                <span class="text-[14px]">Tiền vé:</span>
                <span class="text-[#0072bc] font-semibold text-[14px] mx-2">5.000.000</span>
              </div>
            </el-col>
            <el-col :span="6">
              <div>
                <span class="text-[14px]">Số hàng:</span>
                <span class="text-[#0072bc] font-semibold text-[14px] mx-2">12</span>
              </div>
              <div>
                <span class="text-[14px]">Tiền hàng:</span>
                <span class="text-[#0072bc] font-semibold text-[14px] mx-2">4.000.000</span>
              </div>
            </el-col>
          </el-row>
        </el-collapse-item>
      </el-collapse>
      <div class="mt-1 px-4">
        <el-button :icon="Operation" plain color="#0072bc" class="mr-2">Cập nhật</el-button>
        <el-button :icon="Printer" class="mr-2">In phơi</el-button>
        <el-button :icon="RefreshLeft" plain class="mr-2">Lịch sử</el-button>
        <el-button :icon="WindPower" plain class="mr-2">Xuất bến</el-button>
        <el-button :icon="Delete" type="danger" plain class="mr-2">Hủy chuyến</el-button>
        <el-button :icon="Plus" plain class="mr-2">Thêm hàng</el-button>
        <el-button :icon="Clock" plain>Đổi giờ</el-button>
      </div>
    </div>
  </section>
  <!-- Hiển thị các tab -->
  <section v-if="selectedTrip" class="mt-1" :style="{ 'padding-right': selectedTickets.length > 0 ? '20%' : '0' }">
    <div></div>
    <div class="mt-1 px-4">
      <el-tabs v-model="activeTabs" class="demo-tabs" @tab-click="handleClickSelectTabs">
        <!-- Hiển thị sơ đồ ghế/vé (Ticket) -->
        <el-tab-pane label="Sơ đồ ghế" name="1">
          <div class="w-full">
            <div class="flex flex-wrap w-full gap-4">
              <div v-for="floor in availableFloats" :key="'floor-' + floor"
                class="flex-grow w-full md:w-[calc(50%-0.5rem)] lg:w-[calc(33.33%-0.5rem)] xl:w-[calc(25%-0.5rem)]">
                <div class="space-y-4 shadow-sm bg-white h-full">
                  <div class="flex flex-col space-y-2">
                    <div v-for="row in getRows(floor)" :key="'row-' + floor + '-' + row" class="flex space-x-3">
                      <ItemTicketCard v-for="ticket in getSeatsByFloorAndRow(floor, row)" 
                      :key="`${ticket.id}-${selectedTickets.some(
                        (t) => t.id === ticket.id
                      )}`" 
                      :ticket="ticket" 
                      :is-selected="selectedTickets.some(t => t.id === ticket.id)"

                      @select="handleSelectTicket" 
                      :selector-name="getSelectorName(ticket.id.toString())"
                      :selected-by-me="isSelectedByCurrentUser(ticket.id.toString())" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </el-tab-pane>
        <el-tab-pane label="Danh sách vé" name="2"></el-tab-pane>
        <el-tab-pane label="Trung chuyển" name="3"></el-tab-pane>
        <el-tab-pane label="Thu chi chuyến" name="4"></el-tab-pane>
        <el-tab-pane label="Hàng hóa" name="5"></el-tab-pane>
      </el-tabs>
    </div>
  </section>

  <!-- Thông tin vé được chọn -->
  <div v-if="selectedTickets.length > 0"
    class="fixed right-0 top-0 h-full w-[20%] bg-white shadow-lg z-50 overflow-y-auto" style="
      box-shadow: -4px 0 6px -1px rgba(0, 0, 0, 0.1),
        -2px 0 4px -1px rgba(0, 0, 0, 0.06);
    ">
    <div class="flex flex-col h-full">
      <div class="flex flex-col gap-1 flex-grow">
        <el-form :model="formBooking" label-width="auto">
          <div class="bg-gray-200 w-full px-2 py-1 flex flex-wrap gap-2 justify-start">
            <el-tooltip content="In vé" placement="bottom">
              <el-button type="primary" :icon="Printer" circle />
            </el-tooltip>
            <el-tooltip content="Báo trung chuyển" placement="bottom">
              <el-button type="info" :icon="InfoFilled" circle />
            </el-tooltip>

            <el-tooltip content="Gọi khách" placement="bottom">
              <el-button type="success" :icon="Phone" circle />
            </el-tooltip>
            <el-tooltip content="Sao chép vé" placement="bottom">
              <el-button type="warning" :icon="CopyDocument" circle />
            </el-tooltip>
            <el-tooltip content="Di chuyển vé" placement="bottom">
              <el-button color="#67C23A" :icon="Rank" circle />
            </el-tooltip>
            <el-tooltip content="Lịch sử vé" placement="bottom">
              <el-button type="info" plain :icon="Clock" circle />
            </el-tooltip>
            <el-tooltip content="Chờ xử lý" placement="bottom">
              <el-button color="#E6A23C" :icon="Timer" circle />
            </el-tooltip>
            <el-tooltip content="Hủy vé" placement="bottom">
              <el-button type="danger" :icon="Delete" circle />
            </el-tooltip>
          </div>
          <div class="flex flex-wrap py-1 gap-1 overflow-y-auto max-h-[calc(100%-50px)] px-2">
            <el-tag v-for="ticket in selectedTickets" :key="ticket.id" closable @close="removeTagTicket(ticket)"
              class="max-w-full truncate">
              {{ ticket.seat_name }}
            </el-tag>
          </div>
          <el-collapse accordion v-model="activeBookingForm">
            <el-collapse-item name="1">
              <template #title>
                <div class="flex justify-between items-center px-2">
                  <span class="text-[15px] font-semibold text-[#0072bc]">THÔNG TIN HÀNH KHÁCH</span>
                </div>
              </template>
              <div class="px-2">
                <div>
                  <span class="text-[14px] font-medium">Số điện thoại</span>
                  <el-form-item style="margin-bottom: 5px;">
                    <el-input v-model="formBooking.passenger_phone" />
                  </el-form-item>
                </div>
                <div>
                  <span class="text-[14px] font-medium">Họ và tên</span>
                  <el-form-item style="margin-bottom: 5px;">
                    <el-input v-model="formBooking.passenger_name" />
                  </el-form-item>
                </div>
                <div>
                  <span class="text-[14px] font-medium">Email</span>
                  <el-form-item style="margin-bottom: 5px;">
                    <el-input v-model="formBooking.email" />
                  </el-form-item>
                </div>
                <div>
                  <span class="text-[14px] font-medium">Địa chỉ đón</span>
                  <el-form-item style="margin-bottom: 5px;">
                    <el-input v-model="formBooking.point_up" />
                  </el-form-item>
                </div>
                <div>
                  <span class="text-[14px] font-medium">Địa chỉ trả</span>
                  <el-form-item style="margin-bottom: 5px;">
                    <el-input v-model="formBooking.point_down" />
                  </el-form-item>
                </div>
                <div>
                  <span class="text-[14px] font-medium">Ghi chú</span>
                  <el-form-item style="margin-bottom: 5px;">
                    <el-input v-model="formBooking.note" type="textarea" />
                  </el-form-item>
                </div>
                <div>
                  <span class="text-[14px] font-medium">Đại lý</span>
                  <!-- <el-form-item style="margin-bottom: 5px;">
                    <el-input v-model="formBooking.name" />
                  </el-form-item> -->
                </div>
                <div>
                  <span class="text-[14px] font-medium">Ngày sinh</span>
                  <el-form-item style="margin-bottom: 5px;">
                    <el-date-picker v-model="formBooking.birth_date" type="date" placeholder="Chọn ngày sinh" />
                  </el-form-item>
                </div>
                <div>
                  <span class="text-[14px] font-medium">Giới tính</span>
                  <el-form-item style="margin-bottom: 0px;">
                    <el-radio-group v-model="formBooking.gender">
                      <el-radio :value="1">Nam</el-radio>
                      <el-radio :value="2">Nữ</el-radio>
                      <el-radio :value="3">Khác</el-radio>
                    </el-radio-group>
                  </el-form-item>
                </div>
              </div>

            </el-collapse-item>
            <el-collapse-item name="2">
              <template #title>
                <div class="flex justify-between items-center px-2">
                  <span class="text-[15px] font-semibold text-[#0072bc]">THÔNG TIN THANH TOÁN</span>
                </div>
              </template>
              <div class="px-2">
                <div>
                  <span class="text-[14px] font-medium">Hình thức thanh toán</span>
                  <el-form-item style="margin-bottom: 5px;">
                    <el-select v-model="formBooking.payment_method" class="w-full">
                      <el-option v-for="item in optionsPayment" :key="item.value" :label="item.label"
                        :value="item.value" />
                    </el-select>
                  </el-form-item>
                </div>
                <div>
                  <span class="text-[14px] font-medium">Thực thu</span>
                  <el-form-item style="margin-bottom: 5px;">
                    <el-input v-model="formBooking.amount_received" />
                  </el-form-item>
                </div>
              </div>
            </el-collapse-item>
          </el-collapse>
        </el-form>
      </div>
      <div class="bg-blue-100 px-2 py-2">
        <div class="flex gap-2">
          <el-button color="#0072bc" class="flex-1" size="large" @click="handleSubmitBookingForm">Cập nhật</el-button>
          <el-button type="warning" class="flex-1" size="large">In vé</el-button>
        </div>
      </div>


    </div>
  </div>
</template>
<style>
.item-trip-card {
  box-shadow: rgba(0, 0, 0, 0.25) 0px 4px 4px -2px,
    rgba(0, 0, 0, 0.3) 0px 3px 12px -3px;
}
</style>
