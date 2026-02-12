import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { day } from '$lib/server/db/schema';
import { requireAdmin } from '$lib/server/middleware';
import { eq } from 'drizzle-orm';

export const PUT: RequestHandler = async (event) => {
	requireAdmin(event);
	const body = await event.request.json();

	await event.locals.db
		.update(day)
		.set({
			date: body.date,
			title: body.title,
			sortOrder: body.sortOrder,
		})
		.where(eq(day.id, event.params.id));

	const [updated] = await event.locals.db.select().from(day).where(eq(day.id, event.params.id));
	if (!updated) throw error(404, 'Day not found');

	return json(updated);
};

export const DELETE: RequestHandler = async (event) => {
	requireAdmin(event);

	const [found] = await event.locals.db.select().from(day).where(eq(day.id, event.params.id));
	if (!found) throw error(404, 'Day not found');

	await event.locals.db.delete(day).where(eq(day.id, event.params.id));
	return json({ success: true });
};
