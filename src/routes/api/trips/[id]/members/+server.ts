import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { tripMember, user } from '$lib/server/db/schema';
import { requireAdmin } from '$lib/server/middleware';
import { eq, and } from 'drizzle-orm';

export const GET: RequestHandler = async ({ params, locals }) => {
	const members = await locals.db
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
		.where(eq(tripMember.tripId, params.id));

	return json(members);
};

export const POST: RequestHandler = async (event) => {
	requireAdmin(event);
	const body = await event.request.json();

	const [foundUser] = await event.locals.db
		.select()
		.from(user)
		.where(eq(user.email, body.email));

	if (!foundUser) {
		throw error(404, 'No user found with that email they need to create an account first');
	}

	const [existing] = await event.locals.db
		.select()
		.from(tripMember)
		.where(
			and(eq(tripMember.tripId, event.params.id), eq(tripMember.userId, foundUser.id))
		);

	if (existing) {
		throw error(400, 'User is already a member of this trip');
	}

	const id = crypto.randomUUID();
	await event.locals.db.insert(tripMember).values({
		id,
		tripId: event.params.id,
		userId: foundUser.id,
		role: body.role ?? 'member',
	});

	const [created] = await event.locals.db
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
		.where(eq(tripMember.id, id));

	return json(created, { status: 201 });
};
