import { SubscriptionPlan } from '@/types';

/**
 * Stripe webhook event type
 */
export interface StripeWebhookEvent {
  id: string;
  type: string;
  data: {
    object: Record<string, unknown>;
  };
}

/**
 * Payment Service Interface (Stripe integration)
 */
export interface IPaymentService {
  /**
   * Initialize Stripe
   */
  initialize(): Promise<void>;

  /**
   * Create a checkout session
   */
  createCheckoutSession(params: {
    userId: string;
    plan: SubscriptionPlan;
    successUrl: string;
    cancelUrl: string;
  }): Promise<{ sessionId: string; url: string }>;

  /**
   * Create a billing portal session
   */
  createBillingPortalSession(customerId: string, returnUrl: string): Promise<{ url: string }>;

  /**
   * Verify webhook signature
   */
  verifyWebhookSignature(payload: string, signature: string): boolean;

  /**
   * Handle webhook event
   */
  handleWebhookEvent(event: StripeWebhookEvent): Promise<void>;
}