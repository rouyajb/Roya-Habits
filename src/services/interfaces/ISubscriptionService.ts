import { Subscription, SubscriptionPlan, Entitlements } from '@/types';

/**
 * Subscription Service Interface
 */
export interface ISubscriptionService {
  /**
   * Get subscription for a user
   */
  getSubscription(userId: string): Promise<Subscription>;

  /**
   * Get entitlements based on subscription
   */
  getEntitlements(userId: string): Promise<Entitlements>;

  /**
   * Check if user has a specific entitlement
   */
  hasEntitlement(userId: string, feature: keyof Entitlements): Promise<boolean>;

  /**
   * Create a checkout session for upgrading
   */
  createCheckoutSession(userId: string, plan: SubscriptionPlan): Promise<{ url: string }>;

  /**
   * Handle successful checkout
   */
  handleCheckoutSuccess(sessionId: string): Promise<void>;

  /**
   * Cancel subscription
   */
  cancelSubscription(userId: string): Promise<void>;

  /**
   * Update subscription (upgrade/downgrade)
   */
  updateSubscription(userId: string, newPlan: SubscriptionPlan): Promise<Subscription>;

  /**
   * Get billing portal URL
   */
  getBillingPortalUrl(userId: string): Promise<{ url: string }>;
}