# ARCHITECTURE.md -- Python Learner v2 System Design

**Version:** 2.0.0
**Last Updated:** April 5, 2026
**Status:** Design Complete -- Pending Implementation

---

## 1. Overview

Python Learner v2 is an AI-native web application that teaches Python programming to students aged 14-17. It replaces the v1 vanilla HTML/CSS/JS application with a modern Next.js 15 + TypeScript stack. AI is integrated by default with server-managed multi-provider keys (no user-provided API keys). The platform features adaptive learning paths, hybrid code execution, gamification, and full configurability through JSON config files.

### 1.1 Key Differences from v1

| Aspect | v1 (Current) | v2 (New) |
|--------|-------------|----------|
| Framework | Vanilla HTML/CSS/JS | Next.js 15 + TypeScript |
| AI Integration | BYO API key (optional) | Built-in, multi-provider, server-managed |
| Data Storage | localStorage only | Vercel Postgres + Drizzle ORM |
| Authentication | None | NextAuth.js v5 (anonymous-first) |
| Code Execution | Pyodide only (browser) | Hybrid: Pyodide (browser) + Piston (server) |
| Homework Validation | Regex pattern matching | Hybrid: static checks + execution + AI review |
| Configuration | Hardcoded in JS files | JSON config files (config/) |
| State Management | Scattered DOM manipulation | Zustand + TanStack Query |
| Lesson Format | Markdown (.md) | MDX (.mdx) with embedded React components |
| Voice | Browser Web Speech API | OpenAI TTS / ElevenLabs with browser fallback |
| Gamification | None | XP, levels, achievements, streaks |
| Learning Path | Linear (1-23) | Adaptive (AI-adjusted based on performance) |
| Deployment | Static HTML / GitHub Pages | Vercel (serverless, edge) |

---

## 2. High-Level Architecture

```
+-------------------------------------------------------------------+
|                        CLIENT (Browser)                           |
|                                                                   |
|  +------------------+  +----------------+  +-------------------+  |
|  | React UI         |  | Monaco Editor  |  | Pyodide Runtime   |  |
|  | (shadcn/ui +     |  | (Code editing) |  | (Browser Python   |  |
|  |  Tailwind CSS)   |  |                |  |  for L1-L10)      |  |
|  +--------+---------+  +-------+--------+  +---------+---------+  |
|           |                    |                      |           |
|  +--------+---------+  +------+-------+               |           |
|  | Zustand Stores   |  | TanStack     |               |           |
|  | (client state)   |  | Query        |               |           |
|  +--------+---------+  | (server sync)|               |           |
|           |            +------+-------+               |           |
+-----------+-------------------+-----------------------+-----------+
            |                   |                       |
            v                   v                       v
+-------------------------------------------------------------------+
|                   VERCEL SERVERLESS (API Routes)                  |
|                                                                   |
|  +----------------+  +----------------+  +---------------------+  |
|  | AI Proxy       |  | Code Execution |  | Auth Middleware      |  |
|  | Service        |  | Service        |  | (NextAuth v5)       |  |
|  | (multi-provider|  | (Piston API    |  +---------------------+  |
|  |  + fallback)   |  |  for L11-L22)  |                          |
|  +-------+--------+  +-------+--------+  +---------------------+  |
|          |                   |            | Lesson Engine        |  |
|  +-------+--------+         |            | (MDX loader +        |  |
|  | Rate Limiter   |         |            |  content resolver)   |  |
|  +-------+--------+         |            +---------------------+  |
|          |                   |                                    |
|  +-------+--------+  +------+-------+  +----------------------+  |
|  | Adaptive       |  | Homework     |  | Progress Service     |  |
|  | Learning       |  | Validator    |  | (CRUD + analytics)   |  |
|  | Engine         |  | (hybrid)     |  |                      |  |
|  +-------+--------+  +------+-------+  +---------+------------+  |
|          |                  |                     |               |
+----------+------------------+---------------------+---------------+
           |                  |                     |
           v                  v                     v
+-------------------------------------------------------------------+
|                         DATA LAYER                                |
|                                                                   |
|  +------------------+  +----------------+  +-------------------+  |
|  | Vercel Postgres  |  | Config JSON    |  | Vercel Blob       |  |
|  | (Neon)           |  | Files          |  | (TTS audio cache) |  |
|  | - users          |  | - ai-providers |  |                   |  |
|  | - progress       |  | - lessons      |  +-------------------+  |
|  | - skill_scores   |  | - curriculum   |                        |
|  | - ai_convos      |  | - gamification |  +-------------------+  |
|  | - achievements   |  | - homework     |  | Lesson MDX Files  |  |
|  | - streaks        |  | - features     |  | (content/)        |  |
|  | - rate_limits    |  | - prompts      |  |                   |  |
|  +------------------+  +----------------+  +-------------------+  |
+-------------------------------------------------------------------+
           |
           v
+-------------------------------------------------------------------+
|                      EXTERNAL SERVICES                            |
|                                                                   |
|  +----------+  +-----------+  +------------+  +----------------+  |
|  | OpenAI   |  | Anthropic |  | OpenRouter |  | ElevenLabs TTS |  |
|  | API      |  | API       |  | API        |  | API            |  |
|  +----------+  +-----------+  +------------+  +----------------+  |
|                                                                   |
|  +-------------------+                                            |
|  | Piston API        |                                            |
|  | (Code Execution)  |                                            |
|  +-------------------+                                            |
+-------------------------------------------------------------------+
```

---

## 3. Tech Stack

| Layer | Technology | Version | Purpose |
|-------|-----------|---------|---------|
| Framework | Next.js (App Router) | 15.x | Full-stack React framework with SSR, RSC, API routes |
| Language | TypeScript | 5.x (strict) | Type safety across full stack |
| Styling | Tailwind CSS | 4.x | Utility-first CSS framework |
| UI Components | shadcn/ui | latest | Accessible, themeable component library |
| Client State | Zustand | 5.x | Lightweight client-side state management |
| Server State | TanStack Query | 5.x | Server state caching, mutations, optimistic updates |
| Code Editor | @monaco-editor/react | latest | VS Code editor experience in React |
| Lesson Content | MDX + next-mdx-remote | latest | Rich markdown with embedded React components |
| Python (browser) | Pyodide | 0.27+ | In-browser Python via WebAssembly (L1-L10) |
| Python (server) | Piston API | latest | Sandboxed server-side Python execution (L11-L22) |
| Database | Vercel Postgres (Neon) | managed | Serverless PostgreSQL |
| ORM | Drizzle ORM | latest | Type-safe, lightweight SQL query builder |
| Authentication | NextAuth.js v5 (Auth.js) | 5.x | Flexible auth with multiple providers |
| AI SDK | Vercel AI SDK | 4.x | Streaming AI responses, multi-provider support |
| Validation | Zod | 3.x | Runtime schema validation for configs and API inputs |
| Voice TTS | OpenAI TTS / ElevenLabs | API | Natural text-to-speech with browser fallback |
| Animation | Framer Motion | latest | Page transitions, component animations |
| Charts | Recharts | latest | Progress dashboard visualizations |
| Deployment | Vercel | managed | Native Next.js hosting with edge functions |
| Unit Testing | Vitest | latest | Fast unit and integration tests |
| E2E Testing | Playwright | latest | End-to-end browser testing |

---

## 4. Project Structure

