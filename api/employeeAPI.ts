import type { ApiResponse } from './ApiResponse';
import type { AccountType } from "~/types/AccountType";

const API_GATEWAY_URL = "http://localhost:3002";
export const createAccountAPI = async (data: AccountType): Promise<ApiResponse<AccountType>> => {
    console.log(data);
    try {
        return await $fetch<ApiResponse<AccountType>>(
            `${API_GATEWAY_URL}/v1/account/create-account`,
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
export const getAllAccountByCompanyAPI = async (id: string): Promise<ApiResponse<AccountType>> => {
    try {
        return await $fetch<ApiResponse<AccountType>>(
            `${API_GATEWAY_URL}/v1/account/get-all-account-by-company/${id}`
        );
    } catch (error) {
        console.error("Error:", error);
        throw error;
    }
}
export const updateAccountAPI = async (data: AccountType): Promise<ApiResponse<AccountType>> => {
    try {
        return await $fetch<ApiResponse<AccountType>>(
            `${API_GATEWAY_URL}/v1/account/update-account-info/${data._id}`,
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
export const deleteAccountAPI = async (id: string): Promise<ApiResponse<void>> => {
    try {
        return await $fetch<ApiResponse<void>>(
            `${API_GATEWAY_URL}/v1/account/delete-account/${id}`,
            {
                method: "DELETE",
            }
        );
    } catch (error) {
        console.error("Error:", error);
        throw error;
    }
}

