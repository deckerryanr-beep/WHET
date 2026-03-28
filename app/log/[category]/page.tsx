"use client";

import { useState, use } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase";
import Navigation from "@/components/Navigation";
import type { Category, WineAttributes, WhiskeyAttributes, AthleticWearAttributes, GoingOutWearAttributes } from "@/lib/types";
import { CATEGORY_SLUGS, CATEGORY_LABELS, CATEGORY_ICONS } from "@/lib/types";

// ── Wine Form ──────────────────────────────────────────────────

const WINE_VARIETIES = [
  "Cabernet Sauvignon", "Pinot Noir", "Merlot", "Syrah/Shiraz", "Malbec",
  "Zinfandel", "Sangiovese", "Grenache", "Tempranillo", "Nebbiolo",
  "Chardonnay", "Sauvignon Blanc", "Riesling", "Pinot Grigio", "Viognier",
  "Chenin Blanc", "Gewürztraminer", "Albariño", "Champagne/Sparkling",
  "Rosé", "Other",
];

const WINE_REGIONS = [
  "Napa Valley", "Sonoma", "Willamette Valley", "Bordeaux", "Burgundy",
  "Champagne", "Rhône Valley", "Loire Valley", "Tuscany", "Piedmont",
  "Rioja", "Ribera del Duero", "Douro", "Barossa Valley", "Marlborough",
  "New Zealand", "Argentina (Mendoza)", "Chile", "Spain", "Other",
];

function WineForm({ attributes, onChange }: { attributes: WineAttributes; onChange: (a: WineAttributes) => void }) {
  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="label">Variety / Grape</label>
          <select
            value={attributes.variety || ""}
            onChange={(e) => onChange({ ...attributes, variety: e.target.value })}
            className="input-field"
          >
            <option value="">Select variety...</option>
            {WINE_VARIETIES.map((v) => <option key={v} value={v}>{v}</option>)}
          </select>
        </div>
        <div>
          <label className="label">Region</label>
          <select
            value={attributes.region || ""}
            onChange={(e) => onChange({ ...attributes, region: e.target.value })}
            className="input-field"
          >
            <option value="">Select region...</option>
            {WINE_REGIONS.map((r) => <option key={r} value={r}>{r}</option>)}
          </select>
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <label className="label">Vintage Year</label>
          <input
            type="number"
            min={1980}
            max={new Date().getFullYear()}
            value={attributes.vintage || ""}
            onChange={(e) => onChange({ ...attributes, vintage: parseInt(e.target.value) || undefined })}
            className="input-field"
            placeholder="2021"
          />
        </div>
        <div>
          <label className="label">Body</label>
          <select
            value={attributes.body || ""}
            onChange={(e) => onChange({ ...attributes, body: e.target.value as WineAttributes["body"] })}
            className="input-field"
          >
            <option value="">Select...</option>
            {["Light", "Medium", "Full"].map((v) => <option key={v} value={v}>{v}</option>)}
          </select>
        </div>
        <div>
          <label className="label">Sweetness</label>
          <select
            value={attributes.sweetness || ""}
            onChange={(e) => onChange({ ...attributes, sweetness: e.target.value as WineAttributes["sweetness"] })}
            className="input-field"
          >
            <option value="">Select...</option>
            {["Dry", "Off-dry", "Semi-sweet", "Sweet"].map((v) => <option key={v} value={v}>{v}</option>)}
          </select>
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <SliderField
          label={`Tannins — ${attributes.tannins || "?"}/5`}
          value={attributes.tannins || 3}
          min={1} max={5}
          onChange={(v) => onChange({ ...attributes, tannins: v })}
          leftLabel="Soft" rightLabel="Grippy"
        />
        <SliderField
          label={`Acidity — ${attributes.acidity || "?"}/5`}
          value={attributes.acidity || 3}
          min={1} max={5}
          onChange={(v) => onChange({ ...attributes, acidity: v })}
          leftLabel="Low" rightLabel="Crisp"
        />
        <div>
          <label className="label">Finish</label>
          <select
            value={attributes.finish || ""}
            onChange={(e) => onChange({ ...attributes, finish: e.target.value as WineAttributes["finish"] })}
            className="input-field"
          >
            <option value="">Select...</option>
            {["Short", "Medium", "Long"].map((v) => <option key={v} value={v}>{v}</option>)}
          </select>
        </div>
      </div>
    </div>
  );
}

// ── Whiskey Form ───────────────────────────────────────────────

