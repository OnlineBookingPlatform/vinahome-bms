import type { OfficeNameType, OfficeType } from "~/types/OfficeType";
import type { ApiResponse } from "./ApiResponse";

const API_GATEWAY_URL = "http://localhost:3002";
export const createOfficeAPI = async (data: OfficeType): Promise<ApiResponse<OfficeType>> => {
    try {
        return await $fetch<ApiResponse<OfficeType>>(
            `${API_GATEWAY_URL}/v2/office/create-office`,
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
export const getOfficesByCompanyAPI = async (companyId: number): Promise<ApiResponse<OfficeType[]>> => {
    try {
        return await $fetch<ApiResponse<OfficeType[]>>(
            `${API_GATEWAY_URL}/v2/office/get-offices-by-company/${companyId}`,
            {
                method: "GET",
            }
        );
    } catch (error) {
        console.error("Error:", error);
        throw error;
    }
}
export const updateOfficeAPI = async (data: OfficeType): Promise<ApiResponse<OfficeType>> => {
    try {
        return await $fetch<ApiResponse<OfficeType>>(
            `${API_GATEWAY_URL}/v2/office/update-office/${data.id}`,
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
export const deleteOfficeAPI = async (id: number): Promise<ApiResponse<void>> => {
    try {
        return await $fetch<ApiResponse<void>>(
            `${API_GATEWAY_URL}/v2/office/delete-office/${id}`,
            {
                method: "DELETE",
            }
        );
    } catch (error) {
        console.error("Error:", error);
        throw error;
    }
}
export const getOfficesNameAPI = async (companyId: number): Promise<ApiResponse<OfficeNameType[]>> => {
    try {
        return await $fetch<ApiResponse<OfficeNameType[]>>(
            `${API_GATEWAY_URL}/v2/office/get-office-name-by-company/${companyId}`,
            {
                method: "GET",
            }
        );
    } catch (error) {
        console.error("Error:", error);
        throw error;
    }
}