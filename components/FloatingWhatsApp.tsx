"use client";

import { MessageCircle } from "lucide-react";
import { getWhatsAppUrl } from "@/lib/site";
import { useLanguage } from "@/lib/language";

export default function FloatingWhatsApp() {
  const { t } = useLanguage();
  const href = getWhatsAppUrl(t("genericWhatsAppMessage"));

  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      aria-label={t("floatingWhatsAppAria")}
      className="fixed bottom-5 right-5 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg transition hover:scale-105 hover:bg-[#1fb95a] focus:outline-none focus:ring-4 focus:ring-[#25D366]/30 sm:bottom-7 sm:right-7"
    >
      <MessageCircle size={25} aria-hidden="true" />
    </a>
  );
}
