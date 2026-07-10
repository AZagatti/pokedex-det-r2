<script lang="ts">
	import { onMount } from 'svelte';
	import { getPokemonList, searchPokemon } from '$lib/services/pokemon';
	import { favorites } from '$lib/stores/favorites';
	import { Heart } from '@lucide/svelte';
	import type { PokemonListItem } from '$lib/types/pokemon';

	let pokemonList: PokemonListItem[] = $state([]);
	let filteredList: PokemonListItem[] = $state([]);
	let searchQuery = $state('');
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
			pokemonList = await getPokemonList(151);
			filteredList = pokemonList;
			loading = false;
		} catch (err) {
			error = 'Failed to load Pokémon list';
			loading = false;
		}
	});

	async function handleSearch() {
		if (!searchQuery) {
			filteredList = pokemonList;
		} else {
			filteredList = await searchPokemon(searchQuery);
		}
	}

	function toggleFavorite(id: number, e: Event) {
		e.preventDefault();
		e.stopPropagation();
		favorites.toggle(id);
	}
</script>

<div class="min-h-screen bg-gradient-to-b from-red-50 to-white">
	<header class="bg-red-500 text-white shadow-lg">
		<div class="max-w-7xl mx-auto px-4 py-6">
			<div class="flex justify-between items-center">
				<div>
					<h1 class="text-4xl font-bold">Pokédex</h1>
					<p class="text-red-100 mt-2">Gotta catch 'em all!</p>
				</div>
				<nav class="flex gap-4">
					<a href="/" class="hover:text-red-100 transition">Home</a>
					<a href="/favorites" class="hover:text-red-100 transition">Favorites</a>
				</nav>
			</div>
		</div>
	</header>

	<main class="max-w-7xl mx-auto px-4 py-8">
		<!-- Search Bar -->
		<div class="mb-8">
			<div class="flex gap-2">
				<input
					type="text"
					bind:value={searchQuery}
					oninput={handleSearch}
					placeholder="Search Pokémon..."
					class="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
				/>
			</div>
		</div>

		{#if loading}
			<div class="text-center py-12">
				<p class="text-gray-600">Loading Pokémon...</p>
			</div>
		{:else if error}
			<div class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
				{error}
			</div>
		{:else}
			<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
				{#each filteredList as pokemon (pokemon.id)}
					<a href="/pokemon/{pokemon.id}" class="group">
						<div
							class="bg-white rounded-lg shadow hover:shadow-lg transition transform hover:scale-105 cursor-pointer overflow-hidden h-full"
						>
							<div class="relative bg-gradient-to-br from-blue-100 to-purple-100 p-4 h-48">
								<img
									src={pokemon.image}
									alt={pokemon.name}
									class="w-full h-full object-contain"
								/>
								<button
									onclick={(e) => toggleFavorite(pokemon.id, e)}
									class="absolute top-2 right-2 p-2 bg-white rounded-full shadow hover:bg-red-50 transition"
								>
									<Heart
										size={20}
										class={localFavorites.includes(pokemon.id) ? 'fill-red-500 text-red-500' : 'text-gray-400'}
									/>
								</button>
							</div>
							<div class="p-4">
								<h3 class="font-bold text-lg text-gray-800 group-hover:text-red-500">
									#{pokemon.id.toString().padStart(3, '0')} {pokemon.name}
								</h3>
							</div>
						</div>
					</a>
				{/each}
			</div>
		{/if}
	</main>
</div>
