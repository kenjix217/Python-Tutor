"use client";

interface OutputPanelProps {
  output: string;
  error: string;
  isLoading: boolean;
}

export function OutputPanel({ output, error, isLoading }: OutputPanelProps) {
  if (isLoading) {
    return (
      <div className="h-[500px] flex items-center justify-center">
        <div className="flex items-center gap-3 text-zinc-500">
          <div className="w-6 h-6 border-2 border-zinc-300 border-t-emerald-500 rounded-full animate-spin" />
          <span>Running Python...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="h-[500px] overflow-auto">
      {error ? (
        <div className="p-4">
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
            <h4 className="text-red-800 dark:text-red-200 font-semibold mb-2">
              Error
            </h4>
            <pre className="text-sm text-red-700 dark:text-red-300 font-mono whitespace-pre-wrap">
              {error}
            </pre>
          </div>
        </div>
      ) : output ? (
        <div className="p-4">
          <div className="bg-zinc-900 rounded-lg p-4">
            <pre className="text-sm text-zinc-100 font-mono whitespace-pre-wrap">
              {output}
            </pre>
          </div>
        </div>
      ) : (
        <div className="h-full flex items-center justify-center text-zinc-400">
          <div className="text-center">
            <div className="text-4xl mb-2">⌨️</div>
            <p>Click "Run Code" to see output</p>
          </div>
        </div>
      )}
    </div>
  );
}
