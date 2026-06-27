import { Hono } from "hono";
import type { APIContext } from "astro";

import { authGuard } from "../../server/middleware/auth";
import type { ServerEnv } from "../../server/auth/types";

function toHonoRequest(request: Request) {
  const url = new URL(request.url);
  url.pathname = url.pathname.replace(/^\/api/, "") || "/";

  return new Request(url, request);
}

const app = new Hono<ServerEnv>();

app.use("/me", authGuard);

app.get("/me", async (c) => {
  const user = c.get("meUser");

  return c.json({
    ok: true,
    user,
  });
});

export function GET(context: APIContext) {
  return app.fetch(toHonoRequest(context.request), {
    astro: context,
  });
}