import { WeeklyIntention } from '@/types';
import { localStorageService } from './LocalStorageService';
import { getWeekStart, getWeekEnd } from '@/utils/weekUtils';

/**
 * Local Weekly Review Service
 * Manages weekly intentions using localStorage
 */
export class LocalWeeklyReviewService {
  private readonly INTENTIONS_KEY = 'weekly_intentions';

  async getIntentionsForWeek(userId: string, weekStart: Date): Promise<WeeklyIntention | null> {
    const intentions = localStorageService.getItem<WeeklyIntention[]>(this.INTENTIONS_KEY) || [];
    const weekStartTime = weekStart.getTime();
    
    return intentions.find(
      i => i.userId === userId && new Date(i.weekStart).getTime() === weekStartTime
    ) || null;
  }

  async saveIntentions(userId: string, weekStart: Date, intentionsList: string[]): Promise<WeeklyIntention> {
    const intentions = localStorageService.getItem<WeeklyIntention[]>(this.INTENTIONS_KEY) || [];
    const weekEnd = getWeekEnd(weekStart);
    
    const newIntention: WeeklyIntention = {
      id: `intention_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      userId,
      weekStart,
      weekEnd,
      intentions: intentionsList,
      createdAt: new Date(),
    };

    // Remove existing intention for this week
    const filteredIntentions = intentions.filter(
      i => !(i.userId === userId && new Date(i.weekStart).getTime() === weekStart.getTime())
    );
    
    filteredIntentions.push(newIntention);
    localStorageService.setItem(this.INTENTIONS_KEY, filteredIntentions);
    
    return newIntention;
  }

  async deleteIntentions(userId: string, weekStart: Date): Promise<void> {
    const intentions = localStorageService.getItem<WeeklyIntention[]>(this.INTENTIONS_KEY) || [];
    const weekStartTime = weekStart.getTime();
    
    const filteredIntentions = intentions.filter(
      i => !(i.userId === userId && new Date(i.weekStart).getTime() === weekStartTime)
    );
    
    localStorageService.setItem(this.INTENTIONS_KEY, filteredIntentions);
  }
}

export const localWeeklyReviewService = new LocalWeeklyReviewService();