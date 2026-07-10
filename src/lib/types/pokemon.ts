export interface PokemonType {
	name: string;
	color: string;
}

export interface Stat {
	name: string;
	value: number;
	max?: number;
}

export interface Pokemon {
	id: number;
	name: string;
	image: string;
	types: PokemonType[];
	height: number;
	weight: number;
	description: string;
	stats: Stat[];
	evolutions: PokemonEvolution[];
	baseExperience: number;
	captureRate: number;
	eggCycles: number;
	eggGroups: string[];
	generation: number;
}

export interface PokemonEvolution {
	id: number;
	name: string;
	image: string;
	method: string;
}

export interface PokemonListItem {
	id: number;
	name: string;
	image: string;
	types: string[];
}

export interface PokemonDetails {
	id: number;
	name: string;
	image: string;
	types: string[];
	height: number;
	weight: number;
	stats: Record<string, number>;
	abilities: string[];
	evolutions: PokemonEvolution[];
}
