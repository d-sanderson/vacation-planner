import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { tripMember } from '$lib/server/db/schema';
import { requireAdmin } from '$lib/server/middleware';
import { eq } from 'drizzle-orm';

export const DELETE: RequestHandler = async (event) => {
	requireAdmin(event);

	const [found] = await event.locals.db
		.select()
		.from(tripMember)
		.where(eq(tripMember.id, event.params.memberId));

	if (!found) throw error(404, 'Member not found');

	await event.locals.db.delete(tripMember).where(eq(tripMember.id, event.params.memberId));

	return json({ success: true });
};
