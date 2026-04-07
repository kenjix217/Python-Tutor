# AGENTS.md -- Python Learner v2 Development Rules

**Version:** 2.0.0
**Last Updated:** April 5, 2026
**Applies To:** All AI agents (Cursor, Copilot, Codex) and human contributors

---

## 1. Project Identity

This is **Python Learner v2** -- an AI-native interactive Python learning platform for ages 14-17. Built with Next.js 15 (App Router), TypeScript (strict), Tailwind CSS 4, shadcn/ui, Vercel Postgres, and Drizzle ORM. AI is integrated by default using server-managed multi-provider keys. Deployed on Vercel.

**Primary goal:** Teach Python from beginner to expert through interactive, AI-assisted lessons with adaptive learning paths, gamification, and hybrid code execution.

---

## 2. Cardinal Rules

These rules override all other instructions. Never violate them.

1. **NEVER hardcode values.** Every behavior, label, threshold, prompt, lesson reference, XP amount, feature toggle, and provider config MUST come from a JSON config file in `config/`. If a value does not exist in config, add it to the appropriate config file first, then reference it.

2. **NEVER expose secrets to the client.** API keys live in `.env.local` only. The JSON config references keys by `envKeyName` (e.g., `"envKeyName": "OPENAI_API_KEY"`). Server-side code reads from `process.env[envKeyName]`. Client components never import config files that contain `envKeyName` fields.

3. **NEVER solve homework for the student.** AI tutor prompts must guide, hint, and ask questions. Never provide complete solutions. This applies to system prompts in `config/prompts.json`, AI chat responses, hint generation, and code review feedback.

4. **NEVER skip type safety.** TypeScript strict mode is mandatory. Every function parameter, return type, prop, and API response must be typed. Use Zod for runtime validation of all external inputs (API requests, config files, URL params).

5. **NEVER create a file without understanding where it belongs.** Follow the project structure defined in `ARCHITECTURE.md` Section 4 exactly. Do not invent new directories or put files in wrong locations.

---

## 3. Technology Constraints

### 3.1 Required Stack

| Concern | Technology | Version |
|---------|-----------|---------|
| Framework | Next.js (App Router) | 15.x |
| Language | TypeScript | 5.x, strict mode |
| Styling | Tailwind CSS + shadcn/ui | 4.x |
| Client State | Zustand | 5.x |
| Server State | TanStack Query | 5.x |
| Code Editor | @monaco-editor/react | latest |
| Markdown | MDX + next-mdx-remote | latest |
| Python (browser) | Pyodide | 0.27+ |
| Python (server) | Piston API | latest |
| Database | Vercel Postgres (Neon) | managed |
| ORM | Drizzle ORM | latest |
| Auth | NextAuth.js v5 (Auth.js) | 5.x |
| AI SDK | Vercel AI SDK | 4.x |
| Validation | Zod | 3.x |
| Testing | Vitest + Playwright | latest |

### 3.2 Forbidden Patterns

- Do NOT use `any` type. Use `unknown` and narrow with type guards.
- Do NOT use `require()`. Use ES module `import` only.
- Do NOT use `var`. Use `const` by default, `let` only when reassignment is necessary.
- Do NOT use `class` components. Use function components with hooks only.
- Do NOT use `useEffect` for data fetching. Use TanStack Query or Server Components.
- Do NOT use `localStorage` for primary data storage. Use Vercel Postgres via API routes. localStorage is only for ephemeral UI preferences (theme, editor settings).
- Do NOT use inline styles. Use Tailwind utility classes or CSS modules.
- Do NOT install dependencies without checking if shadcn/ui, Vercel AI SDK, or an existing lib already covers the need.
- Do NOT use `console.log` in production code. Use a structured logger or remove before commit.
- Do NOT use string concatenation for SQL. Use Drizzle ORM query builder exclusively.

---

## 4. File and Directory Conventions

### 4.1 Naming Rules

