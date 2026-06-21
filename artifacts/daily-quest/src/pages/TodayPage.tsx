import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Check, SkipForward, Zap, Flame, Trophy,
  ChevronRight, Shield, BarChart2, Star,
} from 'lucide-react';
import { useLocation } from 'wouter';
import { useAppState } from '../hooks/useAppState';
import { getLevel, getLevelProgress, getXPForNextLevel } from '../utils/xp';
import { challenges } from '../data/challenges';
import { formatDate, getTodayString, getPastDates } from '../utils/date';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { AppState } from '../types';

// ─── Constants ───────────────────────────────────────────────────────────────

const categoryColors: Record<string, { badge: string; strip: string }> = {
  Productivity: { badge: 'bg-blue-500/20 text-blue-400 border-blue-500/30',   strip: '#3b82f6' },
  Learning:     { badge: 'bg-purple-500/20 text-purple-400 border-purple-500/30', strip: '#8b5cf6' },
  Health:       { badge: 'bg-green-500/20 text-green-400 border-green-500/30',  strip: '#22c55e' },
  Creativity:   { badge: 'bg-orange-500/20 text-orange-400 border-orange-500/30', strip: '#f97316' },
  Social:       { badge: 'bg-pink-500/20 text-pink-400 border-pink-500/30',    strip: '#ec4899' },
  Career:       { badge: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30',    strip: '#06b6d4' },
  Reflection:   { badge: 'bg-amber-500/20 text-amber-400 border-amber-500/30', strip: '#f59e0b' },
  Fun:          { badge: 'bg-rose-500/20 text-rose-400 border-rose-500/30',    strip: '#f43f5e' },
};

const difficultyColors: Record<string, string> = {
  Easy:   'bg-emerald-500/15 text-emerald-400 border-emerald-500/25',
  Medium: 'bg-amber-500/15 text-amber-400 border-amber-500/25',
  Hard:   'bg-red-500/15 text-red-400 border-red-500/25',
};

// ─── Helpers ─────────────────────────────────────────────────────────────────

type DayStatus = 'completed' | 'skipped' | 'missed' | 'today-active' | 'today-done' | 'future';

function getDayStatus(date: string, state: AppState): DayStatus {
  const today = getTodayString();
  if (date > today) return 'future';
  if (date === today) {
    return state.today?.status === 'completed' ? 'today-done' : 'today-active';
  }
  if (state.completedDates.includes(date)) return 'completed';
  const hasHistory = state.history.some(h => h.dateGenerated === date);
  if (hasHistory) return 'skipped';
  return 'missed';
}

function getXPThisWeek(state: AppState): number {
  const dates = new Set(getPastDates(7));
  return state.history
    .filter(h => dates.has(h.dateGenerated) && h.status === 'completed' && h.challenge)
    .reduce((sum, h) => sum + (h.challenge?.xp ?? 0), 0);
}

function getInsightMessage(state: AppState): string {
  const today = getTodayString();
  const isCompletedToday = state.today?.status === 'completed';
  const totalSkipped = state.history.filter(h => h.status === 'skipped').length;
  const totalCompleted = state.history.filter(h => h.status === 'completed').length;
  const skipRatio = totalCompleted + totalSkipped > 0
    ? totalSkipped / (totalCompleted + totalSkipped)
    : 0;

  if (isCompletedToday && state.currentStreak >= 3) {
    return "You're building consistency. Keep the chain alive.";
  }
  if (isCompletedToday) {
    return "You showed up today. That's the habit.";
  }
  if (state.currentStreak >= 3) {
    return `${state.currentStreak}-day streak! Complete today's quest to keep it alive.`;
  }
  if (skipRatio > 0.4 && totalCompleted + totalSkipped >= 5) {
    return "Try easier quests when energy is low — showing up matters most.";
  }
  if (!state.lastActiveDate || state.lastActiveDate !== today) {
    return "A new day, a new quest. Small action. Real momentum.";
  }
  return "Complete today's quest to keep your momentum alive.";
}

// ─── Sub-components ──────────────────────────────────────────────────────────

function LevelBar({ xp, level, progress, nextLevelXP }: {
  xp: number; level: number; progress: number; nextLevelXP: number;
}) {
  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-full bg-primary/15 border border-primary/60 flex items-center justify-center shadow-[0_0_14px_rgba(139,92,246,0.3)] shrink-0">
            <span className="font-bold text-sm text-primary">{level}</span>
          </div>
          <div>
            <p className="font-semibold text-sm leading-tight">Level {level}</p>
            <p className="text-xs text-muted-foreground">{xp} / {nextLevelXP} XP</p>
          </div>
        </div>
        <div className="flex items-center gap-1 text-yellow-400 text-xs font-semibold">
          <Zap className="w-3.5 h-3.5" />
          <span>{xp} XP total</span>
        </div>
      </div>
      <div className="h-2.5 w-full bg-secondary rounded-full overflow-hidden border border-border/60">
        <motion.div
          className="h-full bg-gradient-to-r from-yellow-500 to-amber-400 rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 1.2, ease: 'easeOut' }}
        />
      </div>
    </div>
  );
}

