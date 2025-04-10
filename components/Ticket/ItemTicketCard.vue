<script setup lang="ts">
import { computed } from "vue";
import type { TicketType } from "~/types/TicketType";
import { Location, LocationFilled } from "@element-plus/icons-vue";

const props = defineProps<{
  ticket: TicketType;
  isSelected: Boolean;
}>();

const emit = defineEmits(["select"]);

const handleClick = () => {
  if (props.ticket.seat_status && !props.ticket.status_booking_ticket) {
    emit("select", props.ticket);
  }
};
</script>
<template>
  <div
    class="min-w-[60px] min-h-[100px] flex-1 flex flex-col border-[2px] rounded-lg p-1 transition-colors duration-200 cursor-pointer"
    :class="{
      'border-[#0072bc]': isSelected,
      'border-gray-300': !isSelected,
    }"
    @click="handleClick"
    v-if="ticket.seat_status"
  >
    <div class="flex justify-between items-center w-full">
      <span class="text-[#0072bc] text-base font-semibold flex-1 truncate">{{
        ticket.seat_name
      }}</span>
      <div
        class="border border-black px-2 rounded-md ml-2 min-h-2"
        v-if="ticket.status_booking_ticket"
      >
        <span class="text-black text-base font-medium">{{
          ticket.passenger_phone
        }}</span>
      </div>
    </div>

    <div
      class="text-black text-[14px] truncate font-medium"
      v-if="ticket.status_booking_ticket"
    >
      {{ ticket.passenger_name }}
    </div>
    <div class="flex flex-col" v-if="ticket.status_booking_ticket">
      <div class="flex items-center text-[14px] font-normal">
        <el-icon color="#0072bc"><LocationFilled /></el-icon>
        <span class="mt-[1px] ml-1">{{ ticket.point_up }}</span>
      </div>
      <div class="flex items-center text-[14px] font-normal">
        <el-icon color="#F56C6C"><LocationFilled /></el-icon>
        <span class="mt-[1px] ml-1">{{ ticket.point_down }}</span>
      </div>
    </div>
    <div
      class="flex justify-end items-center"
      v-if="ticket.status_booking_ticket"
    >
      <span class="text-[13px]">*{{ ticket.id }}</span>
    </div>
    <div v-if="ticket.status_booking_ticket">
      <span class="text-[13px] font-medium text-[#0072bc]"
        >* {{ ticket.ticket_note }}</span
      >
    </div>
    <div
      class="flex justify-between items-center mt-[1px]"
      v-if="ticket.status_booking_ticket"
    >
      <span class="text-[14px]">
        {{ new Intl.NumberFormat("vi-VN").format(ticket.base_price) }}
      </span>
      <span class="text-[14px] font-medium">TTTX</span>
    </div>
    <div
      class="w-full h-[5px] bg-[#0072bc] rounded-3xl"
      v-if="ticket.status_booking_ticket"
    ></div>
    <div
      class="flex justify-between items-center mt-[1px]"
      v-if="ticket.status_booking_ticket"
    >
      <span class="text-[12px]">B: Đặng Tuấn Thành / VP An Sương</span>
      <span class="text-[12px]"></span>
    </div>
  </div>
</template>
