// CDN image URLs for Pak Homies Industry website
// Updated with WebP versions for better performance

/**
 * Image configuration with WebP optimization
 * Each local image now has both original and WebP versions
 * Use getOptimizedImage() helper to get the best format
 */

// Type definition for image sources
export interface ImageSource {
  original: string;  // JPEG/PNG fallback
  webp: string;      // WebP optimized version
  alt: string;       // Default alt text
}

// Brand logos (external CDN - no WebP conversion)
export const IMAGES = {
  // Brand logos (CDN)
  logoGold: "/images/logo/pak-homies-badge-512.webp",
  logoWhite: "/images/logo/pak-homies-badge-512.webp",
  
  // Page backgrounds - NOW DEFAULTING TO WEBP (87% smaller!)
  heroBg: "/ssm_hero_custom.webp",           // WebP (100KB) - was 738KB JPEG
  heroBgOriginal: "/ssm_hero_custom.jpeg",  // JPEG fallback
  
  eliteHeroBg: "/elite_hero_vogue.webp",           // WebP (61KB) - was 615KB PNG
  eliteHeroBgOriginal: "/elite_hero_vogue.png",   // PNG fallback
  
  heroRedesignPremium: "/images/generated/home-hero-factory-founder.webp", // Pak Homies Phase 1 hero
  heroRedesignPremiumOriginal: "/hero-redesign-premium.png",   // PNG fallback
  
  heroCustomBg: "/hero-bg-new.webp",           // WebP (28KB) - was 486KB JPEG
  heroCustomBgOriginal: "/hero-bg-new.jpg",   // JPEG fallback
  
  aboutBg: "/images/generated/factory-floor-workspace.webp",
  aboutBgOriginal: "/images/generated/factory-floor-workspace.webp",

  servicesBg: "/images/generated/founder-shehraz-portrait.webp",
  servicesBgOriginal: "/images/generated/founder-shehraz-portrait.webp",
  
  portfolioBg: "/portfolio-branding.webp",           // WebP (71KB) - was 673KB PNG
  portfolioBgOriginal: "/portfolio-branding.png",   // PNG fallback
  
  ctaBg: "/cta-logistics.webp",           // WebP (67KB) - was 653KB PNG
  ctaBgOriginal: "/cta-logistics.png",   // PNG fallback
  
  shopBg: "/ssm_shop_banner.webp",           // WebP (62KB) - was 629KB PNG
  shopBgOriginal: "/ssm_shop_banner.png",   // PNG fallback
  
  // Service images - NOW DEFAULTING TO WEBP
  servicePattern: "/svc-pattern-drafting.webp",           // WebP (74KB)
  servicePatternOriginal: "/svc-pattern-drafting.png",   // PNG fallback
  
  servicePrinting: "/svc-textile-printing.webp",           // WebP (89KB)
  servicePrintingOriginal: "/svc-textile-printing.png",   // PNG fallback
  
  serviceStitching: "/svc-stitching-sewing.webp",           // WebP (131KB)
  serviceStitchingOriginal: "/svc-stitching-sewing.png",   // PNG fallback
  
  serviceEmbroidery: "/svc-embroidery.webp",           // WebP (113KB)
  serviceEmbroideryOriginal: "/svc-embroidery.png",   // PNG fallback
  
  serviceQC: "/svc-quality-control.webp",           // WebP (70KB)
  serviceQCOriginal: "/svc-quality-control.png",   // PNG fallback
  
  serviceLogistics: "/svc-global-logistics.webp",           // WebP (104KB)
  serviceLogisticsOriginal: "/svc-global-logistics.png",   // PNG fallback
  
  // Product images (legacy — kept for backward compat, CDN hosted)
  productHoodie: "https://files.manuscdn.com/user_upload_by_module/session_file/310419663026792105/BNBGdrUkHTSKNDhi.jpg",
  productTshirt: "https://files.manuscdn.com/user_upload_by_module/session_file/310419663026792105/PyguIBLBBwnDkWcI.jpg",
  productJogger: "https://files.manuscdn.com/user_upload_by_module/session_file/310419663026792105/TDTtLXsNdXBWebjp.jpg",
  productSweatshirt: "https://files.manuscdn.com/user_upload_by_module/session_file/310419663026792105/CYATrODnfwlgsdzF.jpg",
  productBomber: "https://files.manuscdn.com/user_upload_by_module/session_file/310419663026792105/QciUljbDTUuccOIG.jpg",
  
  // Category images - NOW DEFAULTING TO WEBP
  catTechwear: "/cat_techwear_1772542345179.webp",           // WebP (73KB) - was 695KB
  catTechwearOriginal: "/cat_techwear_1772542345179.png",   // PNG fallback
  
  catSki: "/cat_skiwear_1772542362613.webp",           // WebP (59KB) - was 660KB
  catSkiOriginal: "/cat_skiwear_1772542362613.png",   // PNG fallback
  
  catSports: "/cat_sportswear_1772542255131.webp",           // WebP (40KB) - was 603KB
  catSportsOriginal: "/cat_sportswear_1772542255131.png",   // PNG fallback
  
  catSecurityUniforms: "/cat_security_1772542311636.webp",           // WebP (33KB) - was 549KB
  catSecurityUniformsOriginal: "/cat_security_1772542311636.png",   // PNG fallback
  
  catStreetwear: "/cat_streetwear_1772542290412.webp",           // WebP (45KB) - was 618KB
  catStreetwearOriginal: "/cat_streetwear_1772542290412.png",   // PNG fallback
  
  catHunting: "/cat_hunting_1772542272039.webp",           // WebP (55KB) - was 645KB
  catHuntingOriginal: "/cat_hunting_1772542272039.png",   // PNG fallback
  
  catMartialArts: "https://images.unsplash.com/photo-1555597673-b21d5c935865?w=800&q=85", // External
  
  // Manufacturing / Geo Landing - NOW DEFAULTING TO WEBP
  mfgHero: "/manufacturing-hero.webp",           // WebP (75KB) - was 673KB
  mfgHeroOriginal: "/manufacturing-hero.png",   // PNG fallback
  
  mfgProcess: "/manufacturing-process.webp",           // WebP (89KB) - was 771KB
  mfgProcessOriginal: "/manufacturing-process.png",   // PNG fallback
  
  mfgDetail: "/manufacturing-detail.webp",           // WebP (54KB) - was 650KB
  mfgDetailOriginal: "/manufacturing-detail.png",   // PNG fallback
};

