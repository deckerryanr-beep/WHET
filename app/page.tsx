"use client";

import Link from "next/link";

const categories = [
  {
    id: "wine",
    label: "Wine",
    icon: "🍷",
    color: "from-red-950/60 to-red-900/20",
    border: "border-red-900/40 hover:border-red-700/60",
    accent: "text-red-400",
    description: "From Burgundy to Napa, your palate decoded",
    detail: "Reds · Whites · Rosés · Sparkling",
  },
  {
    id: "whiskey",
    label: "Whiskey",
    icon: "🥃",
    color: "from-amber-950/60 to-amber-900/20",
    border: "border-amber-900/40 hover:border-amber-700/60",
    accent: "text-amber-400",
    description: "Single malts, small batch bourbons, and everything between",
    detail: "Bourbon · Scotch · Irish · Japanese",
  },
  {
    id: "athletic-wear",
    label: "Athletic Wear",
    icon: "👟",
    color: "from-emerald-950/60 to-emerald-900/20",
    border: "border-emerald-900/40 hover:border-emerald-700/60",
    accent: "text-emerald-400",
    description: "Performance gear that meets your exact standards",
    detail: "Running · Yoga · CrossFit · Studio",
  },
  {
    id: "going-out-wear",
    label: "Going Out Wear",
    icon: "👗",
    color: "from-purple-950/60 to-purple-900/20",
    border: "border-purple-900/40 hover:border-purple-700/60",
    accent: "text-purple-400",
    description: "Looks that turn heads, curated for your taste",
    detail: "Dresses · Tops · Sets · Shoes",
  },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 border-b border-border/50 backdrop-blur-md bg-background/80">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <span className="font-serif text-2xl gold-shimmer font-bold tracking-tight">
            WHET
          </span>
          <div className="flex items-center gap-4">
            <Link href="/login" className="btn-ghost">
              Sign In
            </Link>
            <Link href="/signup" className="btn-gold">
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative pt-32 pb-24 px-6 overflow-hidden">
        {/* Background elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gold/5 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-gold/3 rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-4xl mx-auto text-center">
          {/* Eyebrow */}
          <div className="inline-flex items-center gap-2 bg-gold/10 border border-gold/20 rounded-sm px-4 py-2 mb-8">
            <span className="w-1.5 h-1.5 bg-gold rounded-full animate-pulse-gold" />
            <span className="text-gold text-xs uppercase tracking-widest font-medium">
              Personal Taste Advisory
            </span>
          </div>

          {/* Headline */}
          <h1 className="font-serif text-6xl md:text-8xl font-bold leading-none mb-4">
            <span className="gold-shimmer">WHET</span>
          </h1>
          <p className="font-serif text-2xl md:text-3xl text-text-secondary italic mb-6">
            What&apos;s Hot, Expertly Tailored.
          </p>
          <p className="text-text-secondary text-lg max-w-2xl mx-auto mb-12 leading-relaxed">
            Not a journal. An advisor. Log what you love across wine, whiskey,
            athletic wear, and going-out style — and let WHET tell you exactly
            what to try next, where to find it, and at what price.
          </p>

          {/* CTA */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/signup" className="btn-gold text-base px-8 py-4">
              Start Your Taste Profile
            </Link>
            <Link href="/login" className="btn-outline text-base px-8 py-4">
              I Already Have an Account
            </Link>
          </div>
        </div>
      </section>

      {/* Category Cards */}
      <section className="py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-text-muted text-xs uppercase tracking-widest mb-3">
              Four Domains. One Advisor.
            </p>
            <h2 className="font-serif text-4xl text-text-primary">
              Your Taste, Across Every Category
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {categories.map((cat) => (
              <div
                key={cat.id}
                className={`relative overflow-hidden rounded-sm border ${cat.border} bg-gradient-to-br ${cat.color} p-8 transition-all duration-300 group cursor-default`}
              >
                <div className="flex items-start justify-between mb-6">
                  <span className="text-4xl">{cat.icon}</span>
                  <span
                    className={`text-xs uppercase tracking-widest font-medium ${cat.accent} opacity-60 group-hover:opacity-100 transition-opacity`}
                  >
                    {cat.detail}
                  </span>
                </div>
                <h3 className="font-serif text-2xl text-text-primary mb-2">
                  {cat.label}
                </h3>
                <p className="text-text-secondary text-sm leading-relaxed">
                  {cat.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 px-6 border-t border-border">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-text-muted text-xs uppercase tracking-widest mb-3">
              How It Works
            </p>
            <h2 className="font-serif text-4xl text-text-primary">
              The WHET Method
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                step: "01",
                title: "Log Your Experiences",
                body: "Rate what you've tried. Note the details. Build a picture of your taste.",
              },
              {
                step: "02",
                title: "WHET Learns Your Profile",
                body: "Our AI analyzes your patterns — not just what you like, but why you like it.",
              },
              {
                step: "03",
                title: "Get Your Next Great Find",
                body: "Personalized recommendations with images, prices, and where to buy — local and online.",
              },
            ].map((item) => (
              <div key={item.step} className="relative">
                <div className="text-gold/20 font-serif text-7xl font-bold leading-none mb-4 select-none">
                  {item.step}
                </div>
                <h3 className="font-serif text-xl text-text-primary mb-3">
                  {item.title}
                </h3>
                <p className="text-text-secondary text-sm leading-relaxed">
                  {item.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Value Prop */}
      <section className="py-20 px-6 bg-surface/50">
        <div className="max-w-3xl mx-auto text-center">
          <blockquote className="font-serif text-3xl md:text-4xl text-text-primary leading-tight mb-8">
            &ldquo;Not a journal. Not a search engine.
            <br />
            <span className="gold-shimmer">A friend who knows your taste</span>
            <br />
            better than you do.&rdquo;
          </blockquote>
          <Link href="/signup" className="btn-gold text-base px-10 py-4">
            Build Your Profile
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-10 px-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <span className="font-serif text-xl gold-shimmer font-bold">
            WHET
          </span>
          <p className="text-text-muted text-xs">
            © 2025 WHET. What&apos;s Hot, Expertly Tailored.
          </p>
          <div className="flex gap-6">
            <Link
              href="/login"
              className="text-text-muted text-xs hover:text-gold transition-colors"
            >
              Sign In
            </Link>
            <Link
              href="/signup"
              className="text-text-muted text-xs hover:text-gold transition-colors"
            >
              Get Started
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
