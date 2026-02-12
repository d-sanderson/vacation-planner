<script lang="ts">
	import type { DayWithActivities, ActivityRow } from '$lib/types';
	import type { DayWeather } from '$lib/server/weather';
	import ActivityItem from './ActivityItem.svelte';
	import WeatherBar from './WeatherBar.svelte';
	import { dndzone } from 'svelte-dnd-action';

	interface Props {
		day: DayWithActivities;
		dayNumber?: number;
		isAdmin?: boolean;
		weather?: DayWeather | null;
		onEditActivity?: (a: ActivityRow) => void;
		onDeleteActivity?: (a: ActivityRow) => void;
		onAddActivity?: (dayId: string) => void;
	}

	let { day, dayNumber = 1, isAdmin = false, weather = null, onEditActivity, onDeleteActivity, onAddActivity }: Props = $props();

	let expanded = $state(true);
	let reorderMode = $state(false);
	let items = $state(day.activities.map((a) => ({ ...a })));

	$effect(() => {
		items = day.activities.map((a) => ({ ...a }));
	});

	function formatDayDate(dateStr: string): string {
		const d = new Date(dateStr + 'T00:00:00');
		return d.toLocaleDateString('en-US', {
			weekday: 'long',
			month: 'long',
			day: 'numeric',
		});
	}

	function handleDndConsider(e: CustomEvent<{ items: typeof items }>) {
		items = e.detail.items;
	}

	async function handleDndFinalize(e: CustomEvent<{ items: typeof items }>) {
		items = e.detail.items;
		const reorderItems = items.map((a, i) => ({ id: a.id, sortOrder: i }));
		await fetch('/api/activities/reorder', {
			method: 'PUT',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ items: reorderItems }),
		});
	}
</script>

<div class="relative">
	<!-- Day number badge -->
	<div class="absolute -left-3 top-5 md:-left-12 z-10">
		<div class="w-8 h-8 md:w-9 md:h-9 rounded-full bg-gradient-to-br from-coral-400 to-coral-500 flex items-center justify-center shadow-warm">
			<span class="text-white text-xs font-semibold">{dayNumber}</span>
		</div>
	</div>

	<div class="bg-white rounded-2xl shadow-warm border border-sand-200/50 overflow-hidden ml-8 md:ml-0">
		<!-- Day header -->
		<button
			onclick={() => (expanded = !expanded)}
			class="w-full px-7 py-5 flex items-center justify-between text-left hover:bg-sand-50/50 transition-colors"
		>
			<div>
				<h3 class="font-display text-lg font-semibold text-volcanic-800">{day.title}</h3>
				<p class="text-sm text-volcanic-300 font-light mt-0.5">{formatDayDate(day.date)}</p>
				{#if weather}
					<div class="mt-1.5" onclick={(e) => e.stopPropagation()}>
						<WeatherBar {weather} />
					</div>
				{/if}
			</div>
			<div class="flex items-center gap-1.5 md:gap-3 shrink-0 ml-2">
				<span class="hidden sm:inline text-[11px] font-medium text-volcanic-300 bg-sand-100 px-2.5 py-1 rounded-full">
					{items.length} {items.length === 1 ? 'activity' : 'activities'}
				</span>
				<svg
					class="w-4 h-4 text-volcanic-300 transition-transform duration-300 {expanded ? 'rotate-180' : ''}"
					fill="none"
					viewBox="0 0 24 24"
					stroke="currentColor"
					stroke-width="2"
				>
					<path d="M19 9l-7 7-7-7" />
				</svg>
			</div>
		</button>

		{#if expanded}
			<div class="px-7 pb-6 pt-1">
				{#if items.length === 0}
					<p class="text-sm text-volcanic-300 py-6 text-center font-light italic">No activities planned for this day.</p>
				{:else}
					<!-- Timeline -->
					<div class="relative ml-3 pl-6 border-l border-dashed border-sand-300/80 space-y-1 pt-1">
						{#if isAdmin && reorderMode}
							<div
								use:dndzone={{ items, flipDurationMs: 200 }}
								onconsider={handleDndConsider}
								onfinalize={handleDndFinalize}
								class="space-y-1"
							>
								{#each items as activity (activity.id)}
									<ActivityItem
										{activity}
										{isAdmin}
										onEdit={onEditActivity}
										onDelete={onDeleteActivity}
									/>
								{/each}
							</div>
						{:else}
							{#each items as activity (activity.id)}
								<ActivityItem {activity} {isAdmin} onEdit={onEditActivity} onDelete={onDeleteActivity} />
							{/each}
						{/if}
					</div>
				{/if}

				{#if isAdmin}
					<div class="mt-5 ml-3 flex items-center gap-3">
						<button
							onclick={() => onAddActivity?.(day.id)}
							class="inline-flex items-center gap-1.5 text-sm text-coral-400 hover:text-coral-600 font-medium transition-colors"
						>
							<svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
								<path d="M12 5v14m-7-7h14"/>
							</svg>
							Add activity
						</button>
						{#if items.length > 1}
							<button
								onclick={() => (reorderMode = !reorderMode)}
								class="inline-flex items-center gap-1.5 text-sm font-medium transition-colors {reorderMode ? 'text-ocean-500' : 'text-volcanic-300 hover:text-volcanic-500'}"
							>
								<svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
									<path d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4"/>
								</svg>
								{reorderMode ? 'Done' : 'Reorder'}
							</button>
						{/if}
					</div>
				{/if}
			</div>
		{/if}
	</div>
</div>
