import { NextResponse } from "next/server";
import { createSupabaseServer } from "@/lib/supabase/server";

export async function GET(request: Request) {
  const supabase = await createSupabaseServer();
  const { searchParams } = new URL(request.url);
  const sessionId = searchParams.get("session_id");

  if (sessionId) {
    // Get specific session + its players
    const { data: session } = await supabase
      .from("sessions")
      .select("*")
      .eq("id", sessionId)
      .single();

    if (!session) {
      return NextResponse.json({ session: null, players: [] });
    }

    const { data: players } = await supabase
      .from("players")
      .select("*")
      .eq("session_id", session.id)
      .order("created_at", { ascending: true });

    return NextResponse.json({ session, players: players || [] });
  }

  // Default: return most recent session
  const { data: session } = await supabase
    .from("sessions")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(1)
    .single();

  if (!session) {
    return NextResponse.json({ session: null, players: [] });
  }

  const { data: players } = await supabase
    .from("players")
    .select("*")
    .eq("session_id", session.id)
    .order("created_at", { ascending: true });

  return NextResponse.json({ session, players: players || [] });
}
