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
    staleTime: 1000 * 60 * 5, // Cache is fresh for 5 minutes
    gcTime: 1000 * 60 * 30, // Keep in memory for 30 minutes to prevent garbage collection on unmount
    refetchOnWindowFocus: false, // Don't refetch on window focus
    refetchInterval: false, // No automatic refetch
    enabled: !!fileId,
  });
}

export function useAssessmentFiles(assessmentId: string) {
  return useQuery({
    queryKey: ["assessment-files", assessmentId],
    queryFn: async () => {
      const res = await axiosInstance.get(`/assessment/${assessmentId}/files`);
      console.log("Fetched assessment files:", res.data);
      return res.data.data.items as FileType[];
    },
    staleTime: 1000 * 60 * 5, // Cache is fresh for 5 minutes
    gcTime: 1000 * 60 * 30, // Keep in memory for 30 minutes to prevent garbage collection on unmount
    refetchOnWindowFocus: false, // Don't refetch on window focus
    refetchInterval: false, // No automatic refetch
    enabled: !!assessmentId,
  });
}
