import { IHabitsRepository } from '../interfaces/IHabitsRepository';
import { Habit, HabitLog, HabitStats } from '@/types';

/**
 * Supabase Habits Repository (STUB)
 * TODO: Implement when Supabase backend is enabled
 * 
 * Required setup:
 * 1. Create 'habits' table with RLS policies
 * 2. Create 'habit_logs' table with RLS policies
 * 3. Set up indexes for performance:
 *    - habits(user_id, archived)
 *    - habit_logs(habit_id, date)
 *    - habit_logs(user_id, date)
 * 4. Create RLS policies:
 *    - Users can only read/write their own habits
 *    - Users can only read/write their own habit logs
 */
export class SupabaseHabitsRepository implements IHabitsRepository {
  async createHabit(habit: Omit<Habit, 'id' | 'createdAt' | 'updatedAt'>): Promise<Habit> {
    throw new Error('TODO: Implement Supabase createHabit');
    
    // const { data, error } = await supabase
    //   .from('habits')
    //   .insert(habit)
    //   .select()
    //   .single();
    // 
    // if (error) throw error;
    // return data;
  }

  async getHabits(userId: string, includeArchived = false): Promise<Habit[]> {
    throw new Error('TODO: Implement Supabase getHabits');
    
    // let query = supabase
    //   .from('habits')
    //   .select('*')
    //   .eq('user_id', userId);
    // 
    // if (!includeArchived) {
    //   query = query.eq('archived', false);
    // }
    // 
    // const { data, error } = await query;
    // if (error) throw error;
    // return data;
  }

  async getHabit(habitId: string): Promise<Habit | null> {
    throw new Error('TODO: Implement Supabase getHabit');
  }

  async updateHabit(habitId: string, updates: Partial<Habit>): Promise<Habit> {
    throw new Error('TODO: Implement Supabase updateHabit');
  }

  async deleteHabit(habitId: string): Promise<void> {
    throw new Error('TODO: Implement Supabase deleteHabit (soft delete)');
  }

  async logHabit(log: Omit<HabitLog, 'id' | 'createdAt'>): Promise<HabitLog> {
    throw new Error('TODO: Implement Supabase logHabit');
    
    // Use upsert to replace existing log for the same date:
    // const { data, error } = await supabase
    //   .from('habit_logs')
    //   .upsert(log, {
    //     onConflict: 'habit_id,date'
    //   })
    //   .select()
    //   .single();
  }

  async getHabitLogs(habitId: string, startDate: Date, endDate: Date): Promise<HabitLog[]> {
    throw new Error('TODO: Implement Supabase getHabitLogs');
  }

  async getHabitLogForDate(habitId: string, date: Date): Promise<HabitLog | null> {
    throw new Error('TODO: Implement Supabase getHabitLogForDate');
  }

  async getHabitStats(habitId: string): Promise<HabitStats> {
    throw new Error('TODO: Implement Supabase getHabitStats');
    
    // This might require a database function for efficient calculation:
    // const { data, error } = await supabase
    //   .rpc('calculate_habit_stats', { habit_id: habitId });
  }

  async getHabitsWithLogsForDate(userId: string, date: Date): Promise<Array<{ habit: Habit; log: HabitLog | null }>> {
    throw new Error('TODO: Implement Supabase getHabitsWithLogsForDate');
    
    // Use a join or separate queries:
    // 1. Get all habits for user
    // 2. Get all logs for the date
    // 3. Combine results
  }
}