"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowDown, ArrowUpRight, Check } from "lucide-react";
import { getWhatsAppUrl } from "@/lib/site";
import { useLanguage } from "@/lib/language";

export default function Hero() {
  const { t } = useLanguage();
  const whatsappUrl = getWhatsAppUrl(t("heroWhatsAppMessage"));
  const highlights = [t("perfectFit"), t("fastDelivery"), t("customDesigns")];

  return (
    <section id="home" className="overflow-hidden bg-cream">
      <div className="mx-auto grid max-w-7xl items-center gap-10 px-5 pb-14 pt-10 sm:px-8 sm:pb-20 sm:pt-16 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16 lg:py-20">
        <div className="relative z-10">
          <p className="mb-5 inline-flex items-center gap-2 rounded-full bg-sage px-3.5 py-2 text-xs font-semibold uppercase tracking-[0.15em] text-forest">
            <span className="h-1.5 w-1.5 rounded-full bg-clay" />
            {t("madeWithCare")}
          </p>
          <h1 className="max-w-2xl font-display text-[2.65rem] font-medium leading-[1.08] tracking-tight text-ink sm:text-6xl lg:text-[4.25rem]">
            {t("heroTitle")}
            <br />
            <span className="italic text-forest">{t("heroTitleEmphasis")}</span>{" "}
            {t("heroTitleEnd")}
          </h1>
          <p className="mt-5 max-w-xl text-base leading-7 text-warm-gray sm:text-lg sm:leading-8">
            {t("heroDescription")}
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              href="#designs"
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-forest px-6 text-sm font-semibold text-white transition hover:bg-forest-dark"
            >
              {t("browseDesigns")} <ArrowDown size={16} aria-hidden="true" />
            </Link>
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-ink/15 px-6 text-sm font-semibold text-ink transition hover:border-forest hover:text-forest"
            >
              {t("chatWhatsApp")} <ArrowUpRight size={16} aria-hidden="true" />
            </a>
          </div>

          <ul className="mt-8 flex flex-wrap gap-x-5 gap-y-3 sm:mt-10">
            {highlights.map((highlight) => (
              <li key={highlight} className="flex items-center gap-2 text-xs font-medium text-ink/75">
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-sage text-forest">
                  <Check size={12} strokeWidth={2.5} aria-hidden="true" />
                </span>
                {highlight}
              </li>
            ))}
          </ul>
        </div>

        <div className="relative mx-auto w-full max-w-xl">
          <div className="absolute -right-4 -top-5 h-28 w-28 rounded-full border border-clay/30 sm:-right-8 sm:-top-8 sm:h-40 sm:w-40" />
          <div className="relative aspect-[4/4.15] overflow-hidden rounded-[2rem] bg-sage sm:rounded-[2.5rem]">
            <Image
              src="https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=1200&q=90"
              alt={t("heroImageAlt")}
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 45vw"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-ink/45 via-transparent to-transparent" />
            <div className="absolute bottom-5 left-5 right-5 rounded-2xl border border-white/30 bg-white/90 p-4 backdrop-blur-sm sm:bottom-7 sm:left-7 sm:right-7 sm:p-5">
              <p className="font-display text-xl text-ink sm:text-2xl">
                {t("detailChangesEverything")}
              </p>
              <p className="mt-1 text-xs text-warm-gray">{t("thoughtfulTailoring")}</p>
            </div>
          </div>
          <div className="absolute -bottom-5 -left-3 rounded-2xl bg-white px-4 py-3 shadow-soft sm:-left-7 sm:px-5">
            <p className="font-display text-lg text-forest">{t("madeForYou")}</p>
            <p className="text-[11px] text-warm-gray">{t("fittedWithCare")}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
