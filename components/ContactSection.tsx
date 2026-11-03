"use client";

import { Clock3, MapPin, Phone } from "lucide-react";
import { shop } from "@/lib/site";
import { translateText, useLanguage } from "@/lib/language";

export default function ContactSection() {
  const { t } = useLanguage();

  return (
    <section id="visit" className="scroll-mt-24 bg-white py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="grid gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:items-center lg:gap-16">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-clay">
              {t("comeSayHello")}
            </p>
            <h2 className="mt-3 font-display text-3xl text-ink sm:text-4xl">
              {t("contactTitle")}
            </h2>
            <p className="mt-4 max-w-md text-sm leading-6 text-warm-gray">
              {t("contactDescription")}
            </p>

            <div className="mt-7 space-y-5">
              <div className="flex gap-3.5">
                <MapPin className="mt-0.5 shrink-0 text-forest" size={19} aria-hidden="true" />
                <div>
                  <p className="text-sm font-semibold text-ink">{t("findShop")}</p>
                  <p className="mt-1 text-sm text-warm-gray">{shop.location}</p>
                  <p className="mt-1 text-xs text-warm-gray">
                    {t("managedBy")}: {shop.owners.join(" & ")}
                  </p>
                </div>
              </div>
              <div className="flex gap-3.5">
                <Clock3 className="mt-0.5 shrink-0 text-forest" size={19} aria-hidden="true" />
                <div>
                  <p className="text-sm font-semibold text-ink">{t("workingHours")}</p>
                  <p className="mt-1 text-sm text-warm-gray">{t("workingHoursValue")}</p>
                  <p className="mt-1 text-xs text-warm-gray">
                    {translateText(t("weeklyOff"), { day: t("weeklyOffDay") })}
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <a
                href={`tel:${shop.phoneNumber.replace(/\s/g, "")}`}
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-forest px-5 text-sm font-semibold text-white transition hover:bg-forest-dark"
              >
                <Phone size={16} aria-hidden="true" /> {t("callShop")}
              </a>
              <a
                href={shop.mapUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-ink/15 px-5 text-sm font-semibold text-ink transition hover:border-forest hover:text-forest"
              >
                <MapPin size={16} aria-hidden="true" /> {t("directions")}
              </a>
            </div>
            <p className="mt-3 text-[11px] text-warm-gray">
              {t("contactDisclaimer")}
            </p>
          </div>

          <div className="relative min-h-[280px] overflow-hidden rounded-3xl bg-sage sm:min-h-[380px]">
            <iframe
              title={translateText(t("mapTitle"), { location: shop.location })}
              src={shop.mapEmbedUrl}
              className="absolute inset-0 h-full w-full border-0"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              allowFullScreen
            />
          </div>
        </div>
      </div>
    </section>
  );
}
