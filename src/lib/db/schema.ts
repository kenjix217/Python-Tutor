import { pgTable, uuid, text, timestamp, boolean, integer, float, jsonb, uniqueIndex } from 'drizzle-orm/pg-core';

// Users table
export const users = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  email: text('email').unique(),
  name: text('name'),
  image: text('image'),
  isAnonymous: boolean('is_anonymous').notNull().default(false),
  totalXP: integer('total_xp').notNull().default(0),
  currentLevel: text('current_level').notNull().default('Novice'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  lastActiveAt: timestamp('last_active_at').notNull().defaultNow(),
});

// Progress table
export const progress = pgTable('progress', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').notNull().references(() => users.id),
  lessonId: text('lesson_id').notNull(),
  status: text('status').notNull().default('not_started'), // not_started, in_progress, completed
  attempts: integer('attempts').notNull().default(0),
  hintsUsed: integer('hints_used').notNull().default(0),
  timeSpentSeconds: integer('time_spent_seconds').notNull().default(0),
  homeworkCode: text('homework_code'),
  homeworkPassed: boolean('homework_passed').default(false),
  completedAt: timestamp('completed_at'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
}, (table) => ({
  userLessonIdx: uniqueIndex('user_lesson_idx').on(table.userId, table.lessonId),
}));

// Skill scores table
export const skillScores = pgTable('skill_scores', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').notNull().references(() => users.id),
  skill: text('skill').notNull(),
  score: float('score').notNull().default(0),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
}, (table) => ({
  userSkillIdx: uniqueIndex('user_skill_idx').on(table.userId, table.skill),
}));

// AI conversations table
export const aiConversations = pgTable('ai_conversations', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').notNull().references(() => users.id),
  lessonId: text('lesson_id'),
  type: text('type').notNull(), // chat, review, hint
  messages: jsonb('messages').notNull().default([]),
  tokenCount: integer('token_count').notNull().default(0),
  provider: text('provider'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
});

// Achievements table
export const achievements = pgTable('achievements', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').notNull().references(() => users.id),
  achievementId: text('achievement_id').notNull(),
  unlockedAt: timestamp('unlocked_at').notNull().defaultNow(),
}, (table) => ({
  userAchievementIdx: uniqueIndex('user_achievement_idx').on(table.userId, table.achievementId),
}));

// Streaks table
export const streaks = pgTable('streaks', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').notNull().references(() => users.id).unique(),
  currentStreak: integer('current_streak').notNull().default(0),
  longestStreak: integer('longest_streak').notNull().default(0),
  lastActiveDate: timestamp('last_active_date').notNull().defaultNow(),
});

// Rate limits table
export const rateLimits = pgTable('rate_limits', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').notNull().references(() => users.id),
  endpoint: text('endpoint').notNull(),
  requestCount: integer('request_count').notNull().default(0),
  windowStart: timestamp('window_start').notNull().defaultNow(),
}, (table) => ({
  userEndpointIdx: uniqueIndex('user_endpoint_idx').on(table.userId, table.endpoint),
}));

// Type exports
export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type Progress = typeof progress.$inferSelect;
export type NewProgress = typeof progress.$inferInsert;
export type SkillScore = typeof skillScores.$inferSelect;
export type AISession = typeof aiConversations.$inferSelect;
export type Achievement = typeof achievements.$inferSelect;
export type Streak = typeof streaks.$inferSelect;
export type RateLimit = typeof rateLimits.$inferSelect;
