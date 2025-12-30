import { JournalEntry } from '@/types';

/**
 * Journal Repository Interface
 */
export interface IJournalRepository {
  /**
   * Create a new journal entry
   */
  createEntry(entry: Omit<JournalEntry, 'id' | 'createdAt' | 'updatedAt'>): Promise<JournalEntry>;

  /**
   * Get a journal entry by ID
   */
  getEntry(entryId: string): Promise<JournalEntry | null>;

  /**
   * Get journal entry for a specific date
   */
  getEntryForDate(userId: string, date: Date): Promise<JournalEntry | null>;

  /**
   * Get all journal entries for a user
   */
  getEntries(userId: string, startDate?: Date, endDate?: Date): Promise<JournalEntry[]>;

  /**
   * Update a journal entry
   */
  updateEntry(entryId: string, updates: Partial<JournalEntry>): Promise<JournalEntry>;

  /**
   * Delete a journal entry
   */
  deleteEntry(entryId: string): Promise<void>;
}