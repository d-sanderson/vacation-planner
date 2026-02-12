import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { activity } from '$lib/server/db/schema';
import { requireAdmin } from '$lib/server/middleware';
import { eq } from 'drizzle-orm';

export const PUT: RequestHandler = async (event) => {
	requireAdmin(event);
	const body = await event.request.json();

	await event.locals.db
		.update(activity)
		.set({
			title: body.title,
			description: body.description,
			startTime: body.startTime,
			endTime: body.endTime,
			location: body.location,
			category: body.category,
			notes: body.notes,
			sortOrder: body.sortOrder,
		})
		.where(eq(activity.id, event.params.id));

	const [updated] = await event.locals.db
		.select()
		.from(activity)
		.where(eq(activity.id, event.params.id));
	if (!updated) throw error(404, 'Activity not found');

	return json(updated);
};

export const DELETE: RequestHandler = async (event) => {
	requireAdmin(event);

	const [found] = await event.locals.db
		.select()
		.from(activity)
		.where(eq(activity.id, event.params.id));
	if (!found) throw error(404, 'Activity not found');

	await event.locals.db.delete(activity).where(eq(activity.id, event.params.id));
	return json({ success: true });
};
