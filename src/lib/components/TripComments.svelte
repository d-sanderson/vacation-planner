<script lang="ts">
	import type { CommentWithUser } from '$lib/types';
	import Avatar from './Avatar.svelte';
	import { page } from '$app/state';
	import { invalidateAll } from '$app/navigation';

	interface Props {
		comments: CommentWithUser[];
		tripId: string;
	}

	let { comments, tripId }: Props = $props();

	const currentUser = $derived(page.data.user);
	const isAdmin = $derived(currentUser?.role === 'admin');

	let commentText = $state('');
	let loading = $state(false);

	async function handleAddComment() {
		if (!commentText.trim() || !currentUser) return;
		loading = true;

		try {
			const res = await fetch(`/api/trips/${tripId}/comments`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ text: commentText.trim() }),
			});

			if (res.ok) {
				commentText = '';
				invalidateAll();
			}
		} catch {
			// ignore
		} finally {
			loading = false;
		}
	}

	async function handleDeleteComment(commentId: string) {
		if (!confirm('Delete this comment?')) return;
		await fetch(`/api/trips/${tripId}/comments/${commentId}`, { method: 'DELETE' });
		invalidateAll();
	}

	function formatTime(date: Date): string {
		const d = new Date(date);
		const now = new Date();
		const diffMs = now.getTime() - d.getTime();
		const diffMins = Math.floor(diffMs / 60000);
		const diffHours = Math.floor(diffMs / 3600000);
		const diffDays = Math.floor(diffMs / 86400000);

		if (diffMins < 1) return 'just now';
		if (diffMins < 60) return `${diffMins}m ago`;
		if (diffHours < 24) return `${diffHours}h ago`;
		if (diffDays < 7) return `${diffDays}d ago`;

		return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
	}
</script>

<div class="bg-white/70 backdrop-blur-sm rounded-2xl shadow-warm border border-sand-200/50 p-6">
	<h3 class="font-display text-lg font-semibold text-volcanic-800 mb-5 flex items-center gap-2">
		<svg class="w-5 h-5 text-coral-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
			<path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
		</svg>
		Comments
		{#if comments.length > 0}
			<span class="text-sm font-normal text-volcanic-300">({comments.length})</span>
		{/if}
	</h3>

	<!-- Add comment -->
	{#if currentUser}
		<form onsubmit={(e) => { e.preventDefault(); handleAddComment(); }} class="mb-6">
			<div class="flex gap-3 items-start">
				<Avatar name={currentUser.name} size="sm" />
				<div class="flex-1">
					<textarea
						bind:value={commentText}
						placeholder="Add a comment..."
						rows="2"
						class="w-full px-3 py-2.5 text-sm bg-sand-50/80 border border-sand-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-coral-300 focus:border-transparent transition-all resize-none placeholder-volcanic-300"
					></textarea>
					{#if commentText.trim()}
						<div class="flex justify-end mt-2">
							<button
								type="submit"
								disabled={loading}
								class="px-5 py-1.5 text-sm font-medium text-white bg-volcanic-800 hover:bg-volcanic-700 rounded-full transition-all disabled:opacity-50 shadow-warm"
							>
								{loading ? 'Posting...' : 'Post'}
							</button>
						</div>
					{/if}
				</div>
			</div>
		</form>
	{/if}

	<!-- Comment list -->
	{#if comments.length > 0}
		<div class="space-y-4">
			{#each comments as c (c.id)}
				<div class="flex gap-3 group">
					<Avatar name={c.user.name} size="sm" />
					<div class="flex-1 min-w-0">
						<div class="flex items-center gap-2 mb-0.5">
							<span class="font-medium text-sm text-volcanic-700">{c.user.name}</span>
							<span class="text-xs text-volcanic-300">{formatTime(c.createdAt)}</span>
						</div>
						<p class="text-sm text-volcanic-600 leading-relaxed whitespace-pre-wrap break-words font-light">{c.text}</p>
					</div>

					{#if currentUser && (currentUser.id === c.userId || isAdmin)}
						<button
							onclick={() => handleDeleteComment(c.id)}
							class="opacity-0 group-hover:opacity-100 transition-opacity p-1.5 rounded-lg text-volcanic-300 hover:text-coral-500 hover:bg-coral-50/60 self-start shrink-0"
							title="Delete comment"
						>
							<svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
								<path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
							</svg>
						</button>
					{/if}
				</div>
			{/each}
		</div>
	{:else}
		<p class="text-sm text-volcanic-300 text-center py-6 font-light italic">No comments yet. Be the first!</p>
	{/if}
</div>