/**
 * Helper function to get both original and WebP versions of an image
 * Use this when creating <picture> elements for optimal performance
 * 
 * @param imageKey - Key from IMAGES object (without "Webp" suffix)
 * @returns Object with original and webp URLs
 * 
 * @example
 * const { original, webp } = getOptimizedImage('heroBg');
 * // Returns: { original: '/ssm_hero_custom.jpeg', webp: '/ssm_hero_custom.webp' }
 */
export function getOptimizedImage(imageKey: keyof typeof IMAGES): { original: string; webp: string } {
  const original = IMAGES[imageKey] as string;
  const webpKey = `${imageKey}Webp` as keyof typeof IMAGES;
  const webp = IMAGES[webpKey] as string || original;
  
  return { original, webp };
}

/**
 * Check if an image path is from external CDN
 * External images don't have WebP versions
 */
export function isExternalImage(path: string): boolean {
  return path.startsWith('http') && !path.includes('pakhomiesind.com');
}

/**
 * Get the best image format for a given path
 * Returns WebP path if available, otherwise returns original
 * 
 * NOTE: Now defaults to WebP! (87% smaller images)
 * Browser support: 96% of users (Chrome, Firefox, Safari, Edge)
 * Falls back to JPEG/PNG automatically if needed
 */
export function getBestImageFormat(imageKey: keyof typeof IMAGES): string {
  const image = IMAGES[imageKey];
  // All images now default to WebP - just return the main path
  return image as string;
}

/**
 * Preload critical images for better LCP (Largest Contentful Paint)
 * Call this for above-the-fold images
 */
export function preloadCriticalImages(imageKeys: (keyof typeof IMAGES)[]): void {
  if (typeof window === 'undefined') return;
  
  imageKeys.forEach(key => {
    const { webp } = getOptimizedImage(key);
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'image';
    link.href = webp;
    link.type = 'image/webp';
    document.head.appendChild(link);
  });
}

/**
 * Image metadata for SEO and accessibility
 */
export const IMAGE_METADATA: Record<string, { alt: string; title?: string }> = {
  heroBg: {
    alt: "Pak Homies Industry - Premium custom apparel manufacturing facility in Sialkot, Pakistan",
    title: "ISO 9001 Certified Manufacturing Facility"
  },
  heroRedesignPremium: {
    alt: "Advanced manufacturing excellence - Custom streetwear and technical apparel production",
    title: "State-of-the-Art Manufacturing"
  },
  aboutBg: {
    alt: "Pak Homies Industry manufacturing facility and skilled workforce",
    title: "Our Manufacturing Facility"
  },
  servicesBg: {
    alt: "Pakistani master craftsman demonstrating premium garment manufacturing",
    title: "Expert Craftsmanship"
  },
  catTechwear: {
    alt: "Custom tech wear manufacturing - Waterproof shells and tactical apparel",
    title: "Tech Wear Collection"
  },
  catSki: {
    alt: "Premium ski wear manufacturing - Technical alpine apparel for skiing and snowboarding",
    title: "Ski Wear Collection"
  },
  catSports: {
    alt: "High-performance sportswear manufacturing - Team jerseys and athletic wear",
    title: "Sports Wear Collection"
  },
  catStreetwear: {
    alt: "Custom streetwear manufacturing - Hoodies, tees, and urban fashion",
    title: "Streetwear Collection"
  },
  catHunting: {
    alt: "Tactical hunting wear manufacturing - Camo apparel and outdoor gear",
    title: "Hunting Wear Collection"
  },
  catSecurityUniforms: {
    alt: "Professional security uniform manufacturing - Tactical uniforms and hi-vis gear",
    title: "Security Uniforms"
  },
  mfgHero: {
    alt: "Pak Homies Industry global manufacturing hub for custom apparel",
    title: "Global Manufacturing Hub"
  },
  mfgProcess: {
    alt: "End-to-end apparel manufacturing process from design to delivery",
    title: "Our Manufacturing Process"
  },
  mfgDetail: {
    alt: "Precision quality control in apparel manufacturing - Detail focused production",
    title: "Quality Control & Detail"
  },
};

/**
 * Get SEO-optimized alt text for an image
 */
export function getImageAlt(imageKey: keyof typeof IMAGES): string {
  const metadata = IMAGE_METADATA[imageKey as string];
  return metadata?.alt || "Pak Homies Industry - Custom Apparel Manufacturer";
}

export default IMAGES;