```
python-learner-v2/
├── src/
│   ├── app/                              # Next.js App Router pages and API routes
│   │   ├── layout.tsx                    # Root layout: providers, theme, auth wrapper
│   │   ├── page.tsx                      # Landing page / dashboard
│   │   ├── globals.css                   # Tailwind base + CSS custom properties
│   │   │
│   │   ├── (auth)/                       # Route group: authentication pages
│   │   │   ├── login/
│   │   │   │   └── page.tsx              # Login page (email, GitHub, Google)
│   │   │   └── register/
│   │   │       └── page.tsx              # Registration page
│   │   │
│   │   ├── learn/                        # Route group: learning experience
│   │   │   ├── page.tsx                  # Lesson list with progress indicators
│   │   │   └── [lessonId]/
│   │   │       └── page.tsx              # Individual lesson: content + homework + AI chat
│   │   │
│   │   ├── practice/                     # Standalone code sandbox
│   │   │   └── page.tsx                  # Free-form code editor + execution
│   │   │
│   │   ├── progress/                     # Progress dashboard
│   │   │   └── page.tsx                  # Stats, skill radar, achievements, streaks
│   │   │
│   │   ├── settings/                     # User preferences
│   │   │   └── page.tsx                  # Theme, voice, editor settings
│   │   │
│   │   └── api/                          # Serverless API routes
│   │       ├── ai/
│   │       │   ├── chat/
│   │       │   │   └── route.ts          # POST: AI tutor chat (streaming)
│   │       │   ├── review/
│   │       │   │   └── route.ts          # POST: AI code review
│   │       │   ├── hint/
│   │       │   │   └── route.ts          # POST: progressive hint generation
│   │       │   ├── generate/
│   │       │   │   └── route.ts          # POST: dynamic lesson/exercise generation
│   │       │   └── tts/
│   │       │       └── route.ts          # POST: text-to-speech audio generation
│   │       ├── code/
│   │       │   └── execute/
│   │       │       └── route.ts          # POST: server-side Python execution (Piston)
│   │       ├── auth/
│   │       │   └── [...nextauth]/
│   │       │       └── route.ts          # NextAuth.js handler
│   │       ├── progress/
│   │       │   └── route.ts              # GET/POST/PATCH: user progress CRUD
│   │       └── achievements/
│   │           └── route.ts              # GET: user achievements
│   │
│   ├── components/                       # React components (organized by domain)
│   │   ├── ui/                           # shadcn/ui primitives (Button, Card, Dialog, etc.)
│   │   │
│   │   ├── layout/                       # App shell components
│   │   │   ├── Header.tsx                # Top nav: logo, navigation, user menu
│   │   │   ├── Sidebar.tsx               # Lesson list sidebar (on learn pages)
│   │   │   └── Footer.tsx                # Footer with links
│   │   │
│   │   ├── lesson/                       # Lesson viewing components
│   │   │   ├── LessonViewer.tsx          # MDX content renderer
│   │   │   ├── LessonNav.tsx             # Previous / Next lesson navigation
│   │   │   ├── LessonCard.tsx            # Lesson card in list view
│   │   │   ├── HomeworkSection.tsx        # Homework submission area + validation results
│   │   │   ├── CodeBlock.tsx             # Runnable code block (MDX component)
│   │   │   └── VoiceControls.tsx         # Play/pause/stop/speed for TTS
│   │   │
│   │   ├── editor/                       # Code editor components
│   │   │   ├── CodeEditor.tsx            # Monaco editor wrapper
│   │   │   ├── OutputPanel.tsx           # stdout/stderr/visualization display
│   │   │   └── ExecutionControls.tsx     # Run, Clear, Submit for Review buttons
│   │   │
│   │   ├── ai/                           # AI feature components
│   │   │   ├── AIChatPanel.tsx           # Sliding panel for AI tutor conversation
│   │   │   ├── AIChatMessage.tsx         # Single chat message bubble
│   │   │   ├── AIHintButton.tsx          # "Get a hint" button with progressive reveals
│   │   │   ├── CodeReviewPanel.tsx       # AI code feedback display
│   │   │   └── AdaptiveBanner.tsx        # "Recommended next" lesson suggestion
│   │   │
│   │   ├── progress/                     # Progress and analytics components
│   │   │   ├── ProgressDashboard.tsx     # Main progress page content
│   │   │   ├── SkillRadar.tsx            # Radar chart of skill proficiencies
│   │   │   ├── LessonProgressList.tsx    # List of lessons with completion status
│   │   │   └── StatsCards.tsx            # XP, lessons completed, streak, level
│   │   │
│   │   └── gamification/                 # Gamification components
│   │       ├── XPBar.tsx                 # Experience points progress bar
│   │       ├── LevelBadge.tsx            # Current level display
│   │       ├── AchievementBadge.tsx      # Individual achievement with unlock animation
│   │       ├── AchievementGrid.tsx       # Grid of all achievements
│   │       ├── StreakCounter.tsx          # Daily streak fire counter
│   │       └── LeaderboardCard.tsx       # Optional community leaderboard
│   │
│   ├── lib/                              # Shared business logic and utilities
│   │   ├── ai/
│   │   │   ├── provider-registry.ts      # Multi-provider AI manager with fallback chain
│   │   │   ├── provider-registry.test.ts
│   │   │   ├── prompts.ts               # System prompt loader + template engine
│   │   │   ├── prompts.test.ts
│   │   │   ├── rate-limiter.ts           # Per-user rate limiting (DB-backed)
│   │   │   ├── rate-limiter.test.ts
│   │   │   └── schemas.ts               # Zod schemas for AI API request/response
│   │   │
│   │   ├── code/
│   │   │   ├── pyodide-manager.ts        # Browser-side Pyodide lifecycle management
│   │   │   ├── piston-client.ts          # Server-side Piston API client
│   │   │   ├── piston-client.test.ts
│   │   │   ├── validator.ts              # Homework validation engine (static + execution)
│   │   │   ├── validator.test.ts
│   │   │   └── sanitizer.ts             # Code sanitization before execution
│   │   │
│   │   ├── db/
│   │   │   ├── schema.ts                # Drizzle ORM table definitions
│   │   │   ├── client.ts                # Database connection singleton
│   │   │   ├── queries.ts               # Reusable query functions
│   │   │   └── migrations/              # SQL migration files
│   │   │
│   │   ├── auth/
│   │   │   └── auth.ts                  # NextAuth.js configuration
│   │   │
│   │   ├── config/
│   │   │   ├── loader.ts                # Type-safe JSON config loader with validation
│   │   │   ├── loader.test.ts
│   │   │   └── types.ts                 # Zod schemas for all config files
│   │   │
│   │   ├── gamification/
│   │   │   ├── xp-engine.ts             # XP calculation and level-up logic
│   │   │   ├── xp-engine.test.ts
│   │   │   ├── achievement-engine.ts    # Achievement condition evaluation
│   │   │   ├── achievement-engine.test.ts
│   │   │   ├── streak-engine.ts         # Streak tracking logic
│   │   │   └── streak-engine.test.ts
│   │   │
│   │   ├── adaptive/
│   │   │   ├── learning-engine.ts       # Adaptive path recommendation logic
│   │   │   └── learning-engine.test.ts
│   │   │
│   │   └── utils/
│   │       ├── cn.ts                    # Tailwind class name merger (shadcn pattern)
│   │       └── format.ts               # Date, number, duration formatters
│   │
│   ├── stores/                          # Zustand client-side stores
│   │   ├── lesson-store.ts              # Current lesson state, navigation
│   │   ├── editor-store.ts              # Editor content, execution state, output
│   │   └── ui-store.ts                  # Sidebar open, theme, panel visibility
│   │
│   ├── hooks/                           # Custom React hooks
│   │   ├── useAI.ts                     # AI chat, review, hint API calls
│   │   ├── usePyodide.ts               # Pyodide initialization and execution
│   │   ├── useCodeExecution.ts          # Hybrid execution (auto-selects Pyodide or Piston)
│   │   ├── useProgress.ts              # Progress read/write with TanStack Query
│   │   ├── useVoice.ts                 # TTS playback controls
│   │   └── useFeatureFlag.ts           # Read feature flags from config
│   │
│   └── types/                           # Shared TypeScript type definitions
│       ├── lesson.ts                    # Lesson, LessonLevel, LessonMeta types
│       ├── progress.ts                  # Progress, SkillScore, Streak types
│       ├── ai.ts                        # ChatMessage, CodeReview, Hint types
│       ├── config.ts                    # Inferred types from Zod config schemas
│       ├── gamification.ts              # XP, Level, Achievement types
│       └── auth.ts                      # Session, User extension types
│
├── content/                             # Learning content (outside src/)
│   ├── lessons/                         # MDX lesson files organized by level
│   │   ├── beginner/                    # Lessons 1-5
│   │   │   ├── 01-what-is-programming.mdx
│   │   │   ├── 02-variables-and-types.mdx
│   │   │   ├── 03-input-and-output.mdx
│   │   │   ├── 04-conditions.mdx
│   │   │   └── 05-loops.mdx
│   │   ├── intermediate/               # Lessons 6-10
│   │   │   ├── 06-functions.mdx
│   │   │   ├── 07-lists-and-dictionaries.mdx
│   │   │   ├── 08-file-handling.mdx
│   │   │   ├── 09-error-handling.mdx
│   │   │   └── 10-intro-to-oop.mdx
│   │   ├── advanced/                   # Lessons 11-16
│   │   │   ├── 11-external-libraries.mdx
│   │   │   ├── 12-working-with-apis.mdx
│   │   │   ├── 13-data-processing.mdx
│   │   │   ├── 14-web-dev-flask.mdx
│   │   │   ├── 15-building-web-apps.mdx
│   │   │   └── 16-building-rest-apis.mdx
│   │   └── expert/                     # Lessons 17-22 + bonus
│   │       ├── 17-databases.mdx
│   │       ├── 18-data-analysis.mdx
│   │       ├── 19-automation.mdx
│   │       ├── 20-testing.mdx
│   │       ├── 21-deployment.mdx
│   │       ├── 22-best-practices-final-project.mdx
│   │       └── 23-bonus-games.mdx
│   │
│   └── challenges/                     # Supplementary coding challenges (AI-generated pool)
│       └── README.md
│
├── config/                              # Configuration files (THE source of truth)
│   ├── ai-providers.json                # AI provider config (see Section 8.1)
│   ├── lessons.json                     # Lesson registry (see Section 8.2)
│   ├── curriculum.json                  # Learning paths and skill trees (see Section 8.3)
│   ├── gamification.json                # XP, levels, achievements, streaks (see Section 8.4)
│   ├── homework.json                    # Homework validation rules per lesson (see Section 8.5)
│   ├── features.json                    # Feature flags (see Section 8.6)
│   └── prompts.json                     # AI system prompts (see Section 8.7)
│
├── public/                              # Static assets
│   ├── favicon.ico
│   └── images/
│       ├── badges/                      # Achievement badge icons
│       └── lessons/                     # Lesson thumbnail images
│
├── drizzle/                             # Drizzle ORM configuration
│   └── drizzle.config.ts
│
├── AGENTS.md                            # AI agent development rules
├── ARCHITECTURE.md                      # This file
├── README.md                            # Getting started guide
├── next.config.ts                       # Next.js configuration
├── tailwind.config.ts                   # Tailwind CSS configuration
├── tsconfig.json                        # TypeScript configuration (strict)
├── package.json                         # Dependencies and scripts
├── .env.local                           # Secrets (never committed)
├── .env.example                         # Template for required env vars
├── .gitignore                           # Git ignore rules
└── .eslintrc.json                       # ESLint configuration
```

