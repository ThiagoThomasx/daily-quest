import React, { useState } from 'react';
import { challenges } from '../data/challenges';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Search, Clock } from 'lucide-react';

const categoryColors: Record<string, string> = {
  Productivity: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  Learning: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
  Health: 'bg-green-500/10 text-green-400 border-green-500/20',
  Creativity: 'bg-orange-500/10 text-orange-400 border-orange-500/20',
  Social: 'bg-pink-500/10 text-pink-400 border-pink-500/20',
  Career: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20',
  Reflection: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
  Fun: 'bg-rose-500/10 text-rose-400 border-rose-500/20',
};

const diffColors: Record<string, string> = {
  Easy: 'text-green-500',
  Medium: 'text-yellow-500',
  Hard: 'text-red-500',
};

export default function LibraryPage() {
  const [search, setSearch] = useState('');
  
  const filtered = challenges.filter(c => 
    c.title.toLowerCase().includes(search.toLowerCase()) || 
    c.category.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex flex-col h-full min-h-[calc(100dvh-5rem)] p-4 sm:p-6 pb-8">
      <h1 className="text-3xl font-bold mb-6 pt-4">Library</h1>
      
      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input 
          placeholder="Search challenges..." 
          className="pl-9 bg-card border-border h-12 rounded-xl"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <ScrollArea className="flex-1 -mx-4 px-4">
        <div className="space-y-3 pb-8">
          {filtered.map(c => (
            <div key={c.id} className="bg-card border border-border rounded-xl p-5 space-y-3 hover:border-primary/50 transition-colors">
              <div className="flex justify-between items-start gap-4">
                <h3 className="font-bold leading-tight">{c.title}</h3>
                <span className={`text-xs font-bold whitespace-nowrap ${diffColors[c.difficulty]}`}>
                  {c.xp} XP
                </span>
              </div>
              <p className="text-sm text-muted-foreground">{c.description}</p>
              <div className="flex justify-between items-center pt-2">
                <span className={`text-[10px] px-2 py-1 rounded-md border font-medium ${categoryColors[c.category] || 'bg-secondary text-foreground'}`}>
                  {c.category}
                </span>
                <div className="flex items-center text-xs text-muted-foreground font-medium">
                  <Clock className="w-3 h-3 mr-1" />
                  {c.estimatedTime}
                </div>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}
