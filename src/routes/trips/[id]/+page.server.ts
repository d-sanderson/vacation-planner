import type { PageServerLoad } from './$types';
import { trip, day, activity, tripMember, comment, user } from '$lib/server/db/schema';
import { eq, asc, desc } from 'drizzle-orm';
import { error } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ params, locals }) => {
	const [foundTrip] = await locals.db.select().from(trip).where(eq(trip.id, params.id));
	if (!foundTrip) throw error(404, 'Trip not found');

	const [days, members, comments] = await Promise.all([
		locals.db
			.select()
			.from(day)
			.where(eq(day.tripId, params.id))
			.orderBy(asc(day.sortOrder)),
		locals.db
			.select({
				id: tripMember.id,
				tripId: tripMember.tripId,
				userId: tripMember.userId,
				role: tripMember.role,
				createdAt: tripMember.createdAt,
				user: {
					id: user.id,
					name: user.name,
					email: user.email,
					image: user.image,
				},
			})
			.from(tripMember)
			.leftJoin(user, eq(tripMember.userId, user.id))
			.where(eq(tripMember.tripId, params.id)),
		locals.db
			.select({
				id: comment.id,
				tripId: comment.tripId,
				userId: comment.userId,
				text: comment.text,
				createdAt: comment.createdAt,
				updatedAt: comment.updatedAt,
				user: {
					id: user.id,
					name: user.name,
					email: user.email,
					image: user.image,
				},
			})
			.from(comment)
			.leftJoin(user, eq(comment.userId, user.id))
			.where(eq(comment.tripId, params.id))
			.orderBy(desc(comment.createdAt)),
	]);

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

	return {
		trip: { ...foundTrip, days: daysWithActivities, members, comments },
	};
};
