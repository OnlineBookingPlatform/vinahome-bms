<script setup lang="ts">
import { formatTime } from "~/lib/timeUtils";
import type { TripType } from "~/types/TripType";
const props = defineProps<{
  trip: TripType;
}>();
</script>

<template>
  <div
    class="flex flex-col bg-white shadow-md rounded-lg text-xl font-bold w-full"
  >
    <div
      class="relative flex w-full justify-between items-center px-2 rounded-t-lg overflow-hidden h-8"
    >
      <div class="absolute inset-0 bg-gray-300"></div>

      <div
        class="absolute inset-0 bg-red-300"
        :style="{
          width: `${(trip.total_ticket_booking / trip.total_ticket) * 100}%`,
        }"
      ></div>

      <div class="relative z-10 flex w-full justify-between items-center">
        <span class="text-xl font-semibold">{{
          formatTime(trip.time_departure)
        }}</span>
        <span class="text-base font-semibold">
          {{ trip.total_ticket_booking }}/{{ trip.total_ticket }}
        </span>
      </div>
    </div>

    <div class="w-full flex px-2 pt-1 flex-col">
      <span class="text-sm font-normal">T: Nguyễn Văn A</span>
      <span class="text-sm font-normal">P: Nguyễn Văn B</span>
    </div>

    <div class="w-full flex justify-between rounded-b-lg px-2">
      <span class="text-[12px] font-normal">{{ trip.seat_map.name }}</span>
      <span class="text-[12px] font-normal">51B - 292.63</span>
    </div>
  </div>
</template>
