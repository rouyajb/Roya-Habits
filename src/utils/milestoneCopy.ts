import { HabitType, MilestoneCopy } from '@/types';

export const MILESTONE_COPY: MilestoneCopy[] = [
  // WIN Habits
  {
    days: 7,
    type: 'WIN',
    toast: '7 days. You kept your promise to yourself.',
    card: 'One week of showing up. That\'s not small — it\'s the foundation. Keep it simple, keep it steady.',
    prompt: 'What made it easier to show up this week?',
  },
  {
    days: 14,
    type: 'WIN',
    toast: '14 days. Your routine is taking shape.',
    card: 'Two weeks in. Your actions are starting to feel more natural — this is how habits become identity.',
    prompt: 'What\'s one thing you want to protect in your routine?',
  },
  {
    days: 30,
    type: 'WIN',
    toast: '30 days. This is real momentum.',
    card: 'A full month. You didn\'t just "try" — you practiced. Momentum comes from returning, not being perfect.',
    prompt: 'What would make the next 30 days even smoother?',
  },
  {
    days: 60,
    type: 'WIN',
    toast: '60 days. You\'re becoming consistent.',
    card: 'Two months of progress. Your discipline is no longer a mood — it\'s a pattern. Keep the bar realistic and the rhythm strong.',
    prompt: 'Where can you make this habit 10% easier?',
  },
  {
    days: 100,
    type: 'WIN',
    toast: '100 days. You built something lasting.',
    card: 'One hundred days of commitment. You\'ve proven you can return again and again. This is the version of you you can trust.',
    prompt: 'What does this achievement say about who you are now?',
  },
  // QUIT Habits
  {
    days: 7,
    type: 'QUIT',
    toast: '7 clean days. That\'s strength.',
    card: 'One week clean. You chose yourself — again and again. Keep going, gently.',
    prompt: 'What helped you most when it got hard?',
  },
  {
    days: 14,
    type: 'QUIT',
    toast: '14 clean days. You\'re proving it\'s possible.',
    card: 'Two weeks clean. The urge may still show up — but you\'re learning how to move through it.',
    prompt: 'What\'s your best replacement habit right now?',
  },
  {
    days: 30,
    type: 'QUIT',
    toast: '30 clean days. This is a big deal.',
    card: 'A month clean. Progress isn\'t linear, but your total clean days are real — and they add up.',
    prompt: 'What do you want to do with the energy you\'re gaining back?',
  },
  {
    days: 60,
    type: 'QUIT',
    toast: '60 clean days. You\'re in a new chapter.',
    card: 'Two months clean. You\'ve built proof. Even if a tough day comes, you\'re not starting from zero — you\'re starting from experience.',
    prompt: 'What boundary protects you most?',
  },
  {
    days: 100,
    type: 'QUIT',
    toast: '100 clean days. You reclaimed your power.',
    card: 'One hundred clean days. You\'ve built a life that supports your intention. This is deep progress.',
    prompt: 'What do you want to celebrate about yourself today?',
  },
];

export const RELAPSE_MICROCOPY = [
  'Thank you for being honest. Your progress still counts.',
  'We reset the streak, not your growth.',
  'Next step: one small action that supports you.',
];

export function getMilestoneCopy(days: number, type: HabitType): MilestoneCopy | undefined {
  return MILESTONE_COPY.find(m => m.days === days && m.type === type);
}

export function getRandomRelapseCopy(): string {
  return RELAPSE_MICROCOPY[Math.floor(Math.random() * RELAPSE_MICROCOPY.length)];
}