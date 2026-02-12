<script lang="ts">
	import { PUBLIC_MAPBOX_TOKEN } from '$env/static/public';
	import { onMount, onDestroy } from 'svelte';

	interface Props {
		value?: string;
		latitude?: string | null;
		longitude?: string | null;
		onSelect?: (result: { placeName: string; latitude: string; longitude: string }) => void;
		onClear?: () => void;
	}

	let { value = '', latitude = null, longitude = null, onSelect, onClear }: Props = $props();

	let query = $state(value);
	let suggestions = $state<Array<{ id: string; name: string; fullAddress: string; lat: number; lng: number }>>([]);
	let showDropdown = $state(false);
	let loading = $state(false);
	let selectedLat = $state(latitude ? parseFloat(latitude) : null);
	let selectedLng = $state(longitude ? parseFloat(longitude) : null);
	let debounceTimer: ReturnType<typeof setTimeout>;
	let mapContainer: HTMLDivElement;
	let map: any = null;
	let marker: any = null;
	let mapboxgl: any = null;
	let inputEl: HTMLInputElement;

	const token = PUBLIC_MAPBOX_TOKEN;

	onMount(async () => {
		const mb = await import('mapbox-gl');
		mapboxgl = mb.default;
		mapboxgl.accessToken = token;

		if (selectedLat && selectedLng) {
			initMap(selectedLng, selectedLat);
		}
	});

	onDestroy(() => {
		if (map) map.remove();
		clearTimeout(debounceTimer);
	});

	function initMap(lng: number, lat: number) {
		if (!mapContainer || !mapboxgl) return;

		if (map) {
			map.flyTo({ center: [lng, lat], zoom: 14 });
			if (marker) marker.setLngLat([lng, lat]);
			else marker = new mapboxgl.Marker({ color: '#E8734A' }).setLngLat([lng, lat]).addTo(map);
			return;
		}

		map = new mapboxgl.Map({
			container: mapContainer,
			style: 'mapbox://styles/mapbox/streets-v12',
			center: [lng, lat],
			zoom: 14,
			interactive: false,
		});

		marker = new mapboxgl.Marker({ color: '#E8734A' })
			.setLngLat([lng, lat])
			.addTo(map);
	}

	async function search(q: string) {
		if (q.length < 3) {
			suggestions = [];
			showDropdown = false;
			return;
		}

		loading = true;
		try {
			const res = await fetch(
				`https://api.mapbox.com/search/geocode/v6/forward?q=${encodeURIComponent(q)}&access_token=${token}&limit=5&language=en`
			);
			const data = await res.json();

			suggestions = (data.features ?? []).map((f: any) => ({
				id: f.id,
				name: f.properties.name ?? f.properties.full_address,
				fullAddress: f.properties.full_address ?? f.properties.name,
				lat: f.geometry.coordinates[1],
				lng: f.geometry.coordinates[0],
			}));
			showDropdown = suggestions.length > 0;
		} catch {
			suggestions = [];
		} finally {
			loading = false;
		}
	}

	function handleInput() {
		clearTimeout(debounceTimer);
		debounceTimer = setTimeout(() => search(query), 300);
	}

	function selectSuggestion(suggestion: (typeof suggestions)[0]) {
		query = suggestion.fullAddress;
		selectedLat = suggestion.lat;
		selectedLng = suggestion.lng;
		showDropdown = false;
		suggestions = [];

		onSelect?.({
			placeName: suggestion.fullAddress,
			latitude: String(suggestion.lat),
			longitude: String(suggestion.lng),
		});

		// Show map after selection
		requestAnimationFrame(() => {
			initMap(suggestion.lng, suggestion.lat);
		});
	}

	function handleClear() {
		query = '';
		selectedLat = null;
		selectedLng = null;
		suggestions = [];
		showDropdown = false;
		if (map) {
			map.remove();
			map = null;
			marker = null;
		}
		onClear?.();
		inputEl?.focus();
	}

	function handleBlur() {
		// Delay to allow click on suggestion
		setTimeout(() => { showDropdown = false; }, 200);
	}

	function handleFocus() {
		if (suggestions.length > 0) showDropdown = true;
	}
</script>

<svelte:head>
	<link href="https://api.mapbox.com/mapbox-gl-js/v3.9.4/mapbox-gl.css" rel="stylesheet" />
</svelte:head>

<div class="relative">
	<div class="relative">
		<input
			bind:this={inputEl}
			type="text"
			bind:value={query}
			oninput={handleInput}
			onblur={handleBlur}
			onfocus={handleFocus}
			class="w-full px-4 py-2.5 bg-sand-50 border border-sand-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-coral-300 focus:border-transparent text-volcanic-700 placeholder-volcanic-300 transition-all pr-10"
			placeholder="Search for a place..."
		/>

		{#if query}
			<button
				type="button"
				onclick={handleClear}
				class="absolute right-3 top-1/2 -translate-y-1/2 text-volcanic-300 hover:text-volcanic-500 transition-colors"
			>
				<svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
					<path d="M6 18L18 6M6 6l12 12"/>
				</svg>
			</button>
		{:else}
			<div class="absolute right-3 top-1/2 -translate-y-1/2 text-volcanic-300 pointer-events-none">
				<svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
					<path d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
				</svg>
			</div>
		{/if}

		{#if loading}
			<div class="absolute right-10 top-1/2 -translate-y-1/2">
				<div class="w-3.5 h-3.5 border-2 border-sand-300 border-t-coral-400 rounded-full animate-spin"></div>
			</div>
		{/if}
	</div>

	<!-- Suggestions dropdown -->
	{#if showDropdown}
		<div class="absolute z-50 w-full mt-1.5 bg-white rounded-xl border border-sand-200 shadow-warm-lg overflow-hidden">
			{#each suggestions as suggestion (suggestion.id)}
				<button
					type="button"
					class="w-full text-left px-4 py-3 hover:bg-sand-50 transition-colors border-b border-sand-100 last:border-b-0"
					onmousedown={() => selectSuggestion(suggestion)}
				>
					<p class="text-sm font-medium text-volcanic-700 leading-snug">{suggestion.name}</p>
					{#if suggestion.fullAddress !== suggestion.name}
						<p class="text-xs text-volcanic-400 mt-0.5 font-light">{suggestion.fullAddress}</p>
					{/if}
				</button>
			{/each}
		</div>
	{/if}

	<!-- Map preview -->
	{#if selectedLat && selectedLng}
		<div class="mt-3 rounded-xl overflow-hidden border border-sand-200 shadow-warm">
			<div bind:this={mapContainer} class="h-[180px] w-full"></div>
		</div>
	{/if}
</div>
