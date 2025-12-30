import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { getHabitsRepository, getMoodRepository, getJournalRepository } from '@/services/ServiceFactory';
import { localWeeklyReviewService } from '@/services/local/LocalWeeklyReviewService';
import { localCycleService } from '@/services/local/LocalCycleService';
import { Habit, HabitLog, HabitStatus, MoodEmoji, MoodLog, JournalEntry as JournalEntryType, CycleSettings, PhaseInfo } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import HabitChecklist from '@/components/today/HabitChecklist';
import MoodLogger from '@/components/today/MoodLogger';
import JournalEntry from '@/components/today/JournalEntry';
import { toast } from 'sonner';
import { Sparkles, Edit3, Target, Moon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import confetti from 'canvas-confetti';
import { getMilestoneCopy, getRandomRelapseCopy } from '@/utils/milestoneCopy';
import { getWeekStart } from '@/utils/weekUtils';
import { calculateCycleDay, calculatePhase, getPhaseInfo, getPhaseName } from '@/utils/cycleCalculations';

const JOURNAL_PROMPTS = [
  'What are you grateful for today?',
  'What challenged you today, and how did you respond?',
  'What would make tomorrow even better?',
  'What did you learn about yourself today?',
  'What small win can you celebrate today?',
  'How did you show up for yourself today?',
  'What pattern are you noticing in your life right now?',
];

const Today = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const habitsRepo = getHabitsRepository();
  const moodRepo = getMoodRepository();
  const journalRepo = getJournalRepository();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [habitsWithLogs, setHabitsWithLogs] = useState<Array<{ habit: Habit; log: HabitLog | null }>>([]);
  
  // Mood state
  const [moodEmoji, setMoodEmoji] = useState<MoodEmoji | null>(null);
  const [moodScore, setMoodScore] = useState(3);
  const [moodTags, setMoodTags] = useState<string[]>([]);
  const [existingMoodLog, setExistingMoodLog] = useState<MoodLog | null>(null);

  // Journal state
  const [journalContent, setJournalContent] = useState('');
  const [journalPrompt, setJournalPrompt] = useState('');
  const [existingJournalEntry, setExistingJournalEntry] = useState<JournalEntryType | null>(null);

  const [isComplete, setIsComplete] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);

  // Weekly intentions state
  const [weeklyIntentions, setWeeklyIntentions] = useState<string[]>([]);

  // Cycle Lens state
  const [cycleSettings, setCycleSettings] = useState<CycleSettings | null>(null);
  const [currentPhaseInfo, setCurrentPhaseInfo] = useState<PhaseInfo | null>(null);

  // Track initial state for change detection
  const [initialState, setInitialState] = useState<{
    moodEmoji: MoodEmoji | null;
    moodScore: number;
    moodTags: string[];
    journalContent: string;
    habitLogs: Record<string, HabitStatus | null>;
  } | null>(null);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  const getDailyPrompt = () => {
    const dayOfYear = Math.floor((today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / 86400000);
    const promptIndex = dayOfYear % JOURNAL_PROMPTS.length;
    return JOURNAL_PROMPTS[promptIndex];
  };

  const loadTodayData = async () => {
    if (!user) return;

    try {
      // Load habits with today's logs
      const data = await habitsRepo.getHabitsWithLogsForDate(user.id, today);
      setHabitsWithLogs(data);

      // Load mood log
      const mood = await moodRepo.getMoodLogForDate(user.id, today);
      if (mood) {
        setMoodEmoji(mood.emoji);
        setMoodScore(mood.score);
        setMoodTags(mood.tags);
        setExistingMoodLog(mood);
      }

      // Load journal entry
      const journal = await journalRepo.getEntryForDate(user.id, today);
      if (journal) {
        setJournalContent(journal.content);
        setJournalPrompt(journal.promptText || getDailyPrompt());
        setExistingJournalEntry(journal);
      } else {
        setJournalPrompt(getDailyPrompt());
      }

      // Load weekly intentions for current week
      const currentWeekStart = getWeekStart(today);
      const intentions = await localWeeklyReviewService.getIntentionsForWeek(user.id, currentWeekStart);
      if (intentions) {
        setWeeklyIntentions(intentions.intentions);
      }

      // Load Cycle Lens data
      const settings = await localCycleService.getSettings(user.id);
      setCycleSettings(settings);
      
      if (settings && settings.enabled) {
        const cycleDay = calculateCycleDay(today, settings.lastPeriodStart);
        const phase = calculatePhase(cycleDay, settings.averageCycleLength, settings.averagePeriodLength);
        const phaseInfo = getPhaseInfo(phase, cycleDay);
        setCurrentPhaseInfo(phaseInfo);
      }

      // Check if complete
      const complete = checkCompletion(data, mood);
      setIsComplete(complete);
      setIsEditMode(!complete); // Start in edit mode if not complete

      // Store initial state
      const habitLogsState: Record<string, HabitStatus | null> = {};
      data.forEach(({ habit, log }) => {
        habitLogsState[habit.id] = log?.status || null;
      });

      setInitialState({
        moodEmoji: mood?.emoji || null,
        moodScore: mood?.score || 3,
        moodTags: mood?.tags || [],
        journalContent: journal?.content || '',
        habitLogs: habitLogsState,
      });
    } catch (error) {
      console.error('Error loading today data:', error);
      toast.error('Failed to load today\'s data');
    } finally {
      setLoading(false);
    }
  };

  const checkCompletion = (
    habits: Array<{ habit: Habit; log: HabitLog | null }>,
    mood: MoodLog | null
  ) => {
    const allHabitsLogged = habits.every(h => h.log !== null);
    const moodLogged = mood !== null;
    return allHabitsLogged && moodLogged;
  };

  useEffect(() => {
    loadTodayData();
  }, [user]);

  const hasChanges = (): boolean => {
    if (!initialState) return true;

    // Check mood changes
    if (moodEmoji !== initialState.moodEmoji) return true;
    if (moodScore !== initialState.moodScore) return true;
    if (JSON.stringify(moodTags.sort()) !== JSON.stringify(initialState.moodTags.sort())) return true;

    // Check journal changes
    if (journalContent.trim() !== initialState.journalContent.trim()) return true;

    // Check habit log changes
    const currentHabitLogs: Record<string, HabitStatus | null> = {};
    habitsWithLogs.forEach(({ habit, log }) => {
      currentHabitLogs[habit.id] = log?.status || null;
    });

    for (const habitId in currentHabitLogs) {
      if (currentHabitLogs[habitId] !== initialState.habitLogs[habitId]) {
        return true;
      }
    }

    return false;
  };

  const handleHabitToggle = async (habitId: string, status: HabitStatus) => {
    if (!user) return;

    try {
      await habitsRepo.logHabit({
        habitId,
        userId: user.id,
        date: today,
        status,
      });

      // Reload data
      await loadTodayData();

      // Check for milestone
      const habit = habitsWithLogs.find(h => h.habit.id === habitId)?.habit;
      if (habit && (status === 'done' || status === 'clean')) {
        const stats = await habitsRepo.getHabitStats(habitId);
        const milestones = [7, 14, 30, 60, 100];
        
        if (milestones.includes(stats.currentStreak)) {
          // Check if milestone already achieved
          const alreadyAchieved = await habitsRepo.hasMilestone(habitId, stats.currentStreak);
          
          if (!alreadyAchieved) {
            // Save milestone
            await habitsRepo.saveMilestone({
              habitId,
              days: stats.currentStreak,
              type: habit.type,
            });

            // Get milestone copy
            const milestoneCopy = getMilestoneCopy(stats.currentStreak, habit.type);
            
            if (milestoneCopy) {
              confetti({
                particleCount: 100,
                spread: 70,
                origin: { y: 0.6 }
              });
              
              toast.success(milestoneCopy.toast, {
                duration: 5000,
                description: milestoneCopy.card,
              });
            }
          }
        }
      }

      if (status === 'relapse') {
        const relapseCopy = getRandomRelapseCopy();
        toast.info(relapseCopy);
      }
    } catch (error) {
      console.error('Error logging habit:', error);
      toast.error('Failed to log habit');
    }
  };

  const handleSaveCheckIn = async () => {
    if (!user) return;

    if (!moodEmoji) {
      toast.error('Please select your mood');
      return;
    }

    // Check if there are any changes
    if (!hasChanges()) {
      toast.info('No changes to update');
      return;
    }

    setSaving(true);

    try {
      // Save mood log
      if (existingMoodLog) {
        await moodRepo.updateMoodLog(existingMoodLog.id, {
          emoji: moodEmoji,
          score: moodScore,
          tags: moodTags,
        });
      } else {
        await moodRepo.createMoodLog({
          userId: user.id,
          date: today,
          emoji: moodEmoji,
          score: moodScore,
          tags: moodTags,
        });
      }

      // Save or delete journal entry
      if (journalContent.trim()) {
        if (existingJournalEntry) {
          await journalRepo.updateEntry(existingJournalEntry.id, {
            content: journalContent.trim(),
            promptText: journalPrompt,
          });
        } else {
          await journalRepo.createEntry({
            userId: user.id,
            date: today,
            content: journalContent.trim(),
            promptText: journalPrompt,
            privacyMode: false,
          });
        }
      } else if (existingJournalEntry) {
        // Delete journal if content is empty
        await journalRepo.deleteEntry(existingJournalEntry.id);
      }

      // Reload data
      await loadTodayData();

      // Switch to view mode
      setIsEditMode(false);

      // Show success (no confetti for updates)
      toast.success('Check-in saved');
    } catch (error) {
      console.error('Error saving check-in:', error);
      toast.error('Failed to save check-in');
    } finally {
      setSaving(false);
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
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">
          {getGreeting()}, {user?.displayName || 'there'}
        </h1>
        <p className="text-muted-foreground mt-1">
          {today.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
        </p>
      </div>

      {/* Cycle Lens Phase Card */}
      {cycleSettings && cycleSettings.enabled && currentPhaseInfo && (
        <Card className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/10 dark:to-pink-900/10 border-purple-200 dark:border-purple-800">
          <CardContent className="py-4">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <Moon className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                  <p className="text-sm font-semibold text-purple-900 dark:text-purple-200">
                    Cycle Lens: {getPhaseName(currentPhaseInfo.phase)}
                  </p>
                </div>
                <p className="text-xs text-muted-foreground">
                  {currentPhaseInfo.suggestions[0]}
                </p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('/app/cycle')}
                className="text-xs"
              >
                View Calendar
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Weekly Intentions Card */}
      {weeklyIntentions.length > 0 && (
        <Card className="bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
          <CardContent className="py-4">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-3">
                  <Target className="h-5 w-5 text-primary" />
                  <p className="font-semibold">This Week's Focus</p>
                </div>
                <div className="space-y-2">
                  {weeklyIntentions.map((intention, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20">
                        {index + 1}
                      </Badge>
                      <span className="text-sm">{intention}</span>
                    </div>
                  ))}
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('/app/review')}
                className="text-xs"
              >
                View Review
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Identity Reminders */}
      {habitsWithLogs.some(h => h.habit.identityStatement) && (
        <Card className="bg-primary/5 border-primary/20">
          <CardContent className="py-4">
            <p className="text-sm font-medium mb-2">Remember:</p>
            <div className="space-y-1">
              {habitsWithLogs
                .filter(h => h.habit.identityStatement)
                .map(({ habit }) => (
                  <p key={habit.id} className="text-sm text-muted-foreground italic">
                    • {habit.identityStatement}
                  </p>
                ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Completion Status */}
      {isComplete && !isEditMode && (
        <Card className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 border-green-500/20">
          <CardContent className="py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Sparkles className="h-6 w-6 text-green-500" />
                <div>
                  <p className="font-semibold text-green-700 dark:text-green-400">
                    Daily check-in complete
                  </p>
                  <p className="text-sm text-muted-foreground">
                    All habits and mood logged for today
                  </p>
                </div>
              </div>
              <Button variant="outline" size="sm" onClick={() => setIsEditMode(true)}>
                <Edit3 className="h-4 w-4 mr-2" />
                Edit
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Habits Checklist */}
      <HabitChecklist 
        habits={habitsWithLogs} 
        onToggle={handleHabitToggle}
        disabled={!isEditMode && isComplete}
      />

      {/* Mood Logger */}
      {(isEditMode || !isComplete) && (
        <MoodLogger
          emoji={moodEmoji}
          score={moodScore}
          tags={moodTags}
          onEmojiChange={setMoodEmoji}
          onScoreChange={setMoodScore}
          onTagsChange={setMoodTags}
        />
      )}

      {/* Mood Display (View Mode) */}
      {!isEditMode && isComplete && moodEmoji && (
        <Card>
          <CardContent className="py-4">
            <div className="flex items-center gap-4">
              <span className="text-4xl">{moodEmoji}</span>
              <div className="flex-1">
                <p className="font-medium">Mood: {moodScore}/5</p>
                {moodTags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {moodTags.map(tag => (
                      <span key={tag} className="text-xs px-2 py-1 bg-secondary rounded">
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Journal Entry */}
      {(isEditMode || !isComplete) && (
        <JournalEntry 
          content={journalContent} 
          onChange={setJournalContent}
          promptText={journalPrompt}
        />
      )}

      {/* Journal Display (View Mode) */}
      {!isEditMode && isComplete && journalContent && (
        <JournalEntry
          content={journalContent}
          onChange={() => {}}
          promptText={journalPrompt}
          viewMode={true}
        />
      )}

      {/* Save Button */}
      {(isEditMode || !isComplete) && (
        <div className="flex gap-3">
          <Button
            onClick={handleSaveCheckIn}
            disabled={!moodEmoji || saving}
            className="flex-1"
            size="lg"
          >
            {saving ? (
              'Saving...'
            ) : (
              <>
                <Sparkles className="h-4 w-4 mr-2" />
                {existingMoodLog ? 'Update Check-in' : 'Complete Check-in'}
              </>
            )}
          </Button>
        </div>
      )}
    </div>
  );
};

export default Today;