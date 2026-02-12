import type { Handle } from "@sveltejs/kit";
import { env } from "$env/dynamic/private";
import { getDb } from "$lib/server/db";
import { svelteKitHandler } from "better-auth/svelte-kit";
import { getAuth } from "$lib/auth";
import { building } from "$app/environment";

export const handle: Handle = async ({ event, resolve }) => {
  event.locals.db = getDb(event.platform?.env.DB, env.DATABASE_URL);
  event.locals.auth = getAuth(event.locals.db);

  // Populate user/session on every request
  const session = await event.locals.auth.api.getSession({
    headers: event.request.headers,
  });

  if (session) {
    event.locals.user = {
      id: session.user.id,
      name: session.user.name,
      email: session.user.email,
      role: (session.user as any).role ?? "viewer",
      image: session.user.image ?? null,
    };
    event.locals.session = session.session;
  } else {
    event.locals.user = null;
    event.locals.session = null;
  }

  return svelteKitHandler({ event, resolve, auth: event.locals.auth, building });
};
