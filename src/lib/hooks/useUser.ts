"use client";

import { useQuery } from "@tanstack/react-query";
import axiosInstance from "@/lib/axiosInstance";
import { useAuth } from "@/lib/store/auth";
import { useEffect } from "react";
import { User } from "@/types";

export function useUser() {
  const { accessToken, setUser } = useAuth();

  const query = useQuery({
    queryKey: ["me"],
    queryFn: async () => {
      const res = await axiosInstance.get("/user");
      return res.data.data as User;
    },
    enabled: !!accessToken,
    staleTime: Infinity,
    retry: false,
  });

  const {
    data,
    isSuccess,
    isError,
    error,
    isLoading,
  } = query;

  useEffect(() => {
    if (isSuccess && data) {
      // console.log(data);
      setUser(data);
    }
  }, [isSuccess, setUser, data]);

  useEffect(() => {
    if (isError) {
      console.error("User fetch failed:", error);
    }
  }, [isError, error]);

  useEffect(() => {
    if (!isLoading) {
      useAuth.setState({ loading: false });
    }
  }, [isLoading]);

  return query;
}
