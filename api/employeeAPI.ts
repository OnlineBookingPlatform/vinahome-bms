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

