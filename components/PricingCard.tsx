"use client";

import { Ruler } from "lucide-react";
import { useLanguage, type TranslationKey } from "@/lib/language";

const ladiesPrices = [
  ["blouseStitching", 350],
  ["kurtiStitching", 500],
  ["suitTwoPiece", 1000],
  ["lehengaStitching", 2200],
] satisfies [TranslationKey, number][];

const gentsPrices = [
  ["shirtStitching", 600],
  ["trouserStitching", 700],
  ["kurtaStitching", 800],
] satisfies [TranslationKey, number][];

function PriceTable({ items }: { items: [TranslationKey, number][] }) {
  const { t } = useLanguage();

  return (
    <dl className="divide-y divide-ink/8">
      {items.map(([item, price]) => (
        <div key={item} className="flex items-center justify-between gap-3 py-3.5">
          <dt className="text-sm text-ink/75">{t(item)}</dt>
          <dd className="shrink-0 text-sm font-semibold text-forest">
            {t("from")} ₹{price.toLocaleString("en-IN")}
          </dd>
        </div>
      ))}
    </dl>
  );
}

export default function PricingCard() {
  const { t } = useLanguage();

  return (
    <section id="pricing" className="scroll-mt-24 bg-cream py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-clay">
            {t("simplePricing")}
          </p>
          <h2 className="mt-3 font-display text-3xl text-ink sm:text-4xl">
            {t("pricingTitle")}
          </h2>
          <p className="mt-3 text-sm leading-6 text-warm-gray">
            {t("pricingDescription")}
          </p>
        </div>

        <div className="mt-9 grid gap-5 md:grid-cols-2">
          <div className="rounded-2xl border border-ink/5 bg-white p-5 shadow-sm sm:p-7">
            <div className="mb-2 flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-sage text-forest">
                <Ruler size={18} aria-hidden="true" />
              </span>
              <div>
                <h3 className="font-display text-xl text-ink">{t("ladiesWear")}</h3>
                <p className="text-xs text-warm-gray">{t("stitchingCharges")}</p>
              </div>
            </div>
            <PriceTable items={ladiesPrices} />
          </div>
          <div className="rounded-2xl border border-ink/5 bg-white p-5 shadow-sm sm:p-7">
            <div className="mb-2 flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-sage text-forest">
                <Ruler size={18} aria-hidden="true" />
              </span>
              <div>
                <h3 className="font-display text-xl text-ink">{t("gentsWear")}</h3>
                <p className="text-xs text-warm-gray">{t("stitchingCharges")}</p>
              </div>
            </div>
            <PriceTable items={gentsPrices} />
          </div>
        </div>

        <div className="mt-5 rounded-2xl bg-sage/80 p-5 sm:flex sm:items-start sm:gap-5 sm:p-6">
          <p className="shrink-0 text-sm font-semibold text-forest">{t("optionalAddOns")}</p>
          <p className="mt-1 text-sm leading-6 text-ink/70 sm:mt-0">
            {t("addOnsDescription")}
          </p>
        </div>
        <p className="mt-4 text-center text-[11px] text-warm-gray">
          {t("samplePricesNote")}
        </p>
      </div>
    </section>
  );
}
