import { Habit, HabitLog, HabitStats, HabitMilestone } from '@/types';

/**
 * Habits Repository Interface
 */
export interface IHabitsRepository {
  /**
   * Create a new habit
   */
  createHabit(habit: Omit<Habit, 'id' | 'createdAt' | 'updatedAt'>): Promise<Habit>;

  /**
   * Get a single habit by ID
   */
  getHabit(habitId: string): Promise<Habit | null>;

  /**
   * Get all habits for a user
   */
  getHabits(userId: string): Promise<Habit[]>;

  /**
   * Update a habit
   */
  updateHabit(habitId: string, updates: Partial<Habit>): Promise<Habit>;

  /**
   * Delete a habit
   */
  deleteHabit(habitId: string): Promise<void>;

  /**
   * Log a habit completion/status for a specific date
   */
  logHabit(log: Omit<HabitLog, 'id' | 'createdAt'>): Promise<HabitLog>;

  /**
   * Get habit logs within a date range
   */
  getHabitLogs(habitId: string, startDate: Date, endDate: Date): Promise<HabitLog[]>;

  /**
   * Get habit log for a specific date
   */
  getHabitLogForDate(habitId: string, date: Date): Promise<HabitLog | null>;

  /**
   * Get all habits with their logs for a specific date
   */
  getHabitsWithLogsForDate(userId: string, date: Date): Promise<Array<{ habit: Habit; log: HabitLog | null }>>;

  /**
   * Get habit statistics (streaks, completions, etc.)
   */
  getHabitStats(habitId: string): Promise<HabitStats>;

  /**
   * Save a milestone achievement
   */
  saveMilestone(milestone: Omit<HabitMilestone, 'achievedAt'>): Promise<HabitMilestone>;

  /**
   * Get all milestones for a habit
   */
  getMilestones(habitId: string): Promise<HabitMilestone[]>;

  /**
   * Check if a milestone has been achieved
   */
  hasMilestone(habitId: string, days: number): Promise<boolean>;
}