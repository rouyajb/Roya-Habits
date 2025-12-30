import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useSubscription } from '@/contexts/SubscriptionContext';
import { localCycleService } from '@/services/local/LocalCycleService';
import { CycleSettings, CyclePrediction, PhaseInfo, CyclePhase } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  ChevronLeft, 
  ChevronRight, 
  Settings as SettingsIcon,
  Info,
  Calendar as CalendarIcon
} from 'lucide-react';
import { toast } from 'sonner';
import {
  calculateCycleDay,
  calculatePhase,
  calculatePredictions,
  getPhaseInfo,
  getPhaseColor,
  getPhaseName,
} from '@/utils/cycleCalculations';
import CycleSettingsModal from '@/components/cycle/CycleSettingsModal';
import CycleDayModal from '@/components/cycle/CycleDayModal';

const CycleLens = () => {
  const { user } = useAuth();
  const { entitlements } = useSubscription();

  const [settings, setSettings] = useState<CycleSettings | null>(null);
  const [predictions, setPredictions] = useState<CyclePrediction | null>(null);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedPhaseInfo, setSelectedPhaseInfo] = useState<PhaseInfo | null>(null);
  const [settingsModalOpen, setSettingsModalOpen] = useState(false);
  const [dayModalOpen, setDayModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSettings();
  }, [user]);

  const loadSettings = async () => {
    if (!user) return;

    setLoading(true);
    try {
      const cycleSettings = await localCycleService.getSettings(user.id);
      setSettings(cycleSettings);

      if (cycleSettings && cycleSettings.enabled) {
        const preds = calculatePredictions(
          cycleSettings.lastPeriodStart,
          cycleSettings.averageCycleLength,
          cycleSettings.averagePeriodLength
        );
        setPredictions(preds);
      }
    } catch (error) {
      console.error('Error loading cycle settings:', error);
      toast.error('Failed to load cycle settings');
    } finally {
      setLoading(false);
    }
  };

  const handleSettingsSaved = async () => {
    await loadSettings();
    setSettingsModalOpen(false);
    toast.success('Cycle settings saved');
  };

  const handlePreviousMonth = () => {
    const prev = new Date(currentMonth);
    prev.setMonth(prev.getMonth() - 1);
    setCurrentMonth(prev);
  };

  const handleNextMonth = () => {
    const next = new Date(currentMonth);
    next.setMonth(next.getMonth() + 1);
    setCurrentMonth(next);
  };

  const handleDateClick = (date: Date) => {
    if (!settings || !settings.enabled) return;

    setSelectedDate(date);
    
    const cycleDay = calculateCycleDay(date, settings.lastPeriodStart);
    const phase = calculatePhase(cycleDay, settings.averageCycleLength, settings.averagePeriodLength);
    const phaseInfo = getPhaseInfo(phase, cycleDay);
    
    setSelectedPhaseInfo(phaseInfo);
    setDayModalOpen(true);
  };

  const renderCalendar = () => {
    if (!settings || !settings.enabled) return null;

    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();

    // Get first day of month and last day of month
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);

    // Get day of week for first day (0 = Sunday)
    const firstDayOfWeek = firstDay.getDay();

    // Calculate days to show
    const daysInMonth = lastDay.getDate();
    const totalCells = Math.ceil((daysInMonth + firstDayOfWeek) / 7) * 7;

    const days: (Date | null)[] = [];

    // Add empty cells for days before month starts
    for (let i = 0; i < firstDayOfWeek; i++) {
      days.push(null);
    }

    // Add days of month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day));
    }

    // Add empty cells to complete the grid
    while (days.length < totalCells) {
      days.push(null);
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return (
      <div className="grid grid-cols-7 gap-2">
        {/* Day headers */}
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
          <div key={day} className="text-center text-sm font-medium text-muted-foreground py-2">
            {day}
          </div>
        ))}

        {/* Calendar days */}
        {days.map((date, index) => {
          if (!date) {
            return <div key={`empty-${index}`} className="aspect-square" />;
          }

          const cycleDay = calculateCycleDay(date, settings.lastPeriodStart);
          const phase = calculatePhase(cycleDay, settings.averageCycleLength, settings.averagePeriodLength);
          const phaseColor = getPhaseColor(phase);
          const isToday = date.getTime() === today.getTime();

          return (
            <button
              key={date.toISOString()}
              onClick={() => handleDateClick(date)}
              className={`aspect-square rounded-lg border-2 p-2 text-sm transition-all hover:scale-105 ${phaseColor} ${
                isToday ? 'ring-2 ring-primary ring-offset-2' : ''
              }`}
            >
              <div className="font-medium">{date.getDate()}</div>
            </button>
          );
        })}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="animate-pulse text-muted-foreground">Loading...</div>
      </div>
    );
  }

  if (!settings || !settings.enabled) {
    return (
      <div className="space-y-6 pb-8">
        <div>
          <h1 className="text-3xl font-bold">Cycle Lens</h1>
          <p className="text-muted-foreground mt-1">
            Optional phase insights for habits and planning
          </p>
        </div>

        <Card>
          <CardContent className="py-8 text-center space-y-4">
            <CalendarIcon className="h-12 w-12 mx-auto text-muted-foreground" />
            <div>
              <h3 className="text-lg font-semibold mb-2">Cycle Lens is not enabled</h3>
              <p className="text-muted-foreground mb-4">
                Enable Cycle Lens to see phase-based insights for your habits and weekly review.
              </p>
              <Button onClick={() => setSettingsModalOpen(true)}>
                Enable Cycle Lens
              </Button>
            </div>
          </CardContent>
        </Card>

        <Alert>
          <Info className="h-4 w-4" />
          <AlertDescription>
            <strong>Informational only, not medical advice.</strong> Cycle Lens provides general phase insights to help you plan gently. Consult a healthcare provider for medical concerns.
          </AlertDescription>
        </Alert>

        <CycleSettingsModal
          open={settingsModalOpen}
          onClose={() => setSettingsModalOpen(false)}
          onSave={handleSettingsSaved}
          existingSettings={settings}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Cycle Lens</h1>
          <p className="text-muted-foreground mt-1">
            Phase insights for habits and planning
          </p>
        </div>
        <Button variant="outline" size="icon" onClick={() => setSettingsModalOpen(true)}>
          <SettingsIcon className="h-4 w-4" />
        </Button>
      </div>

      {/* Current Phase Card */}
      {predictions && (
        <Card className={getPhaseColor(predictions.currentPhase)}>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              Current Phase: {getPhaseName(predictions.currentPhase)}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              {getPhaseInfo(predictions.currentPhase, calculateCycleDay(new Date(), settings.lastPeriodStart)).description}
            </p>
          </CardContent>
        </Card>
      )}

      {/* Predictions */}
      {predictions && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Predictions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Next period</span>
              <Badge variant="secondary">
                {predictions.nextPeriodStart.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Ovulation window</span>
              <Badge variant="secondary">
                {predictions.nextOvulationStart.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - {predictions.nextOvulationEnd.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
              </Badge>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Calendar */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">
              {currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
            </CardTitle>
            <div className="flex gap-2">
              <Button variant="outline" size="icon" onClick={handlePreviousMonth}>
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon" onClick={handleNextMonth}>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {renderCalendar()}
        </CardContent>
      </Card>

      {/* Phase Legend */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Phase Colors</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-3">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded bg-red-100 dark:bg-red-900/20 border-2 border-red-200 dark:border-red-800" />
              <span className="text-sm">Menstrual</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded bg-green-100 dark:bg-green-900/20 border-2 border-green-200 dark:border-green-800" />
              <span className="text-sm">Follicular</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded bg-purple-100 dark:bg-purple-900/20 border-2 border-purple-200 dark:border-purple-800" />
              <span className="text-sm">Ovulation</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded bg-blue-100 dark:bg-blue-900/20 border-2 border-blue-200 dark:border-blue-800" />
              <span className="text-sm">Luteal</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Disclaimer */}
      <Alert>
        <Info className="h-4 w-4" />
        <AlertDescription>
          <strong>Informational only, not medical advice.</strong> Cycle Lens provides general phase insights. Consult a healthcare provider for medical concerns.
        </AlertDescription>
      </Alert>

      {/* Modals */}
      <CycleSettingsModal
        open={settingsModalOpen}
        onClose={() => setSettingsModalOpen(false)}
        onSave={handleSettingsSaved}
        existingSettings={settings}
      />

      {selectedDate && selectedPhaseInfo && (
        <CycleDayModal
          open={dayModalOpen}
          onClose={() => setDayModalOpen(false)}
          date={selectedDate}
          phaseInfo={selectedPhaseInfo}
          settings={settings}
          hasAdvancedAccess={entitlements?.cycleLensAdvanced || false}
        />
      )}
    </div>
  );
};

export default CycleLens;