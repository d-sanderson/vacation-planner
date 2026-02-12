<script lang="ts">
	import { page } from '$app/state';
</script>

<div class="min-h-[60vh] flex items-center justify-center px-4">
	<div class="text-center animate-fade-up">
		<div class="font-display text-8xl font-bold text-sand-200 mb-4">{page.status}</div>
		<p class="text-lg text-volcanic-500 mb-8 font-light">{page.error?.message ?? 'Something went wrong'}</p>
		<a
			href="/"
			class="inline-flex items-center gap-2 bg-volcanic-800 text-sand-50 px-6 py-2.5 rounded-full hover:bg-volcanic-700 transition-all text-sm font-medium shadow-warm"
		>
			<svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
				<path d="M19 12H5m7-7l-7 7 7 7"/>
			</svg>
			Back to home
		</a>
	</div>
</div>
