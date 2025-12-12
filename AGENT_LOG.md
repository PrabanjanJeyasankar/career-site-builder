# Agent Log

## Dec 11-12

### Initial Setup

- scaffolded Next.js 16 app with App Router
- added Supabase client (SSR + client-side)
- set up auth middleware (redirect logic for /login, /editor, /preview)
- created multi-tenant schema with RLS policies
- tested login flow, session persistence worked

### Database

- wrote migration.sql with all tables
- companies, company_users, company_profile, life_section, value_items, perks, locations, testimonials, jobs
- added indexes on company_id and order_index columns
- RLS policies for authenticated users (company-scoped) and anon (public preview)
- helper function auth.user_company_id() to get current user's company

### Editor UI

- built main editor page with sections for hero, life, values, perks, locations, testimonials, jobs
- inline editing (contenteditable divs, react-hook-form for structured inputs)
- auto-save on blur using server actions
- delete buttons with confirmation dialogs
- emoji picker for value/perk icons
- color picker for brand colors (react-colorful)

### File Uploads

- set up Cloudflare R2 integration
- /api/upload route accepts FormData, validates file type/size
- generates UUID filenames, uploads to R2, returns public URL
- used in logo, favicon, hero background, life section image, location images, testimonial avatars

### Preview Page

- /preview/[companyId] fetches all sections using anon client
- reuses preview components from editor (same UI, no edit controls)
- conditional rendering (hide sections if no data)
- tested with multiple companies, RLS isolation works

### AI Enrichment

- added /brand-assets route
- integrated Apify for web scraping (meta tags, JSON-LD, Open Graph)
- Imagga for color extraction from logo
- OpenAI/Ollama for LLM-based profile generation
- fallback logic if any service is missing (heuristic extraction)
- pipeline logs for debugging (shown in UI)
- timeout set to 90s (Apify can be slow)

### Styling

- used Tailwind v4 with custom config
- Radix UI for dialogs, dropdowns, tooltips
- Framer Motion for animations (fade in, slide up)
- Inter font from @fontsource-variable
- dark mode support (not fully implemented, just color tokens)

### Performance

- all sections load at once in editor (could lazy load but didn't)
- preview page does parallel fetches (one query per section)
- no caching (every page load hits Supabase)
- AI enrichment is slow (30-90s) but runs server-side so doesn't block UI

### Known Issues

- AI enrichment sometimes times out (Apify can take 2+ minutes)

### Time Spent

**Core logic & implementation (~7h)**

- schema design
- auth + middleware
- core editor + preview flows
- file upload

**Additional UI polish & enhancements (~6h)**

- AI enrichment
- minor UI corrections and interaction tweaks
- visual styling refinements
- non-critical bug fixes
- extra quality-of-life improvements

Total: ~13 Hours
