"use client";

import Sidebar from "@/components/Sidebar";
import { useUser } from "@/lib/hooks/useUser";

export default function SidebarLayout({ children }: { children: React.ReactNode }) {
  const { data: user } = useUser();

  return (
    <div className="flex flex-1 pt-16 h-screen overflow-hidden">
      {user && <Sidebar />}
      <div className="flex flex-col flex-1 overflow-hidden">
        {children}
      </div>
    </div>
  );
}
