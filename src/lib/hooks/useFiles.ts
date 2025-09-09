import { useQuery } from "@tanstack/react-query";
import axiosInstance from "../axiosInstance";
import { FileType } from "@/types";

export function useFiles(fileId: string) {
  return useQuery({
    queryKey: ["file", fileId],
    queryFn: async () => {
      const res = await axiosInstance.get(`/files/${fileId}`);
      console.log("Fetched file data:", res.data);
      return res.data.data as FileType;
    },
    staleTime: 1000 * 60 * 5, // cache for 5 mins
    enabled: !!fileId,
  });
}
