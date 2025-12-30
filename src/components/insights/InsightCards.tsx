import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Lightbulb, TrendingUp, Calendar } from 'lucide-react';
import { MoodLog, HabitLog, Habit } from '@/types';

interface InsightCardsProps {
  moodLogs: MoodLog[];
  habits: Habit[];
  habitLogs: HabitLog[];
}

const InsightCards: React.FC<InsightCardsProps> = ({ moodLogs, habits, habitLogs }) => {
  // Calculate insights
  const getLast30DaysData = () => {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - 30);
    
    const recentMoodLogs = moodLogs.filter(log => new Date(log.date) >= cutoffDate);
    const recentHabitLogs = habitLogs.filter(log => new Date(log.date) >= cutoffDate);
    
    return { recentMoodLogs, recentHabitLogs };
  };

  const { recentMoodLogs, recentHabitLogs } = getLast30DaysData();

  // Insight 1: Habit completion vs mood
  const getHabitCompletionInsight = () => {
    if (recentMoodLogs.length === 0 || recentHabitLogs.length === 0) {
      return null;
    }

    // Group by date
    const dateMap = new Map<string, { completed: number; total: number; mood: number }>();

    recentMoodLogs.forEach(moodLog => {
      const dateStr = new Date(moodLog.date).toISOString().split('T')[0];
      const dayHabitLogs = recentHabitLogs.filter(
        log => new Date(log.date).toISOString().split('T')[0] === dateStr
      );

      const completed = dayHabitLogs.filter(
        log => log.status === 'done' || log.status === 'clean'
      ).length;
      const total = dayHabitLogs.length;

      if (total > 0) {
        dateMap.set(dateStr, { completed, total, mood: moodLog.score });
      }
    });

    // Calculate average mood for high completion days (>=80%)
    const highCompletionDays = Array.from(dateMap.values()).filter(
      day => day.completed / day.total >= 0.8
    );

    if (highCompletionDays.length === 0) {
      return null;
    }

    const avgMood = (
      highCompletionDays.reduce((sum, day) => sum + day.mood, 0) / highCompletionDays.length
    ).toFixed(1);

    return {
      title: 'Habit Completion & Mood',
      description: `On days you completed ≥80% of your habits, your average mood was ${avgMood}/5.`,
      icon: TrendingUp,
    };
  };

  // Insight 2: Best mood day
  const getBestMoodDay = () => {
    if (recentMoodLogs.length === 0) {
      return null;
    }

    const bestLog = recentMoodLogs.reduce((best, current) => 
      current.score > best.score ? current : best
    );

    const dateStr = new Date(bestLog.date).toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric' 
    });

    return {
      title: 'Best Mood Day',
      description: `Your best mood this month: ${dateStr} (${bestLog.score}/5) ${bestLog.emoji}`,
      icon: Calendar,
    };
  };

  // Insight 3: Habits associated with higher mood
  const getHabitMoodAssociation = () => {
    if (recentMoodLogs.length === 0 || recentHabitLogs.length === 0 || habits.length === 0) {
      return null;
    }

    // Calculate average mood for days each habit was completed
    const habitMoodMap = new Map<string, { totalMood: number; count: number }>();

    recentMoodLogs.forEach(moodLog => {
      const dateStr = new Date(moodLog.date).toISOString().split('T')[0];
      const dayHabitLogs = recentHabitLogs.filter(
        log => new Date(log.date).toISOString().split('T')[0] === dateStr &&
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

    // Find habits with highest average mood (min 3 completions)
    const habitAverages = Array.from(habitMoodMap.entries())
      .filter(([, data]) => data.count >= 3)
      .map(([habitId, data]) => ({
        habitId,
        avgMood: data.totalMood / data.count,
        count: data.count,
      }))
      .sort((a, b) => b.avgMood - a.avgMood);

    if (habitAverages.length === 0) {
      return null;
    }

    const topHabit = habitAverages[0];
    const habit = habits.find(h => h.id === topHabit.habitId);

    if (!habit) {
      return null;
    }

    return {
      title: 'Habit Association',
      description: `"${habit.name}" is often completed on higher-mood days (avg ${topHabit.avgMood.toFixed(1)}/5).`,
      icon: Lightbulb,
    };
  };

  const insights = [
    getHabitCompletionInsight(),
    getBestMoodDay(),
    getHabitMoodAssociation(),
  ].filter(Boolean);

  if (insights.length === 0) {
    return null;
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Insights</h2>
        <p className="text-xs text-muted-foreground">Informational only</p>
      </div>
      <div className="grid gap-4">
        {insights.map((insight, index) => {
          if (!insight) return null;
          const Icon = insight.icon;
          return (
            <Card key={index} className="bg-primary/5 border-primary/10">
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <Icon className="h-4 w-4 text-primary" />
                  {insight.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">{insight.description}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>
      <p className="text-xs text-muted-foreground text-center">
        Insights are informational and show associations, not causation.
      </p>
    </div>
  );
};

export default InsightCards;