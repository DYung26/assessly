"use client";

import { z } from "zod/v4";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { mutationFn } from "@/lib/mutationFn";
import { toast } from "sonner";
import { ThreeDotLoader } from "./ui/three-dot-loader";
import { useState } from "react";
import { OtpDialog } from "./OtpDialog";

const signupSchema = z
  .object({
    email: z.email({ message: "Invalid email address" }),
    firstName: z.string().min(1, "First name is required"),
    lastName: z.string().min(1, "Last name is required"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type SignupSchema = z.infer<typeof signupSchema>;

export default function SignupForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [otpDialogOpen, setOtpDialogOpen] = useState(false);
  const [emailForOtp, setEmailForOtp] = useState("");

  const form = useForm<SignupSchema>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      email: "",
      firstName: "",
      lastName: "",
      password: "",
      confirmPassword: "",
    },
  });

  const router = useRouter()

  const signupMutation = useMutation({
    mutationFn: mutationFn,
    onMutate: () => setIsSubmitting(true),
    onSettled: () => setIsSubmitting(false),
    onSuccess: () => {
      setEmailForOtp(form.getValues("email"));
      setOtpDialogOpen(true);
    },
    onError: (error: unknown) => {
      if (error instanceof Error) {
        toast("Signup failed", {
          description: error.message,
        });
      }
    },
  });

  const onSubmit = (data: SignupSchema) => {
    const payload = {
      email: data.email,
      first_name: data.firstName,
      last_name: data.lastName,
      password: data.password,
    }
    // console.log("Signup data:", payload);
    signupMutation.mutateAsync({
      url: "/auth/signup",
      body: payload,
    })
  };

  return (
    <div className="mt-10 p-4">
      <h2 className="text-4xl font-bold mb-4 text-center">Create an account</h2>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    placeholder="you@example.com"
                    {...field}
                    disabled={isSubmitting}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="firstName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>First Name</FormLabel>
                <FormControl>
                  <Input
                    type="text"
                    placeholder="First name"
                    {...field}
                    disabled={isSubmitting}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="lastName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Last Name</FormLabel>
                <FormControl>
                  <Input
                    type="text"
                    placeholder="Last name"
                    {...field}
                    disabled={isSubmitting}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    placeholder="••••••••"
                    {...field}
                    disabled={isSubmitting}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Confirm Password</FormLabel>
                <FormControl>
                  <Input 
                    type="password"
                    placeholder="••••••••"
                    {...field}
                    disabled={isSubmitting}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button
            type="submit"
            className="w-full cursor-pointer"
            disabled={isSubmitting}
          >
            {isSubmitting ? <ThreeDotLoader className="bg-white"/> : "Sign Up"}
          </Button>
        </form>
      </Form>

      <OtpDialog
        open={otpDialogOpen}
        onOpenChange={setOtpDialogOpen}
        email={emailForOtp}
        onSuccess={() => router.push("/login")}
      />

      <div className="text-sm text-center text-muted-foreground mt-4">
        Already have an account?{" "}
        <Link href="/login" className="text-blue-600 hover:underline">
          Sign in
        </Link>
      </div>
    </div>
  );
}
