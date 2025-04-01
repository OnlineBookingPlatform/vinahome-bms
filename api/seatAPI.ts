import type { SeatMapNameType, SeatMapType } from "~/types/SeatType";
import type { ApiResponse } from "./ApiResponse";
const API_GATEWAY_URL = "http://localhost:3002";

export const createSeatMapAPI = async (
  seatMap: SeatMapType
): Promise<ApiResponse<SeatMapType>> => {
  try {
    return await $fetch<ApiResponse<SeatMapType>>(
      `${API_GATEWAY_URL}/v2/seat/create-seat-map`,
      {
        method: "POST",
        body: seatMap,
      }
    );
  } catch (error) {
    throw error;
  }
};
export const deleteSeatMapAPI = async (
  id: number
): Promise<ApiResponse<void>> => {
  try {
    return await $fetch<ApiResponse<void>>(
      `${API_GATEWAY_URL}/v2/seat/delete-seat-map/${id}`,
      {
        method: "DELETE",
      }
    );
  } catch (error) {
    throw error;
  }
};
export const getSeatMapByCompanyAPI = async (
  companyId: number
): Promise<ApiResponse<SeatMapType[]>> => {
  try {
    return await $fetch<ApiResponse<SeatMapType[]>>(
      `${API_GATEWAY_URL}/v2/seat/get-seat-map-by-company/${companyId}`,
      {
        method: "GET",
      }
    );
  } catch (error) {
    throw error;
  }
};

export const getSeatMapNameByCompanyAPI = async (
  companyId: number
): Promise<ApiResponse<SeatMapNameType[]>> => {
  try {
    return await $fetch<ApiResponse<SeatMapNameType[]>>(
      `${API_GATEWAY_URL}/v2/seat/get-seat-map-name-by-company/${companyId}`,
      {
        method: "GET",
      }
    );
  } catch (error) {
    throw error;
  }
};

export const updateSeatMapAPI = async (
  seatMap: SeatMapType
): Promise<ApiResponse<SeatMapType>> => {
  try {
    return await $fetch<ApiResponse<SeatMapType>>(
      `${API_GATEWAY_URL}/v2/seat/update-seat-map/${seatMap.id}`,
      {
        method: "PUT",
        body: seatMap,
      }
    );
  } catch (error) {
    throw error;
  }
};

