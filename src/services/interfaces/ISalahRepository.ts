import { SalahSettings, SalahTime, SalahLog, PrayerName } from '@/types';

/**
 * Salah (Prayer) Repository Interface
 */
export interface ISalahRepository {
  /**
   * Save or update salah settings
   */
  saveSalahSettings(settings: Omit<SalahSettings, 'updatedAt'>): Promise<SalahSettings>;

  /**
   * Get salah settings for a user
   */
  getSalahSettings(userId: string): Promise<SalahSettings | null>;

  /**
   * Cache prayer times for a date
   */
  cachePrayerTimes(times: SalahTime[]): Promise<void>;

  /**
   * Get cached prayer times for a date
   */
  getPrayerTimes(userId: string, date: Date): Promise<SalahTime[]>;

  /**
   * Log a prayer as prayed
   */
  logPrayer(log: Omit<SalahLog, 'id' | 'createdAt'>): Promise<SalahLog>;

  /**
   * Get prayer logs for a date
   */
  getPrayerLogsForDate(userId: string, date: Date): Promise<SalahLog[]>;

  /**
   * Get prayer logs for a date range
   */
  getPrayerLogs(userId: string, startDate: Date, endDate: Date): Promise<SalahLog[]>;

  /**
   * Get prayer completion stats
   */
  getPrayerStats(userId: string, days: number): Promise<{ total: number; completed: number; percentage: number }>;

  /**
   * Delete salah settings and logs
   */
  deleteSalahData(userId: string): Promise<void>;
}