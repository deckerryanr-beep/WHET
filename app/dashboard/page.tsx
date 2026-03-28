import { redirect } from "next/navigation";
import Link from "next/link";
import { createServerSupabaseClient } from "@/lib/supabase-server";
import type { Item, Category, Recommendation } from "@/lib/types";
import { CATEGORY_LABELS, CATEGORY_ICONS } from "@/lib/types";
import Navigation from "@/components/Navigation";
import ItemCard from "@/components/ItemCard";
import AdvisoryCard from "@/components/AdvisoryCard";

const CATEGORY_COLORS: Record<Category, { bg: string; border: string; accent: string; badge: string }> = {
  wine: {
    bg: "from-red-950/40 to-transparent",
    border: "border-red-900/30",
    accent: "text-red-400",
    badge: "badge-wine",
  },
  whiskey: {
    bg: "from-amber-950/40 to-transparent",
    border: "border-amber-900/30",
    accent: "text-amber-400",
    badge: "badge-whiskey",
  },
  athletic_wear: {
    bg: "from-emerald-950/40 to-transparent",
    border: "border-emerald-900/30",
    accent: "text-emerald-400",
    badge: "badge-athletic",
  },
  going_out_wear: {
    bg: "from-purple-950/40 to-transparent",
    border: "border-purple-900/30",
    accent: "text-purple-400",
    badge: "badge-fashion",
  },
};

const CATEGORY_SLUGS: Record<Category, string> = {
  wine: "wine",
  whiskey: "whiskey",
  athletic_wear: "athletic-wear",
  going_out_wear: "going-out-wear",
};

