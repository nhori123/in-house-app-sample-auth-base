import type { APIContext } from "astro";
import { createSupabaseServerClient } from "../../lib/supabase";

export interface MeUser {
  id: string;
  email: string | undefined;
}

export async function getMeUser(context: APIContext): Promise<MeUser | null> {
  const supabase = createSupabaseServerClient(context);
  const { data, error } = await supabase.auth.getUser();

  if (error || !data.user) {
    return null;
  }

  return {
    id: data.user.id,
    email: data.user.email,
  };
}