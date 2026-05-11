# Groupe Victoire

Centre de préparation aux concours de la fonction publique en Côte d'Ivoire.
**Slogan**: Travail – Rigueur – Compétence
**Contacts**: 0504763249 / 0798625467 / groupevictoire47@gmail.com

## Run & Operate

- `pnpm --filter @workspace/api-server run dev` — run the API server (port 8080)
- `pnpm --filter @workspace/groupe-victoire run dev` — run the frontend (port 20981)
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from the OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- `pnpm --filter @workspace/scripts run seed-concours` — seed new concours & subjects into DB
- Required env: `DATABASE_URL` — Postgres connection string (auto-provisioned)
- Required env: `VITE_SUPABASE_URL` — `https://epgtvdvyrrxmqajlvxql.supabase.co`
- Required secret: `VITE_SUPABASE_ANON_KEY` — Supabase anon/public key

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- Frontend: React + Vite, Tailwind CSS, shadcn/ui, Lucide React, Framer Motion
- Auth: Supabase Auth (email/password) + profiles table + user_metadata for concours enrollment
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
  - `Landing.tsx` — Marketing landing page (hero, formations, pricing, testimonials, FAQ, footer)
  - `auth/Login.tsx`, `auth/CandidateSignup.tsx`, `auth/InstructorSignup.tsx` — Auth flows
  - `dashboard/CandidateDashboard.tsx` — Candidate dashboard with concours + subjects + resources
  - `dashboard/ResourceDetail.tsx` — Individual resource view
  - `instructor/InstructorDashboard.tsx` — Instructor upload + management
  - `admin/AdminDashboard.tsx` — Full admin panel
  - `PremiumPage.tsx` — Real pricing page (inscription 10k, forfait/mensualités by city)
- `scripts/src/seed-concours.ts` — Seed script for all concours + subjects
- `artifacts/groupe-victoire/src/contexts/AuthContext.tsx` — Auth state (Supabase)
- `artifacts/groupe-victoire/src/lib/supabase.ts` — Supabase client
- `artifacts/groupe-victoire/src/components/` — Shared components (Navbar, WhatsAppButton, PremiumModal)

## Architecture decisions

- Supabase Auth for authentication (email/password) + Replit PostgreSQL for app data (resources, payments, news)
- Enrolled concours stored in Supabase `user.user_metadata.enrolled_concours` (array of {type, cycle}) — avoids FK issues with user_cycles table
- OpenAPI-first: all API contracts defined in openapi.yaml, hooks generated via Orval
- Role-based routing: candidates → /dashboard, instructors → /instructor, admins → /admin
- Freemium lock: annales locked for non-premium users, tips always free, lessons partially free
- Premium activation via manual admin toggle or payment approval workflow

## Concours & Pricing

**Concours préparés**:
- ENA (Cycle Supérieur, Cycle Moyen Supérieur, Cycle Moyen)
- ENS, INFAS, INFS, Eaux et Forêts, Police Nationale, Gendarmerie Nationale, Armée Ivoirienne

**Tarifs**:
- Inscription: 10 000 FCFA
- Abidjan (Lycée Moderne de Cocody): Forfait 185 000 / Mensualité 25 000 FCFA
- Bouaké (Lycée Moderne de Nimbo): Forfait 160 000 / Mensualité 20 000 FCFA
- Korhogo (Collège Moderne de Korhogo): Forfait 150 000 / Mensualité 20 000 FCFA
- En ligne (Lun-Jeu 20h-22h): Forfait 150 000 / Mensualité 20 000 FCFA

## Product

- **Candidates** sign up selecting concours (multi-select), ENA cycle if applicable, location, and payment type. Subjects displayed per enrolled concours on dashboard.
- **Instructors** upload PDF resources, publish news articles, manage their content
- **Admins** see platform analytics, manage user premium status, approve/reject payments
- **Landing page** shows slogan, hero, formations, how-it-works, pricing, testimonials carousel, FAQ, footer

## User preferences

- All UI text in French
- Color palette: Black (#0D0D0D) + Gold (#C9A227) + White
- Typography: Playfair Display (headings) + Inter (body)
- No emojis in UI
- WhatsApp floating button on all pages (number: 0504763249)

## Gotchas

- Supabase `profiles` table must be created in Supabase (not Drizzle) — it maps to auth.users via UUID
- Enrolled concours stored in Supabase user_metadata, NOT in user_cycles table (avoids FK issues)
- After signup, profile inserted via `supabase.from('profiles').upsert({...})`
- Run codegen after every openapi.yaml change: `pnpm --filter @workspace/api-spec run codegen`
- VITE_* env vars required for frontend Supabase connection
- Run seed-concours after DB reset to restore concours & subjects

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details
