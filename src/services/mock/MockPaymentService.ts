import { IPaymentService, StripeWebhookEvent } from '../interfaces/IPaymentService';
import { SubscriptionPlan } from '@/types';

/**
 * Mock Payment Service
 * Simulates Stripe payment integration for prototype
 */
export class MockPaymentService implements IPaymentService {
  async initialize(): Promise<void> {
    console.log('[Payments] Mock Stripe initialized');
  }

  async createCheckoutSession(params: {
    userId: string;
    plan: SubscriptionPlan;
    successUrl: string;
    cancelUrl: string;
  }): Promise<{ sessionId: string; url: string }> {
    console.log('[Payments] Mock checkout session created:', params);

    const sessionId = `mock_session_${Date.now()}`;
    const url = `/mock-checkout?session=${sessionId}&plan=${params.plan}`;

    return { sessionId, url };
  }

  async createBillingPortalSession(customerId: string, returnUrl: string): Promise<{ url: string }> {
    console.log('[Payments] Mock billing portal session:', { customerId, returnUrl });
    return { url: `/mock-billing-portal?customer=${customerId}` };
  }

  verifyWebhookSignature(payload: string, signature: string): boolean {
    console.log('[Payments] Mock webhook signature verification');
    return true; // Always valid in mock
  }

  async handleWebhookEvent(event: StripeWebhookEvent): Promise<void> {
    console.log('[Payments] Mock webhook event received:', event);
    
    // In real implementation, this would:
    // 1. Verify webhook signature
    // 2. Handle different event types:
    //    - checkout.session.completed
    //    - customer.subscription.updated
    //    - customer.subscription.deleted
    //    - invoice.payment_failed
    // 3. Update subscription status in database
  }
}

export const mockPaymentService = new MockPaymentService();