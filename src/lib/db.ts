import { createClient } from "@libsql/client";
import { env } from "@/lib/env";

export const db = createClient({
  url: env.tursoUrl,
  authToken: env.tursoToken
});
