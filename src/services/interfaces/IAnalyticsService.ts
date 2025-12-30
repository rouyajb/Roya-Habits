import { AnalyticsEvent } from '@/types';

/**
 * Analytics Service Interface
 */
export interface IAnalyticsService {
  /**
   * Initialize analytics
   */
  initialize(): Promise<void>;

  /**
   * Track an event
   */
  trackEvent(event: AnalyticsEvent, metadata?: Record<string, string | number | boolean>): Promise<void>;

  /**
   * Set user properties
   */
  setUserProperties(userId: string, properties: Record<string, string | number | boolean>): Promise<void>;

  /**
   * Check if user has consented to analytics
   */
  hasConsent(): Promise<boolean>;

  /**
   * Set analytics consent
   */
  setConsent(granted: boolean): Promise<void>;
}