import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { activity } from '$lib/server/db/schema';
import { requireAdmin } from '$lib/server/middleware';
import { eq } from 'drizzle-orm';

export const PUT: RequestHandler = async (event) => {
	requireAdmin(event);
	const body: { items: { id: string; sortOrder: number }[] } = await event.request.json();

	for (const item of body.items) {
		await event.locals.db
			.update(activity)
			.set({ sortOrder: item.sortOrder })
			.where(eq(activity.id, item.id));
	}

	return json({ success: true });
};
