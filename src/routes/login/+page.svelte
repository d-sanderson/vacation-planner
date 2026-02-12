<script lang="ts">
	import { authClient } from '$lib/auth-client';
	import { goto } from '$app/navigation';

	let email = $state('');
	let password = $state('');
	let error = $state('');
	let loading = $state(false);

	async function handleLogin() {
		error = '';
		loading = true;
		try {
			const result = await authClient.signIn.email({ email, password });
			if (result.error) {
				error = result.error.message ?? 'Login failed';
			} else {
				goto('/', { invalidateAll: true });
			}
		} catch (e) {
			error = 'An unexpected error occurred';
		} finally {
			loading = false;
		}
	}
</script>

<div class="min-h-[80vh] flex items-center justify-center px-4">
	<div class="w-full max-w-sm animate-fade-up">
		<!-- Decorative accent -->
		<div class="flex justify-center mb-8">
			<div class="w-12 h-12 rounded-2xl bg-gradient-to-br from-coral-400 to-sand-500 flex items-center justify-center shadow-warm-lg">
				<svg class="w-6 h-6 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
					<path d="M15 3h4a2 2 0 012 2v14a2 2 0 01-2 2h-4M10 17l5-5-5-5M13.8 12H3"/>
				</svg>
			</div>
		</div>

		<h1 class="font-display text-3xl font-semibold text-volcanic-800 text-center mb-2 tracking-tight">Welcome back</h1>
		<p class="text-sm text-volcanic-300 text-center mb-8 font-light">Sign in to manage your itineraries</p>

		{#if error}
			<div class="bg-coral-50 border border-coral-200 text-coral-700 px-4 py-3 rounded-xl mb-5 text-sm font-light">
				{error}
			</div>
		{/if}

		<form onsubmit={handleLogin} class="space-y-4">
			<div>
				<label for="email" class="block text-xs font-semibold uppercase tracking-[0.1em] text-volcanic-400 mb-1.5">Email</label>
				<input
					id="email"
					type="email"
					bind:value={email}
					required
					class="w-full px-4 py-3 bg-white border border-sand-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-coral-300 focus:border-transparent text-volcanic-700 placeholder-volcanic-300 shadow-warm transition-all"
					placeholder="you@example.com"
				/>
			</div>

			<div>
				<label for="password" class="block text-xs font-semibold uppercase tracking-[0.1em] text-volcanic-400 mb-1.5">Password</label>
				<input
					id="password"
					type="password"
					bind:value={password}
					required
					class="w-full px-4 py-3 bg-white border border-sand-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-coral-300 focus:border-transparent text-volcanic-700 placeholder-volcanic-300 shadow-warm transition-all"
					placeholder="Your password"
				/>
			</div>

			<button
				type="submit"
				disabled={loading}
				class="w-full bg-volcanic-800 text-sand-50 py-3 px-4 rounded-full hover:bg-volcanic-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all font-medium shadow-warm hover:shadow-warm-lg mt-2"
			>
				{loading ? 'Signing in...' : 'Sign In'}
			</button>
		</form>

		<p class="mt-6 text-center text-sm text-volcanic-300">
			Don't have an account?
			<a href="/register" class="text-coral-500 hover:text-coral-600 font-medium transition-colors">Create one</a>
		</p>
	</div>
</div>
