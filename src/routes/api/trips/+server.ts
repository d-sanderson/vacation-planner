import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { trip } from '$lib/server/db/schema';
import { requireAdmin } from '$lib/server/middleware';
import { desc, eq } from 'drizzle-orm';

export const GET: RequestHandler = async ({ locals }) => {
	const trips = await locals.db.select().from(trip).orderBy(desc(trip.startDate));
	return json(trips);
};

export const POST: RequestHandler = async (event) => {
	const user = requireAdmin(event);
	const body = await event.request.json();
	const id = crypto.randomUUID();

	await event.locals.db.insert(trip).values({
		id,
		title: body.title,
		destination: body.destination,
		startDate: body.startDate,
		endDate: body.endDate,
		description: body.description ?? null,
		createdBy: user.id,
	});

	const [created] = await event.locals.db.select().from(trip).where(eq(trip.id, id));
	return json(created, { status: 201 });
};
