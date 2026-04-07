"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { loadPyodide, PyodideInterface } from "pyodide";

interface UsePyodideReturn {
  pyodide: PyodideInterface | null;
  isReady: boolean;
  isLoading: boolean;
  error: Error | null;
  runCode: (code: string) => Promise<string>;
}

export function usePyodide(): UsePyodideReturn {
  const [pyodide, setPyodide] = useState<PyodideInterface | null>(null);
  const [isReady, setIsReady] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const pyodideRef = useRef<PyodideInterface | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function initPyodide() {
      try {
        const instance = await loadPyodide({
          indexURL: "https://cdn.jsdelivr.net/pyodide/v0.27.0/full/",
        });

        if (!isMounted) return;

        // Set up stdout/stderr capture
        const outputs: string[] = [];
        
        instance.setStdout({
          batched: (text: string) => {
            outputs.push(text);
          },
        });

        instance.setStderr({
          batched: (text: string) => {
            outputs.push(`[stderr] ${text}`);
          },
        });

        // Store outputs reference
        (instance as any)._outputs = outputs;

        pyodideRef.current = instance;
        setPyodide(instance);
        setIsReady(true);
      } catch (err) {
        if (!isMounted) return;
        setError(err instanceof Error ? err : new Error("Failed to load Pyodide"));
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    initPyodide();

    return () => {
      isMounted = false;
    };
  }, []);

  const runCode = useCallback(async (code: string): Promise<string> => {
    if (!pyodideRef.current) {
      throw new Error("Pyodide not initialized");
    }

    // Clear previous outputs
    const outputs: string[] = [];
    (pyodideRef.current as any)._outputs = outputs;

    // Set up capture
    pyodideRef.current.setStdout({
      batched: (text: string) => {
        outputs.push(text);
      },
    });

    pyodideRef.current.setStderr({
      batched: (text: string) => {
        outputs.push(`[stderr] ${text}`);
      },
    });

    try {
      // Run the code with a timeout
      const runPromise = pyodideRef.current.runPythonAsync(code);
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error("Execution timeout (10s exceeded)")), 10000);
      });

      await Promise.race([runPromise, timeoutPromise]);

      return outputs.join("\n") || "(no output)";
    } catch (err) {
      throw err;
    }
  }, []);

  return {
    pyodide,
    isReady,
    isLoading,
    error,
    runCode,
  };
}
