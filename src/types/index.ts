// Core domain types for Roya PWA

export type HabitType = 'WIN' | 'QUIT';
export type HabitFrequency = 'daily' | 'weekly' | 'custom';
export type HabitStatus = 'done' | 'missed' | 'clean' | 'relapse';
export type SubscriptionPlan = 'FREE' | 'PRO_MONTHLY' | 'PRO_YEARLY' | 'LIFETIME';
export type SubscriptionStatus = 'active' | 'canceled' | 'expired' | 'trial';
export type MoodEmoji = '😊' | '😐' | '😔' | '😤' | '😴';
export type FlowLevel = 'none' | 'light' | 'medium' | 'heavy';
export type PrayerName = 'Fajr' | 'Dhuhr' | 'Asr' | 'Maghrib' | 'Isha';
export type CalculationMethod = 'MWL' | 'ISNA' | 'Egypt' | 'Makkah' | 'Karachi' | 'Tehran' | 'Jafari';
export type AsrMadhhab = 'Standard' | 'Hanafi';
export type GoalTimeframe = '3m' | '6m' | '1y';
export type ThemeName = 'minimal' | 'soft' | 'bold' | 'dark' | 'custom';
export type CyclePhase = 'menstrual' | 'follicular' | 'ovulation' | 'luteal';

// User & Auth
export interface User {
  id: string;
  email: string;
  displayName?: string;
  createdAt: Date;
  lastLoginAt: Date;
}

export interface AuthSession {
  userId: string;
  token: string;
  expiresAt: Date;
}

export interface UserSettings {
  userId: string;
  theme: ThemeName;
  customBackgroundUrl?: string;
  customBackgroundBlur: number;
  darkMode: boolean;
  muslimMode: boolean;
  location?: string;
  city?: string;
  country?: string;
  pinEnabled: boolean;
  pinHash?: string;
  notificationsEnabled: boolean;
  analyticsConsent: boolean;
  marketingConsent: boolean;
  cycleLensEnabled: boolean; // Cycle Lens toggle
  updatedAt: Date;
}

