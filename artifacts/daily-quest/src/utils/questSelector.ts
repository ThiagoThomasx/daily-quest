import { Challenge, Category, Difficulty, QuestPreferences } from '../types';

const ENERGY_DIFFICULTIES: Record<string, Difficulty[]> = {
  'Low Energy': ['Easy'],
  'Balanced':   ['Easy', 'Medium'],
  'High Energy':['Medium', 'Hard'],
};

/**
 * Select a challenge from the pool using user preferences.
 * Priority order:
 *   1. Exclude blocked categories
 *   2. Exclude recently-used IDs
 *   3. Apply preferred difficulty (if set) OR energy mode
 *   4. Prioritise preferred categories (if set)
 *   5. Fallback gracefully at each step so we always return something
 */
export function selectChallengeByPreferences(
  preferences: QuestPreferences,
  excludeIds: string[],
  pool: Challenge[],
): Challenge {
  const { preferredCategories, blockedCategories, preferredDifficulty, energyMode } = preferences;

  // Step 1 — remove excluded IDs
  let candidates = pool.filter(c => !excludeIds.includes(c.id));
  if (candidates.length === 0) candidates = [...pool]; // all recent — reset exclusion

  // Step 2 — remove blocked categories (only if it won't empty the pool)
  if (blockedCategories.length > 0) {
    const unblocked = candidates.filter(c => !blockedCategories.includes(c.category));
    if (unblocked.length > 0) candidates = unblocked;
    // else: all categories are blocked — ignore block list silently
  }

  // Step 3 — apply difficulty filter
  let diffFiltered = candidates;
  if (preferredDifficulty !== 'Any') {
    // Explicit difficulty wins
    const byDiff = candidates.filter(c => c.difficulty === preferredDifficulty);
    if (byDiff.length > 0) diffFiltered = byDiff;
    // else: fallback to full candidate pool (no matching difficulty after other filters)
  } else {
    // Energy mode
    const allowed = ENERGY_DIFFICULTIES[energyMode] ?? (['Easy', 'Medium', 'Hard'] as Difficulty[]);
    const byEnergy = candidates.filter(c => (allowed as string[]).includes(c.difficulty));
    if (byEnergy.length > 0) diffFiltered = byEnergy;
  }

  // Step 4 — prioritise preferred categories
  if (preferredCategories.length > 0) {
    const preferred = diffFiltered.filter(c => preferredCategories.includes(c.category as Category));
    if (preferred.length > 0) {
      return preferred[Math.floor(Math.random() * preferred.length)];
    }
    // Preferred categories not available after difficulty filter — try without difficulty
    const preferredAny = candidates.filter(c => preferredCategories.includes(c.category as Category));
    if (preferredAny.length > 0) {
      return preferredAny[Math.floor(Math.random() * preferredAny.length)];
    }
  }

  // Step 5 — pick from difficulty-filtered pool
  if (diffFiltered.length > 0) {
    return diffFiltered[Math.floor(Math.random() * diffFiltered.length)];
  }

  // Final fallback — anything
  return pool[Math.floor(Math.random() * pool.length)];
}

/** Human-readable summary of active preferences for the UI */
export function getPreferenceSummary(preferences: QuestPreferences): string | null {
  const { preferredCategories, preferredDifficulty, energyMode } = preferences;
  const parts: string[] = [];

  if (preferredCategories.length > 0) {
    parts.push(preferredCategories.slice(0, 3).join(' · '));
  }

  if (preferredDifficulty !== 'Any') {
    parts.push(preferredDifficulty);
  } else if (energyMode !== 'Balanced') {
    parts.push(energyMode);
  }

  if (parts.length === 0) return null;
  return parts.join(' · ');
}
