# AI_RULES.md

Project guidance for AI-assisted development of this app (a React e-commerce / product catalogue SPA with an admin area).

## Tech Stack

- **Vite 5 + React 18 + TypeScript** — single-page app, strict-ish TS, `@` alias points at `src/`.
- **React Router v6** — all routes live in `src/App.tsx`; pages are lazy-loaded with `React.lazy` + `Suspense`.
- **Tailwind CSS v3** — all styling; design tokens (colors, fonts, radius) come from `tailwind.config.js` and CSS variables in `src/index.css`.
- **shadcn/ui + Radix UI** — the component foundation; prebuilt primitives already live in `src/components/ui/`.
- **Supabase (Postgres + `@supabase/supabase-js`)** — product, order and site-settings data, accessed via `src/lib/supabaseClient.ts`.
- **Vercel serverless functions** — server-only logic (e.g. Resend email sending) lives in `api/<name>/index.js`.
- **framer-motion** — page/route and element animations.
- **react-hook-form + zod** — form state and validation.
- **lucide-react** — the only icon library.
- **Deployment** — Vercel (`vercel.json`), build output `dist/`, security headers configured there.

## Project Structure

- Source code lives in `src/`.
- Pages go in `src/pages/` (main page: `src/pages/LandingPage.tsx`, served at `/`).
- Reusable components go in `src/components/`; shadcn primitives in `src/components/ui/`.
- Shared helpers/types go in `src/lib/`, global state in `src/context/`, hooks in `src/hooks/`.
- Always wire new components into the relevant page, otherwise users cannot see them.
- Keep routes in `src/App.tsx` and keep files small and focused.

## Library Rules — Use This, Not That

- **Any UI element** (button, dialog, input, select, table, tabs, toast, …) → use the existing **shadcn/ui** component from `src/components/ui/`. Do not hand-roll HTML controls or install another UI kit. These files must **not** be edited — create a new component in `src/components/` if you need different behavior.
- **Accessible primitives not yet wrapped** → use the installed **Radix UI** packages (`@radix-ui/react-*`) directly, then style with Tailwind.
- **Icons** → **lucide-react** only. Do not add icon packs or inline ad-hoc SVG icons for UI chrome.
- **Styling** → **Tailwind CSS** utility classes. Avoid CSS files, inline `style={{}}` objects, and `!important`. Merge conditional classes with `cn()` from `src/lib/utils.ts`.
- **Class merging / variants** → `cn()` (clsx + tailwind-merge) and `class-variance-authority` for component variants (as in shadcn components). Never concatenate class strings by hand.
- **Animation** → **framer-motion**. Do not add GSAP, anime.js, or hand-written keyframe animation libraries; extend `keyframes`/`animation` in `tailwind.config.js` when Tailwind alone suffices.
- **Forms** → **react-hook-form** + **zod** (`@hookform/resolvers`) with shadcn `Form` components. Do not build forms with uncontrolled inputs and manual validation.
- **Toasts / notifications** → **sonner** or the shadcn `use-toast` hook. Do not use `alert()` or a second toast library.
- **Data access** → the shared **Supabase** client from `src/lib/supabaseClient.ts`, using the exported `Product` / `Order` / `SiteSettings` types. Never create additional Supabase clients or hardcode credentials in `src/`.
- **Server-only logic** (secrets, email, third-party APIs) → a Vercel function under `api/<name>/index.js` using `process.env`. Never expose secrets via `VITE_*` variables, which ship to the browser.
- **Charts** → **recharts** (wrapped by shadcn `chart`). Do not add Chart.js, D3 wrappers, or similar.
- **Dates** → **date-fns**. Do not use Moment.js or manual date math.
- **Carousels** → shadcn `carousel` (Embla). **Drawers** → shadcn `drawer` (vaul). **Command palettes** → shadcn `command` (cmdk). **Resizable panels** → shadcn `resizable`. **Theming** → `next-themes` via the existing provider setup.
- **Global state** → React Context in `src/context/` (see `CartContext`) for app-wide state such as the cart; prefer local `useState`/props otherwise. Do not introduce Redux, Zustand, or MobX.
- **Routing / navigation** → `react-router-dom` (`Link`, `useNavigate`). Do not use raw `window.location` for in-app navigation.
- **Error handling** → wrap risky UI in the existing `react-error-boundary` setup. Do not add another error-boundary library.

## Conventions

- Use the `@/` import alias for `src/` paths; keep imports ordered (external, then `@/`).
- Import React types with `import type` where only types are needed.
- Prefer named exports for components/pages (pages are imported as named exports).
- Type everything: define shared shapes in `src/lib/` and reuse them across pages and contexts.
- Reuse existing components (e.g. `Navbar`, `Footer`, `ProductCard`, `PremiumButton`, `SectionHeading`) before creating new ones.
- Keep the dark theme and existing color tokens; use Tailwind theme colors (`primary`, `muted-foreground`, `surface`, …) rather than new hardcoded hex values.
- Run type checks before finishing; verify the production build only for dependency, build-config, or cross-cutting changes.
