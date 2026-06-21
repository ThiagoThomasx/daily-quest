import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, SkipForward, Zap, Flame, Trophy, ChevronRight, Shield } from 'lucide-react';
import { useLocation } from 'wouter';
import { useAppState } from '../hooks/useAppState';
import { getLevel, getLevelProgress, getXPForNextLevel } from '../utils/xp';
import { challenges } from '../data/challenges';
import { formatDate, getTodayString } from '../utils/date';
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

const categoryColors: Record<string, { badge: string; strip: string }> = {
  Productivity: { badge: 'bg-blue-500/20 text-blue-400 border-blue-500/30', strip: '#3b82f6' },
  Learning:     { badge: 'bg-purple-500/20 text-purple-400 border-purple-500/30', strip: '#8b5cf6' },
  Health:       { badge: 'bg-green-500/20 text-green-400 border-green-500/30', strip: '#22c55e' },
  Creativity:   { badge: 'bg-orange-500/20 text-orange-400 border-orange-500/30', strip: '#f97316' },
  Social:       { badge: 'bg-pink-500/20 text-pink-400 border-pink-500/30', strip: '#ec4899' },
  Career:       { badge: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30', strip: '#06b6d4' },
  Reflection:   { badge: 'bg-amber-500/20 text-amber-400 border-amber-500/30', strip: '#f59e0b' },
  Fun:          { badge: 'bg-rose-500/20 text-rose-400 border-rose-500/30', strip: '#f43f5e' },
};

const difficultyColors: Record<string, string> = {
  Easy:   'bg-emerald-500/15 text-emerald-400 border-emerald-500/25',
  Medium: 'bg-amber-500/15 text-amber-400 border-amber-500/25',
  Hard:   'bg-red-500/15 text-red-400 border-red-500/25',
};

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
    ? challenges.find(c => c.id === state.today!.challengeId)
    : null;

  const isCompleted = state.today?.status === 'completed';

  const completedChallenge = isCompleted && state.today
    ? challenges.find(c => c.id === state.today!.challengeId)
    : null;

  const handleComplete = () => {
    if (isCompleting || isCompleted) return;
    setIsCompleting(true);
    setTimeout(() => {
      completeQuest();
      setIsCompleting(false);
    }, 1000);
  };

  const handleSkipConfirm = () => {
    setShowSkipDialog(false);
    skipQuest();
  };

  const catColor = todayChallengeData
    ? (categoryColors[todayChallengeData.category] ?? { badge: 'bg-secondary text-foreground border-border', strip: '#6366f1' })
    : { badge: '', strip: '#6366f1' };

  const completedCatColor = completedChallenge
    ? (categoryColors[completedChallenge.category] ?? { badge: 'bg-secondary text-foreground border-border', strip: '#6366f1' })
    : { badge: '', strip: '#6366f1' };

  return (
    <div className="flex flex-col min-h-[calc(100dvh-4rem)] p-4 pb-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-5 pt-3">
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

      {/* Level + XP */}
      <div className="mb-5">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-full bg-primary/15 border border-primary/60 flex items-center justify-center shadow-[0_0_14px_rgba(139,92,246,0.3)]">
              <span className="font-bold text-sm text-primary">{currentLevel}</span>
            </div>
            <div>
              <p className="font-semibold text-sm leading-tight">Level {currentLevel}</p>
              <p className="text-xs text-muted-foreground">{state.totalXP} / {nextLevelXP} XP</p>
            </div>
          </div>
          <div className="flex items-center gap-1 text-yellow-400 text-xs font-semibold">
            <Zap className="w-3.5 h-3.5" />
            <span>{state.totalXP} XP</span>
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

      {/* Main content area */}
      <div className="flex-1 flex flex-col justify-center">
        <AnimatePresence mode="wait">
          {/* Completing animation */}
          {isCompleting && (
            <motion.div
              key="completing"
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: [0.5, 1.15, 1], opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="flex flex-col items-center justify-center gap-4 py-16"
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
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="flex flex-col items-center gap-5"
            >
              <div className="w-20 h-20 rounded-full bg-green-500/15 border-2 border-green-500/40 flex items-center justify-center shadow-[0_0_30px_rgba(34,197,94,0.25)]">
                <Trophy className="w-10 h-10 text-green-400" />
              </div>

              <div className="text-center">
                <h2 className="text-2xl font-bold mb-1">Quest Complete!</h2>
                {completedChallenge && (
                  <p className="text-yellow-400 font-semibold text-lg">
                    +{completedChallenge.xp} XP earned
                  </p>
                )}
              </div>

              <div className="flex items-center gap-2 text-orange-400 font-semibold text-sm bg-orange-500/10 border border-orange-500/20 px-4 py-2 rounded-full">
                <Flame className="w-4 h-4" />
                <span>Streak: {state.currentStreak} {state.currentStreak === 1 ? 'day' : 'days'}</span>
              </div>

              {/* Updated XP bar */}
              <div className="w-full bg-card border border-border rounded-xl p-4">
                <div className="flex justify-between items-center mb-2">
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Level Progress</p>
                  <p className="text-xs text-muted-foreground">{state.totalXP} / {nextLevelXP} XP</p>
                </div>
                <div className="h-2.5 w-full bg-secondary rounded-full overflow-hidden border border-border/60">
                  <motion.div
                    className="h-full bg-gradient-to-r from-yellow-500 to-amber-400 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 1.2, ease: 'easeOut', delay: 0.3 }}
                  />
                </div>
              </div>

              {/* Completed quest summary */}
              {completedChallenge && (
                <div className="w-full">
                  <div
                    className="rounded-xl border border-border bg-card overflow-hidden"
                    style={{ borderTopColor: completedCatColor.strip, borderTopWidth: '3px' }}
                  >
                    <div className="p-4">
                      <p className="text-xs text-muted-foreground uppercase tracking-wider mb-2 font-semibold">Today's Quest</p>
                      <p className="font-semibold text-sm mb-2">{completedChallenge.title}</p>
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
                </div>
              )}

              <p className="text-muted-foreground text-sm text-center max-w-[260px]">
                Come back tomorrow for your next quest.
              </p>

              <Button
                variant="outline"
                className="w-full h-12"
                onClick={() => setLocation('/history')}
                data-testid="button-view-history"
              >
                View History
                <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </motion.div>
          )}

          {/* Active quest */}
          {!isCompleting && !isCompleted && todayChallengeData && (
            <motion.div
              key="active-quest"
              initial={{ opacity: 0, y: 20, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 1.05, filter: 'blur(8px)' }}
              transition={{ duration: 0.35 }}
            >
              {/* Glow behind card */}
              <div
                className="absolute inset-x-4 h-48 blur-3xl opacity-20 rounded-full pointer-events-none"
                style={{ background: catColor.strip }}
              />

              <Card
                className="relative bg-card border-2 border-primary/35 overflow-hidden"
                style={{ boxShadow: `0 0 40px ${catColor.strip}20` }}
              >
                {/* Category color strip */}
                <div
                  className="h-1.5 w-full"
                  style={{ background: catColor.strip }}
                />

                <div className="p-5 flex flex-col gap-4">
                  {/* Badges row */}
                  <div className="flex gap-2 flex-wrap">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold border ${catColor.badge}`}>
                      {todayChallengeData.category}
                    </span>
                    <span className={`px-3 py-1 rounded-full text-xs font-bold border ${difficultyColors[todayChallengeData.difficulty] ?? 'bg-secondary text-foreground border-border'}`}>
                      {todayChallengeData.difficulty}
                    </span>
                    <span className="px-3 py-1 rounded-full text-xs font-bold border bg-secondary/60 border-border text-muted-foreground">
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
                  </div>

                  {/* XP chip */}
                  <div className="self-start flex items-center gap-1.5 text-yellow-400 font-bold bg-yellow-500/10 border border-yellow-500/20 px-4 py-1.5 rounded-full text-sm">
                    <Zap className="w-4 h-4" />
                    <span>+{todayChallengeData.xp} XP</span>
                  </div>

                  {/* CTAs */}
                  <div className="flex flex-col gap-2.5 pt-1">
                    <Button
                      size="lg"
                      className="w-full h-14 text-base font-bold bg-primary hover:bg-primary/90 text-primary-foreground shadow-[0_0_24px_rgba(139,92,246,0.45)] transition-all"
                      onClick={handleComplete}
                      data-testid="button-complete-quest"
                    >
                      <Check className="w-5 h-5 mr-2" />
                      Complete Quest
                    </Button>
                    <Button
                      variant="outline"
                      size="lg"
                      className="w-full h-12 text-muted-foreground hover:text-foreground"
                      onClick={() => setShowSkipDialog(true)}
                      data-testid="button-skip-quest"
                    >
                      <SkipForward className="w-4 h-4 mr-2" />
                      Skip / Reroll
                    </Button>
                  </div>
                </div>
              </Card>
            </motion.div>
          )}

          {/* Empty / loading state */}
          {!isCompleting && !isCompleted && !todayChallengeData && (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center justify-center gap-4 py-20"
            >
              <div className="w-16 h-16 rounded-full bg-secondary flex items-center justify-center border border-border">
                <Shield className="w-8 h-8 text-muted-foreground" />
              </div>
              <p className="text-muted-foreground text-sm text-center">Loading your quest...</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Skip confirmation dialog */}
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
