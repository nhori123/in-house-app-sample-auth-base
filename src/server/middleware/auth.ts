import { createMiddleware } from "hono/factory";

import { getMeUser } from "../services/me";
import type { ServerEnv } from "../auth/types";

export const authGuard = createMiddleware<ServerEnv>(async (c, next) => {
  const user = await getMeUser(c.env.astro);

  if (!user) {
    return c.json(
      {
        ok: false,
        error: "unauthorized",
      },
      401,
    );
  }

  c.set("meUser", user);
  await next();
});