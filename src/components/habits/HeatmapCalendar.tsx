import { HabitLog } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface HeatmapCalendarProps {
  logs: HabitLog[];
  habitType: 'WIN' | 'QUIT';
  startDate: Date;
}

const HeatmapCalendar: React.FC<HeatmapCalendarProps> = ({ logs, habitType, startDate }) => {
  // Generate last 12 weeks (84 days)
  const weeks = 12;
  const daysToShow = weeks * 7;
  const today = new Date();
  const endDate = new Date(today);
  const start = new Date(today);
  start.setDate(start.getDate() - daysToShow + 1);

  // Create a map of date string to log
  const logMap = new Map<string, HabitLog>();
  logs.forEach(log => {
    const dateStr = new Date(log.date).toISOString().split('T')[0];
    logMap.set(dateStr, log);
  });

  // Generate grid data
  const grid: Array<{ date: Date; log: HabitLog | null }> = [];
  for (let i = 0; i < daysToShow; i++) {
    const date = new Date(start);
    date.setDate(date.getDate() + i);
    const dateStr = date.toISOString().split('T')[0];
    grid.push({
      date,
      log: logMap.get(dateStr) || null,
    });
  }

  // Group by weeks
  const weekRows: Array<Array<{ date: Date; log: HabitLog | null }>> = [];
  for (let i = 0; i < grid.length; i += 7) {
    weekRows.push(grid.slice(i, i + 7));
  }

  const getColor = (log: HabitLog | null, date: Date) => {
    if (date > today) return 'bg-muted/30'; // Future dates
    if (date < startDate) return 'bg-muted/30'; // Before habit started
    if (!log) return 'bg-muted'; // No log (missed)

    if (habitType === 'WIN') {
      return log.status === 'done' ? 'bg-green-500' : 'bg-red-500/30';
    } else {
      if (log.status === 'clean') return 'bg-green-500';
      if (log.status === 'relapse') return 'bg-red-500';
      return 'bg-muted';
    }
  };

  const getTooltipText = (log: HabitLog | null, date: Date) => {
    const dateStr = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    
    if (date > today) return `${dateStr} (Future)`;
    if (date < startDate) return `${dateStr} (Not started)`;
    if (!log) return `${dateStr} (No log)`;

    if (habitType === 'WIN') {
      return `${dateStr}: ${log.status === 'done' ? '✓ Done' : '✗ Missed'}`;
    } else {
      if (log.status === 'clean') return `${dateStr}: ✓ Clean`;
      if (log.status === 'relapse') return `${dateStr}: ⚠ Relapse`;
      return `${dateStr}: No log`;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Activity Heatmap</CardTitle>
      </CardHeader>
      <CardContent>
        <TooltipProvider>
          <div className="space-y-2">
            {/* Month labels */}
            <div className="flex gap-1 mb-2 text-xs text-muted-foreground">
              {weekRows.map((week, weekIndex) => {
                const firstDay = week[0].date;
                const showMonth = weekIndex === 0 || firstDay.getDate() <= 7;
                return (
                  <div key={weekIndex} className="flex-1 text-center">
                    {showMonth && firstDay.toLocaleDateString('en-US', { month: 'short' })}
                  </div>
                );
              })}
            </div>

            {/* Day labels */}
            <div className="flex gap-2">
              <div className="flex flex-col gap-1 text-xs text-muted-foreground justify-around">
                <span>Mon</span>
                <span>Wed</span>
                <span>Fri</span>
              </div>

              {/* Heatmap grid */}
              <div className="flex-1 flex gap-1">
                {weekRows.map((week, weekIndex) => (
                  <div key={weekIndex} className="flex-1 flex flex-col gap-1">
                    {week.map((day, dayIndex) => (
                      <Tooltip key={dayIndex}>
                        <TooltipTrigger asChild>
                          <div
                            className={`aspect-square rounded-sm ${getColor(day.log, day.date)} transition-colors cursor-pointer hover:ring-2 hover:ring-primary`}
                          />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p className="text-xs">{getTooltipText(day.log, day.date)}</p>
                        </TooltipContent>
                      </Tooltip>
                    ))}
                  </div>
                ))}
              </div>
            </div>

            {/* Legend */}
            <div className="flex items-center justify-end gap-4 text-xs text-muted-foreground mt-4">
              <span>Less</span>
              <div className="flex gap-1">
                <div className="w-3 h-3 rounded-sm bg-muted" />
                <div className="w-3 h-3 rounded-sm bg-green-500/30" />
                <div className="w-3 h-3 rounded-sm bg-green-500/60" />
                <div className="w-3 h-3 rounded-sm bg-green-500" />
              </div>
              <span>More</span>
            </div>
          </div>
        </TooltipProvider>
      </CardContent>
    </Card>
  );
};

export default HeatmapCalendar;