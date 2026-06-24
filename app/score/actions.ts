"use server";

import { revalidatePath } from "next/cache";
import { createSupabaseServer } from "@/lib/supabase/server";

export async function getMatches(sessionId: string) {
  const supabase = await createSupabaseServer();

  const { data } = await supabase
    .from("matches")
    .select(`
      *,
      player1:players!matches_player1_id_fkey(name),
      player2:players!matches_player2_id_fkey(name),
      player3:players!matches_player3_id_fkey(name),
      player4:players!matches_player4_id_fkey(name)
    `)
    .eq("session_id", sessionId)
    .order("created_at", { ascending: false });

  return data || [];
}

export async function startMatch(matchId: string) {
  const supabase = await createSupabaseServer();

  await supabase
    .from("matches")
    .update({ status: "in_progress" })
    .eq("id", matchId);

  revalidatePath("/score");
}

export async function submitScore(formData: FormData) {
  const matchId = formData.get("match_id") as string;
  const setsRaw = formData.get("sets") as string;

  let sets: Array<{ p1: number; p2: number; tb: string | null }>;
  try {
    sets = JSON.parse(setsRaw);
  } catch {
    return { error: "Invalid score data" };
  }

  const supabase = await createSupabaseServer();

  // Insert scores for each set
  for (let i = 0; i < sets.length; i++) {
    await supabase.from("match_scores").insert({
      match_id: matchId,
      set_number: i + 1,
      player1_games: sets[i].p1,
      player2_games: sets[i].p2,
      tiebreak_score: sets[i].tb || null,
    });
  }

  // Calculate winner
  let p1Sets = 0;
  let p2Sets = 0;
  for (const set of sets) {
    if (set.p1 > set.p2) p1Sets++;
    else if (set.p2 > set.p1) p2Sets++;
  }

  const { data: match } = await supabase
    .from("matches")
    .select("player1_id, player2_id")
    .eq("id", matchId)
    .single();

  if (match) {
    await supabase.from("match_results").insert({
      match_id: matchId,
      winner_ids: p1Sets > p2Sets ? [match.player1_id] : [match.player2_id],
      loser_ids: p1Sets > p2Sets ? [match.player2_id] : [match.player1_id],
      sets_won_player1: p1Sets,
      sets_won_player2: p2Sets,
    });

    await supabase
      .from("matches")
      .update({ status: "completed" })
      .eq("id", matchId);
  }

  revalidatePath("/score");
  revalidatePath("/summary");
  return { success: true };
}
