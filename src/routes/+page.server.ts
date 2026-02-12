import type { PageServerLoad } from './$types';
import { trip } from '$lib/server/db/schema';
import { desc } from 'drizzle-orm';

export const load: PageServerLoad = async ({ locals }) => {
	const trips = await locals.db.select().from(trip).orderBy(desc(trip.startDate));
	return { trips };
};
