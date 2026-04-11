import type { PlanType } from '@/types/billing';

/**
 * Plan metadata catalog.
 * Centralized source of truth for all plan information.
 * This drives rendering and validation throughout the app.
 *
 * TODO: When backend is ready, plan data will be fetched from API
 * and this will become the default/fallback configuration.
 */

type PlanMetadata = {
  id: PlanType;
  name: string;
  price: number;
  currency: string;
  billingPeriod: 'month' | 'year';
  displayPrice: string;
  billingFrequency: string;
  features: string[];
  badge?: string;
  ctaLabel: string;
  isSelectable: boolean;
  savingsNote?: string;
};

export const PLAN_CATALOG: Record<PlanType, PlanMetadata> = {
  free: {
    id: 'free',
    name: 'Free',
    price: 0,
    currency: 'USD',
    billingPeriod: 'month',
    displayPrice: '$0',
    billingFrequency: 'forever',
    features: [
      'Basic assessment creation',
      'Up to 5 active assessments',
      'Standard templates',
      'Community support',
    ],
    ctaLabel: 'Current Plan',
    isSelectable: false,
  },
  pro_monthly: {
    id: 'pro_monthly',
    name: 'Pro Monthly',
    price: 10,
    currency: 'USD',
    billingPeriod: 'month',
    displayPrice: '$10',
    billingFrequency: '/month',
    features: [
      'Unlimited assessments',
      'Advanced AI-powered features',
      'Priority support',
      'Custom branding',
      'Advanced analytics',
    ],
    ctaLabel: 'Upgrade to Pro Monthly',
    isSelectable: true,
  },
  pro_yearly: {
    id: 'pro_yearly',
    name: 'Pro Yearly',
    price: 100,
    currency: 'USD',
    billingPeriod: 'year',
    displayPrice: '$100',
    billingFrequency: '/year',
    features: [
      'Unlimited assessments',
      'Advanced AI-powered features',
      'Priority support',
      'Custom branding',
      'Advanced analytics',
      'Early access to new features',
    ],
    badge: 'Best Value',
    savingsNote: 'Save $20/year',
    ctaLabel: 'Upgrade to Pro Yearly',
    isSelectable: true,
  },
};

/**
 * Get plan metadata by ID.
 */
export function getPlanMetadata(planId: PlanType): PlanMetadata {
  return PLAN_CATALOG[planId];
}

/**
 * Get all selectable (paid) plans.
 */
export function getSelectablePlans(): PlanMetadata[] {
  return Object.values(PLAN_CATALOG).filter((plan) => plan.isSelectable);
}

/**
 * Get all plans in order (free, monthly, yearly).
 */
export function getAllPlans(): PlanMetadata[] {
  return [PLAN_CATALOG.free, PLAN_CATALOG.pro_monthly, PLAN_CATALOG.pro_yearly];
}
