import { Subscription, Entitlements, SubscriptionPlan, SubscriptionStatus } from '@/types';
import { localStorageService } from './LocalStorageService';

/**
 * Local Subscription Service
 * Manages subscriptions and entitlements using localStorage
 */
export class LocalSubscriptionService {
  private readonly SUBSCRIPTIONS_KEY = 'subscriptions';

  async getSubscription(userId: string): Promise<Subscription | null> {
    const subscriptions = localStorageService.getItem<Subscription[]>(this.SUBSCRIPTIONS_KEY) || [];
    return subscriptions.find(s => s.userId === userId) || null;
  }

  async createSubscription(data: {
    userId: string;
    plan: SubscriptionPlan;
    status: SubscriptionStatus;
  }): Promise<Subscription> {
    const subscriptions = localStorageService.getItem<Subscription[]>(this.SUBSCRIPTIONS_KEY) || [];
    
    const newSubscription: Subscription = {
      ...data,
      cancelAtPeriodEnd: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    subscriptions.push(newSubscription);
    localStorageService.setItem(this.SUBSCRIPTIONS_KEY, subscriptions);
    
    return newSubscription;
  }

  async updateSubscription(
    userId: string,
    updates: Partial<Subscription>
  ): Promise<Subscription> {
    const subscriptions = localStorageService.getItem<Subscription[]>(this.SUBSCRIPTIONS_KEY) || [];
    const index = subscriptions.findIndex(s => s.userId === userId);

    if (index === -1) {
      throw new Error('Subscription not found');
    }

    subscriptions[index] = {
      ...subscriptions[index],
      ...updates,
      updatedAt: new Date(),
    };

    localStorageService.setItem(this.SUBSCRIPTIONS_KEY, subscriptions);
    return subscriptions[index];
  }

  async getEntitlements(userId: string): Promise<Entitlements> {
    const subscription = await this.getSubscription(userId);

    if (!subscription || subscription.status !== 'active') {
      // FREE tier entitlements
      return {
        maxHabits: 3,
        fullJournalHistory: false,
        unlimitedGoals: false,
        periodTracker: false,
        advancedSalah: false,
        dataExport: false,
        weeklyReview: false,
        advancedAnalytics: false,
        appLockPin: false,
        focusModeCustomization: false,
        premiumThemes: false,
        cycleLensAdvanced: false, // FREE: basic Cycle Lens only (phase calendar + phase card)
      };
    }

    // PRO/LIFETIME tier entitlements
    return {
      maxHabits: Infinity,
      fullJournalHistory: true,
      unlimitedGoals: true,
      periodTracker: true,
      advancedSalah: true,
      dataExport: true,
      weeklyReview: true,
      advancedAnalytics: true,
      appLockPin: true,
      focusModeCustomization: true,
      premiumThemes: true,
      cycleLensAdvanced: true, // PRO: symptom/flow logging history + export + deeper insights
    };
  }
}

export const localSubscriptionService = new LocalSubscriptionService();