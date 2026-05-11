# Groupe Victoire

A professional ENA (École Nationale d'Administration) exam preparation platform for candidates in West Africa. Provides structured lessons, past exam papers (annales), tips, and role-based dashboards for candidates, instructors, and admins.

## Run & Operate

- `pnpm --filter @workspace/api-server run dev` — run the API server (port 8080)
- `pnpm --filter @workspace/groupe-victoire run dev` — run the frontend (port 20981)
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from the OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- Required env: `DATABASE_URL` — Postgres connection string (auto-provisioned)
- Required env: `VITE_SUPABASE_URL` — Supabase project URL
- Required secret: `VITE_SUPABASE_ANON_KEY` — Supabase anon/public key

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- Frontend: React + Vite, Tailwind CSS, shadcn/ui, Lucide React, Framer Motion
- Auth: Supabase Auth (email/password) + profiles table
- API: Express 5, OpenAPI-first with Orval codegen
- DB: PostgreSQL + Drizzle ORM (Replit managed) for app data
- Supabase: Auth + profiles storage
- Validation: Zod (zod/v4), drizzle-zod
- API codegen: Orval (from OpenAPI spec)
- Build: esbuild (CJS bundle)

## Where things live

- `lib/api-spec/openapi.yaml` — OpenAPI contract (source of truth)
- `lib/db/src/schema/` — Drizzle schema (cycles, profiles, subjects, resources, payments, news, notifications, userActivity)
- `artifacts/api-server/src/routes/` — Express route handlers (cycles, subjects, resources, news, payments, users, stats)
- `artifacts/groupe-victoire/src/pages/` — Frontend pages
  - `Landing.tsx` — Marketing landing page
  - `auth/Login.tsx`, `auth/CandidateSignup.tsx`, `auth/InstructorSignup.tsx` — Auth flows
  - `dashboard/CandidateDashboard.tsx` — Candidate dashboard with resource browser
  - `dashboard/ResourceDetail.tsx` — Individual resource view
  - `instructor/InstructorDashboard.tsx` — Instructor upload + management
  - `admin/AdminDashboard.tsx` — Full admin panel
  - `PremiumPage.tsx` — Premium upgrade + payment instructions
- `artifacts/groupe-victoire/src/contexts/AuthContext.tsx` — Auth state (Supabase)
- `artifacts/groupe-victoire/src/lib/supabase.ts` — Supabase client
- `artifacts/groupe-victoire/src/components/` — Shared components (Navbar, WhatsAppButton, PremiumModal)

## Architecture decisions

- Supabase Auth for authentication (email/password) + Replit PostgreSQL for app data (resources, payments, news)
- OpenAPI-first: all API contracts defined in openapi.yaml, hooks generated via Orval
- Role-based routing: candidates → /dashboard, instructors → /instructor, admins → /admin
- Freemium lock: annales locked for non-premium users, tips always free, lessons partially free
- Premium activation via manual admin toggle or payment approval workflow

## Product

- **Candidates** sign up with cycle selection, browse lessons/annales/tips filtered by subject, see premium lock modal for annales
- **Instructors** upload PDF resources, publish news articles, manage their content
- **Admins** see platform analytics, manage user premium status, approve/reject payments
- **Landing page** shows statistics, features, cycles, latest news, testimonials, FAQ

## User preferences

- All UI text in French
- Color palette: Deep Blue (#0A1628) + White + Gold (#D4A853)
- Typography: Playfair Display (headings) + Inter (body)
- No emojis in UI
- WhatsApp floating button on all pages

## Gotchas

- Supabase `profiles` table must be created in Supabase (not Drizzle) — it maps to auth.users via UUID
- After signup, insert profile manually: `supabase.from('profiles').insert({...})`
- Run codegen after every openapi.yaml change: `pnpm --filter @workspace/api-spec run codegen`
- VITE_* env vars required for frontend Supabase connection

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details
