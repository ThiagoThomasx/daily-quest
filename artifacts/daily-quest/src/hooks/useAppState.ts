import { useState, useEffect, useCallback } from 'react';
import { AppState, ChallengeStatus, QuestPreferences } from '../types';
import { challenges } from '../data/challenges';
import { getTodayString } from '../utils/date';
import { calculateStreak } from '../utils/streak';
import { playSound, triggerHaptic } from '../utils/audio';
import { selectChallengeByPreferences } from '../utils/questSelector';

const STORAGE_KEY = 'daily-quest-state';

export const defaultPreferences: QuestPreferences = {
  preferredCategories: [],
  blockedCategories: [],
  preferredDifficulty: 'Any',
  energyMode: 'Balanced',
};

const defaultState: AppState = {
  totalXP: 0,
  currentStreak: 0,
  bestStreak: 0,
  lastActiveDate: '',
  completedDates: [],
  history: [],
  today: null,
  settings: { sound: true, haptic: true },
  preferences: defaultPreferences,
};

function mergeWithDefaults(raw: Partial<AppState>): AppState {
  return {
    ...defaultState,
    ...raw,
    settings: { ...defaultState.settings, ...(raw.settings ?? {}) },
    preferences: { ...defaultPreferences, ...(raw.preferences ?? {}) },
  };
}

export function useAppState() {
  const [state, setState] = useState<AppState>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) return mergeWithDefaults(JSON.parse(stored));
    } catch {
      // corrupted — start fresh
    }
    return defaultState;
  });

  const saveState = useCallback((newState: AppState) => {
    setState(newState);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newState));
    } catch {
      // storage full or unavailable — no-op
    }
  }, []);

  const pickChallenge = useCallback(
    (excludeIds: string[], prefs: QuestPreferences) =>
      selectChallengeByPreferences(prefs, excludeIds, challenges),
    [],
  );

  // On mount / day change — initialise or refresh today's challenge
  useEffect(() => {
    const todayStr = getTodayString();
    let updated = false;
    const newState = { ...state };

    // Streak maintenance
    const newStreak = calculateStreak(newState.currentStreak, newState.lastActiveDate, todayStr);
    if (newStreak !== newState.currentStreak) {
      newState.currentStreak = newStreak;
      updated = true;
    }

    if (newState.lastActiveDate !== todayStr) {
      newState.lastActiveDate = todayStr;
      updated = true;
    }

    // New day — generate a fresh challenge
    if (!newState.today || newState.today.dateGenerated !== todayStr) {
      if (newState.today && newState.today.status === 'active') {
        // Yesterday's uncompleted quest → mark skipped in history
        const missedChallenge = challenges.find(c => c.id === newState.today!.challengeId);
        if (missedChallenge) {
          newState.history = [
            { ...newState.today, status: 'skipped', challenge: missedChallenge },
            ...newState.history,
          ];
        }
      }

      const recentIds = newState.history.slice(0, 7).map(h => h.challengeId);
      const next = pickChallenge(recentIds, newState.preferences);
      newState.today = { challengeId: next.id, status: 'active', dateGenerated: todayStr };
      updated = true;
    }

    if (updated) saveState(newState);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.lastActiveDate, state.today?.dateGenerated, saveState, pickChallenge]);

  const completeQuest = useCallback(() => {
    if (!state.today || state.today.status !== 'active') return;

    if (state.settings.sound) playSound('complete');
    if (state.settings.haptic) triggerHaptic('complete');

    const todayStr = getTodayString();
    const challenge = challenges.find(c => c.id === state.today!.challengeId);
    if (!challenge) return;

    const newStreak = state.currentStreak + 1;

    saveState({
      ...state,
      totalXP: state.totalXP + challenge.xp,
      currentStreak: newStreak,
      bestStreak: Math.max(state.bestStreak, newStreak),
      completedDates: [...new Set([...state.completedDates, todayStr])],
      history: [
        { ...state.today, status: 'completed' as ChallengeStatus, dateCompleted: todayStr, challenge },
        ...state.history,
      ],
      today: { ...state.today, status: 'completed', dateCompleted: todayStr },
    });
  }, [state, saveState]);

  const skipQuest = useCallback(() => {
    if (!state.today || state.today.status !== 'active') return;

    if (state.settings.sound) playSound('skip');
    if (state.settings.haptic) triggerHaptic('skip');

    const challenge = challenges.find(c => c.id === state.today!.challengeId);
    if (!challenge) return;

    // Exclude recent IDs + the current one so we never re-serve it immediately
    const recentIds = state.history.slice(0, 7).map(h => h.challengeId);
    const excludeIds = [...new Set([...recentIds, challenge.id])];
    const next = pickChallenge(excludeIds, state.preferences);

    saveState({
      ...state,
      history: [
        { ...state.today, status: 'skipped' as ChallengeStatus, challenge },
        ...state.history,
      ],
      today: { challengeId: next.id, status: 'active', dateGenerated: getTodayString() },
    });
  }, [state, saveState, pickChallenge]);

  const updateSettings = useCallback(
    (settings: AppState['settings']) => saveState({ ...state, settings }),
    [state, saveState],
  );

  const updatePreferences = useCallback(
    (preferences: QuestPreferences) => saveState({ ...state, preferences }),
    [state, saveState],
  );

  const importState = useCallback(
    (imported: Partial<AppState>): boolean => {
      if (typeof imported.totalXP === 'number' && Array.isArray(imported.history)) {
        saveState(mergeWithDefaults(imported));
        return true;
      }
      return false;
    },
    [saveState],
  );

  const resetState = useCallback(() => saveState(defaultState), [saveState]);

  return {
    state,
    completeQuest,
    skipQuest,
    updateSettings,
    updatePreferences,
    importState,
    resetState,
  };
}