| Type | Convention | Example |
|------|-----------|---------|
| Directories | kebab-case | `ai-tutor/`, `code-editor/` |
| React components | PascalCase.tsx | `LessonViewer.tsx`, `AIChatPanel.tsx` |
| Hooks | camelCase prefixed with `use` | `useAI.ts`, `usePyodide.ts` |
| Utilities / lib | kebab-case.ts | `provider-registry.ts`, `rate-limiter.ts` |
| Zustand stores | kebab-case suffixed with `-store` | `lesson-store.ts`, `editor-store.ts` |
| Types | kebab-case.ts | `lesson.ts`, `progress.ts` |
| API routes | `route.ts` inside descriptive folder | `api/ai/chat/route.ts` |
| Config files | kebab-case.json | `ai-providers.json`, `features.json` |
| Lesson content | number-slug.mdx | `01-what-is-programming.mdx` |
| Test files | co-located with `.test.ts` suffix | `provider-registry.test.ts` |
| Environment | `.env.local` (never committed) | `OPENAI_API_KEY=sk-...` |

### 4.2 Import Order

Enforce this order in every file, separated by blank lines:

```typescript
// 1. React / Next.js
import { useState } from 'react';
import { useRouter } from 'next/navigation';

// 2. Third-party libraries
import { z } from 'zod';
import { useQuery } from '@tanstack/react-query';

// 3. Internal libraries (lib/, stores/, hooks/)
import { getAIProvider } from '@/lib/ai/provider-registry';
import { useLessonStore } from '@/stores/lesson-store';

// 4. Components
import { Button } from '@/components/ui/button';
import { CodeEditor } from '@/components/editor/CodeEditor';

// 5. Types (type-only imports)
import type { Lesson, LessonLevel } from '@/types/lesson';

// 6. Config (server-side only, never in client components)
import config from '@/config/features.json';
```

### 4.3 Path Aliases

Use the `@/` alias for all internal imports. Never use relative paths that traverse more than one level up.

```typescript
// Good
import { Button } from '@/components/ui/button';

// Bad
import { Button } from '../../../components/ui/button';
```

---

## 5. Component Patterns

### 5.1 Component Structure

Every React component file follows this structure:

```typescript
// Imports (ordered per Section 4.2)

// Types for this component's props
interface LessonViewerProps {
  lessonId: string;
  onComplete: (lessonId: string) => void;
}

// Component
export function LessonViewer({ lessonId, onComplete }: LessonViewerProps) {
  // 1. Hooks (state, refs, queries, stores)
  // 2. Derived values / computed state
  // 3. Event handlers (prefixed with "handle")
  // 4. Effects (only if absolutely necessary)
  // 5. Return JSX
}
```

### 5.2 Server vs Client Components

**Default to Server Components.** Only add `'use client'` when the component needs:
- Event handlers (onClick, onChange, onSubmit)
- Browser APIs (window, document, localStorage)
- React hooks (useState, useEffect, useRef)
- Third-party client libraries (Monaco, Pyodide)

**Data fetching happens in Server Components or API routes.** Client components receive data via props or TanStack Query.

### 5.3 Component Size Limits

- A component file should not exceed 200 lines. If it does, extract sub-components or hooks.
- A single function should not exceed 40 lines. Extract helpers.
- JSX return should not exceed 80 lines. Extract sections into named sub-components within the same file or separate files.

### 5.4 Props

- Use `interface` (not `type`) for component props.
- Name prop interfaces as `{ComponentName}Props`.
- Destructure props in the function signature, never access `props.x`.
- Use children sparingly. Prefer explicit named props for composition.

---

## 6. Config-Driven Development

### 6.1 Config File Locations

All configuration lives in `config/` at the project root:

