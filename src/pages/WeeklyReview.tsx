import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useSubscription } from '@/contexts/SubscriptionContext';
import { 
  getHabitsRepository, 
  getMoodRepository 
} from '@/services/ServiceFactory';
import { localWeeklyReviewService } from '@/services/local/LocalWeeklyReviewService';
import { localCycleService } from '@/services/local/LocalCycleService';
import { WeeklyReviewData, Habit, HabitLog, MoodLog, CycleSettings } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { 
  ChevronLeft, 
  ChevronRight, 
  Download, 
  Copy, 
  Check,
  TrendingUp,
  Target,
  Smile,
  Lightbulb,
  Sparkles,
  Lock,
  Moon
} from 'lucide-react';
import { toast } from 'sonner';
import { 
  getWeekStart, 
  formatWeekRange, 
  getPreviousWeek, 
  getNextWeek, 
  isCurrentWeek,
  isFutureWeek 
} from '@/utils/weekUtils';
import { generateWeeklyReview, generateTextSummary } from '@/utils/weeklyReviewGenerator';
import PaywallModal from '@/components/paywall/PaywallModal';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer } from 'recharts';

const PRESET_INTENTIONS = [
  'Keep habits small',
  'Protect mornings',
  'Earlier sleep',
  'Movement',
];

