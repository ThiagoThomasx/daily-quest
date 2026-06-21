import { useState, useMemo } from 'react';
import { challenges } from '../data/challenges';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Search, Clock, X } from 'lucide-react';
import { Category, Difficulty } from '../types';

// ─── Constants ────────────────────────────────────────────────────────────────

const ALL_CATEGORIES: Category[] = [
  'Productivity', 'Learning', 'Health', 'Creativity',
  'Social', 'Career', 'Reflection', 'Fun',
];

const DIFFICULTIES: Difficulty[] = ['Easy', 'Medium', 'Hard'];

const categoryColors: Record<Category, { chip: string; badge: string }> = {
  Productivity: { chip: 'bg-blue-500 text-white border-blue-500',    badge: 'bg-blue-500/10 text-blue-400 border-blue-500/20'   },
  Learning:     { chip: 'bg-purple-500 text-white border-purple-500', badge: 'bg-purple-500/10 text-purple-400 border-purple-500/20'},
  Health:       { chip: 'bg-green-500 text-white border-green-500',   badge: 'bg-green-500/10 text-green-400 border-green-500/20' },
  Creativity:   { chip: 'bg-orange-500 text-white border-orange-500', badge: 'bg-orange-500/10 text-orange-400 border-orange-500/20'},
  Social:       { chip: 'bg-pink-500 text-white border-pink-500',     badge: 'bg-pink-500/10 text-pink-400 border-pink-500/20'   },
  Career:       { chip: 'bg-cyan-500 text-white border-cyan-500',     badge: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20'   },
  Reflection:   { chip: 'bg-amber-500 text-white border-amber-500',   badge: 'bg-amber-500/10 text-amber-400 border-amber-500/20'},
  Fun:          { chip: 'bg-rose-500 text-white border-rose-500',     badge: 'bg-rose-500/10 text-rose-400 border-rose-500/20'   },
};

const difficultyStyles: Record<Difficulty, { chip: string; text: string }> = {
  Easy:   { chip: 'bg-emerald-500 text-white border-emerald-500', text: 'text-emerald-400' },
  Medium: { chip: 'bg-amber-500 text-white border-amber-500',     text: 'text-amber-400'   },
  Hard:   { chip: 'bg-red-500 text-white border-red-500',         text: 'text-red-400'      },
};

const inactiveChip = 'bg-secondary/60 text-muted-foreground border-border hover:border-border/80';

// ─── Component ────────────────────────────────────────────────────────────────

export default function LibraryPage() {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [selectedDifficulty, setSelectedDifficulty] = useState<Difficulty | null>(null);

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim();
    return challenges.filter(c => {
      if (selectedCategory && c.category !== selectedCategory) return false;
      if (selectedDifficulty && c.difficulty !== selectedDifficulty) return false;
      if (q && !c.title.toLowerCase().includes(q) && !c.description.toLowerCase().includes(q) && !c.category.toLowerCase().includes(q)) return false;
      return true;
    });
  }, [search, selectedCategory, selectedDifficulty]);

  const hasActiveFilter = selectedCategory !== null || selectedDifficulty !== null || search.trim() !== '';

  function clearAll() {
    setSearch('');
    setSelectedCategory(null);
    setSelectedDifficulty(null);
  }

  return (
    <div className="flex flex-col h-full min-h-[calc(100dvh-5rem)] p-4 pb-8 pt-3">
      <div className="flex items-baseline justify-between mb-4 pt-0">
        <h1 className="text-2xl font-bold">Library</h1>
        <span className="text-xs text-muted-foreground font-medium">
          {filtered.length} of {challenges.length} quests
        </span>
      </div>

      {/* Search */}
      <div className="relative mb-3">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Search quests..."
          className="pl-9 bg-card border-border h-11 rounded-xl text-sm"
          value={search}
          onChange={e => setSearch(e.target.value)}
          data-testid="library-search"
        />
        {search && (
          <button
            onClick={() => setSearch('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Category chips — horizontally scrollable */}
      <div className="flex gap-2 overflow-x-auto pb-2 mb-2 no-scrollbar">
        {ALL_CATEGORIES.map(cat => {
          const active = selectedCategory === cat;
          return (
            <button
              key={cat}
              onClick={() => setSelectedCategory(active ? null : cat)}
              data-testid={`filter-cat-${cat.toLowerCase()}`}
              className={`flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${
                active ? categoryColors[cat].chip : inactiveChip
              }`}
            >
              {cat}
            </button>
          );
        })}
      </div>

      {/* Difficulty chips */}
      <div className="flex gap-2 mb-3">
        {DIFFICULTIES.map(diff => {
          const active = selectedDifficulty === diff;
          return (
            <button
              key={diff}
              onClick={() => setSelectedDifficulty(active ? null : diff)}
              data-testid={`filter-diff-${diff.toLowerCase()}`}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${
                active ? difficultyStyles[diff].chip : inactiveChip
              }`}
            >
              {diff}
            </button>
          );
        })}
        {hasActiveFilter && (
          <button
            onClick={clearAll}
            className="ml-auto flex items-center gap-1 px-2.5 py-1.5 rounded-full text-xs font-semibold border border-border/60 text-muted-foreground hover:text-foreground transition-colors"
            data-testid="filter-clear-all"
          >
            <X className="w-3 h-3" />
            Clear
          </button>
        )}
      </div>

      {/* Results */}
      <ScrollArea className="flex-1 -mx-4 px-4">
        <div className="space-y-2.5 pb-8">
          {filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 gap-3 text-center">
              <Search className="w-8 h-8 text-muted-foreground/40" />
              <p className="text-muted-foreground text-sm">No quests match your filters.</p>
              <button onClick={clearAll} className="text-xs text-primary underline underline-offset-2">
                Clear filters
              </button>
            </div>
          ) : (
            filtered.map(c => {
              const catColor = categoryColors[c.category as Category];
              const diffStyle = difficultyStyles[c.difficulty as Difficulty];
              return (
                <div
                  key={c.id}
                  className="bg-card border border-border rounded-xl p-4 hover:border-border/80 transition-colors"
                >
                  {/* Title row */}
                  <div className="flex justify-between items-start gap-3 mb-2">
                    <h3 className="font-semibold text-sm leading-snug">{c.title}</h3>
                    <span className={`text-xs font-bold shrink-0 ${diffStyle.text}`}>
                      +{c.xp} XP
                    </span>
                  </div>

                  {/* Description */}
                  <p className="text-xs text-muted-foreground leading-relaxed mb-3">
                    {c.description}
                  </p>

                  {/* Footer badges */}
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className={`text-[10px] px-2 py-0.5 rounded-full border font-semibold ${catColor?.badge ?? 'bg-secondary text-foreground border-border'}`}>
                      {c.category}
                    </span>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full border font-semibold ${
                      c.difficulty === 'Easy'
                        ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                        : c.difficulty === 'Medium'
                          ? 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                          : 'bg-red-500/10 text-red-400 border-red-500/20'
                    }`}>
                      {c.difficulty}
                    </span>
                    <div className="flex items-center text-[10px] text-muted-foreground font-medium ml-auto">
                      <Clock className="w-3 h-3 mr-1" />
                      {c.estimatedTime}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </ScrollArea>
    </div>
  );
}