| File | Purpose | Who reads it |
|------|---------|-------------|
| `ai-providers.json` | AI provider settings, models, rate limits, fallback order | Server only (contains `envKeyName`) |
| `lessons.json` | Lesson registry: IDs, titles, order, prerequisites, skills, XP | Server + Client (safe) |
| `curriculum.json` | Learning paths, skill trees, level gates | Server + Client (safe) |
| `gamification.json` | XP rules, level thresholds, achievements, streak config | Server + Client (safe) |
| `homework.json` | Homework definitions, validation rules, hints per lesson | Server + Client (safe) |
| `features.json` | Feature flags for every toggleable feature | Server + Client (safe) |
| `prompts.json` | AI system prompts for tutor, reviewer, hint-giver | Server only (teaching logic) |

### 6.2 Config Loading Pattern

```typescript
// Server-side: import directly
import aiProviders from '@/config/ai-providers.json';
const key = process.env[aiProviders.providers.openai.envKeyName];

// Client-side: expose safe config via API or Server Component props
// NEVER import ai-providers.json on the client
import features from '@/config/features.json'; // safe, no secrets
import lessons from '@/config/lessons.json';    // safe, no secrets
```

### 6.3 Config Validation

Every config file has a corresponding Zod schema in `src/lib/config/types.ts`. On application startup (in a server-side layout or middleware), validate all configs:

```typescript
import { aiProvidersSchema } from '@/lib/config/types';
import aiProviders from '@/config/ai-providers.json';

const validated = aiProvidersSchema.parse(aiProviders);
// Throws ZodError with clear message if config is malformed
```

### 6.4 Adding New Config Values

When you need a new configurable value:

1. Add the field to the appropriate JSON config file with a sensible default.
2. Add the field to the corresponding Zod schema in `src/lib/config/types.ts`.
3. Update the TypeScript type that is inferred from the schema.
4. Reference the config value in your code. Never use a literal.

---

## 7. AI Integration Rules

### 7.1 Provider Registry

All AI calls go through `src/lib/ai/provider-registry.ts`. Never call an AI provider directly from a route handler or component. The registry handles:

- Reading provider config from `ai-providers.json`
- Resolving the API key from `process.env`
- Selecting the correct model for the task type (chat, review, hint, tts)
- Falling back to the next provider in `fallbackOrder` on failure
- Enforcing per-user rate limits
- Logging token usage for cost tracking

### 7.2 AI Route Pattern

Every AI API route follows this structure:

```typescript
// src/app/api/ai/chat/route.ts
import { streamText } from 'ai';
import { getAIProvider } from '@/lib/ai/provider-registry';
import { checkRateLimit } from '@/lib/ai/rate-limiter';
import { getSystemPrompt } from '@/lib/ai/prompts';
import { chatRequestSchema } from '@/lib/ai/schemas';
import { auth } from '@/lib/auth/auth';

export async function POST(request: Request) {
  // 1. Authenticate
  const session = await auth();

  // 2. Validate input with Zod
  const body = chatRequestSchema.parse(await request.json());

  // 3. Check rate limit
  await checkRateLimit(session.user.id, 'chat');

  // 4. Get provider (handles fallback automatically)
  const { model, provider } = await getAIProvider('chat');

  // 5. Load system prompt from config
  const systemPrompt = getSystemPrompt('tutor', {
    lessonId: body.lessonId,
    studentContext: body.context,
  });

  // 6. Stream response
  const result = streamText({
    model,
    system: systemPrompt,
    messages: body.messages,
  });

  return result.toDataStreamResponse();
}
```

### 7.3 AI Prompt Rules

All system prompts live in `config/prompts.json`. They are templates with `{{variable}}` placeholders filled at runtime. Prompts must:

- Never instruct the AI to provide complete homework solutions.
- Always include the student's current lesson context.
- Specify the response format (plain text for chat, structured JSON for code review).
- Include a persona appropriate for 14-17 year old students (encouraging but not condescending).
- Set boundaries: the AI discusses Python learning only, redirects off-topic questions.

