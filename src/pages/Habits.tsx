import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useSubscription } from '@/contexts/SubscriptionContext';
import { getHabitsRepository } from '@/services/ServiceFactory';
import { Habit, HabitType } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Flame, Target, Ban } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import HabitForm from '@/components/habits/HabitForm';
import { toast } from 'sonner';
import PaywallModal, { PaywallTrigger } from '@/components/paywall/PaywallModal';

const Habits = () => {
  const { user } = useAuth();
  const { entitlements } = useSubscription();
  const navigate = useNavigate();
  const habitsRepo = getHabitsRepository();

  const [habits, setHabits] = useState<Habit[]>([]);
  const [loading, setLoading] = useState(true);
  const [formOpen, setFormOpen] = useState(false);
  const [paywallOpen, setPaywallOpen] = useState(false);
  const [paywallTrigger, setPaywallTrigger] = useState<PaywallTrigger>('habit_limit');

  useEffect(() => {
    loadHabits();
  }, [user]);

  const loadHabits = async () => {
    if (!user) return;

    try {
      const data = await habitsRepo.getHabits(user.id);
      setHabits(data);
    } catch (error) {
      console.error('Error loading habits:', error);
      toast.error('Failed to load habits');
    } finally {
      setLoading(false);
    }
  };

  const handleAddHabit = () => {
    // Check FREE tier limit
    const maxHabits = entitlements?.maxHabits || 3;
    if (habits.length >= maxHabits) {
      setPaywallTrigger('habit_limit');
      setPaywallOpen(true);
      return;
    }

    setFormOpen(true);
  };

  const handleHabitCreated = async () => {
    setFormOpen(false);
    await loadHabits();
    toast.success('Habit created successfully');
  };

  const winHabits = habits.filter(h => h.type === 'WIN' && !h.archived);
  const quitHabits = habits.filter(h => h.type === 'QUIT' && !h.archived);

  const getHabitIcon = (type: HabitType) => {
    return type === 'WIN' ? <Target className="h-5 w-5" /> : <Ban className="h-5 w-5" />;
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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Habits</h1>
          <p className="text-muted-foreground mt-1">
            {habits.length} / {entitlements?.maxHabits === Infinity ? '∞' : entitlements?.maxHabits || 3} habits
          </p>
        </div>
        <Button onClick={handleAddHabit}>
          <Plus className="h-4 w-4 mr-2" />
          Add Habit
        </Button>
      </div>

      {habits.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground mb-4">No habits yet</p>
            <Button onClick={handleAddHabit}>
              <Plus className="h-4 w-4 mr-2" />
              Create your first habit
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          {/* WIN Habits */}
          {winHabits.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Target className="h-5 w-5 text-primary" />
                <h2 className="text-lg font-semibold">WIN Habits</h2>
                <span className="text-sm text-muted-foreground">({winHabits.length})</span>
              </div>
              <div className="grid gap-3">
                {winHabits.map(habit => (
                  <Card
                    key={habit.id}
                    className="cursor-pointer hover:shadow-md transition-shadow"
                    onClick={() => navigate(`/app/habits/${habit.id}`)}
                  >
                    <CardHeader className="pb-3">
                      <CardTitle className="text-base flex items-center gap-2">
                        {getHabitIcon(habit.type)}
                        {habit.name}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      {habit.identityStatement && (
                        <p className="text-sm text-muted-foreground italic mb-2">
                          {habit.identityStatement}
                        </p>
                      )}
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <span className="capitalize">{habit.frequency}</span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* QUIT Habits */}
          {quitHabits.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Ban className="h-5 w-5 text-primary" />
                <h2 className="text-lg font-semibold">QUIT Habits</h2>
                <span className="text-sm text-muted-foreground">({quitHabits.length})</span>
              </div>
              <div className="grid gap-3">
                {quitHabits.map(habit => (
                  <Card
                    key={habit.id}
                    className="cursor-pointer hover:shadow-md transition-shadow"
                    onClick={() => navigate(`/app/habits/${habit.id}`)}
                  >
                    <CardHeader className="pb-3">
                      <CardTitle className="text-base flex items-center gap-2">
                        {getHabitIcon(habit.type)}
                        {habit.name}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      {habit.identityStatement && (
                        <p className="text-sm text-muted-foreground italic mb-2">
                          {habit.identityStatement}
                        </p>
                      )}
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <span className="capitalize">{habit.frequency}</span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      <HabitForm
        open={formOpen}
        onClose={() => setFormOpen(false)}
        onSuccess={handleHabitCreated}
      />

      <PaywallModal
        open={paywallOpen}
        onClose={() => setPaywallOpen(false)}
        trigger={paywallTrigger}
      />
    </div>
  );
};

export default Habits;