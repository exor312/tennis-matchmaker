import { NextResponse } from "next/server";
import { createSupabaseServer } from "@/lib/supabase/server";

interface Standing {
  rank: number;
  name: string;
  wins: number;
  losses: number;
  winPercentage: number;
}

export async function GET() {
  const supabase = await createSupabaseServer();

  // 1. Get active session
  const { data: activeSession, error: sessionError } = await supabase
    .from("sessions")
    .select("*")
    .eq("active", true)
    .order("created_at", { ascending: false })
    .limit(1)
    .single();

  if (sessionError || !activeSession) {
    return NextResponse.json({ standings: [] });
  }

  // 2. Get all completed matches in session
  const { data: matches } = await supabase
    .from("matches")
    .select("*")
    .eq("session_id", activeSession.id)
    .eq("status", "completed")
    .order("created_at", { ascending: true });

  if (!matches || matches.length === 0) {
    return NextResponse.json({ standings: [] });
  }

  // 3. Compute standings: count wins and losses per player
  const playerStats: Record<string, { name: string; wins: number; losses: number }> = {};

  for (const match of matches) {
    const winnerId = match.winner_id;
    const player1Id = match.player1_id;
    const player2Id = match.player2_id;

    // Initialize player entries if not present
    if (!playerStats[player1Id]) {
      playerStats[player1Id] = { name: "", wins: 0, losses: 0 };
    }
    if (!playerStats[player2Id]) {
      playerStats[player2Id] = { name: "", wins: 0, losses: 0 };
    }

    if (winnerId) {
      if (winnerId === player1Id) {
        playerStats[player1Id].wins += 1;
        playerStats[player2Id].losses += 1;
      } else if (winnerId === player2Id) {
        playerStats[player2Id].wins += 1;
        playerStats[player1Id].losses += 1;
      }
    }
  }

  // Fetch player names
  const playerIds = Object.keys(playerStats);
  if (playerIds.length > 0) {
    const { data: players } = await supabase
      .from("players")
      .select("id, name")
      .in("id", playerIds);

    if (players) {
      for (const player of players) {
        if (playerStats[player.id]) {
          playerStats[player.id].name = player.name;
        }
      }
    }
  }

  // 4-5. Build standings array, compute win percentage, sort
  const standings: Standing[] = Object.entries(playerStats)
    .map(([_, stats]) => {
      const total = stats.wins + stats.losses;
      const winPercentage = total > 0 ? stats.wins / total : 0;
      return {
        rank: 0,
        name: stats.name,
        wins: stats.wins,
        losses: stats.losses,
        winPercentage,
      };
    })
    .sort((a, b) => {
      if (b.winPercentage !== a.winPercentage) {
        return b.winPercentage - a.winPercentage;
      }
      return b.wins - a.wins;
    });

  // 6. Assign ranks
  standings.forEach((entry, index) => {
    entry.rank = index + 1;
  });

  return NextResponse.json({ standings });
}