const WHISKEY_FLAVOR_NOTES = [
  "Vanilla", "Caramel", "Oak", "Honey", "Fruit", "Citrus", "Chocolate",
  "Coffee", "Smoke", "Peat", "Spice", "Pepper", "Dried Fruit", "Floral",
  "Grass", "Cereal", "Nut", "Leather", "Mineral",
];

function WhiskeyForm({ attributes, onChange }: { attributes: WhiskeyAttributes; onChange: (a: WhiskeyAttributes) => void }) {
  const toggleFlavor = (note: string) => {
    const current = attributes.flavor_notes || [];
    const updated = current.includes(note)
      ? current.filter((n) => n !== note)
      : [...current, note];
    onChange({ ...attributes, flavor_notes: updated });
  };

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="label">Type</label>
          <select
            value={attributes.type || ""}
            onChange={(e) => onChange({ ...attributes, type: e.target.value as WhiskeyAttributes["type"] })}
            className="input-field"
          >
            <option value="">Select type...</option>
            {["Bourbon", "Scotch", "Irish", "Japanese", "Rye", "Other"].map((v) => (
              <option key={v} value={v}>{v}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="label">Distillery / Region</label>
          <input
            type="text"
            value={attributes.distillery || ""}
            onChange={(e) => onChange({ ...attributes, distillery: e.target.value })}
            className="input-field"
            placeholder="e.g. Islay, Buffalo Trace"
          />
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <label className="label">Age (years)</label>
          <input
            type="number"
            min={0}
            max={50}
            value={attributes.age || ""}
            onChange={(e) => onChange({ ...attributes, age: parseInt(e.target.value) || undefined })}
            className="input-field"
            placeholder="12"
          />
        </div>
        <div>
          <label className="label">ABV %</label>
          <input
            type="number"
            min={40}
            max={70}
            step={0.1}
            value={attributes.abv || ""}
            onChange={(e) => onChange({ ...attributes, abv: parseFloat(e.target.value) || undefined })}
            className="input-field"
            placeholder="46.0"
          />
        </div>
        <div>
          <label className="label">Finish</label>
          <select
            value={attributes.finish || ""}
            onChange={(e) => onChange({ ...attributes, finish: e.target.value as WhiskeyAttributes["finish"] })}
            className="input-field"
          >
            <option value="">Select...</option>
            {["Short", "Medium", "Long"].map((v) => <option key={v} value={v}>{v}</option>)}
          </select>
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <SliderField
          label={`Smoke / Peat — ${attributes.smoke_level || "?"}/5`}
          value={attributes.smoke_level || 1}
          min={1} max={5}
          onChange={(v) => onChange({ ...attributes, smoke_level: v })}
          leftLabel="None" rightLabel="Heavily Peated"
        />
        <SliderField
          label={`Sweetness — ${attributes.sweetness || "?"}/5`}
          value={attributes.sweetness || 3}
          min={1} max={5}
          onChange={(v) => onChange({ ...attributes, sweetness: v })}
          leftLabel="Dry / Savory" rightLabel="Very Sweet"
        />
      </div>
      <div>
        <label className="label">Flavor Notes (select all that apply)</label>
        <div className="flex flex-wrap gap-2 mt-2">
          {WHISKEY_FLAVOR_NOTES.map((note) => {
            const active = (attributes.flavor_notes || []).includes(note);
            return (
              <button
                key={note}
                type="button"
                onClick={() => toggleFlavor(note)}
                className={`px-3 py-1.5 text-xs rounded-sm border transition-colors ${
                  active
                    ? "bg-gold/20 border-gold text-gold"
                    : "bg-surface-2 border-border text-text-secondary hover:border-border-light"
                }`}
              >
                {note}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ── Athletic Wear Form ─────────────────────────────────────────

const ATHLETIC_ITEM_TYPES = [
  "Leggings", "Shorts", "Sports Bra", "Tank Top", "T-Shirt",
  "Long Sleeve", "Hoodie / Zip-Up", "Running Shoes", "Training Shoes",
  "Sports Socks", "Jacket / Vest", "Other",
];

const ATHLETIC_ACTIVITIES = [
  "Running", "Yoga", "CrossFit / HIIT", "Cycling", "Swimming",
  "Pilates", "Weight Training", "Tennis / Pickleball", "Hiking", "Dance", "Other",
];

function AthleticWearForm({ attributes, onChange }: { attributes: AthleticWearAttributes; onChange: (a: AthleticWearAttributes) => void }) {
  const toggleActivity = (act: string) => {
    const current = attributes.activity || [];
    const updated = current.includes(act)
      ? current.filter((a) => a !== act)
      : [...current, act];
    onChange({ ...attributes, activity: updated });
  };

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="label">Item Type</label>
          <select
            value={attributes.item_type || ""}
            onChange={(e) => onChange({ ...attributes, item_type: e.target.value })}
            className="input-field"
          >
            <option value="">Select type...</option>
            {ATHLETIC_ITEM_TYPES.map((v) => <option key={v} value={v}>{v}</option>)}
          </select>
        </div>
        <div>
          <label className="label">Fit</label>
          <select
            value={attributes.fit || ""}
            onChange={(e) => onChange({ ...attributes, fit: e.target.value as AthleticWearAttributes["fit"] })}
            className="input-field"
          >
            <option value="">Select...</option>
            {["Runs small", "True to size", "Runs large"].map((v) => (
              <option key={v} value={v}>{v}</option>
            ))}
          </select>
        </div>
      </div>
      <div>
        <label className="label">Activity (select all that apply)</label>
        <div className="flex flex-wrap gap-2 mt-2">
          {ATHLETIC_ACTIVITIES.map((act) => {
            const active = (attributes.activity || []).includes(act);
            return (
              <button
                key={act}
                type="button"
                onClick={() => toggleActivity(act)}
                className={`px-3 py-1.5 text-xs rounded-sm border transition-colors ${
                  active
                    ? "bg-emerald-900/30 border-emerald-700 text-emerald-400"
                    : "bg-surface-2 border-border text-text-secondary hover:border-border-light"
                }`}
              >
                {act}
              </button>
            );
          })}
        </div>
      </div>
      <div>
        <label className="label">Material Feel</label>
        <div className="flex flex-wrap gap-2">
          {["Soft", "Technical", "Compressive", "Lightweight"].map((feel) => {
            const active = attributes.material_feel === feel;
            return (
              <button
                key={feel}
                type="button"
                onClick={() => onChange({ ...attributes, material_feel: feel as AthleticWearAttributes["material_feel"] })}
                className={`px-4 py-2 text-xs rounded-sm border transition-colors ${
                  active
                    ? "bg-emerald-900/30 border-emerald-700 text-emerald-400"
                    : "bg-surface-2 border-border text-text-secondary hover:border-border-light"
                }`}
              >
                {feel}
              </button>
            );
          })}
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <SliderField
          label={`Style Rating — ${attributes.style_rating || "?"}/10`}
          value={attributes.style_rating || 5}
          min={1} max={10}
          onChange={(v) => onChange({ ...attributes, style_rating: v })}
          leftLabel="Basic" rightLabel="Stunning"
        />
        <SliderField
          label={`Performance Rating — ${attributes.performance_rating || "?"}/10`}
          value={attributes.performance_rating || 5}
          min={1} max={10}
          onChange={(v) => onChange({ ...attributes, performance_rating: v })}
          leftLabel="Poor" rightLabel="Elite"
        />
      </div>
      <div>
        <label className="label">Would Buy Again?</label>
        <div className="flex gap-3">
          {[true, false].map((val) => (
            <button
              key={String(val)}
              type="button"
              onClick={() => onChange({ ...attributes, would_buy_again: val })}
              className={`px-6 py-2 text-sm rounded-sm border transition-colors ${
                attributes.would_buy_again === val
                  ? "bg-emerald-900/30 border-emerald-700 text-emerald-400"
                  : "bg-surface-2 border-border text-text-secondary hover:border-border-light"
              }`}
            >
              {val ? "Yes" : "No"}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Going Out Wear Form ────────────────────────────────────────

const GOING_OUT_ITEM_TYPES = [
  "Mini Dress", "Midi Dress", "Maxi Dress", "Bodycon Dress", "Slip Dress",
  "Blouse / Top", "Corset / Bustier", "Set (Co-ord)", "Wide-leg Pants",
  "Mini Skirt", "Midi Skirt", "Blazer", "Heels / Sandals", "Boots", "Other",
];

const GOING_OUT_OCCASIONS = [
  "Date Night", "Girls Night Out", "Club / Bar", "Birthday Dinner",
  "Rooftop / Brunch", "Wedding Guest", "Holiday Party", "Summer Event", "Other",
];

function GoingOutWearForm({ attributes, onChange }: { attributes: GoingOutWearAttributes; onChange: (a: GoingOutWearAttributes) => void }) {
  const toggleOccasion = (occ: string) => {
    const current = attributes.occasion || [];
    const updated = current.includes(occ)
      ? current.filter((o) => o !== occ)
      : [...current, occ];
    onChange({ ...attributes, occasion: updated });
  };

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="label">Item Type</label>
          <select
            value={attributes.item_type || ""}
            onChange={(e) => onChange({ ...attributes, item_type: e.target.value })}
            className="input-field"
          >
            <option value="">Select type...</option>
            {GOING_OUT_ITEM_TYPES.map((v) => <option key={v} value={v}>{v}</option>)}
          </select>
        </div>
        <div>
          <label className="label">Color</label>
          <input
            type="text"
            value={attributes.color || ""}
            onChange={(e) => onChange({ ...attributes, color: e.target.value })}
            className="input-field"
            placeholder="e.g. Black, Emerald, Nude"
          />
        </div>
      </div>
      <div>
        <label className="label">Occasion (select all that apply)</label>
        <div className="flex flex-wrap gap-2 mt-2">
          {GOING_OUT_OCCASIONS.map((occ) => {
            const active = (attributes.occasion || []).includes(occ);
            return (
              <button
                key={occ}
                type="button"
                onClick={() => toggleOccasion(occ)}
                className={`px-3 py-1.5 text-xs rounded-sm border transition-colors ${
                  active
                    ? "bg-purple-900/30 border-purple-700 text-purple-400"
                    : "bg-surface-2 border-border text-text-secondary hover:border-border-light"
                }`}
              >
                {occ}
              </button>
            );
          })}
        </div>
      </div>
      <div>
        <label className="label">Fit Description</label>
        <input
          type="text"
          value={attributes.fit_description || ""}
          onChange={(e) => onChange({ ...attributes, fit_description: e.target.value })}
          className="input-field"
          placeholder="e.g. Ran small, hugged perfectly in all the right places"
        />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <SliderField
          label={`Comfort Rating — ${attributes.comfort_rating || "?"}/10`}
          value={attributes.comfort_rating || 5}
          min={1} max={10}
          onChange={(v) => onChange({ ...attributes, comfort_rating: v })}
          leftLabel="Couldn't wait to change" rightLabel="Wore all night"
        />
        <SliderField
          label={`Style Rating — ${attributes.style_rating || "?"}/10`}
          value={attributes.style_rating || 5}
          min={1} max={10}
          onChange={(v) => onChange({ ...attributes, style_rating: v })}
          leftLabel="Meh" rightLabel="Statement piece"
        />
      </div>
      <div>
        <label className="label">Received Compliments?</label>
        <div className="flex gap-3">
          {[true, false].map((val) => (
            <button
              key={String(val)}
              type="button"
              onClick={() => onChange({ ...attributes, received_compliments: val })}
              className={`px-6 py-2 text-sm rounded-sm border transition-colors ${
                attributes.received_compliments === val
                  ? "bg-purple-900/30 border-purple-700 text-purple-400"
                  : "bg-surface-2 border-border text-text-secondary hover:border-border-light"
              }`}
            >
              {val ? "Yes" : "No"}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Slider Helper ──────────────────────────────────────────────

function SliderField({
  label, value, min, max, onChange, leftLabel, rightLabel,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  onChange: (v: number) => void;
  leftLabel?: string;
  rightLabel?: string;
}) {
  return (
    <div>
      <label className="label">{label}</label>
      <input
        type="range"
        min={min}
        max={max}
        value={value}
        onChange={(e) => onChange(parseInt(e.target.value))}
        className="w-full h-1 bg-border rounded-sm appearance-none cursor-pointer
                   [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4
                   [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full
                   [&::-webkit-slider-thumb]:bg-gold [&::-webkit-slider-thumb]:cursor-pointer"
      />
      {(leftLabel || rightLabel) && (
        <div className="flex justify-between mt-1">
          <span className="text-text-muted text-xs">{leftLabel}</span>
          <span className="text-text-muted text-xs">{rightLabel}</span>
        </div>
      )}
    </div>
  );
}

// ── Main Page ──────────────────────────────────────────────────

type PageParams = { category: string };

export default function LogPage({ params }: { params: Promise<PageParams> }) {
  const { category: slug } = use(params);
  const router = useRouter();
  const category: Category = CATEGORY_SLUGS[slug] || "wine";

  const [name, setName] = useState("");
  const [brand, setBrand] = useState("");
  const [rating, setRating] = useState(7);
  const [notes, setNotes] = useState("");
  const [price, setPrice] = useState("");
  const [attributes, setAttributes] = useState<Record<string, unknown>>({});
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const label = CATEGORY_LABELS[category];
  const icon = CATEGORY_ICONS[category];

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) {
      setError("Please enter a name.");
      return;
    }
    setSaving(true);
    setError("");

    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { router.push("/login"); return; }

    const { error: insertError } = await supabase.from("items").insert({
      user_id: user.id,
      category,
      name: name.trim(),
      brand: brand.trim() || null,
      rating,
      notes: notes.trim() || null,
      price: price ? parseFloat(price) : null,
      attributes,
    });

    if (insertError) {
      setError(insertError.message);
      setSaving(false);
    } else {
      router.push("/dashboard");
      router.refresh();
    }
  }

  const namePlaceholders: Record<Category, string> = {
    wine: "e.g. Opus One 2019, Château Margaux",
    whiskey: "e.g. Blanton's Single Barrel, Yamazaki 12",
    athletic_wear: "e.g. Lululemon Align Leggings 25\"",
    going_out_wear: "e.g. Zara Satin Slip Midi Dress",
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <main className="max-w-2xl mx-auto px-6 py-10">
        {/* Header */}
        <div className="mb-10">
          <Link
            href="/dashboard"
            className="text-text-muted text-xs hover:text-gold transition-colors mb-4 inline-block"
          >
            ← Back to Dashboard
          </Link>
          <div className="flex items-center gap-3 mb-2">
            <span className="text-3xl">{icon}</span>
            <h1 className="font-serif text-3xl text-text-primary">
              Log a {label}
            </h1>
          </div>
          <p className="text-text-secondary text-sm">
            The more detail you give, the sharper your recommendations become.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {error && (
            <div className="bg-red-950/40 border border-red-900/50 text-red-400 text-sm px-4 py-3 rounded-sm">
              {error}
            </div>
          )}

          {/* Core Info */}
          <section className="card space-y-5">
            <h2 className="font-serif text-xl text-text-primary">
              The Basics
            </h2>

            <div>
              <label className="label">Name *</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="input-field"
                placeholder={namePlaceholders[category]}
                required
              />
            </div>

            <div>
              <label className="label">Brand / Producer</label>
              <input
                type="text"
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
                className="input-field"
                placeholder="Brand or producer name"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="label">
                  Overall Rating — {rating}/10
                </label>
                <input
                  type="range"
                  min={1}
                  max={10}
                  value={rating}
                  onChange={(e) => setRating(parseInt(e.target.value))}
                  className="w-full h-1 bg-border rounded-sm appearance-none cursor-pointer
                             [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4
                             [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full
                             [&::-webkit-slider-thumb]:bg-gold [&::-webkit-slider-thumb]:cursor-pointer
                             mt-2"
                />
                <div className="flex justify-between mt-1">
                  <span className="text-text-muted text-xs">1 — Not my thing</span>
                  <span className="text-text-muted text-xs">10 — Life-changing</span>
                </div>
              </div>
              <div>
                <label className="label">Price Paid ($)</label>
                <input
                  type="number"
                  min={0}
                  step={0.01}
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  className="input-field"
                  placeholder="0.00"
                />
              </div>
            </div>

            <div>
              <label className="label">Your Notes</label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="input-field min-h-[100px] resize-y"
                placeholder="Impressions, context, how it made you feel..."
                rows={3}
              />
            </div>
          </section>

          {/* Category-Specific Attributes */}
          <section className="card">
            <h2 className="font-serif text-xl text-text-primary mb-5">
              The Details
            </h2>
            {category === "wine" && (
              <WineForm
                attributes={attributes as WineAttributes}
                onChange={(a) => setAttributes(a as Record<string, unknown>)}
              />
            )}
            {category === "whiskey" && (
              <WhiskeyForm
                attributes={attributes as WhiskeyAttributes}
                onChange={(a) => setAttributes(a as Record<string, unknown>)}
              />
            )}
            {category === "athletic_wear" && (
              <AthleticWearForm
                attributes={attributes as AthleticWearAttributes}
                onChange={(a) => setAttributes(a as Record<string, unknown>)}
              />
            )}
            {category === "going_out_wear" && (
              <GoingOutWearForm
                attributes={attributes as GoingOutWearAttributes}
                onChange={(a) => setAttributes(a as Record<string, unknown>)}
              />
            )}
          </section>

          {/* Submit */}
          <div className="flex gap-4">
            <button
              type="submit"
              disabled={saving}
              className="btn-gold flex-1 py-4 text-base disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saving ? "Saving..." : `Log This ${label}`}
            </button>
            <Link href="/dashboard" className="btn-ghost px-6">
              Cancel
            </Link>
          </div>
        </form>
      </main>
    </div>
  );
}
