import { NextResponse } from "next/server";
import { createSupabaseServer } from "@/lib/supabase/server";

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
    return NextResponse.json({ players: [], matches: [] });
  }

  // 2. Get all players in session (ordered by created_at)
  const { data: players } = await supabase
    .from("players")
    .select("id, name, skill_level")
    .eq("session_id", activeSession.id)
    .order("created_at", { ascending: true });

  // 3. Get all matches in session (ordered by created_at)
  const { data: matches } = await supabase
    .from("matches")
    .select("*")
    .eq("session_id", activeSession.id)
    .order("created_at", { ascending: true });

  // 4. Return bracket data
  return NextResponse.json({
    players: players || [],
    matches: matches || [],
  });
}
