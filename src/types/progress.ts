export interface UserProgress {
  userId: string;
  lessonId: string;
  status: 'not_started' | 'in_progress' | 'completed';
  attempts: number;
  hintsUsed: number;
  timeSpentSeconds: number;
  homeworkCode: string | null;
  homeworkPassed: boolean;
  completedAt: Date | null;
}

export interface SkillScore {
  userId: string;
  skill: string;
  score: number;
  updatedAt: Date;
}

export interface LearningStats {
  lessonsCompleted: number;
  totalLessons: number;
  completionPercentage: number;
  currentStreak: number;
  longestStreak: number;
  totalXP: number;
  currentLevel: string;
}
