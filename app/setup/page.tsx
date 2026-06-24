"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createSession } from "./actions";

const modes = [
  { value: "random", label: "Random", icon: "🎲", desc: "Random pairings" },
  { value: "skill", label: "Skill-Based", icon: "📊", desc: "Matched by skill level" },
  { value: "round-robin", label: "Round-Robin", icon: "🔄", desc: "Everyone plays everyone" },
];

const formats = [
  { value: "singles", label: "Singles", icon: "🏓", desc: "1 vs 1" },
  { value: "doubles", label: "Doubles", icon: "🎾", desc: "2 vs 2" },
  { value: "mix", label: "Mix", icon: "🔀", desc: "Alternating" },
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
            {modes.map((m) => {
              const selected = mode === m.value;
              return (
                <label
                  key={m.value}
                  className={`relative flex cursor-pointer flex-col rounded-xl border-2 p-3 text-left transition-all hover:border-primary/50 ${
                    selected
                      ? "border-primary bg-primary/10 shadow-sm shadow-primary/10"
                      : "border-border"
                  }`}
                >
                  <input
                    type="radio"
                    name="mode"
                    value={m.value}
                    checked={selected}
                    onChange={() => setMode(m.value)}
                    className="sr-only"
                  />
                  {selected && (
                    <span className="absolute right-2 top-2 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground">✓</span>
                  )}
                  <div className="text-sm font-medium">
                    <span className="mr-1.5">{m.icon}</span>{m.label}
                  </div>
                  <div className="mt-0.5 text-xs text-muted-foreground">{m.desc}</div>
                </label>
              );
            })}
          </div>
        </div>

        <div>
          <label className="mb-1.5 block text-xs uppercase tracking-wider text-muted-foreground">
            Format
          </label>
          <div className="grid grid-cols-3 gap-2">
            {formats.map((f) => {
              const selected = format === f.value;
              return (
                <label
                  key={f.value}
                  className={`relative flex cursor-pointer flex-col rounded-xl border-2 p-3 text-left transition-all hover:border-primary/50 ${
                    selected
                      ? "border-primary bg-primary/10 shadow-sm shadow-primary/10"
                      : "border-border"
                  }`}
                >
                  <input
                    type="radio"
                    name="format"
                    value={f.value}
                    checked={selected}
                    onChange={() => setFormat(f.value)}
                    className="sr-only"
                  />
                  {selected && (
                    <span className="absolute right-2 top-2 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground">✓</span>
                  )}
                  <div className="text-sm font-medium">
                    <span className="mr-1.5">{f.icon}</span>{f.label}
                  </div>
                  <div className="mt-0.5 text-xs text-muted-foreground">{f.desc}</div>
                </label>
              );
            })}
          </div>
        </div>

        <div>
          <label className="mb-1.5 block text-xs uppercase tracking-wider text-muted-foreground">
            Session Type
          </label>
          <div className="grid grid-cols-2 gap-2">
            <label
              className={`relative flex cursor-pointer items-center gap-2 rounded-xl border-2 p-3 text-sm font-medium transition-all hover:border-primary/50 ${
                sessionType === "drop-in"
                  ? "border-primary bg-primary/10 shadow-sm shadow-primary/10"
                  : "border-border"
              }`}
            >
              <input
                type="radio"
                name="session_type"
                value="drop-in"
                checked={sessionType === "drop-in"}
                onChange={() => setSessionType("drop-in")}
                className="sr-only"
              />
              {sessionType === "drop-in" && (
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground">✓</span>
              )}
              <span>🏓 Drop-in</span>
            </label>
            <label
              className={`relative flex cursor-pointer items-center gap-2 rounded-xl border-2 p-3 text-sm font-medium transition-all hover:border-primary/50 ${
                sessionType === "scheduled"
                  ? "border-primary bg-primary/10 shadow-sm shadow-primary/10"
                  : "border-border"
              }`}
            >
              <input
                type="radio"
                name="session_type"
                value="scheduled"
                checked={sessionType === "scheduled"}
                onChange={() => setSessionType("scheduled")}
                className="sr-only"
              />
              {sessionType === "scheduled" && (
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground">✓</span>
              )}
              <span>📅 Scheduled</span>
            </label>
          </div>
        </div>

        {(format === "doubles" || format === "mix") && (
          <div>
            <label className="mb-1.5 block text-xs uppercase tracking-wider text-muted-foreground">
              Doubles Teams
            </label>
            <div className="grid grid-cols-2 gap-2">
              <label
                className={`relative flex cursor-pointer items-center gap-2 rounded-xl border-2 p-3 text-sm font-medium transition-all hover:border-primary/50 ${
                  doublesPolicy === "fixed"
                  ? "border-primary bg-primary/10 shadow-sm shadow-primary/10"
                  : "border-border"
              }`}
            >
              <input
                type="radio"
                name="doubles_team_policy"
                value="fixed"
                checked={doublesPolicy === "fixed"}
                onChange={() => setDoublesPolicy("fixed")}
                className="sr-only"
              />
                {doublesPolicy === "fixed" && (
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground">✓</span>
                )}
                <span>Fixed All Session</span>
              </label>
              <label
                className={`relative flex cursor-pointer items-center gap-2 rounded-xl border-2 p-3 text-sm font-medium transition-all hover:border-primary/50 ${
                  doublesPolicy === "rematch"
                  ? "border-primary bg-primary/10 shadow-sm shadow-primary/10"
                  : "border-border"
              }`}
            >
              <input
                type="radio"
                name="doubles_team_policy"
                value="rematch"
                checked={doublesPolicy === "rematch"}
                onChange={() => setDoublesPolicy("rematch")}
                className="sr-only"
              />
                {doublesPolicy === "rematch" && (
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground">✓</span>
                )}
                <span>Re-match Each Round</span>
              </label>
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
