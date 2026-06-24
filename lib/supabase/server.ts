import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { cookies } from "next/headers";

export async function createSupabaseServer() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          try {
            cookieStore.set({ name, value, ...options });
          } catch {
            // Cookie setting may fail in Server Component
          }
        },
        remove(name: string, _options: CookieOptions) {
          try {
            cookieStore.set(name, "", { ..._options, maxAge: 0 });
          } catch {
            // Cookie removal may fail in Server Component
          }
        },
      },
    }
  );
}
