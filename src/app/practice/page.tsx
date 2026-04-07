"use client";

import { useState, useCallback, useEffect } from "react";
import Link from "next/link";
import { CodeEditor } from "@/components/editor/CodeEditor";
import { OutputPanel } from "@/components/editor/OutputPanel";
import { usePyodide } from "@/hooks/usePyodide";

export default function PracticePage() {
  const [code, setCode] = useState<string>(DEFAULT_CODE);
  const [output, setOutput] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [isRunning, setIsRunning] = useState(false);
  
  const { isReady, isLoading, runCode } = usePyodide();

  const handleRun = useCallback(async () => {
    if (!isReady) return;
    
    setIsRunning(true);
    setOutput("");
    setError("");

    try {
      const result = await runCode(code);
      setOutput(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsRunning(false);
    }
  }, [code, isReady, runCode]);

  const handleClear = useCallback(() => {
    setOutput("");
    setError("");
  }, []);

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
              <Link href="/learn" className="text-zinc-600 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-white">
                Lessons
              </Link>
            </div>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-zinc-900 dark:text-white mb-2">
            Practice Mode
          </h1>
          <p className="text-zinc-600 dark:text-zinc-400">
            Experiment with Python code in a safe environment.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Editor */}
          <div className="bg-white dark:bg-zinc-800 rounded-xl border border-zinc-200 dark:border-zinc-700 overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3 border-b border-zinc-200 dark:border-zinc-700">
              <span className="text-sm font-medium text-zinc-600 dark:text-zinc-400">
                Code Editor
              </span>
              <div className="flex items-center gap-2">
                {isLoading && (
                  <span className="text-xs text-zinc-500">Loading Python...</span>
                )}
                <button
                  onClick={handleRun}
                  disabled={!isReady || isRunning}
                  className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-emerald-600 rounded-lg hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {isRunning ? "Running..." : "▶ Run Code"}
                </button>
                <button
                  onClick={handleClear}
                  className="px-4 py-2 text-sm font-medium text-zinc-600 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-white border border-zinc-300 dark:border-zinc-600 rounded-lg transition-colors"
                >
                  Clear
                </button>
              </div>
            </div>
            <div className="h-[500px]">
              <CodeEditor
                value={code}
                onChange={setCode}
                language="python"
              />
            </div>
          </div>

          {/* Output */}
          <div className="bg-white dark:bg-zinc-800 rounded-xl border border-zinc-200 dark:border-zinc-700 overflow-hidden">
            <div className="px-4 py-3 border-b border-zinc-200 dark:border-zinc-700">
              <span className="text-sm font-medium text-zinc-600 dark:text-zinc-400">
                Output
              </span>
            </div>
            <OutputPanel
              output={output}
              error={error}
              isLoading={isRunning || isLoading}
            />
          </div>
        </div>
      </main>
    </div>
  );
}

const DEFAULT_CODE = `# Welcome to Practice Mode!
# Try running some Python code here

print("Hello, Python Learner!")

# Let's do some math
a = 10
b = 5
print(f"{a} + {b} = {a + b}")
print(f"{a} * {b} = {a * b}")

# Write your own code below:

`;
