import { IAnalyticsService } from '../interfaces/IAnalyticsService';
import { AnalyticsEvent } from '@/types';
import { localStorageService } from './LocalStorageService';

/**
 * Local Analytics Service
 * Logs analytics events to console for prototype
 */
export class LocalAnalyticsService implements IAnalyticsService {
  private readonly CONSENT_KEY = 'analytics_consent';
  private initialized = false;

  async initialize(): Promise<void> {
    if (this.initialized) return;
    
    console.log('[Analytics] Initialized (Local/Console mode)');
    this.initialized = true;
  }

  async trackEvent(event: AnalyticsEvent, metadata?: Record<string, string | number | boolean>): Promise<void> {
    const hasConsent = await this.hasConsent();
    
    if (!hasConsent) {
      console.log('[Analytics] Event blocked (no consent):', event);
      return;
    }

    console.log('[Analytics] Event:', {
      event,
      metadata,
      timestamp: new Date().toISOString(),
    });
  }

  async setUserProperties(userId: string, properties: Record<string, string | number | boolean>): Promise<void> {
    const hasConsent = await this.hasConsent();
    
    if (!hasConsent) {
      console.log('[Analytics] User properties blocked (no consent)');
      return;
    }

    console.log('[Analytics] User properties:', {
      userId,
      properties,
    });
  }

  async hasConsent(): Promise<boolean> {
    const consent = localStorageService.getItem<boolean>(this.CONSENT_KEY);
    return consent === true;
  }

  async setConsent(granted: boolean): Promise<void> {
    localStorageService.setItem(this.CONSENT_KEY, granted);
    console.log('[Analytics] Consent updated:', granted);
  }
}

export const localAnalyticsService = new LocalAnalyticsService();