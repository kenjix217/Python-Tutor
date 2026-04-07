"use client";

import Editor from "@monaco-editor/react";
import { useTheme } from "next-themes";

interface CodeEditorProps {
  value: string;
  onChange: (value: string) => void;
  language?: string;
  height?: string;
}

export function CodeEditor({
  value,
  onChange,
  language = "python",
  height = "100%",
}: CodeEditorProps) {
  return (
    <Editor
      height={height}
      defaultLanguage={language}
      value={value}
      onChange={(newValue) => onChange(newValue || "")}
      theme="vs-dark"
      options={{
        minimap: { enabled: false },
        fontSize: 14,
        lineNumbers: "on",
        roundedSelection: false,
        scrollBeyondLastLine: false,
        readOnly: false,
        automaticLayout: true,
        padding: { top: 16, bottom: 16 },
        folding: true,
        lineHeight: 24,
        tabSize: 4,
        insertSpaces: true,
        wordWrap: "on",
      }}
    />
  );
}
