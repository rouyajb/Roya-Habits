import { Habit, HabitLog, MoodLog, JournalEntry } from '@/types';

/**
 * Export data utilities for CSV and JSON formats
 */

export function exportHabitsToCSV(habits: Habit[]): string {
  const headers = ['ID', 'Name', 'Type', 'Identity Statement', 'Frequency', 'Start Date', 'Created At'];
  const rows = habits.map(h => [
    h.id,
    h.name,
    h.type,
    h.identityStatement || '',
    h.frequency,
    new Date(h.startDate).toISOString(),
    new Date(h.createdAt).toISOString(),
  ]);

  return [headers, ...rows].map(row => row.map(cell => `"${cell}"`).join(',')).join('\n');
}

export function exportHabitLogsToCSV(logs: HabitLog[]): string {
  const headers = ['Habit ID', 'Date', 'Status', 'Notes', 'Created At'];
  const rows = logs.map(l => [
    l.habitId,
    new Date(l.date).toISOString().split('T')[0],
    l.status,
    l.notes || '',
    new Date(l.createdAt).toISOString(),
  ]);

  return [headers, ...rows].map(row => row.map(cell => `"${cell}"`).join(',')).join('\n');
}

export function exportMoodLogsToCSV(logs: MoodLog[]): string {
  const headers = ['Date', 'Emoji', 'Score', 'Tags', 'Created At'];
  const rows = logs.map(l => [
    new Date(l.date).toISOString().split('T')[0],
    l.emoji,
    l.score.toString(),
    l.tags.join('; '),
    new Date(l.createdAt).toISOString(),
  ]);

  return [headers, ...rows].map(row => row.map(cell => `"${cell}"`).join(',')).join('\n');
}

export function exportJournalEntriesToCSV(entries: JournalEntry[]): string {
  const headers = ['Date', 'Prompt', 'Content', 'Created At'];
  const rows = entries.map(e => [
    new Date(e.date).toISOString().split('T')[0],
    e.promptText || '',
    e.content,
    new Date(e.createdAt).toISOString(),
  ]);

  return [headers, ...rows].map(row => row.map(cell => `"${cell.replace(/"/g, '""')}"`).join(',')).join('\n');
}

export function downloadCSV(filename: string, content: string): void {
  const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export function downloadJSON(filename: string, data: unknown): void {
  const content = JSON.stringify(data, null, 2);
  const blob = new Blob([content], { type: 'application/json;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}