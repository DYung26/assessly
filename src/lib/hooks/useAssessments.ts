import { useQuery } from "@tanstack/react-query";
import axiosInstance from "@/lib/axiosInstance";
import { Assessment } from "@/types";

export function useAssessments(userId: string) {
  return useQuery({
    queryKey: ["assessments", userId],
    queryFn: async () => {
      const res = await axiosInstance.get("/assessment");
      return res.data.data as Assessment[];
    },
  });
}
