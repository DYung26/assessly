"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useOAuth } from "@/lib/hooks/useOAuth";
import { useAuth } from "@/lib/store/auth";
import { toast } from "sonner";

interface ConnectedAppsProps {
  onProviderStatusChange?: () => void;
}

export function ConnectedApps({ onProviderStatusChange }: ConnectedAppsProps) {
  const { user } = useAuth();
  const { getGoogleLoginUrl, disconnect, isDisconnecting } = useOAuth();
  const [googleConnected, setGoogleConnected] = useState(false);
  const [isLinking, setIsLinking] = useState(false);

  useEffect(() => {
    if (user?.oauth_providers) {
      setGoogleConnected(
        user.oauth_providers.some(
          (provider) => provider.provider_name === "google"
        )
      );
    }
  }, [user]);

  const handleConnectGoogle = async () => {
    try {
      setIsLinking(true);
      const authUrl = await getGoogleLoginUrl();
      window.location.href = authUrl;
    } catch (error) {
      toast("Connection failed", {
        description: error instanceof Error ? error.message : "Unable to connect Google",
      });
      setIsLinking(false);
    }
  };

  const handleDisconnectGoogle = async () => {
    try {
      await disconnect();
      setGoogleConnected(false);
      toast("Google disconnected", {
        description: "Your Google account has been removed.",
      });
      onProviderStatusChange?.();
    } catch (error) {
      toast("Disconnection failed", {
        description: error instanceof Error ? error.message : "Unable to disconnect Google",
      });
    }
  };

  return (
    <>
      <p className="text-sm text-muted-foreground mb-4">Manage connected third-party applications here.</p>
      <div className="space-y-4">
        <div className="flex items-center justify-between p-3 border rounded-lg">
          <div className="flex items-center gap-3">
            <svg className="w-6 h-6" viewBox="0 0 24 24">
              <path
                fill="currentColor"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="currentColor"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="currentColor"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="currentColor"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            <div>
              <h4 className="text-sm font-medium">Google</h4>
              <p className="text-xs text-muted-foreground">
                {googleConnected ? "Connected" : "Not connected"}
              </p>
            </div>
          </div>
          {googleConnected ? (
            <Button
              variant="destructive"
              size="sm"
              onClick={handleDisconnectGoogle}
              disabled={isDisconnecting}
              className="cursor-pointer"
            >
              {isDisconnecting ? "Disconnecting..." : "Disconnect"}
            </Button>
          ) : (
            <Button
              variant="outline"
              size="sm"
              onClick={handleConnectGoogle}
              disabled={isLinking}
              className="cursor-pointer"
            >
              {isLinking ? "Connecting..." : "Connect"}
            </Button>
          )}
        </div>
      </div>
    </>
  );
}
