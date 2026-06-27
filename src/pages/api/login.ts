import type { APIContext } from "astro";
import { createSupabaseServerClient } from "../../lib/supabase";

export async function POST(context: APIContext) {
  const formData = await context.request.formData();
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  const supabase = createSupabaseServerClient(context);
  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    return new Response(null, {
      status: 303,
      headers: { Location: "/login?error=1" },
    });
  }

  return new Response(null, {
    status: 303,
    headers: { Location: "/dashboard" },
  });
}