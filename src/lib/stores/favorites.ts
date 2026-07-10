import { writable } from 'svelte/store';

function createFavoritesStore() {
	const key = 'pokedex-favorites';
	const initialFavorites = typeof window !== 'undefined' ? JSON.parse(localStorage.getItem(key) || '[]') : [];

	const { subscribe, set, update } = writable<number[]>(initialFavorites);

	return {
		subscribe,
		toggle: (id: number) => {
			update((favorites) => {
				if (favorites.includes(id)) {
					return favorites.filter((fav) => fav !== id);
				} else {
					return [...favorites, id];
				}
			});
		},
		add: (id: number) => {
			update((favorites) => {
				if (!favorites.includes(id)) {
					return [...favorites, id];
				}
				return favorites;
			});
		},
		remove: (id: number) => {
			update((favorites) => favorites.filter((fav) => fav !== id));
		},
		clear: () => set([]),
		isFavorite: (id: number) => {
			let result = false;
			subscribe((favorites) => {
				result = favorites.includes(id);
			});
			return result;
		}
	};
}

export const favorites = createFavoritesStore();

favorites.subscribe((value) => {
	if (typeof window !== 'undefined') {
		localStorage.setItem('pokedex-favorites', JSON.stringify(value));
	}
});
