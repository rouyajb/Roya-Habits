import { IHabitsRepository } from '../interfaces/IHabitsRepository';
import { Habit, HabitLog, HabitStats, HabitStatus, HabitMilestone } from '@/types';
import { localStorageService } from './LocalStorageService';
import { v4 as uuidv4 } from 'uuid';

/**
 * Local Habits Repository
 * Implements habit tracking using localStorage
 */
export class LocalHabitsRepository implements IHabitsRepository {
  private readonly HABITS_KEY = 'habits';
  private readonly HABIT_LOGS_KEY = 'habit_logs';
  private readonly MILESTONES_KEY = 'habit_milestones';

  async createHabit(habit: Omit<Habit, 'id' | 'createdAt' | 'updatedAt'>): Promise<Habit> {
    const habits = localStorageService.getItem<Habit[]>(this.HABITS_KEY) || [];
    
    const newHabit: Habit = {
      ...habit,
      id: uuidv4(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    habits.push(newHabit);
    localStorageService.setItem(this.HABITS_KEY, habits);

    return newHabit;
  }

  async getHabit(habitId: string): Promise<Habit | null> {
    const habits = localStorageService.getItem<Habit[]>(this.HABITS_KEY) || [];
    return habits.find(h => h.id === habitId) || null;
  }

  async getHabits(userId: string): Promise<Habit[]> {
    const habits = localStorageService.getItem<Habit[]>(this.HABITS_KEY) || [];
    return habits.filter(h => h.userId === userId && !h.archived);
  }

  async updateHabit(habitId: string, updates: Partial<Habit>): Promise<Habit> {
    const habits = localStorageService.getItem<Habit[]>(this.HABITS_KEY) || [];
    const index = habits.findIndex(h => h.id === habitId);

    if (index === -1) {
      throw new Error('Habit not found');
    }

    habits[index] = {
      ...habits[index],
      ...updates,
      updatedAt: new Date(),
    };

    localStorageService.setItem(this.HABITS_KEY, habits);
    return habits[index];
  }

  async deleteHabit(habitId: string): Promise<void> {
    const habits = localStorageService.getItem<Habit[]>(this.HABITS_KEY) || [];
    const filteredHabits = habits.filter(h => h.id !== habitId);
    localStorageService.setItem(this.HABITS_KEY, filteredHabits);

    // Also delete all logs for this habit
    const logs = localStorageService.getItem<HabitLog[]>(this.HABIT_LOGS_KEY) || [];
    const filteredLogs = logs.filter(l => l.habitId !== habitId);
    localStorageService.setItem(this.HABIT_LOGS_KEY, filteredLogs);

    // Delete milestones
    const milestones = localStorageService.getItem<HabitMilestone[]>(this.MILESTONES_KEY) || [];
    const filteredMilestones = milestones.filter(m => m.habitId !== habitId);
    localStorageService.setItem(this.MILESTONES_KEY, filteredMilestones);
  }

  async logHabit(log: Omit<HabitLog, 'id' | 'createdAt'>): Promise<HabitLog> {
    const logs = localStorageService.getItem<HabitLog[]>(this.HABIT_LOGS_KEY) || [];
    
    // Remove existing log for the same habit and date
    const dateStr = new Date(log.date).toISOString().split('T')[0];
    const filteredLogs = logs.filter(l => {
      const logDateStr = new Date(l.date).toISOString().split('T')[0];
      return !(l.habitId === log.habitId && logDateStr === dateStr);
    });

    const newLog: HabitLog = {
      ...log,
      id: uuidv4(),
      createdAt: new Date(),
    };

    filteredLogs.push(newLog);
    localStorageService.setItem(this.HABIT_LOGS_KEY, filteredLogs);

    return newLog;
  }

  async getHabitLogs(habitId: string, startDate: Date, endDate: Date): Promise<HabitLog[]> {
    const logs = localStorageService.getItem<HabitLog[]>(this.HABIT_LOGS_KEY) || [];
    return logs.filter(l => {
      const logDate = new Date(l.date);
      return l.habitId === habitId && logDate >= startDate && logDate <= endDate;
    }).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }

  async getHabitLogForDate(habitId: string, date: Date): Promise<HabitLog | null> {
    const logs = localStorageService.getItem<HabitLog[]>(this.HABIT_LOGS_KEY) || [];
    const dateStr = new Date(date).toISOString().split('T')[0];
    
    return logs.find(l => {
      const logDateStr = new Date(l.date).toISOString().split('T')[0];
      return l.habitId === habitId && logDateStr === dateStr;
    }) || null;
  }

  async getHabitsWithLogsForDate(userId: string, date: Date): Promise<Array<{ habit: Habit; log: HabitLog | null }>> {
    const habits = await this.getHabits(userId);
    const dateStr = new Date(date).toISOString().split('T')[0];
    const logs = localStorageService.getItem<HabitLog[]>(this.HABIT_LOGS_KEY) || [];

    return habits.map(habit => {
      const log = logs.find(l => {
        const logDateStr = new Date(l.date).toISOString().split('T')[0];
        return l.habitId === habit.id && logDateStr === dateStr;
      }) || null;

      return { habit, log };
    });
  }

  async getHabitStats(habitId: string): Promise<HabitStats> {
    const habit = await this.getHabit(habitId);
    if (!habit) {
      throw new Error('Habit not found');
    }

    const logs = localStorageService.getItem<HabitLog[]>(this.HABIT_LOGS_KEY) || [];
    const habitLogs = logs
      .filter(l => l.habitId === habitId)
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    let currentStreak = 0;
    let bestStreak = 0;
    let totalCompletions = 0;
    let totalCleanDays = 0;
    let relapseCount = 0;

    if (habit.type === 'WIN') {
      // Calculate streaks for WIN habits
      const successStatus: HabitStatus = 'done';
      totalCompletions = habitLogs.filter(l => l.status === successStatus).length;

      // Calculate current streak (from most recent backwards)
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const checkDate = new Date(today);
      
      for (let i = habitLogs.length - 1; i >= 0; i--) {
        const log = habitLogs[i];
        const logDate = new Date(log.date);
        logDate.setHours(0, 0, 0, 0);

        if (logDate.getTime() === checkDate.getTime() && log.status === successStatus) {
          currentStreak++;
          checkDate.setDate(checkDate.getDate() - 1);
        } else if (logDate.getTime() < checkDate.getTime()) {
          break;
        }
      }

      // Calculate best streak
      let tempStreak = 0;
      let lastDate: Date | null = null;

      habitLogs.forEach(log => {
        const logDate = new Date(log.date);
        logDate.setHours(0, 0, 0, 0);

        if (log.status === successStatus) {
          if (!lastDate) {
            tempStreak = 1;
          } else {
            const daysDiff = Math.floor((logDate.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24));
            if (daysDiff === 1) {
              tempStreak++;
            } else {
              tempStreak = 1;
            }
          }
          bestStreak = Math.max(bestStreak, tempStreak);
          lastDate = logDate;
        }
      });
    } else {
      // Calculate streaks for QUIT habits
      const successStatus: HabitStatus = 'clean';
      totalCleanDays = habitLogs.filter(l => l.status === successStatus).length;
      relapseCount = habitLogs.filter(l => l.status === 'relapse').length;

      // Calculate current streak (from most recent backwards)
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const checkDate = new Date(today);
      
      for (let i = habitLogs.length - 1; i >= 0; i--) {
        const log = habitLogs[i];
        const logDate = new Date(log.date);
        logDate.setHours(0, 0, 0, 0);

        if (logDate.getTime() === checkDate.getTime()) {
          if (log.status === successStatus) {
            currentStreak++;
            checkDate.setDate(checkDate.getDate() - 1);
          } else if (log.status === 'relapse') {
            break; // Streak broken
          }
        } else if (logDate.getTime() < checkDate.getTime()) {
          break;
        }
      }

      // Calculate best streak
      let tempStreak = 0;
      let lastDate: Date | null = null;

      habitLogs.forEach(log => {
        const logDate = new Date(log.date);
        logDate.setHours(0, 0, 0, 0);

        if (log.status === successStatus) {
          if (!lastDate) {
            tempStreak = 1;
          } else {
            const daysDiff = Math.floor((logDate.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24));
            if (daysDiff === 1) {
              tempStreak++;
            } else {
              tempStreak = 1;
            }
          }
          bestStreak = Math.max(bestStreak, tempStreak);
          lastDate = logDate;
        } else if (log.status === 'relapse') {
          tempStreak = 0;
          lastDate = null;
        }
      });

      totalCompletions = totalCleanDays;
    }

    return {
      habitId,
      currentStreak,
      bestStreak,
      totalCompletions,
      totalCleanDays: habit.type === 'QUIT' ? totalCleanDays : undefined,
      relapseCount: habit.type === 'QUIT' ? relapseCount : undefined,
    };
  }

  async saveMilestone(milestone: Omit<HabitMilestone, 'achievedAt'>): Promise<HabitMilestone> {
    const milestones = localStorageService.getItem<HabitMilestone[]>(this.MILESTONES_KEY) || [];
    
    // Check if milestone already exists
    const existing = milestones.find(
      m => m.habitId === milestone.habitId && m.days === milestone.days
    );

    if (existing) {
      return existing; // Already achieved
    }

    const newMilestone: HabitMilestone = {
      ...milestone,
      achievedAt: new Date(),
    };

    milestones.push(newMilestone);
    localStorageService.setItem(this.MILESTONES_KEY, milestones);

    return newMilestone;
  }

  async getMilestones(habitId: string): Promise<HabitMilestone[]> {
    const milestones = localStorageService.getItem<HabitMilestone[]>(this.MILESTONES_KEY) || [];
    return milestones
      .filter(m => m.habitId === habitId)
      .sort((a, b) => a.days - b.days);
  }

  async hasMilestone(habitId: string, days: number): Promise<boolean> {
    const milestones = localStorageService.getItem<HabitMilestone[]>(this.MILESTONES_KEY) || [];
    return milestones.some(m => m.habitId === habitId && m.days === days);
  }
}

export const localHabitsRepository = new LocalHabitsRepository();