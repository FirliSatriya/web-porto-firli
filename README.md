Portfolio site for Firli Satriya Putri — Applied Informatics Engineer.

Built with [Vite](https://vite.dev), [React 19](https://react.dev), [React Router](https://reactrouter.com) and [Tailwind CSS v4](https://tailwindcss.com).

## Getting Started

```bash
npm install
npm run dev
```

Open the printed URL (default [http://localhost:5173](http://localhost:5173)).

## Scripts

| Script              | What it does                          |
| ------------------- | ------------------------------------- |
| `npm run dev`       | Vite dev server with HMR              |
| `npm run build`     | Type-check, then build to `dist/`     |
| `npm run preview`   | Serve the production build locally    |
| `npm run typecheck` | `tsc --noEmit` only                   |
| `npm run lint`      | ESLint                                |

## Layout

```
index.html              shell, theme boot script
src/main.tsx            entry point (imports src/index.css)
src/app.tsx             routes: /, /gallery, /resume, *
src/index.css           design tokens, keyframes, utilities, print rules
src/pages/              one component per route
src/components/         shell, chrome and section components
src/lib/content.ts      copy and data for the landing page
src/lib/gallery.ts      gallery records
public/gallery/         gallery artwork (placeholder SVGs)
```

## Theming

Every colour is a CSS variable defined twice in `src/index.css` — once on
`:root` for light, once on `.dark` for dark. Components only reference the
tokens (`bg-background`, `text-subtle`, `border-hairline`, `text-tone-mid`, …),
never raw hex values. An inline script in `index.html` applies the stored theme
before first paint to avoid a flash.

## Gallery

`/gallery` is a CSS-columns masonry wall with a dialog lightbox. Artwork lives in
`public/gallery/` and is described in `src/lib/gallery.ts`; swap the files and
update the matching record to replace a frame.

## Deploy

`npm run build` emits a static bundle in `dist/`. Because routing is client
side, point the host at `dist/index.html` for unknown paths (SPA fallback).