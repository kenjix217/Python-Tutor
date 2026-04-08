/**
 * Configuration Loader
 * 
 * All configuration is stored in JSON files in the config/ directory.
 * These files contain structural configuration only (no secrets).
 * 
 * Secrets are read from environment variables at runtime.
 */

import { readFileSync } from 'fs';
import { join } from 'path';

// Type imports
import type { LessonsConfig } from '@/types/lesson';
import type { GamificationConfig } from '@/types/gamification';

// Cache for loaded configs
const configCache: Map<string, any> = new Map();

/**
 * Generic config loader
 */
function loadConfig<T>(filename: string): T {
  if (configCache.has(filename)) {
    return configCache.get(filename) as T;
  }

  const configPath = join(process.cwd(), 'config', filename);
  const fileContent = readFileSync(configPath, 'utf-8');
  const config = JSON.parse(fileContent) as T;
  
  configCache.set(filename, config);
  return config;
}

// Export typed config loaders
export const loadLessonsConfig = () => loadConfig<LessonsConfig>('lessons.json');
export const loadFeaturesConfig = () => loadConfig<Record<string, boolean>>('features.json');
export const loadGamificationConfig = () => loadConfig<GamificationConfig>('gamification.json');
export const loadHomeworkConfig = () => loadConfig<Record<string, any>>('homework.json');
export const loadCurriculumConfig = () => loadConfig<Record<string, any>>('curriculum.json');
export const loadPromptsConfig = () => loadConfig<Record<string, any>>('prompts.json');

// Re-export AI config
export * from './ai-config';

/**
 * Clear config cache (useful for hot reloading in development)
 */
export function clearConfigCache() {
  configCache.clear();
}