---

## 5. Data Flow Diagrams

### 5.1 Lesson Loading Flow

```
Student navigates to /learn/[lessonId]
    |
    v
Server Component (page.tsx)
    |
    +-- Read lessons.json to get lesson metadata
    +-- Read MDX file from content/lessons/{level}/{id}.mdx
    +-- Read homework.json to get validation rules for this lesson
    +-- Read features.json to determine which features are enabled
    +-- Query DB: user progress for this lesson (attempts, completion status)
    +-- Query DB: user skill scores (for adaptive recommendations)
    |
    v
Render page with:
    +-- LessonViewer (MDX content with embedded CodeBlock components)
    +-- HomeworkSection (if lesson has homework in homework.json)
    +-- VoiceControls (if features.aiVoice is true)
    +-- AIChatPanel (if features.aiTutorChat is true)
    +-- AIHintButton (if features.aiHints is true)
    +-- AdaptiveBanner (if features.adaptiveLearning is true)
    +-- LessonNav (previous/next based on lessons.json order or adaptive recommendation)
```

### 5.2 Code Execution Flow

```
Student clicks "Run Code"
    |
    v
useCodeExecution hook reads lesson's executionMode from lessons.json
    |
    +-- executionMode === "pyodide"
    |       |
    |       v
    |   usePyodide hook
    |       +-- Initialize Pyodide (lazy, cached)
    |       +-- Sanitize code (block dangerous imports)
    |       +-- Redirect stdout/stderr
    |       +-- Execute with 10s timeout
    |       +-- Capture output + errors
    |       +-- Display in OutputPanel
    |
    +-- executionMode === "server"
    |       |
    |       v
    |   POST /api/code/execute
    |       +-- Authenticate user (NextAuth session)
    |       +-- Validate request body (Zod)
    |       +-- Send to Piston API (sandboxed Docker)
    |       +-- 15s timeout, 10KB output limit
    |       +-- Return stdout, stderr, exit code
    |       +-- Display in OutputPanel
    |
    v
If AI Code Review requested:
    +-- POST /api/ai/review
    +-- Send: code, execution output, lesson context
    +-- Provider registry selects AI provider
    +-- AI returns structured feedback
    +-- Display in CodeReviewPanel
```

### 5.3 AI Tutor Chat Flow

```
Student types question in AIChatPanel
    |
    v
POST /api/ai/chat (streaming)
    |
    +-- 1. Authenticate (NextAuth session)
    +-- 2. Validate request (Zod: messages array, lessonId)
    +-- 3. Check rate limit (DB lookup: user requests today/minute)
    |       +-- If exceeded: return 429 with reset time
    +-- 4. Load system prompt from prompts.json
    |       +-- Fill template variables: {{lessonTitle}}, {{lessonLevel}}, etc.
    +-- 5. Build context:
    |       +-- System prompt
    |       +-- Current lesson content (truncated)
    |       +-- Student's current code (if any)
    |       +-- Recent mistakes from progress DB
    |       +-- Conversation history (from request)
    +-- 6. Get AI provider from registry
    |       +-- Read ai-providers.json for default provider
    |       +-- Resolve API key from process.env
    |       +-- If provider fails, try next in fallbackOrder
    +-- 7. Call Vercel AI SDK streamText()
    +-- 8. Stream response tokens to client
    +-- 9. On completion: save conversation to ai_conversations table
    +-- 10. Update rate limit counter
    |
    v
Client displays streaming response in AIChatPanel
```

### 5.4 Homework Submission Flow

```
Student pastes code in HomeworkSection and clicks "Check Homework"
    |
    v
Client-side: Run static checks from homework.json
    |
    +-- functionUsage checks (does code use required functions?)
    +-- lineCount checks (minimum lines of meaningful code?)
    +-- patternMatch checks (does code contain required patterns?)
    |
    +-- If static checks fail:
    |       Display specific hints from homework.json hints array
    |       Stop here (no server call needed)
    |
    +-- If static checks pass:
    |       |
    |       v
    |   POST /api/code/execute (run the code)
    |       +-- Capture stdout, stderr, exit code
    |       |
    |       v
    |   Run execution checks from homework.json
    |       +-- outputLineCount: does output have expected lines?
    |       +-- outputContains: does output contain expected strings?
    |       +-- noErrors: did code execute without errors?
    |       |
    |       +-- If execution checks fail:
    |       |       Display specific feedback
    |       |       Offer AI hint (if enabled + hints remaining)
    |       |
    |       +-- If all checks pass:
    |               |
    |               v
    |           Optional: POST /api/ai/review (AI code review)
    |               +-- AI provides pedagogical feedback
    |               +-- "Great job! Here's what you did well..."
    |               |
    |               v
    |           Update progress DB:
    |               +-- Mark homework as passed
    |               +-- Record attempts count
    |               +-- Award XP (gamification.json rules)
    |               +-- Check for achievement unlocks
    |               +-- Update skill scores
    |               |
    |               v
    |           Enable "Mark as Complete" button
    |           Show celebration animation
```

### 5.5 Adaptive Learning Flow

