import React, { useState, useMemo } from 'react';
import { format } from 'date-fns';
import { Check, X } from 'lucide-react';
import { useAppState } from '../hooks/useAppState';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';

const categoryColors: Record<string, string> = {
  Productivity: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  Learning: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
  Health: 'bg-green-500/20 text-green-400 border-green-500/30',
  Creativity: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
  Social: 'bg-pink-500/20 text-pink-400 border-pink-500/30',
  Career: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30',
  Reflection: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
  Fun: 'bg-rose-500/20 text-rose-400 border-rose-500/30',
};

export default function HistoryPage() {
  const { state } = useAppState();
  const [filter, setFilter] = useState<string>('All');
  
  const history = state.history;
  
  const filteredHistory = useMemo(() => {
    if (filter === 'All') return history;
    if (filter === 'Completed') return history.filter(h => h.status === 'completed');
    if (filter === 'Skipped') return history.filter(h => h.status === 'skipped');
    return history.filter(h => h.challenge.category === filter);
  }, [history, filter]);

  return (
    <div className="flex flex-col h-full min-h-[calc(100dvh-5rem)] p-4 sm:p-6 pb-8">
      <h1 className="text-3xl font-bold mb-6 pt-4">History</h1>
      
      <div className="flex gap-2 overflow-x-auto pb-4 mb-2 no-scrollbar">
        {['All', 'Completed', 'Skipped', 'Productivity', 'Learning', 'Health', 'Creativity', 'Social', 'Career', 'Reflection', 'Fun'].map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`whitespace-nowrap px-3 py-1.5 rounded-full text-xs font-medium transition-colors border ${
              filter === f 
                ? 'bg-primary text-primary-foreground border-primary' 
                : 'bg-secondary text-muted-foreground border-transparent hover:bg-secondary/80'
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      <ScrollArea className="flex-1 -mx-4 px-4">
        {filteredHistory.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center space-y-4 text-muted-foreground">
            <div className="w-16 h-16 rounded-full bg-secondary flex items-center justify-center">
              <Check className="w-8 h-8 opacity-50" />
            </div>
            <p>No history found for this filter.</p>
          </div>
        ) : (
          <div className="space-y-3 pb-8">
            {filteredHistory.map((item, i) => (
              <div key={`${item.challengeId}-${i}`} className="bg-card border border-border rounded-xl p-4 flex gap-4 items-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
                  item.status === 'completed' ? 'bg-green-500/20 text-green-500' : 'bg-secondary text-muted-foreground'
                }`}>
                  {item.status === 'completed' ? <Check className="w-5 h-5" /> : <X className="w-5 h-5" />}
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-bold text-sm truncate">{item.challenge.title}</h4>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs text-muted-foreground">
                      {format(new Date(item.dateCompleted || item.dateGenerated), 'MMM d, yyyy')}
                    </span>
                    <span className="text-[10px] text-muted-foreground">•</span>
                    <span className={`text-[10px] font-bold uppercase tracking-wider ${
                      item.status === 'completed' ? 'text-yellow-500' : 'text-muted-foreground'
                    }`}>
                      {item.status === 'completed' ? `+${item.challenge.xp} XP` : '0 XP'}
                    </span>
                  </div>
                </div>
                <div className={`text-xs px-2 py-1 rounded-md border ${categoryColors[item.challenge.category] || 'bg-secondary text-foreground'}`}>
                  {item.challenge.category}
                </div>
              </div>
            ))}
          </div>
        )}
      </ScrollArea>
    </div>
  );
}
