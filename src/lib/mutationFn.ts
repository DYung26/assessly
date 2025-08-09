import axios from "axios";
import axiosInstance from "./axiosInstance";

type MutationArgs<T = unknown> = {
  url: string;
  method?: "POST" | "PUT" | "DELETE";
  body?: T;
  isStream?: boolean;
  onChunk?: (chunk: string) => Promise<void>;
  onDone?: () => void;
};

export async function mutationFn({ url, method = "POST", body, isStream, onChunk, onDone }: MutationArgs) {
  const accessToken = typeof window !== "undefined" ? localStorage.getItem("accessToken") : null;
  if (isStream) {
    const res = await fetch(process.env.NEXT_PUBLIC_API_URL + url, {
      method: "POST",
      headers: {
	"Content-Type": "application/json",
	"Authorization": `Bearer ${accessToken}`,
      },
      body: JSON.stringify(body),
    });

    let buffer = "";
    const reader = res.body!.getReader();
    const decoder = new TextDecoder();

    while (true) {
      const { value, done } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const parts = buffer.split("\n\n");
      buffer = parts.pop()!;

      for (const rawEvt of parts) {
        let data = rawEvt
          .replace(/^data:\s?/gm, "");
        console.log("[server chunk]", data, data.length);
        if (data.length === 0) data = "\n\n\n";

        if (onChunk) {
          await onChunk(data);
        }
      }
    }

    onDone?.();
    return;
  }

  try {
    const { data } = await axiosInstance({
      url,
      method,
      data: body,
      headers: body instanceof FormData ? { "Content-Type": undefined } : undefined,
    });

    return data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      if (error.response) {
        throw new Error(
	  `${error.response.status}: ${error.response.data.message || error.response.data}`
	);
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