```
Student completes a lesson
    |
    v
Adaptive Learning Engine (server-side)
    |
    +-- 1. Read student's progress data from DB:
    |       +-- All lesson completion records
    |       +-- Homework attempts per lesson
    |       +-- Hints used per lesson
    |       +-- Time spent per lesson
    |       +-- Skill scores
    |
    +-- 2. Read curriculum.json for skill tree and prerequisites
    |
    +-- 3. Calculate performance signals:
    |       +-- Fast completion + few attempts = strong understanding
    |       +-- Many attempts + many hints = needs reinforcement
    |       +-- Specific skills with low scores = targeted practice needed
    |
    +-- 4. Determine recommendation:
    |       +-- If all prerequisites met + strong performance:
    |       |       Recommend next lesson in sequence
    |       +-- If weak skills detected:
    |       |       Recommend review lesson or AI-generated practice exercise
    |       +-- If student is excelling:
    |       |       Allow skipping ahead (if features.adaptiveLearning is true)
    |
    +-- 5. Store recommendation in DB
    +-- 6. Display in AdaptiveBanner component
```

---

## 6. Authentication Architecture

### 6.1 Strategy: Anonymous-First with Optional Sign-Up

Students can start learning immediately without creating an account. An anonymous session is created automatically. Progress is saved to the database using an anonymous user ID. When the student creates an account, their anonymous data is merged.

### 6.2 Flow

```
First Visit
    |
    +-- NextAuth creates anonymous session (cookie-based)
    +-- Anonymous user row inserted in users table
    +-- Student begins learning, progress saved to anonymous user
    |
    v
Optional: Student clicks "Sign Up"
    |
    +-- OAuth flow (GitHub, Google) or email/password
    +-- If anonymous user has progress data:
    |       Merge: link anonymous progress rows to new authenticated user
    |       Delete anonymous user row
    +-- Session upgraded to authenticated
    |
    v
Returning Visit (authenticated)
    |
    +-- NextAuth restores session from cookie
    +-- All progress, achievements, streaks loaded from DB
```

### 6.3 Auth Providers (configured in NextAuth)

| Provider | Purpose |
|----------|---------|
| Anonymous | Default, zero-friction start |
| GitHub OAuth | Natural for coding students |
| Google OAuth | Widely available |
| Email/Password (Credentials) | Fallback option |

### 6.4 Session Shape

```typescript
interface Session {
  user: {
    id: string;           // UUID
    name?: string;
    email?: string;
    image?: string;
    isAnonymous: boolean;
  };
}
```

---

## 7. Database Schema

### 7.1 Tables

All tables use UUID primary keys and include timestamp columns.

**users**

| Column | Type | Description |
|--------|------|-------------|
| id | uuid | Primary key |
| email | text (nullable) | Null for anonymous users |
| name | text (nullable) | Display name |
| image | text (nullable) | Avatar URL |
| isAnonymous | boolean | True for anonymous sessions |
| totalXP | integer | Accumulated experience points |
| currentLevel | text | Current gamification level name |
| createdAt | timestamp | Account creation time |
| lastActiveAt | timestamp | Last activity time |

**progress**

| Column | Type | Description |
|--------|------|-------------|
| id | uuid | Primary key |
| userId | uuid (FK -> users) | Owner |
| lessonId | text | References lessons.json ID |
| status | enum | not_started, in_progress, completed |
| attempts | integer | Homework submission attempts |
| hintsUsed | integer | AI hints consumed |
| timeSpentSeconds | integer | Total time on this lesson |
| homeworkCode | text (nullable) | Last submitted homework code |
| homeworkPassed | boolean | Whether homework validation passed |
| completedAt | timestamp (nullable) | When lesson was completed |
| createdAt | timestamp | First access time |
| updatedAt | timestamp | Last update time |

**skill_scores**

| Column | Type | Description |
|--------|------|-------------|
| id | uuid | Primary key |
| userId | uuid (FK -> users) | Owner |
| skill | text | Skill name (e.g., "loops", "functions", "oop") |
| score | float | 0.0 to 1.0 proficiency score |
| updatedAt | timestamp | Last score update |

**ai_conversations**

| Column | Type | Description |
|--------|------|-------------|
| id | uuid | Primary key |
| userId | uuid (FK -> users) | Owner |
| lessonId | text (nullable) | Lesson context (null for free practice) |
| type | enum | chat, review, hint |
| messages | jsonb | Array of {role, content} message objects |
| tokenCount | integer | Total tokens used |
| provider | text | Which AI provider was used |
| createdAt | timestamp | Conversation start time |

**achievements**

| Column | Type | Description |
|--------|------|-------------|
| id | uuid | Primary key |
| userId | uuid (FK -> users) | Owner |
| achievementId | text | References gamification.json achievement ID |
| unlockedAt | timestamp | When achievement was earned |

**streaks**

| Column | Type | Description |
|--------|------|-------------|
| id | uuid | Primary key |
| userId | uuid (FK -> users, unique) | Owner (one row per user) |
| currentStreak | integer | Current consecutive days |
| longestStreak | integer | All-time best streak |
| lastActiveDate | date | Last day student was active |

**rate_limits**

| Column | Type | Description |
|--------|------|-------------|
| id | uuid | Primary key |
| userId | uuid (FK -> users) | Owner |
| endpoint | text | API endpoint (e.g., "ai/chat") |
| requestCount | integer | Requests in current window |
| windowStart | timestamp | When current rate limit window started |

### 7.2 Indexes

```sql
CREATE INDEX idx_progress_user ON progress(userId);
CREATE INDEX idx_progress_lesson ON progress(lessonId);
CREATE INDEX idx_progress_user_lesson ON progress(userId, lessonId);
CREATE INDEX idx_skills_user ON skill_scores(userId);
CREATE INDEX idx_ai_convos_user ON ai_conversations(userId);
CREATE INDEX idx_achievements_user ON achievements(userId);
CREATE INDEX idx_rate_limits_user_endpoint ON rate_limits(userId, endpoint);
CREATE UNIQUE INDEX idx_streaks_user ON streaks(userId);
```

### 7.3 Relationships

```
users 1--* progress       (one user has many lesson progress records)
users 1--* skill_scores   (one user has many skill measurements)
users 1--* ai_conversations (one user has many AI conversation logs)
users 1--* achievements   (one user has many unlocked achievements)
users 1--1 streaks        (one user has one streak record)
users 1--* rate_limits    (one user has rate limit entries per endpoint)
```

---

## 8. Configuration System

Every configurable value lives in a JSON file under `config/`. Each config file has a corresponding Zod schema for validation. Server-side code imports configs directly. Client-side code accesses safe configs (no secrets) via imports or Server Component props.

### 8.1 ai-providers.json

Controls AI provider selection, model mapping, rate limits, and fallback behavior. Contains `envKeyName` fields that reference `.env.local` secrets -- this file must NEVER be imported on the client.

