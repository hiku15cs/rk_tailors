import type { Metadata } from "next";
import { LanguageProvider } from "@/lib/language";
import { siteUrl } from "@/lib/site";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: siteUrl,
  title: {
    default: "RK Tailors | Tailor in Runni Saidpur, Bihar",
    template: "%s | RK Tailors Runni Saidpur",
  },
  description:
    "Looking for a tailor in Runni Saidpur or a Saidpur tailor? RK Tailors offers custom stitching for ladies and gents. Managed by Vikash Kumar and Nandlal Sah.",
  applicationName: "RK Tailors",
  keywords: [
    "tailor in Runni Saidpur",
    "Runni Saidpur tailor",
    "Runni Saidpur tailoring",
    "Saidpur tailor",
    "tailor in Saidpur Bihar",
    "RK Tailor",
    "RK Tailors",
    "Vikash Tailor",
    "Vikash Kumar tailor",
    "ladies tailor Runni Saidpur",
    "gents tailor Runni Saidpur",
    "custom stitching Runni Saidpur",
    "designer stitching Bihar",
    "आर के टेलर्स",
    "रुन्नी सैदपुर टेलर",
    "सैदपुर दर्जी",
    "विकाश कुमार टेलर",
  ],
  authors: [{ name: "Vikash Kumar and Nandlal Sah", url: siteUrl }],
  creator: "RK Tailors",
  publisher: "RK Tailors",
  alternates: {
    canonical: siteUrl,
  },
  openGraph: {
    type: "website",
    locale: "en_IN",
    alternateLocale: ["hi_IN"],
    siteName: "RK Tailors",
    title: "RK Tailors | Tailor in Runni Saidpur, Bihar",
    description:
      "Ladies and gents custom stitching in Runni Saidpur. Visit RK Tailors, managed by Vikash Kumar and Nandlal Sah.",
    url: siteUrl,
  },
  twitter: {
    card: "summary",
    title: "RK Tailors | Tailor in Runni Saidpur",
    description:
      "Custom ladies' and gents' stitching at RK Tailors in Runni Saidpur, Bihar.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="font-sans antialiased">
        <LanguageProvider>{children}</LanguageProvider>
      </body>
    </html>
  );
}
