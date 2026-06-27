import { createBrowserClient, createServerClient, parseCookieHeader } from "@supabase/ssr";
import type { APIContext } from "astro";

const supabaseUrl = import.meta.env.SUPABASE_URL;
const supabaseKey = import.meta.env.SUPABASE_KEY;

export function createSupabaseServerClient(context: Pick<APIContext, "request" | "cookies">) {
  return createServerClient(supabaseUrl, supabaseKey, {
    cookies: {
      getAll(): Array<{ name: string; value: string }> {
        return parseCookieHeader(context.request.headers.get("Cookie") ?? "").filter(
          (cookie): cookie is { name: string; value: string } => typeof cookie.value === "string",
        );
      },
      setAll(
        cookiesToSet: Array<{
          name: string;
          value: string;
          options: any;
        }>,
      ) {
        cookiesToSet.forEach(({ name, value, options }) => {
          context.cookies.set(name, value, options);
        });
      },
    },
  });
}

export function createSupabaseBrowserClient() {
  return createBrowserClient(supabaseUrl, supabaseKey);
}