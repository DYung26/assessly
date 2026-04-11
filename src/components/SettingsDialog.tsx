"use client";

import { Dispatch, SetStateAction, useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Settings, Bell, Shield, User2, Link, Loader2 } from "lucide-react";
import { useAuth } from "@/lib/store/auth";
import { useRouter } from "next/navigation";
import { ConnectedApps } from "./ConnectedApps";
import { UpgradePlanButton } from "./UpgradePlanButton";
import { useSubscription } from "@/hooks/useSubscription";
import { useModalURL } from "@/hooks/useModalURL";
import { getPlanMetadata } from "@/constants/plans";
import { createPortalSession } from "@/services/billing";
import { toast } from "sonner";

const languages = [
  { value: "auto", label: "Auto-detect" },
  { value: "en", label: "English" },
  { value: "fr", label: "French" },
  { value: "es", label: "Spanish" },
  { value: "de", label: "German" },
  // Import a JSON or fetch dynamically
];

interface SettingsDialogProps {
  open: boolean;
  onOpenChange: Dispatch<SetStateAction<boolean>>;
}

interface SidebarItemProps {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
  active?: boolean;
}

export function SettingsDialog({ open, onOpenChange }: SettingsDialogProps) {
  const [activeTab, setActiveTab] = useState("general");
  const [theme, setTheme] = useState("system");
  const [language, setLanguage] = useState("auto");
  const [portalLoading, setPortalLoading] = useState(false);
  const { logout } = useAuth();
  const router = useRouter();
  const { subscription } = useSubscription();
  const { open: openPricingModal } = useModalURL('pricing');

  const handleOpenPricing = () => {
    openPricingModal();
  };

  const handleManageBilling = async () => {
    setPortalLoading(true);
    try {
      const result = await createPortalSession();
      if (result.url) {
        window.location.assign(result.url);
      } else {
        toast.error('Failed to open billing portal');
        setPortalLoading(false);
      }
    } catch (error) {
      console.error('Portal session error:', error);
      toast.error('Failed to open billing portal. Please try again.');
      setPortalLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-full max-w-3xl">
        <DialogHeader>
          <DialogTitle>Settings</DialogTitle>
          <DialogDescription>Adjust your preferences and account details.</DialogDescription>
        </DialogHeader>

        <div className="flex gap-6 pt-4">
          {/* Sidebar */}
          <div className="w-1/3 space-y-2 text-sm text-left">
            <SidebarItem icon={<Settings size={16} />} label="General" onClick={() => setActiveTab("general")} active={activeTab === "general"} />
            <SidebarItem icon={<Bell size={16} />} label="Notifications" onClick={() => setActiveTab("notifications")} active={activeTab === "notifications"} />
            <SidebarItem icon={<Link size={16} />} label="Connected Apps" onClick={() => setActiveTab("apps")} active={activeTab === "apps"} />
            <SidebarItem icon={<Shield size={16} />} label="Security" onClick={() => setActiveTab("security")} active={activeTab === "security"} />
            <SidebarItem icon={<User2 size={16} />} label="Account" onClick={() => setActiveTab("account")} active={activeTab === "account"} />
          </div>

          {/* Content Panel */}
          <div className="w-2/3 space-y-6">
            {activeTab === "general" && (
              <>
                <div className="flex justify-between items-center">
                  <label className="text-sm font-medium w-48">Theme</label>
                  <Select value={theme} onValueChange={setTheme}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select theme" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="system">System</SelectItem>
                      <SelectItem value="dark">Dark</SelectItem>
                      <SelectItem value="light">Light</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex justify-between items-center mt-4">
                  <label className="text-sm font-medium">Language</label>
                  <Select value={language} onValueChange={setLanguage}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select language" />
                    </SelectTrigger>
                    <SelectContent>
                      {languages.map(lang => (
                        <SelectItem key={lang.value} value={lang.value}>
                          {lang.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </>
            )}

            {activeTab === "notifications" && (
              <>
                <p className="text-sm text-muted-foreground">Manage how and when we notify you.</p>
                <div className="space-y-2">
                  <label className="flex items-center justify-between">
                    Email notifications
                    <input type="checkbox" className="ml-2 cursor-pointer" />
                  </label>
                  <label className="flex items-center justify-between">
                    Push notifications
                    <input type="checkbox" className="ml-2 cursor-pointer" />
                  </label>
                </div>
              </>
            )}

            {activeTab === "apps" && (
              <ConnectedApps onProviderStatusChange={() => {
                // Provider status changed, could trigger a user data refresh if needed
              }} />
            )}

            {activeTab === "security" && (
              <>
                <div className="flex justify-between items-center">
                  <h4 className="text-sm font-medium">Two-Factor Authentication (2FA)</h4>
                  <Button className="cursor-pointer">Enable 2FA</Button>
                </div>

                <div className="pt-2">
                  <h4 className="text-sm font-medium">Session Management</h4>
                  <div className="flex items-center justify-between">
                    <span>Log out of this device</span>
                    <Button
		                  variant="outline"
                      onClick={() => {
                        logout();
                        router.replace("/login");
                      }}
                      className="cursor-pointer"
                    >
                      Log out
                    </Button>
                  </div>
                  <div className="flex items-center justify-between mt-2">
                    <span>Log out of all devices</span>
                    <Button variant="destructive" className="cursor-pointer">Log out all</Button>
                  </div>
                </div>
              </>
            )}

            {activeTab === "account" && (
              <>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium">Subscription Plan</p>
                      <p className="text-sm text-muted-foreground mt-1">
                        Current plan: <span className="font-semibold text-foreground">{getPlanMetadata(subscription.plan).name}</span>
                      </p>
                    </div>
                    <UpgradePlanButton 
                      label="Upgrade" 
                      onClick={handleOpenPricing}
                      className="gap-2 cursor-pointer"
                    />
                  </div>

                  {/* Manage Billing - Only show for paid subscribers */}
                  {subscription.is_paid && subscription.stripe_customer_id && (
                    <div className="border-t pt-4">
                      <p className="text-sm text-muted-foreground mb-3">
                        Manage your billing, payment method, invoices, and more.
                      </p>
                      <Button
                        onClick={handleManageBilling}
                        disabled={portalLoading}
                        variant="outline"
                        className="cursor-pointer"
                      >
                        {portalLoading ? (
                          <>
                            <Loader2 className="size-4 animate-spin mr-2" />
                            Loading...
                          </>
                        ) : (
                          'Manage Billing'
                        )}
                      </Button>
                    </div>
                  )}
                </div>
                <div className="flex items-center justify-between mt-4">
                  <span>Delete Account</span>
                  <Button variant="destructive" className="cursor-pointer">Delete</Button>
                </div>
              </>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function SidebarItem({ icon, label, onClick, active }: SidebarItemProps) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 px-0 py-1 w-full rounded-md transition-colors ${
        active ? "bg-muted font-semibold" : "hover:bg-muted/50 text-muted-foreground"
      } cursor-pointer`}
    >
      {icon}
      {label}
    </button>
  );
}
