import { useCallback, useEffect, useMemo, useState } from "react";
import Editor from "@monaco-editor/react";
import { cn } from "@/lib/utils";

export type FileMap = Record<string, string>;

type Props = {
  files: FileMap;
  onChange: (next: FileMap) => void;
  height?: string | number;
};

export default function EditorPane({ files, onChange, height = 520 }: Props) {
  const paths = useMemo(() => Object.keys(files), [files]);
  const [active, setActive] = useState<string | null>(paths[0] ?? null);

  useEffect(() => {
    if (!active && paths.length) setActive(paths[0]);
  }, [paths, active]);

  const handleChange = useCallback(
    (value?: string) => {
      if (!active) return;
      onChange({ ...files, [active]: value ?? "" });
    },
    [active, files, onChange]
  );

  const language = useMemo(() => inferLanguage(active ?? ""), [active]);

  return (
    <div className="w-full border rounded-md overflow-hidden">
      <div className="flex items-center gap-1 border-b bg-secondary/40">
        {paths.map((p) => (
          <button
            key={p}
            onClick={() => setActive(p)}
            className={cn(
              "px-3 py-2 text-sm hover:bg-accent",
              active === p && "bg-background border-b-2 border-primary"
            )}
          >
            {p}
          </button>
        ))}
      </div>
      {active ? (
        <Editor
          value={files[active]}
          onChange={handleChange}
          language={language}
          theme="vs-dark"
          height={height}
          options={{ fontSize: 14, minimap: { enabled: false } }}
        />
      ) : (
        <div className="p-6 text-sm text-muted-foreground">No file selected.</div>
      )}
    </div>
  );
}

function inferLanguage(path: string): string | undefined {
  if (path.endsWith(".ts") || path.endsWith(".tsx")) return "typescript";
  if (path.endsWith(".js") || path.endsWith(".jsx")) return "javascript";
  if (path.endsWith(".json")) return "json";
  if (path.endsWith(".css")) return "css";
  if (path.endsWith(".html")) return "html";
  return undefined;
}


