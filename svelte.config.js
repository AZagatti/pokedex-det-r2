import adapter from '@sveltejs/adapter-static';

const dev = process.env.NODE_ENV === 'development';

export default {
	kit: {
		adapter: adapter({
			fallback: 'index.html',
			precompress: false,
			pages: 'build',
			assets: 'build',
			strict: false
		}),
		paths: {
			base: dev ? '' : '/pokedex-det-r2'
		},
		prerender: {
			entries: []
		}
	}
};
