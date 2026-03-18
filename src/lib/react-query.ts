import { QueryClient } from "@tanstack/react-query";
import axiosInstance from "./axiosInstance";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryFn: async ({ queryKey }) => {
	const [url] = queryKey as [string];
        const { data } = await axiosInstance.get(url);
        return data;
      },
      refetchInterval: false,
      refetchOnWindowFocus: false,
      staleTime: Infinity,
      gcTime: 1000 * 60 * 30, // Keep cache in memory for 30 minutes
      retry: false,
    },
    mutations: {
      retry: false,
    },
  },
});
