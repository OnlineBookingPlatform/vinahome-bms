  <script setup lang="ts">
  import { computed } from "vue";
  import type { TicketType } from "~/types/TicketType";
  import { Location, LocationFilled } from "@element-plus/icons-vue";
  import { ref as dbRef, set, remove, onValue } from 'firebase/database'
  import { database } from '~/config/firebase'
  import { useAuthStore } from "~/stores/authStore";

  const props = defineProps<{
    ticket: TicketType;
    isSelected: boolean;
    selectedByMe: boolean;
    selectorName: string | null;
    loading: boolean;
  }>();

  const emit = defineEmits(["select"]);

  const handleClickTicket = () => {
    if (props.loading) return;
    if (props.ticket.seat_status) {
      emit("select", props.ticket);
      console.log("Ticket clicked:", props.ticket);
    }
  };
  console.log(props.selectedByMe)
</script>
<template>
  <div
    class="min-w-[60px] min-h-[100px] flex-1 flex flex-col border-[2px] rounded-lg p-1 transition-colors duration-200 cursor-pointer relative"
    :class="[
      'min-w-[60px] min-h-[100px] flex-1 flex flex-col rounded-lg p-1 transition-colors duration-200 cursor-pointer relative',
      {
        'bg-blue-200': props.selectorName && !props.selectedByMe,
        'border-[#0072bc]': props.isSelected || (props.selectorName && !props.selectedByMe),
        'border-gray-300': !props.isSelected && !(props.selectorName && !props.selectedByMe),
        'opacity-50 pointer-events-none': props.loading,
      }
    ]" @click="handleClickTicket" v-if="ticket.seat_status" v-loading="props.loading">
    <div class="m-auto text-sm flex flex-col justify-center items-center"
      v-if="props.selectorName && !props.selectedByMe">
      <span>{{ props.selectorName }}</span>
    </div>

    <div class="flex justify-between items-start w-full relative">
      <span class="text-[#0072bc] font-semibold">
        {{ ticket.seat_name }}
      </span>

      <div v-if="ticket.status_booking_ticket" class="border border-black px-2 rounded-md ml-2 min-h-2">
        <span class="text-black text-base font-medium">
          {{ ticket.passenger_phone }}
        </span>
      </div>
    </div>



    <div class="text-black text-[14px] truncate font-medium" v-if="ticket.status_booking_ticket">
      {{ ticket.passenger_name }}
    </div>
    <div class="flex flex-col" v-if="ticket.status_booking_ticket">
      <div class="flex items-center text-[14px] font-normal">
        <el-icon color="#0072bc">
          <LocationFilled />
        </el-icon>
        <span class="mt-[1px] ml-1">{{ ticket.point_up }}</span>
      </div>
      <div class="flex items-center text-[14px] font-normal">
        <el-icon color="#F56C6C">
          <LocationFilled />
        </el-icon>
        <span class="mt-[1px] ml-1">{{ ticket.point_down }}</span>
      </div>
    </div>
    <div class="flex justify-end items-center" v-if="ticket.status_booking_ticket">
      <span class="text-[13px]">*{{ ticket.id }}</span>
    </div>
    <div v-if="ticket.status_booking_ticket">
      <span class="text-[13px] font-medium text-[#0072bc]">* {{ ticket.ticket_note }}</span>
    </div>
    <div class="flex justify-between items-center mt-[1px]" v-if="ticket.status_booking_ticket">
      <span class="text-[14px]">
        {{ new Intl.NumberFormat("vi-VN").format(ticket.base_price) }}
      </span>
      <span v-if="ticket.payment_method === 1" class="text-[14px] font-medium">Online</span>
      <span v-else-if="ticket.payment_method === 2" class="text-[14px] font-medium">TTTX</span>
      <span v-else-if="ticket.payment_method === 3" class="text-[14px] font-medium">TTTQ</span>
      <span v-else-if="ticket.payment_method === 4" class="text-[14px] font-medium">CK</span>
    </div>
    <div class="w-full h-[5px] bg-[#0072bc] rounded-3xl" v-if="ticket.status_booking_ticket"></div>
    <div class="flex justify-between items-center mt-[1px]" v-if="ticket.status_booking_ticket">
      <span class="text-[12px]">B: {{ ticket.creator_by_name }}</span>
      <span class="text-[12px]"></span>
    </div>
  </div>
</template>
