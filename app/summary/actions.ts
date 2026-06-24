"use server";

import { revalidatePath } from "next/cache";
import { createSupabaseServer } from "@/lib/supabase/server";
import { getActiveSession } from "@/app/checkin/actions";
import type { LeaderboardEntry } from "@/types";

export async function getSummaryData() {
  const supabase = await createSupabaseServer();
  const session = await getActiveSession();

  if (!session) return null;

  // Get all completed matches with results
  const { data: results } = await supabase
    .from("match_results")
    .select(`
      *,
      match:matches!match_results_match_id_fkey(
        player1_id, player2_id, player3_id, player4_id,
        player1:players!matches_player1_id_fkey(name),
        player2:players!matches_player2_id_fkey(name),
        player3:players!matches_player3_id_fkey(name),
        player4:players!matches_player4_id_fkey(name)
      )
    `)
    .eq("match.session_id", session.id);

  // Get all players
  const { data: players } = await supabase
    .from("players")
    .select("*")
    .eq("session_id", session.id);

  // Calculate leaderboard
  const stats: Record<string, LeaderboardEntry> = {};

  for (const player of players || []) {
    stats[player.id] = {
      player_id: player.id,
      player_name: player.name,
      wins: 0,
      losses: 0,
      win_percentage: 0,
      sets_won: 0,
      sets_lost: 0,
    };
  }

  for (const result of results || []) {
    for (const winnerId of result.winner_ids) {
      if (stats[winnerId]) stats[winnerId].wins++;
    }
    for (const loserId of result.loser_ids) {
      if (stats[loserId]) stats[loserId].losses++;
    }
    // Sets won/lost - simplified
    const match = result.match as any;
    if (match) {
      if (stats[match.player1_id]) {
        stats[match.player1_id].sets_won += result.sets_won_player1;
        stats[match.player1_id].sets_lost += result.sets_won_player2;
      }
      if (stats[match.player2_id]) {
        stats[match.player2_id].sets_won += result.sets_won_player2;
        stats[match.player2_id].sets_lost += result.sets_won_player1;
      }
    }
  }

  // Calculate win percentage
  for (const id of Object.keys(stats)) {
    const s = stats[id];
    const total = s.wins + s.losses;
    s.win_percentage = total > 0 ? Math.round((s.wins / total) * 100) : 0;
  }

  const leaderboard = Object.values(stats).sort(
    (a, b) => b.win_percentage - a.win_percentage || b.wins - a.wins
  );

  return {
    session,
    totalMatches: results?.length || 0,
    totalPlayers: players?.length || 0,
    leaderboard,
    results: results || [],
  };
}

export async function endSession() {
  "use server";
  const supabase = await createSupabaseServer();
  const session = await getActiveSession();

  if (session) {
    await supabase
      .from("sessions")
      .update({ ends_at: new Date().toISOString() })
      .eq("id", session.id);
  }

  revalidatePath("/");
  revalidatePath("/summary");
}
