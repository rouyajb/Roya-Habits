import { IJournalRepository } from '../interfaces/IJournalRepository';
import { JournalEntry } from '@/types';
import { localStorageService } from './LocalStorageService';
import { v4 as uuidv4 } from 'uuid';

/**
 * Local Journal Repository
 * Implements journal entries using localStorage
 */
export class LocalJournalRepository implements IJournalRepository {
  private readonly JOURNAL_ENTRIES_KEY = 'journal_entries';

  async createEntry(entry: Omit<JournalEntry, 'id' | 'createdAt' | 'updatedAt'>): Promise<JournalEntry> {
    const entries = localStorageService.getItem<JournalEntry[]>(this.JOURNAL_ENTRIES_KEY) || [];
    
    // Remove existing entry for the same user and date
    const dateStr = new Date(entry.date).toISOString().split('T')[0];
    const filteredEntries = entries.filter(e => {
      const entryDateStr = new Date(e.date).toISOString().split('T')[0];
      return !(e.userId === entry.userId && entryDateStr === dateStr);
    });

    const newEntry: JournalEntry = {
      ...entry,
      id: uuidv4(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    filteredEntries.push(newEntry);
    localStorageService.setItem(this.JOURNAL_ENTRIES_KEY, filteredEntries);

    return newEntry;
  }

  async getEntryForDate(userId: string, date: Date): Promise<JournalEntry | null> {
    const entries = localStorageService.getItem<JournalEntry[]>(this.JOURNAL_ENTRIES_KEY) || [];
    const dateStr = new Date(date).toISOString().split('T')[0];
    
    return entries.find(e => {
      const entryDateStr = new Date(e.date).toISOString().split('T')[0];
      return e.userId === userId && entryDateStr === dateStr;
    }) || null;
  }

  async getEntries(userId: string, startDate: Date, endDate: Date): Promise<JournalEntry[]> {
    const entries = localStorageService.getItem<JournalEntry[]>(this.JOURNAL_ENTRIES_KEY) || [];
    return entries.filter(e => {
      const entryDate = new Date(e.date);
      return e.userId === userId && entryDate >= startDate && entryDate <= endDate;
    }).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }

  async getAllEntries(userId: string, limit?: number): Promise<JournalEntry[]> {
    const entries = localStorageService.getItem<JournalEntry[]>(this.JOURNAL_ENTRIES_KEY) || [];
    const userEntries = entries
      .filter(e => e.userId === userId)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    if (limit) {
      return userEntries.slice(0, limit);
    }

    return userEntries;
  }

  async updateEntry(entryId: string, updates: Partial<JournalEntry>): Promise<JournalEntry> {
    const entries = localStorageService.getItem<JournalEntry[]>(this.JOURNAL_ENTRIES_KEY) || [];
    const index = entries.findIndex(e => e.id === entryId);

    if (index === -1) {
      throw new Error('Journal entry not found');
    }

    entries[index] = {
      ...entries[index],
      ...updates,
      updatedAt: new Date(),
    };

    localStorageService.setItem(this.JOURNAL_ENTRIES_KEY, entries);
    return entries[index];
  }

  async deleteEntry(entryId: string): Promise<void> {
    const entries = localStorageService.getItem<JournalEntry[]>(this.JOURNAL_ENTRIES_KEY) || [];
    const filteredEntries = entries.filter(e => e.id !== entryId);
    localStorageService.setItem(this.JOURNAL_ENTRIES_KEY, filteredEntries);
  }

  async searchEntries(userId: string, query: string): Promise<JournalEntry[]> {
    const entries = localStorageService.getItem<JournalEntry[]>(this.JOURNAL_ENTRIES_KEY) || [];
    const lowerQuery = query.toLowerCase();
    
    return entries
      .filter(e => 
        e.userId === userId && 
        e.content.toLowerCase().includes(lowerQuery)
      )
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }
}

export const localJournalRepository = new LocalJournalRepository();