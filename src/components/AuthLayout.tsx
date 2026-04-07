import Link from "next/link";
import { ReactNode } from "react";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen grid place-items-center bg-white relative">
      <header className="absolute top-0 left-0 w-full px-4 sm:px-6 md:px-8 py-3 sm:py-4">
        <Link href="/" className="text-2xl sm:text-3xl font-bold text-gray-800">
	  Assessly
	</Link>
      </header>

      <main className="w-full max-w-md px-4 sm:px-6 pt-16 sm:pt-20">{children}</main>
    </div>
  );
}
