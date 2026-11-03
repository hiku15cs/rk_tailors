"use client";

import Link from "next/link";
import { Languages, Scissors } from "lucide-react";
import { shop } from "@/lib/site";
import { useLanguage } from "@/lib/language";

export default function Navbar() {
  const { language, setLanguage, t } = useLanguage();
  const nextLanguage = language === "en" ? "hi" : "en";

  return (
    <header className="sticky top-0 z-40 border-b border-ink/5 bg-cream/95 backdrop-blur">
      <nav
        aria-label={t("navLabel")}
        className="mx-auto flex max-w-7xl items-center justify-between px-5 py-3.5 sm:px-8"
      >
        <Link href="#home" className="flex items-center gap-2.5" aria-label={shop.name}>
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-forest text-white">
            <Scissors size={19} aria-hidden="true" />
          </span>
          <span className="font-display text-lg font-semibold leading-tight text-ink">
            {shop.name}
          </span>
        </Link>

        <div className="hidden items-center gap-8 sm:flex">
          {[
            { href: "#designs", label: t("designsNav") },
            { href: "#pricing", label: t("pricingNav") },
            { href: "#visit", label: t("visitNav") },
          ].map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-ink/75 transition hover:text-forest"
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setLanguage(nextLanguage)}
            aria-label={t(nextLanguage === "hi" ? "switchToHindi" : "switchToEnglish")}
            className="inline-flex min-h-10 items-center gap-1.5 rounded-full border border-forest/20 px-3 text-xs font-semibold text-forest transition hover:bg-sage"
          >
            <Languages size={15} aria-hidden="true" />
            {nextLanguage === "hi" ? "हिन्दी" : "English"}
          </button>
          <a
            href={`tel:${shop.phoneNumber.replace(/\s/g, "")}`}
            className="hidden rounded-full border border-forest/20 px-4 py-2 text-xs font-semibold text-forest transition hover:bg-sage sm:inline-flex sm:text-sm"
          >
            {t("callShop")}
          </a>
        </div>
      </nav>
    </header>
  );
}
