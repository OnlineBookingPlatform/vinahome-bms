import type { BookingForm, TicketType } from "~/types/TicketType";
import type { ApiResponse } from "./ApiResponse";

const API_GATEWAY_URL = "http://localhost:3002";

export const getTicketByTripIdAPI = async (
  id: number
): Promise<ApiResponse<TicketType[]>> => {
  try {
    return await $fetch<ApiResponse<TicketType[]>>(
      `${API_GATEWAY_URL}/v2/ticket/get-ticket-by-trip/${id}`,
      {
        method: "GET",
      }
    );
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
};

export const updateTicketInfoAPI = async (data: BookingForm): Promise<ApiResponse<TicketType>> => {
  try {
    return await $fetch<ApiResponse<TicketType>>(
      `${API_GATEWAY_URL}/v2/ticket/update-ticket-info-on-bms`,
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
