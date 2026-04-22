/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * BRAND CONFIGURATION - CUSTOMIZE THIS FOR YOUR NEW PROJECT
 * ═══════════════════════════════════════════════════════════════════════════════
 * 
 * This is the main configuration file for your new apparel manufacturing website.
 * Change these values to customize the site for your brand.
 * 
 * After making changes, run: pnpm apply-template
 */

export const BRAND_CONFIG = {
  // ═════════════════════════════════════════════════════════════════════════════
  // SITE IDENTITY
  // ═════════════════════════════════════════════════════════════════════════════
  
  /** Your company/brand name - appears in header, footer, emails */
  siteName: "Pak Homies Industry",

  /** Short tagline for SEO and hero sections */
  tagline: "B2B Apparel Manufacturing for Black-Owned Brands",

  /** Full legal company name */
  legalName: "Pak Homies Industry",

  /** Company registration number (optional) */
  registrationNumber: "",

  /** Year company was established (for "Since XXXX" displays) */
  establishedYear: 2009,

  /** Site URL (without trailing slash) */
  siteUrl: "https://pakhomiesind.com",

  /** Support email address */
  supportEmail: "Pakhomiesi@gmail.com",

  /** Sales/inquiries email */
  salesEmail: "Pakhomiesi@gmail.com",

  /** Primary contact phone (with country code) */
  phone: "+92-54-4211081",

  /** WhatsApp number (if different from phone) */
  whatsappNumber: "+92-54-4211081",

  // ═════════════════════════════════════════════════════════════════════════════
  // BUSINESS DETAILS
  // ═════════════════════════════════════════════════════════════════════════════

  /** Primary business location city/country */
  location: "Sialkot, Pakistan",

  /** Full address (multi-line supported with \n) */
  fullAddress: "Airport Road, Gansarpur\nSialkot, Punjab 51310\nPakistan",
  
  /** Primary export markets (for GEO targeting) */
  targetMarkets: ["USA", "UK", "Canada", "Australia", "EU"],
  
  /** Industries you serve */
  industries: [
    "Fashion Brands",
    "Corporate Uniforms", 
    "Sports Teams",
    "Tactical/Security",
    "Streetwear Labels",
    "Outdoor/Apparel"
  ],
  
  // ═════════════════════════════════════════════════════════════════════════════
  // SOCIAL MEDIA & EXTERNAL LINKS
  // ═════════════════════════════════════════════════════════════════════════════
  
  social: {
    instagram: "https://instagram.com/yourbrand",
    facebook: "https://facebook.com/yourbrand",
    linkedin: "https://linkedin.com/company/yourbrand",
    twitter: "",
    youtube: "",
    tiktok: "",
  },
  
  /** External portfolio/catalog links */
  externalLinks: {
    alibaba: "",
    madeInChina: "",
    globalsources: "",
  },
  
  // ═════════════════════════════════════════════════════════════════════════════
  // CERTIFICATIONS & CREDENTIALS
  // ═════════════════════════════════════════════════════════════════════════════
  
  certifications: [
    { name: "ISO 9001", icon: "shield" },
    { name: "BSCI Compliant", icon: "users" },
    { name: "OEKO-TEX", icon: "leaf" },
    // Add more: "GOTS", "GRS", "WRAP", etc.
  ],
  
  // ═════════════════════════════════════════════════════════════════════════════
  // DEFAULT SEO METADATA
  // ═════════════════════════════════════════════════════════════════════════════
  
  seo: {
    /** Default page title template: {pageTitle} | {siteName} */
    titleTemplate: "{pageTitle} | Pak Homies Industry",
    
    /** Default meta description */
    defaultDescription: "Premium custom apparel manufacturing from Pakistan. Low MOQ 50pcs. B2B export quality sportswear, streetwear, tactical gear, and uniforms.",
    
    /** Default keywords */
    defaultKeywords: "custom apparel manufacturer, clothing manufacturer Pakistan, private label manufacturing, low MOQ clothing, B2B apparel supplier",
    
    /** Open Graph default image (1200x630 recommended) */
    ogImage: "/images/og-default.jpg",
    
    /** Twitter handle */
    twitterHandle: "@yourbrand",
  },
  
  // ═════════════════════════════════════════════════════════════════════════════
  // HOME PAGE HERO CONTENT
  // ═════════════════════════════════════════════════════════════════════════════
  
  hero: {
    headline: "Premium Apparel Manufacturing",
    subheadline: "From Concept to Production. Your Trusted Partner for Custom Sportswear, Streetwear & Tactical Gear.",
    ctaPrimary: { text: "Request Quote", link: "/rfq" },
    ctaSecondary: { text: "View Products", link: "/shop" },
  },
  
  // ═════════════════════════════════════════════════════════════════════════════
  // COMPANY STATS (for homepage and about page)
  // ═════════════════════════════════════════════════════════════════════════════
  
  stats: [
    { value: 15, suffix: "+", label: "Years of Excellence" },
    { value: 500, suffix: "+", label: "Global Brands Served" },
    { value: 40, suffix: "+", label: "Countries Exported To" },
    { value: 50, suffix: "K+", label: "Units Produced Monthly" },
  ],
  
  // ═════════════════════════════════════════════════════════════════════════════
  // FEATURES/SERVICES (for homepage bento grid)
  // ═════════════════════════════════════════════════════════════════════════════
  
  features: [
    {
      title: "Eco-Friendly Production",
      description: "80% of our energy comes from renewable solar power. We incorporate eco-friendly fabrics and sustainable practices into every run.",
      icon: "sun",
    },
    {
      title: "Comprehensive Facilities", 
      description: "In-house pattern drafting, sublimation, screen printing, embroidery, DTF, DTG, and modern sewing lines with 50+ machines.",
      icon: "factory",
    },
    {
      title: "ISO-Grade Assurance",
      description: "Zero-defect delivery guarantee. Strict QC processes ensuring top quality across sportswear, streetwear, and tactical gear.",
      icon: "shield-check",
    },
  ],
  
  // ═════════════════════════════════════════════════════════════════════════════
  // TESTIMONIALS
  // ═════════════════════════════════════════════════════════════════════════════
  
  testimonials: [
    {
      name: "Marcus Johnson",
      title: "Founder, UrbanThread Co.",
      country: "🇺🇸",
      countryName: "USA",
      rating: 5,
      text: "Our manufacturing partner for 3 years. The quality is consistently exceptional, and their team is incredibly responsive. They've helped us scale from 500 to 10,000 units per month.",
    },
    {
      name: "Sophie Laurent",
      title: "Creative Director, Rue Noire",
      country: "🇫🇷", 
      countryName: "France",
      rating: 5,
      text: "We've worked with manufacturers across Asia, but this team stands apart. Their attention to detail, premium fabric sourcing, and on-time delivery make them our exclusive partner.",
    },
    {
      name: "James Chen",
      title: "CEO, Pacific Street",
      country: "🇦🇺",
      countryName: "Australia", 
      rating: 5,
      text: "The private label service is world-class. From custom woven labels to branded packaging, every detail was perfect. Our customers can't believe the quality.",
    },
  ],
  
  // ═════════════════════════════════════════════════════════════════════════════
  // MOQ & PRICING DEFAULTS
  // ═════════════════════════════════════════════════════════════════════════════
  
  pricing: {
    /** Default minimum order quantity display */
    defaultMOQ: 50,
    
    /** Sample lead time in days */
    sampleLeadTime: 7,
    
    /** Production lead time in days */
    productionLeadTime: 21,
    
    /** Currency for display */
    displayCurrency: "USD",
  },
  
  // ═════════════════════════════════════════════════════════════════════════════
  // SHIPPING DEFAULTS
  // ═════════════════════════════════════════════════════════════════════════════
  
  shipping: {
    /** Default shipping from location */
    shipsFrom: "Sialkot, Pakistan",
    
    /** Default shipping methods offered */
    methods: ["DHL", "FedEx", "Air Freight", "Sea Freight"],
    
    /** Free shipping threshold (null if none) */
    freeShippingThreshold: null,
  },
  
} as const;

// Type export for TypeScript support
export type BrandConfig = typeof BRAND_CONFIG;

