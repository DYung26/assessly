import { useQuery } from '@tanstack/react-query';
import { getEntitlements } from '@/services/entitlements';
import type { EntitlementsResponse } from '@/types/billing';

/**
 * Hook to fetch and manage entitlements for the current user.
 *
 * The backend derives entitlements directly from the authenticated user's
 * current subscription, so this hook no longer needs to depend on useSubscription().
 *
 * Usage:
 *   const { entitlements, isLoading, error } = useEntitlements();
 *   if (entitlements) {
 *     const canUploadFile = file.size <= entitlements.entitlements.max_assessment_file_size_mb * 1024 * 1024;
 *   }
 *
 * Error handling:
 * - On error, returns null entitlements (UI should handle gracefully)
 * - Logs error for debugging but doesn't crash the app
 */
export function useEntitlements() {
  const {
    data: entitlements,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ['entitlements'],
    queryFn: async () => {
      try {
        return await getEntitlements();
      } catch (err) {
        // Log error but don't throw - let UI handle gracefully
        console.warn(
          'Failed to fetch entitlements, using free plan defaults:',
          err,
        );

        // Return safe default: free tier restrictions
        return {
          plan: 'free' as const,
          tier: 'free' as const,
          entitlements: {
            max_active_assessments: 5,
            max_assessment_files_per_assessment: 5,
            max_assessment_file_size_mb: 10,
            max_message_attachments_per_message: 1,
            max_message_attachment_size_mb: 10,
            audio_to_text_enabled: false,
            realtime_voice_agent_enabled: false,
          },
        } as EntitlementsResponse;
      }
    },
    staleTime: 10 * 60 * 1000, // 10 minutes
    gcTime: 30 * 60 * 1000, // 30 minutes (formerly cacheTime)
    retry: 1,
  });

  return {
    entitlements: entitlements || null,
    isLoading,
    error: error instanceof Error ? error.message : null,
    refetch,
  };
}

/**
 * Helper hook to check if a specific feature is enabled for the current user.
 *
 * Usage:
 *   const canUseAudioToText = useCanUseFeature('audio_to_text');
 *
 * @param feature - The entitlement feature key to check
 * @returns boolean indicating if feature is enabled
 */
export function useCanUseFeature(
  feature: keyof typeof FEATURE_ENABLE_MAP,
): boolean {
  const { entitlements } = useEntitlements();

  if (!entitlements) return false;

  return entitlements.entitlements[FEATURE_ENABLE_MAP[feature]] || false;
}

/**
 * Map from friendly feature names to entitlements object keys.
 * Makes it easier to check feature availability without memorizing the exact key.
 */
const FEATURE_ENABLE_MAP = {
  audio_to_text: 'audio_to_text_enabled',
  realtime_voice_agent: 'realtime_voice_agent_enabled',
} as const;

/**
 * Helper hook to get a specific limit value.
 *
 * Usage:
 *   const maxFiles = useEntitlementLimit('max_assessment_files_per_assessment');
 *
 * @param limit - The limit key to retrieve
 * @returns number representing the limit, or null if unlimited
 */
export function useEntitlementLimit(
  limit: keyof typeof LIMIT_KEY_MAP,
): number | null {
  const { entitlements } = useEntitlements();

  if (!entitlements) return null;

  const actualKey = LIMIT_KEY_MAP[limit];
  return entitlements.entitlements[actualKey] ?? null;
}

/**
 * Map from friendly limit names to entitlements object keys.
 */
const LIMIT_KEY_MAP = {
  max_active_assessments: 'max_active_assessments',
  max_assessment_files_per_assessment: 'max_assessment_files_per_assessment',
  max_assessment_file_size_mb: 'max_assessment_file_size_mb',
  max_message_attachments_per_message: 'max_message_attachments_per_message',
  max_message_attachment_size_mb: 'max_message_attachment_size_mb',
} as const;
