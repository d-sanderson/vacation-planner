import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { activity } from '$lib/server/db/schema';
import { requireAdmin } from '$lib/server/middleware';
import { eq } from 'drizzle-orm';

export const POST: RequestHandler = async (event) => {
	requireAdmin(event);
	const body = await event.request.json();
	const id = crypto.randomUUID();

	await event.locals.db.insert(activity).values({
		id,
		dayId: body.dayId,
		title: body.title,
		description: body.description ?? null,
		startTime: body.startTime ?? null,
		endTime: body.endTime ?? null,
		location: body.location ?? null,
		latitude: body.latitude ?? null,
		longitude: body.longitude ?? null,
		category: body.category ?? null,
		notes: body.notes ?? null,
		sortOrder: body.sortOrder ?? 0,
	});

	const [created] = await event.locals.db.select().from(activity).where(eq(activity.id, id));
	return json(created, { status: 201 });
};
