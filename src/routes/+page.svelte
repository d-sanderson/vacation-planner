<script lang="ts">
	import type { PageProps } from './$types';
	import TripCard from '$lib/components/TripCard.svelte';
	import { page } from '$app/state';

	let { data }: PageProps = $props();
	const isAdmin = $derived(page.data.user?.role === 'admin');
</script>

<svelte:head>
	<title>Baw's Big 4-0 - Trips</title>
</svelte:head>

<div class="max-w-4xl mx-auto px-6 py-12">
	<!-- Hero section -->
	<div class="mb-12 animate-fade-up">
		<p class="text-[11px] font-semibold uppercase tracking-[0.2em] text-coral-400 mb-3">Itineraries</p>
		<div class="flex items-end justify-between gap-4">
			<h1 class="font-display text-4xl md:text-5xl font-semibold text-volcanic-800 tracking-tight leading-[1.1]">
				Your Trips
			</h1>
			{#if isAdmin}
				<a
					href="/trips/new"
					class="shrink-0 inline-flex items-center gap-2 bg-volcanic-800 text-sand-50 px-5 py-2.5 rounded-full hover:bg-volcanic-700 transition-all text-sm font-medium shadow-warm hover:shadow-warm-lg"
				>
					<svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 5v14m-7-7h14"/></svg>
					New Trip
				</a>
			{/if}
		</div>
		<div class="mt-4 h-px bg-gradient-to-r from-sand-300 via-sand-200 to-transparent"></div>
	</div>

	{#if data.trips.length === 0}
		<div class="text-center py-24 animate-fade-in">
			<div class="w-16 h-16 rounded-2xl bg-sand-100 flex items-center justify-center mx-auto mb-5">
				<svg class="w-8 h-8 text-sand-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
					<path d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l5.447 2.724A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"/>
				</svg>
			</div>
			<p class="text-volcanic-400 text-lg font-light">No trips planned yet.</p>
			<p class="text-volcanic-300 text-sm mt-1">Your adventures will appear here.</p>
		</div>
	{:else}
		<div class="grid gap-6 sm:grid-cols-2">
			{#each data.trips as trip, i (trip.id)}
				<div class="animate-fade-up" style="animation-delay: {i * 80}ms">
					<TripCard {trip} />
				</div>
			{/each}
		</div>
	{/if}
</div>
