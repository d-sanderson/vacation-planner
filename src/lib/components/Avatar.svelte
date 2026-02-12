<script lang="ts">
	interface Props {
		name: string;
		size?: 'sm' | 'md' | 'lg';
	}

	let { name, size = 'md' }: Props = $props();

	const colors = [
		'bg-coral-400 text-white',
		'bg-ocean-400 text-white',
		'bg-navy-500 text-white',
		'bg-sand-500 text-white',
	];

	const sizeClasses = {
		sm: 'w-8 h-8 text-xs',
		md: 'w-10 h-10 text-sm',
		lg: 'w-12 h-12 text-base',
	};

	const initials = $derived((() => {
		const parts = name.trim().split(' ');
		if (parts.length >= 2) {
			return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
		}
		return name.substring(0, 2).toUpperCase();
	})());

	const colorClass = $derived((() => {
		let hash = 0;
		for (let i = 0; i < name.length; i++) {
			hash = name.charCodeAt(i) + ((hash << 5) - hash);
		}
		return colors[Math.abs(hash) % colors.length];
	})());
</script>

<div
	class="inline-flex items-center justify-center rounded-full font-semibold shrink-0 ring-2 ring-white {sizeClasses[size]} {colorClass}"
	title={name}
>
	{initials}
</div>
