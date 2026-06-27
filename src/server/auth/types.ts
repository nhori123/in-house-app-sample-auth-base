import type { APIContext } from "astro";

import type { MeUser } from "../services/me";

export type ServerBindings = {
  astro: APIContext;
};

export type ServerVariables = {
  meUser: MeUser;
};

export type ServerEnv = {
  Bindings: ServerBindings;
  Variables: ServerVariables;
};