import type { EntitlementsResponse } from '@/types/billing';
import axiosInstance from '@/lib/axiosInstance';
import { getEntitlementsForPlan } from '@/constants/entitlements';

/**
 * Entitlements service layer.
 *
 * This service fetches entitlements data for the authenticated user.
 *
 * Current implementation:
 * - Primary: Calls real API endpoint GET /billing/entitlements
 * - Fallback: MockEntitlementsAdapter for development/offline testing (optional)
 *
 * Architecture note:
 * - Adapter pattern allows fallback to mock if needed
 * - All consumers (hooks, components) use getEntitlements()
 * - The backend derives entitlements from the user's current subscription
 */

/**
 * Adapter interface for entitlements data sources.
 * Defines what an entitlements data provider must implement.
 */
interface EntitlementsAdapter {
  getEntitlements(): Promise<EntitlementsResponse>;
}

/**
 * Real API adapter - calls backend GET /billing/entitlements endpoint.
 * This is the primary implementation used in production.
 *
 * Note: The axios base URL already includes /api, so the path is just /billing/entitlements
 */
class ApiEntitlementsAdapter implements EntitlementsAdapter {
  async getEntitlements(): Promise<EntitlementsResponse> {
    const response = await axiosInstance.get('/billing/entitlements');

    // Backend returns { message, data: { plan, tier, entitlements } }
    if (response.data?.data) {
      return response.data.data as EntitlementsResponse;
    }

    throw new Error('No entitlements data in response');
  }
}

/**
 * Mock adapter - uses hardcoded data from constants/entitlements.ts
 * Kept as a fallback for development/testing but not the active implementation.
 */
class MockEntitlementsAdapter implements EntitlementsAdapter {
  async getEntitlements(): Promise<EntitlementsResponse> {
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 100));
    // Mock assumes free plan - in real usage, backend provides actual plan
    return getEntitlementsForPlan('free');
  }
}

/**
 * Get the active entitlements adapter.
 * Defaults to real API. Can be overridden via environment variable for development.
 */
function getAdapter(): EntitlementsAdapter {
  // Use real API by default; mock only if explicitly enabled for development
  const useMock = process.env.NEXT_PUBLIC_USE_MOCK_ENTITLEMENTS === 'true';
  return useMock ? new MockEntitlementsAdapter() : new ApiEntitlementsAdapter();
}

/**
 * Fetch entitlements for the authenticated user.
 *
 * This is the primary function used by hooks and components.
 * It delegates to the active adapter, making the data source transparent.
 *
 * Note: The backend derives entitlements from the user's current subscription,
 * so no plan parameter is needed. The user must be authenticated.
 *
 * @returns Promise with entitlements response containing plan, tier, and entitlements
 * @throws Will throw if adapter fails (should be caught and handled gracefully in UI)
 */
export async function getEntitlements(): Promise<EntitlementsResponse> {
  const adapter = getAdapter();
  return adapter.getEntitlements();
}
