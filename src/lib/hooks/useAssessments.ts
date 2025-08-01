import { useQuery } from "@tanstack/react-query";
import axiosInstance from "@/lib/axiosInstance";
import { Assessment, Chat } from "@/types";

export function useAssessments() {
  return useQuery({
    queryKey: ["assessments"],
    queryFn: async () => {
      const res = await axiosInstance.get("/assessment");
      return res.data.data as Assessment[];
    },
  });
}

export function useAssessmentChats(assessmentId: string) {
  return useQuery({
    queryKey: ["assessmentChats", assessmentId],
    queryFn: async () => {
      console.log("xyz...");
      const res = await axiosInstance.get(`/assessment/${assessmentId}/chats`);
      console.log("testing...", res);
      return res.data.data.chats as Chat[];
    },
    enabled: !!assessmentId,
  });
}