### 7.4 Graceful Degradation

If all AI providers fail:
- AI Chat: Show a message "AI tutor is temporarily unavailable. Continue with the lesson -- you can do this!"
- Code Review: Fall back to static pattern-based validation from `homework.json`.
- Hints: Serve the static hints array from `homework.json` config.
- TTS: Fall back to browser Web Speech API.
- Adaptive Learning: Continue with the default linear lesson order from `lessons.json`.

Never crash the app or block the student's learning path because of an AI failure.

---

## 8. Database Rules

### 8.1 Schema Location

All database schema definitions live in `src/lib/db/schema.ts` using Drizzle ORM. Migrations live in `src/lib/db/migrations/`.

### 8.2 Query Patterns

- All database queries go through Drizzle ORM. Never write raw SQL strings.
- Database calls happen in API routes or Server Components only. Never in client components.
- Use transactions for operations that modify multiple tables.
- Always handle the case where a user has no data yet (new user, first visit).

### 8.3 Data Ownership

Every table with user data includes a `userId` foreign key. API routes must verify that the authenticated user owns the data they are requesting or modifying. Never return another user's data.

---

## 9. Code Execution Rules

### 9.1 Hybrid Execution Model

The execution mode is determined by the lesson's `executionMode` field in `lessons.json`:

| Mode | When | Where | Runtime |
|------|------|-------|---------|
| `pyodide` | Lessons 1-10 (beginner/intermediate) | Browser | Pyodide WASM |
| `server` | Lessons 11-22 (advanced/expert) | Vercel serverless | Piston API |
| `hybrid` | AI Code Review (any lesson) | Server for execution, browser for display | Piston API |

### 9.2 Pyodide Rules (Browser)

- Lazy-load Pyodide only when the user opens a lesson or the practice editor.
- Show a loading indicator during initial WASM download.
- Capture stdout/stderr by redirecting `sys.stdout` and `sys.stderr`.
- Set a 10-second execution timeout. Kill and show a timeout message if exceeded.
- Never execute code that imports `os`, `sys.exit`, `subprocess`, or `socket` (sanitize before execution).
- Cache the Pyodide instance across lesson navigation. Do not reload on every page change.

### 9.3 Server Execution Rules (Piston)

- All server execution requests require authentication.
- Set a 15-second timeout per execution.
- Limit output to 10,000 characters. Truncate with a message if exceeded.
- Log execution requests for abuse monitoring.
- The Piston endpoint URL is configured in `ai-providers.json` under a `codeExecution` section (not hardcoded).

---

## 10. Styling and UI Rules

### 10.1 Design System

- Use shadcn/ui components as the base. Do not build custom buttons, inputs, dialogs, etc. from scratch.
- Use Tailwind CSS utility classes for layout and spacing.
- Use CSS custom properties (defined in `globals.css`) for theme colors. Support light and dark modes.
- Follow shadcn/ui's `cn()` utility pattern for conditional class merging.

### 10.2 Responsive Design

- Design for desktop-first (14-17 year olds primarily use laptops/desktops for coding).
- Support tablet landscape as secondary viewport.
- Mobile portrait should show lesson content but may hide the code editor sidebar.
- Breakpoints follow Tailwind defaults: `sm` (640px), `md` (768px), `lg` (1024px), `xl` (1280px).

### 10.3 Accessibility

- WCAG 2.1 AA minimum compliance.
- All interactive elements must be keyboard navigable.
- All images and icons must have `alt` text or `aria-label`.
- Color must not be the only indicator of state (add icons or text).
- Focus indicators must be visible on all interactive elements.
- Use semantic HTML elements: `<main>`, `<nav>`, `<article>`, `<section>`, `<aside>`.
- Form inputs must have associated `<label>` elements.
- Dynamic content updates must use `aria-live` regions.

### 10.4 Animation

