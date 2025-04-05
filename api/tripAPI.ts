import type { TripType } from "~/types/TripType";
import type { ApiResponse } from "./ApiResponse";

const API_GATEWAY_URL = "http://localhost:3002";

export const getTripsByDateAndRouteAPI = async (params: {
  company_id: number;
  date: string;
  route_id: number;
}): Promise<ApiResponse<TripType[]>> => {
  try {
    return await $fetch<ApiResponse<TripType[]>>(
      `${API_GATEWAY_URL}/v2/trip/get-trip-by-date-and-route`,
      {
        method: "POST",
        body: params,
      }
    );
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
};