```json
{
  "defaultProvider": "openai",
  "fallbackOrder": ["openai", "anthropic", "openrouter"],
  "providers": {
    "openai": {
      "enabled": true,
      "baseUrl": "https://api.openai.com/v1",
      "models": {
        "chat": "gpt-4o-mini",
        "review": "gpt-4o",
        "tts": "tts-1",
        "generate": "gpt-4o-mini"
      },
      "envKeyName": "OPENAI_API_KEY",
      "maxTokens": {
        "chat": 800,
        "review": 1500,
        "hint": 300,
        "generate": 2000
      },
      "temperature": {
        "chat": 0.7,
        "review": 0.3,
        "hint": 0.5,
        "generate": 0.8
      },
      "rateLimits": {
        "requestsPerMinute": 20,
        "requestsPerDay": 200
      }
    },
    "anthropic": {
      "enabled": true,
      "baseUrl": "https://api.anthropic.com/v1",
      "models": {
        "chat": "claude-3-5-haiku-20241022",
        "review": "claude-3-5-sonnet-20241022",
        "generate": "claude-3-5-haiku-20241022"
      },
      "envKeyName": "ANTHROPIC_API_KEY",
      "maxTokens": {
        "chat": 800,
        "review": 1500,
        "hint": 300,
        "generate": 2000
      },
      "temperature": {
        "chat": 0.7,
        "review": 0.3,
        "hint": 0.5,
        "generate": 0.8
      },
      "rateLimits": {
        "requestsPerMinute": 15,
        "requestsPerDay": 150
      }
    },
    "openrouter": {
      "enabled": true,
      "baseUrl": "https://openrouter.ai/api/v1",
      "models": {
        "chat": "meta-llama/llama-3.2-3b-instruct:free",
        "review": "meta-llama/llama-3.1-70b-instruct",
        "generate": "meta-llama/llama-3.2-3b-instruct:free"
      },
      "envKeyName": "OPENROUTER_API_KEY",
      "maxTokens": {
        "chat": 800,
        "review": 1500,
        "hint": 300,
        "generate": 2000
      },
      "temperature": {
        "chat": 0.7,
        "review": 0.3,
        "hint": 0.5,
        "generate": 0.8
      },
      "rateLimits": {
        "requestsPerMinute": 30,
        "requestsPerDay": 500
      }
    }
  },
  "tts": {
    "defaultProvider": "openai",
    "fallback": "browser",
    "providers": {
      "openai": {
        "model": "tts-1",
        "voice": "nova",
        "envKeyName": "OPENAI_API_KEY"
      },
      "elevenlabs": {
        "voiceId": "configurable-voice-id",
        "envKeyName": "ELEVENLABS_API_KEY"
      },
      "browser": {
        "rate": 1.0,
        "pitch": 1.0,
        "volume": 1.0
      }
    }
  },
  "codeExecution": {
    "pistonUrl": "https://emkc.org/api/v2/piston",
    "timeoutMs": 15000,
    "maxOutputChars": 10000,
    "pythonVersion": "3.11"
  }
}
```

### 8.2 lessons.json

Single source of truth for all lesson metadata. Drives the lesson list, navigation, progress tracking, and execution mode selection.

```json
{
  "levels": [
    { "id": "beginner", "name": "Beginner", "description": "Python fundamentals", "color": "#10b981" },
    { "id": "intermediate", "name": "Intermediate", "description": "Core programming skills", "color": "#3b82f6" },
    { "id": "advanced", "name": "Advanced", "description": "Application building", "color": "#8b5cf6" },
    { "id": "expert", "name": "Expert", "description": "Production skills", "color": "#f59e0b" }
  ],
  "lessons": [
    {
      "id": "01-what-is-programming",
      "level": "beginner",
      "number": 1,
      "title": "What is Programming?",
      "description": "Understand what programming is and why Python is a great first language.",
      "file": "beginner/01-what-is-programming.mdx",
      "prerequisites": [],
      "skills": ["concepts", "print"],
      "executionMode": "pyodide",
      "estimatedMinutes": 20,
      "xpReward": 100
    },
    {
      "id": "02-variables-and-types",
      "level": "beginner",
      "number": 2,
      "title": "Variables and Data Types",
      "description": "Learn how to store and work with different types of data.",
      "file": "beginner/02-variables-and-types.mdx",
      "prerequisites": ["01-what-is-programming"],
      "skills": ["variables", "types", "print"],
      "executionMode": "pyodide",
      "estimatedMinutes": 25,
      "xpReward": 100
    },
    {
      "id": "03-input-and-output",
      "level": "beginner",
      "number": 3,
      "title": "Input and Output",
      "description": "Discover how to get information from users and display results.",
      "file": "beginner/03-input-and-output.mdx",
      "prerequisites": ["02-variables-and-types"],
      "skills": ["input", "output", "variables"],
      "executionMode": "pyodide",
      "estimatedMinutes": 25,
      "xpReward": 100
    },
    {
      "id": "04-conditions",
      "level": "beginner",
      "number": 4,
      "title": "Conditions (if/else)",
      "description": "Learn to make your programs make decisions.",
      "file": "beginner/04-conditions.mdx",
      "prerequisites": ["03-input-and-output"],
      "skills": ["conditions", "comparison", "logic"],
      "executionMode": "pyodide",
      "estimatedMinutes": 30,
      "xpReward": 120
    },
    {
      "id": "05-loops",
      "level": "beginner",
      "number": 5,
      "title": "Loops (for and while)",
      "description": "Discover how to make your programs repeat actions.",
      "file": "beginner/05-loops.mdx",
      "prerequisites": ["04-conditions"],
      "skills": ["for-loops", "while-loops", "iteration"],
      "executionMode": "pyodide",
      "estimatedMinutes": 30,
      "xpReward": 120
    },
    {
      "id": "06-functions",
      "level": "intermediate",
      "number": 6,
      "title": "Functions",
      "description": "Organize code into reusable functions.",
      "file": "intermediate/06-functions.mdx",
      "prerequisites": ["05-loops"],
      "skills": ["functions", "parameters", "return-values"],
      "executionMode": "pyodide",
      "estimatedMinutes": 35,
      "xpReward": 150
    },
    {
      "id": "07-lists-and-dictionaries",
      "level": "intermediate",
      "number": 7,
      "title": "Lists and Dictionaries",
      "description": "Master working with collections of data.",
      "file": "intermediate/07-lists-and-dictionaries.mdx",
      "prerequisites": ["06-functions"],
      "skills": ["lists", "dictionaries", "iteration"],
      "executionMode": "pyodide",
      "estimatedMinutes": 35,
      "xpReward": 150
    },
    {
      "id": "08-file-handling",
      "level": "intermediate",
      "number": 8,
      "title": "File Handling",
      "description": "Learn to read from and write to files.",
      "file": "intermediate/08-file-handling.mdx",
      "prerequisites": ["07-lists-and-dictionaries"],
      "skills": ["file-io", "context-managers"],
      "executionMode": "pyodide",
      "estimatedMinutes": 30,
      "xpReward": 150
    },
    {
      "id": "09-error-handling",
      "level": "intermediate",
      "number": 9,
      "title": "Error Handling",
      "description": "Handle errors gracefully with try/except.",
      "file": "intermediate/09-error-handling.mdx",
      "prerequisites": ["08-file-handling"],
      "skills": ["exceptions", "try-except", "debugging"],
      "executionMode": "pyodide",
      "estimatedMinutes": 30,
      "xpReward": 150
    },
    {
      "id": "10-intro-to-oop",
      "level": "intermediate",
      "number": 10,
      "title": "Introduction to OOP",
      "description": "Learn Object-Oriented Programming basics.",
      "file": "intermediate/10-intro-to-oop.mdx",
      "prerequisites": ["09-error-handling"],
      "skills": ["classes", "objects", "methods", "oop"],
      "executionMode": "pyodide",
      "estimatedMinutes": 40,
      "xpReward": 200
    },
    {
      "id": "11-external-libraries",
      "level": "advanced",
      "number": 11,
      "title": "Working with External Libraries",
      "description": "Learn to use pip and the Python ecosystem.",
      "file": "advanced/11-external-libraries.mdx",
      "prerequisites": ["10-intro-to-oop"],
      "skills": ["pip", "imports", "packages"],
      "executionMode": "server",
      "estimatedMinutes": 35,
      "xpReward": 200
    },
    {
      "id": "12-working-with-apis",
      "level": "advanced",
      "number": 12,
      "title": "Working with APIs",
      "description": "Fetch data from web services using HTTP requests.",
      "file": "advanced/12-working-with-apis.mdx",
      "prerequisites": ["11-external-libraries"],
      "skills": ["http", "json", "apis", "requests"],
      "executionMode": "server",
      "estimatedMinutes": 40,
      "xpReward": 200
    },
    {
      "id": "13-data-processing",
      "level": "advanced",
      "number": 13,
      "title": "Data Processing Basics",
      "description": "Process CSV files for real-world data analysis.",
      "file": "advanced/13-data-processing.mdx",
      "prerequisites": ["12-working-with-apis"],
      "skills": ["csv", "data-analysis", "pandas"],
      "executionMode": "server",
      "estimatedMinutes": 40,
      "xpReward": 200
    },
    {
      "id": "14-web-dev-flask",
      "level": "advanced",
      "number": 14,
      "title": "Web Development with Flask",
      "description": "Build web applications with Flask.",
      "file": "advanced/14-web-dev-flask.mdx",
      "prerequisites": ["13-data-processing"],
      "skills": ["flask", "web-development", "routes"],
      "executionMode": "server",
      "estimatedMinutes": 45,
      "xpReward": 250
    },
    {
      "id": "15-building-web-apps",
      "level": "advanced",
      "number": 15,
      "title": "Building Web Applications",
      "description": "Create interactive web apps with forms and templates.",
      "file": "advanced/15-building-web-apps.mdx",
      "prerequisites": ["14-web-dev-flask"],
      "skills": ["templates", "forms", "web-apps"],
      "executionMode": "server",
      "estimatedMinutes": 45,
      "xpReward": 250
    },
    {
      "id": "16-building-rest-apis",
      "level": "advanced",
      "number": 16,
      "title": "Building REST APIs",
      "description": "Create REST APIs that other programs can use.",
      "file": "advanced/16-building-rest-apis.mdx",
      "prerequisites": ["15-building-web-apps"],
      "skills": ["rest-api", "crud", "json"],
      "executionMode": "server",
      "estimatedMinutes": 45,
      "xpReward": 250
    },
    {
      "id": "17-databases",
      "level": "expert",
      "number": 17,
      "title": "Working with Databases",
      "description": "Master SQLite databases and SQL queries.",
      "file": "expert/17-databases.mdx",
      "prerequisites": ["16-building-rest-apis"],
      "skills": ["sql", "sqlite", "databases", "orm"],
      "executionMode": "server",
      "estimatedMinutes": 45,
      "xpReward": 300
    },
    {
      "id": "18-data-analysis",
      "level": "expert",
      "number": 18,
      "title": "Data Analysis with Python",
      "description": "Analyze data and find patterns in datasets.",
      "file": "expert/18-data-analysis.mdx",
      "prerequisites": ["17-databases"],
      "skills": ["pandas", "statistics", "visualization"],
      "executionMode": "server",
      "estimatedMinutes": 45,
      "xpReward": 300
    },
    {
      "id": "19-automation",
      "level": "expert",
      "number": 19,
      "title": "Automation and Scripting",
      "description": "Automate repetitive tasks with Python scripts.",
      "file": "expert/19-automation.mdx",
      "prerequisites": ["18-data-analysis"],
      "skills": ["scripting", "file-ops", "automation"],
      "executionMode": "server",
      "estimatedMinutes": 40,
      "xpReward": 300
    },
    {
      "id": "20-testing",
      "level": "expert",
      "number": 20,
      "title": "Testing and Code Quality",
      "description": "Write unit tests and ensure code quality.",
      "file": "expert/20-testing.mdx",
      "prerequisites": ["19-automation"],
      "skills": ["unittest", "pytest", "tdd"],
      "executionMode": "server",
      "estimatedMinutes": 40,
      "xpReward": 300
    },
    {
      "id": "21-deployment",
      "level": "expert",
      "number": 21,
      "title": "Deployment and Production",
      "description": "Deploy applications to the cloud.",
      "file": "expert/21-deployment.mdx",
      "prerequisites": ["20-testing"],
      "skills": ["deployment", "venv", "cloud", "env-vars"],
      "executionMode": "server",
      "estimatedMinutes": 45,
      "xpReward": 300
    },
    {
      "id": "22-best-practices-final-project",
      "level": "expert",
      "number": 22,
      "title": "Best Practices and Final Project",
      "description": "Master professional practices and build a portfolio project.",
      "file": "expert/22-best-practices-final-project.mdx",
      "prerequisites": ["21-deployment"],
      "skills": ["best-practices", "project-management", "portfolio"],
      "executionMode": "server",
      "estimatedMinutes": 60,
      "xpReward": 500
    },
    {
      "id": "23-bonus-games",
      "level": "expert",
      "number": 23,
      "title": "Bonus: Creating Games with Python",
      "description": "Learn to create fun text and visual games.",
      "file": "expert/23-bonus-games.mdx",
      "prerequisites": ["10-intro-to-oop"],
      "skills": ["game-logic", "random", "creativity"],
      "executionMode": "pyodide",
      "estimatedMinutes": 45,
      "xpReward": 200
    }
  ]
}
```

