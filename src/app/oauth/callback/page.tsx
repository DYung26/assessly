"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/lib/store/auth";
import axiosInstance from "@/lib/axiosInstance";
import { toast } from "sonner";
import PageLoader from "@/components/PageLoader";
import { User } from "@/types";

function OAuthCallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const redirectUrl = searchParams.get("redirect") || "/";

  useEffect(() => {
    const handleCallback = async () => {
      try {
        const code = searchParams.get("code");
        const state = searchParams.get("state");
        const errorParam = searchParams.get("error");

        if (errorParam) {
          setError(errorParam);
          toast("OAuth failed", {
            description: `Error: ${errorParam}`,
          });
          setTimeout(() => router.push("/login"), 2000);
          return;
        }

        if (!code || !state) {
          setError("Invalid OAuth parameters");
          toast("OAuth failed", {
            description: "Missing OAuth parameters",
          });
          setTimeout(() => router.push("/login"), 2000);
          return;
        }

        const res = await axiosInstance.get("/oauth/google/callback", {
          params: { code, state },
        });
        const user = res.data.data.user as User;
        const token = res.data.data.access_token as string;

        if (token && user) {
          login(user, token);
          router.push(redirectUrl);
        } else {
          setError("Failed to authenticate");
          toast("Authentication failed", {
            description: "Unable to complete OAuth flow",
          });
          setTimeout(() => router.push("/login"), 2000);
        }
      } catch (err) {
        const message = err instanceof Error ? err.message : "Unknown error";
        setError(message);
        toast("OAuth error", {
          description: message,
        });
        setTimeout(() => router.push("/login"), 2000);
      }
    };

    handleCallback();
  }, [searchParams, redirectUrl, router, login]);

  if (error) {
    return (
      <div className="min-h-screen grid place-items-center bg-white">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">Authentication Error</h1>
          <p className="text-muted-foreground mb-4">{error}</p>
          <p className="text-sm text-muted-foreground">Redirecting to login...</p>
        </div>
      </div>
    );
  }

  return <PageLoader />;
}

export default function OAuthCallback() {
  return (
    <Suspense fallback={<PageLoader />}>
      <OAuthCallbackContent />
    </Suspense>
  );
}
