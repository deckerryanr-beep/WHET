import Image from "next/image";
import Link from "next/link";
import type { Recommendation, Category } from "@/lib/types";
import { CATEGORY_LABELS, CATEGORY_ICONS } from "@/lib/types";

const CATEGORY_BORDERS: Record<Category, string> = {
  wine: "border-red-900/30",
  whiskey: "border-amber-900/30",
  athletic_wear: "border-emerald-900/30",
  going_out_wear: "border-purple-900/30",
};

const CATEGORY_ACCENTS: Record<Category, string> = {
  wine: "text-red-400",
  whiskey: "text-amber-400",
  athletic_wear: "text-emerald-400",
  going_out_wear: "text-purple-400",
};

export default function AdvisoryCard({
  recommendation,
}: {
  recommendation: Recommendation;
}) {
  const border = CATEGORY_BORDERS[recommendation.category];
  const accent = CATEGORY_ACCENTS[recommendation.category];

  return (
    <div
      className={`bg-surface border ${border} rounded-sm overflow-hidden hover:bg-surface-2 transition-all duration-200 flex flex-col`}
    >
      {/* Image */}
      {recommendation.image_url ? (
        <div className="relative h-40 bg-surface-2 overflow-hidden">
          <Image
            src={recommendation.image_url}
            alt={recommendation.name}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 33vw"
          />
        </div>
      ) : (
        <div className="h-28 bg-surface-2 flex items-center justify-center">
          <span className="text-3xl opacity-20">
            {CATEGORY_ICONS[recommendation.category]}
          </span>
        </div>
      )}

      <div className="p-5 flex-1 flex flex-col">
        <div
          className={`text-xs uppercase tracking-widest font-medium ${accent} mb-1`}
        >
          {CATEGORY_ICONS[recommendation.category]}{" "}
          {CATEGORY_LABELS[recommendation.category]}
        </div>

        <h3 className="font-serif text-base text-text-primary leading-tight mb-1">
          {recommendation.name}
        </h3>

        {recommendation.brand && (
          <p className="text-text-muted text-xs mb-2">{recommendation.brand}</p>
        )}

        <p className="text-text-secondary text-xs leading-relaxed mb-3 line-clamp-2 flex-1">
          {recommendation.description}
        </p>

        {/* Why WHET picked this */}
        <div className="bg-gold/5 border border-gold/15 rounded-sm px-3 py-2 mb-3">
          <p className="text-gold text-xs leading-relaxed line-clamp-2">
            {recommendation.reason}
          </p>
        </div>

        <div className="flex items-center justify-between">
          {recommendation.price_range && (
            <span className="text-gold text-xs font-medium">
              {recommendation.price_range}
            </span>
          )}
          <Link
            href="/advisor"
            className="text-xs text-text-secondary hover:text-gold transition-colors ml-auto"
          >
            See full details →
          </Link>
        </div>
      </div>
    </div>
  );
}
