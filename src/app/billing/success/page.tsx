'use client';

import { useEffect, useState } from 'react';
import { CheckCircle2, AlertCircle, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useRouter, useSearchParams } from 'next/navigation';
import { useSubscription } from '@/hooks/useSubscription';
import { useEntitlements } from '@/hooks/useEntitlements';
import { useModalURL } from '@/hooks/useModalURL';
import { getCheckoutStatus } from '@/services/billing';
import type { CheckoutStatusResponse } from '@/types/billing';

export default function BillingSuccessPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const { openAt: openPricingModalAt } = useModalURL('pricing');
  
  const [checkoutStatus, setCheckoutStatus] = useState<CheckoutStatusResponse | null>(null);
  const [isPolling, setIsPolling] = useState(true);
  const [pollCount, setPollCount] = useState(0);
  const { subscription, refetch: refetchSubscription } = useSubscription();
  const { refetch: refetchEntitlements } = useEntitlements();

  // Poll checkout status to see if payment is confirmed and subscription synced
  useEffect(() => {
    if (!sessionId || !isPolling) return;

    let pollTimeout: NodeJS.Timeout;
    const maxPolls = 12; // ~30 seconds at 2.5s intervals

    const pollCheckoutStatus = async () => {
      try {
        const status = await getCheckoutStatus(sessionId);
        setCheckoutStatus(status);
        
        // If state is "active", we're done - stop polling
        if (status.state === 'active') {
          setIsPolling(false);
          // Refresh local data
          await Promise.all([refetchSubscription(), refetchEntitlements()]);
          return;
        }

        // If we've polled too many times, stop
        if (pollCount >= maxPolls) {
          setIsPolling(false);
          // Even if still "confirming", at least get the latest local state
          await Promise.all([refetchSubscription(), refetchEntitlements()]);
          return;
        }

        // Schedule next poll
        setPollCount(prev => prev + 1);
        pollTimeout = setTimeout(pollCheckoutStatus, 2500);
      } catch (error) {
        console.error('Failed to check checkout status:', error);
        // On error, still stop after max polls
        if (pollCount >= maxPolls) {
          setIsPolling(false);
        } else {
          setPollCount(prev => prev + 1);
          pollTimeout = setTimeout(pollCheckoutStatus, 2500);
        }
      }
    };

    pollCheckoutStatus();
    return () => clearTimeout(pollTimeout);
  }, [sessionId, isPolling, pollCount, refetchSubscription, refetchEntitlements]);

  const planName = subscription?.plan === 'pro_monthly'
    ? 'Pro Monthly'
    : subscription?.plan === 'pro_yearly'
    ? 'Pro Yearly'
    : 'Free';

  // Determine UI based on checkout status
  const getStateDisplay = () => {
    if (!checkoutStatus) {
      return {
        title: 'Processing Payment',
        description: 'We\'re verifying your payment...',
        icon: <Clock className="w-16 h-16 text-blue-500 animate-spin" />,
      };
    }

    switch (checkoutStatus.state) {
      case 'active':
        return {
          title: 'Payment Successful',
          description: 'Your subscription is now active.',
          icon: <CheckCircle2 className="w-16 h-16 text-green-500 animate-in fade-in zoom-in duration-500" />,
        };
      case 'confirming':
        return {
          title: 'Confirming Your Subscription',
          description: 'We\'ve received your payment. Activating your plan...',
          icon: <Clock className="w-16 h-16 text-amber-500 animate-pulse" />,
        };
      case 'open':
        return {
          title: 'Checkout Incomplete',
          description: 'Your checkout session is still open.',
          icon: <AlertCircle className="w-16 h-16 text-yellow-500" />,
        };
      case 'error':
        return {
          title: 'Unable to Verify Payment',
          description: 'We couldn\'t verify your payment status, but it may still have gone through. Please check your email or try refreshing.',
          icon: <AlertCircle className="w-16 h-16 text-red-500" />,
        };
      default:
        return {
          title: 'Processing',
          description: 'Please wait while we process your payment...',
          icon: <Clock className="w-16 h-16 text-blue-500 animate-spin" />,
        };
    }
  };

  const stateDisplay = getStateDisplay();
  const isActive = checkoutStatus?.state === 'active';
  const isConfirming = checkoutStatus?.state === 'confirming';

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="w-full max-w-md text-center space-y-8">
        {/* Status Icon */}
        <div className="flex justify-center">
          {stateDisplay.icon}
        </div>

        {/* Title and Description */}
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-foreground">{stateDisplay.title}</h1>
          <p className="text-muted-foreground">{stateDisplay.description}</p>
        </div>

        {/* Plan Info - Show if we have status info */}
        {checkoutStatus && (
          <div className="bg-muted rounded-lg p-4 space-y-2">
            <p className="text-sm text-muted-foreground">
              {isActive ? 'Your active plan' : 'Current plan'}
            </p>
            <p className="text-lg font-semibold text-foreground">{planName}</p>
            {subscription?.current_period_end && (
              <p className="text-xs text-muted-foreground">
                {isActive ? 'Renews on' : 'Will renew on'} {new Date(subscription.current_period_end).toLocaleDateString()}
              </p>
            )}
          </div>
        )}

        {/* Polling Indicator */}
        {isPolling && (
          <div className="bg-blue-50 dark:bg-blue-950 rounded-lg p-3 space-y-2">
            <p className="text-sm text-blue-700 dark:text-blue-300">
              {isConfirming ? 'Syncing your subscription...' : 'Checking payment status...'}
            </p>
            <div className="h-1 bg-blue-200 dark:bg-blue-800 rounded-full overflow-hidden">
              <div className="h-full bg-blue-500 animate-pulse" />
            </div>
          </div>
        )}

        {/* Delayed Sync Message */}
        {!isPolling && isConfirming && (
          <div className="bg-amber-50 dark:bg-amber-950 rounded-lg p-3">
            <p className="text-sm text-amber-700 dark:text-amber-300">
              Your payment appears complete, but your subscription is still syncing. Please refresh in a moment.
            </p>
          </div>
        )}

        {/* Actions */}
        <div className="space-y-2 pt-4">
          <Button
            onClick={() => router.push('/')}
            className="w-full cursor-pointer"
            size="lg"
          >
            {isActive ? 'Continue to App' : 'Go Home'}
          </Button>
          {isConfirming || (!isPolling && isConfirming) && (
            <Button
              onClick={async () => {
                setIsPolling(true);
                setPollCount(0);
              }}
              variant="outline"
              className="w-full cursor-pointer"
              size="lg"
            >
              Refresh Status
            </Button>
          )}
          <Button
            onClick={() => openPricingModalAt('/')}
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