### 8.3 curriculum.json

Defines the skill taxonomy and learning path structure used by the adaptive learning engine.

```json
{
  "skillCategories": {
    "fundamentals": {
      "name": "Fundamentals",
      "skills": ["concepts", "print", "variables", "types", "input", "output"]
    },
    "controlFlow": {
      "name": "Control Flow",
      "skills": ["conditions", "comparison", "logic", "for-loops", "while-loops", "iteration"]
    },
    "abstraction": {
      "name": "Abstraction",
      "skills": ["functions", "parameters", "return-values", "classes", "objects", "methods", "oop"]
    },
    "dataStructures": {
      "name": "Data Structures",
      "skills": ["lists", "dictionaries", "file-io", "context-managers", "csv"]
    },
    "errorHandling": {
      "name": "Error Handling",
      "skills": ["exceptions", "try-except", "debugging"]
    },
    "ecosystem": {
      "name": "Ecosystem",
      "skills": ["pip", "imports", "packages", "http", "json", "apis", "requests"]
    },
    "webDev": {
      "name": "Web Development",
      "skills": ["flask", "web-development", "routes", "templates", "forms", "web-apps", "rest-api", "crud"]
    },
    "professional": {
      "name": "Professional",
      "skills": ["sql", "sqlite", "databases", "orm", "pandas", "statistics", "visualization", "scripting", "file-ops", "automation", "unittest", "pytest", "tdd", "deployment", "venv", "cloud", "env-vars", "best-practices", "project-management", "portfolio"]
    }
  },
  "adaptiveRules": {
    "strongPerformanceThreshold": 0.8,
    "weakPerformanceThreshold": 0.4,
    "maxHintsBeforeReinforcement": 3,
    "maxAttemptsBeforeReinforcement": 5,
    "allowSkipAhead": true,
    "skipRequiresScore": 0.9
  }
}
```

### 8.4 gamification.json

Controls the XP system, player levels, achievements, and streak mechanics.

```json
{
  "xp": {
    "lessonComplete": 100,
    "homeworkPass": 50,
    "homeworkFirstTry": 25,
    "dailyStreak": 10,
    "codeReviewRequested": 5,
    "achievementUnlock": 20
  },
  "levels": [
    { "name": "Novice", "minXP": 0, "badge": "seedling" },
    { "name": "Apprentice", "minXP": 300, "badge": "sprout" },
    { "name": "Coder", "minXP": 800, "badge": "sapling" },
    { "name": "Developer", "minXP": 1800, "badge": "tree" },
    { "name": "Engineer", "minXP": 3500, "badge": "fire" },
    { "name": "Architect", "minXP": 6000, "badge": "rocket" },
    { "name": "Pythonista", "minXP": 9000, "badge": "trophy" }
  ],
  "achievements": [
    { "id": "hello-world", "title": "Hello World!", "description": "Complete your first lesson", "condition": { "type": "lessonComplete", "lessonId": "01-what-is-programming" }, "xpBonus": 50 },
    { "id": "first-code", "title": "First Code", "description": "Run your first Python program", "condition": { "type": "codeExecuted", "count": 1 }, "xpBonus": 25 },
    { "id": "perfect-homework", "title": "Nailed It!", "description": "Pass homework on first try", "condition": { "type": "homeworkFirstTry", "count": 1 }, "xpBonus": 50 },
    { "id": "five-streak", "title": "On Fire!", "description": "5-day learning streak", "condition": { "type": "streak", "days": 5 }, "xpBonus": 100 },
    { "id": "seven-streak", "title": "Week Warrior", "description": "7-day learning streak", "condition": { "type": "streak", "days": 7 }, "xpBonus": 200 },
    { "id": "thirty-streak", "title": "Monthly Master", "description": "30-day learning streak", "condition": { "type": "streak", "days": 30 }, "xpBonus": 500 },
    { "id": "beginner-complete", "title": "Beginner Graduate", "description": "Complete all beginner lessons", "condition": { "type": "levelComplete", "level": "beginner" }, "xpBonus": 200 },
    { "id": "intermediate-complete", "title": "Intermediate Graduate", "description": "Complete all intermediate lessons", "condition": { "type": "levelComplete", "level": "intermediate" }, "xpBonus": 300 },
    { "id": "advanced-complete", "title": "Advanced Graduate", "description": "Complete all advanced lessons", "condition": { "type": "levelComplete", "level": "advanced" }, "xpBonus": 500 },
    { "id": "expert-complete", "title": "Python Master", "description": "Complete all expert lessons", "condition": { "type": "levelComplete", "level": "expert" }, "xpBonus": 1000 },
    { "id": "bug-squasher", "title": "Bug Squasher", "description": "Fix 10 code errors", "condition": { "type": "errorsFixed", "count": 10 }, "xpBonus": 100 },
    { "id": "ai-explorer", "title": "AI Explorer", "description": "Have 20 conversations with AI tutor", "condition": { "type": "aiChats", "count": 20 }, "xpBonus": 100 },
    { "id": "full-curriculum", "title": "Completionist", "description": "Complete all 23 lessons", "condition": { "type": "allLessonsComplete" }, "xpBonus": 2000 }
  ],
  "streaks": {
    "resetHourUTC": 4,
    "graceHours": 0,
    "freezesPerMonth": 2
  }
}
```

