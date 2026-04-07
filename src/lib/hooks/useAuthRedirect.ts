"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "./useUser";
import { useAuth } from "@/lib/store/auth";

/**
 * Hook that redirects to /login if user is not authenticated.
 * Use this on protected pages that require authentication.
 */
export function useAuthRedirect() {
  const router = useRouter();
  const { data: user, isLoading } = useUser();
  const { accessToken } = useAuth();

  useEffect(() => {
    // Don't redirect while loading
    if (isLoading) return;

    // If no token in storage and no user data, redirect to login
    if (!accessToken && !user) {
      router.replace("/login");
    }
  }, [accessToken, user, isLoading, router]);
}
