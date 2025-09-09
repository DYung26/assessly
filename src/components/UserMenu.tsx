"use client";

import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { ChevronRight, HelpCircle, LogOut, Rocket, Settings, User2 } from "lucide-react";
import { SettingsDialog } from "./SettingsDialog";
import { useState } from "react";
import { useAuth } from "@/lib/store/auth";
import { Button } from "./ui/button";

export default function UserMenu() {
  const { user, logout } = useAuth();
  const [settingsOpen, setSettingsOpen] = useState(false);
  const initials = user
    ? `${user.first_name[0] ?? ""}${user.last_name[0] ?? ""}`.toUpperCase()
    : "";

  if (!user) return null;

  return(
    <div>
      <Popover>
        <PopoverTrigger asChild>
          <div className="w-10 h-10 rounded-full bg-black text-white flex
               items-center justify-center font-semibold text-sm 
               cursor-pointer"
          >
            {initials}
          </div>
        </PopoverTrigger>
        <PopoverContent side="bottom" align="end" className="w-60 p-2">
          <div className="flex flex-col gap-1 text-sm text-gray-500 px-2 py-1.5">
            <div className="text-black font-medium">
              {user.first_name.toUpperCase()} {user.last_name.toUpperCase()}
            </div>
            <div className="flex items-center gap-2">
              <User2 size={16} />
              <span>{user.email}</span>
            </div>
          </div>

          <div className="mt-2 space-y-1">
            <Button variant="ghost" className="w-full justify-start gap-2 cursor-pointer">
              <Rocket size={16} />
              Upgrade Plan
            </Button>

            <Button
              variant="ghost"
              className="w-full justify-start gap-2 cursor-pointer"
              onClick={() => setSettingsOpen(true)}
            >
              <Settings size={16} />
              Settings
            </Button>

            <div className="relative group">
              <Button
                variant="ghost"
                className="w-full justify-between gap-2 pr-4 cursor-pointer"
              >
                <span className="flex gap-2 items-center">
                  <HelpCircle size={16} />
                  Help
                </span>
                <ChevronRight size={16} className="text-gray-400" />
              </Button>
              {/* Sub-popover */}
              <div className="absolute top-0 right-full ml-1 hidden group-hover:block z-50
                              bg-white border rounded shadow-md p-2 w-48 text-sm"
              >
                <div className="px-2 py-1 hover:bg-gray-100 cursor-pointer">Terms & Policies</div>
                <div className="px-2 py-1 hover:bg-gray-100 cursor-pointer">Release Notes</div>
                <div className="px-2 py-1 hover:bg-gray-100 cursor-pointer">Help Center</div>
              </div>
            </div>

            <Button
              variant="ghost"
              className="w-full justify-start gap-2 text-red-600 hover:text-red-700
                         cursor-pointer"
              onClick={logout}
            >
              <LogOut size={16} />
                Log Out
            </Button>
          </div>
        </PopoverContent>
      </Popover>

      {/* Settings Dialog */}
      <SettingsDialog open={settingsOpen} onOpenChange={setSettingsOpen} />
    </div>
  );
}
