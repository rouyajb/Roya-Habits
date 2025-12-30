import { WeeklyReviewData, Habit, HabitLog, MoodLog, HabitType, CycleSettings } from '@/types';
import { getWeekStart, getWeekEnd } from './weekUtils';
import { getPhasesForWeek, getPhaseName } from './cycleCalculations';

/**
 * Generate weekly review data from habit logs and mood logs
 */
export async function generateWeeklyReview(
  weekStart: Date,
  habits: Habit[],
  habitLogs: HabitLog[],
  moodLogs: MoodLog[],
  cycleSettings?: CycleSettings | null
): Promise<WeeklyReviewData> {
  const weekEnd = getWeekEnd(weekStart);
  
  // Get all days in the week
  const daysInWeek: Date[] = [];
  for (let i = 0; i < 7; i++) {
    const day = new Date(weekStart);
    day.setDate(day.getDate() + i);
    day.setHours(0, 0, 0, 0);
    daysInWeek.push(day);
  }

  // Filter logs for this week
  const weekHabitLogs = habitLogs.filter(log => {
    const logDate = new Date(log.date);
    return logDate >= weekStart && logDate <= weekEnd;
  });

  const weekMoodLogs = moodLogs.filter(log => {
    const logDate = new Date(log.date);
    return logDate >= weekStart && logDate <= weekEnd;
  });

  // 1. Check-in consistency
  const daysWithCheckIn = new Set<string>();
  
  // Count days with both habits logged AND mood logged
  daysInWeek.forEach(day => {
    const dayStr = day.toISOString().split('T')[0];
    const dayHabitLogs = weekHabitLogs.filter(
      log => new Date(log.date).toISOString().split('T')[0] === dayStr
    );
    const dayMoodLog = weekMoodLogs.find(
      log => new Date(log.date).toISOString().split('T')[0] === dayStr
    );

    // Check if all habits for that day are logged AND mood is logged
    const activeHabits = habits.filter(h => !h.archived);
    const allHabitsLogged = activeHabits.length > 0 && 
      activeHabits.every(habit => 
        dayHabitLogs.some(log => log.habitId === habit.id)
      );

    if (allHabitsLogged && dayMoodLog) {
      daysWithCheckIn.add(dayStr);
    }
  });

  const checkInConsistency = {
    daysCompleted: daysWithCheckIn.size,
    totalDays: 7,
    percentage: Math.round((daysWithCheckIn.size / 7) * 100),
  };

  // 2. Habit performance
  const winHabits = habits.filter(h => h.type === 'WIN' && !h.archived);
  const quitHabits = habits.filter(h => h.type === 'QUIT' && !h.archived);

  // Calculate completion rates for WIN habits
  const winHabitStats = winHabits.map(habit => {
    const habitLogsForWeek = weekHabitLogs.filter(log => log.habitId === habit.id);
    const completions = habitLogsForWeek.filter(log => log.status === 'done').length;
    const completionRate = habitLogsForWeek.length > 0 
      ? Math.round((completions / habitLogsForWeek.length) * 100)
      : 0;

    return {
      habitId: habit.id,
      habitName: habit.name,
      completionRate,
    };
  });

  // Sort and get top 3
  const topWinHabits = winHabitStats
    .sort((a, b) => b.completionRate - a.completionRate)
    .slice(0, 3);

  // QUIT habits stats
  const quitHabitLogs = weekHabitLogs.filter(log => 
    quitHabits.some(h => h.id === log.habitId)
  );
  const totalCleanDays = quitHabitLogs.filter(log => log.status === 'clean').length;
  const relapseCount = quitHabitLogs.filter(log => log.status === 'relapse').length;

  // Best streak continued (find habit with longest current streak)
  let bestStreakContinued: { habitId: string; habitName: string; streak: number } | undefined;
  let maxStreak = 0;

  habits.forEach(habit => {
    const habitLogsAll = habitLogs.filter(log => log.habitId === habit.id);
    const currentStreak = calculateCurrentStreak(habitLogsAll, habit.type);
    
    if (currentStreak > maxStreak && currentStreak >= 7) {
      maxStreak = currentStreak;
      bestStreakContinued = {
        habitId: habit.id,
        habitName: habit.name,
        streak: currentStreak,
      };
    }
  });

  const habitPerformance = {
    topWinHabits,
    quitHabits: {
      totalCleanDays,
      relapseCount,
    },
    bestStreakContinued,
  };

  // 3. Mood summary
  const averageScore = weekMoodLogs.length > 0
    ? weekMoodLogs.reduce((sum, log) => sum + log.score, 0) / weekMoodLogs.length
    : 0;

  const tagCounts = new Map<string, number>();
  weekMoodLogs.forEach(log => {
    log.tags.forEach(tag => {
      tagCounts.set(tag, (tagCounts.get(tag) || 0) + 1);
    });
  });

  const topTags = Array.from(tagCounts.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([tag, count]) => ({ tag, count }));

  const dailyScores = daysInWeek.map(day => {
    const dayStr = day.toISOString().split('T')[0];
    const moodLog = weekMoodLogs.find(
      log => new Date(log.date).toISOString().split('T')[0] === dayStr
    );
    return {
      date: day,
      score: moodLog?.score || 0,
    };
  });

  const moodSummary = {
    averageScore: Math.round(averageScore * 10) / 10,
    topTags,
    dailyScores,
  };

  // 4. Generate insights
  const insights = generateInsights(
    weekHabitLogs,
    weekMoodLogs,
    habits,
    daysInWeek
  );

  // 5. Cycle phases (if Cycle Lens enabled)
  let cyclePhases: string[] | undefined;
  if (cycleSettings && cycleSettings.enabled) {
    const phases = getPhasesForWeek(
      weekStart,
      weekEnd,
      cycleSettings.lastPeriodStart,
      cycleSettings.averageCycleLength,
      cycleSettings.averagePeriodLength
    );
    cyclePhases = phases.map(phase => getPhaseName(phase));
  }

  return {
    weekStart,
    weekEnd,
    checkInConsistency,
    habitPerformance,
    moodSummary,
    insights,
    cyclePhases,
  };
}

