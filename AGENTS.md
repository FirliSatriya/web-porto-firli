# Agent notes

Portfolio site for Firli Satriya Putri.

## Stack

- Vite 8 + React 19 + React Router 8 (client-side routing, no SSR)
- Tailwind CSS v4 via `@tailwindcss/vite` — configuration lives in CSS
  (`src/index.css`), there is no `tailwind.config.js`
- shadcn/ui components on top of Base UI (`src/components/ui/`)
- `motion` for animation, `lucide-react` for icons

## Rules

- Import alias `@/` maps to `src/` in both `tsconfig.json` and `vite.config.ts`.
- The stylesheet is `src/index.css`. Do not add a second global CSS file, and do
  not hard-code colours: use the tokens declared on `:root` / `.dark`.
- Routes live in `src/app.tsx`; page-level components in `src/pages/`. Per-route
  `<title>`/description come from `PAGE_META` in `src/components/site-layout.tsx`.
- Content and data belong in `src/lib/` so copy changes never touch components.
- Never commit `dist/` or `node_modules/`.