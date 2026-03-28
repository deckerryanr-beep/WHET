"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { createClient } from "@/lib/supabase";
import Navigation from "@/components/Navigation";
import type { Item, Recommendation, Category } from "@/lib/types";
import { CATEGORY_LABELS, CATEGORY_ICONS } from "@/lib/types";

const ALL_CATEGORIES: Category[] = [
  "wine",
  "whiskey",
  "athletic_wear",
  "going_out_wear",
];

const CATEGORY_COLORS: Record<
  Category,
  { border: string; accent: string; glow: string }
> = {
  wine: {
    border: "border-red-900/40",
    accent: "text-red-400",
    glow: "shadow-red-900/20",
  },
  whiskey: {
    border: "border-amber-900/40",
    accent: "text-amber-400",
    glow: "shadow-amber-900/20",
  },
  athletic_wear: {
    border: "border-emerald-900/40",
    accent: "text-emerald-400",
    glow: "shadow-emerald-900/20",
  },
  going_out_wear: {
    border: "border-purple-900/40",
    accent: "text-purple-400",
    glow: "shadow-purple-900/20",
  },
};

export default function AdvisorPage() {
  const supabase = createClient();

  const [items, setItems] = useState<Item[]>([]);
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [insights, setInsights] = useState<Record<Category, string>>({} as Record<Category, string>);
  const [selectedCategory, setSelectedCategory] = useState<Category | "all">("all");
  const [generating, setGenerating] = useState(false);
  const [generatingCategory, setGeneratingCategory] = useState<Category | null>(null);
  const [location, setLocation] = useState("");
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);

  const fetchData = useCallback(async (uid: string) => {
    const [itemsResult, recsResult] = await Promise.all([
      supabase
        .from("items")
        .select("*")
        .eq("user_id", uid)
        .order("created_at", { ascending: false }),
      supabase
        .from("recommendations")
        .select("*")
        .eq("user_id", uid)
        .eq("dismissed", false)
        .order("created_at", { ascending: false }),
    ]);
    setItems(itemsResult.data || []);
    setRecommendations(recsResult.data || []);
    setLoading(false);
  }, [supabase]);

  useEffect(() => {
    async function init() {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;
      setUserId(user.id);
      await fetchData(user.id);
    }
    init();
  }, [supabase, fetchData]);

  const itemsByCategory = ALL_CATEGORIES.reduce(
    (acc, cat) => {
      acc[cat] = items.filter((i) => i.category === cat);
      return acc;
    },
    {} as Record<Category, Item[]>
  );

  async function generateForCategory(category: Category) {
    const catItems = itemsByCategory[category];
    if (catItems.length < 2) return;

    setGenerating(true);
    setGeneratingCategory(category);

    try {
      const res = await fetch("/api/advisor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          category,
          items: catItems,
          location,
        }),
      });

      if (!res.ok) throw new Error("Advisory request failed");

      const data = await res.json();

      if (data.insight) {
        setInsights((prev) => ({ ...prev, [category]: data.insight }));
      }

      if (data.recommendations?.length && userId) {
        // Save to DB
        const toInsert = data.recommendations.map(
          (rec: Omit<Recommendation, "id" | "user_id" | "created_at" | "dismissed" | "saved">) => ({
            ...rec,
            user_id: userId,
            dismissed: false,
            saved: false,
          })
        );
        await supabase.from("recommendations").insert(toInsert);
        await fetchData(userId);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setGenerating(false);
      setGeneratingCategory(null);
    }
  }

  async function dismissRecommendation(id: string) {
    await supabase
      .from("recommendations")
      .update({ dismissed: true })
      .eq("id", id);
    setRecommendations((prev) => prev.filter((r) => r.id !== id));
  }

  async function saveRecommendation(id: string) {
    await supabase
      .from("recommendations")
      .update({ saved: true })
      .eq("id", id);
    setRecommendations((prev) =>
      prev.map((r) => (r.id === id ? { ...r, saved: true } : r))
    );
  }

  const filteredRecs =
    selectedCategory === "all"
      ? recommendations
      : recommendations.filter((r) => r.category === selectedCategory);

  const categoriesWithEnoughData = ALL_CATEGORIES.filter(
    (cat) => itemsByCategory[cat].length >= 2
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="w-8 h-8 border-2 border-gold border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-text-secondary text-sm">
              Loading your taste profile...
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <main className="max-w-6xl mx-auto px-6 py-10">
        {/* Header */}
        <div className="mb-10">
          <p className="text-text-muted text-xs uppercase tracking-widest mb-2">
            The WHET Advisor
          </p>
          <h1 className="font-serif text-4xl md:text-5xl text-text-primary mb-3">
            Your Next Great Find
          </h1>
          <p className="text-text-secondary text-base max-w-xl">
            Based on everything you&apos;ve logged, here&apos;s what WHET
            recommends you try next.
          </p>
        </div>

        {/* Location Input */}
        <div className="card mb-8 flex flex-col sm:flex-row gap-4 items-end">
          <div className="flex-1">
            <label className="label">Your Location (for local store discovery)</label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="input-field"
              placeholder="City, State or ZIP code"
            />
          </div>
          <p className="text-text-muted text-xs sm:mb-3">
            Used to find nearby stores — never stored.
          </p>
        </div>

        {/* Generate Buttons */}
        {categoriesWithEnoughData.length > 0 && (
          <div className="mb-10">
            <p className="text-text-muted text-xs uppercase tracking-widest mb-4">
              Generate Fresh Recommendations
            </p>
            <div className="flex flex-wrap gap-3">
              {categoriesWithEnoughData.map((cat) => {
                const isLoading = generating && generatingCategory === cat;
                return (
                  <button
                    key={cat}
                    onClick={() => generateForCategory(cat)}
                    disabled={generating}
                    className={`flex items-center gap-2 px-5 py-2.5 rounded-sm border text-sm font-medium transition-all ${
                      isLoading
                        ? "border-gold bg-gold/10 text-gold"
                        : "border-border text-text-secondary hover:border-gold hover:text-gold"
                    } disabled:opacity-50 disabled:cursor-not-allowed`}
                  >
                    {isLoading ? (
                      <>
                        <div className="w-3 h-3 border border-gold border-t-transparent rounded-full animate-spin" />
                        Analyzing {CATEGORY_LABELS[cat]}...
                      </>
                    ) : (
                      <>
                        {CATEGORY_ICONS[cat]} Advise me on {CATEGORY_LABELS[cat]}
                      </>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Not enough data warning */}
        {categoriesWithEnoughData.length === 0 && (
          <div className="card mb-10 text-center py-12 border-gold/20 bg-gold/5">
            <p className="text-4xl mb-4">✦</p>
            <h2 className="font-serif text-2xl text-text-primary mb-3">
              Log more to unlock your advisor
            </h2>
            <p className="text-text-secondary text-sm max-w-sm mx-auto mb-6">
              Log at least 2 items in any category and WHET will start giving
              you personalized recommendations.
            </p>
            <div className="flex flex-wrap gap-3 justify-center">
              {ALL_CATEGORIES.map((cat) => (
                <Link
                  key={cat}
                  href={`/log/${cat.replace("_", "-")}`}
                  className="btn-outline text-xs"
                >
                  {CATEGORY_ICONS[cat]} Log {CATEGORY_LABELS[cat]}
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Category Insights */}
        {Object.keys(insights).length > 0 && (
          <section className="mb-10">
            <p className="text-text-muted text-xs uppercase tracking-widest mb-4">
              Your Taste Profile
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {(Object.entries(insights) as [Category, string][]).map(
                ([cat, insight]) => {
                  const colors = CATEGORY_COLORS[cat];
                  return (
                    <div
                      key={cat}
                      className={`card border ${colors.border} bg-surface/50`}
                    >
                      <div className="flex items-center gap-2 mb-3">
                        <span>{CATEGORY_ICONS[cat]}</span>
                        <span
                          className={`text-xs uppercase tracking-widest font-medium ${colors.accent}`}
                        >
                          {CATEGORY_LABELS[cat]} Profile
                        </span>
                      </div>
                      <p className="text-text-secondary text-sm leading-relaxed italic">
                        &ldquo;{insight}&rdquo;
                      </p>
                    </div>
                  );
                }
              )}
            </div>
          </section>
        )}

        {/* Filter Tabs */}
        {recommendations.length > 0 && (
          <>
            <div className="flex gap-2 mb-6 flex-wrap">
              {(["all", ...ALL_CATEGORIES] as (Category | "all")[]).map(
                (cat) => {
                  const count =
                    cat === "all"
                      ? recommendations.length
                      : recommendations.filter((r) => r.category === cat).length;
                  if (cat !== "all" && count === 0) return null;
                  return (
                    <button
                      key={cat}
                      onClick={() => setSelectedCategory(cat)}
                      className={`px-4 py-2 rounded-sm text-sm border transition-colors ${
                        selectedCategory === cat
                          ? "border-gold bg-gold/10 text-gold"
                          : "border-border text-text-secondary hover:border-border-light"
                      }`}
                    >
                      {cat === "all"
                        ? `All (${count})`
                        : `${CATEGORY_ICONS[cat as Category]} ${CATEGORY_LABELS[cat as Category]} (${count})`}
                    </button>
                  );
                }
              )}
            </div>

            {/* Recommendation Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredRecs.map((rec) => (
                <RecommendationCard
                  key={rec.id}
                  rec={rec}
                  onDismiss={dismissRecommendation}
                  onSave={saveRecommendation}
                />
              ))}
            </div>
          </>
        )}

        {/* Empty state — has data but no recs yet */}
        {categoriesWithEnoughData.length > 0 &&
          recommendations.length === 0 && (
            <div className="text-center py-16">
              <p className="text-text-muted text-sm">
                Hit a category button above to generate your first recommendations.
              </p>
            </div>
          )}
      </main>
    </div>
  );
}

function RecommendationCard({
  rec,
  onDismiss,
  onSave,
}: {
  rec: Recommendation;
  onDismiss: (id: string) => void;
  onSave: (id: string) => void;
}) {
  const colors = CATEGORY_COLORS[rec.category];

  return (
    <div
      className={`card border ${colors.border} flex flex-col gap-4 hover:border-opacity-70 transition-all duration-200`}
    >
      {/* Image */}
      {rec.image_url && (
        <div className="relative h-48 rounded-sm overflow-hidden bg-surface-2">
          <Image
            src={rec.image_url}
            alt={rec.name}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 33vw"
          />
        </div>
      )}
      {!rec.image_url && (
        <div className="h-32 bg-surface-2 rounded-sm flex items-center justify-center">
          <span className="text-4xl opacity-30">
            {CATEGORY_ICONS[rec.category]}
          </span>
        </div>
      )}

      {/* Content */}
      <div className="flex-1">
        <div className="flex items-start justify-between gap-2 mb-1">
          <span
            className={`text-xs uppercase tracking-widest font-medium ${colors.accent}`}
          >
            {CATEGORY_LABELS[rec.category]}
          </span>
          {rec.price_range && (
            <span className="text-gold text-xs font-medium">
              {rec.price_range}
            </span>
          )}
        </div>

        <h3 className="font-serif text-lg text-text-primary leading-tight mb-1">
          {rec.name}
        </h3>
        {rec.brand && (
          <p className="text-text-muted text-xs mb-3">{rec.brand}</p>
        )}

        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          {rec.description}
        </p>

        <div className="bg-gold/5 border border-gold/15 rounded-sm px-3 py-2">
          <p className="text-gold text-xs font-medium mb-1 uppercase tracking-wider">
            Why WHET picked this for you
          </p>
          <p className="text-text-secondary text-xs leading-relaxed">
            {rec.reason}
          </p>
        </div>
      </div>

      {/* Where to Buy */}
      {rec.where_to_buy && rec.where_to_buy.length > 0 && (
        <div>
          <p className="text-text-muted text-xs uppercase tracking-widest mb-2">
            Where to Buy
          </p>
          <div className="space-y-1.5">
            {rec.where_to_buy.slice(0, 3).map((store, i) => (
              <div
                key={i}
                className="flex items-center justify-between text-xs"
              >
                <div className="flex items-center gap-2">
                  <span className="text-text-muted">
                    {store.type === "local" ? "📍" : "🌐"}
                  </span>
                  <span className="text-text-secondary">{store.name}</span>
                  {store.distance && (
                    <span className="text-text-muted">· {store.distance}</span>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  {store.price && (
                    <span className="text-gold">{store.price}</span>
                  )}
                  {store.url && (
                    <a
                      href={store.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gold hover:text-gold-light transition-colors"
                    >
                      →
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-2 pt-2 border-t border-border">
        <button
          onClick={() => onSave(rec.id)}
          disabled={rec.saved}
          className={`flex-1 py-2 text-xs rounded-sm border transition-colors ${
            rec.saved
              ? "border-gold/30 text-gold/50 cursor-default"
              : "border-gold text-gold hover:bg-gold/10"
          }`}
        >
          {rec.saved ? "Saved ✓" : "Save"}
        </button>
        <button
          onClick={() => onDismiss(rec.id)}
          className="flex-1 py-2 text-xs rounded-sm border border-border text-text-muted hover:border-border-light hover:text-text-secondary transition-colors"
        >
          Not for me
        </button>
      </div>
    </div>
  );
}