function calculateCurrentStreak(logs: HabitLog[], habitType: HabitType): number {
  if (logs.length === 0) return 0;

  const sortedLogs = logs
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const successStatus = habitType === 'WIN' ? 'done' : 'clean';
  let streak = 0;

  for (const log of sortedLogs) {
    if (log.status === successStatus) {
      streak++;
    } else {
      break;
    }
  }

  return streak;
}

function generateInsights(
  habitLogs: HabitLog[],
  moodLogs: MoodLog[],
  habits: Habit[],
  daysInWeek: Date[]
): string[] {
  const insights: string[] = [];

  if (moodLogs.length === 0) {
    return insights;
  }

  // Insight 1: Habit completion vs mood
  const dayMoodMap = new Map<string, { completionRate: number; mood: number }>();

  daysInWeek.forEach(day => {
    const dayStr = day.toISOString().split('T')[0];
    const dayHabitLogs = habitLogs.filter(
      log => new Date(log.date).toISOString().split('T')[0] === dayStr
    );
    const dayMoodLog = moodLogs.find(
      log => new Date(log.date).toISOString().split('T')[0] === dayStr
    );

    if (dayHabitLogs.length > 0 && dayMoodLog) {
      const completed = dayHabitLogs.filter(
        log => log.status === 'done' || log.status === 'clean'
      ).length;
      const completionRate = completed / dayHabitLogs.length;

      dayMoodMap.set(dayStr, {
        completionRate,
        mood: dayMoodLog.score,
      });
    }
  });

  const highCompletionDays = Array.from(dayMoodMap.values()).filter(
    d => d.completionRate >= 0.8
  );

  if (highCompletionDays.length > 0) {
    const avgMood = highCompletionDays.reduce((sum, d) => sum + d.mood, 0) / highCompletionDays.length;
    insights.push(
      `On days you completed most of your habits, your mood was ${avgMood.toFixed(1)}/5 on average.`
    );
  }

  // Insight 2: Best day
  const bestDay = moodLogs.reduce((best, current) => 
    current.score > best.score ? current : best
  );

  const bestDayStr = new Date(bestDay.date).toLocaleDateString('en-US', {
    weekday: 'long',
  });

  insights.push(`Your best day this week was ${bestDayStr} (${bestDay.score}/5).`);

  // Insight 3: Most supportive habit
  if (habits.length > 0) {
    const habitMoodMap = new Map<string, { totalMood: number; count: number }>();

    moodLogs.forEach(moodLog => {
      const dayStr = new Date(moodLog.date).toISOString().split('T')[0];
      const dayHabitLogs = habitLogs.filter(
        log => new Date(log.date).toISOString().split('T')[0] === dayStr &&
               (log.status === 'done' || log.status === 'clean')
      );

      dayHabitLogs.forEach(habitLog => {
        const current = habitMoodMap.get(habitLog.habitId) || { totalMood: 0, count: 0 };
        habitMoodMap.set(habitLog.habitId, {
          totalMood: current.totalMood + moodLog.score,
          count: current.count + 1,
        });
      });
    });

    const habitAverages = Array.from(habitMoodMap.entries())
      .filter(([, data]) => data.count >= 2)
      .map(([habitId, data]) => ({
        habitId,
        avgMood: data.totalMood / data.count,
      }))
      .sort((a, b) => b.avgMood - a.avgMood);

    if (habitAverages.length > 0) {
      const topHabitId = habitAverages[0].habitId;
      const topHabit = habits.find(h => h.id === topHabitId);

      if (topHabit) {
        insights.push(
          `One habit that supported you most: "${topHabit.name}".`
        );
      }
    }
  }

  return insights.slice(0, 3);
}

