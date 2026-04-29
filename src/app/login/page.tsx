import { Suspense } from "react";
import AuthLayout from "@/components/AuthLayout";
import LoginForm from "@/components/LoginForm";
import PageLoader from "@/components/PageLoader";

export default function Login() {
  return (
    <AuthLayout>
      <Suspense fallback={<PageLoader />}>
        <LoginForm />
      </Suspense>
    </AuthLayout>
  )
}
