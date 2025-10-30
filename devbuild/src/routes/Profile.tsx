import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { getAiSettings, setAiEnabled, setAiKey, validateGeminiKey } from "@/lib/ai";

export default function Profile() {
  const [aiEnabledState, setAiEnabledState] = useState(false);
  const [key, setKey] = useState("");
  const [valid, setValid] = useState<"unknown" | "valid" | "invalid">("unknown");

  useEffect(() => {
    const { enabled, key } = getAiSettings();
    setAiEnabledState(enabled);
    setKey(key);
  }, []);

  async function handleToggle() {
    const next = !aiEnabledState;
    setAiEnabled(next);
    setAiEnabledState(next);
  }

  async function handleSaveKey() {
    setAiKey(key);
    const ok = await validateGeminiKey(key);
    setValid(ok ? "valid" : "invalid");
  }
  return (
    <div className="p-6 space-y-4">
      <h2 className="text-2xl font-semibold">Profile</h2>
      <div className="space-y-2">
        <label className="font-medium">AI review</label>
        <div className="text-sm text-muted-foreground">Bring-your-own Gemini key, disabled by default.</div>
        <div className="flex gap-2">
          <Button variant={aiEnabledState ? "default" : "outline"} onClick={handleToggle}>
            {aiEnabledState ? "Enabled" : "Disabled"}
          </Button>
        </div>
        <div className="grid gap-2 max-w-md pt-2">
          <input
            value={key}
            onChange={(e) => setKey(e.target.value)}
            placeholder="Gemini API key"
            className="h-9 rounded-md border px-3 text-sm bg-background"
          />
          <div className="flex gap-2 items-center">
            <Button variant="outline" onClick={handleSaveKey}>Save & Validate</Button>
            {valid === "valid" && <span className="text-xs text-green-600">Key valid</span>}
            {valid === "invalid" && <span className="text-xs text-red-600">Invalid key</span>}
          </div>
        </div>
      </div>
    </div>
  );
}


