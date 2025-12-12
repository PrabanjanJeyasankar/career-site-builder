# README.md

## Getting Started

This project uses [Next.js](https://nextjs.org/) with the App Router and TypeScript.

### 1. Install Dependencies

```bash
npm install
# or
yarn install
```

### 2. Configure Environment Variables

Create a `.env.local` file at the project root. You can use the provided example:

```bash
cp .env.example .env.local
```

Edit `.env.local` and set the required values.

### 3. Run the Development Server

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Environment Variables

All environment variables must be defined in `.env.local`.  
See `.env.example` for required keys and descriptions.

### Required environment variables

Below is a quick reference of the keys used across the app (see `.env.example` for placeholders):

- Supabase auth: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- Cloudflare R2 uploads: `CLOUDFLARE_ACCOUNT_ID`, `CLOUDFLARE_R2_ACCESS_KEY_ID`, `CLOUDFLARE_R2_SECRET_ACCESS_KEY`, `CLOUDFLARE_R2_BUCKET_NAME`, `CLOUDFLARE_R2_PUBLIC_DOMAIN`
- AI/profile enrichment (optional): `APIFY_TOKEN`, `IMAGGA_API_KEY`, `IMAGGA_API_SECRET`, `GEMINI_API_KEY`

---

## Scripts

- `dev` – Start the development server
- `build` – Build for production
- `start` – Start the production server

---

## Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [Environment Variables](https://nextjs.org/docs/app/building-your-application/configuring/environment-variables)
