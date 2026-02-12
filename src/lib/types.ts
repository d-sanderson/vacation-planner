export type ActivityCategory = 'travel' | 'food' | 'sightseeing' | 'lodging' | 'entertainment' | 'departure';

export interface TripRow {
	id: string;
	title: string;
	destination: string;
	startDate: string;
	endDate: string;
	description: string | null;
	createdBy: string | null;
	createdAt: Date;
	updatedAt: Date | null;
}

export interface DayRow {
	id: string;
	tripId: string;
	date: string;
	title: string;
	sortOrder: number;
	createdAt: Date;
	updatedAt: Date | null;
}

export interface ActivityRow {
	id: string;
	dayId: string;
	title: string;
	description: string | null;
	startTime: string | null;
	endTime: string | null;
	location: string | null;
	category: ActivityCategory | null;
	notes: string | null;
	sortOrder: number;
	createdAt: Date;
	updatedAt: Date | null;
}

export interface DayWithActivities extends DayRow {
	activities: ActivityRow[];
}

export interface TripWithDays extends TripRow {
	days: DayWithActivities[];
}

export interface AuthUser {
	id: string;
	name: string;
	email: string;
	role: 'viewer' | 'admin';
	image: string | null;
}

export type TripMemberRole = 'organizer' | 'member';

export interface TripMemberRow {
	id: string;
	tripId: string;
	userId: string;
	role: TripMemberRole;
	createdAt: Date;
}

export interface TripMemberWithUser extends TripMemberRow {
	user: {
		id: string;
		name: string;
		email: string;
		image: string | null;
	};
}

export interface CommentRow {
	id: string;
	tripId: string;
	userId: string;
	text: string;
	createdAt: Date;
	updatedAt: Date | null;
}

export interface CommentWithUser extends CommentRow {
	user: {
		id: string;
		name: string;
		email: string;
		image: string | null;
	};
}

export interface TripWithDetails extends TripRow {
	days: DayWithActivities[];
	members: TripMemberWithUser[];
	comments: CommentWithUser[];
}
