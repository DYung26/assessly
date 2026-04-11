import { useQuery } from '@tanstack/react-query';
import { getCurrentSubscription } from '@/services/billing';
import type { SubscriptionData } from '@/types/billing';

/**
 * Hook to fetch and manage current user's subscription state.
 *
 * This hook queries the backend GET /billing/subscription endpoint
 * and handles loading/error states gracefully.
 *
 * On error (e.g., in local development), returns a safe default (free plan)
 * rather than breaking the pricing UI.
 *
 * Usage:
 *   const { subscription, isLoading, error } = useSubscription();
 *   console.log(subscription.plan); // 'free' | 'pro_monthly' | 'pro_yearly'
 */
export function useSubscription() {
  const {
    data: subscription,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ['subscription'],
    queryFn: async () => {
      try {
        return await getCurrentSubscription();
      } catch (err) {
        // Log the error but don't throw - let UI handle gracefully
        console.warn('Failed to fetch subscription, using free plan default:', err);
        
        // Return safe default instead of breaking the app
        return {
          plan: 'free' as const,
          status: 'active' as const,
          is_paid: false,
          current_period_end: null,
          cancel_at_period_end: false,
          stripe_customer_id: null,
        } as SubscriptionData;
      }
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes (formerly cacheTime)
    retry: 1, // Only retry once on failure
    enabled: true, // Always enabled, safe default on error
  });

  return {
    subscription: subscription || ({
      plan: 'free' as const,
      status: 'active' as const,
      is_paid: false,
      current_period_end: null,
      cancel_at_period_end: false,
      stripe_customer_id: null,
    } as SubscriptionData),
    isLoading,
    error: error instanceof Error ? error.message : null,
    refetch,
  };
}
