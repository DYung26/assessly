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
import { mutationFn } from "@/lib/mutationFn";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { useEffect, useState } from "react";
import { ThreeDotLoader } from "./ui/three-dot-loader";
import { useAuth } from "@/lib/store/auth";

const loginSchema = z.object({
  email: z.email({ message: "Invalid email address" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
});

type LoginSchema = z.infer<typeof loginSchema>;

export default function LoginForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { login } = useAuth();

  useEffect(() => {
    console.log("isSubmitting updated:", isSubmitting);
  }, [isSubmitting]);

  const form = useForm<LoginSchema>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const router = useRouter()

  const loginMutation = useMutation({
    mutationFn: mutationFn,
    onMutate: () => setIsSubmitting(true),
    onSettled: () => setIsSubmitting(false),
    onSuccess: (data) => {
      login(data.data.user, data.data.access_token);
      router.push("/");
    },
    onError: (error: unknown) => {
      if (error instanceof Error) {
        toast("Login failed", {
          description: error.message,
          // variant: "destructive",
        });
      }
    },
  });

  const onSubmit = (data: LoginSchema) => {
    // console.log("Submitted:", data);
    loginMutation.mutateAsync({
      url: "/auth/login",
      body: data,
    })
  };

  return (
    <div className="mt-10 p-4">
      <h2 className="text-4xl font-bold mb-4 text-center">Welcome back</h2>
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

          <Button
            type="submit"
            className="w-full cursor-pointer"
            disabled={isSubmitting}
          >
            {isSubmitting ? <ThreeDotLoader className="bg-white"/> : "Sign In"}
          </Button>
        </form>
      </Form>
      <div className="text-sm text-center text-muted-foreground">
        Don’t have an account?{" "}
        <Link href="/signup" className="text-blue-600 hover:underline">
          Sign up
        </Link>
      </div>
    </div>
  );
}
