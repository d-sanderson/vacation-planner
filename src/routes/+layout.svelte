<script lang="ts">
	import '../app.css';
	import { browser } from '$app/environment';
	import { page } from '$app/state';
	import { authClient } from '$lib/auth-client';
	import { invalidateAll } from '$app/navigation';
	import { onMount } from 'svelte';

	let { children } = $props();

	onMount(() => {
		import('@lottiefiles/dotlottie-wc');
	});

	const user = $derived(page.data.user);
	const isAdmin = $derived(user?.role === 'admin');

	async function handleLogout() {
		await authClient.signOut();
		invalidateAll();
	}
</script>

<div class="min-h-screen">
	<!-- Decorative top gradient bar -->
	<div class="h-1 bg-gradient-to-r from-coral-400 via-sand-400 to-ocean-400"></div>

	<nav class="bg-sand-50/80 backdrop-blur-md border-b border-sand-200/60 sticky top-0 z-50">
		<div class="max-w-4xl mx-auto px-6 h-16 flex items-center justify-between">
			<a href="/" class="group flex items-center gap-2">
				<dotlottie-wc
					src="https://assets-v2.lottiefiles.com/a/ff219128-1151-11ee-be80-7be0ae65cdee/YYe9VqWMYY.lottie"
					autoplay
					loop
					style="width: 44px; height: 44px;"
				></dotlottie-wc>
				<span class="font-display text-xl font-semibold text-volcanic-800 tracking-tight group-hover:text-coral-500 transition-colors">
					Baw's Big 4-0
				</span>
			</a>

			<div class="flex items-center gap-4">
				{#if isAdmin}
					<span class="text-[10px] font-semibold uppercase tracking-[0.15em] bg-ocean-50 text-ocean-500 px-2.5 py-1 rounded-full border border-ocean-200/60">
						Admin
					</span>
				{/if}

				{#if user}
					<span class="text-sm text-volcanic-400 hidden sm:inline font-light">{user.name}</span>
					<button
						onclick={handleLogout}
						class="text-sm text-volcanic-300 hover:text-coral-500 transition-colors font-medium"
					>
						Sign out
					</button>
				{:else}
					<a
						href="/login"
						class="text-sm font-medium text-volcanic-600 hover:text-coral-500 transition-colors"
					>
						Sign in
					</a>
				{/if}
			</div>
		</div>
	</nav>

	<main class="relative">
		{@render children()}
	</main>

	<!-- Footer -->
	<footer class="mt-auto border-t border-sand-200/60 py-8">
		<div class="max-w-4xl mx-auto px-6">
			<p class="text-xs text-volcanic-300 text-center tracking-wide">
				Happy 40th, Baw! Here's to the next adventure.
			</p>
		</div>
	</footer>
</div>
