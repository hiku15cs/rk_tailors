"use client";

import type { DesignCategory } from "@/lib/supabase";
import { useLanguage, type TranslationKey } from "@/lib/language";

export type DesignFilter = "All" | DesignCategory;

const categories: DesignFilter[] = [
  "All",
  "Blouse",
  "Kurti",
  "Suit",
  "Gents",
];

const categoryLabels: Record<DesignFilter, TranslationKey> = {
  All: "all",
  Blouse: "blouseCategory",
  Kurti: "kurtiCategory",
  Suit: "suitCategory",
  Gents: "gentsCategory",
};

type CategoryFilterProps = {
  activeCategory: DesignFilter;
  onChange: (category: DesignFilter) => void;
};

export default function CategoryFilter({
  activeCategory,
  onChange,
}: CategoryFilterProps) {
  const { t } = useLanguage();

  return (
    <div className="-mx-5 flex gap-2 overflow-x-auto px-5 pb-2 sm:mx-0 sm:flex-wrap sm:overflow-visible sm:px-0">
      {categories.map((category) => (
        <button
          key={category}
          type="button"
          aria-pressed={activeCategory === category}
          onClick={() => onChange(category)}
          className={`shrink-0 rounded-full px-4 py-2.5 text-sm font-medium transition ${
            activeCategory === category
              ? "bg-forest text-white"
              : "border border-ink/10 bg-white text-ink/70 hover:border-forest/40 hover:text-forest"
          }`}
        >
          {t(categoryLabels[category])}
        </button>
      ))}
    </div>
  );
}
