import axios from "axios";
import axiosInstance from "./axiosInstance";

type MutationBody = BodyInit | Record<string, unknown> | null | undefined;

type MutationArgs = {
  url: string;
  method?: "POST" | "PUT" | "DELETE";
  body?: MutationBody;
  isStream?: boolean;
  onChunk?: (chunk: string) => Promise<void>;
  onDone?: () => void;
};

export async function mutationFn({ url, method = "POST", body, isStream, onChunk, onDone }: MutationArgs) {
  const accessToken = typeof window !== "undefined"
    ? localStorage.getItem("accessToken")
    : null;

  if (isStream) {
    const headers: Record<string, string> = {};
    let fetchBody: MutationBody = body;

    if (accessToken) headers["Authorization"] = `Bearer ${accessToken}`;

    if (body instanceof FormData) {
      fetchBody = body;
    } else {
      headers["Content-Type"] = "application/json";
      fetchBody = JSON.stringify(body);
    }

    const res = await fetch(process.env.NEXT_PUBLIC_API_URL + url, {
      method: "POST",
      headers,
      body: fetchBody,
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