function WeeklyStrip({ state }: { state: AppState }) {
  const last7 = useMemo(() => getPastDates(7), []);
  const today = getTodayString();

  const DAY_LABELS = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

  return (
    <Card className="bg-card border-border p-4">
      <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-3">
        Last 7 days
      </p>
      <div className="flex items-center justify-between gap-1">
        {last7.map((date) => {
          const status = getDayStatus(date, state);
          const d = new Date(date + 'T00:00:00');
          const dayLabel = DAY_LABELS[d.getDay()];
          const dayNum = d.getDate();
          const isToday = date === today;

          let circleClass = '';
          let innerClass = '';
          let tooltip = '';

          switch (status) {
            case 'completed':
            case 'today-done':
              circleClass = 'bg-green-500/20 border-green-500/50';
              innerClass = 'text-green-400';
              tooltip = 'Completed';
              break;
            case 'today-active':
              circleClass = 'bg-primary/10 border-primary shadow-[0_0_10px_rgba(139,92,246,0.4)]';
              innerClass = 'text-primary font-bold';
              tooltip = 'Today';
              break;
            case 'skipped':
              circleClass = 'bg-amber-500/10 border-amber-500/30';
              innerClass = 'text-amber-500/70';
              tooltip = 'Skipped';
              break;
            case 'missed':
              circleClass = 'bg-red-500/5 border-red-500/20';
              innerClass = 'text-red-400/40';
              tooltip = 'Missed';
              break;
            case 'future':
              circleClass = 'bg-secondary/30 border-border/30';
              innerClass = 'text-muted-foreground/30';
              tooltip = 'Upcoming';
              break;
          }

          return (
            <div key={date} className="flex flex-col items-center gap-1 flex-1" title={tooltip}>
              <span className="text-[9px] text-muted-foreground font-medium">{dayLabel}</span>
              <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all ${circleClass}`}>
                {status === 'completed' || status === 'today-done' ? (
                  <Check className="w-3.5 h-3.5 text-green-400" />
                ) : status === 'skipped' ? (
                  <SkipForward className="w-3 h-3 text-amber-400/60" />
                ) : (
                  <span className={`text-[10px] font-semibold ${innerClass}`}>{dayNum}</span>
                )}
              </div>
              {isToday && (
                <span className="text-[9px] text-primary font-bold">NOW</span>
              )}
            </div>
          );
        })}
      </div>
    </Card>
  );
}

function QuickStats({ state }: { state: AppState }) {
  const completedCount = state.history.filter(h => h.status === 'completed').length;
  const xpThisWeek = getXPThisWeek(state);

  const stats = [
    { label: 'Completed', value: completedCount, icon: Trophy, color: 'text-green-400' },
    { label: 'Streak', value: state.currentStreak, icon: Flame, color: 'text-orange-400', suffix: state.currentStreak === 1 ? 'day' : 'days' },
    { label: 'XP / Week', value: xpThisWeek, icon: Zap, color: 'text-yellow-400' },
  ];

  return (
    <div className="grid grid-cols-3 gap-2">
      {stats.map(({ label, value, icon: Icon, color, suffix }) => (
        <Card key={label} className="bg-card border-border p-3 flex flex-col items-center gap-1 text-center">
          <Icon className={`w-4 h-4 ${color}`} />
          <span className="text-lg font-bold leading-tight">{value}</span>
          {suffix && <span className="text-[9px] text-muted-foreground">{suffix}</span>}
          <span className="text-[10px] text-muted-foreground font-medium leading-tight">{label}</span>
        </Card>
      ))}
    </div>
  );
}

function InsightCard({ state }: { state: AppState }) {
  const message = getInsightMessage(state);
  const isCompleted = state.today?.status === 'completed';

  return (
    <div className={`rounded-xl border p-3.5 flex items-start gap-3 ${
      isCompleted
        ? 'bg-primary/8 border-primary/20'
        : 'bg-secondary/40 border-border'
    }`}>
      <Star className={`w-4 h-4 shrink-0 mt-0.5 ${isCompleted ? 'text-primary' : 'text-muted-foreground'}`} />
      <p className="text-xs text-muted-foreground leading-relaxed">{message}</p>
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function TodayPage() {
  const [, setLocation] = useLocation();
  const { state, completeQuest, skipQuest } = useAppState();
  const [isCompleting, setIsCompleting] = useState(false);
  const [showSkipDialog, setShowSkipDialog] = useState(false);

  const todayStr = getTodayString();
  const currentLevel = getLevel(state.totalXP);
  const progress = getLevelProgress(state.totalXP);
  const nextLevelXP = getXPForNextLevel(currentLevel);

  const todayChallengeData = state.today
    ? challenges.find(c => c.id === state.today!.challengeId) ?? null
    : null;

  const isCompleted = state.today?.status === 'completed';

  const completedChallenge = isCompleted && state.today
    ? challenges.find(c => c.id === state.today!.challengeId) ?? null
    : null;

  const catColor = todayChallengeData
    ? (categoryColors[todayChallengeData.category] ?? { badge: 'bg-secondary text-foreground border-border', strip: '#6366f1' })
    : { badge: '', strip: '#6366f1' };

  const completedCatColor = completedChallenge
    ? (categoryColors[completedChallenge.category] ?? { badge: 'bg-secondary text-foreground border-border', strip: '#6366f1' })
    : { badge: '', strip: '#6366f1' };

  const handleComplete = () => {
    if (isCompleting || isCompleted) return;
    setIsCompleting(true);
    setTimeout(() => {
      completeQuest();
      setIsCompleting(false);
    }, 900);
  };

  const handleSkipConfirm = () => {
    setShowSkipDialog(false);
    skipQuest();
  };

  // Sidebar content (weekly strip + stats + insight)
  const sideContent = (
    <div className="flex flex-col gap-3">
      <WeeklyStrip state={state} />
      <QuickStats state={state} />
      <InsightCard state={state} />
    </div>
  );

  return (
    <div className="p-4 pb-6 pt-3">
      {/* ── Header ── */}
      <div className="flex justify-between items-center mb-4">
        <div>
          <p className="text-muted-foreground text-xs font-semibold uppercase tracking-widest">
            {formatDate(todayStr)}
          </p>
          <h1 className="text-2xl font-bold mt-0.5">Daily Quest</h1>
        </div>
        <div
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-sm font-bold ${
            state.currentStreak > 0
              ? 'bg-orange-500/10 border-orange-500/30 text-orange-400'
              : 'bg-card border-border text-muted-foreground'
          }`}
          data-testid="streak-pill"
        >
          <Flame className={`w-4 h-4 ${state.currentStreak > 0 ? 'text-orange-400' : ''}`} />
          <span>{state.currentStreak}</span>
        </div>
      </div>

      {/* ── Level bar ── */}
      <div className="mb-4">
        <LevelBar xp={state.totalXP} level={currentLevel} progress={progress} nextLevelXP={nextLevelXP} />
      </div>

      {/* ── Two-column grid on large screens ── */}
      <div className="lg:grid lg:grid-cols-[1fr_280px] lg:gap-5 lg:items-start">

        {/* ── LEFT: quest area ── */}
        <div>
          <AnimatePresence mode="wait">

            {/* Completing flash */}
            {isCompleting && (
              <motion.div
                key="completing"
                initial={{ scale: 0.6, opacity: 0 }}
                animate={{ scale: [0.6, 1.1, 1], opacity: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.5 }}
                className="flex flex-col items-center justify-center gap-4 py-20"
              >
                <div className="w-24 h-24 rounded-full bg-green-500/20 border-2 border-green-500/50 flex items-center justify-center shadow-[0_0_50px_rgba(34,197,94,0.4)]">
                  <Check className="w-12 h-12 text-green-400" />
                </div>
                <p className="text-xl font-bold text-green-400">Quest Complete!</p>
              </motion.div>
            )}

            {/* Completed state */}
            {!isCompleting && isCompleted && (
              <motion.div
                key="completed"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
              >
                <Card className="bg-card border-border overflow-hidden">
                  {/* Green top strip */}
                  <div className="h-1.5 w-full bg-gradient-to-r from-green-500 to-emerald-400" />
                  <div className="p-5 flex flex-col gap-4">
                    {/* Trophy + title */}
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-green-500/15 border-2 border-green-500/40 flex items-center justify-center shadow-[0_0_20px_rgba(34,197,94,0.2)] shrink-0">
                        <Trophy className="w-6 h-6 text-green-400" />
                      </div>
                      <div>
                        <h2 className="text-lg font-bold leading-tight">Quest Complete</h2>
                        {completedChallenge && (
                          <p className="text-yellow-400 font-semibold text-sm">
                            +{completedChallenge.xp} XP earned
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Streak pill */}
                    <div className="flex items-center gap-2 self-start text-orange-400 font-semibold text-xs bg-orange-500/10 border border-orange-500/20 px-3 py-1.5 rounded-full">
                      <Flame className="w-3.5 h-3.5" />
                      <span>
                        {state.currentStreak} {state.currentStreak === 1 ? 'day' : 'days'} streak
                      </span>
                    </div>

                    {/* Level progress */}
                    <div className="bg-secondary/50 border border-border/60 rounded-xl p-3">
                      <div className="flex justify-between mb-2">
                        <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Level Progress</span>
                        <span className="text-xs text-muted-foreground">{state.totalXP} / {nextLevelXP} XP</span>
                      </div>
                      <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
                        <motion.div
                          className="h-full bg-gradient-to-r from-yellow-500 to-amber-400 rounded-full"
                          initial={{ width: 0 }}
                          animate={{ width: `${progress}%` }}
                          transition={{ duration: 1.2, ease: 'easeOut', delay: 0.2 }}
                        />
                      </div>
                    </div>

                    {/* Completed quest summary */}
                    {completedChallenge && (
                      <div
                        className="rounded-xl border border-border bg-muted/30 overflow-hidden"
                        style={{ borderLeftColor: completedCatColor.strip, borderLeftWidth: '3px' }}
                      >
                        <div className="p-3">
                          <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wider mb-1.5">
                            Today's Quest
                          </p>
                          <p className="font-semibold text-sm mb-2 leading-snug">{completedChallenge.title}</p>
                          <div className="flex gap-2 flex-wrap">
                            <span className={`px-2 py-0.5 rounded-full text-xs font-semibold border ${completedCatColor.badge}`}>
                              {completedChallenge.category}
                            </span>
                            <span className={`px-2 py-0.5 rounded-full text-xs font-semibold border ${difficultyColors[completedChallenge.difficulty] ?? ''}`}>
                              {completedChallenge.difficulty}
                            </span>
                          </div>
                        </div>
                      </div>
                    )}

                    <p className="text-muted-foreground text-xs text-center">
                      Come back tomorrow for your next quest.
                    </p>

                    {/* Buttons */}
                    <div className="flex gap-2.5">
                      <Button
                        variant="outline"
                        className="flex-1 h-11 text-sm"
                        onClick={() => setLocation('/history')}
                        data-testid="button-view-history"
                      >
                        History
                        <ChevronRight className="w-3.5 h-3.5 ml-1" />
                      </Button>
                      <Button
                        variant="outline"
                        className="flex-1 h-11 text-sm"
                        onClick={() => setLocation('/stats')}
                        data-testid="button-view-stats"
                      >
                        <BarChart2 className="w-3.5 h-3.5 mr-1" />
                        Stats
                      </Button>
                    </div>
                  </div>
                </Card>
              </motion.div>
            )}

            {/* Active quest */}
            {!isCompleting && !isCompleted && todayChallengeData && (
              <motion.div
                key="active-quest"
                initial={{ opacity: 0, y: 16, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 1.03 }}
                transition={{ duration: 0.3 }}
              >
                <Card
                  className="relative bg-card border-2 border-primary/35 overflow-hidden"
                  style={{ boxShadow: `0 0 40px ${catColor.strip}18` }}
                >
                  {/* Category color strip */}
                  <div className="h-1.5 w-full" style={{ background: catColor.strip }} />

                  <div className="p-5 flex flex-col gap-4">
                    {/* Badges */}
                    <div className="flex gap-2 flex-wrap">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-bold border ${catColor.badge}`}>
                        {todayChallengeData.category}
                      </span>
                      <span className={`px-2.5 py-1 rounded-full text-xs font-bold border ${difficultyColors[todayChallengeData.difficulty] ?? 'bg-secondary text-foreground border-border'}`}>
                        {todayChallengeData.difficulty}
                      </span>
                      <span className="px-2.5 py-1 rounded-full text-xs font-bold border bg-secondary/60 border-border text-muted-foreground">
                        {todayChallengeData.estimatedTime}
                      </span>
                    </div>

                    {/* Title + description */}
                    <div>
                      <h3 className="text-xl font-bold mb-1.5 leading-snug">
                        {todayChallengeData.title}
                      </h3>
                      <p className="text-muted-foreground text-sm leading-relaxed">
                        {todayChallengeData.description}
                      </p>
                      <p className="text-primary/70 text-xs mt-2 font-medium italic">
                        Small action. Real momentum.
                      </p>
                    </div>

                    {/* XP chip */}
                    <div className="self-start flex items-center gap-1.5 text-yellow-400 font-bold bg-yellow-500/10 border border-yellow-500/20 px-4 py-1.5 rounded-full text-sm">
                      <Zap className="w-4 h-4" />
                      <span>+{todayChallengeData.xp} XP</span>
                    </div>

                    {/* CTAs */}
                    <div className="flex flex-col gap-2.5 pt-0.5">
                      <Button
                        size="lg"
                        className="w-full h-14 text-base font-bold bg-primary hover:bg-primary/90 text-primary-foreground shadow-[0_0_24px_rgba(139,92,246,0.4)] transition-all"
                        onClick={handleComplete}
                        data-testid="button-complete-quest"
                      >
                        <Check className="w-5 h-5 mr-2" />
                        Complete Quest
                      </Button>
                      <Button
                        variant="outline"
                        className="w-full h-11 text-sm border-border/80 text-muted-foreground hover:text-foreground hover:border-border"
                        onClick={() => setShowSkipDialog(true)}
                        data-testid="button-skip-quest"
                      >
                        <SkipForward className="w-4 h-4 mr-1.5" />
                        Skip / Reroll
                      </Button>
                    </div>
                  </div>
                </Card>
              </motion.div>
            )}

            {/* Empty/loading */}
            {!isCompleting && !isCompleted && !todayChallengeData && (
              <motion.div
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col items-center justify-center gap-4 py-16"
              >
                <div className="w-14 h-14 rounded-full bg-secondary flex items-center justify-center border border-border">
                  <Shield className="w-7 h-7 text-muted-foreground" />
                </div>
                <p className="text-muted-foreground text-sm">Loading your quest...</p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* On mobile: sidebar content appears below the card */}
          <div className="mt-3 flex flex-col gap-3 lg:hidden">
            {sideContent}
          </div>
        </div>

        {/* ── RIGHT: sidebar (desktop only) ── */}
        <div className="hidden lg:flex lg:flex-col lg:gap-3">
          {sideContent}
        </div>
      </div>

      {/* Skip dialog */}
      <Dialog open={showSkipDialog} onOpenChange={setShowSkipDialog}>
        <DialogContent data-testid="dialog-skip-confirm">
          <DialogHeader>
            <DialogTitle>Skip this quest?</DialogTitle>
            <DialogDescription>
              This quest will be saved to your history as skipped, and you'll get a fresh new quest for today.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex-col sm:flex-row gap-2">
            <Button
              variant="outline"
              onClick={() => setShowSkipDialog(false)}
              className="w-full sm:w-auto"
              data-testid="button-skip-cancel"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSkipConfirm}
              className="w-full sm:w-auto"
              data-testid="button-skip-confirm"
            >
              <SkipForward className="w-4 h-4 mr-2" />
              Skip & Reroll
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
