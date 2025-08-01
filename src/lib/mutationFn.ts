import axios from "axios";
import axiosInstance from "./axiosInstance";

type MutationArgs<T = unknown> = {
  url: string;
  method?: "POST" | "PUT" | "DELETE";
  body?: T;
  isStream?: boolean;
  onChunk?: (chunk: string) => void;
};

export async function mutationFn({ url, method = "POST", body, isStream, onChunk }: MutationArgs) {
  
  if (isStream) {
    const accessToken = typeof window !== "undefined" ? localStorage.getItem("accessToken") : null;
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}${url}`, {
      method,
      headers: {
        "Content-Type": "application/json",
	"Authorization": `Bearer ${accessToken}`
      },
      body: body ? JSON.stringify(body) : undefined,
    });

    if (!response.body) throw new Error("No response body");

    const reader = response.body.getReader();
    const decoder = new TextDecoder("utf-8");

    let fullMessage = "";

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      const chunk = decoder.decode(value, { stream: true });
      fullMessage += chunk;

      if (onChunk) onChunk(chunk);
    }

    return { content: fullMessage };
  }


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
