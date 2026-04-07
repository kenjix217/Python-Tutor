export interface Lesson {
  id: string;
  level: LessonLevel;
  number: number;
  title: string;
  description: string;
  file: string;
  prerequisites: string[];
  skills: string[];
  executionMode: 'pyodide' | 'server' | 'hybrid';
  estimatedMinutes: number;
  xpReward: number;
}

export interface Level {
  id: LessonLevel;
  name: string;
  description: string;
  color: string;
}

export type LessonLevel = 'beginner' | 'intermediate' | 'advanced' | 'expert';

export interface LessonsConfig {
  levels: Level[];
  lessons: Lesson[];
}

export interface Homework {
  title: string;
  description: string;
  validationMode: 'static' | 'execution' | 'hybrid';
  staticChecks: StaticCheck[];
  executionChecks: ExecutionCheck[];
  aiReviewEnabled: boolean;
  hints: string[];
  maxHints: number;
}

export interface StaticCheck {
  type: string;
  function?: string;
  minCount?: number;
  min?: number;
  keyword?: string;
  pattern?: string;
  failMessage: string;
}

export interface ExecutionCheck {
  type: string;
  value?: string;
  failMessage?: string;
}
