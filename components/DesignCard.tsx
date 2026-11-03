"use client";

import { ArrowUpRight } from "lucide-react";
import type { Design } from "@/lib/supabase";
import { getWhatsAppUrl } from "@/lib/site";
import { useLanguage } from "@/lib/language";

type DesignCardProps = {
  design: Design;
};

export default function DesignCard({ design }: DesignCardProps) {
  const { t } = useLanguage();
  const message = `Namaste RK Tailor, mujhe aapka yeh design pasand aaya: ${design.title} (Category: ${design.category}, Starting ₹${design.starting_price}). Link: ${design.image_url}. Kya yeh ban sakta hai?`;
  const categoryLabel = {
    Blouse: t("blouseCategory"),
    Kurti: t("kurtiCategory"),
    Suit: t("suitCategory"),
    Gents: t("gentsCategory"),
  }[design.category];

  return (
    <article className="group overflow-hidden rounded-2xl border border-ink/5 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-soft">
      <div className="relative aspect-[4/4.5] overflow-hidden bg-sage">
        <img
          src={design.image_url}
          alt={`${design.title} ${t("tailoringInspiration")}`}
          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
          loading="lazy"
          decoding="async"
        />
        <span className="absolute left-3 top-3 rounded-full bg-white/95 px-3 py-1.5 text-[11px] font-semibold text-forest shadow-sm">
          {categoryLabel}
        </span>
      </div>
      <div className="p-4 sm:p-5">
        <div className="flex min-h-[3.5rem] items-start justify-between gap-3">
          <h3 className="font-display text-lg leading-snug text-ink sm:text-xl">
            {design.title}
          </h3>
          <p className="shrink-0 pt-1 text-right text-xs text-warm-gray">
            {t("from")}
            <span className="block text-sm font-bold text-forest">₹{design.starting_price}</span>
          </p>
        </div>
        <div className="mt-2 flex flex-wrap gap-1.5">
          {design.tags.map((tag) => (
            <span
              key={tag}
              className="rounded-full bg-cream px-2.5 py-1 text-[10px] font-medium text-warm-gray"
            >
              {tag}
            </span>
          ))}
        </div>
        <a
          href={getWhatsAppUrl(message)}
          target="_blank"
          rel="noreferrer"
          className="mt-4 inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-full border border-forest/20 text-xs font-semibold text-forest transition hover:bg-forest hover:text-white"
          aria-label={`${t("orderOnWhatsApp")}: ${design.title}`}
        >
          {t("orderOnWhatsApp")} <ArrowUpRight size={15} aria-hidden="true" />
        </a>
      </div>
    </article>
  );
}
