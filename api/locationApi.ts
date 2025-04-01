import type { District, Province, Ward } from "~/types/LocationTyoe";
import type { ApiResponse } from "./ApiResponse";

const API_GATEWAY_URL = "http://localhost:3002";
export const getProvinces = async (): Promise<ApiResponse<Province[]>> => {
    try {
        return await $fetch<ApiResponse<Province[]>>(
            `${API_GATEWAY_URL}/v2/location/provinces`,
            {
                method: "GET",
            }
        );
    } catch (error) {
        console.error("Error fetching provinces:", error);
        throw error;
    }
}
export const getDistricts = async (provinceCode: number): Promise<ApiResponse<District[]>> => {
    try {
        return await $fetch<ApiResponse<District[]>>(
            `${API_GATEWAY_URL}/v2/location/districts?provinceCode=${provinceCode}`,
            {
                method: "GET",
            }
        );
    } catch (error) {
        console.error("Error fetching districts:", error);
        throw error;
    }
}
export const getWards = async (districtCode: number): Promise<ApiResponse<Ward[]>> => {
    try {
        return await $fetch<ApiResponse<Ward[]>>(
            `${API_GATEWAY_URL}/v2/location/wards?districtCode=${districtCode}`,
            {
                method: "GET",
            }
        );
    } catch (error) {
        console.error("Error fetching wards:", error);
        throw error;
    }
}