const WeeklyReview = () => {
  const { user } = useAuth();
  const { entitlements } = useSubscription();
  const habitsRepo = getHabitsRepository();
  const moodRepo = getMoodRepository();

  const [loading, setLoading] = useState(true);
  const [currentWeekStart, setCurrentWeekStart] = useState(getWeekStart(new Date()));
  const [reviewData, setReviewData] = useState<WeeklyReviewData | null>(null);
  const [paywallOpen, setPaywallOpen] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [copied, setCopied] = useState(false);

  // Next week intentions state
  const [showIntentionsForm, setShowIntentionsForm] = useState(false);
  const [selectedIntentions, setSelectedIntentions] = useState<string[]>([]);
  const [customIntention, setCustomIntention] = useState('');
  const [savedIntentions, setSavedIntentions] = useState<string[]>([]);

  const hasAccess = entitlements?.weeklyReview || false;

  useEffect(() => {
    loadWeeklyReview();
  }, [user, currentWeekStart]);

  const loadWeeklyReview = async () => {
    if (!user) return;

    setLoading(true);

    try {
      // Load all data needed for the week
      const weekEnd = new Date(currentWeekStart);
      weekEnd.setDate(weekEnd.getDate() + 6);
      weekEnd.setHours(23, 59, 59, 999);

      const [habits, allMoodLogs, cycleSettings] = await Promise.all([
        habitsRepo.getHabits(user.id),
        moodRepo.getMoodLogs(user.id, currentWeekStart, weekEnd),
        localCycleService.getSettings(user.id),
      ]);

      // Load habit logs for all habits
      const allHabitLogs: HabitLog[] = [];
      for (const habit of habits) {
        const logs = await habitsRepo.getHabitLogs(habit.id, currentWeekStart, weekEnd);
        allHabitLogs.push(...logs);
      }

      // Generate review data with cycle settings
      const review = await generateWeeklyReview(
        currentWeekStart,
        habits,
        allHabitLogs,
        allMoodLogs,
        cycleSettings
      );

      // Load saved intentions for next week
      const nextWeekStart = getNextWeek(currentWeekStart);
      const intentions = await localWeeklyReviewService.getIntentionsForWeek(user.id, nextWeekStart);
      
      if (intentions) {
        review.nextWeekIntentions = intentions.intentions;
        setSavedIntentions(intentions.intentions);
      } else {
        setSavedIntentions([]);
      }

      setReviewData(review);
    } catch (error) {
      console.error('Error loading weekly review:', error);
      toast.error('Failed to load weekly review');
    } finally {
      setLoading(false);
    }
  };

  const handlePreviousWeek = () => {
    setCurrentWeekStart(getPreviousWeek(currentWeekStart));
  };

  const handleNextWeek = () => {
    const nextWeek = getNextWeek(currentWeekStart);
    if (!isFutureWeek(nextWeek)) {
      setCurrentWeekStart(nextWeek);
    }
  };

  const handleToggleIntention = (intention: string) => {
    if (selectedIntentions.includes(intention)) {
      setSelectedIntentions(selectedIntentions.filter(i => i !== intention));
    } else if (selectedIntentions.length < 3) {
      setSelectedIntentions([...selectedIntentions, intention]);
    } else {
      toast.error('Maximum 3 intentions allowed');
    }
  };

  const handleSaveIntentions = async () => {
    if (!user) return;

    const allIntentions = [...selectedIntentions];
    if (customIntention.trim() && allIntentions.length < 3) {
      allIntentions.push(customIntention.trim());
    }

    if (allIntentions.length === 0) {
      toast.error('Please select at least one intention');
      return;
    }

    try {
      const nextWeekStart = getNextWeek(currentWeekStart);
      await localWeeklyReviewService.saveIntentions(user.id, nextWeekStart, allIntentions);
      
      setSavedIntentions(allIntentions);
      setShowIntentionsForm(false);
      setSelectedIntentions([]);
      setCustomIntention('');
      
      toast.success('Next week intentions saved');
      
      // Reload to update review data
      await loadWeeklyReview();
    } catch (error) {
      console.error('Error saving intentions:', error);
      toast.error('Failed to save intentions');
    }
  };

  const handleCopySummary = () => {
    if (!reviewData) return;

    const summary = generateTextSummary(reviewData);
    navigator.clipboard.writeText(summary);
    
    setCopied(true);
    toast.success('Summary copied to clipboard');
    
    setTimeout(() => setCopied(false), 2000);
  };

  const handleExportPDF = async () => {
    if (!reviewData) return;

    setExporting(true);

    try {
      const element = document.getElementById('weekly-review-content');
      if (!element) {
        throw new Error('Review content not found');
      }

      const canvas = await html2canvas(element, {
        scale: 2,
        backgroundColor: '#ffffff',
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      
      const imgWidth = 210; // A4 width in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      
      pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
      
      const weekRange = formatWeekRange(currentWeekStart).replace(/\s/g, '-');
      pdf.save(`roya-weekly-review-${weekRange}.pdf`);
      
      toast.success('PDF exported successfully');
    } catch (error) {
      console.error('Error exporting PDF:', error);
      toast.error('Failed to export PDF');
    } finally {
      setExporting(false);
    }
  };

  if (!hasAccess) {
    return (
      <div className="space-y-6 pb-8">
        <div>
          <h1 className="text-3xl font-bold">Weekly Review</h1>
          <p className="text-muted-foreground mt-1">Track your progress week by week</p>
        </div>

        <Card className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-primary/10 backdrop-blur-sm z-10 flex items-center justify-center">
            <div className="text-center space-y-4 p-6">
              <Lock className="h-12 w-12 mx-auto text-primary" />
              <div>
                <h3 className="text-xl font-semibold mb-2">Weekly Review is a Pro Feature</h3>
                <p className="text-muted-foreground mb-4">
                  Get weekly summaries, insights, and planning tools
                </p>
                <Button onClick={() => setPaywallOpen(true)}>
                  Unlock Pro
                </Button>
              </div>
            </div>
          </div>
          
          <CardContent className="py-12 blur-sm">
            <div className="space-y-6">
              <div className="h-24 bg-muted rounded" />
              <div className="h-32 bg-muted rounded" />
              <div className="h-40 bg-muted rounded" />
            </div>
          </CardContent>
        </Card>

        <PaywallModal
          open={paywallOpen}
          onClose={() => setPaywallOpen(false)}
          trigger="general"
        />
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="animate-pulse text-muted-foreground">Loading...</div>
      </div>
    );
  }

  if (!reviewData) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <p className="text-muted-foreground">No data available for this week</p>
      </div>
    );
  }

  const chartData = reviewData.moodSummary.dailyScores.map(d => ({
    day: d.date.toLocaleDateString('en-US', { weekday: 'short' }),
    score: d.score,
  }));

  return (
    <div className="space-y-6 pb-8">
      {/* Header with week navigation */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Weekly Review</h1>
          <p className="text-muted-foreground mt-1">
            {formatWeekRange(currentWeekStart)}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={handlePreviousWeek}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={handleNextWeek}
            disabled={isFutureWeek(getNextWeek(currentWeekStart))}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Export buttons */}
      <div className="flex gap-2">
        <Button
          variant="outline"
          onClick={handleCopySummary}
          disabled={copied}
        >
          {copied ? <Check className="h-4 w-4 mr-2" /> : <Copy className="h-4 w-4 mr-2" />}
          {copied ? 'Copied!' : 'Copy Summary'}
        </Button>
        <Button
          variant="outline"
          onClick={handleExportPDF}
          disabled={exporting}
        >
          <Download className="h-4 w-4 mr-2" />
          {exporting ? 'Exporting...' : 'Export PDF'}
        </Button>
      </div>

      {/* Review content */}
      <div id="weekly-review-content" className="space-y-6 bg-background p-6 rounded-lg">
        {/* Cycle Lens Phase Context */}
        {reviewData.cyclePhases && reviewData.cyclePhases.length > 0 && (
          <Card className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/10 dark:to-pink-900/10 border-purple-200 dark:border-purple-800">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Moon className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                Cycle Lens
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <p className="text-sm">
                <span className="font-medium">This week was mostly:</span>{' '}
                {reviewData.cyclePhases.join(', ')}
              </p>
              <p className="text-xs text-muted-foreground">
                Your energy may vary across phases — plan gently.
              </p>
            </CardContent>
          </Card>
        )}

        {/* Check-in Consistency */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Check-in Consistency
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-2xl font-bold">
                {reviewData.checkInConsistency.daysCompleted}/{reviewData.checkInConsistency.totalDays} days
              </span>
              <Badge variant="secondary" className="text-lg">
                {reviewData.checkInConsistency.percentage}%
              </Badge>
            </div>
            <Progress value={reviewData.checkInConsistency.percentage} className="h-2" />
            <p className="text-sm text-muted-foreground">
              Days with habits logged and mood tracked
            </p>
          </CardContent>
        </Card>

        {/* Habit Performance */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Target className="h-5 w-5" />
              Habit Performance
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {reviewData.habitPerformance.topWinHabits.length > 0 && (
              <div>
                <p className="text-sm font-medium mb-3">Top WIN Habits</p>
                <div className="space-y-2">
                  {reviewData.habitPerformance.topWinHabits.map((habit, index) => (
                    <div key={habit.habitId} className="flex items-center justify-between p-3 rounded-lg border">
                      <div className="flex items-center gap-3">
                        <Badge variant="outline">{index + 1}</Badge>
                        <span className="font-medium">{habit.habitName}</span>
                      </div>
                      <Badge variant="secondary">{habit.completionRate}%</Badge>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {reviewData.habitPerformance.quitHabits.totalCleanDays > 0 && (
              <div className="p-3 rounded-lg bg-green-500/10 border border-green-500/20">
                <p className="text-sm font-medium text-green-700 dark:text-green-400">
                  QUIT Habits: {reviewData.habitPerformance.quitHabits.totalCleanDays} clean days
                </p>
              </div>
            )}

            {reviewData.habitPerformance.bestStreakContinued && (
              <div className="p-3 rounded-lg bg-primary/10 border border-primary/20">
                <div className="flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-primary" />
                  <p className="text-sm font-medium">
                    Best streak: {reviewData.habitPerformance.bestStreakContinued.habitName} ({reviewData.habitPerformance.bestStreakContinued.streak} days)
                  </p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Mood Summary */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Smile className="h-5 w-5" />
              Mood Summary
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Average mood</span>
              <span className="text-2xl font-bold">{reviewData.moodSummary.averageScore}/5</span>
            </div>

            {/* Mood sparkline */}
            {chartData.some(d => d.score > 0) && (
              <div className="h-[100px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData}>
                    <XAxis 
                      dataKey="day" 
                      stroke="hsl(var(--muted-foreground))"
                      fontSize={12}
                    />
                    <YAxis 
                      domain={[1, 5]} 
                      ticks={[1, 2, 3, 4, 5]}
                      stroke="hsl(var(--muted-foreground))"
                      fontSize={12}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="score" 
                      stroke="hsl(var(--primary))" 
                      strokeWidth={2}
                      dot={{ fill: 'hsl(var(--primary))', r: 3 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            )}

            {reviewData.moodSummary.topTags.length > 0 && (
              <div>
                <p className="text-sm font-medium mb-2">Most common tags</p>
                <div className="flex flex-wrap gap-2">
                  {reviewData.moodSummary.topTags.map(({ tag, count }) => (
                    <Badge key={tag} variant="secondary">
                      {tag} ({count})
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Insights */}
        {reviewData.insights.length > 0 && (
          <Card className="bg-primary/5 border-primary/10">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Lightbulb className="h-5 w-5" />
                Insights
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {reviewData.insights.map((insight, index) => (
                <p key={index} className="text-sm">
                  • {insight}
                </p>
              ))}
              <p className="text-xs text-muted-foreground mt-4">
                Insights are informational and show associations, not causation.
              </p>
            </CardContent>
          </Card>
        )}

        {/* Next Week Focus */}
        {isCurrentWeek(currentWeekStart) && (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Next Week Focus</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {savedIntentions.length > 0 ? (
                <div className="space-y-3">
                  <div className="space-y-2">
                    {savedIntentions.map((intention, index) => (
                      <div key={index} className="flex items-center gap-2 p-3 rounded-lg border">
                        <Check className="h-4 w-4 text-primary" />
                        <span>{intention}</span>
                      </div>
                    ))}
                  </div>
                  <Button
                    variant="outline"
                    onClick={() => setShowIntentionsForm(true)}
                    className="w-full"
                  >
                    Update Intentions
                  </Button>
                </div>
              ) : showIntentionsForm ? (
                <div className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    Choose 1-3 focus intentions for next week
                  </p>
                  <div className="space-y-2">
                    {PRESET_INTENTIONS.map((intention) => (
                      <div key={intention} className="flex items-center space-x-2">
                        <Checkbox
                          id={intention}
                          checked={selectedIntentions.includes(intention)}
                          onCheckedChange={() => handleToggleIntention(intention)}
                        />
                        <Label htmlFor={intention} className="cursor-pointer">
                          {intention}
                        </Label>
                      </div>
                    ))}
                  </div>
                  <div>
                    <Label htmlFor="custom-intention">Custom intention (optional)</Label>
                    <Textarea
                      id="custom-intention"
                      placeholder="Add your own focus..."
                      value={customIntention}
                      onChange={(e) => setCustomIntention(e.target.value)}
                      className="mt-2"
                      rows={2}
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button onClick={handleSaveIntentions} className="flex-1">
                      Save Intentions
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => {
                        setShowIntentionsForm(false);
                        setSelectedIntentions([]);
                        setCustomIntention('');
                      }}
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              ) : (
                <Button onClick={() => setShowIntentionsForm(true)} className="w-full">
                  Set Next Week Focus
                </Button>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default WeeklyReview;