- Use `framer-motion` for component transitions (page transitions, panel open/close).
- Use Tailwind `transition-*` utilities for simple hover/focus states.
- Respect `prefers-reduced-motion`. Disable animations when the user prefers reduced motion.
- No animations longer than 300ms for interactive feedback. Page transitions can be up to 500ms.

---

## 11. Error Handling

### 11.1 API Routes

Every API route must:
1. Wrap the handler body in try/catch.
2. Validate input with Zod. Return 400 with a clear error message on validation failure.
3. Return appropriate HTTP status codes (400, 401, 403, 404, 429, 500).
4. Never expose internal error details to the client. Log them server-side.
5. Return errors in a consistent shape:

```typescript
interface APIError {
  error: string;    // Human-readable message safe to display
  code: string;     // Machine-readable error code (e.g., "RATE_LIMIT_EXCEEDED")
  details?: unknown; // Optional additional context (validation errors, etc.)
}
```

### 11.2 Client-Side

- Use React Error Boundaries at the layout level to catch render errors.
- Use TanStack Query's `onError` for API call failures.
- Show user-friendly error messages. Never show stack traces or raw error objects.
- Provide a recovery action when possible ("Try again", "Go back to lessons").

### 11.3 AI-Specific Errors

- Rate limit exceeded: Show remaining time until reset. "You've used your AI requests for now. Try again in X minutes."
- Provider down: Silently fall back to next provider. Only show an error if all providers fail.
- Malformed AI response: Log the raw response, show a generic "I didn't understand that, could you rephrase?" message.

---

## 12. Testing Rules

### 12.1 What to Test

| Layer | Tool | What to test |
|-------|------|-------------|
| Config schemas | Vitest | Zod schemas validate correct configs, reject malformed ones |
| AI provider registry | Vitest | Fallback chain, rate limiting, provider selection logic |
| Homework validator | Vitest | Static checks pass/fail correctly for each lesson |
| API routes | Vitest | Input validation, auth checks, error responses |
| Database queries | Vitest | CRUD operations, data ownership enforcement |
| UI components | Vitest + Testing Library | Render, interaction, accessibility |
| User flows | Playwright | Login, complete lesson, submit homework, AI chat |

### 12.2 Test File Location

Tests are co-located with the code they test:

```
src/lib/ai/provider-registry.ts
src/lib/ai/provider-registry.test.ts

src/components/lesson/LessonViewer.tsx
src/components/lesson/LessonViewer.test.tsx
```

### 12.3 Test Naming

```typescript
describe('ProviderRegistry', () => {
  it('falls back to anthropic when openai fails', async () => { ... });
  it('throws RateLimitError when daily limit exceeded', async () => { ... });
  it('reads provider config from ai-providers.json', () => { ... });
});
```

Use descriptive names that read as sentences. No abbreviations.

---

## 13. Git and Workflow Rules

### 13.1 Branch Naming

```
feature/ai-tutor-chat
feature/lesson-viewer
fix/pyodide-timeout
refactor/config-loader
docs/architecture-update
```

### 13.2 Commit Messages

Follow Conventional Commits:

```
feat(ai): add multi-provider fallback chain
fix(editor): resolve Monaco initialization race condition
refactor(config): extract Zod schemas to types.ts
docs: update ARCHITECTURE.md with TTS flow
test(homework): add validation tests for lessons 1-10
chore: update dependencies
```

### 13.3 What Not to Commit

These must be in `.gitignore`:

```
.env.local
.env*.local
node_modules/
.next/
.vercel/
*.tsbuildinfo
```

Never commit API keys, database credentials, or user data.

---

## 14. Performance Rules

### 14.1 Bundle Size

- Lazy-load Monaco Editor (dynamic import, only on practice/lesson pages).
- Lazy-load Pyodide (dynamic import, only when user triggers code execution).
- Use `next/dynamic` with `ssr: false` for browser-only components.
- Monitor bundle size. Core page bundle should not exceed 200KB gzipped.

