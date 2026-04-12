'use client';

import { useEffect, useState } from 'react';
import { CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { useSubscription } from '@/hooks/useSubscription';
import { useEntitlements } from '@/hooks/useEntitlements';

export default function BillingSuccessPage() {
  const router = useRouter();
  const [isRefreshing, setIsRefreshing] = useState(true);
  const { subscription, isLoading: subscriptionLoading, refetch: refetchSubscription } = useSubscription();
  const { isLoading: entitlementsLoading, refetch: refetchEntitlements } = useEntitlements();

  useEffect(() => {
    // Refetch subscription and entitlements to ensure latest plan is reflected
    const refreshData = async () => {
      await Promise.all([refetchSubscription(), refetchEntitlements()]);
      setIsRefreshing(false);
    };

    refreshData();
  }, [refetchSubscription, refetchEntitlements]);

  const isLoading = subscriptionLoading || entitlementsLoading || isRefreshing;
  const planName = subscription?.plan === 'pro_monthly'
    ? 'Pro Monthly'
    : subscription?.plan === 'pro_yearly'
    ? 'Pro Yearly'
    : 'Free';

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="w-full max-w-md text-center space-y-8">
        {/* Success Icon */}
        <div className="flex justify-center">
          <CheckCircle2 className="w-16 h-16 text-green-500 animate-in fade-in zoom-in duration-500" />
        </div>

        {/* Title */}
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-foreground">Payment Successful</h1>
          <p className="text-muted-foreground">
            Thank you for upgrading your plan.
          </p>
        </div>

        {/* Plan Info */}
        {!isLoading && subscription && (
          <div className="bg-muted rounded-lg p-4 space-y-2">
            <p className="text-sm text-muted-foreground">Your current plan</p>
            <p className="text-lg font-semibold text-foreground">{planName}</p>
            {subscription.current_period_end && (
              <p className="text-xs text-muted-foreground">
                Renews on {new Date(subscription.current_period_end).toLocaleDateString()}
              </p>
            )}
          </div>
        )}

        {isLoading && (
          <div className="bg-muted rounded-lg p-4 space-y-2">
            <p className="text-sm text-muted-foreground">Refreshing your plan...</p>
            <div className="h-2 bg-border rounded-full overflow-hidden">
              <div className="h-full bg-primary/50 animate-pulse" />
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="space-y-2 pt-4">
          <Button
            onClick={() => router.push('/')}
            className="w-full cursor-pointer"
            size="lg"
          >
            Continue to App
          </Button>
          <Button
            onClick={() => router.push('/#pricing')}
            variant="outline"
            className="w-full cursor-pointer"
            size="lg"
          >
            View All Plans
          </Button>
        </div>

        {/* Secondary info */}
        <p className="text-xs text-muted-foreground">
          You can manage your billing and subscription at any time in your settings.
        </p>
      </div>
    </div>
  );
}
