"use client";

import { useState, useCallback } from "react";
import { CodeEditor } from "./CodeEditor";
import { OutputPanel } from "./OutputPanel";

interface PythonRunnerProps {
  initialCode?: string;
}

export function PythonRunner({ initialCode }: PythonRunnerProps) {
  const [code, setCode] = useState<string>(initialCode || DEFAULT_CODE);
  const [output, setOutput] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [isRunning, setIsRunning] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isReady, setIsReady] = useState(false);

  // Initialize pyodide on mount
  const pyodideRef = useState<any>(null);

  const runCode = useCallback(async (codeToRun: string) => {
    if (!pyodideRef[0]) {
      throw new Error("Python not initialized");
    }

    const outputs: string[] = [];
    pyodideRef[0].setStdout({
      batched: (text: string) => outputs.push(text),
    });
    pyodideRef[0].setStderr({
      batched: (text: string) => outputs.push(`[stderr] ${text}`),
    });

    await pyodideRef[0].runPythonAsync(codeToRun);
    return outputs.join("\n") || "(no output)";
  }, [pyodideRef]);

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
