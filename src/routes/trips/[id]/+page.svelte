<script lang="ts">
	import type { PageProps } from './$types';
	import type { ActivityRow } from '$lib/types';
	import DayCard from '$lib/components/DayCard.svelte';
	import ActivityForm from '$lib/components/ActivityForm.svelte';
	import TripMembers from '$lib/components/TripMembers.svelte';
	import TripComments from '$lib/components/TripComments.svelte';
	import { page } from '$app/state';
	import { invalidateAll } from '$app/navigation';

	let { data }: PageProps = $props();
	const isAdmin = $derived(page.data.user?.role === 'admin');

	let showActivityForm = $state(false);
	let editingActivity = $state<ActivityRow | null>(null);
	let formDayId = $state('');
	let copied = $state(false);

	function formatDate(dateStr: string): string {
		const d = new Date(dateStr + 'T00:00:00');
		return d.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
	}

	function handleAddActivity(dayId: string) {
		formDayId = dayId;
		editingActivity = null;
		showActivityForm = true;
	}

	function handleEditActivity(activity: ActivityRow) {
		formDayId = activity.dayId;
		editingActivity = activity;
		showActivityForm = true;
	}

	async function handleDeleteActivity(activity: ActivityRow) {
		if (!confirm(`Delete "${activity.title}"?`)) return;
		await fetch(`/api/activities/${activity.id}`, { method: 'DELETE' });
		invalidateAll();
	}

	function handleFormSave() {
		showActivityForm = false;
		editingActivity = null;
		invalidateAll();
	}

	function handleFormCancel() {
		showActivityForm = false;
		editingActivity = null;
	}

	function getTotalActivities(): number {
		return data.trip.days.reduce((sum, d) => sum + d.activities.length, 0);
	}

	async function handleShare() {
		const url = window.location.href;

		if (navigator.share) {
			try {
				await navigator.share({
					title: data.trip.title,
					text: `Check out this trip: ${data.trip.title} - ${data.trip.destination}`,
					url,
				});
				return;
			} catch {
				// User cancelled or share failed, fall through to clipboard
			}
		}

		await navigator.clipboard.writeText(url);
		copied = true;
		setTimeout(() => (copied = false), 2000);
	}
</script>

<svelte:head>
	<title>{data.trip.title} - Baw's Big 4-0</title>
</svelte:head>

<div class="max-w-3xl mx-auto px-6 py-10">
	<!-- Back link -->
	<a
		href="/"
		class="inline-flex items-center gap-1.5 text-sm text-volcanic-300 hover:text-coral-500 transition-colors mb-8 animate-fade-in"
	>
		<svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
			<path d="M19 12H5m7-7l-7 7 7 7"/>
		</svg>
		All trips
	</a>

	<!-- Trip Header -->
	<header class="mb-12 animate-fade-up">
		<div class="flex items-start justify-between gap-4">
			<div>
				<p class="text-[11px] font-semibold uppercase tracking-[0.2em] text-ocean-400 mb-3">
					{data.trip.destination}
				</p>
				<h1 class="font-display text-4xl md:text-5xl font-semibold text-volcanic-800 tracking-tight leading-[1.1] mb-4">
					{data.trip.title}
				</h1>
			</div>

			<!-- Share button -->
			<button
				onclick={handleShare}
				class="shrink-0 mt-2 inline-flex items-center gap-2 px-4 py-2 rounded-full border border-sand-200 text-volcanic-500 hover:text-coral-500 hover:border-coral-200 hover:bg-coral-50/40 transition-all text-sm font-medium shadow-warm"
			>
				{#if copied}
					<svg class="w-4 h-4 text-ocean-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
						<path d="M20 6L9 17l-5-5"/>
					</svg>
					<span class="text-ocean-500">Copied!</span>
				{:else}
					<svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
						<circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/>
					</svg>
					Share
				{/if}
			</button>
		</div>

		<div class="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-volcanic-400">
			<span class="flex items-center gap-1.5 font-light">
				<svg class="w-4 h-4 text-sand-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
					<rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
				</svg>
				{formatDate(data.trip.startDate)} &ndash; {formatDate(data.trip.endDate)}
			</span>
			<span class="text-volcanic-200">|</span>
			<span class="font-light">{data.trip.days.length} days</span>
			<span class="text-volcanic-200">|</span>
			<span class="font-light">{getTotalActivities()} activities</span>
		</div>

		{#if data.trip.description}
			<div class="mt-6 p-5 bg-sand-100/60 rounded-xl border border-sand-200/50">
				<p class="text-sm text-volcanic-500 leading-relaxed font-light">{data.trip.description}</p>
			</div>
		{/if}

		<div class="mt-6 h-px bg-gradient-to-r from-sand-300 via-sand-200 to-transparent"></div>
	</header>

	<!-- Members -->
	<div class="mb-8 animate-fade-up" style="animation-delay: 50ms">
		<TripMembers
			members={data.trip.members}
			tripId={data.trip.id}
			{isAdmin}
		/>
	</div>

	<!-- Days -->
	<div class="space-y-8">
		{#each data.trip.days as day, i (day.id)}
			<div class="animate-fade-up" style="animation-delay: {i * 100}ms">
				<DayCard
					{day}
					dayNumber={i + 1}
					{isAdmin}
					onEditActivity={handleEditActivity}
					onDeleteActivity={handleDeleteActivity}
					onAddActivity={handleAddActivity}
				/>
			</div>
		{/each}
	</div>

	{#if data.trip.days.length === 0}
		<div class="text-center py-20 animate-fade-in">
			<p class="text-volcanic-400 font-light text-lg">No days planned yet.</p>
		</div>
	{/if}

	<!-- Comments -->
	<div class="mt-12 animate-fade-up">
		<TripComments
			comments={data.trip.comments}
			tripId={data.trip.id}
		/>
	</div>
</div>

{#if showActivityForm}
	<ActivityForm
		activity={editingActivity}
		dayId={formDayId}
		onSave={handleFormSave}
		onCancel={handleFormCancel}
	/>
{/if}
