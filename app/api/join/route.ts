import { NextResponse } from "next/server";
import { createSupabaseServer } from "@/lib/supabase/server";

export async function POST(request: Request) {
  const supabase = await createSupabaseServer();

  // 1. Read form data
  let name: string;
  let skillLevel: number;
  try {
    const formData = await request.formData();
    name = formData.get("name") as string;
    const skillLevelRaw = formData.get("skill_level");
    skillLevel = skillLevelRaw ? parseInt(skillLevelRaw as string, 10) : 3;
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  if (!name || name.trim() === "") {
    return NextResponse.json({ error: "Name is required" }, { status: 400 });
  }

  // 2. Look for an active session
  let { data: activeSession } = await supabase
    .from("sessions")
    .select("*")
    .eq("active", true)
    .order("created_at", { ascending: false })
    .limit(1)
    .single();

  // 3. If no active session, auto-create one
  if (!activeSession) {
    const { data: newSession, error: sessionError } = await supabase
      .from("sessions")
      .insert({
        name: "Open Play",
        format: "singles",
        mode: "random",
        active: true,
      })
      .select()
      .single();

    if (sessionError || !newSession) {
      return NextResponse.json({ error: "Failed to create session" }, { status: 500 });
    }

    activeSession = newSession;
  }

  // 4. Add player to the session
  const { data: player, error: playerError } = await supabase
    .from("players")
    .insert({
      session_id: activeSession.id,
      name: name.trim(),
      skill_level: skillLevel,
    })
    .select()
    .single();

  if (playerError || !player) {
    return NextResponse.json({ error: "Failed to add player" }, { status: 500 });
  }

  // 5. If 2+ players in queue, auto-create a match
  let matchCreated = false;
  let matchId: string | undefined;

  const { data: queuedPlayers } = await supabase
    .from("players")
    .select("id")
    .eq("session_id", activeSession.id)
    .order("created_at", { ascending: true });

  if (queuedPlayers && queuedPlayers.length >= 2) {
    const player1 = queuedPlayers[0];
    const player2 = queuedPlayers[1];

    const { data: match, error: matchError } = await supabase
      .from("matches")
      .insert({
        session_id: activeSession.id,
        player1_id: player1.id,
        player2_id: player2.id,
        status: "pending",
      })
      .select()
      .single();

    if (!matchError && match) {
      matchCreated = true;
      matchId = match.id;
    }
  }

  // 6. Return response
  return NextResponse.json({
    success: true,
    sessionId: activeSession.id,
    playerId: player.id,
    matchCreated,
    matchId,
  });
}
