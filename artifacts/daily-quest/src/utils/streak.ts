import { getTodayString } from './date';

export function calculateStreak(
  currentStreak: number,
  lastActiveDate: string,
  todayStr: string = getTodayString()
): number {
  if (!lastActiveDate) return 0;
  
  const today = new Date(todayStr);
  const lastActive = new Date(lastActiveDate);
  
  // Normalize to midnight UTC for comparison
  const todayMs = Date.UTC(today.getFullYear(), today.getMonth(), today.getDate());
  const lastActiveMs = Date.UTC(lastActive.getFullYear(), lastActive.getMonth(), lastActive.getDate());
  
  const diffDays = Math.floor((todayMs - lastActiveMs) / (1000 * 60 * 60 * 24));
  
  if (diffDays === 0) {
    return currentStreak;
  } else if (diffDays === 1) {
    return currentStreak; // Continue streak (will be incremented if completed)
  } else {
    return 0; // Streak broken
  }
}
