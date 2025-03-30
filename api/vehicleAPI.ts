import type { VehicleType } from "~/types/VehicleType";
import type { ApiResponse } from "./ApiResponse";

const API_GATEWAY_URL = "http://localhost:3002";
export const createVehicleAPI = async (
  data: VehicleType
): Promise<ApiResponse<VehicleType>> => {
  try {
    return await $fetch<ApiResponse<VehicleType>>(
      `${API_GATEWAY_URL}/v2/vehicle/create-vehicle`,
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
export const getVehiclesAPI = async (companyId: number): Promise<ApiResponse<VehicleType[]>> => {
  try {
    return await $fetch<ApiResponse<VehicleType[]>>(
      `${API_GATEWAY_URL}/v2/vehicle/get-vehicle-by-company/${companyId}`,
      {
        method: "GET",
      }
    );
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
};
export const deleteVehicleAPI = async (id: number): Promise<ApiResponse<void>> => {
  try {
    return await $fetch<ApiResponse<void>>(
      `${API_GATEWAY_URL}/v2/vehicle/delete-vehicle/${id}`,
      {
        method: "DELETE",
      }
    );
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
}
export const updateVehicleAPI = async (data: VehicleType): Promise<ApiResponse<VehicleType>> => {
  try {
    return await $fetch<ApiResponse<VehicleType>>(
      `${API_GATEWAY_URL}/v2/vehicle/update-vehicle/${data.id}`,
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
