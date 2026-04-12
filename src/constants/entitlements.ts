import type { Entitlements, EntitlementsResponse, PlanType } from '@/types/billing';

/**
 * Mock entitlements data for free and pro tiers.
 * 
 * This is a temporary data source that can be replaced with a real API call
 * to GET /api/entitlements once the backend contract is ready.
 * 
 * TODO: Replace with backend API call when available.
 * The entitlements service will check a feature flag or environment variable
 * to determine whether to use this mock or call the real endpoint.
 */

export const FREE_TIER_ENTITLEMENTS: Entitlements = {
  max_active_assessments: 5,
  max_assessment_files_per_assessment: 5,
  max_assessment_file_size_mb: 10,
  max_message_attachments_per_message: 1,
  max_message_attachment_size_mb: 10,
  audio_to_text_enabled: false,
  realtime_voice_agent_enabled: false,
};

export const PRO_TIER_ENTITLEMENTS: Entitlements = {
  max_active_assessments: null, // unlimited
  max_assessment_files_per_assessment: 50,
  max_assessment_file_size_mb: 50,
  max_message_attachments_per_message: 10,
  max_message_attachment_size_mb: 25,
  audio_to_text_enabled: true,
  realtime_voice_agent_enabled: true,
};

/**
 * Get entitlements for a given plan.
 * Used by the mock entitlements adapter.
 */
export function getEntitlementsForPlan(plan: PlanType): EntitlementsResponse {
  const tier = plan === 'free' ? 'free' : 'pro';
  const entitlements =
    tier === 'free' ? FREE_TIER_ENTITLEMENTS : PRO_TIER_ENTITLEMENTS;

  return {
    plan,
    tier,
    entitlements,
  };
}
