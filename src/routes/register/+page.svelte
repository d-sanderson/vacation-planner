<script lang="ts">
	import { authClient } from '$lib/auth-client';
	import { goto } from '$app/navigation';

	let name = $state('');
	let email = $state('');
	let password = $state('');
	let error = $state('');
	let loading = $state(false);

	async function handleRegister() {
		error = '';
		loading = true;
		try {
			const result = await authClient.signUp.email({ name, email, password });
			if (result.error) {
				error = result.error.message ?? 'Registration failed';
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
			<div class="w-12 h-12 rounded-2xl bg-gradient-to-br from-ocean-400 to-ocean-500 flex items-center justify-center shadow-warm-lg">
				<svg class="w-6 h-6 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
					<path d="M16 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="8.5" cy="7" r="4"/><line x1="20" y1="8" x2="20" y2="14"/><line x1="23" y1="11" x2="17" y2="11"/>
				</svg>
			</div>
		</div>

		<h1 class="font-display text-3xl font-semibold text-volcanic-800 text-center mb-2 tracking-tight">Create account</h1>
		<p class="text-sm text-volcanic-300 text-center mb-8 font-light">Join to start planning your adventures</p>

		{#if error}
			<div class="bg-coral-50 border border-coral-200 text-coral-700 px-4 py-3 rounded-xl mb-5 text-sm font-light">
				{error}
			</div>
		{/if}

		<form onsubmit={handleRegister} class="space-y-4">
			<div>
				<label for="name" class="block text-xs font-semibold uppercase tracking-[0.1em] text-volcanic-400 mb-1.5">Name</label>
				<input
					id="name"
					type="text"
					bind:value={name}
					required
					class="w-full px-4 py-3 bg-white border border-sand-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-ocean-300 focus:border-transparent text-volcanic-700 placeholder-volcanic-300 shadow-warm transition-all"
					placeholder="Your name"
				/>
			</div>

			<div>
				<label for="email" class="block text-xs font-semibold uppercase tracking-[0.1em] text-volcanic-400 mb-1.5">Email</label>
				<input
					id="email"
					type="email"
					bind:value={email}
					required
					class="w-full px-4 py-3 bg-white border border-sand-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-ocean-300 focus:border-transparent text-volcanic-700 placeholder-volcanic-300 shadow-warm transition-all"
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
					minlength="8"
					class="w-full px-4 py-3 bg-white border border-sand-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-ocean-300 focus:border-transparent text-volcanic-700 placeholder-volcanic-300 shadow-warm transition-all"
					placeholder="Min 8 characters"
				/>
			</div>

			<button
				type="submit"
				disabled={loading}
				class="w-full bg-volcanic-800 text-sand-50 py-3 px-4 rounded-full hover:bg-volcanic-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all font-medium shadow-warm hover:shadow-warm-lg mt-2"
			>
				{loading ? 'Creating account...' : 'Create Account'}
			</button>
		</form>

		<p class="mt-6 text-center text-sm text-volcanic-300">
			Already have an account?
			<a href="/login" class="text-coral-500 hover:text-coral-600 font-medium transition-colors">Sign in</a>
		</p>
	</div>
</div>
