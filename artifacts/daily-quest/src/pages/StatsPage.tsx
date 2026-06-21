import React from 'react';
import { useAppState } from '../hooks/useAppState';
import { Card } from '@/components/ui/card';
import { Trophy, Target, Zap, Flame } from 'lucide-react';
import { getPastDates } from '../utils/date';

export default function StatsPage() {
  const { state } = useAppState();
  
  const history = state.history;
  const completedCount = history.filter(h => h.status === 'completed').length;
  const skippedCount = history.filter(h => h.status === 'skipped').length;
  const totalCompleted = completedCount + skippedCount;
  const completionRate = totalCompleted === 0 ? 0 : Math.round((completedCount / totalCompleted) * 100);
  
  const hardCompleted = history.filter(h => h.status === 'completed' && h.challenge.difficulty === 'Hard').length;
  
  const categoryCounts = history.filter(h => h.status === 'completed').reduce((acc, h) => {
    acc[h.challenge.category] = (acc[h.challenge.category] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  
  const mostCompletedCategory = Object.entries(categoryCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || 'None';

  const past7Days = getPastDates(7);

  return (
    <div className="flex flex-col h-full min-h-[calc(100dvh-5rem)] p-4 sm:p-6 pb-8">
      <h1 className="text-3xl font-bold mb-6 pt-4">Stats</h1>
      
      <div className="grid grid-cols-2 gap-4 mb-6">
        <Card className="p-4 bg-card border-border flex flex-col items-center text-center">
          <Zap className="w-6 h-6 text-yellow-500 mb-2" />
          <div className="text-2xl font-bold text-yellow-500">{state.totalXP}</div>
          <div className="text-xs text-muted-foreground uppercase tracking-wider font-medium">Total XP</div>
        </Card>
        
        <Card className="p-4 bg-card border-border flex flex-col items-center text-center">
          <Target className="w-6 h-6 text-green-500 mb-2" />
          <div className="text-2xl font-bold text-green-500">{completionRate}%</div>
          <div className="text-xs text-muted-foreground uppercase tracking-wider font-medium">Win Rate</div>
        </Card>
        
        <Card className="p-4 bg-card border-border flex flex-col items-center text-center">
          <Flame className="w-6 h-6 text-orange-500 mb-2" />
          <div className="text-2xl font-bold text-orange-500">{state.currentStreak}</div>
          <div className="text-xs text-muted-foreground uppercase tracking-wider font-medium">Current Streak</div>
        </Card>
        
        <Card className="p-4 bg-card border-border flex flex-col items-center text-center">
          <Trophy className="w-6 h-6 text-primary mb-2" />
          <div className="text-2xl font-bold text-primary">{state.bestStreak}</div>
          <div className="text-xs text-muted-foreground uppercase tracking-wider font-medium">Best Streak</div>
        </Card>
      </div>

      <Card className="p-5 bg-card border-border mb-6">
        <h3 className="font-bold mb-4">Last 7 Days</h3>
        <div className="flex justify-between items-end h-32 pt-4">
          {past7Days.map((date) => {
            const isCompleted = state.completedDates.includes(date);
            const isSkipped = history.some(h => h.dateGenerated === date && h.status === 'skipped');
            
            let barHeight = "h-2"; // default minimal bar
            let barColor = "bg-secondary";
            
            if (isCompleted) {
              barHeight = "h-full";
              barColor = "bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.4)]";
            } else if (isSkipped) {
              barHeight = "h-8";
              barColor = "bg-muted-foreground";
            }
            
            const dayLabel = new Date(date).toLocaleDateString('en-US', { weekday: 'narrow' });
            
            return (
              <div key={date} className="flex flex-col items-center gap-2 w-full h-full justify-end">
                <div className={`w-8 rounded-md transition-all duration-500 ${barHeight} ${barColor}`} />
                <span className="text-xs font-medium text-muted-foreground">{dayLabel}</span>
              </div>
            );
          })}
        </div>
      </Card>

      <Card className="p-5 bg-card border-border">
        <h3 className="font-bold mb-4">Insights</h3>
        <div className="space-y-4">
          <div className="flex justify-between items-center pb-3 border-b border-border/50">
            <span className="text-muted-foreground text-sm">Quests Completed</span>
            <span className="font-bold">{completedCount}</span>
          </div>
          <div className="flex justify-between items-center pb-3 border-b border-border/50">
            <span className="text-muted-foreground text-sm">Quests Skipped</span>
            <span className="font-bold">{skippedCount}</span>
          </div>
          <div className="flex justify-between items-center pb-3 border-b border-border/50">
            <span className="text-muted-foreground text-sm">Hard Quests Beaten</span>
            <span className="font-bold text-purple-400">{hardCompleted}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground text-sm">Favorite Category</span>
            <span className="font-bold text-primary">{mostCompletedCategory}</span>
          </div>
        </div>
      </Card>
    </div>
  );
}
