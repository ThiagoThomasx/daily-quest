import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, SkipForward, Star, Zap, Flame, Trophy } from 'lucide-react';
import { useAppState } from '../hooks/useAppState';
import { getLevel, getLevelProgress, getXPForNextLevel } from '../utils/xp';
import { challenges } from '../data/challenges';
import { formatDate, getTodayString } from '../utils/date';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Card } from '@/components/ui/card';

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

export default function TodayPage() {
  const { state, completeQuest, skipQuest } = useAppState();
  const [isCompleting, setIsCompleting] = useState(false);

  const todayStr = getTodayString();
  const currentLevel = getLevel(state.totalXP);
  const progress = getLevelProgress(state.totalXP);
  const nextLevelXP = getXPForNextLevel(currentLevel);

  const todayChallengeData = state.today ? challenges.find(c => c.id === state.today!.challengeId) : null;
  const isCompleted = state.today?.status === 'completed';

  const handleComplete = () => {
    setIsCompleting(true);
    setTimeout(() => {
      completeQuest();
      setIsCompleting(false);
    }, 1000);
  };

  return (
    <div className="flex flex-col h-full min-h-[calc(100dvh-5rem)] p-4 sm:p-6 pb-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-8 pt-4">
        <div>
          <h2 className="text-muted-foreground text-sm font-medium uppercase tracking-wider">{formatDate(todayStr)}</h2>
          <h1 className="text-3xl font-bold mt-1">Daily Quest</h1>
        </div>
        <div className="flex gap-3">
          <div className="flex items-center gap-1.5 bg-card border border-border px-3 py-1.5 rounded-full shadow-sm">
            <Flame className={`w-4 h-4 ${state.currentStreak > 0 ? 'text-orange-500' : 'text-muted-foreground'}`} />
            <span className="font-bold">{state.currentStreak}</span>
          </div>
        </div>
      </div>

      {/* Level Info */}
      <div className="mb-8">
        <div className="flex justify-between items-end mb-2">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-full bg-primary/20 border border-primary flex items-center justify-center shadow-[0_0_15px_rgba(var(--primary),0.3)]">
              <span className="font-bold text-lg text-primary">{currentLevel}</span>
            </div>
            <div>
              <div className="font-medium text-sm">Level {currentLevel}</div>
              <div className="text-xs text-muted-foreground">{state.totalXP} / {nextLevelXP} XP</div>
            </div>
          </div>
        </div>
        <div className="relative h-3 w-full bg-secondary rounded-full overflow-hidden border border-border">
          <motion.div 
            className="absolute top-0 left-0 h-full bg-yellow-500"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 1, ease: "easeOut" }}
          />
        </div>
      </div>

      {/* Challenge Card */}
      <div className="flex-1 flex flex-col justify-center max-h-[500px]">
        <AnimatePresence mode="wait">
          {todayChallengeData && !isCompleting && !isCompleted ? (
            <motion.div
              key="active-quest"
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 1.1, filter: 'blur(10px)' }}
              transition={{ duration: 0.4 }}
              className="relative"
            >
              <div className="absolute inset-0 bg-primary/20 blur-3xl rounded-full" />
              <Card className="relative bg-card border-2 border-primary/50 shadow-[0_0_30px_rgba(var(--primary),0.15)] overflow-hidden">
                <div className="p-6 md:p-8 flex flex-col items-center text-center space-y-6">
                  <div className="flex gap-2 w-full justify-center">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold border ${categoryColors[todayChallengeData.category] || 'bg-secondary text-foreground'}`}>
                      {todayChallengeData.category}
                    </span>
                    <span className="px-3 py-1 rounded-full text-xs font-bold border bg-secondary/50 border-border text-muted-foreground">
                      {todayChallengeData.estimatedTime}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-2xl font-bold mb-3">{todayChallengeData.title}</h3>
                    <p className="text-muted-foreground text-sm leading-relaxed max-w-[280px] mx-auto">
                      {todayChallengeData.description}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 text-yellow-500 font-bold bg-yellow-500/10 px-4 py-2 rounded-full border border-yellow-500/20">
                    <Zap className="w-5 h-5" />
                    <span>+{todayChallengeData.xp} XP</span>
                  </div>

                  <div className="w-full space-y-3 pt-4">
                    <Button 
                      size="lg" 
                      className="w-full h-14 text-lg font-bold bg-primary hover:bg-primary/90 text-primary-foreground shadow-[0_0_20px_rgba(var(--primary),0.4)]"
                      onClick={handleComplete}
                    >
                      <Check className="w-5 h-5 mr-2" />
                      Complete Quest
                    </Button>
                    <Button 
                      variant="outline" 
                      size="lg" 
                      className="w-full h-12 text-muted-foreground hover:text-foreground"
                      onClick={skipQuest}
                    >
                      <SkipForward className="w-4 h-4 mr-2" />
                      Skip / Reroll
                    </Button>
                  </div>
                </div>
              </Card>
            </motion.div>
          ) : isCompleting ? (
            <motion.div
              key="completing"
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: [1, 1.2, 1], opacity: 1 }}
              className="flex flex-col items-center justify-center space-y-4 h-64"
            >
              <div className="w-24 h-24 bg-green-500/20 rounded-full flex items-center justify-center shadow-[0_0_50px_rgba(34,197,94,0.5)]">
                <Check className="w-12 h-12 text-green-500" />
              </div>
              <h3 className="text-2xl font-bold text-green-500">Quest Completed!</h3>
            </motion.div>
          ) : (
            <motion.div
              key="completed"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center justify-center space-y-6 h-64"
            >
              <div className="w-20 h-20 bg-secondary rounded-full flex items-center justify-center border border-border">
                <Trophy className="w-10 h-10 text-yellow-500" />
              </div>
              <div className="text-center space-y-2">
                <h3 className="text-2xl font-bold">All Done for Today</h3>
                <p className="text-muted-foreground text-sm max-w-[250px] mx-auto">
                  You've completed your daily quest. Come back tomorrow for a new challenge!
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
