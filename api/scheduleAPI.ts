import type { ScheduleType } from "~/types/ScheduleType";
import type { ApiResponse } from "./ApiResponse";

const API_GATEWAY_URL = "http://localhost:3002";
export const createScheduleAPI = async (
  data: ScheduleType
): Promise<ApiResponse<ScheduleType>> => {
  try {
    return await $fetch<ApiResponse<ScheduleType>>(
      `${API_GATEWAY_URL}/v2/schedule/create-schedule`,
      {
        method: "POST",
        body: data,
      }
    );
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
};
export const getSchedulesByCompanyAPI = async (
  id: number
): Promise<ApiResponse<ScheduleType[]>> => {
  try {
    return await $fetch<ApiResponse<ScheduleType[]>>(
      `${API_GATEWAY_URL}/v2/schedule/get-schedule-by-company/${id}`,
      {
        method: "GET",
      }
    );
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
};
export const deleteScheduleAPI = async (
  id: number
): Promise<ApiResponse<void>> => {
  try {
    return await $fetch<ApiResponse<void>>(
      `${API_GATEWAY_URL}/v2/schedule/delete-schedule/${id}`,
      {
        method: "DELETE",
      }
    );
  } catch (error) {
    throw error;
  }
};
export const updateScheduleAPI = async (
  data: ScheduleType
): Promise<ApiResponse<ScheduleType>> => {
  try {
    return await $fetch<ApiResponse<ScheduleType>>(
      `${API_GATEWAY_URL}/v2/schedule/update-schedule/${data.id}`,
      {
        method: "PUT",
        body: data,
      }
    );
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
}