export default async function DashboardPage() {
  const supabase = await createServerSupabaseClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const firstName =
    user.user_metadata?.full_name?.split(" ")[0] ||
    user.email?.split("@")[0] ||
    "there";

  // Fetch recent items and recommendations in parallel
  const [itemsResult, recsResult] = await Promise.all([
    supabase
      .from("items")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(20),
    supabase
      .from("recommendations")
      .select("*")
      .eq("user_id", user.id)
      .eq("dismissed", false)
      .order("created_at", { ascending: false })
      .limit(6),
  ]);

  const items: Item[] = itemsResult.data || [];
  const recommendations: Recommendation[] = recsResult.data || [];

  // Group items by category for counts
  const countsByCategory = items.reduce(
    (acc, item) => {
      acc[item.category] = (acc[item.category] || 0) + 1;
      return acc;
    },
    {} as Record<Category, number>
  );

  const allCategories: Category[] = [
    "wine",
    "whiskey",
    "athletic_wear",
    "going_out_wear",
  ];

  const totalLogged = items.length;
  const totalRecs = recommendations.length;

  return (
    <div className="min-h-screen bg-background">
      <Navigation user={user} />

      <main className="max-w-6xl mx-auto px-6 py-10">
        {/* Greeting */}
        <div className="mb-12">
          <p className="text-text-muted text-xs uppercase tracking-widest mb-2">
            Good {getTimeOfDay()}
          </p>
          <h1 className="font-serif text-4xl md:text-5xl text-text-primary">
            {firstName}.
          </h1>
          {totalRecs > 0 ? (
            <p className="text-text-secondary mt-2 text-lg">
              WHET has{" "}
              <span className="text-gold">{totalRecs} new recommendations</span>{" "}
              waiting for you.
            </p>
          ) : totalLogged > 0 ? (
            <p className="text-text-secondary mt-2 text-lg">
              You&apos;ve logged{" "}
              <span className="text-gold">{totalLogged} experiences</span>.
              Ready for your next find?
            </p>
          ) : (
            <p className="text-text-secondary mt-2 text-lg">
              Start logging your experiences and WHET will find your next great
              find.
            </p>
          )}
        </div>

        {/* Latest Recommendations */}
        {recommendations.length > 0 && (
          <section className="mb-14">
            <div className="flex items-center justify-between mb-6">
              <div>
                <p className="text-text-muted text-xs uppercase tracking-widest mb-1">
                  Your Advisor Says
                </p>
                <h2 className="font-serif text-2xl text-text-primary">
                  What to Try Next
                </h2>
              </div>
              <Link
                href="/advisor"
                className="text-gold text-sm hover:text-gold-light transition-colors"
              >
                See all →
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {recommendations.slice(0, 3).map((rec) => (
                <AdvisoryCard key={rec.id} recommendation={rec} />
              ))}
            </div>
          </section>
        )}

        {/* Category Quick-Log Grid */}
        <section className="mb-14">
          <div className="flex items-center justify-between mb-6">
            <div>
              <p className="text-text-muted text-xs uppercase tracking-widest mb-1">
                Your Taste Library
              </p>
              <h2 className="font-serif text-2xl text-text-primary">
                Log a New Experience
              </h2>
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {allCategories.map((cat) => {
              const colors = CATEGORY_COLORS[cat];
              const count = countsByCategory[cat] || 0;
              return (
                <Link
                  key={cat}
                  href={`/log/${CATEGORY_SLUGS[cat]}`}
                  className={`relative overflow-hidden rounded-sm border ${colors.border} bg-gradient-to-b ${colors.bg} bg-surface p-5 hover:bg-surface-2 transition-all duration-200 group`}
                >
                  <div className="text-3xl mb-3">{CATEGORY_ICONS[cat]}</div>
                  <div className="font-serif text-base text-text-primary mb-1">
                    {CATEGORY_LABELS[cat]}
                  </div>
                  <div className={`text-xs ${colors.accent}`}>
                    {count > 0 ? `${count} logged` : "Start logging"}
                  </div>
                  <div className="absolute bottom-3 right-3 text-text-muted group-hover:text-gold transition-colors text-lg">
                    +
                  </div>
                </Link>
              );
            })}
          </div>
        </section>

        {/* Recent Items */}
        {items.length > 0 && (
          <section className="mb-14">
            <div className="flex items-center justify-between mb-6">
              <div>
                <p className="text-text-muted text-xs uppercase tracking-widest mb-1">
                  Your History
                </p>
                <h2 className="font-serif text-2xl text-text-primary">
                  Recently Logged
                </h2>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {items.slice(0, 6).map((item) => (
                <ItemCard key={item.id} item={item} />
              ))}
            </div>
            {items.length > 6 && (
              <div className="mt-4 text-center">
                <Link href="/history" className="btn-ghost">
                  View All {items.length} Items →
                </Link>
              </div>
            )}
          </section>
        )}

        {/* Empty State — no items logged */}
        {items.length === 0 && (
          <section className="py-16 text-center border border-border rounded-sm bg-surface/30">
            <p className="text-5xl mb-5">✦</p>
            <h2 className="font-serif text-3xl text-text-primary mb-3">
              Your taste profile is blank.
            </h2>
            <p className="text-text-secondary text-sm max-w-sm mx-auto mb-8">
              Log your first experience and WHET will start learning what makes
              your palate tick.
            </p>
            <div className="flex flex-wrap gap-3 justify-center">
              {allCategories.map((cat) => (
                <Link
                  key={cat}
                  href={`/log/${CATEGORY_SLUGS[cat]}`}
                  className="btn-outline"
                >
                  {CATEGORY_ICONS[cat]} Log {CATEGORY_LABELS[cat]}
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Get Recommendations CTA */}
        {items.length >= 3 && recommendations.length === 0 && (
          <section className="py-10 px-8 border border-gold/20 bg-gold/5 rounded-sm text-center">
            <p className="text-gold text-xs uppercase tracking-widest mb-3">
              Ready for Advice
            </p>
            <h2 className="font-serif text-2xl text-text-primary mb-3">
              You&apos;ve built enough taste data.
            </h2>
            <p className="text-text-secondary text-sm mb-6">
              Let WHET analyze your profile and tell you exactly what to try next.
            </p>
            <Link href="/advisor" className="btn-gold">
              Get My Recommendations
            </Link>
          </section>
        )}
      </main>
    </div>
  );
}

function getTimeOfDay(): string {
  const hour = new Date().getHours();
  if (hour < 12) return "morning";
  if (hour < 17) return "afternoon";
  return "evening";
}
