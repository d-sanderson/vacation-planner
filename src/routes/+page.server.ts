import type { PageServerLoad } from './$types';
import { trip, tripMember } from '$lib/server/db/schema';
import { desc, eq, or, inArray } from 'drizzle-orm';

export const load: PageServerLoad = async ({ locals }) => {
	const user = locals.user;

	if (!user) {
		// Logged-out users see only public trips
		const trips = await locals.db
			.select()
			.from(trip)
			.where(eq(trip.isPublic, true))
			.orderBy(desc(trip.startDate));
		return { trips };
	}

	// Admin sees all trips
	if (user.role === 'admin') {
		const trips = await locals.db.select().from(trip).orderBy(desc(trip.startDate));
		return { trips };
	}

	// Regular users see: public trips + trips they created + trips they're members of
	const memberTripIds = await locals.db
		.select({ tripId: tripMember.tripId })
		.from(tripMember)
		.where(eq(tripMember.userId, user.id));

	const memberIds = memberTripIds.map((m) => m.tripId);

	const conditions = [eq(trip.isPublic, true), eq(trip.createdBy, user.id)];
	if (memberIds.length > 0) {
		conditions.push(inArray(trip.id, memberIds));
	}

	const trips = await locals.db
		.select()
		.from(trip)
		.where(or(...conditions))
		.orderBy(desc(trip.startDate));

	return { trips };
};
