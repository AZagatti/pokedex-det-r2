<script lang="ts">
	import { onMount } from 'svelte';
	import { getPokemonDetails } from '$lib/services/pokemon';
	import { favorites } from '$lib/stores/favorites';
	import { Heart, ArrowLeft } from '@lucide/svelte';
	import type { PokemonDetails } from '$lib/types/pokemon';

	let favoritesPokemon: PokemonDetails[] = $state([]);
	let localFavorites: number[] = $state([]);
	let loading = $state(true);
	let error = $state('');

	$effect(() => {
		favorites.subscribe((fav) => {
			localFavorites = fav;
		});
	});

	onMount(async () => {
		try {
			const pokemonDetails = await Promise.all(
				localFavorites.map((id) => getPokemonDetails(id.toString()))
			);
			favoritesPokemon = pokemonDetails;
			loading = false;
		} catch (err) {
			error = 'Failed to load favorite Pokémon';
			loading = false;
		}
	});

	function toggleFavorite(id: number, e: Event) {
		e.preventDefault();
		e.stopPropagation();
		favorites.toggle(id);
	}
</script>

<div class="min-h-screen bg-gradient-to-b from-green-50 to-white">
	<header class="bg-green-600 text-white shadow-lg">
		<div class="max-w-7xl mx-auto px-4 py-6">
			<div class="flex justify-between items-center">
				<div class="flex items-center gap-4">
					<a href="/" class="hover:text-green-100 transition">
						<ArrowLeft size={24} />
					</a>
					<h1 class="text-3xl font-bold">Favorite Pokémon</h1>
				</div>
				<nav class="flex gap-4">
					<a href="/" class="hover:text-green-100 transition">Home</a>
					<a href="/favorites" class="hover:text-green-100 transition">Favorites</a>
				</nav>
			</div>
		</div>
	</header>

	<main class="max-w-7xl mx-auto px-4 py-8">
		{#if loading}
			<div class="text-center py-12">
				<p class="text-gray-600">Loading favorites...</p>
			</div>
		{:else if error}
			<div class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
				{error}
			</div>
		{:else if localFavorites.length === 0}
			<div class="text-center py-12">
				<p class="text-gray-600 text-lg">No favorite Pokémon yet</p>
				<a href="/" class="text-green-600 hover:text-green-700 mt-4 inline-block"
					>Go back and add some!</a
				>
			</div>
		{:else}
			<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
				{#each favoritesPokemon as pokemon (pokemon.id)}
					<a href="/pokemon/{pokemon.id}" class="group">
						<div
							class="bg-white rounded-lg shadow hover:shadow-lg transition transform hover:scale-105 cursor-pointer overflow-hidden h-full"
						>
							<div class="relative bg-gradient-to-br from-green-100 to-emerald-100 p-4 h-48">
								<img
									src={pokemon.image}
									alt={pokemon.name}
									class="w-full h-full object-contain"
								/>
								<button
									onclick={(e) => toggleFavorite(pokemon.id, e)}
									class="absolute top-2 right-2 p-2 bg-white rounded-full shadow hover:bg-red-50 transition"
								>
									<Heart size={20} class="fill-red-500 text-red-500" />
								</button>
							</div>
							<div class="p-4">
								<h3 class="font-bold text-lg text-gray-800 group-hover:text-green-500">
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
