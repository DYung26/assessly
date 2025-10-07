"use client";

import { useRef, useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { setupVoiceAgent } from "@/lib/voiceAgent";
import { Button } from "@/components/ui/button";
import { mutationFn } from "@/lib/mutationFn";
import { useMutation } from "@tanstack/react-query";
import { RealtimeSession } from "@openai/agents-realtime";

interface VoiceAgentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function VoiceAgentDialog({
  open,
  onOpenChange,
}: VoiceAgentDialogProps) {
  const [connecting, setConnecting] = useState(false);
  const [activeSession, setActiveSession] = useState(false);
  const sessionRef = useRef<RealtimeSession | null>(null);

  const ephemeralKeyMutation = useMutation({
    mutationFn: mutationFn,
  });

  const fetchEphemeralKey = async () => {
    const response = await ephemeralKeyMutation.mutateAsync({
      url: "/auth/ephemeral",
    });
    console.log("Ephemeral key response:", response.data);
    return response.data;
  };

  const startVoiceAgent = async () => {
    try {
      setConnecting(true);
      const ephemeralKey = await fetchEphemeralKey();
      const session = await setupVoiceAgent(ephemeralKey);
      console.log("Voice session active:", session);
      sessionRef.current = session;
      setActiveSession(true);

      /*(session as any).on("disconnected", () => {
        console.log("Voice session disconnected.");
        setActiveSession(false);
        sessionRef.current = null;
      });*/
    } catch (err) {
      console.error(err);
    } finally {
      setConnecting(false);
    }
  };

  const stopVoiceAgent = async () => {
    try {
      const session = sessionRef.current;
      if (session) {
        session.close();
        sessionRef.current = null;
        console.log("Voice session closed.");
      }
    } catch (err) {
      console.error("Error closing voice session:", err);
    } finally {
      setActiveSession(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="flex flex-col items-center justify-center">
        <DialogHeader>
          <DialogTitle>Voice Assistant</DialogTitle>
          <DialogDescription>
            Start a voice session with the AI assistant.
          </DialogDescription>
        </DialogHeader>

        <Button
          onClick={activeSession ? stopVoiceAgent : startVoiceAgent}
          disabled={connecting}
          className="cursor-pointer"
        >
          {
            connecting
            ? "Connecting..."
            : activeSession
              ? "End Voice Session"
              : "Start Voice Session"
          }
        </Button>
      </DialogContent>
    </Dialog>
  );
}

