import { PeriodSettings, PeriodLog, PeriodPhase, PeriodPrediction } from '@/types';

/**
 * Period Tracker Repository Interface
 */
export interface IPeriodRepository {
  /**
   * Create or update period settings
   */
  savePeriodSettings(settings: Omit<PeriodSettings, 'updatedAt'>): Promise<PeriodSettings>;

  /**
   * Get period settings for a user
   */
  getPeriodSettings(userId: string): Promise<PeriodSettings | null>;

  /**
   * Log period data for a date
   */
  logPeriod(log: Omit<PeriodLog, 'id' | 'createdAt'>): Promise<PeriodLog>;

  /**
   * Get period logs for a date range
   */
  getPeriodLogs(userId: string, startDate: Date, endDate: Date): Promise<PeriodLog[]>;

  /**
   * Get period log for a specific date
   */
  getPeriodLogForDate(userId: string, date: Date): Promise<PeriodLog | null>;

  /**
   * Calculate current phase for a date
   */
  calculatePhase(userId: string, date: Date): Promise<PeriodPhase | null>;

  /**
   * Get predictions for next cycle
   */
  getPredictions(userId: string): Promise<PeriodPrediction | null>;

  /**
   * Delete period settings and all logs
   */
  deletePeriodData(userId: string): Promise<void>;
}