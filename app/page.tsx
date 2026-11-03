import ContactSection from "@/components/ContactSection";
import DesignGallery from "@/components/DesignGallery";
import FloatingWhatsApp from "@/components/FloatingWhatsApp";
import Hero from "@/components/Hero";
import Navbar from "@/components/Navbar";
import PricingCard from "@/components/PricingCard";
import SiteFooter from "@/components/SiteFooter";
import { shop, siteUrl } from "@/lib/site";

export default function HomePage() {
  const localBusinessSchema = {
    "@context": "https://schema.org",
    "@type": "Tailor",
    "@id": siteUrl ? `${siteUrl.toString()}#business` : undefined,
    name: shop.name,
    alternateName: ["RK Tailor", "RK Tailors Runni Saidpur"],
    description:
      "Ladies' and gents' custom tailoring and stitching in Runni Saidpur, Bihar. Managed by Vikash Kumar and Nandlal Sah.",
    ...(siteUrl ? { url: siteUrl.toString() } : {}),
    telephone: shop.phoneNumber,
    address: {
      "@type": "PostalAddress",
      addressLocality: shop.location,
      addressRegion: shop.region,
      addressCountry: "IN",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: shop.latitude,
      longitude: shop.longitude,
    },
    hasMap: shop.mapUrl,
    areaServed: {
      "@type": "City",
      name: shop.location,
    },
    contactPoint: {
      "@type": "ContactPoint",
      telephone: shop.phoneNumber,
      contactType: "customer service",
      availableLanguage: ["English", "Hindi"],
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(localBusinessSchema).replace(/</g, "\\u003c"),
        }}
      />
      <Navbar />
      <main>
        <Hero />
        <DesignGallery />
        <PricingCard />
        <ContactSection />
      </main>
      <SiteFooter />
      <FloatingWhatsApp />
    </>
  );
}
