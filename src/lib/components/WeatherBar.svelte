<script lang="ts">
	import type { DayWeather } from '$lib/server/weather';

	interface Props {
		weather: DayWeather;
	}

	let { weather }: Props = $props();
</script>

<div class="flex items-center gap-3 flex-wrap text-xs">
	<!-- High / Low -->
	<div class="flex items-center gap-1.5 text-volcanic-400 font-medium">
		<svg class="w-3.5 h-3.5 text-coral-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
			<path d="M12 2v20M5 5l7-3 7 3" />
		</svg>
		<span class="text-coral-500">{weather.high}°</span>
		<span class="text-volcanic-300">/</span>
		<span class="text-ocean-500">{weather.low}°</span>
	</div>

	<span class="text-volcanic-200">|</span>

	<!-- Morning -->
	<div class="flex items-center gap-1" title="Morning (6am–12pm): {weather.morning.label}">
		<span>{weather.morning.icon}</span>
		<span class="text-volcanic-400">{weather.morning.temp}°</span>
	</div>

	<!-- Afternoon -->
	<div class="flex items-center gap-1" title="Afternoon (12pm–6pm): {weather.afternoon.label}">
		<span>{weather.afternoon.icon}</span>
		<span class="text-volcanic-400">{weather.afternoon.temp}°</span>
	</div>

	<!-- Evening -->
	<div class="flex items-center gap-1" title="Evening (6pm–12am): {weather.evening.label}">
		<span>{weather.evening.icon}</span>
		<span class="text-volcanic-400">{weather.evening.temp}°</span>
	</div>
</div>
