<script lang="ts">
	import type { TripMemberWithUser } from '$lib/types';
	import Avatar from './Avatar.svelte';
	import { invalidateAll } from '$app/navigation';

	interface Props {
		members: TripMemberWithUser[];
		tripId: string;
		isAdmin?: boolean;
	}

	let { members, tripId, isAdmin = false }: Props = $props();
	let showAddForm = $state(false);
	let email = $state('');
	let role = $state<'member' | 'organizer'>('member');
	let loading = $state(false);
	let formError = $state('');

	async function handleAddMember() {
		if (!email.trim()) return;
		formError = '';
		loading = true;

		try {
			const res = await fetch(`/api/trips/${tripId}/members`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ email: email.trim(), role }),
			});

			if (!res.ok) {
				const data = await res.json().catch(() => null);
				formError = data?.message ?? 'Failed to add member';
				return;
			}

			email = '';
			role = 'member';
			showAddForm = false;
			invalidateAll();
		} catch {
			formError = 'Failed to add member';
		} finally {
			loading = false;
		}
	}

	async function handleRemoveMember(memberId: string, memberName: string) {
		if (!confirm(`Remove ${memberName} from this trip?`)) return;

		await fetch(`/api/trips/${tripId}/members/${memberId}`, { method: 'DELETE' });
		invalidateAll();
	}
</script>

<div class="bg-white/70 backdrop-blur-sm rounded-2xl shadow-warm border border-sand-200/50 p-6">
	<div class="flex items-center justify-between mb-4">
		<h3 class="font-display text-lg font-semibold text-volcanic-800 flex items-center gap-2">
			<svg class="w-5 h-5 text-ocean-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
				<path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 00-3-3.87" /><path d="M16 3.13a4 4 0 010 7.75" />
			</svg>
			Travelers
			<span class="text-sm font-normal text-volcanic-300">({members.length})</span>
		</h3>
		{#if isAdmin}
			<button
				onclick={() => { showAddForm = !showAddForm; formError = ''; }}
				class="text-sm text-coral-500 hover:text-coral-600 font-medium transition-colors"
			>
				{showAddForm ? 'Cancel' : '+ Invite'}
			</button>
		{/if}
	</div>

	{#if showAddForm}
		<div class="mb-5 p-4 bg-sand-50/80 rounded-xl border border-sand-200/60 animate-fade-up">
			{#if formError}
				<div class="bg-coral-50 border border-coral-200 text-coral-700 px-3 py-2 rounded-lg mb-3 text-sm font-light">
					{formError}
				</div>
			{/if}
			<form onsubmit={(e) => { e.preventDefault(); handleAddMember(); }} class="flex gap-2 items-end">
				<div class="flex-1">
					<label for="member-email" class="block text-xs font-semibold uppercase tracking-[0.1em] text-volcanic-400 mb-1">Email</label>
					<input
						id="member-email"
						type="email"
						bind:value={email}
						placeholder="user@example.com"
						required
						class="w-full px-3 py-2 text-sm bg-white border border-sand-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-ocean-300 focus:border-transparent transition-all"
					/>
				</div>
				<div class="w-28">
					<label for="member-role" class="block text-xs font-semibold uppercase tracking-[0.1em] text-volcanic-400 mb-1">Role</label>
					<select
						id="member-role"
						bind:value={role}
						class="w-full px-3 py-2 text-sm bg-white border border-sand-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-ocean-300 focus:border-transparent transition-all"
					>
						<option value="member">Member</option>
						<option value="organizer">Organizer</option>
					</select>
				</div>
				<button
					type="submit"
					disabled={loading}
					class="px-4 py-2 text-sm font-medium text-white bg-volcanic-800 hover:bg-volcanic-700 rounded-lg transition-colors disabled:opacity-50 shadow-warm"
				>
					{loading ? '...' : 'Add'}
				</button>
			</form>
		</div>
	{/if}

	{#if members.length > 0}
		<div class="flex flex-wrap gap-2">
			{#each members as member (member.id)}
				<div class="group relative">
					<Avatar name={member.user.name} size="md" />

					<!-- Tooltip -->
					<div class="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1.5 bg-volcanic-800 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10">
						{member.user.name}
						{#if member.role === 'organizer'}
							<span class="text-coral-300 ml-1">Organizer</span>
						{/if}
						<div class="absolute top-full left-1/2 -translate-x-1/2 -mt-0.5 border-4 border-transparent border-t-volcanic-800"></div>
					</div>

					{#if isAdmin}
						<button
							onclick={() => handleRemoveMember(member.id, member.user.name)}
							class="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-coral-500 text-white opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-xs hover:bg-coral-600 shadow-sm"
							title="Remove"
						>
							&times;
						</button>
					{/if}
				</div>
			{/each}
		</div>
	{:else}
		<p class="text-sm text-volcanic-300 font-light italic">No members yet. Invite someone to get started!</p>
	{/if}
</div>
