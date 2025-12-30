import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { BookOpen, Eye, EyeOff } from 'lucide-react';

interface JournalEntryProps {
  content: string;
  onChange: (content: string) => void;
  promptText?: string;
  viewMode?: boolean;
}

const JOURNAL_PROMPTS = [
  'What are you grateful for today?',
  'What challenged you today, and how did you respond?',
  'What would make tomorrow even better?',
  'What did you learn about yourself today?',
  'What small win can you celebrate today?',
  'How did you show up for yourself today?',
  'What pattern are you noticing in your life right now?',
];

const JournalEntry: React.FC<JournalEntryProps> = ({ content, onChange, promptText, viewMode = false }) => {
  const [revealed, setRevealed] = useState(false);

  // Get daily prompt based on date (stable for the day)
  const getDailyPrompt = () => {
    if (promptText) return promptText; // Use stored prompt if available
    
    const today = new Date();
    const dayOfYear = Math.floor((today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / 86400000);
    const promptIndex = dayOfYear % JOURNAL_PROMPTS.length;
    return JOURNAL_PROMPTS[promptIndex];
  };

  const dailyPrompt = getDailyPrompt();

  // Check if always reveal is enabled
  const alwaysReveal = localStorage.getItem('alwaysRevealJournal') === 'true';
  const shouldReveal = alwaysReveal || revealed;

  if (viewMode && content) {
    return (
      <Card>
        <CardContent className="py-4">
          <div className="space-y-3">
            <div className="bg-primary/5 border border-primary/10 rounded-lg p-3">
              <p className="text-sm font-medium text-primary/80 mb-1">Today's prompt:</p>
              <p className="text-sm text-muted-foreground italic">
                {dailyPrompt}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium mb-2">Your reflection:</p>
              {shouldReveal ? (
                <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                  {content}
                </p>
              ) : (
                <div className="space-y-2">
                  <div className="bg-muted/50 rounded p-4 text-center">
                    <EyeOff className="h-6 w-6 mx-auto mb-2 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground mb-3">
                      Journal entry hidden for privacy
                    </p>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setRevealed(true)}
                    >
                      <Eye className="h-4 w-4 mr-2" />
                      Tap to reveal
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <BookOpen className="h-5 w-5" />
          Journal
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="bg-primary/5 border border-primary/10 rounded-lg p-3">
          <p className="text-sm font-medium text-primary/80 mb-1">Today's prompt:</p>
          <p className="text-sm text-muted-foreground italic">
            {dailyPrompt}
          </p>
        </div>
        <Textarea
          placeholder="Write your thoughts..."
          value={content}
          onChange={(e) => onChange(e.target.value)}
          className="min-h-[120px] resize-none"
        />
        <p className="text-xs text-muted-foreground">
          Your journal is private and stored locally on your device.
        </p>
      </CardContent>
    </Card>
  );
};

export default JournalEntry;