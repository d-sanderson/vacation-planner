<script lang="ts">
	import type { ActivityRow } from '$lib/types';
	import { categoryConfig } from '$lib/categoryConfig';

	interface Props {
		activity: ActivityRow;
		isAdmin?: boolean;
		onEdit?: (a: ActivityRow) => void;
		onDelete?: (a: ActivityRow) => void;
	}

	let { activity, isAdmin = false, onEdit, onDelete }: Props = $props();

	const config = $derived(activity.category ? categoryConfig[activity.category] : null);

	function formatTime(time: string | null): string {
		if (!time) return '';
		const [h, m] = time.split(':');
		const hour = parseInt(h);
		const ampm = hour >= 12 ? 'PM' : 'AM';
		const displayHour = hour % 12 || 12;
		return `${displayHour}:${m} ${ampm}`;
	}
</script>

<div class="relative group py-3 -ml-6 pl-6">
	<!-- Timeline dot -->
	<div
		class="absolute left-0 top-[18px] -translate-x-1/2 w-2.5 h-2.5 rounded-full ring-[3px] ring-white {config?.dotColor ?? 'bg-volcanic-300'}"
	></div>

	<div class="flex items-start justify-between gap-3">
		<div class="min-w-0 flex-1">
			<!-- Time + category row -->
			<div class="flex items-center gap-2 flex-wrap mb-1">
				{#if activity.startTime}
					<span class="text-xs font-medium text-volcanic-800 tabular-nums tracking-wide">
						{formatTime(activity.startTime)}
						{#if activity.endTime}
							<span class="text-volcanic-200 mx-0.5">&ndash;</span>
							{formatTime(activity.endTime)}
						{/if}
					</span>
				{/if}

				{#if config}
					<span class="inline-flex items-center gap-1 text-[10px] font-semibold uppercase tracking-[0.1em] px-2 py-0.5 rounded-full {config.bgColor} {config.color} border {config.borderColor}">
						{config.label}
					</span>
				{/if}
			</div>

			<!-- Title -->
			<h4 class="font-medium text-volcanic-700 leading-snug">{activity.title}</h4>

			<!-- Location -->
			{#if activity.location}
				<p class="text-sm text-volcanic-400 mt-0.5 flex items-center gap-1">
					<svg class="w-3 h-3 shrink-0 text-sand-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
						<path d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
					</svg>
					<span class="font-light">{activity.location}</span>
				</p>
			{/if}

			<!-- Notes -->
			{#if activity.notes}
				<p class="text-sm text-volcanic-300 mt-1 font-light italic">{activity.notes}</p>
			{/if}

			<!-- Description -->
			{#if activity.description}
				<p class="text-sm text-volcanic-400 mt-1.5 font-light leading-relaxed">{activity.description}</p>
			{/if}
		</div>

		<!-- Admin actions -->
		{#if isAdmin}
			<div class="flex gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity shrink-0 mt-1">
				<button
					onclick={() => onEdit?.(activity)}
					class="p-1.5 rounded-lg text-volcanic-300 hover:text-ocean-500 hover:bg-ocean-50 transition-all"
					title="Edit"
				>
					<svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
						<path d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
					</svg>
				</button>
				<button
					onclick={() => onDelete?.(activity)}
					class="p-1.5 rounded-lg text-volcanic-300 hover:text-coral-500 hover:bg-coral-50 transition-all"
					title="Delete"
				>
					<svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
						<path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
					</svg>
				</button>
			</div>
		{/if}
	</div>
</div>
