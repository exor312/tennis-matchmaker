"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { submitScore } from "../actions";

interface SetScore {
  p1: number;
  p2: number;
  tb: string;
}

export default function ScoreDetailPage({ params }: { params: { matchId: string } }) {
  const router = useRouter();
  const [sets, setSets] = useState<SetScore[]>([{ p1: 0, p2: 0, tb: "" }]);
  const [error, setError] = useState<string | null>(null);

  function addSet() {
    if (sets.length < 3) {
      setSets([...sets, { p1: 0, p2: 0, tb: "" }]);
    }
  }

  function removeSet(index: number) {
    if (sets.length > 1) {
      setSets(sets.filter((_, i) => i !== index));
    }
  }

  function updateSet(index: number, field: keyof SetScore, value: string) {
    const updated = [...sets];
    if (field === "tb") {
      updated[index] = { ...updated[index], tb: value };
    } else {
      updated[index] = { ...updated[index], [field]: parseInt(value) || 0 };
    }
    setSets(updated);
  }

  async function handleSubmit() {
    const formData = new FormData();
    formData.append("match_id", params.matchId);
    formData.append("sets", JSON.stringify(sets));

    const result = await submitScore(formData);
    if (result?.error) {
      setError(result.error);
    } else {
      router.push("/score");
    }
  }

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-semibold tracking-tight">Enter Score</h1>

      <div className="space-y-4">
        {sets.map((set, i) => (
          <div key={i} className="rounded-xl border border-border bg-card p-4">
            <div className="mb-3 flex items-center justify-between">
              <span className="text-sm font-medium">Set {i + 1}</span>
              {sets.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeSet(i)}
                  className="text-xs text-destructive"
                >
                  Remove
                </button>
              )}
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="mb-1 block text-xs text-muted-foreground">
                  Player 1 Games
                </label>
                <select
                  value={set.p1}
                  onChange={(e) => updateSet(i, "p1", e.target.value)}
                  className="h-10 w-full rounded-lg border border-border bg-white px-3 text-sm"
                >
                  {[0, 1, 2, 3, 4, 5, 6, 7].map((n) => (
                    <option key={n} value={n}>{n}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="mb-1 block text-xs text-muted-foreground">
                  Player 2 Games
                </label>
                <select
                  value={set.p2}
                  onChange={(e) => updateSet(i, "p2", e.target.value)}
                  className="h-10 w-full rounded-lg border border-border bg-white px-3 text-sm"
                >
                  {[0, 1, 2, 3, 4, 5, 6, 7].map((n) => (
                    <option key={n} value={n}>{n}</option>
                  ))}
                </select>
              </div>
            </div>
            {(set.p1 === 6 && set.p2 === 6) || (set.p1 === 7 && set.p2 === 6) || (set.p1 === 6 && set.p2 === 7) ? (
              <div className="mt-3">
                <label className="mb-1 block text-xs text-muted-foreground">
                  Tiebreak Score (e.g. 7-5)
                </label>
                <input
                  type="text"
                  value={set.tb}
                  onChange={(e) => updateSet(i, "tb", e.target.value)}
                  placeholder="7-5"
                  className="h-9 w-full rounded-lg border border-border bg-white px-3 text-sm"
                />
              </div>
            ) : null}
          </div>
        ))}
      </div>

      {sets.length < 3 && (
        <button
          type="button"
          onClick={addSet}
          className="h-10 w-full rounded-lg border border-border text-sm font-medium text-muted-foreground transition-colors hover:bg-muted"
        >
          + Add Set
        </button>
      )}

      {error && <p className="text-sm text-destructive">{error}</p>}

      <button
        onClick={handleSubmit}
        className="h-10 w-full rounded-lg bg-primary font-medium text-primary-foreground transition-colors hover:bg-primary/90"
      >
        Submit Score
      </button>
    </div>
  );
}
