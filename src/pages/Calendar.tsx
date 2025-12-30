import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { getMoodRepository, getHabitsRepository, getJournalRepository } from '@/services/ServiceFactory';
import { MoodLog, Habit, HabitLog } from '@/types';
import MoodTrends from '@/components/insights/MoodTrends';
import InsightCards from '@/components/insights/InsightCards';
import { Card, CardContent } from '@/components/ui/card';

const Calendar = () => {
  const { user } = useAuth();
  const moodRepo = getMoodRepository();
  const habitsRepo = getHabitsRepository();
  const journalRepo = getJournalRepository();

  const [loading, setLoading] = useState(true);
  const [moodLogs, setMoodLogs] = useState<MoodLog[]>([]);
  const [habits, setHabits] = useState<Habit[]>([]);
  const [habitLogs, setHabitLogs] = useState<HabitLog[]>([]);

  useEffect(() => {
    loadData();
  }, [user]);

  const loadData = async () => {
    if (!user) return;

    try {
      // Load last 90 days of data
      const endDate = new Date();
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - 90);

      const [moods, allHabits] = await Promise.all([
        moodRepo.getMoodLogs(user.id, startDate, endDate),
        habitsRepo.getHabits(user.id),
      ]);

      setMoodLogs(moods);
      setHabits(allHabits);

      // Load habit logs for all habits
      const allLogs: HabitLog[] = [];
      for (const habit of allHabits) {
        const logs = await habitsRepo.getHabitLogs(habit.id, startDate, endDate);
        allLogs.push(...logs);
      }
      setHabitLogs(allLogs);
    } catch (error) {
      console.error('Error loading calendar data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="animate-pulse text-muted-foreground">Loading...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-8">
      <div>
        <h1 className="text-3xl font-bold">Calendar & Insights</h1>
        <p className="text-muted-foreground mt-1">Track your progress and patterns</p>
      </div>

      {moodLogs.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground">No mood data yet</p>
            <p className="text-sm text-muted-foreground mt-2">
              Complete your daily check-in to start tracking
            </p>
          </CardContent>
        </Card>
      ) : (
        <>
          <MoodTrends moodLogs={moodLogs} />
          <InsightCards moodLogs={moodLogs} habits={habits} habitLogs={habitLogs} />
        </>
      )}
    </div>
  );
};

export default Calendar;