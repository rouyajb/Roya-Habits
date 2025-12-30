/**
 * Week utilities for Europe/Berlin timezone
 * Weeks are defined as Monday-Sunday
 */

export function getWeekStart(date: Date): Date {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  
  // Get day of week (0 = Sunday, 1 = Monday, ..., 6 = Saturday)
  const day = d.getDay();
  
  // Calculate days to subtract to get to Monday
  const diff = day === 0 ? -6 : 1 - day;
  
  d.setDate(d.getDate() + diff);
  return d;
}

export function getWeekEnd(date: Date): Date {
  const weekStart = getWeekStart(date);
  const weekEnd = new Date(weekStart);
  weekEnd.setDate(weekEnd.getDate() + 6);
  weekEnd.setHours(23, 59, 59, 999);
  return weekEnd;
}

export function getWeekRange(date: Date): { start: Date; end: Date } {
  return {
    start: getWeekStart(date),
    end: getWeekEnd(date),
  };
}

export function formatWeekRange(weekStart: Date): string {
  const weekEnd = getWeekEnd(weekStart);
  
  const startStr = weekStart.toLocaleDateString('en-US', { 
    month: 'short', 
    day: 'numeric' 
  });
  
  const endStr = weekEnd.toLocaleDateString('en-US', { 
    month: 'short', 
    day: 'numeric',
    year: 'numeric'
  });
  
  return `${startStr} – ${endStr}`;
}

export function getPreviousWeek(weekStart: Date): Date {
  const prevWeek = new Date(weekStart);
  prevWeek.setDate(prevWeek.getDate() - 7);
  return getWeekStart(prevWeek);
}

export function getNextWeek(weekStart: Date): Date {
  const nextWeek = new Date(weekStart);
  nextWeek.setDate(nextWeek.getDate() + 7);
  return getWeekStart(nextWeek);
}

export function isCurrentWeek(weekStart: Date): boolean {
  const now = new Date();
  const currentWeekStart = getWeekStart(now);
  return weekStart.getTime() === currentWeekStart.getTime();
}

export function isFutureWeek(weekStart: Date): boolean {
  const now = new Date();
  const currentWeekStart = getWeekStart(now);
  return weekStart.getTime() > currentWeekStart.getTime();
}