import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { trip, day, activity } from '$lib/server/db/schema';
import { requireAdmin } from '$lib/server/middleware';
import { eq, asc } from 'drizzle-orm';

export const GET: RequestHandler = async ({ params, locals }) => {
	const [foundTrip] = await locals.db.select().from(trip).where(eq(trip.id, params.id));
	if (!foundTrip) throw error(404, 'Trip not found');

	const days = await locals.db
		.select()
		.from(day)
		.where(eq(day.tripId, params.id))
		.orderBy(asc(day.sortOrder));

	const daysWithActivities = await Promise.all(
		days.map(async (d) => {
			const activities = await locals.db
				.select()
				.from(activity)
				.where(eq(activity.dayId, d.id))
				.orderBy(asc(activity.sortOrder));
			return { ...d, activities };
		})
	);

	return json({ ...foundTrip, days: daysWithActivities });
};

export const PUT: RequestHandler = async (event) => {
	requireAdmin(event);
	const body = await event.request.json();

	await event.locals.db
		.update(trip)
		.set({
			title: body.title,
			destination: body.destination,
			startDate: body.startDate,
			endDate: body.endDate,
			description: body.description,
		})
		.where(eq(trip.id, event.params.id));

	const [updated] = await event.locals.db
		.select()
		.from(trip)
		.where(eq(trip.id, event.params.id));
	if (!updated) throw error(404, 'Trip not found');

	return json(updated);
};

export const DELETE: RequestHandler = async (event) => {
	requireAdmin(event);

	const [found] = await event.locals.db
		.select()
		.from(trip)
		.where(eq(trip.id, event.params.id));
	if (!found) throw error(404, 'Trip not found');

	await event.locals.db.delete(trip).where(eq(trip.id, event.params.id));
	return json({ success: true });
};
