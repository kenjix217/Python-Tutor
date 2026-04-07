import Link from "next/link";
import { promises as fs } from "fs";
import path from "path";
import { LessonsConfig, Level } from "@/types/lesson";

async function getLessonsConfig(): Promise<LessonsConfig> {
  const configPath = path.join(process.cwd(), "config", "lessons.json");
  const file = await fs.readFile(configPath, "utf8");
  return JSON.parse(file);
}

export default async function LearnPage() {
  const config = await getLessonsConfig();

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-900">
      {/* Header */}
      <header className="bg-white dark:bg-zinc-800 border-b border-zinc-200 dark:border-zinc-700">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <nav className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2 text-zinc-900 dark:text-white">
              <span className="text-2xl">🐍</span>
              <span className="text-xl font-semibold">Python Learner</span>
            </Link>
            <div className="flex items-center gap-4">
              <Link href="/" className="text-zinc-600 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-white">
                Home
              </Link>
              <Link href="/practice" className="text-zinc-600 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-white">
                Practice
              </Link>
            </div>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-12">
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-zinc-900 dark:text-white mb-4">
            Learning Path
          </h1>
          <p className="text-xl text-zinc-600 dark:text-zinc-400">
            Master Python through 23 interactive lessons, from fundamentals to professional development.
          </p>
        </div>

        {/* Levels */}
        <div className="space-y-12">
          {config.levels.map((level) => (
            <LevelSection key={level.id} level={level} lessons={config.lessons} />
          ))}
        </div>
      </main>
    </div>
  );
}

function LevelSection({ level, lessons }: { level: Level; lessons: any[] }) {
  const levelLessons = lessons.filter((lesson) => lesson.level === level.id);

  return (
    <section className="bg-white dark:bg-zinc-800 rounded-2xl p-8 border border-zinc-200 dark:border-zinc-700">
      <div className="flex items-center gap-4 mb-6">
        <div
          className="w-4 h-4 rounded-full"
          style={{ backgroundColor: level.color }}
        />
        <h2 className="text-2xl font-bold text-zinc-900 dark:text-white">
          {level.name}
        </h2>
        <span className="text-zinc-500 dark:text-zinc-400">
          {level.description}
        </span>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {levelLessons.map((lesson) => (
          <LessonCard key={lesson.id} lesson={lesson} />
        ))}
      </div>
    </section>
  );
}

function LessonCard({ lesson }: { lesson: any }) {
  return (
    <Link
      href={`/learn/${lesson.id}`}
      className="group block p-6 bg-zinc-50 dark:bg-zinc-700/50 rounded-xl border border-zinc-200 dark:border-zinc-600 hover:border-emerald-500 dark:hover:border-emerald-400 transition-all hover:shadow-lg"
    >
      <div className="flex items-start justify-between mb-3">
        <span className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
          Lesson {lesson.number}
        </span>
        <span className="text-xs px-2 py-1 bg-zinc-200 dark:bg-zinc-600 rounded-full text-zinc-600 dark:text-zinc-300">
          {lesson.estimatedMinutes} min
        </span>
      </div>
      <h3 className="text-lg font-semibold text-zinc-900 dark:text-white mb-2 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
        {lesson.title}
      </h3>
      <p className="text-sm text-zinc-600 dark:text-zinc-400 line-clamp-2">
        {lesson.description}
      </p>
      <div className="mt-4 flex items-center gap-2">
        <span className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">
          +{lesson.xpReward} XP
        </span>
        <span className="text-xs text-zinc-400">
          {lesson.executionMode === "pyodide" ? "Browser" : "Server"} execution
        </span>
      </div>
    </Link>
  );
}
