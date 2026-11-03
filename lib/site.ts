export const shop = {
  name: "RK Tailors",
  location: "Runni Saidpur",
  region: "Bihar",
  owners: ["Vikash Kumar", "Nandlal Sah"],
  mapUrl: "https://maps.app.goo.gl/T2qL8WXyDTT2eShH6?g_st=ac",
  latitude: 26.3911438,
  longitude: 85.5051987,
  mapEmbedUrl: "https://www.google.com/maps?q=26.3911438,85.5051987&output=embed",
  phoneNumber: "+91 96935 91674",
  whatsappNumber: "919693591674",
  // Confirm these hours with the shop before publishing them as verified business hours.
  workingHours: "Monday–Saturday, 9:00 AM–8:00 PM",
  weeklyOff: "Sunday",
} as const;

// Set NEXT_PUBLIC_SITE_URL to the production origin (for example, https://rktailors.in).
export const siteUrl = process.env.NEXT_PUBLIC_SITE_URL
  ? new URL(process.env.NEXT_PUBLIC_SITE_URL)
  : undefined;

export function getWhatsAppUrl(message: string): string {
  return `https://wa.me/${shop.whatsappNumber}?text=${encodeURIComponent(message)}`;
}
