export interface Level {
  name: string;
  minXP: number;
  badge: string;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  condition: AchievementCondition;
  xpBonus: number;
}

export interface AchievementCondition {
  type: string;
  lessonId?: string;
  level?: string;
  count?: number;
  days?: number;
}

export interface GamificationConfig {
  xp: {
    lessonComplete: number;
    homeworkPass: number;
    homeworkFirstTry: number;
    dailyStreak: number;
    codeReviewRequested: number;
    achievementUnlock: number;
  };
  levels: Level[];
  achievements: Achievement[];
  streaks: {
    resetHourUTC: number;
    graceHours: number;
    freezesPerMonth: number;
  };
}
