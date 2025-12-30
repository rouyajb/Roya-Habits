/**
 * Service Factory
 * Central place to configure which service implementations to use
 * 
 * To switch from Local to Supabase:
 * 1. Import Supabase implementations
 * 2. Update the factory methods to return Supabase instances
 * 3. Ensure environment variables are set
 */

import { IAuthService } from './interfaces/IAuthService';
import { IHabitsRepository } from './interfaces/IHabitsRepository';
import { IMoodRepository } from './interfaces/IMoodRepository';
import { IJournalRepository } from './interfaces/IJournalRepository';
import { ISubscriptionService } from './interfaces/ISubscriptionService';
import { IPaymentService } from './interfaces/IPaymentService';
import { IAnalyticsService } from './interfaces/IAnalyticsService';

// Local implementations
import { LocalAuthService } from './local/LocalAuthService';
import { LocalHabitsRepository } from './local/LocalHabitsRepository';
import { LocalMoodRepository } from './local/LocalMoodRepository';
import { LocalJournalRepository } from './local/LocalJournalRepository';
import { LocalSubscriptionService } from './local/LocalSubscriptionService';
import { MockPaymentService } from './mock/MockPaymentService';
import { LocalAnalyticsService } from './local/LocalAnalyticsService';

// Supabase implementations (stubs for now)
// import { SupabaseAuthService } from './supabase/SupabaseAuthService';
// import { SupabaseHabitsRepository } from './supabase/SupabaseHabitsRepository';

/**
 * Configuration flag to switch between implementations
 * Set to true when Supabase backend is ready
 */
const USE_SUPABASE = false;

class ServiceFactory {
  private authService: IAuthService | null = null;
  private habitsRepository: IHabitsRepository | null = null;
  private moodRepository: IMoodRepository | null = null;
  private journalRepository: IJournalRepository | null = null;
  private subscriptionService: ISubscriptionService | null = null;
  private paymentService: IPaymentService | null = null;
  private analyticsService: IAnalyticsService | null = null;

  getAuthService(): IAuthService {
    if (!this.authService) {
      if (USE_SUPABASE) {
        // this.authService = new SupabaseAuthService();
        throw new Error('Supabase not yet configured. Set USE_SUPABASE to false.');
      } else {
        this.authService = new LocalAuthService();
      }
    }
    return this.authService;
  }

  getHabitsRepository(): IHabitsRepository {
    if (!this.habitsRepository) {
      if (USE_SUPABASE) {
        // this.habitsRepository = new SupabaseHabitsRepository();
        throw new Error('Supabase not yet configured. Set USE_SUPABASE to false.');
      } else {
        this.habitsRepository = new LocalHabitsRepository();
      }
    }
    return this.habitsRepository;
  }

  getMoodRepository(): IMoodRepository {
    if (!this.moodRepository) {
      if (USE_SUPABASE) {
        // TODO: Implement SupabaseMoodRepository
        throw new Error('Supabase not yet configured. Set USE_SUPABASE to false.');
      } else {
        this.moodRepository = new LocalMoodRepository();
      }
    }
    return this.moodRepository;
  }

  getJournalRepository(): IJournalRepository {
    if (!this.journalRepository) {
      if (USE_SUPABASE) {
        // TODO: Implement SupabaseJournalRepository
        throw new Error('Supabase not yet configured. Set USE_SUPABASE to false.');
      } else {
        this.journalRepository = new LocalJournalRepository();
      }
    }
    return this.journalRepository;
  }

  getSubscriptionService(): ISubscriptionService {
    if (!this.subscriptionService) {
      if (USE_SUPABASE) {
        // TODO: Implement SupabaseSubscriptionService
        throw new Error('Supabase not yet configured. Set USE_SUPABASE to false.');
      } else {
        this.subscriptionService = new LocalSubscriptionService();
      }
    }
    return this.subscriptionService;
  }

  getPaymentService(): IPaymentService {
    if (!this.paymentService) {
      if (USE_SUPABASE) {
        // TODO: Implement real Stripe service
        throw new Error('Stripe not yet configured. Set USE_SUPABASE to false.');
      } else {
        this.paymentService = new MockPaymentService();
      }
    }
    return this.paymentService;
  }

  getAnalyticsService(): IAnalyticsService {
    if (!this.analyticsService) {
      this.analyticsService = new LocalAnalyticsService();
      // In production, you might use:
      // this.analyticsService = new PlausibleAnalyticsService();
      // or
      // this.analyticsService = new FathomAnalyticsService();
    }
    return this.analyticsService;
  }

  /**
   * Reset all service instances (useful for testing)
   */
  reset(): void {
    this.authService = null;
    this.habitsRepository = null;
    this.moodRepository = null;
    this.journalRepository = null;
    this.subscriptionService = null;
    this.paymentService = null;
    this.analyticsService = null;
  }
}

export const serviceFactory = new ServiceFactory();

// Convenience exports
export const getAuthService = () => serviceFactory.getAuthService();
export const getHabitsRepository = () => serviceFactory.getHabitsRepository();
export const getMoodRepository = () => serviceFactory.getMoodRepository();
export const getJournalRepository = () => serviceFactory.getJournalRepository();
export const getSubscriptionService = () => serviceFactory.getSubscriptionService();
export const getPaymentService = () => serviceFactory.getPaymentService();
export const getAnalyticsService = () => serviceFactory.getAnalyticsService();