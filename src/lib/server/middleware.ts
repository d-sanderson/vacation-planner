import { error, type RequestEvent } from '@sveltejs/kit';
import { eq, and } from 'drizzle-orm';
import { tripMember } from './db/schema';

export function requireAuth(event: RequestEvent) {
	if (!event.locals.user) {
		throw error(401, 'Authentication required');
	}
	return event.locals.user;
}

export function requireAdmin(event: RequestEvent) {
	const user = requireAuth(event);
	if (user.role !== 'admin') {
		throw error(403, 'Admin access required');
	}
	return user;
}

export async function requireTripMember(event: RequestEvent, tripId: string) {
	const user = requireAuth(event);

	if (user.role === 'admin') return user;

	const [membership] = await event.locals.db
		.select()
		.from(tripMember)
		.where(and(eq(tripMember.tripId, tripId), eq(tripMember.userId, user.id)));

	if (!membership) {
		throw error(403, 'You must be a member of this trip');
	}

	return user;
}
