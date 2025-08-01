"use client";

import Link from "next/link";
import { Button } from "./ui/button";
import UserMenu from "./UserMenu";
import { useUser } from "@/lib/hooks/useUser";
import PageLoader from "./PageLoader";
import { useEffect, useState } from "react";

export default function Header() {
  const { data: user, isLoading } = useUser();

  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  // only show overlay *after* hydration, never during SSR/hydration
  if (mounted && isLoading) return <PageLoader />;

  return (
    <header className=" fixed top-0 left-0 right-0 w-full px-8 py-4 shadow-sm bg-white z-10">
      <div className="flex items-center justify-between max-w-7xl mx-auto">
        <Link href="/" className="text-2xl font-bold text-gray-800">
          Assessly
        </Link>
        {user ? (
          <UserMenu />
        ) : (
          <div className="flex gap-4">
            <Button asChild><Link href="/login">Login</Link></Button>
            <Button asChild variant="outline"><Link href="/signup">Sign Up</Link></Button>
          </div>
        )}
      </div>
    </header>
  );
}
