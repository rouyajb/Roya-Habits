import { useState } from 'react';
import { Habit, HabitLog, HabitStatus } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { AlertCircle, CheckCircle2, Flame } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { getHabitsRepository } from '@/services/ServiceFactory';
import { useEffect, useState as useComponentState } from 'react';

interface HabitChecklistProps {
  habits: Array<{ habit: Habit; log: HabitLog | null }>;
  onToggle: (habitId: string, status: HabitStatus) => void;
  disabled?: boolean;
}

const HabitChecklist: React.FC<HabitChecklistProps> = ({ habits, onToggle, disabled = false }) => {
  const [relapseHabit, setRelapseHabit] = useState<Habit | null>(null);
  const [habitStreaks, setHabitStreaks] = useState<Map<string, number>>(new Map());
  const habitsRepo = getHabitsRepository();

  useEffect(() => {
    // Load streaks for all habits
    const loadStreaks = async () => {
      const streaks = new Map<string, number>();
      for (const { habit } of habits) {
        const stats = await habitsRepo.getHabitStats(habit.id);
        streaks.set(habit.id, stats.currentStreak);
      }
      setHabitStreaks(streaks);
    };
    loadStreaks();
  }, [habits]);

  const handleWinToggle = (habit: Habit, currentLog: HabitLog | null) => {
    if (disabled) return;
    const newStatus: HabitStatus = currentLog?.status === 'done' ? 'missed' : 'done';
    onToggle(habit.id, newStatus);
  };

  const handleQuitToggle = (habit: Habit, currentLog: HabitLog | null) => {
    if (disabled) return;
    if (currentLog?.status === 'clean') {
      // If already clean, show relapse confirmation
      setRelapseHabit(habit);
    } else {
      // Mark as clean
      onToggle(habit.id, 'clean');
    }
  };

  const handleRelapseConfirm = () => {
    if (relapseHabit) {
      onToggle(relapseHabit.id, 'relapse');
      setRelapseHabit(null);
    }
  };

  const winHabits = habits.filter(h => h.habit.type === 'WIN');
  const quitHabits = habits.filter(h => h.habit.type === 'QUIT');

  if (habits.length === 0) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <p className="text-muted-foreground">No habits for today</p>
          <p className="text-sm text-muted-foreground mt-2">
            Create your first habit to get started
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {/* WIN Habits */}
      {winHabits.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              🎯 WIN Habits
              <Badge variant="outline" className="ml-auto">
                {winHabits.filter(h => h.log?.status === 'done').length} / {winHabits.length}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {winHabits.map(({ habit, log }) => {
              const streak = habitStreaks.get(habit.id) || 0;
              return (
                <div
                  key={habit.id}
                  className={`flex items-start gap-3 p-3 rounded-lg border hover:bg-accent/50 transition-colors ${
                    disabled ? 'opacity-60' : ''
                  }`}
                >
                  <Checkbox
                    checked={log?.status === 'done'}
                    onCheckedChange={() => handleWinToggle(habit, log)}
                    className="mt-1"
                    disabled={disabled}
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <p className={`font-medium ${log?.status === 'done' ? 'line-through text-muted-foreground' : ''}`}>
                        {habit.name}
                      </p>
                      {streak > 0 && (
                        <div className="flex items-center gap-1 text-xs text-orange-500">
                          <Flame className="h-3 w-3" />
                          <span className="font-semibold">{streak}</span>
                        </div>
                      )}
                    </div>
                    {habit.identityStatement && (
                      <p className="text-xs text-muted-foreground italic mt-1">
                        "{habit.identityStatement}"
                      </p>
                    )}
                  </div>
                  {log?.status === 'done' && (
                    <CheckCircle2 className="h-5 w-5 text-green-500 flex-shrink-0" />
                  )}
                </div>
              );
            })}
          </CardContent>
        </Card>
      )}

      {/* QUIT Habits */}
      {quitHabits.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              🚫 QUIT Habits
              <Badge variant="outline" className="ml-auto">
                {quitHabits.filter(h => h.log?.status === 'clean').length} / {quitHabits.length}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {quitHabits.map(({ habit, log }) => {
              const streak = habitStreaks.get(habit.id) || 0;
              return (
                <div
                  key={habit.id}
                  className={`flex items-start gap-3 p-3 rounded-lg border hover:bg-accent/50 transition-colors ${
                    disabled ? 'opacity-60' : ''
                  }`}
                >
                  <Checkbox
                    checked={log?.status === 'clean'}
                    onCheckedChange={() => handleQuitToggle(habit, log)}
                    className="mt-1"
                    disabled={disabled}
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <p className={`font-medium ${log?.status === 'clean' ? 'text-muted-foreground' : ''}`}>
                        {habit.name}
                      </p>
                      {streak > 0 && (
                        <div className="flex items-center gap-1 text-xs text-green-500">
                          <Flame className="h-3 w-3" />
                          <span className="font-semibold">{streak}</span>
                        </div>
                      )}
                    </div>
                    {habit.identityStatement && (
                      <p className="text-xs text-muted-foreground italic mt-1">
                        "{habit.identityStatement}"
                      </p>
                    )}
                    {log?.status === 'clean' && (
                      <p className="text-xs text-green-600 mt-1">
                        ✓ Stayed clean today
                      </p>
                    )}
                  </div>
                  {log?.status === 'clean' && (
                    <CheckCircle2 className="h-5 w-5 text-green-500 flex-shrink-0" />
                  )}
                </div>
              );
            })}
          </CardContent>
        </Card>
      )}

      {/* Relapse Confirmation Dialog */}
      <AlertDialog open={!!relapseHabit} onOpenChange={() => setRelapseHabit(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-orange-500" />
              Relapse?
            </AlertDialogTitle>
            <AlertDialogDescription className="space-y-2">
              <p>
                Are you sure you want to mark "{relapseHabit?.name}" as relapsed today?
              </p>
              <p className="text-sm">
                This will reset your current streak, but your best streak and total clean days will be preserved.
              </p>
              <p className="text-sm font-medium">
                Remember: Progress isn't linear. Every day clean is a victory.
              </p>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleRelapseConfirm} className="bg-orange-500 hover:bg-orange-600">
              Confirm Relapse
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default HabitChecklist;