import Link from "next/link";
import { ReactNode } from "react";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen grid place-items-center bg-white relative">
      <header className="absolute top-0 left-0 w-full px-8 py-4">
        <Link href="/" className="text-3xl font-bold text-gray-800">
	  Assessly
	</Link>
      </header>

      <main className="w-full max-w-md px-6 pt-20">{children}</main>
    </div>
  );
}
