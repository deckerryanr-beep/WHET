import Link from "next/link";
import type { Category } from "@/lib/types";
import { CATEGORY_LABELS, CATEGORY_ICONS, CATEGORY_DESCRIPTIONS } from "@/lib/types";

const CATEGORY_STYLES: Record<
  Category,
  { bg: string; border: string; accent: string; slug: string }
> = {
  wine: {
    bg: "from-red-950/50 to-transparent",
    border: "border-red-900/40 hover:border-red-700/50",
    accent: "text-red-400",
    slug: "wine",
  },
  whiskey: {
    bg: "from-amber-950/50 to-transparent",
    border: "border-amber-900/40 hover:border-amber-700/50",
    accent: "text-amber-400",
    slug: "whiskey",
  },
  athletic_wear: {
    bg: "from-emerald-950/50 to-transparent",
    border: "border-emerald-900/40 hover:border-emerald-700/50",
    accent: "text-emerald-400",
    slug: "athletic-wear",
  },
  going_out_wear: {
    bg: "from-purple-950/50 to-transparent",
    border: "border-purple-900/40 hover:border-purple-700/50",
    accent: "text-purple-400",
    slug: "going-out-wear",
  },
};

export default function CategoryCard({
  category,
  count = 0,
}: {
  category: Category;
  count?: number;
}) {
  const styles = CATEGORY_STYLES[category];

  return (
    <Link
      href={`/log/${styles.slug}`}
      className={`relative overflow-hidden rounded-sm border ${styles.border} bg-gradient-to-br ${styles.bg} bg-surface p-6 transition-all duration-200 group block`}
    >
      <div className="flex items-start justify-between mb-4">
        <span className="text-3xl">{CATEGORY_ICONS[category]}</span>
        {count > 0 && (
          <span className={`text-xs font-medium ${styles.accent}`}>
            {count} logged
          </span>
        )}
      </div>
      <h3 className="font-serif text-lg text-text-primary mb-1">
        {CATEGORY_LABELS[category]}
      </h3>
      <p className="text-text-secondary text-xs leading-relaxed">
        {CATEGORY_DESCRIPTIONS[category]}
      </p>
      <div className="absolute bottom-4 right-4 text-text-muted group-hover:text-gold transition-colors text-xl font-light">
        +
      </div>
    </Link>
  );
}
