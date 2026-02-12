import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { comment } from '$lib/server/db/schema';
import { requireAuth } from '$lib/server/middleware';
import { eq } from 'drizzle-orm';

export const DELETE: RequestHandler = async (event) => {
	const currentUser = requireAuth(event);

	const [found] = await event.locals.db
		.select()
		.from(comment)
		.where(eq(comment.id, event.params.commentId));

	if (!found) throw error(404, 'Comment not found');

	if (found.userId !== currentUser.id && currentUser.role !== 'admin') {
		throw error(403, 'You can only delete your own comments');
	}

	await event.locals.db.delete(comment).where(eq(comment.id, event.params.commentId));

	return json({ success: true });
};
