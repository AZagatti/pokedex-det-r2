import type { Pokemon, PokemonListItem, PokemonDetails } from '$lib/types/pokemon';

const API_BASE = 'https://pokeapi.co/api/v2';

const typeColors: Record<string, string> = {
	normal: '#A8A878',
	fire: '#F08030',
	water: '#6890F0',
	grass: '#78C850',
	electric: '#F8D030',
	ice: '#98D8D8',
	fighting: '#C03028',
	poison: '#A040A0',
	ground: '#E0C068',
	flying: '#A890F0',
	psychic: '#F85888',
	bug: '#A8B820',
	rock: '#B8A038',
	ghost: '#705898',
	dragon: '#7038F8',
	dark: '#705848',
	steel: '#B8B8D0',
	fairy: '#EE99AC'
};

export async function getPokemonList(limit = 151, offset = 0): Promise<PokemonListItem[]> {
	const response = await fetch(`${API_BASE}/pokemon?limit=${limit}&offset=${offset}`);
	const data = await response.json();

	return Promise.all(
		data.results.map(async (pokemon: { name: string; url: string }) => {
			const urlParts = pokemon.url.split('/').filter((x: string) => x);
			const id = parseInt(urlParts[urlParts.length - 1] || '0');
			return {
				id,
				name: pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1),
				image: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`,
				types: [] // Will be fetched if needed
			};
		})
	);
}

export async function getPokemonDetails(idOrName: string | number): Promise<PokemonDetails> {
	const response = await fetch(`${API_BASE}/pokemon/${idOrName}`);
	if (!response.ok) throw new Error(`Pokemon not found: ${idOrName}`);

	const pokemon = await response.json();
	const species = await fetch(`${API_BASE}/pokemon-species/${pokemon.id}`).then((r) => r.json());

	const types = pokemon.types.map((t: any) => ({
		name: t.type.name.charAt(0).toUpperCase() + t.type.name.slice(1),
		color: typeColors[t.type.name] || '#666'
	}));

	const stats = pokemon.stats.map((stat: any) => ({
		name: stat.stat.name.charAt(0).toUpperCase() + stat.stat.name.slice(1),
		value: stat.base_stat,
		max: 255
	}));

	const description = species.flavor_text_entries
		?.find((entry: any) => entry.language.name === 'en')
		?.flavor_text?.replace(/[\n\f]/g, ' ') || 'No description available';

	// Fetch evolution chain
	const evolutionChain = await fetch(species.evolution_chain.url).then((r) => r.json());
	const evolutions = extractEvolutions(evolutionChain.chain, pokemon.id);

	return {
		id: pokemon.id,
		name: pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1),
		image: pokemon.sprites.other['official-artwork'].front_default,
		types: pokemon.types.map((t: any) => t.type.name.charAt(0).toUpperCase() + t.type.name.slice(1)),
		height: pokemon.height / 10,
		weight: pokemon.weight / 10,
		stats: Object.fromEntries(
			pokemon.stats.map((s: any) => [
				s.stat.name.charAt(0).toUpperCase() + s.stat.name.slice(1),
				s.base_stat
			])
		),
		abilities: pokemon.abilities.map((a: any) => a.ability.name.charAt(0).toUpperCase() + a.ability.name.slice(1)),
		evolutions: extractEvolutions(evolutionChain.chain, pokemon.id)
	};
}

function extractEvolutions(chain: any, currentId: number): any[] {
	const evolutions: any[] = [];

	const processChain = (node: any) => {
		if (node.evolves_to.length > 0) {
			node.evolves_to.forEach((evolution: any) => {
				const urlParts = evolution.species.url.split('/').filter((x: string) => x);
				const evoId = parseInt(urlParts[urlParts.length - 1] || '0');
				evolutions.push({
					id: evoId,
					name: evolution.species.name.charAt(0).toUpperCase() + evolution.species.name.slice(1),
					image: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${evoId}.png`,
					method: evolution.evolution_details[0]?.trigger.name || 'unknown'
				});
				processChain(evolution);
			});
		}
	};

	processChain(chain);
	return evolutions;
}

export async function searchPokemon(query: string): Promise<PokemonListItem[]> {
	const list = await getPokemonList(1000);
	return list.filter((p) => p.name.toLowerCase().includes(query.toLowerCase()));
}

export function getTypeColor(typeName: string): string {
	return typeColors[typeName.toLowerCase()] || '#666';
}
