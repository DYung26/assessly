"use client";

import { mutationFn } from "@/lib/mutationFn";
import { useMutation } from "@tanstack/react-query";
import { Volume2, Loader2, Square } from "lucide-react";
import { useState, useRef } from "react";

export default function ReadAloud({ text }: { text: string }) {
  const [isReading, setIsReading] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const readAloudMutation = useMutation({
    mutationFn: mutationFn,
    onMutate: () => setIsLoading(true),
    onSuccess: (data) => {
      const url = data.data.download_url;
      console.log("Received signed URL:", url);

      if (audioRef.current) {
        // attach URL to the unlocked audio element
        audioRef.current.src = url;
        audioRef.current.play().catch((err) => {
          console.error("Playback failed:", err);
          setIsReading(false);
        });
      }

    },
    onError: (error: unknown) => {
      if (error instanceof Error) {
        console.error("Read aloud failed:", error.message);
      }
    },
    onSettled: () => {
      // If we never started reading, make sure state is reset
      setIsLoading(false);
      if (!audioRef.current || audioRef.current.paused) {
        setIsReading(false);
      }
    },
  });

  const handleReadAloud = async () => {
    if (isReading && audioRef.current) {
      // Stop current playback
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      setIsReading(false);
      return;
    }

    // Create new audio instance
    const audio = new Audio();
    audioRef.current = audio;

    // Mark reading state
    setIsReading(true);

    // Handle when audio finishes
    audio.onended = () => {
      setIsReading(false);
    };

    // Play the audio
    /*audio.play().catch((err) => {
      console.error("Playback failed:", err);
      setIsReading(false);
    });*/

    audio.play().catch(() => {
      /* ignore, since no src yet */
    });

    // Trigger backend request for signed URL
    await readAloudMutation.mutateAsync({
      url: "/audio/tts",
      body: { text },
    });
  };

  return (
    <button
      onClick={handleReadAloud}
      className="flex items-center justify-center p-2 rounded-full cursor-pointer hover:bg-gray-200 disabled:opacity-50"
      disabled={isLoading}
    >
      {isLoading ? (
        <Loader2 className="animate-spin" />
      ) : isReading ? (
        <Square size={18} className="w-4 h-4" />
      ) : (
        <Volume2 size={18} className="w-4 h-4" />
      )}
    </button>
  );
}

/*
const utterance = new SpeechSynthesisUtterance(`If you need worked examples, block diagram equivalents, or transfer function formulas for specific electrical/mechanical systems, please specify!`);
window.speechSynthesis.speak(utterance);
 */
