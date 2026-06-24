import React from "react";

interface MatchCardProps {
  match: {
    id: string;
    player1: { name: string } | null;
    player2: { name: string } | null;
    player3?: { name: string } | null;
    player4?: { name: string } | null;
    status: "pending" | "in_progress" | "completed";
    format: "singles" | "doubles" | "mix";
    scores?: Array<{
      set: number;
      p1_games: number;
      p2_games: number;
      p1_tiebreak?: number;
      p2_tiebreak?: number;
    }>;
    winner_ids?: string[];
    loser_ids?: string[];
  };
  variant: "active" | "pending" | "completed";
  expanded?: boolean;
  onScore?: () => void;
  onClick?: () => void;
  children?: React.ReactNode;
}

function capitalize(str: string | undefined | null): string {
  if (!str) return "";
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function getStatusBadge(status: MatchCardProps["match"]["status"]) {
  switch (status) {
    case "in_progress":
      return (
        <span className="inline-flex items-center rounded-full border border-green-500/20 bg-green-500/15 px-2 py-0.5 text-xs font-medium text-green-400">
          Live
        </span>
      );
    case "pending":
      return (
        <span className="inline-flex items-center rounded-full border border-white/10 bg-white/5 px-2 py-0.5 text-xs font-medium text-white/50">
          Pending
        </span>
      );
    case "completed":
      return (
        <span className="inline-flex items-center rounded-full border border-amber-500/20 bg-amber-500/15 px-2 py-0.5 text-xs font-medium text-amber-400">
          Completed
        </span>
      );
  }
}

function getVariantStyles(variant: MatchCardProps["variant"]): string {
  switch (variant) {
    case "active":
      return "border-green-500/30 bg-[#141414] shadow-[0_0_12px_rgba(34,197,94,0.12)]";
    case "pending":
      return "border-white/[0.06] bg-[#141414]";
    case "completed":
      return "border-white/[0.12] bg-[#141414]";
  }
}

function formatScoreForDisplay(
  scores: MatchCardProps["match"]["scores"] | undefined
): string[] {
  if (!scores || scores.length === 0) return [];
  return scores.map((s) => {
    if (s.p1_tiebreak !== undefined || s.p2_tiebreak !== undefined) {
      const tb1 = s.p1_tiebreak ?? "";
      const tb2 = s.p2_tiebreak ?? "";
      return `${s.p1_games}-${s.p2_games} (${tb1},${tb2})`;
    }
    return `${s.p1_games}-${s.p2_games}`;
  });
}

export default function MatchCard(props: MatchCardProps) {
  const { match, variant, expanded, onScore, onClick, children } = props;
  const isDoublesOrMix = match.format === "doubles" || match.format === "mix";
  const scoreLines = formatScoreForDisplay(match.scores);

  const variantStyles = getVariantStyles(variant);

  return (
    <div
      className={`rounded-xl border p-4 transition-all duration-200 ${variantStyles}`}
      onClick={onClick}
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={
        onClick
          ? (e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                onClick();
              }
            }
          : undefined
      }
    >
      <div className="flex items-center justify-between gap-3">
        {/* Player Info */}
        <div className="flex-1 min-w-0">
          <div className="flex flex-col gap-1">
            <span className="text-sm font-semibold text-white truncate">
              {capitalize(match.player1?.name) || "TBD"}
            </span>
            <span className="text-sm font-semibold text-white truncate">
              {capitalize(match.player2?.name) || "TBD"}
            </span>
          </div>
          {isDoublesOrMix && (match.player3 || match.player4) && (
            <div className="flex flex-col gap-0.5 mt-1">
              {match.player3 && (
                <span className="text-xs text-white/50 truncate">
                  {capitalize(match.player3.name)}
                </span>
              )}
              {match.player4 && (
                <span className="text-xs text-white/50 truncate">
                  {capitalize(match.player4.name)}
                </span>
              )}
            </div>
          )}
        </div>

        {/* Status / Score */}
        <div className="flex flex-col items-end gap-1.5">
          {getStatusBadge(match.status)}

          {/* Active variant: large score display when completed */}
          {variant === "active" && match.status === "completed" && scoreLines.length > 0 && (
            <div className="text-right">
              {scoreLines.map((line, i) => (
                <div
                  key={i}
                  className="text-2xl font-black tabular-nums text-white leading-tight"
                >
                  {line}
                </div>
              ))}
            </div>
          )}

          {/* Completed variant: inline score */}
          {variant === "completed" && scoreLines.length > 0 && (
            <div className="flex gap-1.5">
              {scoreLines.map((line, i) => (
                <span
                  key={i}
                  className="text-sm font-semibold tabular-nums text-white/80"
                >
                  {line}
                </span>
              ))}
            </div>
          )}

          {/* Pending variant: SCORE button */}
          {variant === "pending" && onScore && (
            <button
              type="button"
              className="rounded-full bg-green-500 px-3 py-0.5 text-xs font-semibold text-white hover:bg-green-400 transition-colors"
              onClick={(e) => {
                e.stopPropagation();
                onScore();
              }}
            >
              SCORE
            </button>
          )}
        </div>
      </div>

      {/* Expanded content: children rendered below the main row */}
      {expanded && <div className="mt-3 w-full">{children}</div>}
    </div>
  );
}
