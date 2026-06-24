import { NextResponse } from "next/server";
import { createSupabaseServer } from "@/lib/supabase/server";

export async function GET() {
  const supabase = await createSupabaseServer();

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
