"use client";

import { useMutation } from "@tanstack/react-query";
import axiosInstance from "@/lib/axiosInstance";
import { mutationFn } from "@/lib/mutationFn";

interface OAuthLoginResponse {
  data: {
    auth_url: string;
  };
}

interface OAuthStatusResponse {
  data: {
    status: "not_connected" | "connected";
  };
}

export function useOAuth() {
  const getGoogleLoginUrl = async (): Promise<string> => {
    const res = await axiosInstance.get<OAuthLoginResponse>("/oauth/google/login");
    return res.data.data.auth_url;
  };

  const checkGoogleStatus = async (): Promise<boolean> => {
    const res = await axiosInstance.get<OAuthStatusResponse>("/oauth/google/status");
    return res.data.data.status === "connected";
  };

  const disconnectGoogle = async (): Promise<void> => {
    await mutationFn({
      url: "/oauth/google/disconnect",
      method: "DELETE",
    });
  };

  const googleLoginMutation = useMutation({
    mutationFn: getGoogleLoginUrl,
  });

  const googleStatusMutation = useMutation({
    mutationFn: checkGoogleStatus,
  });

  const disconnectMutation = useMutation({
    mutationFn: disconnectGoogle,
  });

  return {
    getGoogleLoginUrl: googleLoginMutation.mutateAsync,
    checkGoogleStatus: googleStatusMutation.mutateAsync,
    disconnect: disconnectMutation.mutateAsync,
    isLoading: googleLoginMutation.isPending || googleStatusMutation.isPending,
    isDisconnecting: disconnectMutation.isPending,
  };
}
