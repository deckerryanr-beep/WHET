import Link from "next/link";

const steps = [
  {
    number: "1",
    title: "Create a Supabase project",
    subtitle: "Your cloud database — free forever",
    url: "https://supabase.com",
    urlLabel: "Go to supabase.com →",
    steps: [
      'Click "Start for free" and create an account',
      'Click "New project" → name it anything → click Create',
      "Wait ~2 minutes for it to spin up",
      'Go to SQL Editor → paste the schema → click Run (link below)',
      "Go to Project Settings → API → copy your Project URL and anon key",
    ],
    schemaNote: true,
    done_check: "NEXT_PUBLIC_SUPABASE_URL",
  },
  {
    number: "2",
    title: "Get an Anthropic API key",
    subtitle: "Powers the AI advisor — ~$0.003 per recommendation",
    url: "https://console.anthropic.com",
    urlLabel: "Go to console.anthropic.com →",
    steps: [
      "Sign up for an account",
      'Click "API Keys" in the left sidebar',
      'Click "Create Key" → give it a name → copy the key',
    ],
    done_check: "ANTHROPIC_API_KEY",
  },
  {
    number: "3",
    title: "Deploy to Vercel",
    subtitle: "Your live website URL — free",
    url: "https://vercel.com/new",
    urlLabel: "Go to vercel.com →",
    steps: [
      "Sign up with GitHub",
      'Click "New Project" → import this repository',
      "Under Environment Variables, add your 2 required keys",
      "Click Deploy — your site will be live in ~2 minutes",
    ],
    done_check: null,
  },
];

const optionalServices = [
  {
    name: "Google Places API",
    description: "Finds wine shops, liquor stores, and athletic retailers near you",
    url: "https://console.cloud.google.com",
    urlLabel: "console.cloud.google.com →",
    envKey: "GOOGLE_PLACES_API_KEY",
    steps: [
      "Sign in with your Google account",
      'Create a new project called "whet"',
      'Search for "Places API" → Enable it',
      "Go to Credentials → Create API Key → copy it",
    ],
  },
  {
    name: "SerpApi",
    description: "Fetches product photos and price comparisons for recommendations",
    url: "https://serpapi.com",
    urlLabel: "serpapi.com →",
    envKey: "SERPAPI_KEY",
    steps: [
      "Sign up for a free account (100 searches/month free)",
      "Your API key is shown on the dashboard homepage — copy it",
    ],
  },
];

export default function SetupPage() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const hasSupabase = !!supabaseUrl && supabaseUrl !== "";

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <nav className="border-b border-border/50 px-6 h-16 flex items-center justify-between">
        <Link href="/" className="font-serif text-2xl gold-shimmer font-bold">
          WHET
        </Link>
        {hasSupabase && (
          <Link href="/dashboard" className="btn-ghost text-sm">
            Go to Dashboard →
          </Link>
        )}
      </nav>

      <main className="max-w-3xl mx-auto px-6 py-14">
        {/* Heading */}
        <div className="mb-12 text-center">
          <p className="text-text-muted text-xs uppercase tracking-widest mb-3">
            Get WHET Live
          </p>
          <h1 className="font-serif text-4xl text-text-primary mb-3">
            3 Steps to Your Website
          </h1>
          <p className="text-text-secondary text-sm max-w-lg mx-auto">
            No coding required. Each step links you directly to where you need to
            go. The whole thing takes about 10 minutes.
          </p>
        </div>

        {/* Status banner */}
        {hasSupabase ? (
          <div className="bg-emerald-950/40 border border-emerald-900/50 text-emerald-400 text-sm px-5 py-4 rounded-sm mb-10 flex items-center gap-3">
            <span className="text-lg">✓</span>
            <span>
              Supabase is connected. You&apos;re partway there — complete the steps
              below to finish setup.
            </span>
          </div>
        ) : (
          <div className="bg-gold/5 border border-gold/20 text-gold text-sm px-5 py-4 rounded-sm mb-10 flex items-center gap-3">
            <span className="text-lg">✦</span>
            <span>
              Not set up yet. Follow the steps below — each one links you to
              exactly where you need to go.
            </span>
          </div>
        )}

        {/* Required Steps */}
        <div className="space-y-6 mb-14">
          <p className="text-text-muted text-xs uppercase tracking-widest">
            Required — Takes ~10 minutes
          </p>

          {steps.map((step) => (
            <div key={step.number} className="card border-border">
              <div className="flex items-start gap-4">
                <div className="w-9 h-9 rounded-sm bg-gold/10 border border-gold/30 flex items-center justify-center flex-shrink-0">
                  <span className="font-serif text-gold font-bold text-sm">
                    {step.number}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <h2 className="font-serif text-xl text-text-primary mb-0.5">
                    {step.title}
                  </h2>
                  <p className="text-text-muted text-xs mb-4">{step.subtitle}</p>

                  <ol className="space-y-2 mb-4">
                    {step.steps.map((s, i) => (
                      <li key={i} className="flex gap-3 text-sm text-text-secondary">
                        <span className="text-text-muted flex-shrink-0 w-4">
                          {i + 1}.
                        </span>
                        <span>{s}</span>
                      </li>
                    ))}
                  </ol>

                  {step.schemaNote && (
                    <div className="bg-surface-2 border border-border rounded-sm px-4 py-3 mb-4">
                      <p className="text-text-muted text-xs mb-1">
                        The SQL schema is in your project at:
                      </p>
                      <code className="text-gold text-xs">
                        supabase/schema.sql
                      </code>
                      <p className="text-text-muted text-xs mt-1">
                        Copy the whole file and paste it into the Supabase SQL
                        Editor.
                      </p>
                    </div>
                  )}

                  <a
                    href={step.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center text-gold text-sm hover:text-gold-light transition-colors"
                  >
                    {step.urlLabel}
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Optional Services */}
        <div className="space-y-5">
          <div>
            <p className="text-text-muted text-xs uppercase tracking-widest mb-1">
              Optional — Unlocks more features
            </p>
            <p className="text-text-secondary text-sm">
              WHET works without these, but they add product images, prices, and
              &ldquo;near you&rdquo; store results.
            </p>
          </div>

          {optionalServices.map((svc) => (
            <div
              key={svc.name}
              className="card border-border/60 bg-surface/50"
            >
              <div className="flex items-start justify-between gap-4 mb-3">
                <div>
                  <h3 className="font-serif text-lg text-text-primary">
                    {svc.name}
                  </h3>
                  <p className="text-text-muted text-xs">{svc.description}</p>
                </div>
                <span className="badge badge-gold flex-shrink-0">Optional</span>
              </div>

              <ol className="space-y-1.5 mb-4">
                {svc.steps.map((s, i) => (
                  <li key={i} className="flex gap-3 text-sm text-text-secondary">
                    <span className="text-text-muted flex-shrink-0 w-4">
                      {i + 1}.
                    </span>
                    <span>{s}</span>
                  </li>
                ))}
              </ol>

              <div className="flex items-center justify-between">
                <code className="text-text-muted text-xs">{svc.envKey}</code>
                <a
                  href={svc.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gold text-sm hover:text-gold-light transition-colors"
                >
                  {svc.urlLabel}
                </a>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="mt-14 pt-8 border-t border-border text-center">
          <p className="text-text-muted text-sm">
            Once your keys are added to Vercel, your site goes live automatically.{" "}
            <Link href="/" className="text-gold hover:text-gold-light transition-colors">
              Back to homepage →
            </Link>
          </p>
        </div>
      </main>
    </div>
  );
}
