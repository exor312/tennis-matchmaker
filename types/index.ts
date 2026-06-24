// Database entity types
export type MatchmakingMode = "random" | "skill" | "round-robin";
export type Format = "singles" | "doubles" | "mix";
export type SessionType = "drop-in" | "scheduled";
export type DoublesTeamPolicy = "fixed" | "rematch";
export type MatchStatus = "pending" | "in_progress" | "completed";

export interface Session {
  id: string;
  name: string;
  mode: MatchmakingMode;
  format: Format;
  session_type: SessionType;
  doubles_team_policy: DoublesTeamPolicy;
  starts_at: string | null;
  ends_at: string | null;
  created_at: string;
}

export interface Player {
  id: string;
  name: string;
  skill_level: number;
  session_id: string;
  created_at: string;
}

export interface Match {
  id: string;
  session_id: string;
  player1_id: string;
  player2_id: string;
  player3_id: string | null;
  player4_id: string | null;
  format: Format;
  status: MatchStatus;
  created_at: string;
}

export interface MatchScore {
  id: string;
  match_id: string;
  set_number: number;
  player1_games: number;
  player2_games: number;
  tiebreak_score: string | null;
  created_at: string;
}

export interface MatchResult {
  id: string;
  match_id: string;
  winner_ids: string[];
  loser_ids: string[];
  sets_won_player1: number;
  sets_won_player2: number;
  created_at: string;
}

// UI types
export interface LeaderboardEntry {
  player_id: string;
  player_name: string;
  wins: number;
  losses: number;
  win_percentage: number;
  sets_won: number;
  sets_lost: number;
}
