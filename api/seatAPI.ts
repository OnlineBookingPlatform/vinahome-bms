import type { SeatMap } from "~/types/SeatType";
import type { ApiResponse } from "./ApiResponse";
import { ca } from "element-plus/es/locales.mjs";
import { ElMessage } from "element-plus";

const API_GATEWAY_URL = "http://localhost:3002";
export const createSeatMap = async (
  seatMap: SeatMap
): Promise<ApiResponse<SeatMap>> => {
  console.log(seatMap);
  try {
    return await $fetch<ApiResponse<SeatMap>>(
      `${API_GATEWAY_URL}/v2/seat/create-seat`,
      {
        method: "POST",
        body: seatMap,
      }
    );
  } catch (error) {
    console.error("Error:", error);
    ElMessage.error("Lỗi hệ thống");
    throw error;
  }
};
