<script lang="ts">
	interface Props {
		trip: {
			id: string;
			title: string;
			destination: string;
			startDate: string;
			endDate: string;
			description: string | null;
		};
	}

	let { trip }: Props = $props();

	function formatDate(dateStr: string): string {
		const d = new Date(dateStr + 'T00:00:00');
		return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
	}

	function getDayCount(): number {
		const start = new Date(trip.startDate);
		const end = new Date(trip.endDate);
		return Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;
	}
</script>

<a
	href="/trips/{trip.id}"
	class="group block relative bg-white rounded-2xl shadow-warm border border-sand-200/50 p-7 hover:shadow-warm-lg hover:-translate-y-0.5 transition-all duration-300 overflow-hidden"
>
	<!-- Decorative corner accent -->
	<div class="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-coral-50 to-transparent rounded-bl-[48px] opacity-60 group-hover:opacity-100 transition-opacity"></div>

	<div class="relative">
		<div class="flex items-start justify-between mb-4">
			<div class="flex items-center gap-2">
				<span class="text-[10px] font-semibold uppercase tracking-[0.15em] text-ocean-400">
					{trip.destination}
				</span>
			</div>
			<span class="text-xs text-volcanic-300 font-light tabular-nums">
				{getDayCount()} days
			</span>
		</div>

		<h2 class="font-display text-xl font-semibold text-volcanic-800 mb-3 group-hover:text-coral-600 transition-colors leading-snug">
			{trip.title}
		</h2>

		<div class="flex items-center gap-3 text-sm text-volcanic-300">
			<span class="font-light tabular-nums">
				{formatDate(trip.startDate)} &mdash; {formatDate(trip.endDate)}
			</span>
		</div>

		<!-- Hover arrow -->
		<div class="absolute bottom-0 right-0 opacity-0 group-hover:opacity-100 translate-x-2 group-hover:translate-x-0 transition-all duration-300">
			<svg class="w-5 h-5 text-coral-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
				<path d="M5 12h14m-7-7l7 7-7 7"/>
			</svg>
		</div>
	</div>
</a>
