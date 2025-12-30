import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { localCycleService } from '@/services/local/LocalCycleService';
import { CycleSettings, PhaseInfo, FlowLevel, CycleLog } from '@/types';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import { Lock, Lightbulb } from 'lucide-react';
import { toast } from 'sonner';
import { getPhaseName, getPhaseColor } from '@/utils/cycleCalculations';
import PaywallModal from '@/components/paywall/PaywallModal';

interface CycleDayModalProps {
  open: boolean;
  onClose: () => void;
  date: Date;
  phaseInfo: PhaseInfo;
  settings: CycleSettings;
  hasAdvancedAccess: boolean;
}

const FLOW_LEVELS: { value: FlowLevel; label: string }[] = [
  { value: 'none', label: 'None' },
  { value: 'light', label: 'Light' },
  { value: 'medium', label: 'Medium' },
  { value: 'heavy', label: 'Heavy' },
];

const SYMPTOMS = [
  'Cramps',
  'Headache',
  'Fatigue',
  'Bloating',
  'Mood changes',
  'Tender breasts',
  'Back pain',
  'Acne',
];

const CycleDayModal: React.FC<CycleDayModalProps> = ({
  open,
  onClose,
  date,
  phaseInfo,
  settings,
  hasAdvancedAccess,
}) => {
  const { user } = useAuth();
  const [existingLog, setExistingLog] = useState<CycleLog | null>(null);
  const [flowLevel, setFlowLevel] = useState<FlowLevel>('none');
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);
  const [notes, setNotes] = useState('');
  const [saving, setSaving] = useState(false);
  const [paywallOpen, setPaywallOpen] = useState(false);

  useEffect(() => {
    loadLog();
  }, [date, open]);

  const loadLog = async () => {
    if (!user) return;

    try {
      const log = await localCycleService.getLogForDate(user.id, date);
      if (log) {
        setExistingLog(log);
        setFlowLevel(log.flowLevel);
        setSelectedSymptoms(log.symptoms);
        setNotes(log.notes || '');
      } else {
        setExistingLog(null);
        setFlowLevel('none');
        setSelectedSymptoms([]);
        setNotes('');
      }
    } catch (error) {
      console.error('Error loading cycle log:', error);
    }
  };

  const handleSymptomToggle = (symptom: string) => {
    if (!hasAdvancedAccess) {
      setPaywallOpen(true);
      return;
    }

    if (selectedSymptoms.includes(symptom)) {
      setSelectedSymptoms(selectedSymptoms.filter(s => s !== symptom));
    } else {
      setSelectedSymptoms([...selectedSymptoms, symptom]);
    }
  };

  const handleSaveLog = async () => {
    if (!user) return;

    if (!hasAdvancedAccess) {
      setPaywallOpen(true);
      return;
    }

    setSaving(true);

    try {
      if (existingLog) {
        await localCycleService.updateLog(existingLog.id, {
          flowLevel,
          symptoms: selectedSymptoms,
          notes: notes.trim() || undefined,
        });
        toast.success('Cycle log updated');
      } else {
        await localCycleService.createLog({
          userId: user.id,
          date,
          flowLevel,
          symptoms: selectedSymptoms,
          notes: notes.trim() || undefined,
        });
        toast.success('Cycle log saved');
      }

      onClose();
    } catch (error) {
      console.error('Error saving cycle log:', error);
      toast.error('Failed to save log');
    } finally {
      setSaving(false);
    }
  };

  const phaseColor = getPhaseColor(phaseInfo.phase);

  return (
    <>
      <Dialog open={open} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>
              {date.toLocaleDateString('en-US', { 
                weekday: 'long', 
                month: 'long', 
                day: 'numeric' 
              })}
            </DialogTitle>
            <DialogDescription>
              Cycle day {phaseInfo.dayInPhase}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 py-4">
            {/* Phase Info */}
            <div className={`p-4 rounded-lg border-2 ${phaseColor}`}>
              <div className="flex items-center gap-2 mb-2">
                <Badge variant="secondary">{getPhaseName(phaseInfo.phase)}</Badge>
              </div>
              <p className="text-sm text-muted-foreground mb-3">
                {phaseInfo.description}
              </p>
              <div className="space-y-1">
                <p className="text-xs font-medium flex items-center gap-2">
                  <Lightbulb className="h-3 w-3" />
                  Suggestions:
                </p>
                {phaseInfo.suggestions.map((suggestion, index) => (
                  <p key={index} className="text-xs text-muted-foreground">
                    • {suggestion}
                  </p>
                ))}
              </div>
            </div>

            {/* Logging Section */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-semibold">Daily Log</h4>
                {!hasAdvancedAccess && (
                  <Badge variant="outline" className="gap-1">
                    <Lock className="h-3 w-3" />
                    Pro
                  </Badge>
                )}
              </div>

              {/* Flow Level */}
              <div className="space-y-2">
                <Label>Flow Level</Label>
                <div className="grid grid-cols-4 gap-2">
                  {FLOW_LEVELS.map(({ value, label }) => (
                    <Button
                      key={value}
                      variant={flowLevel === value ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => {
                        if (!hasAdvancedAccess) {
                          setPaywallOpen(true);
                        } else {
                          setFlowLevel(value);
                        }
                      }}
                      className="text-xs"
                    >
                      {label}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Symptoms */}
              <div className="space-y-2">
                <Label>Symptoms</Label>
                <div className="grid grid-cols-2 gap-2">
                  {SYMPTOMS.map((symptom) => (
                    <div key={symptom} className="flex items-center space-x-2">
                      <Checkbox
                        id={symptom}
                        checked={selectedSymptoms.includes(symptom)}
                        onCheckedChange={() => handleSymptomToggle(symptom)}
                        disabled={!hasAdvancedAccess}
                      />
                      <Label
                        htmlFor={symptom}
                        className={`text-sm cursor-pointer ${
                          !hasAdvancedAccess ? 'opacity-50' : ''
                        }`}
                      >
                        {symptom}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Notes */}
              <div className="space-y-2">
                <Label htmlFor="notes">Notes (optional)</Label>
                <Textarea
                  id="notes"
                  placeholder="Any additional notes..."
                  value={notes}
                  onChange={(e) => {
                    if (!hasAdvancedAccess) {
                      setPaywallOpen(true);
                    } else {
                      setNotes(e.target.value);
                    }
                  }}
                  rows={3}
                  disabled={!hasAdvancedAccess}
                />
              </div>

              {/* Save Button */}
              <Button
                onClick={handleSaveLog}
                disabled={saving}
                className="w-full"
              >
                {saving ? 'Saving...' : existingLog ? 'Update Log' : 'Save Log'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <PaywallModal
        open={paywallOpen}
        onClose={() => setPaywallOpen(false)}
        trigger="general"
      />
    </>
  );
};

export default CycleDayModal;