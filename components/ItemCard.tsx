import type { Item, Category } from "@/lib/types";
import { CATEGORY_LABELS, CATEGORY_ICONS } from "@/lib/types";

const CATEGORY_ACCENTS: Record<Category, string> = {
  wine: "text-red-400",
  whiskey: "text-amber-400",
  athletic_wear: "text-emerald-400",
  going_out_wear: "text-purple-400",
};

const CATEGORY_BORDERS: Record<Category, string> = {
  wine: "border-red-900/30",
  whiskey: "border-amber-900/30",
  athletic_wear: "border-emerald-900/30",
  going_out_wear: "border-purple-900/30",
};

function RatingBar({ rating, max = 10 }: { rating: number; max?: number }) {
  return (
    <div className="flex gap-0.5 items-center">
      {Array.from({ length: max }).map((_, i) => (
        <div
          key={i}
          className={`h-1 flex-1 rounded-sm ${
            i < rating ? "bg-gold" : "bg-border"
          }`}
        />
      ))}
    </div>
  );
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default function ItemCard({ item }: { item: Item }) {
  const accent = CATEGORY_ACCENTS[item.category];
  const border = CATEGORY_BORDERS[item.category];

  // Pull a few highlight attributes for display
  const attrs = item.attributes as Record<string, unknown>;
  const highlights: string[] = [];

  if (attrs.variety) highlights.push(String(attrs.variety));
  if (attrs.region) highlights.push(String(attrs.region));
  if (attrs.vintage) highlights.push(String(attrs.vintage));
  if (attrs.type) highlights.push(String(attrs.type));
  if (attrs.distillery) highlights.push(String(attrs.distillery));
  if (attrs.item_type) highlights.push(String(attrs.item_type));
  if (attrs.body) highlights.push(String(attrs.body));
  if (attrs.age) highlights.push(`${attrs.age}yr`);

  return (
    <div
      className={`bg-surface border ${border} rounded-sm p-5 hover:bg-surface-2 transition-all duration-200`}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-2 mb-3">
        <div className="flex-1 min-w-0">
          <div className={`text-xs uppercase tracking-widest font-medium ${accent} mb-1`}>
            {CATEGORY_ICONS[item.category]} {CATEGORY_LABELS[item.category]}
          </div>
          <h3 className="font-serif text-base text-text-primary leading-tight truncate">
            {item.name}
          </h3>
          {item.brand && (
            <p className="text-text-muted text-xs mt-0.5">{item.brand}</p>
          )}
        </div>
        <div className="text-right flex-shrink-0">
          <span className="font-serif text-2xl text-gold font-semibold">
            {item.rating}
          </span>
          <span className="text-text-muted text-xs">/10</span>
        </div>
      </div>

      {/* Rating bar */}
      <div className="mb-3">
        <RatingBar rating={item.rating} max={10} />
      </div>

      {/* Attribute pills */}
      {highlights.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-3">
          {highlights.slice(0, 3).map((h) => (
            <span
              key={h}
              className="px-2 py-0.5 bg-surface-2 border border-border rounded-sm text-xs text-text-secondary"
            >
              {h}
            </span>
          ))}
        </div>
      )}

      {/* Notes */}
      {item.notes && (
        <p className="text-text-secondary text-xs leading-relaxed line-clamp-2 italic mb-3">
          &ldquo;{item.notes}&rdquo;
        </p>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between pt-3 border-t border-border">
        <span className="text-text-muted text-xs">{formatDate(item.created_at)}</span>
        {item.price && (
          <span className="text-gold text-xs">${item.price.toFixed(2)}</span>
        )}
      </div>
    </div>
  );
}
