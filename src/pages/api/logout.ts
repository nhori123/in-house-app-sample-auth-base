import type { APIContext } from "astro";
import { createSupabaseServerClient } from "../../lib/supabase";

export async function GET(context: APIContext) {
  const supabase = createSupabaseServerClient(context);
  await supabase.auth.signOut({ scope: "local" });

  return new Response(null, {
    status: 303,
    headers: { Location: "/login" },
  });
}