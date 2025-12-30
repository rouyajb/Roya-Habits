import { IMoodRepository } from '../interfaces/IMoodRepository';
import { MoodLog } from '@/types';
import { localStorageService } from './LocalStorageService';
import { v4 as uuidv4 } from 'uuid';

/**
 * Local Mood Repository
 * Implements mood logging using localStorage
 */
export class LocalMoodRepository implements IMoodRepository {
  private readonly MOOD_LOGS_KEY = 'mood_logs';

  async createMoodLog(log: Omit<MoodLog, 'id' | 'createdAt'>): Promise<MoodLog> {
    const logs = localStorageService.getItem<MoodLog[]>(this.MOOD_LOGS_KEY) || [];
    
    // Remove existing log for the same user and date
    const dateStr = new Date(log.date).toISOString().split('T')[0];
    const filteredLogs = logs.filter(l => {
      const logDateStr = new Date(l.date).toISOString().split('T')[0];
      return !(l.userId === log.userId && logDateStr === dateStr);
    });

    const newLog: MoodLog = {
      ...log,
      id: uuidv4(),
      createdAt: new Date(),
    };

    filteredLogs.push(newLog);
    localStorageService.setItem(this.MOOD_LOGS_KEY, filteredLogs);

    return newLog;
  }

  async getMoodLogForDate(userId: string, date: Date): Promise<MoodLog | null> {
    const logs = localStorageService.getItem<MoodLog[]>(this.MOOD_LOGS_KEY) || [];
    const dateStr = new Date(date).toISOString().split('T')[0];
    
    return logs.find(l => {
      const logDateStr = new Date(l.date).toISOString().split('T')[0];
      return l.userId === userId && logDateStr === dateStr;
    }) || null;
  }

  async getMoodLogs(userId: string, startDate: Date, endDate: Date): Promise<MoodLog[]> {
    const logs = localStorageService.getItem<MoodLog[]>(this.MOOD_LOGS_KEY) || [];
    return logs.filter(l => {
      const logDate = new Date(l.date);
      return l.userId === userId && logDate >= startDate && logDate <= endDate;
    }).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }

  async updateMoodLog(logId: string, updates: Partial<MoodLog>): Promise<MoodLog> {
    const logs = localStorageService.getItem<MoodLog[]>(this.MOOD_LOGS_KEY) || [];
    const index = logs.findIndex(l => l.id === logId);

    if (index === -1) {
      throw new Error('Mood log not found');
    }

    logs[index] = {
      ...logs[index],
      ...updates,
    };

    localStorageService.setItem(this.MOOD_LOGS_KEY, logs);
    return logs[index];
  }

  async deleteMoodLog(logId: string): Promise<void> {
    const logs = localStorageService.getItem<MoodLog[]>(this.MOOD_LOGS_KEY) || [];
    const filteredLogs = logs.filter(l => l.id !== logId);
    localStorageService.setItem(this.MOOD_LOGS_KEY, filteredLogs);
  }

  async getMoodTrends(userId: string, days: number): Promise<Array<{ date: Date; avgScore: number; emoji: string }>> {
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const logs = await this.getMoodLogs(userId, startDate, endDate);
    
    // Group by date and calculate average
    const dateMap = new Map<string, { scores: number[]; emoji: string }>();
    
    logs.forEach(log => {
      const dateStr = new Date(log.date).toISOString().split('T')[0];
      if (!dateMap.has(dateStr)) {
        dateMap.set(dateStr, { scores: [], emoji: log.emoji });
      }
      dateMap.get(dateStr)!.scores.push(log.score);
    });

    const trends = Array.from(dateMap.entries()).map(([dateStr, data]) => ({
      date: new Date(dateStr),
      avgScore: data.scores.reduce((a, b) => a + b, 0) / data.scores.length,
      emoji: data.emoji,
    }));

    return trends.sort((a, b) => a.date.getTime() - b.date.getTime());
  }
}

export const localMoodRepository = new LocalMoodRepository();