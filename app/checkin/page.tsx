"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { joinSession } from "./actions";

const skillLabels = ["Beginner", "Casual", "Intermediate", "Advanced", "Pro"];

interface SessionData {
  id: string;
  name: string;
  format: string;
  mode: string;
}

export default function CheckinPage() {
  const router = useRouter();
  const [session, setSession] = useState<SessionData | null>(null);
  const [players, setPlayers] = useState<Array<{ id: string; name: string; skill_level: number }>>([]);
  const [name, setName] = useState("");
  const [skillLevel, setSkillLevel] = useState(3);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch("/api/session");
        if (res.ok) {
          const data = await res.json();
          setSession(data.session);
          setPlayers(data.players);
        }
      } catch {
        // no active session
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const formData = new FormData();
    formData.append("name", name);
    formData.append("skill_level", String(skillLevel));
    if (session) {
      formData.append("session_id", session.id);
      formData.append("format", session.format);
    }
    await joinSession(formData);
    router.push("/score");
  }

  if (loading) {
    return <div className="text-center text-sm text-muted-foreground">Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold tracking-tight">Check In</h1>
        {session && (
          <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">
            {session.format} · {session.mode}
          </span>
        )}
      </div>

      {session ? (
        <>
          <div className="rounded-xl border border-border bg-card p-4">
            <div className="text-sm font-medium">{session.name}</div>
            <div className="mt-1 text-xs text-muted-foreground">
              {players.length} player{players.length !== 1 ? "s" : ""} waiting
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="mb-1.5 block text-xs uppercase tracking-wider text-muted-foreground">
                Your Name
              </label>
              <input
                name="name"
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your name"
                className="h-10 w-full rounded-lg border border-border bg-white px-3 text-sm focus:ring-2 focus:ring-primary/30 focus:outline-none"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-xs uppercase tracking-wider text-muted-foreground">
                Skill Level
              </label>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((level) => (
                  <button
                    key={level}
                    type="button"
                    onClick={() => setSkillLevel(level)}
                    className={`flex h-10 flex-1 items-center justify-center rounded-lg border text-sm transition-colors ${
                      skillLevel === level
                        ? "border-primary bg-primary/5"
                        : "border-border hover:border-primary hover:bg-primary/5"
                    }`}
                  >
                    <span className="text-xs">{level}</span>
                  </button>
                ))}
              </div>
              <p className="mt-1 text-center text-xs text-muted-foreground">
                {skillLabels[skillLevel - 1]}
              </p>
            </div>

            <button
              type="submit"
              className="h-10 w-full rounded-lg bg-primary font-medium text-primary-foreground transition-colors hover:bg-primary/90"
            >
              Join Queue
            </button>
          </form>

          {players.length > 0 && (
            <div>
              <h2 className="mb-2 text-sm font-medium text-muted-foreground">
                In Queue
              </h2>
              <div className="space-y-2">
                {players.map((p) => (
                  <div
                    key={p.id}
                    className="flex items-center justify-between rounded-lg border border-border bg-card px-3 py-2"
                  >
                    <span className="text-sm">{p.name}</span>
                    <span className="text-xs text-muted-foreground">
                      {"★".repeat(p.skill_level)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      ) : (
        <div className="rounded-xl border border-border bg-card p-8 text-center">
          <p className="text-sm text-muted-foreground">
            No active session. Create one first.
          </p>
          <a
            href="/setup"
            className="mt-3 inline-block rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground"
          >
            Create Session
          </a>
        </div>
      )}
    </div>
  );
}
