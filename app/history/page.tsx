export const dynamic = "force-dynamic";

import { redirect } from "next/navigation";
import { createServerSupabaseClient } from "@/lib/supabase-server";
import Navigation from "@/components/Navigation";
import ItemCard from "@/components/ItemCard";
import type { Item, Category } from "@/lib/types";
import { CATEGORY_LABELS, CATEGORY_ICONS } from "@/lib/types";

const ALL_CATEGORIES: Category[] = [
  "wine",
  "whiskey",
  "athletic_wear",
  "going_out_wear",
];

export default async function HistoryPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const supabase = await createServerSupabaseClient();
  const { category: catParam } = await searchParams;

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const selectedCategory =
    catParam && ALL_CATEGORIES.includes(catParam as Category)
      ? (catParam as Category)
      : null;

  const query = supabase
    .from("items")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (selectedCategory) {
    query.eq("category", selectedCategory);
  }

  const { data: items } = await query;
  const allItems: Item[] = items || [];

  const countsByCategory = allItems.reduce(
    (acc, item) => {
      acc[item.category] = (acc[item.category] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>
  );

  return (
    <div className="min-h-screen bg-background">
      <Navigation user={user} />

      <main className="max-w-6xl mx-auto px-6 py-10">
        <div className="mb-10">
          <p className="text-text-muted text-xs uppercase tracking-widest mb-2">
            Your Taste Library
          </p>
          <h1 className="font-serif text-4xl text-text-primary">
            Everything You&apos;ve Logged
          </h1>
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-2 flex-wrap mb-8">
          <a
            href="/history"
            className={`px-4 py-2 rounded-sm text-sm border transition-colors ${
              !selectedCategory
                ? "border-gold bg-gold/10 text-gold"
                : "border-border text-text-secondary hover:border-border-light"
            }`}
          >
            All ({allItems.length})
          </a>
          {ALL_CATEGORIES.map((cat) => {
            const count = countsByCategory[cat] || 0;
            if (count === 0) return null;
            return (
              <a
                key={cat}
                href={`/history?category=${cat}`}
                className={`px-4 py-2 rounded-sm text-sm border transition-colors ${
                  selectedCategory === cat
                    ? "border-gold bg-gold/10 text-gold"
                    : "border-border text-text-secondary hover:border-border-light"
                }`}
              >
                {CATEGORY_ICONS[cat]} {CATEGORY_LABELS[cat]} ({count})
              </a>
            );
          })}
        </div>

        {/* Items Grid */}
        {allItems.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {allItems.map((item) => (
              <ItemCard key={item.id} item={item} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 border border-border rounded-sm bg-surface/30">
            <p className="text-text-muted text-sm">
              {selectedCategory
                ? `No ${CATEGORY_LABELS[selectedCategory]} logged yet.`
                : "Nothing logged yet. Start building your taste profile."}
            </p>
          </div>
        )}
      </main>
    </div>
  );
}
