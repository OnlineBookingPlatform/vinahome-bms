import type {
  PointNameType,
  PointOfRouteType,
  PointType,
} from "~/types/PointType";
import type { ApiResponse } from "./ApiResponse";

const API_GATEWAY_URL = "http://localhost:3002";
export const createPointAPI = async (
  data: PointType
): Promise<ApiResponse<PointType>> => {
  try {
    return await $fetch<ApiResponse<PointType>>(
      `${API_GATEWAY_URL}/v2/point/create-point`,
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
export const getPointsByCompanyAPI = async (
  id: number
): Promise<ApiResponse<PointType[]>> => {
  try {
    return await $fetch<ApiResponse<PointType[]>>(
      `${API_GATEWAY_URL}/v2/point/get-points-by-company/${id}`,
      {
        method: "GET",
      }
    );
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
};
export const updatePointAPI = async (
  data: PointType
): Promise<ApiResponse<PointType>> => {
  try {
    return await $fetch<ApiResponse<PointType>>(
      `${API_GATEWAY_URL}/v2/point/update-point/${data.id}`,
      {
        method: "PUT",
        body: data,
      }
    );
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
};
export const deletePointAPI = async (
  id: number
): Promise<ApiResponse<void>> => {
  try {
    return await $fetch<ApiResponse<void>>(
      `${API_GATEWAY_URL}/v2/point/delete-point/${id}`,
      {
        method: "DELETE",
      }
    );
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
};
export const getPointsNameByCompanyAPI = async (
  companyId: number
): Promise<ApiResponse<PointNameType[]>> => {
  try {
    return await $fetch<ApiResponse<PointNameType[]>>(
      `${API_GATEWAY_URL}/v2/point/get-point-name-by-company/${companyId}`,
      {
        method: "GET",
      }
    );
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
};

export const createPointOfRouteAPI = async (
  data: PointOfRouteType[]
): Promise<ApiResponse<PointOfRouteType[]>> => {
  try {
    return await $fetch<ApiResponse<PointOfRouteType[]>>(
      `${API_GATEWAY_URL}/v2/point/create-point-of-route`,
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
export const getPointOfRouteByRouteAPI = async (
  routeId: number
): Promise<ApiResponse<PointOfRouteType[]>> => {
  try {
    return await $fetch<ApiResponse<PointOfRouteType[]>>(
      `${API_GATEWAY_URL}/v2/point/get-point-of-route-by-route/${routeId}`,
      {
        method: "GET",
      }
    );
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
};
