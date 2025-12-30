import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { MoodLog } from '@/types';
import { TrendingUp, Calendar, Tag } from 'lucide-react';

interface MoodTrendsProps {
  moodLogs: MoodLog[];
}

const MoodTrends: React.FC<MoodTrendsProps> = ({ moodLogs }) => {
  const [period, setPeriod] = useState<'7' | '30'>('7');

  const getFilteredLogs = () => {
    const days = period === '7' ? 7 : 30;
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);
    
    return moodLogs
      .filter(log => new Date(log.date) >= cutoffDate)
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  };

  const filteredLogs = getFilteredLogs();

  const chartData = filteredLogs.map(log => ({
    date: new Date(log.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    score: log.score,
    emoji: log.emoji,
  }));

  const averageScore = filteredLogs.length > 0
    ? (filteredLogs.reduce((sum, log) => sum + log.score, 0) / filteredLogs.length).toFixed(1)
    : '0';

  const checkInCount = filteredLogs.length;

  // Get most common tags
  const tagCounts = new Map<string, number>();
  filteredLogs.forEach(log => {
    log.tags.forEach(tag => {
      tagCounts.set(tag, (tagCounts.get(tag) || 0) + 1);
    });
  });

  const topTags = Array.from(tagCounts.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5" />
          Mood Trends
        </CardTitle>
        <CardDescription>Your emotional patterns over time</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <Tabs value={period} onValueChange={(v) => setPeriod(v as '7' | '30')}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="7">Last 7 Days</TabsTrigger>
            <TabsTrigger value="30">Last 30 Days</TabsTrigger>
          </TabsList>

          <TabsContent value={period} className="space-y-6 mt-6">
            {/* Stats */}
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 rounded-lg border bg-card">
                <p className="text-sm text-muted-foreground mb-1">Average Mood</p>
                <p className="text-3xl font-bold">{averageScore}</p>
                <p className="text-xs text-muted-foreground mt-1">out of 5</p>
              </div>
              <div className="p-4 rounded-lg border bg-card">
                <p className="text-sm text-muted-foreground mb-1">Check-ins</p>
                <p className="text-3xl font-bold">{checkInCount}</p>
                <p className="text-xs text-muted-foreground mt-1">completed</p>
              </div>
            </div>

            {/* Chart */}
            {chartData.length > 0 ? (
              <div className="h-[200px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis 
                      dataKey="date" 
                      stroke="hsl(var(--muted-foreground))"
                      fontSize={12}
                    />
                    <YAxis 
                      domain={[1, 5]} 
                      ticks={[1, 2, 3, 4, 5]}
                      stroke="hsl(var(--muted-foreground))"
                      fontSize={12}
                    />
                    <Tooltip 
                      contentStyle={{
                        backgroundColor: 'hsl(var(--card))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px',
                      }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="score" 
                      stroke="hsl(var(--primary))" 
                      strokeWidth={2}
                      dot={{ fill: 'hsl(var(--primary))', r: 4 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="h-[200px] flex items-center justify-center border rounded-lg">
                <p className="text-sm text-muted-foreground">No mood data for this period</p>
              </div>
            )}

            {/* Most Common Tags */}
            {topTags.length > 0 && (
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Tag className="h-4 w-4 text-muted-foreground" />
                  <p className="text-sm font-medium">Most Common Tags</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  {topTags.map(([tag, count]) => (
                    <Badge key={tag} variant="secondary">
                      {tag} ({count})
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default MoodTrends;