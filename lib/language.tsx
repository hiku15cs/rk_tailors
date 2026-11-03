"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

export type Language = "en" | "hi";

const translations = {
  en: {
    navLabel: "Main navigation",
    designsNav: "Designs",
    pricingNav: "Pricing",
    visitNav: "Visit us",
    callShop: "Call the shop",
    switchToHindi: "Switch language to Hindi",
    switchToEnglish: "Switch language to English",
    madeWithCare: "Made with care in Runni Saidpur",
    heroTitle: "Your style,",
    heroTitleEmphasis: "stitched",
    heroTitleEnd: "to fit.",
    heroDescription:
      "Expert Custom Tailoring & Designer Stitching in Runni Saidpur. From everyday essentials to occasion wear, every piece is made just for you.",
    browseDesigns: "Browse designs",
    chatWhatsApp: "Chat on WhatsApp",
    perfectFit: "Perfect fit guaranteed",
    fastDelivery: "Fast delivery",
    customDesigns: "Custom designs",
    heroImageAlt: "Colorful traditional Indian outfit with intricate detailing",
    detailChangesEverything: "A little detail changes everything.",
    thoughtfulTailoring: "Thoughtful tailoring, made personal.",
    madeForYou: "Made for you",
    fittedWithCare: "Fitted with care",
    lookbook: "The lookbook",
    lookbookTitle: "Find your next favourite.",
    lookbookDescription:
      "Pick a style you love. We'll tailor it to your measurements and make it yours.",
    startingPricesNote: "Starting prices · final quote after design details",
    collectionName: "RK Tailor Design Collection",
    all: "All",
    blouseCategory: "Blouse",
    kurtiCategory: "Kurti",
    suitCategory: "Suit",
    gentsCategory: "Gents",
    from: "From",
    tailoringInspiration: "tailoring inspiration",
    orderOnWhatsApp: "Order on WhatsApp",
    orderDesignAria: "Order {title} on WhatsApp",
    noDesigns: "No designs in this category just yet. Message us to request a style.",
    loadingDesigns: "Loading designs…",
    catalogLoadError: "We couldn't load the design collection. Please try again.",
    tryAgain: "Try again",
    simplePricing: "Simple, upfront pricing",
    pricingTitle: "A good fit for every budget.",
    pricingDescription:
      "These are starting stitching charges. The final price depends on fabric, design details and finishing.",
    ladiesWear: "Ladies' wear",
    gentsWear: "Gents' wear",
    stitchingCharges: "Custom stitching charges",
    blouseStitching: "Blouse stitching",
    kurtiStitching: "Kurti stitching",
    suitTwoPiece: "Suit (2-piece)",
    lehengaStitching: "Lehenga stitching",
    shirtStitching: "Shirt stitching",
    trouserStitching: "Trouser stitching",
    kurtaStitching: "Kurta stitching",
    optionalAddOns: "Optional add-ons",
    addOnsDescription:
      "Lining / astar, latkan, piping and designer neck details are available at an additional charge. Ask us for a quote based on your design.",
    samplePricesNote:
      "Sample prices for reference; please confirm the current rate before placing an order.",
    comeSayHello: "Come say hello",
    contactTitle: "Your next fitting starts here.",
    contactDescription:
      "Bring your fabric, bring an idea, or just drop by. We'll help you find the right fit.",
    findShop: "Find the shop",
    managedBy: "Managed by",
    workingHours: "Working hours",
    workingHoursValue: "Monday–Saturday, 9:00 AM–8:00 PM",
    weeklyOffDay: "Sunday",
    weeklyOff: "Weekly off: {day}",
    directions: "Get directions",
    contactDisclaimer:
      "Phone number and working hours are sample details; please confirm before visiting.",
    mapTitle: "Map showing {location}",
    footerTagline: "Ladies & Gents Custom Stitching",
    footerPromise: "Made with care, stitched to fit.",
    floatingWhatsAppAria: "Chat with RK Tailors on WhatsApp",
    heroWhatsAppMessage:
      "Hello RK Tailors! I'd like to ask about a custom stitching order.",
    genericWhatsAppMessage:
      "Hello! I'd like to ask about custom stitching.",
    orderWhatsAppMessage:
      'Hi! I\'m interested in "{title}" (Design ID: {id}). The listed starting price is ₹{price}. Could you share the final stitching estimate and availability?',
  },
  hi: {
    navLabel: "मुख्य नेविगेशन",
    designsNav: "डिज़ाइन",
    pricingNav: "कीमतें",
    visitNav: "दुकान पर आएँ",
    callShop: "दुकान पर कॉल करें",
    switchToHindi: "भाषा हिंदी में बदलें",
    switchToEnglish: "भाषा अंग्रेज़ी में बदलें",
    madeWithCare: "रुन्नी सैदपुर में प्यार से तैयार",
    heroTitle: "आपका अंदाज़,",
    heroTitleEmphasis: "आपके नाप",
    heroTitleEnd: "के अनुसार।",
    heroDescription:
      "रुन्नी सैदपुर में बेहतरीन कस्टम टेलरिंग और डिज़ाइनर सिलाई। रोज़मर्रा के कपड़ों से लेकर खास मौकों के पहनावे तक—हर कपड़ा आपके लिए खास तौर पर सिला जाता है।",
    browseDesigns: "डिज़ाइन देखें",
    chatWhatsApp: "WhatsApp पर बात करें",
    perfectFit: "बेहतरीन फिट की गारंटी",
    fastDelivery: "जल्दी डिलीवरी",
    customDesigns: "मनपसंद डिज़ाइन",
    heroImageAlt: "बारीक कढ़ाई वाला रंगीन पारंपरिक भारतीय परिधान",
    detailChangesEverything: "छोटी-सी बारीकी, बड़ा फर्क।",
    thoughtfulTailoring: "सोच-समझकर की गई, आपकी पसंद की सिलाई।",
    madeForYou: "सिर्फ आपके लिए",
    fittedWithCare: "प्यार से तैयार फिट",
    lookbook: "हमारे डिज़ाइन",
    lookbookTitle: "अपना पसंदीदा अंदाज़ चुनें।",
    lookbookDescription:
      "अपनी पसंद का डिज़ाइन चुनें। हम उसे आपके नाप के अनुसार सिलकर खास बनाएँगे।",
    startingPricesNote: "शुरुआती कीमतें · डिज़ाइन के अनुसार अंतिम कीमत",
    collectionName: "आरके टेलर डिज़ाइन कलेक्शन",
    all: "सभी",
    blouseCategory: "ब्लाउज़",
    kurtiCategory: "कुर्ती",
    suitCategory: "सूट",
    gentsCategory: "पुरुष",
    from: "शुरुआती कीमत",
    tailoringInspiration: "सिलाई डिज़ाइन",
    orderOnWhatsApp: "WhatsApp पर ऑर्डर करें",
    orderDesignAria: "{title} के लिए WhatsApp पर ऑर्डर करें",
    noDesigns: "इस श्रेणी में अभी डिज़ाइन उपलब्ध नहीं हैं। अपनी पसंद का डिज़ाइन पूछने के लिए हमें संदेश भेजें।",
    loadingDesigns: "डिज़ाइन लोड हो रहे हैं…",
    catalogLoadError: "डिज़ाइन कलेक्शन लोड नहीं हो सका। कृपया फिर से कोशिश करें।",
    tryAgain: "फिर से कोशिश करें",
    simplePricing: "साफ़ और उचित कीमतें",
    pricingTitle: "हर बजट के लिए सही सिलाई।",
    pricingDescription:
      "ये सिलाई की शुरुआती कीमतें हैं। अंतिम कीमत कपड़े, डिज़ाइन और फ़िनिशिंग पर निर्भर करती है।",
    ladiesWear: "महिलाओं के कपड़े",
    gentsWear: "पुरुषों के कपड़े",
    stitchingCharges: "कस्टम सिलाई की कीमतें",
    blouseStitching: "ब्लाउज़ सिलाई",
    kurtiStitching: "कुर्ती सिलाई",
    suitTwoPiece: "सूट (2 पीस)",
    lehengaStitching: "लहंगा सिलाई",
    shirtStitching: "शर्ट सिलाई",
    trouserStitching: "पैंट सिलाई",
    kurtaStitching: "कुर्ता सिलाई",
    optionalAddOns: "अतिरिक्त सुविधाएँ",
    addOnsDescription:
      "अस्तर, लटकन, पाइपिंग और डिज़ाइनर नेक की सुविधा अतिरिक्त कीमत पर उपलब्ध है। अपने डिज़ाइन के अनुसार कीमत पूछें।",
    samplePricesNote:
      "ये कीमतें केवल जानकारी के लिए हैं; ऑर्डर देने से पहले मौजूदा कीमत की पुष्टि करें।",
    comeSayHello: "आइए, मिलकर बात करें",
    contactTitle: "आपकी अगली फिटिंग यहीं से शुरू होती है।",
    contactDescription:
      "अपना कपड़ा या कोई डिज़ाइन आइडिया लेकर आएँ, या बस मिलने आ जाएँ। सही फिट चुनने में हम आपकी मदद करेंगे।",
    findShop: "दुकान का पता",
    managedBy: "संचालक",
    workingHours: "दुकान का समय",
    workingHoursValue: "सोमवार–शनिवार, सुबह 9:00–रात 8:00 बजे",
    weeklyOffDay: "रविवार",
    weeklyOff: "साप्ताहिक छुट्टी: {day}",
    directions: "रास्ता देखें",
    contactDisclaimer:
      "फोन नंबर और दुकान का समय नमूने के तौर पर हैं; आने से पहले पुष्टि करें।",
    mapTitle: "{location} का नक्शा",
    footerTagline: "महिला और पुरुषों की कस्टम सिलाई",
    footerPromise: "प्यार से तैयार, आपके नाप के अनुसार।",
    floatingWhatsAppAria: "आरके टेलर्स से WhatsApp पर बात करें",
    heroWhatsAppMessage:
      "नमस्ते आरके टेलर्स! मुझे कस्टम सिलाई के ऑर्डर के बारे में पूछना है।",
    genericWhatsAppMessage:
      "नमस्ते! मुझे सिलाई के बारे में पूछना है।",
    orderWhatsAppMessage:
      'नमस्ते! मुझे "{title}" डिज़ाइन पसंद आया (डिज़ाइन आईडी: {id})। इसकी शुरुआती कीमत ₹{price} है। कृपया अंतिम सिलाई कीमत और उपलब्धता बताएँ।',
  },
} as const;

export type TranslationKey = keyof typeof translations.en;

type LanguageContextValue = {
  language: Language;
  setLanguage: (language: Language) => void;
  t: (key: TranslationKey) => string;
};

const LanguageContext = createContext<LanguageContextValue | null>(null);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>("en");

  useEffect(() => {
    const savedLanguage = window.localStorage.getItem("rumi-tailors-language");
    if (savedLanguage === "en" || savedLanguage === "hi") {
      setLanguage(savedLanguage);
    }
  }, []);

  useEffect(() => {
    window.localStorage.setItem("rumi-tailors-language", language);
    document.documentElement.lang = language;
  }, [language]);

  const value = useMemo<LanguageContextValue>(
    () => ({
      language,
      setLanguage,
      t: (key) => translations[language][key],
    }),
    [language],
  );

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}

export function translateText(
  template: string,
  values: Record<string, string | number>,
): string {
  return template.replace(/\{(\w+)\}/g, (match, key: string) =>
    Object.hasOwn(values, key) ? String(values[key]) : match,
  );
}
