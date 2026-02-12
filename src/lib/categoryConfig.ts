import type { ActivityCategory } from './types';

export const categoryConfig: Record<ActivityCategory, {
	color: string;
	bgColor: string;
	dotColor: string;
	borderColor: string;
	label: string;
	icon: string;
}> = {
	travel: {
		color: 'text-navy-600',
		bgColor: 'bg-navy-50',
		dotColor: 'bg-navy-400',
		borderColor: 'border-navy-200',
		label: 'Travel',
		icon: `<svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 19V5M5 12l7-7 7 7"/></svg>`,
	},
	food: {
		color: 'text-coral-600',
		bgColor: 'bg-coral-50',
		dotColor: 'bg-coral-400',
		borderColor: 'border-coral-200',
		label: 'Dining',
		icon: `<svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 8h1a4 4 0 010 8h-1M2 8h16v9a4 4 0 01-4 4H6a4 4 0 01-4-4V8zM6 1v3M10 1v3M14 1v3"/></svg>`,
	},
	sightseeing: {
		color: 'text-ocean-600',
		bgColor: 'bg-ocean-50',
		dotColor: 'bg-ocean-400',
		borderColor: 'border-ocean-200',
		label: 'Explore',
		icon: `<svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M2 12h20M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z"/></svg>`,
	},
	lodging: {
		color: 'text-sand-700',
		bgColor: 'bg-sand-100',
		dotColor: 'bg-sand-500',
		borderColor: 'border-sand-300',
		label: 'Stay',
		icon: `<svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/></svg>`,
	},
	entertainment: {
		color: 'text-coral-500',
		bgColor: 'bg-coral-50/60',
		dotColor: 'bg-coral-300',
		borderColor: 'border-coral-100',
		label: 'Experience',
		icon: `<svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"/></svg>`,
	},
	departure: {
		color: 'text-volcanic-400',
		bgColor: 'bg-volcanic-50',
		dotColor: 'bg-volcanic-300',
		borderColor: 'border-volcanic-200',
		label: 'Departure',
		icon: `<svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 8l4 4m0 0l-4 4m4-4H3"/></svg>`,
	},
};
