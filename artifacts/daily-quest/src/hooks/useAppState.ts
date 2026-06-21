import { useState, useEffect, useCallback } from 'react';
import { AppState, ChallengeStatus, DailyChallenge } from '../types';
import { challenges } from '../data/challenges';
import { getTodayString } from '../utils/date';
import { calculateStreak } from '../utils/streak';
import { playSound, triggerHaptic } from '../utils/audio';

const STORAGE_KEY = 'daily-quest-state';

const defaultState: AppState = {
  totalXP: 0,
  currentStreak: 0,
  bestStreak: 0,
  lastActiveDate: '',
  completedDates: [],
  history: [],
  today: null,
  settings: {
    sound: true,
    haptic: true
  }
};

export function useAppState() {
  const [state, setState] = useState<AppState>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.error('Failed to parse stored state', e);
    }
    return defaultState;
  });

  const saveState = useCallback((newState: AppState) => {
    setState(newState);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newState));
    } catch (e) {
      console.error('Failed to save state', e);
    }
  }, []);

  const getRandomChallenge = useCallback((excludeIds: string[]) => {
    const available = challenges.filter(c => !excludeIds.includes(c.id));
    if (available.length === 0) {
      // If all used, pick from all
      return challenges[Math.floor(Math.random() * challenges.length)];
    }
    return available[Math.floor(Math.random() * available.length)];
  }, []);

  // Initialize or update today's state
  useEffect(() => {
    const todayStr = getTodayString();
    let updated = false;
    let newState = { ...state };

    // Update streak based on last active date
    const newStreak = calculateStreak(newState.currentStreak, newState.lastActiveDate, todayStr);
    if (newStreak !== newState.currentStreak) {
      newState.currentStreak = newStreak;
      updated = true;
    }

    // Update last active date
    if (newState.lastActiveDate !== todayStr) {
      newState.lastActiveDate = todayStr;
      updated = true;
    }

    // Check if we need a new challenge for today
    if (!newState.today || newState.today.dateGenerated !== todayStr) {
      if (newState.today && newState.today.status === 'active') {
        // Mark yesterday's uncompleted challenge as skipped
        newState.history = [
          { ...newState.today, status: 'skipped', challenge: challenges.find(c => c.id === newState.today!.challengeId)! },
          ...newState.history
        ];
      }

      const recentIds = newState.history.slice(0, 7).map(h => h.challengeId);
      const newChallenge = getRandomChallenge(recentIds);
      
      newState.today = {
        challengeId: newChallenge.id,
        status: 'active',
        dateGenerated: todayStr
      };
      updated = true;
    }

    if (updated) {
      saveState(newState);
    }
  }, [state.lastActiveDate, state.today, saveState, getRandomChallenge]);

  const completeQuest = useCallback(() => {
    if (!state.today || state.today.status !== 'active') return;

    if (state.settings.sound) playSound('complete');
    if (state.settings.haptic) triggerHaptic('complete');

    const todayStr = getTodayString();
    const challenge = challenges.find(c => c.id === state.today!.challengeId)!;
    
    const newStreak = state.currentStreak + 1;
    const bestStreak = Math.max(state.bestStreak, newStreak);
    
    const completedChallenge = {
      ...state.today,
      status: 'completed' as ChallengeStatus,
      dateCompleted: todayStr,
      challenge
    };

    saveState({
      ...state,
      totalXP: state.totalXP + challenge.xp,
      currentStreak: newStreak,
      bestStreak: bestStreak,
      completedDates: [...new Set([...state.completedDates, todayStr])],
      history: [completedChallenge, ...state.history],
      today: { ...state.today, status: 'completed', dateCompleted: todayStr }
    });
  }, [state, saveState]);

  const skipQuest = useCallback(() => {
    if (!state.today || state.today.status !== 'active') return;

    if (state.settings.sound) playSound('skip');
    if (state.settings.haptic) triggerHaptic('skip');

    const challenge = challenges.find(c => c.id === state.today!.challengeId)!;
    const skippedChallenge = {
      ...state.today,
      status: 'skipped' as ChallengeStatus,
      challenge
    };

    const recentIds = state.history.slice(0, 7).map(h => h.challengeId);
    const newChallenge = getRandomChallenge([...recentIds, challenge.id]);
    
    saveState({
      ...state,
      history: [skippedChallenge, ...state.history],
      today: {
        challengeId: newChallenge.id,
        status: 'active',
        dateGenerated: getTodayString()
      }
    });
  }, [state, saveState, getRandomChallenge]);

  const updateSettings = useCallback((settings: AppState['settings']) => {
    saveState({ ...state, settings });
  }, [state, saveState]);

  const importState = useCallback((importedState: AppState) => {
    // Basic validation
    if (typeof importedState.totalXP === 'number' && Array.isArray(importedState.history)) {
      saveState(importedState);
      return true;
    }
    return false;
  }, [saveState]);

  const resetState = useCallback(() => {
    saveState(defaultState);
  }, [saveState]);

  return {
    state,
    completeQuest,
    skipQuest,
    updateSettings,
    importState,
    resetState
  };
}
