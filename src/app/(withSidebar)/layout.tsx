"use client";

import Sidebar from "@/components/Sidebar";
import { useUser } from "@/lib/hooks/useUser";
import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function SidebarLayout({ children }: { children: React.ReactNode }) {
  const { data: user } = useUser();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  return (
    <div className="flex flex-1 pt-16 h-screen overflow-hidden">
      {user && (
        <>
          {/* Mobile menu button */}
          <div className="md:hidden fixed top-16 left-4 z-20">
            <Button
              size="icon"
              variant="ghost"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="rounded-lg"
            >
              {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
            </Button>
          </div>

          {/* Sidebar - hidden on mobile unless toggled */}
          <div
            className={`fixed md:relative z-10 h-screen bg-gray-100 transition-transform duration-300 ${
              isMobile
                ? sidebarOpen
                  ? "translate-x-0"
                  : "-translate-x-full"
                : "translate-x-0"
            } md:translate-x-0 md:block`}
          >
            <Sidebar onClose={() => setSidebarOpen(false)} />
          </div>

          {/* Mobile overlay */}
          {isMobile && sidebarOpen && (
            <div
              className="fixed inset-0 bg-black/50 z-5 md:hidden"
              onClick={() => setSidebarOpen(false)}
            />
          )}
        </>
      )}
      <div className="flex flex-col flex-1 overflow-hidden w-full">
        {children}
      </div>
    </div>
  );
}
