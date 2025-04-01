import type { RouteNameType, RouteType } from "~/types/RouteType";
import type { ApiResponse } from "./ApiResponse";

const API_GATEWAY_URL = "http://localhost:3002";
export const createRouteAPI = async (data: RouteType): Promise<ApiResponse<RouteType>> => {
    try {
        return await $fetch<ApiResponse<RouteType>>(
            `${API_GATEWAY_URL}/v2/route/create-route`,
            {
                method: "POST",
                body: data,
            }
        );
    } catch (error) {
        console.error("Error:", error);
        throw error;
    }
}
export const getRoutesByCompanyAPI = async (id: number): Promise<ApiResponse<RouteType[]>> => {
    try {
        return await $fetch<ApiResponse<RouteType[]>>(
            `${API_GATEWAY_URL}/v2/route/get-route-by-company/${id}`,
            {
                method: "GET",
            }
        );
    } catch (error) {
        console.error("Error:", error);
        throw error;
    }
}

export const updateRouteAPI = async (data: RouteType): Promise<ApiResponse<RouteType>> => {
    try {
        return await $fetch<ApiResponse<RouteType>>(
            `${API_GATEWAY_URL}/v2/route/update-route/${data.id}`,
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
export const deleteRouteAPI = async (id: number): Promise<ApiResponse<void>> => {
    try {
        return await $fetch<ApiResponse<void>>(
            `${API_GATEWAY_URL}/v2/route/delete-route/${id}`,
            {
                method: "DELETE",
            }
        );
    } catch (error) {
        console.error("Error:", error);
        throw error;
    }
}
export const getRoutesNameAPI = async (companyId: number): Promise<ApiResponse<RouteNameType[]>> => {
    try {
        return await $fetch<ApiResponse<RouteNameType[]>>(
            `${API_GATEWAY_URL}/v2/route/get-routes-name-by-company/${companyId}`,
            {
                method: "GET",
            }
        );
    } catch (error) {
        console.error("Error:", error);
        throw error;
    }
}
export const moveTopRouteAPI = async (id: number): Promise<ApiResponse<RouteType>> => {
    try {
        return await $fetch<ApiResponse<RouteType>>(
            `${API_GATEWAY_URL}/v2/route/move-top-route/${id}`,
            {
                method: "PUT",
            }
        );
    } catch (error) {
        console.error("Error:", error);
        throw error;
    }
}