### 14.2 Data Fetching

- Use Server Components for initial data (lessons list, user progress).
- Use TanStack Query for client-side data that needs real-time updates (AI chat, streak counter).
- Cache lesson content aggressively (static MDX, changes rarely).
- Set appropriate `Cache-Control` headers on API responses.

### 14.3 Database

- Add indexes on frequently queried columns: `progress.userId`, `progress.lessonId`, `ai_conversations.userId`.
- Use `select` to fetch only needed columns. Never `SELECT *` in production queries.
- Paginate results that could grow unbounded (AI conversation history, achievements).

---

## 15. Content Rules (Lessons)

### 15.1 Lesson Format

All lessons are MDX files in `content/lessons/{level}/`. They follow a strict 6-step structure:

1. **Goal** -- One-sentence learning objective
2. **Explanation** -- Concept introduction with examples
3. **Code Example** -- Runnable code in a `<CodeBlock>` MDX component
4. **Guided Practice** -- Step-by-step coding task
5. **Homework** -- Independent challenge (references `homework.json` for validation rules)
6. **Reflection** -- 3-5 self-check questions

### 15.2 Code in Lessons

- All code examples must be inside MDX `<CodeBlock>` components (never raw markdown fences) so they are runnable.
- Code must be syntactically correct and tested.
- Code must have comments explaining each significant line.
- Use beginner-appropriate variable names (no single-letter variables except loop counters).

### 15.3 Writing Style

- Address the student directly ("you", "your").
- Short paragraphs (3-4 sentences max).
- Define technical terms on first use.
- Encouraging but not patronizing. The audience is 14-17, not 6-year-olds.
- No jargon without explanation. No assumptions about prior knowledge.

---

## 16. Security Rules

### 16.1 Input Validation

- Validate ALL user input with Zod on the server. Client-side validation is for UX only.
- Sanitize any user content before rendering (homework code display, chat messages).
- Use parameterized queries (Drizzle ORM handles this). Never interpolate user input into SQL.

### 16.2 Authentication

- Protect all data-mutation API routes with NextAuth session checks.
- Read-only routes (lesson content, config) can be public.
- AI routes require authentication (to enforce rate limits and track usage).
- Verify data ownership on every request that accesses user-specific data.

### 16.3 Code Execution Sandboxing

- Browser (Pyodide): Runs in WebAssembly sandbox. Inherently isolated.
- Server (Piston): Runs in Docker containers with no network access, limited memory (256MB), and execution timeout (15s).
- Never execute user code in the Node.js process. Always delegate to Pyodide or Piston.

### 16.4 Rate Limiting

Rate limits are defined per-provider in `ai-providers.json` and enforced by `src/lib/ai/rate-limiter.ts`. Rate limit state is stored in Vercel Postgres (not in-memory, since serverless functions are stateless).

---

## 17. Documentation Rules

### 17.1 Code Documentation

- Export functions and components must have a JSDoc comment describing their purpose.
- Complex algorithms or non-obvious logic must have inline comments explaining "why", not "what".
- Do not add comments that merely restate the code.

### 17.2 Project Documentation

- `AGENTS.md` (this file): Rules for development. Update when rules change.
- `ARCHITECTURE.md`: System design. Update when architecture changes.
- `README.md`: Getting started, setup, and deployment instructions.
- Config JSON files are self-documenting through their Zod schemas.

---

## 18. Definition of Done

A feature is complete when:

1. Code follows all rules in this document.
2. TypeScript compiles with zero errors in strict mode.
3. All new code has corresponding tests.
4. Tests pass locally (`npm run test`).
5. No new linter warnings (`npm run lint`).
6. Config values are in JSON files (nothing hardcoded).
7. API routes validate input and return proper error responses.
8. UI is keyboard navigable and meets WCAG 2.1 AA.
9. Feature works with AI providers disabled (graceful degradation).
10. Commit follows Conventional Commits format.