// Habits
export interface Habit {
  id: string;
  userId: string;
  name: string;
  type: HabitType;
  identityStatement?: string;
  frequency: HabitFrequency;
  customSchedule?: number[]; // days of week [0-6] for weekly
  reminderTimes?: string[]; // HH:MM format
  startDate: Date;
  notes?: string;
  archived: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface HabitLog {
  id: string;
  habitId: string;
  userId: string;
  date: Date;
  status: HabitStatus;
  notes?: string;
  createdAt: Date;
}

export interface HabitStats {
  habitId: string;
  currentStreak: number;
  bestStreak: number;
  totalCompletions: number;
  totalCleanDays?: number; // for QUIT habits
  relapseCount?: number; // for QUIT habits
}

export interface HabitMilestone {
  habitId: string;
  days: number;
  achievedAt: Date;
  type: HabitType;
}

// Mood & Journal
export interface MoodLog {
  id: string;
  userId: string;
  date: Date;
  emoji: MoodEmoji;
  score: number; // 1-5
  tags: string[];
  createdAt: Date;
}

export interface JournalEntry {
  id: string;
  userId: string;
  date: Date;
  content: string;
  promptText?: string; // Store the prompt used for this entry
  privacyMode: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Goals
export interface Goal {
  id: string;
  userId: string;
  timeframe: GoalTimeframe;
  title: string;
  why: string;
  priorityOrder: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface GoalMilestone {
  id: string;
  goalId: string;
  userId: string;
  title: string;
  dueDate?: Date;
  completed: boolean;
  completedAt?: Date;
  notes?: string;
  createdAt: Date;
}

// Cycle Lens (Period Tracker)
export interface CycleSettings {
  userId: string;
  enabled: boolean;
  lastPeriodStart: Date;
  averageCycleLength: number; // days, default 28
  averagePeriodLength: number; // days, default 5
  createdAt: Date;
  updatedAt: Date;
}

export interface CycleLog {
  id: string;
  userId: string;
  date: Date;
  flowLevel: FlowLevel;
  symptoms: string[];
  notes?: string;
  createdAt: Date;
}

export interface CyclePrediction {
  nextPeriodStart: Date;
  nextPeriodEnd: Date;
  nextOvulationStart: Date;
  nextOvulationEnd: Date;
  currentPhase: CyclePhase;
}

export interface PhaseInfo {
  phase: CyclePhase;
  dayInPhase: number;
  description: string;
  suggestions: string[];
}

// Period Tracker (Legacy - keeping for backward compatibility)
export interface PeriodSettings {
  userId: string;
  cycleLength: number; // days
  periodLength: number; // days
  lastStartDate: Date;
  updatedAt: Date;
}

export interface PeriodLog {
  id: string;
  userId: string;
  date: Date;
  flowLevel?: FlowLevel;
  symptoms: string[];
  notes?: string;
  createdAt: Date;
}

export type PeriodPhase = 'menstrual' | 'follicular' | 'ovulation' | 'luteal';

export interface PeriodPrediction {
  nextPeriodStart: Date;
  nextPeriodEnd: Date;
  nextOvulationStart: Date;
  nextOvulationEnd: Date;
}

// Salah
export interface SalahSettings {
  userId: string;
  calculationMethod: CalculationMethod;
  asrMadhhab: AsrMadhhab;
  manualAdjustments: Record<PrayerName, number>; // minutes offset
  location?: { lat: number; lng: number };
  city?: string;
  country?: string;
  updatedAt: Date;
}

export interface SalahTime {
  date: Date;
  prayerName: PrayerName;
  time: string; // HH:MM format
  locationHash: string;
}

export interface SalahLog {
  id: string;
  userId: string;
  date: Date;
  prayerName: PrayerName;
  prayed: boolean;
  niyyahText?: string;
  prayedAt?: Date;
  createdAt: Date;
}

// Subscriptions
export interface Subscription {
  userId: string;
  plan: SubscriptionPlan;
  status: SubscriptionStatus;
  stripeCustomerId?: string;
  stripeSubscriptionId?: string;
  currentPeriodStart?: Date;
  currentPeriodEnd?: Date;
  cancelAtPeriodEnd: boolean;
  trialEndsAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface Entitlements {
  maxHabits: number;
  fullJournalHistory: boolean;
  unlimitedGoals: boolean;
  periodTracker: boolean;
  advancedSalah: boolean;
  dataExport: boolean;
  weeklyReview: boolean;
  advancedAnalytics: boolean;
  appLockPin: boolean;
  focusModeCustomization: boolean;
  premiumThemes: boolean;
  cycleLensAdvanced: boolean; // PRO: symptom/flow logging history + export + deeper insights
}

// Referrals
export interface Referral {
  id: string;
  code: string;
  inviterId: string;
  invitedId?: string;
  rewardStatus: 'pending' | 'granted' | 'expired';
  createdAt: Date;
  usedAt?: Date;
}

// Consent
export interface ConsentLog {
  id: string;
  userId: string;
  consentType: 'analytics' | 'marketing' | 'essential';
  granted: boolean;
  timestamp: Date;
}

// Analytics Events
export type AnalyticsEvent = 
  | 'user_signup'
  | 'onboarding_completed'
  | 'daily_checkin_completed'
  | 'paywall_viewed'
  | 'subscribe'
  | 'cancel_subscription'
  | 'habit_added'
  | 'goal_created'
  | 'journal_entry_created'
  | 'period_logged'
  | 'prayer_logged';

export interface AnalyticsEventData {
  event: AnalyticsEvent;
  userId?: string;
  metadata?: Record<string, string | number | boolean>;
  timestamp: Date;
}

// Milestone copy
export interface MilestoneCopy {
  days: number;
  type: HabitType;
  toast: string;
  card: string;
  prompt?: string;
}

// Weekly Review
export interface WeeklyIntention {
  id: string;
  userId: string;
  weekStart: Date; // Monday of the week
  weekEnd: Date; // Sunday of the week
  intentions: string[]; // 1-3 focus intentions
  createdAt: Date;
}

export interface WeeklyReviewData {
  weekStart: Date;
  weekEnd: Date;
  checkInConsistency: {
    daysCompleted: number;
    totalDays: number;
    percentage: number;
  };
  habitPerformance: {
    topWinHabits: Array<{ habitId: string; habitName: string; completionRate: number }>;
    quitHabits: {
      totalCleanDays: number;
      relapseCount: number;
    };
    bestStreakContinued?: { habitId: string; habitName: string; streak: number };
  };
  moodSummary: {
    averageScore: number;
    topTags: Array<{ tag: string; count: number }>;
    dailyScores: Array<{ date: Date; score: number }>;
  };
  insights: string[];
  nextWeekIntentions?: string[];
  cyclePhases?: string[]; // Cycle Lens: phases during the week
}