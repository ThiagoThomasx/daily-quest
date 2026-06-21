export type Category = 'Productivity' | 'Learning' | 'Health' | 'Creativity' | 'Social' | 'Career' | 'Reflection' | 'Fun';
export type Difficulty = 'Easy' | 'Medium' | 'Hard';
export type ChallengeStatus = 'active' | 'completed' | 'skipped';
export type PreferredDifficulty = 'Any' | 'Easy' | 'Medium' | 'Hard';
export type EnergyMode = 'Low Energy' | 'Balanced' | 'High Energy';

export interface Challenge {
  id: string;
  title: string;
  description: string;
  category: Category;
  difficulty: Difficulty;
  xp: number; // Easy=10, Medium=25, Hard=50
  estimatedTime: string; // e.g. "5 min"
}

export interface DailyChallenge {
  challengeId: string;
  status: ChallengeStatus;
  dateGenerated: string; // YYYY-MM-DD
  dateCompleted?: string;
}

export interface QuestPreferences {
  preferredCategories: Category[];
  blockedCategories: Category[];
  preferredDifficulty: PreferredDifficulty;
  energyMode: EnergyMode;
}

export interface AppState {
  totalXP: number;
  currentStreak: number;
  bestStreak: number;
  lastActiveDate: string; // YYYY-MM-DD
  completedDates: string[]; // YYYY-MM-DD
  history: (DailyChallenge & { challenge: Challenge })[];
  today: DailyChallenge | null;
  settings: {
    sound: boolean;
    haptic: boolean;
  };
  preferences: QuestPreferences;
}