### 8.5 homework.json

Defines homework validation rules for every lesson. Supports static pattern checks, execution-based checks, and AI review configuration.

```json
{
  "01-what-is-programming": {
    "title": "Display Three Sentences",
    "description": "Display exactly three lines about yourself using print()",
    "validationMode": "static",
    "staticChecks": [
      { "type": "functionUsage", "function": "print", "minCount": 3, "failMessage": "Use at least 3 print() statements" },
      { "type": "codeLineCount", "min": 3, "failMessage": "Write at least 3 lines of code" }
    ],
    "executionChecks": [],
    "aiReviewEnabled": true,
    "hints": [
      "Each print() statement outputs one line. You need at least three.",
      "Make sure your text is inside quotes: print(\"your text here\")",
      "Try writing about your name, a hobby, and something you want to learn."
    ],
    "maxHints": 3
  },
  "02-variables-and-types": {
    "title": "Five Variables About Yourself",
    "description": "Create at least 5 variables of different types and print them all",
    "validationMode": "static",
    "staticChecks": [
      { "type": "assignmentCount", "min": 5, "failMessage": "Create at least 5 variables" },
      { "type": "functionUsage", "function": "print", "minCount": 5, "failMessage": "Print all 5 variables" }
    ],
    "executionChecks": [],
    "aiReviewEnabled": true,
    "hints": [
      "A variable assignment looks like: name = \"Alex\"",
      "Try using different types: strings (\"text\"), integers (25), floats (5.9), booleans (True)",
      "Print each variable with a label: print(\"Name:\", name)"
    ],
    "maxHints": 3
  },
  "03-input-and-output": {
    "title": "Three Questions Program",
    "description": "Ask the user three questions, store answers, and display a summary",
    "validationMode": "static",
    "staticChecks": [
      { "type": "functionUsage", "function": "input", "minCount": 3, "failMessage": "Ask at least 3 questions using input()" },
      { "type": "patternMatch", "pattern": "\\w+\\s*=\\s*input\\(", "minCount": 3, "failMessage": "Store all 3 answers in variables" },
      { "type": "functionUsage", "function": "print", "minCount": 1, "failMessage": "Display a summary using print()" }
    ],
    "executionChecks": [],
    "aiReviewEnabled": true,
    "hints": [
      "Use input() to ask a question: name = input(\"What is your name? \")",
      "Store each answer in a different variable",
      "Combine answers in your summary using f-strings: print(f\"Hello {name}!\")"
    ],
    "maxHints": 3
  },
  "04-conditions": {
    "title": "Movie Age Restriction Checker",
    "description": "Check age and parental permission to determine if someone can watch a movie",
    "validationMode": "static",
    "staticChecks": [
      { "type": "patternMatch", "pattern": "int\\(input\\(", "minCount": 1, "failMessage": "Get the user's age using int(input())" },
      { "type": "keywordUsage", "keyword": "if", "minCount": 1, "failMessage": "Use if statements for conditions" },
      { "type": "keywordUsage", "keyword": "else", "minCount": 1, "failMessage": "Use else for alternative paths" },
      { "type": "keywordUsage", "keyword": "and", "minCount": 1, "failMessage": "Combine conditions with 'and'" }
    ],
    "executionChecks": [],
    "aiReviewEnabled": true,
    "hints": [
      "Start by getting the age: age = int(input(\"How old are you? \"))",
      "Ask about parental permission for younger viewers",
      "Use 'and' to check multiple conditions: if age >= 13 and has_permission == \"yes\":"
    ],
    "maxHints": 3
  },
  "05-loops": {
    "title": "Sum of Numbers 1 to 100",
    "description": "Calculate the sum of all numbers from 1 to 100 using a loop",
    "validationMode": "hybrid",
    "staticChecks": [
      { "type": "keywordUsage", "keyword": "for", "minCount": 1, "failMessage": "Use a for loop" },
      { "type": "functionUsage", "function": "range", "minCount": 1, "failMessage": "Use range() to generate numbers" },
      { "type": "patternMatch", "pattern": "\\+=|total\\s*=\\s*total\\s*\\+", "minCount": 1, "failMessage": "Accumulate a running total" }
    ],
    "executionChecks": [
      { "type": "outputContains", "value": "5050", "failMessage": "The sum of 1-100 should be 5050" },
      { "type": "noErrors" }
    ],
    "aiReviewEnabled": true,
    "hints": [
      "Start with a total variable: total = 0",
      "Use range(1, 101) to get numbers from 1 to 100",
      "Inside the loop, add each number to total: total += number"
    ],
    "maxHints": 3
  }
}
```

Note: Homework definitions for lessons 6-23 follow the same pattern and would be populated in the full config file. The structure supports adding new lessons without code changes -- just add an entry to this JSON file.

### 8.6 features.json

Feature flags that toggle every major capability. Change a flag and the feature appears or disappears without code changes.

```json
{
  "aiTutorChat": true,
  "aiCodeReview": true,
  "aiHints": true,
  "aiLessonGeneration": false,
  "aiVoice": true,
  "adaptiveLearning": true,
  "gamification": true,
  "achievements": true,
  "streaks": true,
  "leaderboard": false,
  "darkMode": true,
  "voiceNarration": true,
  "serverExecution": true,
  "homeworkValidation": true,
  "requireHomeworkToAdvance": true,
  "anonymousMode": true,
  "maxFreeAIRequestsPerDay": 50,
  "showLessonEstimates": true,
  "showSkillRadar": true,
  "allowLessonSkip": false
}
```

### 8.7 prompts.json

AI system prompts used across all AI features. Templates use `{{variable}}` placeholders filled at runtime.

