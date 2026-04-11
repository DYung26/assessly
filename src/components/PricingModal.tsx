'use client';

import { useState, useCallback } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { PlanCard } from './PlanCard';
import { getAllPlans } from '@/constants/plans';
import { createCheckoutSession } from '@/services/billing';
import { useSubscription } from '@/hooks/useSubscription';
import { useModalURL } from '@/hooks/useModalURL';
import { toast } from 'sonner';
import type { PlanType } from '@/types/billing';

/**
 * Pricing modal for plan selection.
 *
 * This is now a URL-driven modal controlled via hash (#pricing).
 * It opens automatically when the URL hash is set to #pricing,
 * and closes when the hash is removed.
 *
 * This allows:
 * - Deep linking: /settings#pricing opens the modal
 * - Stripe cancel redirects: backend can set cancel_url to include #pricing
 * - Browser back/forward: naturally returns to previous URL state
 *
 * Features:
 * - 3 plan cards (Free, Pro Monthly, Pro Yearly)
 * - Real subscription state from backend
 * - Checkout flow with loading states
 * - Error handling with toast notifications
 * - Full-page modal overlay
 * - URL-addressable for deep linking and redirect support
 */
export function PricingModal() {
  const [loadingPlan, setLoadingPlan] = useState<PlanType | null>(null);
  const { subscription } = useSubscription();
  const { isOpen, close, handleOpenChange } = useModalURL('pricing');

  const handleSelectPlan = useCallback(
    async (planId: PlanType) => {
      if (planId === 'free' || loadingPlan) return;

      setLoadingPlan(planId);

      try {
        const result = await createCheckoutSession({
          plan: planId,
        });

        if (result.url) {
          // Redirect to Stripe Checkout
          window.location.assign(result.url);
        } else {
          toast.error('Failed to create checkout session');
          setLoadingPlan(null);
        }
      } catch (error) {
        console.error('Checkout error:', error);
        toast.error('Failed to start checkout. Please try again.');
        setLoadingPlan(null);
      }
    },
    [loadingPlan],
  );

  const plans = getAllPlans();

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent 
        className="w-full h-full max-w-none max-h-none p-0 rounded-none border-none gap-0 top-0 left-0 translate-x-0 translate-y-0 sm:max-w-none"
        showCloseButton={false}
      >
        {/* Full page overlay with scroll container */}
        <div className="flex flex-col w-full h-full overflow-y-auto bg-background">
          {/* Header */}
          <div className="sticky top-0 bg-background border-b px-4 py-1 z-40 shadow-sm">
            <div className="max-w-7xl mx-auto">
              <DialogHeader className="text-center">
                <DialogTitle className="text-2xl">Choose Your Plan</DialogTitle>
                <DialogDescription className="text-sm">
                  Upgrade to unlock premium Assessly features and take your assessments to the next level.
                </DialogDescription>
              </DialogHeader>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 p-6 md:p-8 flex flex-col items-center">
            {/* Plan Cards Grid */}
            <div className="grid grid-cols-1 gap-6 md:grid-cols-3 max-w-7xl w-full">
            {plans.map((plan) => (
                <PlanCard
                  key={plan.id}
                  name={plan.name}
                  displayPrice={plan.displayPrice}
                  billingFrequency={plan.billingFrequency}
                  features={plan.features}
                  badge={plan.badge}
                  savingsNote={plan.savingsNote}
                  ctaLabel={plan.ctaLabel}
                  isCurrentPlan={subscription.plan === plan.id}
                  isSelectable={plan.isSelectable}
                  isLoading={loadingPlan === plan.id}
                  onSelect={() => handleSelectPlan(plan.id)}
                />
              ))}
            </div>

            {/* Footer */}
            <div className="mt-12 pt-6 border-t text-center text-sm text-muted-foreground max-w-7xl w-full">
              <p>All plans include a 14-day free trial. No credit card required to get started.</p>
            </div>
          </div>

          {/* Close button in top-right corner */}
          <button
            onClick={close}
            className="absolute top-8 right-20 z-50 rounded-xs opacity-70 transition-opacity hover:opacity-100 focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:outline-none disabled:pointer-events-none cursor-pointer"
            aria-label="Close"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M18 6l-12 12M6 6l12 12" />
            </svg>
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

