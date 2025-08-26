"use client";

import { useQuery } from "@tanstack/react-query";
import axiosInstance from "@/lib/axiosInstance";
import { Message } from "@/types";
// import { useEffect } from "react";
// import { useMessageStore } from "../store/message";

export function useMessages(chatId: string) {
  // const { setMessages } = useMessageStore();

  const query = useQuery({
    queryKey: ["messages", chatId],
    queryFn: async () => {
      const res = await axiosInstance.get(`/chat/${chatId}/messages`);
      return res.data.data.messages as Message[];
    },
    enabled: !!chatId,
    staleTime: Infinity,
    refetchOnWindowFocus: false,   // don’t refetch on focus
    refetchOnReconnect: false,
    refetchOnMount: false,
  });

  /*const {
    data,
    isSuccess,
    /*isError,
    error,
    isLoading,
  } = query;*/

  /*useEffect(() => {
    if (isSuccess && data) {
      setMessages(chatId, data);
      // useMessageStore.getState().setMessages(data);
    }
  }, [isSuccess, setMessages, chatId, data]);*/

  return query;
}

