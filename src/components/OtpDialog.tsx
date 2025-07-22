"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useEffect, useRef, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { mutationFn } from "@/lib/mutationFn";
import { toast } from "sonner";
import { ThreeDotLoader } from "./ui/three-dot-loader";
import { cn } from "@/lib/utils";

interface OtpDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  email: string;
  onSuccess: () => void;
}

const OTP_LENGTH = 6;

export function OtpDialog({
  open,
  onOpenChange,
  email,
  onSuccess,
}: OtpDialogProps) {
  const [otpValues, setOtpValues] = useState<string[]>(Array(OTP_LENGTH).fill(""));
  const inputRefs = useRef<Array<HTMLInputElement | null>>([]);

  const verifyOtpMutation = useMutation({
    mutationFn: mutationFn,
    onSuccess: () => {
      toast.success("OTP verified successfully");
      onOpenChange(false);
      onSuccess();
    },
    onError: (error: unknown) => {
      toast("OTP verification failed", {
        description: error instanceof Error ? error.message : "Unknown error",
      });
    },
  });

  const handleChange = (index: number, value: string) => {
    if (!/^\d?$/.test(value)) return;

    const updated = [...otpValues];
    updated[index] = value;
    setOtpValues(updated);

    if (value && index < OTP_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !otpValues[index]) {
      if (index > 0) inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerify = () => {
    const otp = otpValues.join("");
    if (otp.length !== OTP_LENGTH) {
      toast("OTP must be 6 digits");
      return;
    }

    verifyOtpMutation.mutateAsync({
      url: "/auth/verify-email",
      body: { email, otp },
    });
  };

  useEffect(() => {
    if (open) setOtpValues(Array(OTP_LENGTH).fill(""));
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle>Verify OTP</DialogTitle>
          <DialogDescription>
            Enter the 6-digit code sent to <b>{email}</b>
          </DialogDescription>
        </DialogHeader>

        <div className="flex justify-center gap-2 my-4">
          {otpValues.map((val, index) => (
            <input
              key={index}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={val}
              onChange={(e) => handleChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              ref={(el) => {
                inputRefs.current[index] = el;
              }}
              className={cn(
                "w-10 h-12 text-center text-lg font-semibold rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500",
                verifyOtpMutation.isPending && "opacity-50"
              )}
              disabled={verifyOtpMutation.isPending}
            />
          ))}
        </div>

        <DialogFooter>
          <Button
            onClick={handleVerify}
            disabled={verifyOtpMutation.isPending}
            className="w-full cursor-pointer"
          >
            {verifyOtpMutation.isPending ? (
              <ThreeDotLoader className="bg-white" />
            ) : (
              "Verify"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
