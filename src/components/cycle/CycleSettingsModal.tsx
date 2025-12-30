import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { localCycleService } from '@/services/local/LocalCycleService';
import { CycleSettings } from '@/types';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Info } from 'lucide-react';

interface CycleSettingsModalProps {
  open: boolean;
  onClose: () => void;
  onSave: () => void;
  existingSettings: CycleSettings | null;
}

const CycleSettingsModal: React.FC<CycleSettingsModalProps> = ({
  open,
  onClose,
  onSave,
  existingSettings,
}) => {
  const { user } = useAuth();
  const [enabled, setEnabled] = useState(false);
  const [lastPeriodStart, setLastPeriodStart] = useState('');
  const [averageCycleLength, setAverageCycleLength] = useState(28);
  const [averagePeriodLength, setAveragePeriodLength] = useState(5);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (existingSettings) {
      setEnabled(existingSettings.enabled);
      setLastPeriodStart(
        new Date(existingSettings.lastPeriodStart).toISOString().split('T')[0]
      );
      setAverageCycleLength(existingSettings.averageCycleLength);
      setAveragePeriodLength(existingSettings.averagePeriodLength);
    } else {
      // Set default last period start to today
      setLastPeriodStart(new Date().toISOString().split('T')[0]);
    }
  }, [existingSettings, open]);

  const handleSave = async () => {
    if (!user) return;

    if (enabled && !lastPeriodStart) {
      alert('Please enter your last period start date');
      return;
    }

    setSaving(true);

    try {
      await localCycleService.saveSettings({
        userId: user.id,
        enabled,
        lastPeriodStart: new Date(lastPeriodStart),
        averageCycleLength,
        averagePeriodLength,
      });

      onSave();
    } catch (error) {
      console.error('Error saving cycle settings:', error);
      alert('Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  const handleDisable = async () => {
    if (!user) return;

    setSaving(true);

    try {
      await localCycleService.saveSettings({
        userId: user.id,
        enabled: false,
        lastPeriodStart: new Date(lastPeriodStart || new Date()),
        averageCycleLength,
        averagePeriodLength,
      });

      onSave();
    } catch (error) {
      console.error('Error disabling cycle lens:', error);
      alert('Failed to disable');
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Cycle Lens Settings</DialogTitle>
          <DialogDescription>
            Configure your cycle tracking preferences
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Enable/Disable Toggle */}
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="cycle-enabled">Enable Cycle Lens</Label>
              <p className="text-sm text-muted-foreground">
                Show phase insights on Today page and Weekly Review
              </p>
            </div>
            <Switch
              id="cycle-enabled"
              checked={enabled}
              onCheckedChange={setEnabled}
            />
          </div>

          {enabled && (
            <>
              {/* Last Period Start */}
              <div className="space-y-2">
                <Label htmlFor="last-period">Last Period Start Date</Label>
                <Input
                  id="last-period"
                  type="date"
                  value={lastPeriodStart}
                  onChange={(e) => setLastPeriodStart(e.target.value)}
                  max={new Date().toISOString().split('T')[0]}
                />
              </div>

              {/* Average Cycle Length */}
              <div className="space-y-2">
                <Label htmlFor="cycle-length">Average Cycle Length (days)</Label>
                <Input
                  id="cycle-length"
                  type="number"
                  min="21"
                  max="45"
                  value={averageCycleLength}
                  onChange={(e) => setAverageCycleLength(parseInt(e.target.value) || 28)}
                />
                <p className="text-xs text-muted-foreground">
                  Typical range: 21-35 days (default: 28)
                </p>
              </div>

              {/* Average Period Length */}
              <div className="space-y-2">
                <Label htmlFor="period-length">Average Period Length (days)</Label>
                <Input
                  id="period-length"
                  type="number"
                  min="2"
                  max="10"
                  value={averagePeriodLength}
                  onChange={(e) => setAveragePeriodLength(parseInt(e.target.value) || 5)}
                />
                <p className="text-xs text-muted-foreground">
                  Typical range: 3-7 days (default: 5)
                </p>
              </div>
            </>
          )}

          {/* Disclaimer */}
          <Alert>
            <Info className="h-4 w-4" />
            <AlertDescription className="text-xs">
              <strong>Informational only, not medical advice.</strong> Cycle Lens provides general phase insights. Consult a healthcare provider for medical concerns.
            </AlertDescription>
          </Alert>

          {/* Actions */}
          <div className="flex gap-3">
            {enabled ? (
              <>
                <Button onClick={handleSave} disabled={saving} className="flex-1">
                  {saving ? 'Saving...' : 'Save Settings'}
                </Button>
                <Button
                  variant="outline"
                  onClick={handleDisable}
                  disabled={saving}
                >
                  Disable
                </Button>
              </>
            ) : (
              <Button onClick={onClose} variant="outline" className="flex-1">
                Cancel
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CycleSettingsModal;