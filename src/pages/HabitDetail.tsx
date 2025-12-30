import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { getHabitsRepository } from '@/services/ServiceFactory';
import { Habit, HabitStats, HabitLog, HabitMilestone } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Flame, TrendingUp, Calendar, Award, Edit, Trash2 } from 'lucide-react';
import HeatmapCalendar from '@/components/habits/HeatmapCalendar';
import HabitForm from '@/components/habits/HabitForm';
import { toast } from 'sonner';
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

const HabitDetail = () => {
  const { habitId } = useParams<{ habitId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const habitsRepo = getHabitsRepository();

  const [habit, setHabit] = useState<Habit | null>(null);
  const [stats, setStats] = useState<HabitStats | null>(null);
  const [logs, setLogs] = useState<HabitLog[]>([]);
  const [milestones, setMilestones] = useState<HabitMilestone[]>([]);
  const [loading, setLoading] = useState(true);
  const [editFormOpen, setEditFormOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  useEffect(() => {
    loadHabitDetail();
  }, [habitId, user]);

  const loadHabitDetail = async () => {
    if (!habitId || !user) return;

    try {
      const habitData = await habitsRepo.getHabit(habitId);
      if (!habitData || habitData.userId !== user.id) {
        toast.error('Habit not found');
        navigate('/habits');
        return;
      }

      setHabit(habitData);

      const statsData = await habitsRepo.getHabitStats(habitId);
      setStats(statsData);

      // Load last 90 days of logs
      const endDate = new Date();
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - 90);
      const logsData = await habitsRepo.getHabitLogs(habitId, startDate, endDate);
      setLogs(logsData);

      // Load milestones
      const milestonesData = await habitsRepo.getMilestones(habitId);
      setMilestones(milestonesData);
    } catch (error) {
      console.error('Error loading habit detail:', error);
      toast.error('Failed to load habit details');
    } finally {
      setLoading(false);
    }
  };

  const handleEditHabit = async (data: Partial<Habit>) => {
    if (!habitId) return;

    try {
      await habitsRepo.updateHabit(habitId, data);
      toast.success('Habit updated successfully');
      setEditFormOpen(false);
      loadHabitDetail();
    } catch (error) {
      console.error('Error updating habit:', error);
      toast.error('Failed to update habit');
    }
  };

  const handleDeleteHabit = async () => {
    if (!habitId) return;

    try {
      await habitsRepo.deleteHabit(habitId);
      toast.success('Habit deleted successfully');
      navigate('/habits');
    } catch (error) {
      console.error('Error deleting habit:', error);
      toast.error('Failed to delete habit');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="animate-pulse text-muted-foreground">Loading...</div>
      </div>
    );
  }

  if (!habit || !stats) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] gap-4">
        <p className="text-muted-foreground">Habit not found</p>
        <Button onClick={() => navigate('/habits')}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Habits
        </Button>
      </div>
    );
  }

  const allMilestones = [
    { days: 7, label: '1 Week' },
    { days: 14, label: '2 Weeks' },
    { days: 30, label: '1 Month' },
    { days: 60, label: '2 Months' },
    { days: 100, label: '100 Days' },
  ].map(m => ({
    ...m,
    achieved: stats.bestStreak >= m.days,
    achievedDate: milestones.find(ms => ms.days === m.days)?.achievedAt,
  }));

  return (
    <div className="space-y-6 pb-8">
      {/* Header */}
      <div>
        <Button variant="ghost" onClick={() => navigate('/habits')} className="mb-4">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Habits
        </Button>
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <h1 className="text-3xl font-bold">{habit.name}</h1>
            {habit.identityStatement && (
              <p className="text-muted-foreground italic mt-2">
                "{habit.identityStatement}"
              </p>
            )}
          </div>
          <div className="flex items-center gap-2">
            <Badge variant={habit.type === 'WIN' ? 'default' : 'secondary'} className="text-lg px-4 py-2">
              {habit.type === 'WIN' ? '🎯 WIN' : '🚫 QUIT'}
            </Badge>
            <Button variant="outline" size="sm" onClick={() => setEditFormOpen(true)}>
              <Edit className="h-4 w-4 mr-2" />
              Edit
            </Button>
            <Button variant="outline" size="sm" onClick={() => setDeleteDialogOpen(true)}>
              <Trash2 className="h-4 w-4 mr-2" />
              Delete
            </Button>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Flame className="h-4 w-4 text-orange-500" />
              Current Streak
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{stats.currentStreak}</p>
            <p className="text-xs text-muted-foreground mt-1">days</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-green-500" />
              Best Streak
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{stats.bestStreak}</p>
            <p className="text-xs text-muted-foreground mt-1">days</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Calendar className="h-4 w-4 text-blue-500" />
              {habit.type === 'WIN' ? 'Completions' : 'Clean Days'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">
              {habit.type === 'WIN' ? stats.totalCompletions : stats.totalCleanDays}
            </p>
            <p className="text-xs text-muted-foreground mt-1">total</p>
          </CardContent>
        </Card>

        {habit.type === 'QUIT' && (
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <Award className="h-4 w-4 text-purple-500" />
                Relapses
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{stats.relapseCount || 0}</p>
              <p className="text-xs text-muted-foreground mt-1">tracked</p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Milestones */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Milestones Achieved</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {allMilestones.map((milestone) => (
              <div
                key={milestone.days}
                className={`flex flex-col items-center p-4 rounded-lg border-2 transition-all ${
                  milestone.achieved
                    ? 'border-primary bg-primary/10'
                    : 'border-muted bg-muted/30'
                }`}
              >
                <Award
                  className={`h-8 w-8 mb-2 ${
                    milestone.achieved ? 'text-primary' : 'text-muted-foreground'
                  }`}
                />
                <p className="text-sm font-medium text-center">{milestone.label}</p>
                <p className="text-xs text-muted-foreground">{milestone.days} days</p>
                {milestone.achieved && milestone.achievedDate && (
                  <p className="text-xs text-muted-foreground mt-1">
                    {new Date(milestone.achievedDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  </p>
                )}
                {milestone.achieved && (
                  <Badge variant="secondary" className="mt-2 text-xs">
                    ✓ Achieved
                  </Badge>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Heatmap Calendar */}
      <HeatmapCalendar logs={logs} habitType={habit.type} startDate={habit.startDate} />

      {/* Habit Details */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <p className="text-sm font-medium text-muted-foreground">Frequency</p>
            <p className="text-base mt-1">
              {habit.frequency === 'daily' && 'Every day'}
              {habit.frequency === 'weekly' && `${habit.customSchedule?.length || 0} days per week`}
              {habit.frequency === 'custom' && 'Custom schedule'}
            </p>
          </div>

          {habit.reminderTimes && habit.reminderTimes.length > 0 && (
            <div>
              <p className="text-sm font-medium text-muted-foreground">Reminders</p>
              <div className="flex flex-wrap gap-2 mt-1">
                {habit.reminderTimes.map((time, index) => (
                  <Badge key={index} variant="outline">
                    {time}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {habit.notes && (
            <div>
              <p className="text-sm font-medium text-muted-foreground">Notes</p>
              <p className="text-base mt-1 text-muted-foreground">{habit.notes}</p>
            </div>
          )}

          <div>
            <p className="text-sm font-medium text-muted-foreground">Started</p>
            <p className="text-base mt-1">
              {new Date(habit.startDate).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Edit Form */}
      <HabitForm
        open={editFormOpen}
        onClose={() => setEditFormOpen(false)}
        onSubmit={handleEditHabit}
        habit={habit}
      />

      {/* Delete Confirmation */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Habit?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete "{habit.name}" and all its logs. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteHabit} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default HabitDetail;