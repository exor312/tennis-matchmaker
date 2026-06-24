"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createSupabaseServer } from "@/lib/supabase/server";
import { sessionSetupSchema } from "@/lib/validations";
import type { MatchmakingMode, Format, SessionType } from "@/types";

export async function createSession(formData: FormData) {
  const rawData = {
    name: formData.get("name") as string,
    mode: formData.get("mode") as MatchmakingMode,
    format: formData.get("format") as Format,
    session_type: formData.get("session_type") as SessionType,
    doubles_team_policy: (formData.get("doubles_team_policy") as string) || "fixed",
    starts_at: formData.get("starts_at") as string || null,
    ends_at: formData.get("ends_at") as string || null,
  };

  const validated = sessionSetupSchema.safeParse(rawData);
  if (!validated.success) {
    return { error: validated.error.issues[0].message };
  }

  const supabase = await createSupabaseServer();

  const { data, error } = await supabase
    .from("sessions")
    .insert({
      name: validated.data.name,
      mode: validated.data.mode,
      format: validated.data.format,
      session_type: validated.data.session_type,
      doubles_team_policy: validated.data.doubles_team_policy,
      starts_at: validated.data.starts_at || null,
      ends_at: validated.data.ends_at || null,
    })
    .select()
    .single();

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/");
  redirect(`/checkin?session=${data.id}`);
}
