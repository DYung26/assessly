/**
 * Billing and subscription types for the frontend.
 * These types are aligned with backend subscription data.
 */

export type PlanType = 'free' | 'pro_monthly' | 'pro_yearly';

export type SubscriptionStatus =
  | 'active'
  | 'inactive'
  | 'trialing'
  | 'past_due'
  | 'canceled'
  | 'incomplete'
  | 'unpaid';

/**
 * Full subscription data from backend GET /billing/subscription
 * This is the authoritative current subscription state.
 */
export type SubscriptionData = {
  plan: PlanType;
  status: SubscriptionStatus;
  is_paid: boolean;
  current_period_end: string | null;
  cancel_at_period_end: boolean;
  stripe_customer_id: string | null;
};

/**
 * Legacy type kept for backwards compatibility.
 * New code should use SubscriptionData directly.
 */
export type CurrentSubscription = {
  plan: PlanType;
  isPaid: boolean;
  status?: SubscriptionStatus;
  renewsAt?: string | null;
};

/**
 * Input for creating a checkout session.
 * Will be sent to the backend billing API.
 */
export type CreateCheckoutSessionInput = {
  plan: 'pro_monthly' | 'pro_yearly';
};

/**
 * API response wrapper from checkout session creation.
 * Backend returns { message, data: { url } }
 */
export type CreateCheckoutSessionResult = {
  url: string;
};

/**
 * API response wrapper from portal session creation.
 * Backend returns { message, data: { url } }
 */
export type CreatePortalSessionResult = {
  url: string;
};

/**
 * Entitlements define what features and resource limits a user has.
 * These are determined by their current subscription plan.
 */
export type Entitlements = {
  max_active_assessments: number | null; // null = unlimited
  max_assessment_files_per_assessment: number;
  max_assessment_file_size_mb: number;
  max_message_attachments_per_message: number;
  max_message_attachment_size_mb: number;
  audio_to_text_enabled: boolean;
  realtime_voice_agent_enabled: boolean;
};

/**
 * Response shape for entitlements query.
 * Maps plan to tier and provides specific entitlements.
 */
export type EntitlementsResponse = {
  plan: PlanType;
  tier: 'free' | 'pro';
  entitlements: Entitlements;
};
