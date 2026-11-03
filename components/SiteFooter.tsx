"use client";

import { shop } from "@/lib/site";
import { useLanguage } from "@/lib/language";

export default function SiteFooter() {
  const { t } = useLanguage();

  return (
    <footer className="bg-forest-dark px-5 py-8 text-white sm:px-8">
      <div className="mx-auto flex max-w-7xl flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="font-display text-lg">{shop.name}</p>
          <p className="mt-1 text-xs text-white/65">
            {t("footerTagline")} · {shop.location}
          </p>
          <p className="mt-1 text-xs text-white/55">
            {t("managedBy")}: {shop.owners.join(" & ")}
          </p>
        </div>
        <p className="text-xs text-white/55">{t("footerPromise")}</p>
      </div>
    </footer>
  );
}
