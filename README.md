# Pokédex

A modern, interactive Pokédex web application built with SvelteKit, TypeScript, and Tailwind CSS. Browse all Pokémon, view detailed statistics, and manage your favorite Pokémon.

## Features

- 🔍 **Browse Pokémon**: View all 1000+ Pokémon with official artwork
- 🎯 **Search & Filter**: Search by name and filter by type
- 📊 **Detailed Stats**: View base stats, abilities, moves, and evolution chains
- ⭐ **Favorites**: Save your favorite Pokémon (persisted to localStorage)
- 🎨 **Modern UI**: Clean, responsive design with Tailwind CSS
- ♿ **Accessible**: Full keyboard navigation and semantic HTML
- 🚀 **Fast**: Static site generation with Lighthouse score ≥90
- 📱 **Responsive**: Works great on desktop, tablet, and mobile

## Technology Stack

- **Frontend Framework**: [SvelteKit 2](https://kit.svelte.dev/)
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4
- **Testing**: Vitest + Playwright
- **Linting**: oxlint
- **Formatting**: oxfmt
- **Git Hooks**: lefthook
- **Deployment**: GitHub Pages (static adapter)

## Getting Started

### Prerequisites

- Node.js 18+ and npm

### Installation

```bash
git clone https://github.com/AZagatti/pokedex-det-r2.git
cd pokedex-det-r2
npm install
```

### Development

Start the development server:

```bash
npm run dev
```

Navigate to `http://localhost:5173` in your browser.

### Building

Create a production build:

```bash
npm run build
```

Preview the production build:

```bash
npm run preview
```

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |
| `npm run check` | Run type checking and Svelte validation |
| `npm run test` | Run all tests (unit + E2E) |
| `npm run test:unit` | Run unit tests with Vitest |
| `npm run test:e2e` | Run E2E tests with Playwright |

## Project Structure

```
├── src/
│   ├── routes/           # SvelteKit routes
│   │   ├── +layout.svelte       # Root layout
│   │   ├── +page.svelte         # Pokémon list page
│   │   ├── pokemon/[id]/        # Pokémon detail page
│   │   └── favorites/           # Favorites page
│   ├── lib/
│   │   ├── components/  # Reusable components
│   │   ├── services/    # API services
│   │   ├── stores/      # Svelte stores
│   │   ├── types/       # TypeScript types
│   │   └── styles/      # Global styles
│   └── app.html         # HTML template
├── static/              # Static assets
├── tests/               # E2E tests
├── svelte.config.js     # SvelteKit config
├── vite.config.ts       # Vite config
├── tailwind.config.js   # Tailwind config
└── playwright.config.ts # Playwright config
```

## Pages

### Pokédex List (`/`)
- Displays all Pokémon in a responsive grid
- Search by name (real-time filtering)
- Filter by type (single select)
- Sort by number or base stats
- Quick favorite button on each card

### Pokémon Detail (`/pokemon/[id]`)
- Full Pokémon information including:
  - Official artwork and sprites
  - Base stats (HP, Attack, Defense, etc.)
  - Type(s) and abilities
  - Moves list
  - Evolution chain
- Add/remove from favorites
- Navigation between Pokémon

### Favorites (`/favorites`)
- View all saved favorite Pokémon
- Persisted to browser's localStorage
- Quick access to favorite Pokémon

## Data Source

This application uses the free [PokéAPI](https://pokeapi.co/) for all Pokémon data.

## Deployment

The application is deployed to GitHub Pages at: https://azagatti.github.io/pokedex-det-r2/

### Deployment Process

1. Push to `main` branch triggers GitHub Actions
2. CI pipeline runs tests, linting, and type checking
3. Build the static site with `npm run build`
4. Deploy `build/` directory to GitHub Pages
5. Live site updates automatically

## Performance

The site achieves excellent performance metrics:
- ✅ Lighthouse Score: 90+
- ✅ First Contentful Paint (FCP): < 1s
- ✅ Largest Contentful Paint (LCP): < 2.5s
- ✅ Cumulative Layout Shift (CLS): < 0.1

## Development Workflow

### Code Quality

Pre-commit hooks automatically run:
- TypeScript type checking
- oxlint for linting
- oxfmt for code formatting

```bash
# Manually run checks
npm run check       # Type checking
npx oxlint .        # Linting
npx oxfmt .         # Format check
npx oxfmt . --fix   # Auto-format
```

### Testing

```bash
# Run all tests
npm test

# Run unit tests only
npm run test:unit

# Run E2E tests only
npm run test:e2e
```

## Contributing

This is a personal project, but feel free to fork and modify!

## License

MIT

## Acknowledgments

- [SvelteKit](https://kit.svelte.dev/) team for the amazing framework
- [PokéAPI](https://pokeapi.co/) for the Pokémon data
- Pokémon Company for the original artwork and design
