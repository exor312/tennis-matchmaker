"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createSession } from "./actions";

const modes = [
  { value: "random", label: "Random", desc: "Random pairings" },
  { value: "skill", label: "Skill-Based", desc: "Matched by skill level" },
  { value: "round-robin", label: "Round-Robin", desc: "Everyone plays everyone" },
];

const formats = [
  { value: "singles", label: "Singles", desc: "1 vs 1" },
  { value: "doubles", label: "Doubles", desc: "2 vs 2" },
  { value: "mix", label: "Mix", desc: "Alternating" },
];

export default function SetupPage() {
  const router = useRouter();
  const [mode, setMode] = useState("random");
  const [format, setFormat] = useState("singles");
  const [sessionType, setSessionType] = useState("drop-in");
  const [doublesPolicy, setDoublesPolicy] = useState("fixed");
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(formData: FormData) {
    const result = await createSession(formData);
    if (result?.error) {
      setError(result.error);
    }
  }

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-semibold tracking-tight">New Session</h1>

      <form action={handleSubmit} className="space-y-5">
        <div>
          <label className="mb-1.5 block text-xs uppercase tracking-wider text-muted-foreground">
            Session Name
          </label>
          <input
            name="name"
            type="text"
            required
            placeholder="Tuesday Open Play"
            className="h-10 w-full rounded-lg border border-border bg-white px-3 text-sm focus:ring-2 focus:ring-primary/30 focus:outline-none"
          />
        </div>

        <div>
          <label className="mb-1.5 block text-xs uppercase tracking-wider text-muted-foreground">
            Matchmaking Mode
          </label>
          <div className="grid grid-cols-3 gap-2">
            {modes.map((m) => (
              <button
                key={m.value}
                type="button"
                onClick={() => setMode(m.value)}
                data-selected={mode === m.value}
                className="rounded-xl border-2 p-3 text-left transition-all hover:border-border data-[selected=true]:border-primary data-[selected=true]:bg-primary/5"
              >
                <input type="hidden" name="mode" value={mode} />
                <div className="text-sm font-medium">{m.label}</div>
                <div className="text-xs text-muted-foreground">{m.desc}</div>
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="mb-1.5 block text-xs uppercase tracking-wider text-muted-foreground">
            Format
          </label>
          <div className="grid grid-cols-3 gap-2">
            {formats.map((f) => (
              <button
                key={f.value}
                type="button"
                onClick={() => setFormat(f.value)}
                data-selected={format === f.value}
                className="rounded-xl border-2 p-3 text-left transition-all hover:border-border data-[selected=true]:border-primary data-[selected=true]:bg-primary/5"
              >
                <input type="hidden" name="format" value={format} />
                <div className="text-sm font-medium">{f.label}</div>
                <div className="text-xs text-muted-foreground">{f.desc}</div>
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="mb-1.5 block text-xs uppercase tracking-wider text-muted-foreground">
            Session Type
          </label>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => setSessionType("drop-in")}
              data-selected={sessionType === "drop-in"}
              className="rounded-xl border-2 p-3 text-sm font-medium transition-all data-[selected=true]:border-primary data-[selected=true]:bg-primary/5"
            >
              <input type="hidden" name="session_type" value={sessionType} />
              Drop-in
            </button>
            <button
              type="button"
              onClick={() => setSessionType("scheduled")}
              data-selected={sessionType === "scheduled"}
              className="rounded-xl border-2 p-3 text-sm font-medium transition-all data-[selected=true]:border-primary data-[selected=true]:bg-primary/5"
            >
              Scheduled
            </button>
          </div>
        </div>

        {(format === "doubles" || format === "mix") && (
          <div>
            <label className="mb-1.5 block text-xs uppercase tracking-wider text-muted-foreground">
              Doubles Teams
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setDoublesPolicy("fixed")}
                data-selected={doublesPolicy === "fixed"}
                className="rounded-xl border-2 p-3 text-sm font-medium transition-all data-[selected=true]:border-primary data-[selected=true]:bg-primary/5"
              >
                <input type="hidden" name="doubles_team_policy" value={doublesPolicy} />
                Fixed All Session
              </button>
              <button
                type="button"
                onClick={() => setDoublesPolicy("rematch")}
                data-selected={doublesPolicy === "rematch"}
                className="rounded-xl border-2 p-3 text-sm font-medium transition-all data-[selected=true]:border-primary data-[selected=true]:bg-primary/5"
              >
                Re-match Each Round
              </button>
            </div>
          </div>
        )}

        {error && (
          <p className="text-sm text-destructive">{error}</p>
        )}

        <button
          type="submit"
          className="h-10 w-full rounded-lg bg-primary font-medium text-primary-foreground transition-colors hover:bg-primary/90"
        >
          Create Session
        </button>
      </form>
    </div>
  );
}
