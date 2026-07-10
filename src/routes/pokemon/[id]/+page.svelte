<script lang="ts">
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	import { getPokemonDetails } from '$lib/services/pokemon';
	import { favorites } from '$lib/stores/favorites';
	import { Heart, ArrowLeft } from '@lucide/svelte';
	import type { PokemonDetails } from '$lib/types/pokemon';

	let pokemon: PokemonDetails | null = $state(null);
	let loading = $state(true);
	let error = $state('');
	let localFavorites: number[] = $state([]);

	$effect(() => {
		favorites.subscribe((fav) => {
			localFavorites = fav;
		});
	});

	onMount(async () => {
		try {
			const id = $page.params.id;
			if (!id) throw new Error('No Pokemon ID provided');
			pokemon = await getPokemonDetails(id);
			loading = false;
		} catch (err) {
			error = 'Failed to load Pokémon details';
			loading = false;
		}
	});

	function toggleFavorite(id: number | string, e: Event) {
		e.preventDefault();
		const numId = typeof id === 'string' ? parseInt(id) : id;
		if (isNaN(numId)) return;
		favorites.toggle(numId);
	}
</script>

<div class="min-h-screen bg-gradient-to-b from-blue-50 to-white">
	<header class="bg-blue-600 text-white shadow-lg">
		<div class="max-w-7xl mx-auto px-4 py-6">
			<div class="flex justify-between items-center">
				<div class="flex items-center gap-4">
					<a href="/" class="hover:text-blue-100 transition">
						<ArrowLeft size={24} />
					</a>
					<h1 class="text-3xl font-bold">Pokémon Details</h1>
				</div>
				<nav class="flex gap-4">
					<a href="/" class="hover:text-blue-100 transition">Home</a>
					<a href="/favorites" class="hover:text-blue-100 transition">Favorites</a>
				</nav>
			</div>
		</div>
	</header>

	<main class="max-w-4xl mx-auto px-4 py-8">
		{#if loading}
			<div class="text-center py-12">
				<p class="text-gray-600">Loading Pokémon details...</p>
			</div>
		{:else if error}
			<div class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
				{error}
			</div>
		{:else if pokemon}
			<div class="grid grid-cols-1 md:grid-cols-2 gap-8">
				<!-- Image and Basic Info -->
				<div class="flex flex-col items-center">
					<div class="bg-gradient-to-br from-blue-100 to-purple-100 rounded-lg p-8 mb-4 w-full">
						<img src={pokemon.image} alt={pokemon.name} class="w-full h-96 object-contain" />
					</div>
					<button
						onclick={(e) => {
							if (pokemon) toggleFavorite(pokemon.id, e);
						}}
						class="flex items-center gap-2 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition w-full justify-center"
					>
						<Heart
							size={20}
							class={localFavorites.includes(pokemon.id) ? 'fill-white' : ''}
						/>
						{localFavorites.includes(pokemon.id) ? 'Remove from Favorites' : 'Add to Favorites'}
					</button>
				</div>

				<!-- Details -->
				<div>
					<h2 class="text-3xl font-bold text-gray-800 mb-2">
						#{pokemon.id.toString().padStart(3, '0')} {pokemon.name}
					</h2>

					{#if pokemon.types.length > 0}
						<div class="flex gap-2 mb-4">
							{#each pokemon.types as type}
								<span
									class="px-3 py-1 bg-blue-500 text-white rounded-full text-sm font-semibold capitalize"
								>
									{type}
								</span>
							{/each}
						</div>
					{/if}

					<!-- Stats -->
					<div class="mb-6">
						<h3 class="text-xl font-bold text-gray-800 mb-3">Stats</h3>
						<div class="space-y-2">
							{#each Object.entries(pokemon.stats) as [stat, value] (stat)}
								<div class="flex justify-between items-center">
									<span class="text-gray-700 capitalize font-semibold">{stat}</span>
									<div class="flex-1 mx-4 bg-gray-200 rounded-full h-2">
										<div
											class="bg-blue-500 h-2 rounded-full"
											style="width: {((value as number) / 150) * 100}%"
										></div>
									</div>
									<span class="text-gray-700 font-bold">{value}</span>
								</div>
							{/each}
						</div>
					</div>

					<!-- Abilities -->
					{#if pokemon.abilities.length > 0}
						<div class="mb-6">
							<h3 class="text-xl font-bold text-gray-800 mb-2">Abilities</h3>
							<ul class="list-disc list-inside text-gray-700 capitalize">
								{#each pokemon.abilities as ability}
									<li>{ability}</li>
								{/each}
							</ul>
						</div>
					{/if}

					<!-- Evolutions -->
					{#if pokemon.evolutions.length > 0}
						<div>
							<h3 class="text-xl font-bold text-gray-800 mb-3">Evolutions</h3>
							<div class="space-y-3">
								{#each pokemon.evolutions as evo}
									<div class="flex items-center gap-3 p-3 bg-gray-100 rounded-lg">
										<img
											src={evo.image}
											alt={evo.name}
											class="w-20 h-20 object-contain"
										/>
										<div>
											<p class="font-bold text-gray-800">{evo.name}</p>
											<p class="text-sm text-gray-600 capitalize">{evo.method}</p>
										</div>
									</div>
								{/each}
							</div>
						</div>
					{/if}
				</div>
			</div>
		{/if}
	</main>
</div>
