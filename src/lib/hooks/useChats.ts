import { useQuery } from "@tanstack/react-query";
import axiosInstance from "../axiosInstance";
import { Chat } from "@/types";

export function useAssessmentChats(assessmentId: string) {
  return useQuery({
    queryKey: ["assessmentChats", assessmentId],
    queryFn: async () => {
      const res = await axiosInstance.get(`/assessment/${assessmentId}/chats`);
      return res.data.data.chats as Chat[];
    },
    enabled: !!assessmentId,
  });
}
