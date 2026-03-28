# WHET — What's Hot, Expertly Tailored

> Your personal taste advisor for Wine, Whiskey, Athletic Wear, and Going Out Style.

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fdeckerryanr-beep%2Fwhet%2Ftree%2Fclaude%2Fbuild-whet-app-6D1cO&env=NEXT_PUBLIC_SUPABASE_URL,NEXT_PUBLIC_SUPABASE_ANON_KEY,ANTHROPIC_API_KEY,GOOGLE_PLACES_API_KEY,SERPAPI_KEY&envDescription=WHET%20requires%20Supabase%20(database)%20and%20Anthropic%20(AI).%20Google%20Places%20and%20SerpApi%20are%20optional%20but%20unlock%20local%20store%20discovery%20and%20product%20images.&project-name=whet&repository-name=whet)

---

## Deploy in 3 Steps

### Step 1 — Get a Supabase account (your cloud database)
1. Go to [supabase.com](https://supabase.com) → **Start for free**
2. Click **New project** → name it `whet` → click **Create project**
3. Go to **SQL Editor** → paste the contents of [`supabase/schema.sql`](./supabase/schema.sql) → click **Run**
4. Go to **Project Settings → API** and copy your **Project URL** and **anon public** key

### Step 2 — Get an Anthropic API key (the AI brain)
1. Go to [console.anthropic.com](https://console.anthropic.com) → sign up
2. Click **API Keys** → **Create Key** → copy it

### Step 3 — Click the Deploy button above
Vercel will ask you to fill in 5 values. Paste what you copied. Done.

> **Google Places** and **SerpApi** keys are optional — the app works without them, but they unlock local store discovery and product images.

---

## The Full Stack

| Service | What it does | Cost |
|---------|-------------|------|
| [Vercel](https://vercel.com) | Hosts the website | Free |
| [Supabase](https://supabase.com) | Cloud database + auth | Free |
| [Anthropic](https://console.anthropic.com) | AI recommendations | ~$0.003/request |
| [Google Places](https://console.cloud.google.com) | Local store finder | Optional |
| [SerpApi](https://serpapi.com) | Product images + prices | Optional |
