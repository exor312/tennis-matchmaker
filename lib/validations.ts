import { z } from "zod";

export const sessionSetupSchema = z.object({
  name: z.string().min(1, "Session name is required"),
  mode: z.enum(["random", "skill", "round-robin"]),
  format: z.enum(["singles", "doubles", "mix"]),
  session_type: z.enum(["drop-in", "scheduled"]),
  doubles_team_policy: z.enum(["fixed", "rematch"]).optional().default("fixed"),
  starts_at: z.string().optional(),
  ends_at: z.string().optional(),
});

export const playerCheckinSchema = z.object({
  name: z.string().min(1, "Name is required"),
  skill_level: z.number().min(1).max(5),
});

export const scoreEntrySchema = z.object({
  sets: z.array(
    z.object({
      player1_games: z.number().min(0).max(7),
      player2_games: z.number().min(0).max(7),
      tiebreak_score: z.string().optional(),
    })
  ).min(1).max(3),
});

export type SessionSetupInput = z.infer<typeof sessionSetupSchema>;
export type PlayerCheckinInput = z.infer<typeof playerCheckinSchema>;
export type ScoreEntryInput = z.infer<typeof scoreEntrySchema>;
