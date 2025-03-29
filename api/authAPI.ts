import type { AuthStoreType, LoginType } from "~/types/AuthType";
import type { ApiResponse } from "./ApiResponse";

const API_GATEWAY_URL = "http://localhost:3002";

export const bmsLoginAPI = async (data: LoginType): Promise<ApiResponse<AuthStoreType>> => {
  console.log(data);
  try {
    return await $fetch<ApiResponse<AuthStoreType>>(
      `${API_GATEWAY_URL}/v1/auth/bms-login`,
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