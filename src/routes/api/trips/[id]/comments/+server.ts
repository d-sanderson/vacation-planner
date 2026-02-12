import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { comment, user } from '$lib/server/db/schema';
import { requireAuth } from '$lib/server/middleware';
import { eq, desc } from 'drizzle-orm';

export const GET: RequestHandler = async ({ params, locals }) => {
	const comments = await locals.db
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
		.orderBy(desc(comment.createdAt));

	return json(comments);
};

export const POST: RequestHandler = async (event) => {
	const currentUser = requireAuth(event);
	const body = await event.request.json();

	if (!body.text || body.text.trim().length === 0) {
		throw error(400, 'Comment text is required');
	}

	const id = crypto.randomUUID();
	await event.locals.db.insert(comment).values({
		id,
		tripId: event.params.id,
		userId: currentUser.id,
		text: body.text.trim(),
	});

	const [created] = await event.locals.db
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
		.where(eq(comment.id, id));

	return json(created, { status: 201 });
};
