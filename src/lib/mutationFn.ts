import axiosInstance from "./axiosInstance";

type MutationArgs = {
  url: string;
  method?: "POST" | "PUT" | "DELETE";
  body?: any;
};

export async function mutationFn({ url, method = "POST", body }: MutationArgs) {
  try {
    const { data } = await axiosInstance({
      url,
      method,
      data: body,
    });

    return data;
  } catch (error: any) {
    if (error.response) {
      throw new Error(`${error.response.status}: ${error.response.data.message || error.response.data}`);
    } else if (error.request) {
      throw new Error("No response from server. Please try again.");
    } else {
      throw new Error(`Request failed: ${error.message}`);
    }
  }
}
