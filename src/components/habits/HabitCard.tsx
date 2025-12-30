import { Habit, HabitStats } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Flame, TrendingUp, Calendar, MoreVertical } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface HabitCardProps {
  habit: Habit;
  stats: HabitStats;
  onEdit: () => void;
  onDelete: () => void;
  onClick: () => void;
}

const HabitCard: React.FC<HabitCardProps> = ({ habit, stats, onEdit, onDelete, onClick }) => {
  return (
    <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={onClick}>
      <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
        <div className="flex-1">
          <CardTitle className="text-lg font-semibold">{habit.name}</CardTitle>
          {habit.identityStatement && (
            <p className="text-sm text-muted-foreground mt-1 italic">
              "{habit.identityStatement}"
            </p>
          )}
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={(e) => { e.stopPropagation(); onEdit(); }}>
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem 
              onClick={(e) => { e.stopPropagation(); onDelete(); }}
              className="text-destructive"
            >
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <Badge variant={habit.type === 'WIN' ? 'default' : 'secondary'}>
            {habit.type === 'WIN' ? '🎯 WIN' : '🚫 QUIT'}
          </Badge>
          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-1">
              <Flame className="h-4 w-4 text-orange-500" />
              <span className="font-semibold">{stats.currentStreak}</span>
            </div>
            <div className="flex items-center gap-1">
              <TrendingUp className="h-4 w-4 text-green-500" />
              <span className="font-semibold">{stats.bestStreak}</span>
            </div>
            <div className="flex items-center gap-1">
              <Calendar className="h-4 w-4 text-blue-500" />
              <span className="font-semibold">{stats.totalCompletions}</span>
            </div>
          </div>
        </div>
        {habit.type === 'QUIT' && stats.totalCleanDays !== undefined && (
          <div className="mt-2 text-xs text-muted-foreground">
            Total clean days: {stats.totalCleanDays}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default HabitCard;