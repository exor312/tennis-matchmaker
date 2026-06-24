import { getSummaryData, endSession } from "./actions";

export default async function SummaryPage() {
  const data = await getSummaryData();

  if (!data) {
    return (
      <div className="space-y-6">
        <h1 className="text-xl font-semibold tracking-tight">Daily Summary</h1>
        <div className="rounded-xl border border-border bg-card p-8 text-center">
          <p className="text-sm text-muted-foreground">No session data available.</p>
        </div>
      </div>
    );
  }

  const { session, totalMatches, totalPlayers, leaderboard, results } = data;

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-semibold tracking-tight">Daily Summary</h1>

      {/* Stats Banner */}
      <div className="grid grid-cols-3 gap-3">
        <div className="rounded-xl border border-border bg-card p-3 text-center">
          <div className="text-lg font-semibold">{totalMatches}</div>
          <div className="text-xs text-muted-foreground">Matches</div>
        </div>
        <div className="rounded-xl border border-border bg-card p-3 text-center">
          <div className="text-lg font-semibold">{totalPlayers}</div>
          <div className="text-xs text-muted-foreground">Players</div>
        </div>
        <div className="rounded-xl border border-border bg-card p-3 text-center">
          <div className="text-lg font-semibold">
            {new Date().toLocaleDateString("en-US", { month: "short", day: "numeric" })}
          </div>
          <div className="text-xs text-muted-foreground">Date</div>
        </div>
      </div>

      {/* Leaderboard */}
      <div>
        <h2 className="mb-3 text-sm font-medium text-muted-foreground">Leaderboard</h2>
        <div className="overflow-hidden rounded-xl border border-border bg-card">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/50">
                <th className="px-3 py-2 text-left text-xs font-medium">#</th>
                <th className="px-3 py-2 text-left text-xs font-medium">Player</th>
                <th className="px-3 py-2 text-center text-xs font-medium">W</th>
                <th className="px-3 py-2 text-center text-xs font-medium">L</th>
                <th className="px-3 py-2 text-center text-xs font-medium">Win%</th>
                <th className="px-3 py-2 text-center text-xs font-medium">Sets</th>
              </tr>
            </thead>
            <tbody>
              {leaderboard.map((entry, i) => (
                <tr key={entry.player_id} className="border-b border-border last:border-0">
                  <td className="px-3 py-2 text-muted-foreground">{i + 1}</td>
                  <td className="px-3 py-2 font-medium">{entry.player_name}</td>
                  <td className="px-3 py-2 text-center text-success">{entry.wins}</td>
                  <td className="px-3 py-2 text-center text-destructive">{entry.losses}</td>
                  <td className="px-3 py-2 text-center">{entry.win_percentage}%</td>
                  <td className="px-3 py-2 text-center text-xs">
                    {entry.sets_won}-{entry.sets_lost}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {leaderboard.length === 0 && (
            <div className="px-3 py-6 text-center text-sm text-muted-foreground">
              No completed matches yet.
            </div>
          )}
        </div>
      </div>

      {/* Match Results */}
      <div>
        <h2 className="mb-3 text-sm font-medium text-muted-foreground">Match Results</h2>
        <div className="space-y-2">
          {results.map((result) => {
            const match = result.match as any;
            return (
              <div
                key={result.id}
                className="rounded-xl border border-border bg-card p-3"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-sm font-medium">
                      {match?.player1?.name || "?"}
                    </span>
                    <span className="text-muted-foreground"> vs </span>
                    <span className="text-sm font-medium">
                      {match?.player2?.name || "?"}
                    </span>
                  </div>
                  <span className="text-sm font-semibold">
                    {result.sets_won_player1}-{result.sets_won_player2}
                  </span>
                </div>
              </div>
            );
          })}
          {results.length === 0 && (
            <p className="text-center text-sm text-muted-foreground">No results yet.</p>
          )}
        </div>
      </div>

      {/* End Session */}
      <form action={endSession}>
        <button
          type="submit"
          className="h-10 w-full rounded-lg border border-destructive bg-white font-medium text-destructive transition-colors hover:bg-destructive/5"
        >
          End Session
        </button>
      </form>
    </div>
  );
}
