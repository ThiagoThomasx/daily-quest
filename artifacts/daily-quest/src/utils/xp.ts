export function getLevel(xp: number): number {
  if (xp >= 5000) return 10;
  if (xp >= 3700) return 9;
  if (xp >= 2800) return 8;
  if (xp >= 2000) return 7;
  if (xp >= 1400) return 6;
  if (xp >= 900) return 5;
  if (xp >= 500) return 4;
  if (xp >= 250) return 3;
  if (xp >= 100) return 2;
  return 1;
}

export function getXPForNextLevel(level: number): number {
  switch (level) {
    case 1: return 100;
    case 2: return 250;
    case 3: return 500;
    case 4: return 900;
    case 5: return 1400;
    case 6: return 2000;
    case 7: return 2800;
    case 8: return 3700;
    case 9: return 5000;
    default: return 5000;
  }
}

export function getXPForCurrentLevel(level: number): number {
  switch (level) {
    case 1: return 0;
    case 2: return 100;
    case 3: return 250;
    case 4: return 500;
    case 5: return 900;
    case 6: return 1400;
    case 7: return 2000;
    case 8: return 2800;
    case 9: return 3700;
    default: return 5000;
  }
}

export function getLevelProgress(xp: number): number {
  const currentLevel = getLevel(xp);
  if (currentLevel === 10) return 100;
  
  const currentLevelXP = getXPForCurrentLevel(currentLevel);
  const nextLevelXP = getXPForNextLevel(currentLevel);
  
  const xpInCurrentLevel = xp - currentLevelXP;
  const xpNeededForNext = nextLevelXP - currentLevelXP;
  
  return Math.min(100, Math.max(0, (xpInCurrentLevel / xpNeededForNext) * 100));
}
