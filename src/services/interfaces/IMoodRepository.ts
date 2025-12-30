import { MoodLog } from '@/types';

/**
 * Mood Repository Interface
 */
export interface IMoodRepository {
  /**
   * Create a mood log entry
   */
  createMoodLog(log: Omit<MoodLog, 'id' | 'createdAt'>): Promise<MoodLog>;

  /**
   * Get mood log for a specific date
   */
  getMoodLogForDate(userId: string, date: Date): Promise<MoodLog | null>;

  /**
   * Get mood logs for a date range
   */
  getMoodLogs(userId: string, startDate: Date, endDate: Date): Promise<MoodLog[]>;

  /**
   * Update a mood log
   */
  updateMoodLog(logId: string, updates: Partial<MoodLog>): Promise<MoodLog>;

  /**
   * Delete a mood log
   */
  deleteMoodLog(logId: string): Promise<void>;

  /**
   * Get mood trends (aggregated data)
   */
  getMoodTrends(userId: string, days: number): Promise<Array<{ date: Date; avgScore: number; emoji: string }>>;
}