/**
 * Generate plain text summary for copying
 */
export function generateTextSummary(review: WeeklyReviewData): string {
  const weekRange = `${review.weekStart.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} – ${review.weekEnd.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`;
  
  let summary = `WEEKLY REVIEW: ${weekRange}\n\n`;
  
  summary += `CHECK-IN CONSISTENCY\n`;
  summary += `${review.checkInConsistency.daysCompleted}/7 days completed (${review.checkInConsistency.percentage}%)\n\n`;
  
  summary += `HABIT PERFORMANCE\n`;
  if (review.habitPerformance.topWinHabits.length > 0) {
    summary += `Top WIN habits:\n`;
    review.habitPerformance.topWinHabits.forEach((habit, i) => {
      summary += `${i + 1}. ${habit.habitName} (${habit.completionRate}%)\n`;
    });
  }
  
  if (review.habitPerformance.quitHabits.totalCleanDays > 0) {
    summary += `QUIT habits: ${review.habitPerformance.quitHabits.totalCleanDays} clean days\n`;
  }
  
  if (review.habitPerformance.bestStreakContinued) {
    summary += `Best streak: ${review.habitPerformance.bestStreakContinued.habitName} (${review.habitPerformance.bestStreakContinued.streak} days)\n`;
  }
  
  summary += `\nMOOD SUMMARY\n`;
  summary += `Average mood: ${review.moodSummary.averageScore}/5\n`;
  if (review.moodSummary.topTags.length > 0) {
    summary += `Top tags: ${review.moodSummary.topTags.map(t => t.tag).join(', ')}\n`;
  }
  
  if (review.insights.length > 0) {
    summary += `\nINSIGHTS\n`;
    review.insights.forEach((insight, i) => {
      summary += `${i + 1}. ${insight}\n`;
    });
  }

  if (review.cyclePhases && review.cyclePhases.length > 0) {
    summary += `\nCYCLE LENS\n`;
    summary += `This week was mostly: ${review.cyclePhases.join(', ')}\n`;
    summary += `Your energy may vary across phases — plan gently.\n`;
  }
  
  if (review.nextWeekIntentions && review.nextWeekIntentions.length > 0) {
    summary += `\nNEXT WEEK FOCUS\n`;
    review.nextWeekIntentions.forEach((intention, i) => {
      summary += `${i + 1}. ${intention}\n`;
    });
  }
  
  return summary;
}