import type { DrizzleClient } from '$lib/server/db';
import type { BetterAuth } from '$lib/auth';
import type { AuthUser } from '$lib/types';

declare global {
	namespace App {
		interface Platform {
			env: Env;
			cf: CfProperties;
			ctx: ExecutionContext;
		}
		interface Locals {
			db: DrizzleClient;
			auth: BetterAuth;
			user: AuthUser | null;
			session: { id: string; userId: string; token: string; expiresAt: Date } | null;
		}
	}
}

export {};
