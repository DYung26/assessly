import { useQuery } from "@tanstack/react-query";
import axiosInstance from "../axiosInstance";
import { Assessment } from "@/types";

export function useAssessment(assessmentId: string) {
  return useQuery({
    queryKey: ["assessment", assessmentId],
    queryFn: async () => {
      const res = await axiosInstance.get(`/assessment/${assessmentId}`);
      return res.data.data as Assessment;
    },
    enabled: !!assessmentId,
  });
}