```json
{
  "tutor": {
    "system": "You are a patient, encouraging Python tutor for a {{studentAge}}-year-old student. You are currently helping them with: {{lessonTitle}} ({{lessonLevel}} level).\n\nTeaching Rules:\n- Ask guiding questions before giving answers\n- Encourage the student to reason through problems\n- NEVER provide complete homework solutions\n- Provide hints that lead to understanding, not copy-paste answers\n- Use simple language appropriate for a teenager\n- Reference the current lesson content when relevant\n- Celebrate correct thinking and good attempts\n- If the student is frustrated, acknowledge it and simplify your explanation\n- Stay on topic: Python programming and the current lesson\n- If asked about unrelated topics, gently redirect to Python learning\n\nStudent Context:\n- Current lesson: {{lessonTitle}}\n- Lessons completed: {{completedCount}} of {{totalLessons}}\n- Recent struggles: {{recentStruggles}}\n- Current code (if any): {{currentCode}}",
    "maxHistoryMessages": 20,
    "maxContextTokens": 2000
  },
  "codeReviewer": {
    "system": "You are a Python code reviewer for a student learning programming. Review the following code submitted for the lesson: {{lessonTitle}}.\n\nHomework task: {{homeworkDescription}}\n\nExecution result:\n- stdout: {{executionOutput}}\n- stderr: {{executionErrors}}\n- Exit code: {{exitCode}}\n\nProvide feedback in this exact JSON format:\n{\n  \"overallRating\": \"excellent\" | \"good\" | \"needs-improvement\",\n  \"whatYouDidWell\": [\"string\", ...],\n  \"suggestions\": [\"string\", ...],\n  \"specificLineComments\": [{\"line\": number, \"comment\": \"string\"}, ...]\n}\n\nRules:\n- Be encouraging and specific\n- Point out good practices, not just problems\n- NEVER rewrite the entire solution\n- Suggest improvements as questions when possible\n- Keep feedback appropriate for a {{lessonLevel}}-level student",
    "maxContextTokens": 3000
  },
  "hintGenerator": {
    "system": "You are generating a programming hint for a student stuck on homework.\n\nLesson: {{lessonTitle}}\nHomework: {{homeworkDescription}}\nStudent's current code:\n{{currentCode}}\n\nThis is hint {{hintNumber}} of {{maxHints}}.\n- Hint 1: Give a general direction without specifics\n- Hint 2: Be more specific about the approach, mention relevant concepts\n- Hint 3: Walk through the logic step by step, but do NOT write the actual code\n\nNEVER provide the complete solution. The student must write the code themselves.",
    "maxContextTokens": 1500
  },
  "exerciseGenerator": {
    "system": "Generate a Python practice exercise for a student who needs to strengthen their {{weakSkill}} skills. The student is at {{lessonLevel}} level and has completed {{completedCount}} lessons.\n\nGenerate in this JSON format:\n{\n  \"title\": \"Exercise title\",\n  \"description\": \"What the student should build\",\n  \"difficulty\": \"easy\" | \"medium\" | \"hard\",\n  \"starterCode\": \"# Optional starter code\",\n  \"expectedConcepts\": [\"skill1\", \"skill2\"],\n  \"hints\": [\"hint1\", \"hint2\"]\n}\n\nMake it practical, interesting for a teenager, and focused on the weak skill.",
    "maxContextTokens": 1500
  }
}
```

---

## 9. Deployment Architecture

### 9.1 Vercel Configuration

```
Vercel Project
├── Framework: Next.js (auto-detected)
├── Build Command: next build
├── Output Directory: .next
├── Node.js Version: 20.x
│
├── Environment Variables (set in Vercel dashboard):
│   ├── OPENAI_API_KEY
│   ├── ANTHROPIC_API_KEY
│   ├── OPENROUTER_API_KEY
│   ├── ELEVENLABS_API_KEY (optional)
│   ├── POSTGRES_URL (auto-set by Vercel Postgres)
│   ├── NEXTAUTH_SECRET
│   ├── NEXTAUTH_URL
│   ├── GITHUB_CLIENT_ID (for OAuth)
│   ├── GITHUB_CLIENT_SECRET
│   ├── GOOGLE_CLIENT_ID (for OAuth)
│   └── GOOGLE_CLIENT_SECRET
│
├── Serverless Functions:
│   ├── /api/ai/* (10s timeout, 1MB response)
│   ├── /api/code/execute (15s timeout)
│   └── /api/* (default 10s timeout)
│
└── Integrations:
    ├── Vercel Postgres (Neon) -- database
    └── Vercel Blob (optional) -- TTS audio cache
```

### 9.2 Environment Files

**.env.example** (committed, template):
```
# AI Providers
OPENAI_API_KEY=
ANTHROPIC_API_KEY=
OPENROUTER_API_KEY=
ELEVENLABS_API_KEY=

# Database (auto-set by Vercel Postgres)
POSTGRES_URL=

# Auth
NEXTAUTH_SECRET=
NEXTAUTH_URL=http://localhost:3000
GITHUB_CLIENT_ID=
GITHUB_CLIENT_SECRET=
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
```

**.env.local** (never committed, actual secrets):
```
OPENAI_API_KEY=sk-...
ANTHROPIC_API_KEY=sk-ant-...
# ... etc
```

---

## 10. Migration Plan from v1

### 10.1 Content Migration

The 23 existing lesson markdown files in `U:\Python-Learner\frontend\lessons\` are the primary content asset. Migration steps:

1. Copy each `lesson-XX.md` to `content/lessons/{level}/XX-slug.mdx`.
2. Convert markdown syntax to MDX where needed (replace raw code fences with `<CodeBlock>` components).
3. Preserve all lesson text, code examples, homework descriptions, and reflection questions.
4. Add frontmatter metadata to each MDX file (title, description, skills).

### 10.2 Homework Migration

The homework validation rules in `U:\Python-Learner\frontend\js\homework-validator.js` contain test cases for lessons 1-13. Migration:

1. Extract each lesson's test cases into `config/homework.json` entries.
2. Convert JavaScript regex checks to the declarative `staticChecks` format.
3. Add `executionChecks` for lessons that benefit from runtime validation.
4. Add `hints` arrays (porting from the existing lesson markdown hint sections).

### 10.3 Config Migration

| v1 Source | v2 Destination |
|-----------|---------------|
| `frontend/js/config.js` (AI settings) | `config/ai-providers.json` |
| `frontend/js/config.js` (voice settings) | `config/ai-providers.json` (tts section) |
| `frontend/js/config.js` (feature flags) | `config/features.json` |
| `frontend/js/app.js` (lesson list) | `config/lessons.json` |
| `frontend/js/progress-tracker.js` (lesson list) | `config/lessons.json` (single source) |
| `frontend/js/homework-validator.js` (test cases) | `config/homework.json` |
| `frontend/js/config.js` (system prompt) | `config/prompts.json` |

### 10.4 What is NOT Migrated

- Vanilla JS modules (`app.js`, `lesson-viewer.js`, etc.) -- replaced by React components.
- Custom markdown parser -- replaced by MDX + next-mdx-remote.
- localStorage progress storage -- replaced by Vercel Postgres.
- Browser-only architecture -- replaced by full-stack Next.js.
- User-provided API keys -- replaced by server-managed multi-provider system.

### 10.5 Migration Order

1. Set up Next.js project with TypeScript, Tailwind, shadcn/ui.
2. Create all config JSON files (porting data from v1 sources).
3. Set up database schema and auth.
4. Build lesson engine (MDX renderer + navigation).
5. Port lesson content (markdown to MDX).
6. Build code execution (Pyodide hook + Piston API route).
7. Build AI integration (provider registry + chat + review + hints).
8. Build homework validation (static + execution + AI review).
9. Build gamification (XP, achievements, streaks).
10. Build adaptive learning engine.
11. Build remaining UI (progress dashboard, settings, voice).
12. Testing and polish.

---

## 11. Design Principles Summary

1. **Config-driven**: Every behavior reads from JSON config files in `config/`. Zero hardcoded values in source code.

2. **AI-first but graceful**: AI features are on by default but every AI feature degrades gracefully if providers are unavailable. The student can always continue learning.

3. **Type-safe end-to-end**: TypeScript strict mode everywhere. Zod validation on all external boundaries (API inputs, config files, URL parameters).

4. **Server-side secrets only**: API keys exist only in `.env.local` and are read by server-side code via `process.env`. Config JSON references keys by name (`envKeyName`), never by value.

5. **Streaming AI**: All AI chat interactions use Vercel AI SDK streaming for real-time token display. No waiting for complete responses.

6. **Progressive disclosure**: Features appear when relevant. AI chat shows in lesson context. Gamification elements unlock as students progress. Advanced features do not overwhelm beginners.

7. **Accessibility first**: WCAG 2.1 AA compliance. Keyboard navigation everywhere. Screen reader support. High contrast mode. No information conveyed by color alone.

8. **Offline-capable basics**: Pyodide WASM and lesson content can be cached. Core learning works offline. AI features require connectivity.

9. **Single source of truth**: Every piece of data has exactly one canonical location. Lesson metadata lives in `lessons.json` only. Homework rules live in `homework.json` only. No duplication across files.

10. **Teach, never solve**: The AI tutor, hint system, and code reviewer guide students toward understanding. They never provide complete solutions. This principle is enforced in system prompts, validation logic, and code review.
