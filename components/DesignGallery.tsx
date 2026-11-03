"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import CategoryFilter, { type DesignFilter } from "@/components/CategoryFilter";
import DesignCard from "@/components/DesignCard";
import { useLanguage } from "@/lib/language";
import { getSupabaseClient, type Design } from "@/lib/supabase";

export default function DesignGallery() {
  const { t } = useLanguage();
  const [activeCategory, setActiveCategory] = useState<DesignFilter>("All");
  const [designs, setDesigns] = useState<Design[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadDesigns = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { data, error: queryError } = await getSupabaseClient()
        .from("designs")
        .select("*")
        .eq("is_active", true)
        .order("created_at", { ascending: false });

      if (queryError) {
        setError(queryError.message);
        setDesigns([]);
      } else {
        setDesigns(data);
      }
    } catch (loadError) {
      setError(
        loadError instanceof Error
          ? loadError.message
          : "An unexpected error occurred while loading designs.",
      );
      setDesigns([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadDesigns();
  }, [loadDesigns]);

  const filteredDesigns = useMemo(() => {
    if (activeCategory === "All") return designs;
    return designs.filter((design) => design.category === activeCategory);
  }, [activeCategory, designs]);

  return (
    <section id="designs" className="scroll-mt-24 bg-white py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-clay">
              {t("collectionName")}
            </p>
            <h2 className="mt-3 font-display text-3xl text-ink sm:text-4xl">
              {t("lookbookTitle")}
            </h2>
            <p className="mt-3 max-w-xl text-sm leading-6 text-warm-gray">
              {t("lookbookDescription")}
            </p>
          </div>
          <p className="text-xs text-warm-gray">{t("startingPricesNote")}</p>
        </div>

        {!error && (
          <div className="mt-7 sm:mt-9">
            <CategoryFilter
              activeCategory={activeCategory}
              onChange={setActiveCategory}
            />
          </div>
        )}

        {error ? (
          <div
            role="alert"
            className="mt-8 rounded-2xl border border-red-200 bg-red-50 p-5 text-sm text-red-800"
          >
            <p>{t("catalogLoadError")}</p>
            <p className="mt-1 break-words text-xs text-red-700">{error}</p>
            <button
              type="button"
              onClick={() => void loadDesigns()}
              className="mt-4 rounded-full bg-red-800 px-4 py-2 text-xs font-semibold text-white hover:bg-red-900"
            >
              {t("tryAgain")}
            </button>
          </div>
        ) : loading ? (
          <div
            aria-label={t("loadingDesigns")}
            className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-4"
          >
            {Array.from({ length: 4 }, (_, index) => (
              <div
                key={index}
                className="animate-pulse overflow-hidden rounded-2xl border border-ink/5 bg-white"
              >
                <div className="aspect-[4/4.5] bg-sage" />
                <div className="space-y-3 p-5">
                  <div className="h-4 w-3/4 rounded bg-sage" />
                  <div className="h-3 w-1/3 rounded bg-sage" />
                  <div className="h-10 rounded-full bg-sage" />
                </div>
              </div>
            ))}
          </div>
        ) : filteredDesigns.length === 0 ? (
          <p className="py-16 text-center text-sm text-warm-gray">
            {t("noDesigns")}
          </p>
        ) : (
          <div
            className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-4"
            aria-live="polite"
          >
            {filteredDesigns.map((design) => (
              <DesignCard key={design.id} design={design} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
