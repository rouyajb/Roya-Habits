import { CycleSettings, CycleLog, FlowLevel } from '@/types';
import { localStorageService } from './LocalStorageService';

/**
 * Local Cycle Lens Service
 * Manages cycle settings and logs using localStorage
 */
export class LocalCycleService {
  private readonly SETTINGS_KEY = 'cycle_settings';
  private readonly LOGS_KEY = 'cycle_logs';

  async getSettings(userId: string): Promise<CycleSettings | null> {
    const settings = localStorageService.getItem<CycleSettings[]>(this.SETTINGS_KEY) || [];
    return settings.find(s => s.userId === userId) || null;
  }

  async saveSettings(settings: Omit<CycleSettings, 'createdAt' | 'updatedAt'>): Promise<CycleSettings> {
    const allSettings = localStorageService.getItem<CycleSettings[]>(this.SETTINGS_KEY) || [];
    
    const existingIndex = allSettings.findIndex(s => s.userId === settings.userId);
    
    const newSettings: CycleSettings = {
      ...settings,
      createdAt: existingIndex >= 0 ? allSettings[existingIndex].createdAt : new Date(),
      updatedAt: new Date(),
    };

    if (existingIndex >= 0) {
      allSettings[existingIndex] = newSettings;
    } else {
      allSettings.push(newSettings);
    }

    localStorageService.setItem(this.SETTINGS_KEY, allSettings);
    return newSettings;
  }

  async deleteSettings(userId: string): Promise<void> {
    const allSettings = localStorageService.getItem<CycleSettings[]>(this.SETTINGS_KEY) || [];
    const filtered = allSettings.filter(s => s.userId !== userId);
    localStorageService.setItem(this.SETTINGS_KEY, filtered);
  }

  async getLogForDate(userId: string, date: Date): Promise<CycleLog | null> {
    const logs = localStorageService.getItem<CycleLog[]>(this.LOGS_KEY) || [];
    const dateStr = date.toISOString().split('T')[0];
    
    return logs.find(
      log => log.userId === userId && 
             new Date(log.date).toISOString().split('T')[0] === dateStr
    ) || null;
  }

  async getLogs(userId: string, startDate: Date, endDate: Date): Promise<CycleLog[]> {
    const logs = localStorageService.getItem<CycleLog[]>(this.LOGS_KEY) || [];
    
    return logs.filter(log => {
      if (log.userId !== userId) return false;
      const logDate = new Date(log.date);
      return logDate >= startDate && logDate <= endDate;
    });
  }

  async createLog(data: {
    userId: string;
    date: Date;
    flowLevel: FlowLevel;
    symptoms: string[];
    notes?: string;
  }): Promise<CycleLog> {
    const logs = localStorageService.getItem<CycleLog[]>(this.LOGS_KEY) || [];
    
    const newLog: CycleLog = {
      id: `cycle_log_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      ...data,
      createdAt: new Date(),
    };

    logs.push(newLog);
    localStorageService.setItem(this.LOGS_KEY, logs);
    
    return newLog;
  }

  async updateLog(
    logId: string,
    updates: {
      flowLevel?: FlowLevel;
      symptoms?: string[];
      notes?: string;
    }
  ): Promise<CycleLog> {
    const logs = localStorageService.getItem<CycleLog[]>(this.LOGS_KEY) || [];
    const index = logs.findIndex(l => l.id === logId);

    if (index === -1) {
      throw new Error('Cycle log not found');
    }

    logs[index] = {
      ...logs[index],
      ...updates,
    };

    localStorageService.setItem(this.LOGS_KEY, logs);
    return logs[index];
  }

  async deleteLog(logId: string): Promise<void> {
    const logs = localStorageService.getItem<CycleLog[]>(this.LOGS_KEY) || [];
    const filtered = logs.filter(l => l.id !== logId);
    localStorageService.setItem(this.LOGS_KEY, filtered);
  }
}

export const localCycleService = new LocalCycleService();