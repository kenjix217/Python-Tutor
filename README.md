# Python Learner v2

A modern AI-native interactive Python learning platform built with Next.js 15, TypeScript, and Tailwind CSS.

## Mission

**Python Learner v2** is a **non-profit educational project** dedicated to providing **free, accessible Python programming education for children and young learners worldwide**. We believe that every child should have the opportunity to learn coding regardless of their background or financial situation.

Our platform is completely free to use and will always remain so. We are committed to breaking down barriers to computer science education and fostering the next generation of developers, creators, and problem-solvers.

### Future Vision

While Python is our starting point, we envision expanding this platform to include:
- **Additional Programming Languages**: JavaScript, Java, C++, and more
- **Computer Science Fundamentals**: Algorithms, data structures, computational thinking
- **Web Development**: HTML, CSS, React, and full-stack development
- **Mobile App Development**: Cross-platform mobile development
- **Game Development**: Interactive game programming courses
- **AI and Machine Learning**: Introductory AI concepts for young learners
- **Digital Literacy**: Cybersecurity, internet safety, and digital citizenship

Our goal is to become a comprehensive, free learning hub for all things coding and computer science.

## Features

- **AI-Powered Learning**: Multiple AI providers (NVIDIA NIM with Kimi 2.5, OpenAI, Anthropic, OpenRouter)
- **Real-time Python Execution**: Run Python code in the browser with Pyodide (WASM)
- **Interactive Lessons**: 23 lessons from beginner to expert level
- **Gamification**: XP system, levels, achievements, and streaks
- **Modern UI**: Built with Tailwind CSS 4 and shadcn/ui components
- **Secure**: API keys stored in environment variables, never in code
- **Responsive**: Works on desktop, tablet, and mobile

## Tech Stack

| Technology | Purpose |
|------------|---------|
| Next.js 15 | React framework with App Router |
| TypeScript | Type-safe development |
| Tailwind CSS 4 | Utility-first styling |
| Zustand | State management |
| TanStack Query | Server state management |
| Drizzle ORM | Database ORM |
| Vercel Postgres | Database hosting |
| Pyodide | Browser Python runtime |
| Monaco Editor | Code editor (VS Code in browser) |

## Project Structure

```
python-learner-v2/
├── config/                 # JSON configuration files
│   ├── ai-providers.json   # AI provider settings
│   ├── features.json       # Feature flags
│   ├── lessons.json        # Lesson metadata
│   ├── homework.json       # Homework validation rules
│   ├── gamification.json   # XP, levels, achievements
│   ├── curriculum.json     # Skills taxonomy
│   └── prompts.json        # AI system prompts
├── content/
│   └── lessons/            # MDX lesson content
├── drizzle/                # Database migrations
├── migration/              # v1 content archive
├── src/
│   ├── app/                # Next.js App Router
│   ├── components/         # React components
│   ├── hooks/              # Custom React hooks
│   ├── lib/                # Business logic
│   ├── stores/             # Zustand stores
│   └── types/              # TypeScript types
├── .env.example            # Environment variable template
├── AGENT.md                # Development rules
├── ARCHITECTURE.md         # System architecture docs
└── next.config.ts          # Next.js config
```

## Getting Started

### Prerequisites

- Node.js 20.x or later
- npm or yarn
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/kenjix217/Python-Tutor.git
   cd Python-Tutor
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```
   
   Edit `.env.local` and add your API keys.

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open in browser**
   Navigate to http://localhost:4000

## Environment Variables

Create a `.env.local` file with the following variables:

```bash
# Required for AI features
NVIDIA_NIM_API_KEY=your-nvidia-nim-key

# Optional - other AI providers
OPENAI_API_KEY=your-openai-key
ANTHROPIC_API_KEY=your-anthropic-key
OPENROUTER_API_KEY=your-openrouter-key

# Database (auto-set by Vercel Postgres in production)
POSTGRES_URL=your-postgres-url

# Auth
NEXTAUTH_URL=http://localhost:4000
NEXTAUTH_SECRET=your-secret-key
```

## AI Providers

The platform supports multiple AI providers with automatic fallback:

| Provider | Default Model | Status |
|----------|--------------|--------|
| NVIDIA NIM | Kimi 2.5 | Default |
| OpenAI | GPT-4o | Fallback |
| Anthropic | Claude 3.5 | Fallback |
| OpenRouter | Llama 3.2 | Fallback |

Configured in `config/ai-providers.json`.

## Lessons

### Beginner (Lessons 1-5)
1. What is Programming?
2. Variables and Data Types
3. Input and Output
4. Conditions (if/else)
5. Loops (for and while)

### Intermediate (Lessons 6-10)
6. Functions
7. Lists and Dictionaries
8. File Handling
9. Error Handling
10. Introduction to OOP

### Advanced (Lessons 11-19)
11. External Libraries
12. Working with APIs
13. Data Processing Basics
14. Web Development with Flask
15. Building Web Applications
16. Building REST APIs
17. Working with Databases
18. Data Analysis
19. Automation and Scripting

### Expert (Lessons 20-23)
20. Testing and Quality
21. Deployment and Production
22. Best Practices & Final Project
23. Bonus Content

## Gamification

- **XP System**: Earn XP for completing lessons, passing homework, maintaining streaks
- **7 Levels**: Novice → Apprentice → Coder → Developer → Engineer → Architect → Pythonista
- **13 Achievements**: Including streaks, perfect homework, and completing each level
- **Daily Streaks**: Track consecutive learning days

Configured in `config/gamification.json`.

## Deployment

### Deploy on Vercel

1. **Push to GitHub**
   ```bash
   git push origin master
   ```

2. **Connect to Vercel**
   - Go to https://vercel.com/new
   - Import your GitHub repository

3. **Add Environment Variables**
   - In Vercel Dashboard → Settings → Environment Variables
   - Add `NVIDIA_NIM_API_KEY` and other required variables
   - Check Production, Preview, and Development

4. **Deploy**
   - Vercel will automatically build and deploy

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server (port 4000) |
| `npm run build` | Build for production |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |
| `npm run db:generate` | Generate Drizzle migrations |
| `npm run db:migrate` | Run database migrations |
| `npm run db:studio` | Open Drizzle Studio |

## Documentation

- **AGENT.md** - Development rules and coding standards
- **ARCHITECTURE.md** - Complete system architecture and data flows

## Security

- API keys are stored in environment variables only
- `.env.local` is gitignored (never committed)
- Config files only contain variable names, never values
- Server-side API routes protect API keys from clients

## Contributing

Please read [AGENT.md](./AGENT.md) before contributing. All code must follow the established patterns and constraints.

## License

MIT License - This project is open source and free for educational use.

## Support Our Mission

Python Learner v2 is a **non-profit project** created to provide free coding education to children worldwide. If you believe in our mission:

- **Contribute**: Help us improve the platform by contributing code, lessons, or translations
- **Spread the Word**: Share this project with educators, parents, and young learners
- **Sponsor**: Support our infrastructure costs to keep the platform running and free
- **Teach**: Use this platform in classrooms, coding clubs, or homeschooling environments

Together, we can make computer science education accessible to every child.

---

**Learn Python. Build the Future.**
