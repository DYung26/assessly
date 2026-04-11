import axiosInstance from '@/lib/axiosInstance';
import type { 
  CreateCheckoutSessionInput, 
  CreateCheckoutSessionResult,
  CreatePortalSessionResult,
  SubscriptionData,
} from '@/types/billing';

/**
 * Frontend billing service.
 * Abstracts API details for subscription and checkout operations.
 * 
 * All methods communicate with the backend billing API endpoints:
 * - POST /billing/checkout-session
 * - GET /billing/subscription
 * - POST /billing/portal-session
 */

/**
 * Create a checkout session for the given plan.
 *
 * Calls backend: POST /billing/checkout-session
 * Request: { plan: 'pro_monthly' | 'pro_yearly' }
 * Response: { message, data: { url } }
 *
 * @param input - The plan to create checkout session for
 * @returns Promise with checkout URL
 * @throws Will throw if request fails
 */
export async function createCheckoutSession(
  input: CreateCheckoutSessionInput,
): Promise<CreateCheckoutSessionResult> {
  try {
    const response = await axiosInstance.post('/billing/checkout-session', input);
    
    // Backend returns { message, data: { url } }
    if (response.data?.data?.url) {
      return { url: response.data.data.url };
    }
    
    throw new Error('No checkout URL in response');
  } catch (error) {
    console.error('Checkout session creation failed:', error);
    throw error;
  }
}

/**
 * Get the current user's subscription data.
 *
 * Calls backend: GET /billing/subscription
 * Response: { message, data: { plan, status, is_paid, ... } }
 *
 * @returns Promise with current subscription data
 * @throws Will throw if request fails (but should fail gracefully in UI)
 */
export async function getCurrentSubscription(): Promise<SubscriptionData> {
  try {
    const response = await axiosInstance.get('/billing/subscription');
    
    // Backend returns { message, data: { plan, status, is_paid, ... } }
    if (response.data?.data) {
      return response.data.data as SubscriptionData;
    }
    
    throw new Error('No subscription data in response');
  } catch (error) {
    console.error('Subscription fetch failed:', error);
    throw error;
  }
}

/**
 * Create a Stripe Customer Portal session.
 *
 * Calls backend: POST /billing/portal-session
 * Response: { message, data: { url } }
 *
 * Use this to allow users to manage their subscription,
 * update payment method, view invoices, etc.
 *
 * @returns Promise with portal session URL
 * @throws Will throw if request fails
 */
export async function createPortalSession(): Promise<CreatePortalSessionResult> {
  try {
    const response = await axiosInstance.post('/billing/portal-session');
    
    // Backend returns { message, data: { url } }
    if (response.data?.data?.url) {
      return { url: response.data.data.url };
    }
    
    throw new Error('No portal URL in response');
  } catch (error) {
    console.error('Portal session creation failed:', error);
    throw error;
  }
}
