# CLAUDE.md

## Project Overview

**Clash of Baby Names** is a Vue 3 single-page application for browsing Hungarian baby names through a Tinder-like swipe interface. Users swipe right to like or left to dislike names, manage favorites, and filter by gender and starting letter. The UI is in Hungarian. There is no backend — all data is static JSON bundled at build time, and user selections persist in `localStorage`.

## Tech Stack

- **Framework**: Vue 3.5 (Composition API with `<script setup>`)
- **State Management**: Pinia 3 (Composition API style via `defineStore` with `setup` function)
- **Routing**: Vue Router 4 (history mode, base path `/clash-of-babynames/`)
- **Styling**: Tailwind CSS 4 (via `@tailwindcss/vite` plugin) + CSS custom properties for theming
- **Build**: Vite 6
- **Language**: TypeScript 5.8 (strict mode)
- **Package Manager**: pnpm 10.5.2
- **Deployment**: GitHub Pages via GitHub Actions (push to `main` triggers build + deploy)

## Commands

```bash
pnpm install          # Install dependencies (use --frozen-lockfile in CI)
pnpm dev              # Start Vite dev server with hot reload
pnpm build            # Type-check with vue-tsc then build with Vite
pnpm preview          # Preview production build locally
pnpm lint             # Run ESLint with --fix on .vue/.ts files
```

There are no test commands — the project has no test suite.

## Project Structure

```
src/
  assets/               # Static JSON data files
    boy-names.json        # Hungarian boy names array
    girl-names.json       # Hungarian girl names array
    names-metadata.json   # Name meanings and name day dates
  components/           # Reusable Vue components
    NameDetailsModal.vue  # Full-screen modal showing name details
    SwipeCard.vue         # Draggable swipe card with touch/mouse handling
    TheTabBar.vue         # Bottom navigation bar (3 tabs)
  router/
    index.ts              # Route definitions (/, /favorites, /settings)
  stores/
    name.ts               # Pinia store: all app state, computed values, actions
  views/                # Page-level components (one per route)
    SwipeView.vue         # Main swiping interface
    FavoritesView.vue     # Liked/disliked names list with filters
    SettingsView.vue      # Preferences, letter filters, dark mode, reset
  App.vue               # Root component with RouterView and TheTabBar
  main.ts               # App bootstrap (createApp, Pinia, Router)
  style.css             # Global styles, CSS variables, Tailwind imports
  utils.ts              # Utility functions (localStorage helpers)
scripts/
  scrape-names.js       # Node.js scraper for name metadata from magyarnevek.hu
```

## Architecture & Key Patterns

### State Management (`src/stores/name.ts`)
All application state lives in a single Pinia store (`useNameStore`). The store uses the Composition API pattern (setup function returning refs, computed, and functions). Key types:

- `Gender`: `'boy' | 'girl'`
- `Vote`: `'like' | 'dislike'`
- `BabyName`: `{ id, name, gender, vote, votedAt, meaning?, nameDays? }`

State is automatically persisted to `localStorage` via Vue `watch()` callbacks. The names array is shuffled once per session using Fisher-Yates.

### Routing
Three routes defined in `src/router/index.ts`:
- `/` — `SwipeView` (main card swiping)
- `/favorites` — `FavoritesView` (liked/disliked lists)
- `/settings` — `SettingsView` (preferences and filters)

### Styling
- Tailwind CSS 4 utility classes for layout and responsive design
- CSS custom properties in `src/style.css` for theme colors (light/dark via `.dark` class)
- Vue scoped styles (`<style scoped>`) for component-specific rules
- Mobile-first, iOS-inspired design with safe area insets

### Data Flow
Static JSON files (`boy-names.json`, `girl-names.json`, `names-metadata.json`) are imported at build time. No API calls. The Hungarian alphabet (44 characters including digraphs like Cs, Gy, Sz, Zs) is handled specially for letter filtering — digraphs are matched by sorting them longest-first.

## Code Style & Conventions

### Formatting (enforced by ESLint)
- **Indentation**: 4 spaces (no tabs)
- **Quotes**: Single quotes
- **Semicolons**: Always required
- **Trailing commas**: Required in multiline constructs
- **Arrow parens**: Always required `(x) => ...`
- **Object curly spacing**: `{ key: value }` (spaces inside braces)
- **Brace style**: 1TBS (`} else {` on same line)
- **No space before function parens**: `function foo()` (except async arrows)
- **Import sorting**: Enforced by `eslint-plugin-simple-import-sort`
- **Line endings**: Unix (LF)

### TypeScript
- Strict mode enabled with `noUnusedLocals` and `noUnusedParameters`
- Target ES2020, module ESNext
- All Vue components use `<script setup lang="ts">`
- Type exports (`Gender`, `Vote`, `BabyName`) from the store file

### Vue Conventions
- Composition API exclusively (no Options API)
- `<script setup lang="ts">` in all single-file components
- Pinia stores use the setup/composition syntax, not the options syntax
- Component naming: PascalCase files (`SwipeCard.vue`, `TheTabBar.vue`)
- Views use `*View.vue` suffix

### ESLint Config
Flat config format (`eslint.config.js`). Applies to `**/*.ts` and `**/*.vue`. Config files, `.d.ts`, `.js`, and `.json` are ignored.

## CI/CD

GitHub Actions workflow (`.github/workflows/pages.yml`):
1. Triggers on push to `main`
2. Sets up Node 22 + pnpm 10.5.2
3. Runs `pnpm i --frozen-lockfile` then `pnpm build`
4. Deploys `dist/` to GitHub Pages via `peaceiris/actions-gh-pages@v3`

## Common Tasks

### Adding a new view/page
1. Create `src/views/NewView.vue` with `<script setup lang="ts">`
2. Add route in `src/router/index.ts`
3. Optionally add tab in `src/components/TheTabBar.vue`

### Adding store state
Add refs, computed, and actions inside the `useNameStore` setup function in `src/stores/name.ts`. Add `watch()` calls if the new state should persist to `localStorage`.

### Modifying theme colors
Edit CSS custom properties in `src/style.css` under `:root` (light) and `.dark` (dark mode).

### Running the linter before committing
```bash
pnpm lint
```
This auto-fixes formatting issues. Always run before committing to ensure ESLint compliance.
