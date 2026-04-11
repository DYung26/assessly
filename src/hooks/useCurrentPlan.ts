import { useAuth } from '@/lib/store/auth';
import type { CurrentSubscription } from '@/types/billing';

/**
 * Hook to access the current user's subscription plan.
 *
 * Returns the user's current plan data, or defaults to 'free' if not set.
 *
 * TODO: When backend is ready, this should fetch real subscription data
 * from the API and update the auth store.
 */
export function useCurrentPlan() {
  const user = useAuth((state) => state.user);

  // Default subscription for users without explicit plan data
  const defaultSubscription: CurrentSubscription = {
    plan: 'free',
    isPaid: false,
    status: 'active',
  };

  const subscription = user?.subscription || defaultSubscription;

  return {
    plan: subscription.plan,
    isPaid: subscription.isPaid,
    status: subscription.status,
    renewsAt: subscription.renewsAt,
    isFreePlan: subscription.plan === 'free',
  };
}
