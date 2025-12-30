import { useState } from 'react';
import { MoodEmoji } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { Input } from '@/components/ui/input';
import { X } from 'lucide-react';

interface MoodLoggerProps {
  emoji: MoodEmoji | null;
  score: number;
  tags: string[];
  onEmojiChange: (emoji: MoodEmoji) => void;
  onScoreChange: (score: number) => void;
  onTagsChange: (tags: string[]) => void;
}

const MOOD_EMOJIS: Array<{ emoji: MoodEmoji; label: string }> = [
  { emoji: '😊', label: 'Happy' },
  { emoji: '😐', label: 'Neutral' },
  { emoji: '😔', label: 'Sad' },
  { emoji: '😤', label: 'Frustrated' },
  { emoji: '😴', label: 'Tired' },
];

const COMMON_TAGS = [
  'Productive', 'Relaxed', 'Stressed', 'Energetic', 'Anxious',
  'Grateful', 'Motivated', 'Lonely', 'Social', 'Creative',
];

const MoodLogger: React.FC<MoodLoggerProps> = ({
  emoji,
  score,
  tags,
  onEmojiChange,
  onScoreChange,
  onTagsChange,
}) => {
  const [customTag, setCustomTag] = useState('');

  const handleAddTag = (tag: string) => {
    if (!tags.includes(tag)) {
      onTagsChange([...tags, tag]);
    }
  };

  const handleRemoveTag = (tag: string) => {
    onTagsChange(tags.filter(t => t !== tag));
  };

  const handleAddCustomTag = () => {
    if (customTag.trim() && !tags.includes(customTag.trim())) {
      onTagsChange([...tags, customTag.trim()]);
      setCustomTag('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleAddCustomTag();
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">How are you feeling?</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Emoji Selection */}
        <div className="space-y-3">
          <p className="text-sm font-medium">Mood</p>
          <div className="flex justify-between gap-2">
            {MOOD_EMOJIS.map(({ emoji: moodEmoji, label }) => (
              <button
                key={moodEmoji}
                onClick={() => onEmojiChange(moodEmoji)}
                className={`flex-1 flex flex-col items-center gap-2 p-3 rounded-lg border-2 transition-all ${
                  emoji === moodEmoji
                    ? 'border-primary bg-primary/10 scale-110'
                    : 'border-border hover:border-primary/50 hover:bg-accent'
                }`}
              >
                <span className="text-3xl">{moodEmoji}</span>
                <span className="text-xs text-muted-foreground">{label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Score Slider */}
        {emoji && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium">Intensity</p>
              <Badge variant="outline">{score} / 5</Badge>
            </div>
            <Slider
              value={[score]}
              onValueChange={(values) => onScoreChange(values[0])}
              min={1}
              max={5}
              step={1}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Low</span>
              <span>High</span>
            </div>
          </div>
        )}

        {/* Tags */}
        {emoji && (
          <div className="space-y-3">
            <p className="text-sm font-medium">Tags (Optional)</p>
            
            {/* Selected Tags */}
            {tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {tags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="gap-1">
                    {tag}
                    <X
                      className="h-3 w-3 cursor-pointer hover:text-destructive"
                      onClick={() => handleRemoveTag(tag)}
                    />
                  </Badge>
                ))}
              </div>
            )}

            {/* Common Tags */}
            <div className="flex flex-wrap gap-2">
              {COMMON_TAGS.filter(tag => !tags.includes(tag)).map((tag) => (
                <Badge
                  key={tag}
                  variant="outline"
                  className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors"
                  onClick={() => handleAddTag(tag)}
                >
                  + {tag}
                </Badge>
              ))}
            </div>

            {/* Custom Tag Input */}
            <div className="flex gap-2">
              <Input
                placeholder="Add custom tag..."
                value={customTag}
                onChange={(e) => setCustomTag(e.target.value)}
                onKeyPress={handleKeyPress}
                className="flex-1"
              />
              <button
                onClick={handleAddCustomTag}
                disabled={!customTag.trim()}
                className="px-4 py-2 text-sm font-medium rounded-md bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Add
              </button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default MoodLogger;