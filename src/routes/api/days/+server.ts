import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { day } from '$lib/server/db/schema';
import { requireAdmin } from '$lib/server/middleware';
import { eq } from 'drizzle-orm';

export const POST: RequestHandler = async (event) => {
	requireAdmin(event);
	const body = await event.request.json();
	const id = crypto.randomUUID();

	await event.locals.db.insert(day).values({
		id,
		tripId: body.tripId,
		date: body.date,
		title: body.title,
		sortOrder: body.sortOrder ?? 0,
	});

	const [created] = await event.locals.db.select().from(day).where(eq(day.id, id));
	return json(created, { status: 201 });
};
