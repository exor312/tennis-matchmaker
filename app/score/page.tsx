import { getMatches } from "./actions";
import { getActiveSession } from "@/app/checkin/actions";

export default async function ScorePage() {
  const session = await getActiveSession();
  const matches = session ? await getMatches(session.id) : [];

  const statusColors: Record<string, string> = {
    pending: "bg-yellow-100 text-yellow-800",
    in_progress: "bg-blue-100 text-blue-800",
    completed: "bg-green-100 text-green-800",
  };

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-semibold tracking-tight">Active Matches</h1>

      {matches.length === 0 ? (
        <div className="rounded-xl border border-border bg-card p-8 text-center">
          <p className="text-sm text-muted-foreground">No matches yet.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {matches.map((match) => (
            <div
              key={match.id}
              className="rounded-xl border border-border bg-card p-4"
            >
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm font-medium">
                    {match.player1?.name || "TBD"} vs {match.player2?.name || "TBD"}
                  </div>
                  {match.format !== "singles" && match.player3 && (
                    <div className="text-xs text-muted-foreground">
                      {match.player3?.name} & {match.player4?.name}
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <span
                    className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                      statusColors[match.status] || ""
                    }`}
                  >
                    {match.status.replace("_", " ")}
                  </span>
                  {match.status === "pending" && (
                    <form action="/score">
                      <button
                        type="submit"
                        className="rounded-lg bg-primary px-3 py-1 text-xs font-medium text-primary-foreground"
                      >
                        Start
                      </button>
                    </form>
                  )}
                  {match.status === "in_progress" && (
                    <a
                      href={`/score/${match.id}`}
                      className="rounded-lg bg-primary px-3 py-1 text-xs font-medium text-primary-foreground"
                    >
                      Score
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
