import axios from "axios";
import axiosInstance from "./axiosInstance";

type MutationArgs<T = unknown> = {
  url: string;
  method?: "POST" | "PUT" | "DELETE";
  body?: T;
};

export async function mutationFn({ url, method = "POST", body }: MutationArgs) {
  try {
    const { data } = await axiosInstance({
      url,
      method,
      data: body,
    });

    return data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      if (error.response) {
        throw new Error(`${error.response.status}: ${error.response.data.message || error.response.data}`);
      } else if (error.request) {
        throw new Error("No response from server. Please try again.");
      } else {
        throw new Error(`Request failed: ${error.message}`);
      }
    } else if (error instanceof Error) {
      throw new Error(`Non-Axios error: ${error.message}`);
    } else {
      throw new Error("An unknown error occurred");
    }
  }
}
