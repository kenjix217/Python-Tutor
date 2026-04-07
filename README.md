# Python Learner v2

A modern AI-native interactive Python learning platform built with Next.js 15, TypeScript, and Tailwind CSS.

## Project Status: 🚧 Implementation Phase

This is the **v2 rewrite** of the Python AI Tutor platform. We're transitioning from a vanilla HTML/CSS/JS architecture to a full-stack Next.js application.

### Key Improvements in v2

| Aspect | v1 (Legacy) | v2 (Current) |
|--------|-------------|--------------|
| Framework | Vanilla JS | Next.js 15 + TypeScript |
| Styling | Custom CSS | Tailwind CSS 4 + shadcn/ui |
| Data Storage | localStorage | Vercel Postgres + Drizzle ORM |
| Authentication | None | NextAuth.js v5 (anonymous-first) |
| AI Integration | BYO API key | Server-managed multi-provider |
| Code Execution | Pyodide only | Hybrid: Pyodide + Piston API |
| Lesson Format | Markdown | MDX with React components |

## Architecture

See [ARCHITECTURE.md](./ARCHITECTURE.md) for complete system design.

See [AGENT.md](./AGENT.md) for development rules and coding standards.

## Content Migration

The 23 lessons from v1 have been archived to `migration/v1-reference/lessons/` for migration to the new MDX format.

### Migration Status

- [ ] Convert lesson-01.md → content/lessons/beginner/01-what-is-programming.mdx
- [ ] Convert lesson-02.md → content/lessons/beginner/02-variables-and-types.mdx
- [ ] ... (23 lessons total)
- [ ] Extract homework validation rules to config/homework.json
- [ ] Port AI provider config to config/ai-providers.json
- [ ] Port feature flags to config/features.json

## Quick Start

### Prerequisites

- Node.js 20.x or later
- npm or yarn
- Git

### Development Setup

1. **Clone the repository**
   ```bash
   git clone <repo-url>
   cd python-learner-v2
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   # Edit .env.local with your API keys
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open in browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## Project Structure

```
python-learner-v2/
├── config/              # JSON configuration files (ai-providers.json, lessons.json, etc.)
├── content/             # MDX lesson content
│   └── lessons/         # Lesson files organized by level
├── migration/           # v1 content for migration
│   └── v1-reference/
│       ├── lessons/       # Original 23 lesson markdown files
│       └── golden_source_solutions.tar.gz
├── public/              # Static assets
├── src/                 # Application source code
│   ├── app/             # Next.js App Router
│   ├── components/        # React components
│   ├── lib/               # Business logic and utilities
│   ├── stores/            # Zustand state stores
│   ├── hooks/             # Custom React hooks
│   └── types/             # TypeScript type definitions
├── AGENT.md             # Development rules
├── ARCHITECTURE.md      # System design documentation
└── README.md            # This file
```

## Documentation

- [ARCHITECTURE.md](./ARCHITECTURE.md) - System design, data flows, API contracts
- [AGENT.md](./AGENT.md) - Development rules, coding standards, constraints

## Contributing

Please read [AGENT.md](./AGENT.md) before contributing. All code must follow the established patterns and constraints.

## License

MIT
