import { CyclePhase, CyclePrediction, PhaseInfo } from '@/types';

/**
 * Calculate cycle day (1-indexed) from last period start
 */
export function calculateCycleDay(date: Date, lastPeriodStart: Date): number {
  const diffTime = date.getTime() - lastPeriodStart.getTime();
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  return diffDays + 1;
}

/**
 * Calculate current cycle phase based on cycle day
 */
export function calculatePhase(
  cycleDay: number,
  averageCycleLength: number,
  averagePeriodLength: number
): CyclePhase {
  // Normalize cycle day to current cycle
  const normalizedDay = ((cycleDay - 1) % averageCycleLength) + 1;

  // Menstrual phase: days 1-5 (or averagePeriodLength)
  if (normalizedDay <= averagePeriodLength) {
    return 'menstrual';
  }

  // Ovulation: typically days 12-16 for 28-day cycle
  const ovulationStart = Math.floor(averageCycleLength / 2) - 2;
  const ovulationEnd = Math.floor(averageCycleLength / 2) + 2;

  if (normalizedDay >= ovulationStart && normalizedDay <= ovulationEnd) {
    return 'ovulation';
  }

  // Follicular: after menstrual, before ovulation
  if (normalizedDay > averagePeriodLength && normalizedDay < ovulationStart) {
    return 'follicular';
  }

  // Luteal: after ovulation, before next period
  return 'luteal';
}

/**
 * Calculate predictions for next period and ovulation
 */
export function calculatePredictions(
  lastPeriodStart: Date,
  averageCycleLength: number,
  averagePeriodLength: number
): CyclePrediction {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const cycleDay = calculateCycleDay(today, lastPeriodStart);
  const currentPhase = calculatePhase(cycleDay, averageCycleLength, averagePeriodLength);

  // Calculate next period start
  const daysSinceLastPeriod = Math.floor((today.getTime() - lastPeriodStart.getTime()) / (1000 * 60 * 60 * 24));
  const cyclesCompleted = Math.floor(daysSinceLastPeriod / averageCycleLength);
  const nextPeriodStart = new Date(lastPeriodStart);
  nextPeriodStart.setDate(nextPeriodStart.getDate() + (cyclesCompleted + 1) * averageCycleLength);

  const nextPeriodEnd = new Date(nextPeriodStart);
  nextPeriodEnd.setDate(nextPeriodEnd.getDate() + averagePeriodLength - 1);

  // Calculate next ovulation (typically mid-cycle)
  const nextOvulationStart = new Date(nextPeriodStart);
  nextOvulationStart.setDate(nextOvulationStart.getDate() + Math.floor(averageCycleLength / 2) - 2);

  const nextOvulationEnd = new Date(nextOvulationStart);
  nextOvulationEnd.setDate(nextOvulationEnd.getDate() + 4);

  return {
    nextPeriodStart,
    nextPeriodEnd,
    nextOvulationStart,
    nextOvulationEnd,
    currentPhase,
  };
}

/**
 * Get phase info with description and suggestions
 */
export function getPhaseInfo(phase: CyclePhase, cycleDay: number): PhaseInfo {
  const phaseData: Record<CyclePhase, { description: string; suggestions: string[] }> = {
    menstrual: {
      description: 'Your body is shedding the uterine lining. Energy may be lower.',
      suggestions: [
        'Keep habits small and gentle',
        'Prioritize rest and recovery',
        'Light movement if it feels good',
      ],
    },
    follicular: {
      description: 'Energy and mood often rise as estrogen increases.',
      suggestions: [
        'Good time for new habits or challenges',
        'Plan deep work or creative projects',
        'Social energy may be higher',
      ],
    },
    ovulation: {
      description: 'Peak energy and confidence. You may feel most social and creative.',
      suggestions: [
        'Tackle challenging tasks',
        'Schedule important meetings',
        'High energy for workouts',
      ],
    },
    luteal: {
      description: 'Energy gradually decreases. You may crave comfort and routine.',
      suggestions: [
        'Focus on completion over starting new things',
        'Honor need for more rest',
        'Gentle movement and comfort foods',
      ],
    },
  };

  return {
    phase,
    dayInPhase: cycleDay,
    ...phaseData[phase],
  };
}

/**
 * Get phase color for calendar display
 */
export function getPhaseColor(phase: CyclePhase): string {
  const colors: Record<CyclePhase, string> = {
    menstrual: 'bg-red-100 dark:bg-red-900/20 border-red-200 dark:border-red-800',
    follicular: 'bg-green-100 dark:bg-green-900/20 border-green-200 dark:border-green-800',
    ovulation: 'bg-purple-100 dark:bg-purple-900/20 border-purple-200 dark:border-purple-800',
    luteal: 'bg-blue-100 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800',
  };
  return colors[phase];
}

/**
 * Get phase name for display
 */
export function getPhaseName(phase: CyclePhase): string {
  const names: Record<CyclePhase, string> = {
    menstrual: 'Menstrual',
    follicular: 'Follicular',
    ovulation: 'Ovulation',
    luteal: 'Luteal',
  };
  return names[phase];
}

/**
 * Calculate which phases occurred during a week
 */
export function getPhasesForWeek(
  weekStart: Date,
  weekEnd: Date,
  lastPeriodStart: Date,
  averageCycleLength: number,
  averagePeriodLength: number
): CyclePhase[] {
  const phases = new Set<CyclePhase>();

  for (let d = new Date(weekStart); d <= weekEnd; d.setDate(d.getDate() + 1)) {
    const cycleDay = calculateCycleDay(d, lastPeriodStart);
    const phase = calculatePhase(cycleDay, averageCycleLength, averagePeriodLength);
    phases.add(phase);
  }

  return Array.from(phases);
}