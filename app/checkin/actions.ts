"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createSupabaseServer } from "@/lib/supabase/server";
import { playerCheckinSchema } from "@/lib/validations";

export async function joinSession(formData: FormData): Promise<void> {
  const rawData = {
    name: formData.get("name") as string,
    skill_level: parseInt(formData.get("skill_level") as string) || 3,
  };

  const validated = playerCheckinSchema.safeParse(rawData);
  if (!validated.success) {
    return;
  }

  const sessionId = formData.get("session_id") as string;
  if (!sessionId) {
    return;
  }

  const supabase = await createSupabaseServer();

  // Insert player
  const { error: insertError } = await supabase
    .from("players")
    .insert({
      name: validated.data.name,
      skill_level: validated.data.skill_level,
      session_id: sessionId,
    });

  if (insertError) {
    console.error("Check-in error:", insertError);
    return;
  }

  revalidatePath("/checkin");
  revalidatePath("/score");
  redirect("/score");
}

export async function getActiveSession() {
  const supabase = await createSupabaseServer();

  const { data, error } = await supabase
    .from("sessions")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(1)
    .single();

  if (error) return null;
  return data;
}

export async function getSessionPlayers(sessionId: string) {
  const supabase = await createSupabaseServer();

  const { data } = await supabase
    .from("players")
    .select("*")
    .eq("session_id", sessionId)
    .order("created_at", { ascending: true });

  return data || [];
}
