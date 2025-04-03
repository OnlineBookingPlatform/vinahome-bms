<script setup lang="ts">
import { Refresh } from "@element-plus/icons-vue";
import dayjs from 'dayjs';

const selectedDate = ref<string>(dayjs().format("YYYY-MM-DD"));
const selectedRoute = ref<string | null>(null);
const routeOptions = ref([
    { label: "Sài Gòn - Buôn Ma Thuột", value: "route_a" },
    { label: "Tuyến B", value: "route_b" },
    { label: "Tuyến C", value: "route_c" },
]);

const setToday = () => {
    selectedDate.value = dayjs().format("YYYY-MM-DD");
};


const items = ref([ "A", "B", "C", "D", "E", "F", "G", "H", "F", "G", "H", "F", "G", "H" ]);
</script>
<template>
    <section class="flex justify-between items-center px-4 bg-gray-100 w-full pb-1 pt-1">
        <div class="flex gap-4 items-center">
            <div>
                <el-button type="warning" size="small" @click="setToday">Hôm nay</el-button>
            </div>
            <div>
                <el-date-picker v-model="selectedDate" type="date" placeholder="Chọn ngày" value-format="YYYY-MM-DD"
                    format="DD-MM-YYYY" />
            </div>
            <div>
                <el-select v-model="selectedRoute" placeholder="Chọn tuyến" style="width: 400px">
                    <el-option v-for="route in routeOptions" :key="route.value" :label="route.label"
                        :value="route.value" />
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
        <div class="bg-gray-200 w-full px-4 py-1">
            <div class="grid gap-2 grid-cols-[repeat(auto-fill,minmax(180px,1fr))]">
                <div v-for="(item, index) in items" :key="index"
                    class="flex flex-col bg-white shadow-md rounded-lg text-xl font-bold h-24 w-full">

               
                    <div class="flex w-full justify-between items-center px-2 bg-red-300 rounded-t-lg h-1/4">
                        <div>
                            <span class="text-xl font-semibold">12:00</span>
                        </div>
                        <div>
                            <span class="text-base font-semibold">0/24</span>
                        </div>
                    </div>

                    <div class="w-full text-center bg-blue-300 flex-1 flex items-center justify-center">
                        aa
                    </div>
                    <div class="w-full text-center bg-green-300 flex-1 flex items-center justify-center rounded-b-lg">
                        bb
                    </div>
                </div>


            </div>
        </div>
    </section>
</template>
<style></style>