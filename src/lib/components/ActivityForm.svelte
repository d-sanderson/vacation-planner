<script lang="ts">
	import type { ActivityRow, ActivityCategory } from '$lib/types';

	interface Props {
		activity?: ActivityRow | null;
		dayId: string;
		onSave: () => void;
		onCancel: () => void;
	}

	let { activity = null, dayId, onSave, onCancel }: Props = $props();

	let title = $state(activity?.title ?? '');
	let description = $state(activity?.description ?? '');
	let startTime = $state(activity?.startTime ?? '');
	let endTime = $state(activity?.endTime ?? '');
	let location = $state(activity?.location ?? '');
	let category = $state<ActivityCategory | ''>(activity?.category ?? '');
	let notes = $state(activity?.notes ?? '');
	let loading = $state(false);
	let error = $state('');

	const categories: { value: ActivityCategory; label: string }[] = [
		{ value: 'travel', label: 'Travel' },
		{ value: 'food', label: 'Dining' },
		{ value: 'sightseeing', label: 'Explore' },
		{ value: 'lodging', label: 'Stay' },
		{ value: 'entertainment', label: 'Experience' },
		{ value: 'departure', label: 'Departure' },
	];

	async function handleSubmit() {
		error = '';
		loading = true;

		const body = {
			dayId,
			title,
			description: description || null,
			startTime: startTime || null,
			endTime: endTime || null,
			location: location || null,
			category: category || null,
			notes: notes || null,
		};

		try {
			const url = activity ? `/api/activities/${activity.id}` : '/api/activities';
			const method = activity ? 'PUT' : 'POST';

			const res = await fetch(url, {
				method,
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(body),
			});

			if (!res.ok) {
				const data = await res.json().catch(() => null);
				error = data?.message ?? 'Failed to save activity';
				return;
			}

			onSave();
		} catch {
			error = 'An unexpected error occurred';
		} finally {
			loading = false;
		}
	}
</script>

<!-- svelte-ignore a11y_no_static_element_interactions -->
<div
	class="fixed inset-0 bg-volcanic-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in"
	onkeydown={(e) => e.key === 'Escape' && onCancel()}
>
	<!-- svelte-ignore a11y_click_events_have_key_events -->
	<div
		class="bg-white rounded-2xl shadow-warm-xl w-full max-w-md max-h-[90vh] overflow-y-auto border border-sand-200/50 animate-scale-in"
		onclick={(e) => e.stopPropagation()}
	>
		<div class="p-7">
			<div class="flex items-center justify-between mb-6">
				<h2 class="font-display text-xl font-semibold text-volcanic-800">
					{activity ? 'Edit Activity' : 'New Activity'}
				</h2>
				<button onclick={onCancel} class="p-1 text-volcanic-300 hover:text-volcanic-600 transition-colors">
					<svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
						<path d="M6 18L18 6M6 6l12 12"/>
					</svg>
				</button>
			</div>

			{#if error}
				<div class="bg-coral-50 border border-coral-200 text-coral-700 px-4 py-3 rounded-xl mb-5 text-sm font-light">
					{error}
				</div>
			{/if}

			<form onsubmit={handleSubmit} class="space-y-5">
				<div>
					<label for="title" class="block text-xs font-semibold uppercase tracking-[0.1em] text-volcanic-400 mb-1.5">Title *</label>
					<input
						id="title"
						type="text"
						bind:value={title}
						required
						class="w-full px-4 py-2.5 bg-sand-50 border border-sand-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-coral-300 focus:border-transparent text-volcanic-700 placeholder-volcanic-300 transition-all"
						placeholder="What's happening?"
					/>
				</div>

				<div class="grid grid-cols-2 gap-3">
					<div>
						<label for="startTime" class="block text-xs font-semibold uppercase tracking-[0.1em] text-volcanic-400 mb-1.5">Start</label>
						<input
							id="startTime"
							type="time"
							bind:value={startTime}
							class="w-full px-4 py-2.5 bg-sand-50 border border-sand-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-coral-300 focus:border-transparent text-volcanic-700 transition-all"
						/>
					</div>
					<div>
						<label for="endTime" class="block text-xs font-semibold uppercase tracking-[0.1em] text-volcanic-400 mb-1.5">End</label>
						<input
							id="endTime"
							type="time"
							bind:value={endTime}
							class="w-full px-4 py-2.5 bg-sand-50 border border-sand-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-coral-300 focus:border-transparent text-volcanic-700 transition-all"
						/>
					</div>
				</div>

				<div>
					<label for="location" class="block text-xs font-semibold uppercase tracking-[0.1em] text-volcanic-400 mb-1.5">Location</label>
					<input
						id="location"
						type="text"
						bind:value={location}
						class="w-full px-4 py-2.5 bg-sand-50 border border-sand-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-coral-300 focus:border-transparent text-volcanic-700 placeholder-volcanic-300 transition-all"
						placeholder="Where is this?"
					/>
				</div>

				<div>
					<label for="category" class="block text-xs font-semibold uppercase tracking-[0.1em] text-volcanic-400 mb-1.5">Category</label>
					<select
						id="category"
						bind:value={category}
						class="w-full px-4 py-2.5 bg-sand-50 border border-sand-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-coral-300 focus:border-transparent text-volcanic-700 transition-all"
					>
						<option value="">None</option>
						{#each categories as cat}
							<option value={cat.value}>{cat.label}</option>
						{/each}
					</select>
				</div>

				<div>
					<label for="notes" class="block text-xs font-semibold uppercase tracking-[0.1em] text-volcanic-400 mb-1.5">Notes</label>
					<textarea
						id="notes"
						bind:value={notes}
						rows="2"
						class="w-full px-4 py-2.5 bg-sand-50 border border-sand-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-coral-300 focus:border-transparent text-volcanic-700 placeholder-volcanic-300 transition-all resize-none"
						placeholder="Any special notes..."
					></textarea>
				</div>

				<div>
					<label for="description" class="block text-xs font-semibold uppercase tracking-[0.1em] text-volcanic-400 mb-1.5">Description</label>
					<textarea
						id="description"
						bind:value={description}
						rows="2"
						class="w-full px-4 py-2.5 bg-sand-50 border border-sand-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-coral-300 focus:border-transparent text-volcanic-700 placeholder-volcanic-300 transition-all resize-none"
						placeholder="More details..."
					></textarea>
				</div>

				<div class="flex gap-3 justify-end pt-3 border-t border-sand-100">
					<button
						type="button"
						onclick={onCancel}
						class="px-5 py-2.5 text-sm text-volcanic-400 hover:text-volcanic-600 transition-colors font-medium"
					>
						Cancel
					</button>
					<button
						type="submit"
						disabled={loading}
						class="px-6 py-2.5 bg-volcanic-800 text-sand-50 text-sm rounded-full hover:bg-volcanic-700 disabled:opacity-50 transition-all font-medium shadow-warm hover:shadow-warm-lg"
					>
						{loading ? 'Saving...' : 'Save Activity'}
					</button>
				</div>
			</form>
		</div>
	</div>
</div>
