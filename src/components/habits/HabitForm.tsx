import { useState, useEffect } from 'react';
import { Habit, HabitType, HabitFrequency } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface HabitFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: Partial<Habit>) => void;
  habit?: Habit;
}

const DAYS_OF_WEEK = [
  { value: 0, label: 'Sun' },
  { value: 1, label: 'Mon' },
  { value: 2, label: 'Tue' },
  { value: 3, label: 'Wed' },
  { value: 4, label: 'Thu' },
  { value: 5, label: 'Fri' },
  { value: 6, label: 'Sat' },
];

const HabitForm: React.FC<HabitFormProps> = ({ open, onClose, onSubmit, habit }) => {
  const [name, setName] = useState('');
  const [type, setType] = useState<HabitType>('WIN');
  const [identityStatement, setIdentityStatement] = useState('');
  const [frequency, setFrequency] = useState<HabitFrequency>('daily');
  const [customSchedule, setCustomSchedule] = useState<number[]>([]);
  const [reminderTimes, setReminderTimes] = useState<string[]>(['']);
  const [notes, setNotes] = useState('');

  useEffect(() => {
    if (habit) {
      setName(habit.name);
      setType(habit.type);
      setIdentityStatement(habit.identityStatement || '');
      setFrequency(habit.frequency);
      setCustomSchedule(habit.customSchedule || []);
      setReminderTimes(habit.reminderTimes || ['']);
      setNotes(habit.notes || '');
    } else {
      // Reset form
      setName('');
      setType('WIN');
      setIdentityStatement('');
      setFrequency('daily');
      setCustomSchedule([]);
      setReminderTimes(['']);
      setNotes('');
    }
  }, [habit, open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const data: Partial<Habit> = {
      name,
      type,
      identityStatement: identityStatement || undefined,
      frequency,
      customSchedule: frequency === 'custom' ? customSchedule : undefined,
      reminderTimes: reminderTimes.filter(t => t),
      notes: notes || undefined,
      startDate: habit?.startDate || new Date(),
    };

    onSubmit(data);
  };

  const toggleDay = (day: number) => {
    setCustomSchedule(prev =>
      prev.includes(day) ? prev.filter(d => d !== day) : [...prev, day]
    );
  };

  const addReminderTime = () => {
    setReminderTimes([...reminderTimes, '']);
  };

  const updateReminderTime = (index: number, value: string) => {
    const updated = [...reminderTimes];
    updated[index] = value;
    setReminderTimes(updated);
  };

  const removeReminderTime = (index: number) => {
    setReminderTimes(reminderTimes.filter((_, i) => i !== index));
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{habit ? 'Edit Habit' : 'Create New Habit'}</DialogTitle>
          <DialogDescription>
            {type === 'WIN' 
              ? 'Build a positive habit you want to develop'
              : 'Break a habit you want to quit'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Habit Type */}
          <div className="space-y-3">
            <Label>Habit Type</Label>
            <RadioGroup value={type} onValueChange={(v) => setType(v as HabitType)}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="WIN" id="win" />
                <Label htmlFor="win" className="font-normal cursor-pointer">
                  🎯 WIN - Build this habit
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="QUIT" id="quit" />
                <Label htmlFor="quit" className="font-normal cursor-pointer">
                  🚫 QUIT - Break this habit
                </Label>
              </div>
            </RadioGroup>
          </div>

          {/* Habit Name */}
          <div className="space-y-2">
            <Label htmlFor="name">Habit Name *</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={type === 'WIN' ? 'e.g., Morning meditation' : 'e.g., Smoking'}
              required
            />
          </div>

          {/* Identity Statement */}
          <div className="space-y-2">
            <Label htmlFor="identity">Identity Statement (Optional)</Label>
            <Input
              id="identity"
              value={identityStatement}
              onChange={(e) => setIdentityStatement(e.target.value)}
              placeholder={
                type === 'WIN'
                  ? 'e.g., I am someone who prioritizes mental health'
                  : 'e.g., I am someone who values their health'
              }
            />
            <p className="text-xs text-muted-foreground">
              A powerful statement about who you are becoming
            </p>
          </div>

          {/* Frequency */}
          <div className="space-y-3">
            <Label>Frequency</Label>
            <Select value={frequency} onValueChange={(v) => setFrequency(v as HabitFrequency)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="daily">Every day</SelectItem>
                <SelectItem value="weekly">Specific days of the week</SelectItem>
                <SelectItem value="custom">Custom schedule</SelectItem>
              </SelectContent>
            </Select>

            {(frequency === 'weekly' || frequency === 'custom') && (
              <div className="space-y-2">
                <Label className="text-sm">Select days</Label>
                <div className="flex gap-2">
                  {DAYS_OF_WEEK.map((day) => (
                    <div
                      key={day.value}
                      className={`flex-1 text-center py-2 rounded border cursor-pointer transition-colors ${
                        customSchedule.includes(day.value)
                          ? 'bg-primary text-primary-foreground border-primary'
                          : 'border-input hover:bg-accent'
                      }`}
                      onClick={() => toggleDay(day.value)}
                    >
                      <span className="text-sm font-medium">{day.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Reminder Times */}
          <div className="space-y-3">
            <Label>Reminder Times (Optional)</Label>
            {reminderTimes.map((time, index) => (
              <div key={index} className="flex gap-2">
                <Input
                  type="time"
                  value={time}
                  onChange={(e) => updateReminderTime(index, e.target.value)}
                  className="flex-1"
                />
                {reminderTimes.length > 1 && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => removeReminderTime(index)}
                  >
                    Remove
                  </Button>
                )}
              </div>
            ))}
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={addReminderTime}
            >
              + Add Reminder
            </Button>
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <Label htmlFor="notes">Notes (Optional)</Label>
            <Textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Any additional notes about this habit..."
              rows={3}
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">
              {habit ? 'Save Changes' : 'Create Habit'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default HabitForm;