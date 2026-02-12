import { relations, sql } from 'drizzle-orm';
import { integer, sqliteTable, text, index } from 'drizzle-orm/sqlite-core';
import { user } from './better-auth-schema';

export const trip = sqliteTable('trip', {
	id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
	title: text('title').notNull(),
	destination: text('destination').notNull(),
	startDate: text('start_date').notNull(),
	endDate: text('end_date').notNull(),
	description: text('description'),
	isPublic: integer('is_public', { mode: 'boolean' }).notNull().default(false),
	createdBy: text('created_by').references(() => user.id),
	createdAt: integer('created_at', { mode: 'timestamp_ms' })
		.default(sql`(cast(unixepoch('subsecond') * 1000 as integer))`)
		.notNull(),
	updatedAt: integer('updated_at', { mode: 'timestamp_ms' })
		.default(sql`(cast(unixepoch('subsecond') * 1000 as integer))`)
		.$onUpdate(() => new Date()),
});

export const day = sqliteTable(
	'day',
	{
		id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
		tripId: text('trip_id')
			.notNull()
			.references(() => trip.id, { onDelete: 'cascade' }),
		date: text('date').notNull(),
		title: text('title').notNull(),
		sortOrder: integer('sort_order').notNull().default(0),
		createdAt: integer('created_at', { mode: 'timestamp_ms' })
			.default(sql`(cast(unixepoch('subsecond') * 1000 as integer))`)
			.notNull(),
		updatedAt: integer('updated_at', { mode: 'timestamp_ms' })
			.default(sql`(cast(unixepoch('subsecond') * 1000 as integer))`)
			.$onUpdate(() => new Date()),
	},
	(table) => [index('day_tripId_idx').on(table.tripId)]
);

export const activity = sqliteTable(
	'activity',
	{
		id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
		dayId: text('day_id')
			.notNull()
			.references(() => day.id, { onDelete: 'cascade' }),
		title: text('title').notNull(),
		description: text('description'),
		startTime: text('start_time'),
		endTime: text('end_time'),
		location: text('location'),
		latitude: text('latitude'),
		longitude: text('longitude'),
		category: text('category'),
		notes: text('notes'),
		sortOrder: integer('sort_order').notNull().default(0),
		createdAt: integer('created_at', { mode: 'timestamp_ms' })
			.default(sql`(cast(unixepoch('subsecond') * 1000 as integer))`)
			.notNull(),
		updatedAt: integer('updated_at', { mode: 'timestamp_ms' })
			.default(sql`(cast(unixepoch('subsecond') * 1000 as integer))`)
			.$onUpdate(() => new Date()),
	},
	(table) => [index('activity_dayId_idx').on(table.dayId)]
);

export const tripMember = sqliteTable(
	'trip_member',
	{
		id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
		tripId: text('trip_id')
			.notNull()
			.references(() => trip.id, { onDelete: 'cascade' }),
		userId: text('user_id')
			.notNull()
			.references(() => user.id, { onDelete: 'cascade' }),
		role: text('role').notNull().default('member'),
		createdAt: integer('created_at', { mode: 'timestamp_ms' })
			.default(sql`(cast(unixepoch('subsecond') * 1000 as integer))`)
			.notNull(),
	},
	(table) => [
		index('trip_member_tripId_idx').on(table.tripId),
		index('trip_member_userId_idx').on(table.userId),
	]
);

export const comment = sqliteTable(
	'comment',
	{
		id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
		tripId: text('trip_id')
			.notNull()
			.references(() => trip.id, { onDelete: 'cascade' }),
		userId: text('user_id')
			.notNull()
			.references(() => user.id, { onDelete: 'cascade' }),
		text: text('text').notNull(),
		createdAt: integer('created_at', { mode: 'timestamp_ms' })
			.default(sql`(cast(unixepoch('subsecond') * 1000 as integer))`)
			.notNull(),
		updatedAt: integer('updated_at', { mode: 'timestamp_ms' })
			.default(sql`(cast(unixepoch('subsecond') * 1000 as integer))`)
			.$onUpdate(() => new Date()),
	},
	(table) => [
		index('comment_tripId_idx').on(table.tripId),
		index('comment_userId_idx').on(table.userId),
	]
);

// Relations
export const tripRelations = relations(trip, ({ many }) => ({
	days: many(day),
	members: many(tripMember),
	comments: many(comment),
}));

export const dayRelations = relations(day, ({ one, many }) => ({
	trip: one(trip, {
		fields: [day.tripId],
		references: [trip.id],
	}),
	activities: many(activity),
}));

export const activityRelations = relations(activity, ({ one }) => ({
	day: one(day, {
		fields: [activity.dayId],
		references: [day.id],
	}),
}));

export const tripMemberRelations = relations(tripMember, ({ one }) => ({
	trip: one(trip, {
		fields: [tripMember.tripId],
		references: [trip.id],
	}),
	user: one(user, {
		fields: [tripMember.userId],
		references: [user.id],
	}),
}));

export const commentRelations = relations(comment, ({ one }) => ({
	trip: one(trip, {
		fields: [comment.tripId],
		references: [trip.id],
	}),
	user: one(user, {
		fields: [comment.userId],
		references: [user.id],
	}),
}));

export * from './better-auth-schema';
