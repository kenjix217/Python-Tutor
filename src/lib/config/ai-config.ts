/**
 * AI Configuration Loader
 * 
 * This file loads the AI provider configuration from JSON
 * and resolves API keys from environment variables at runtime.
 * 
 * IMPORTANT: API keys are NEVER stored in the JSON config files.
 * They are only referenced by name and read from process.env.
 */

import { readFileSync } from 'fs';
import { join } from 'path';

export interface AIProviderConfig {
  enabled: boolean;
  baseUrl: string;
  models: {
    chat: string;
    review: string;
    hint: string;
    generate: string;
    tts?: string;
  };
  envKeyName: string;
  maxTokens: {
    chat: number;
    review: number;
    hint: number;
    generate: number;
  };
  temperature: {
    chat: number;
    review: number;
    hint: number;
    generate: number;
  };
  rateLimits: {
    requestsPerMinute: number;
    requestsPerDay: number;
  };
}

export interface AIConfig {
  defaultProvider: string;
  fallbackOrder: string[];
  providers: Record<string, AIProviderConfig>;
  tts: {
    defaultProvider: string;
    fallback: string;
    providers: Record<string, any>;
  };
  codeExecution: {
    pistonUrl: string;
    timeoutMs: number;
    maxOutputChars: number;
    pythonVersion: string;
  };
}

let cachedConfig: AIConfig | null = null;

/**
 * Load AI configuration from JSON file
 * API keys are NOT included - they must be read from env at runtime
 */
export function loadAIConfig(): AIConfig {
  if (cachedConfig) return cachedConfig;

  const configPath = join(process.cwd(), 'config', 'ai-providers.json');
  const fileContent = readFileSync(configPath, 'utf-8');
  cachedConfig = JSON.parse(fileContent) as AIConfig;
  
  return cachedConfig;
}

/**
 * Get the API key for a specific provider from environment variables
 */
export function getProviderAPIKey(providerName: string): string | undefined {
  const config = loadAIConfig();
  const provider = config.providers[providerName];
  
  if (!provider) {
    console.warn(`Provider ${providerName} not found in config`);
    return undefined;
  }

  const envKeyName = provider.envKeyName;
  const apiKey = process.env[envKeyName];

  if (!apiKey) {
    console.warn(`API key not found in environment: ${envKeyName}`);
    return undefined;
  }

  return apiKey;
}

/**
 * Get active provider (first one with a valid API key)
 */
export function getActiveProvider(): { name: string; config: AIProviderConfig; apiKey: string } | null {
  const config = loadAIConfig();
  
  // Try providers in fallback order
  for (const providerName of config.fallbackOrder) {
    const provider = config.providers[providerName];
    if (!provider || !provider.enabled) continue;

    const apiKey = getProviderAPIKey(providerName);
    if (apiKey) {
      return { name: providerName, config: provider, apiKey };
    }
  }

  return null;
}

/**
 * Check if AI features are available (at least one provider has a key)
 */
export function isAIAvailable(): boolean {
  return getActiveProvider() !== null;
}

/**
 * Get AI config for a specific task
 */
export function getAITaskConfig(task: 'chat' | 'review' | 'hint' | 'generate') {
  const provider = getActiveProvider();
  if (!provider) throw new Error('No AI provider available');

  return {
    provider: provider.name,
    apiKey: provider.apiKey,
    baseUrl: provider.config.baseUrl,
    model: provider.config.models[task],
    maxTokens: provider.config.maxTokens[task],
    temperature: provider.config.temperature[task],
  };
}
