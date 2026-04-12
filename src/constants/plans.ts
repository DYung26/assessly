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
      'Up to 5 active assessments',
      'Up to 5 assessment files per assessment',
      'Up to 10 MB per assessment file',
      '1 message attachment per message',
      'Up to 10 MB per message attachment',
      'Audio-to-text unavailable',
      'Realtime voice agent unavailable',
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
      'Unlimited active assessments',
      'Up to 50 assessment files per assessment',
      'Up to 50 MB per assessment file',
      'Up to 10 message attachments per message',
      'Up to 25 MB per message attachment',
      'Audio-to-text enabled',
      'Realtime voice agent enabled',
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
      'Unlimited active assessments',
      'Up to 50 assessment files per assessment',
      'Up to 50 MB per assessment file',
      'Up to 10 message attachments per message',
      'Up to 25 MB per message attachment',
      'Audio-to-text enabled',
      'Realtime voice agent enabled',
    ],
    badge: 'Best Value',
    savingsNote: 'Same Pro features, billed yearly',
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
