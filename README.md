# Career Site Builder

Multi-tenant SaaS for building company career pages. Log in, customize sections, publish.

## Quick Start

```bash
npm install
cp .env.example .env
```

Edit `.env` with your credentials (see below).

```bash
npm run dev
```

Open `http://localhost:3000`.

## Setup

### 1. Supabase

Create a project at supabase.com. Run the SQL in `database/migration.sql` in the SQL editor.

Get your project URL and anon key from Settings > API.

Add to `.env`:

```
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

### 2. Cloudflare R2

Create an R2 bucket in your Cloudflare dashboard.

Generate API tokens with R2 read/write permissions.

Set CORS policy on the bucket (allow your domain or `*` for dev).

Add to `.env`:

```
CLOUDFLARE_ACCOUNT_ID=your-account-id
CLOUDFLARE_R2_ACCESS_KEY_ID=your-access-key
CLOUDFLARE_R2_SECRET_ACCESS_KEY=your-secret-key
CLOUDFLARE_R2_BUCKET_NAME=your-bucket-name
CLOUDFLARE_R2_PUBLIC_DOMAIN=https://your-bucket.r2.dev
```

### 3. AI Enrichment (Optional)

If you want the "Generate from URL" feature in brand assets:

**Apify** (for web scraping):

```
APIFY_TOKEN=your-token
```

**Imagga** (for color extraction):

```
IMAGGA_API_KEY=your-key
IMAGGA_API_SECRET=your-secret
```

**LLM** (OpenAI or Ollama):

For OpenAI:

```
LLM=openai
OPENAI_API_KEY=sk-...
OPENAI_MODEL=gpt-3.5-turbo
```

For Ollama (local):

```
LLM=ollama
OLLAMA_BASE_URL=http://localhost:11434
OLLAMA_MODEL=llama3.1
```

If any of these are missing, the feature falls back to manual input or heuristic extraction.

## Usage

1. Sign up at `/login` (Supabase email/password)
2. Go to `/editor` - edit hero, life, values, perks, locations, testimonials, jobs
3. Optionally use `/brand-assets` to auto-generate profile from company URL
4. Preview at `/preview/[your-company-id]` (public, no auth)

Each section auto-saves on blur or when you click outside the input.

## Project Structure

```
src/
  app/
    (auth)/login/          - login page
    (editor)/
      editor/              - main dashboard
      brand-assets/        - AI enrichment
    preview/[companyId]/   - public career site
    api/upload/            - image upload endpoint
  lib/
    actions/               - server actions (mutations)
    services/              - AI enrichment services
    db/                    - Supabase queries
    auth/                  - auth helpers
    validation/            - zod schemas
  components/              - shared UI components
database/
  migration.sql            - Supabase schema + RLS policies
```

## Database

Multi-tenant with row-level security. Each user belongs to one company. All data is scoped by `company_id`.

Tables:

- `companies` - tenant root
- `company_users` - links auth.users to companies
- `company_profile` - hero, branding
- `life_section`, `value_items`, `perks`, `locations`, `testimonials`, `jobs` - content sections

RLS policies enforce isolation. Public preview uses `anon` role.

## Deployment

Built for Vercel. Push to GitHub, connect to Vercel, add env vars.

Make sure Supabase and R2 are set up first.

## Known Limitations

- One user per company (no invites yet)
- No draft/publish workflow (edits are live)
- No custom domains
- No job application handling (jobs link to external ATS)
- AI enrichment can be slow (30-90s)
- No image optimization (uploads served raw)

## Scripts

- `npm run dev` - dev server
- `npm run build` - production build
- `npm start` - production server
- `npm run lint` - eslint

## Troubleshooting

**"Invalid or expired token"** - check Supabase URL/key in `.env`

**Upload fails** - verify R2 credentials and CORS policy

**AI enrichment times out** - increase timeout in `aiProfile.ts` or use smaller LLM

**Preview page 404** - make sure company_id exists and RLS policies allow anon access

**Middleware redirect loop** - check that `/login` and `/preview/*` are excluded in `middleware.ts` config
