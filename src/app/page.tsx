import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <header className="bg-zinc-900 text-white py-4 px-6">
        <nav className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl font-bold text-emerald-400">🐍</span>
            <span className="text-xl font-semibold">Python Learner v2</span>
          </div>
          <div className="flex items-center gap-6">
            <Link href="/learn" className="text-zinc-300 hover:text-white transition-colors">
              Lessons
            </Link>
            <Link href="/practice" className="text-zinc-300 hover:text-white transition-colors">
              Practice
            </Link>
            <Link href="/progress" className="text-zinc-300 hover:text-white transition-colors">
              Progress
            </Link>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <main className="flex-1 bg-gradient-to-b from-zinc-900 via-zinc-800 to-zinc-900 text-white">
        <div className="max-w-7xl mx-auto px-6 py-24">
          <div className="text-center">
            <h1 className="text-5xl md:text-7xl font-bold mb-6">
              Learn Python with <span className="text-emerald-400">AI</span>
            </h1>
            <p className="text-xl md:text-2xl text-zinc-300 max-w-3xl mx-auto mb-12">
              Master Python programming from beginner to expert through interactive lessons, 
              AI-guided practice, and real-time code execution.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/learn"
                className="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-zinc-900 bg-emerald-400 rounded-lg hover:bg-emerald-300 transition-colors"
              >
                Start Learning
              </Link>
              <Link
                href="/practice"
                className="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-white border-2 border-white/20 rounded-lg hover:bg-white/10 transition-colors"
              >
                Try Practice Mode
              </Link>
            </div>
          </div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-3 gap-8 mt-24">
            <FeatureCard
              icon="🎯"
              title="Adaptive Learning"
              description="AI-powered learning paths that adapt to your pace and style"
            />
            <FeatureCard
              icon="⚡"
              title="Real-time Execution"
              description="Run Python code instantly in your browser with Pyodide"
            />
            <FeatureCard
              icon="🤖"
              title="AI Tutor"
              description="Get personalized hints and guidance from your AI tutor"
            />
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-zinc-900 text-zinc-400 py-8 px-6 border-t border-zinc-800">
        <div className="max-w-7xl mx-auto text-center">
          <p>Python Learner v2 - Built with Next.js, TypeScript, and Tailwind CSS</p>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: string; title: string; description: string }) {
  return (
    <div className="bg-zinc-800/50 border border-zinc-700 rounded-xl p-6 hover:bg-zinc-800 transition-colors">
      <div className="text-4xl mb-4">{icon}</div>
      <h3 className="text-xl font-semibold text-white mb-2">{title}</h3>
      <p className="text-zinc-400">{description}</p>
    </div>
  );
}
