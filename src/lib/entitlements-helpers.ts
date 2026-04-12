/**
 * Entitlements helper utilities.
 *
 * This module provides helper functions for working with entitlements
 * in components without needing to use hooks directly.
 *
 * These are mostly utility functions for formatting and comparisons.
 * Components should still use useEntitlements() hook for reactive state.
 */

import type { Entitlements } from '@/types/billing';

/**
 * Check if a file size exceeds the allowed limit.
 *
 * @param fileSizeBytes - Size of file in bytes
 * @param limitMb - Maximum allowed size in MB
 * @returns true if file exceeds limit
 */
export function isFileSizeExceeded(
  fileSizeBytes: number,
  limitMb: number,
): boolean {
  const limitBytes = limitMb * 1024 * 1024;
  return fileSizeBytes > limitBytes;
}

/**
 * Convert bytes to MB for display.
 *
 * @param bytes - Size in bytes
 * @returns Formatted string like "10.5 MB"
 */
export function formatFileSize(bytes: number): string {
  const mb = bytes / (1024 * 1024);
  return `${mb.toFixed(1)} MB`;
}

/**
 * Format a limit value for display.
 * Handles "unlimited" display for null values.
 *
 * @param limit - Number limit or null for unlimited
 * @param unit - Unit label (e.g., "files", "attachments")
 * @returns Formatted string like "5 files" or "Unlimited"
 */
export function formatLimit(limit: number | null, unit: string): string {
  if (limit === null) {
    return 'Unlimited';
  }
  return `${limit} ${unit}`;
}

/**
 * Check if user is at their assessment count limit.
 *
 * @param currentCount - Current number of active assessments
 * @param entitlements - User's entitlements
 * @returns true if at limit
 */
export function isAtAssessmentLimit(
  currentCount: number,
  entitlements: Entitlements,
): boolean {
  if (entitlements.max_active_assessments === null) {
    // Unlimited
    return false;
  }
  return currentCount >= entitlements.max_active_assessments;
}

/**
 * Get a user-friendly message about assessment limit.
 *
 * @param currentCount - Current number of active assessments
 * @param entitlements - User's entitlements
 * @returns Message string or null if not at limit
 */
export function getAssessmentLimitMessage(
  currentCount: number,
  entitlements: Entitlements,
): string | null {
  if (entitlements.max_active_assessments === null) {
    return null; // Unlimited, no message needed
  }

  const limit = entitlements.max_active_assessments;
  const remaining = Math.max(0, limit - currentCount);

  if (remaining === 0) {
    return `You've reached the limit of ${limit} active assessments on the Free plan. Upgrade to Pro for unlimited assessments.`;
  }

  return `You have ${remaining} active assessment${remaining === 1 ? '' : 's'} remaining on the Free plan.`;
}

/**
 * Check if user is at their message attachment limit.
 *
 * @param currentCount - Current number of attachments in this message
 * @param entitlements - User's entitlements
 * @returns true if at limit
 */
export function isAtAttachmentLimit(
  currentCount: number,
  entitlements: Entitlements,
): boolean {
  return currentCount >= entitlements.max_message_attachments_per_message;
}

/**
 * Get a user-friendly message about attachment limit.
 *
 * @param currentCount - Current number of attachments in this message
 * @param entitlements - User's entitlements
 * @returns Message string or null if not at limit
 */
export function getAttachmentLimitMessage(
  currentCount: number,
  entitlements: Entitlements,
): string | null {
  const limit = entitlements.max_message_attachments_per_message;

  if (currentCount >= limit) {
    return `Maximum ${limit} attachment${limit === 1 ? '' : 's'} per message on your plan.`;
  }

  return null;
}
