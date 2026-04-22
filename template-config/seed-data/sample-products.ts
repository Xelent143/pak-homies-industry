/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * SAMPLE PRODUCT SEED DATA
 * ═══════════════════════════════════════════════════════════════════════════════
 * 
 * These products will be seeded into the database when setting up a new project.
 * Modify these to match your actual product offerings.
 * 
 * To apply: pnpm db:seed
 */

import { InsertProduct, InsertProductImage, InsertSlabPrice, InsertSizeChart } from "../../drizzle/schema";

// ═══════════════════════════════════════════════════════════════════════════════
// SAMPLE PRODUCTS
// ═══════════════════════════════════════════════════════════════════════════════

export const sampleProducts: InsertProduct[] = [
  {
    slug: "custom-ski-jacket",
    title: "Custom Ski Jacket - Waterproof 20K/20K",
    category: "Ski Wear",
    description: `Premium custom ski jacket manufacturing with 20,000mm waterproof and 20,000g/m² breathability ratings.

FEATURES:
• 3-layer waterproof membrane
• Fully taped seams
• Underarm ventilation zippers
• Helmet-compatible hood
• Powder skirt with gripper elastic
• Multiple zippered pockets
• Adjustable cuffs with thumbholes

CUSTOMIZATION OPTIONS:
• Custom colors and color blocking
• Logo embroidery or print placement
• Custom branded hardware
• Private label interior labeling
• Custom packaging available

MATERIALS:
• Outer: 100% Polyester with DWR finish
• Membrane: Waterproof/breathable TPU
• Lining: 100% Nylon mesh

MOQ: 50 pieces per color/design`,
    shortDescription: "Premium waterproof ski jacket with 20K/20K ratings. Custom colors, logos, and branding.",
    mainImage: "/images/products/ski-jacket-main.jpg",
    samplePrice: "89.00",
    weight: "0.850",
    availableSizes: JSON.stringify(["XS", "S", "M", "L", "XL", "XXL", "3XL"]),
    availableColors: JSON.stringify(["Black", "Navy", "Red", "Orange"]),
    material: "100% Polyester 3-Layer with TPU Membrane",
    manufacturingStory: "Produced in our Sialkot facility with European-quality standards. Each jacket undergoes 12 quality checkpoints including waterproof testing.",
    isFeatured: true,
    isActive: true,
    freeShipping: false,
    seoTitle: "Custom Ski Jacket Manufacturer | 20K Waterproof | Low MOQ 50pcs",
    seoDescription: "Premium custom ski jacket manufacturing in Pakistan. 20K/20K waterproof/breathable ratings. Custom colors, logos, and private label. MOQ from 50 pieces.",
    seoKeywords: "custom ski jacket, waterproof jacket manufacturer, ski wear supplier Pakistan, custom snow jacket",
    sortOrder: 1,
  },
  {
    slug: "sublimated-soccer-jersey",
    title: "Custom Sublimated Soccer Jersey",
    category: "Sports Wear",
    description: `Full-dye sublimation soccer jersey manufacturing with unlimited design possibilities.

FEATURES:
• Full-dye sublimation (colors never fade or crack)
• Moisture-wicking fabric
• Athletic fit with ergonomic panels
• Reinforced stitching at stress points
• V-neck or crew neck options

FABRIC OPTIONS:
• Standard: 150gsm Interlock polyester
• Pro: 180gsm Birdseye mesh
• Elite: 220gsm Performance knit with 4-way stretch

CUSTOMIZATION:
• Unlimited colors and designs
• Team logos, sponsor logos, numbers
• Player names with multiple font options
• Custom collar and sleeve styles
• Tagless neck labels

MOQ: 50 pieces per design`,
    shortDescription: "Full-dye sublimation soccer jerseys with unlimited design options. Premium fabrics, unlimited colors.",
    mainImage: "/images/products/soccer-jersey-main.jpg",
    samplePrice: "24.00",
    weight: "0.180",
    availableSizes: JSON.stringify(["YS", "YM", "YL", "YXL", "S", "M", "L", "XL", "XXL", "3XL"]),
    availableColors: JSON.stringify(["Custom - Unlimited"]),
    material: "150-220gsm Polyester (various options)",
    manufacturingStory: "Sublimation printing ensures colors penetrate the fabric for permanent, vibrant results that never crack, peel, or fade.",
    isFeatured: true,
    isActive: true,
    freeShipping: false,
    seoTitle: "Custom Soccer Jersey Manufacturer | Sublimation Printing | MOQ 50",
    seoDescription: "Custom soccer jersey manufacturing with full-dye sublimation. Unlimited colors, team logos, player names. Premium quality from Pakistan. MOQ 50 pieces.",
    seoKeywords: "custom soccer jersey, sublimated jersey manufacturer, team kit supplier, football shirt manufacturer",
    sortOrder: 2,
  },
  {
    slug: "premium-streetwear-hoodie",
    title: "Premium Streetwear Hoodie - 450GSM",
    category: "Streetwear",
    description: `Heavyweight streetwear hoodie manufacturing with premium construction and vintage wash options.

FEATURES:
• 450gsm heavyweight cotton fleece
• Oversized streetwear fit
• Double-lined hood
• Kangaroo pocket
• Ribbed cuffs and hem
• Flatlock seam construction
• Metal-tipped drawstrings

CUSTOMIZATION OPTIONS:
• Custom dyed fabrics
• Vintage/acid wash treatments
• Screen print, DTG, or embroidery
• Custom woven labels
• Hang tags and polybag packaging
• Custom drawstring colors

FABRIC OPTIONS:
• 100% Cotton 450gsm
• 80/20 Cotton/Polyester blend
• 100% Organic cotton available

SIZING:
Available in standard or oversized fits

MOQ: 50 pieces per color/treatment`,
    shortDescription: "450gsm heavyweight streetwear hoodies. Vintage wash options, premium construction, custom branding.",
    mainImage: "/images/products/hoodie-main.jpg",
    samplePrice: "42.00",
    weight: "0.950",
    availableSizes: JSON.stringify(["XS", "S", "M", "L", "XL", "XXL", "3XL"]),
    availableColors: JSON.stringify(["Black", "Heather Grey", "White", "Custom Dyed"]),
    material: "450gsm Cotton Fleece",
    manufacturingStory: "Cut and sewn in our Sialkot facility with triple-needle stitching for durability. Each piece is garment-washed for softness and minimal shrinkage.",
    isFeatured: true,
    isActive: true,
    freeShipping: false,
    seoTitle: "Custom Hoodie Manufacturer | 450GSM Heavyweight | Streetwear",
    seoDescription: "Premium 450gsm hoodie manufacturing for streetwear brands. Vintage wash options, custom dyes, private label. Low MOQ 50pcs from Pakistan.",
    seoKeywords: "custom hoodie manufacturer, heavyweight hoodie supplier, streetwear manufacturer Pakistan, vintage wash hoodie",
    sortOrder: 3,
  },
  {
    slug: "tactical-cargo-pants",
    title: "Tactical Cargo Pants - Ripstop Fabric",
    category: "Tech Wear",
    description: `Military-grade tactical cargo pants with reinforced construction and multiple utility pockets.

FEATURES:
• 8+ pocket configuration
• Reinforced knee and seat
• Articulated knees for mobility
• Adjustable waist tabs
• Drawstring ankle cuffs
• DWR (Durable Water Repellent) finish

FABRIC OPTIONS:
• 65/35 Poly/Cotton Ripstop 235gsm
• 100% Nylon 330D Cordura panels
• Teflon-treated for stain resistance

CONSTRUCTION:
• Triple-needle stitching at stress points
• Bartacked at all stress points
• YKK zippers throughout
• Duraflex hardware

CUSTOMIZATION:
• Custom camo patterns
• Logo embroidery or patches
• Custom pocket configurations
• Adjustable features placement

MOQ: 50 pieces per color/pattern`,
    shortDescription: "Military-grade tactical cargo pants with reinforced knees, 8+ pockets, and ripstop fabric.",
    mainImage: "/images/products/cargo-pants-main.jpg",
    samplePrice: "48.00",
    weight: "0.650",
    availableSizes: JSON.stringify(["28", "30", "32", "34", "36", "38", "40", "42"]),
    availableColors: JSON.stringify(["Black", "Coyote Tan", "OD Green", "Navy", "Ranger Green", "Custom Camo"]),
    material: "65/35 Poly/Cotton Ripstop 235gsm",
    manufacturingStory: "Built to military specifications with reinforced construction. Tested for durability in demanding conditions.",
    isFeatured: true,
    isActive: true,
    freeShipping: false,
    seoTitle: "Tactical Cargo Pants Manufacturer | Military-Grade | Custom Camo",
    seoDescription: "Tactical cargo pants manufacturing with ripstop fabric and reinforced construction. Custom camo patterns, low MOQ 50pcs from Pakistan.",
    seoKeywords: "tactical pants manufacturer, cargo pants supplier, military apparel Pakistan, custom camo pants",
    sortOrder: 4,
  },
  {
    slug: "bjj-gi-pearl-weave",
    title: "BJJ Gi - Pearl Weave - IBJJF Legal",
    category: "Martial Arts",
    description: `Premium Brazilian Jiu-Jitsu kimono manufacturing with IBJJF-compliant specifications.

GI SPECIFICATIONS:
• Pearl weave 450gsm jacket
• 10oz cotton ripstop pants
• IBJJF legal cut and measurements
• Reinforced stress points
• Eva foam collar
• Triple-stitched seams

JACKET FEATURES:
• Pearl weave fabric (lightweight, durable)
• Reinforced sleeve cuffs
• Thick lapel with EVA core
• Multiple loop drawstring system

PANTS FEATURES:
• 10oz ripstop cotton
• Reinforced knees
• Stretchy drawstring waist
• Rope drawstring with rubber tip

PATCH PLACEMENT:
• Pre-configured for standard BJJ patches
• Custom embroidery available

CUSTOMIZATION:
• Custom weave patterns (pearl, gold, crystal)
• Custom colors
• Embroidered logos
• Custom woven patches
• Gi bag included

MOQ: 50 pieces per color/design`,
    shortDescription: "IBJJF-legal BJJ gi with pearl weave jacket and ripstop pants. Premium construction, custom patches.",
    mainImage: "/images/products/bjj-gi-main.jpg",
    samplePrice: "65.00",
    weight: "1.800",
    availableSizes: JSON.stringify(["A0", "A1", "A1L", "A2", "A2L", "A3", "A3L", "A4", "A5"]),
    availableColors: JSON.stringify(["White", "Blue", "Black", "Custom"]),
    material: "450gsm Pearl Weave Jacket, 10oz Ripstop Pants",
    manufacturingStory: "Cut and sewn by experienced gi craftsmen in Sialkot. Pre-shrunk fabric and reinforced construction for competition durability.",
    isFeatured: true,
    isActive: true,
    freeShipping: false,
    seoTitle: "BJJ Gi Manufacturer | IBJJF Legal | Pearl Weave | MOQ 50",
    seoDescription: "Premium BJJ gi manufacturing with pearl weave and IBJJF-legal specifications. Custom patches, colors, and embroidery. MOQ 50 pieces from Pakistan.",
    seoKeywords: "BJJ gi manufacturer, kimono supplier, jiu jitsu uniform Pakistan, custom gi manufacturer",
    sortOrder: 5,
  },
  {
    slug: "security-duty-uniform",
    title: "Security Duty Uniform Set",
    category: "Security Uniforms",
    description: `Professional security uniform set including tactical shirt and duty pants.

UNIFORM SET INCLUDES:
• Tactical long-sleeve shirt
• Duty pants with cargo pockets
• Optional: Duty belt, cap, jacket

SHIRT FEATURES:
• 65/35 Poly/Cotton ripstop
• Hidden button-down collar
• Dual chest pockets with pen slots
• Shoulder epaulets
• Badge tab on chest
• Extended tail (stays tucked)

PANTS FEATURES:
• 65/35 Poly/Cotton ripstop
• 8-pocket design
• Expandable waistband
• Reinforced knees
• Professional crease

CUSTOMIZATION:
• Custom embroidery (company name, officer name)
• Badge and patch placement
• Custom color combinations
• Custom buttons and hardware
• Company logo on buttons

SIZING:
Men's and women's cuts available

MOQ: 50 sets (shirt + pants)`,
    shortDescription: "Professional security uniform set with tactical shirt and duty pants. Custom embroidery, badge placement.",
    mainImage: "/images/products/security-uniform-main.jpg",
    samplePrice: "75.00",
    weight: "1.200",
    availableSizes: JSON.stringify(["XS", "S", "M", "L", "XL", "XXL", "3XL", "4XL"]),
    availableColors: JSON.stringify(["Black", "Navy", "White", "Tan"]),
    material: "65/35 Poly/Cotton Ripstop",
    manufacturingStory: "Designed with input from security professionals for functionality and professional appearance.",
    isFeatured: true,
    isActive: true,
    freeShipping: false,
    seoTitle: "Security Uniform Manufacturer | Duty Uniform Sets | Custom Embroidery",
    seoDescription: "Professional security uniform manufacturing. Tactical shirts, duty pants, custom embroidery. Complete uniform sets from Pakistan. MOQ 50.",
    seoKeywords: "security uniform manufacturer, duty uniform supplier, tactical shirt manufacturer, security apparel Pakistan",
    sortOrder: 6,
  },
];

// ═══════════════════════════════════════════════════════════════════════════════
// SAMPLE PRODUCT IMAGES
// ═══════════════════════════════════════════════════════════════════════════════

export const sampleProductImages: Record<string, InsertProductImage[]> = {
  "custom-ski-jacket": [
    { imageUrl: "/images/products/ski-jacket-1.jpg", altText: "Custom ski jacket front view", sortOrder: 1 },
    { imageUrl: "/images/products/ski-jacket-2.jpg", altText: "Custom ski jacket back view", sortOrder: 2 },
    { imageUrl: "/images/products/ski-jacket-3.jpg", altText: "Custom ski jacket detail", sortOrder: 3 },
  ],
  "sublimated-soccer-jersey": [
    { imageUrl: "/images/products/soccer-jersey-1.jpg", altText: "Custom soccer jersey front", sortOrder: 1 },
    { imageUrl: "/images/products/soccer-jersey-2.jpg", altText: "Custom soccer jersey back", sortOrder: 2 },
  ],
  "premium-streetwear-hoodie": [
    { imageUrl: "/images/products/hoodie-1.jpg", altText: "Premium hoodie front", sortOrder: 1 },
    { imageUrl: "/images/products/hoodie-2.jpg", altText: "Premium hoodie detail", sortOrder: 2 },
  ],
  "tactical-cargo-pants": [
    { imageUrl: "/images/products/cargo-pants-1.jpg", altText: "Tactical cargo pants", sortOrder: 1 },
  ],
  "bjj-gi-pearl-weave": [
    { imageUrl: "/images/products/bjj-gi-1.jpg", altText: "BJJ Gi jacket", sortOrder: 1 },
    { imageUrl: "/images/products/bjj-gi-2.jpg", altText: "BJJ Gi pants", sortOrder: 2 },
  ],
  "security-duty-uniform": [
    { imageUrl: "/images/products/security-uniform-1.jpg", altText: "Security uniform set", sortOrder: 1 },
  ],
};

// ═══════════════════════════════════════════════════════════════════════════════
// SAMPLE SLAB PRICING (MOQ TIERS)
// ═══════════════════════════════════════════════════════════════════════════════

export const sampleSlabPrices: Record<string, InsertSlabPrice[]> = {
  "custom-ski-jacket": [
    { minQty: 50, maxQty: 99, pricePerUnit: "89.00", label: "Starter", sortOrder: 1 },
    { minQty: 100, maxQty: 249, pricePerUnit: "79.00", label: "Growth", sortOrder: 2 },
    { minQty: 250, maxQty: 499, pricePerUnit: "72.00", label: "Scale", sortOrder: 3 },
    { minQty: 500, maxQty: null, pricePerUnit: "65.00", label: "Enterprise", sortOrder: 4 },
  ],
  "sublimated-soccer-jersey": [
    { minQty: 50, maxQty: 99, pricePerUnit: "24.00", label: "Starter", sortOrder: 1 },
    { minQty: 100, maxQty: 249, pricePerUnit: "19.00", label: "Growth", sortOrder: 2 },
    { minQty: 250, maxQty: 499, pricePerUnit: "16.50", label: "Scale", sortOrder: 3 },
    { minQty: 500, maxQty: null, pricePerUnit: "14.00", label: "Enterprise", sortOrder: 4 },
  ],
  "premium-streetwear-hoodie": [
    { minQty: 50, maxQty: 99, pricePerUnit: "42.00", label: "Starter", sortOrder: 1 },
    { minQty: 100, maxQty: 249, pricePerUnit: "36.00", label: "Growth", sortOrder: 2 },
    { minQty: 250, maxQty: 499, pricePerUnit: "32.00", label: "Scale", sortOrder: 3 },
    { minQty: 500, maxQty: null, pricePerUnit: "28.00", label: "Enterprise", sortOrder: 4 },
  ],
  "tactical-cargo-pants": [
    { minQty: 50, maxQty: 99, pricePerUnit: "48.00", label: "Starter", sortOrder: 1 },
    { minQty: 100, maxQty: 249, pricePerUnit: "42.00", label: "Growth", sortOrder: 2 },
    { minQty: 250, maxQty: 499, pricePerUnit: "38.00", label: "Scale", sortOrder: 3 },
    { minQty: 500, maxQty: null, pricePerUnit: "34.00", label: "Enterprise", sortOrder: 4 },
  ],
  "bjj-gi-pearl-weave": [
    { minQty: 50, maxQty: 99, pricePerUnit: "65.00", label: "Starter", sortOrder: 1 },
    { minQty: 100, maxQty: 249, pricePerUnit: "58.00", label: "Growth", sortOrder: 2 },
    { minQty: 250, maxQty: 499, pricePerUnit: "52.00", label: "Scale", sortOrder: 3 },
    { minQty: 500, maxQty: null, pricePerUnit: "48.00", label: "Enterprise", sortOrder: 4 },
  ],
  "security-duty-uniform": [
    { minQty: 50, maxQty: 99, pricePerUnit: "75.00", label: "Starter", sortOrder: 1 },
    { minQty: 100, maxQty: 249, pricePerUnit: "68.00", label: "Growth", sortOrder: 2 },
    { minQty: 250, maxQty: 499, pricePerUnit: "62.00", label: "Scale", sortOrder: 3 },
    { minQty: 500, maxQty: null, pricePerUnit: "58.00", label: "Enterprise", sortOrder: 4 },
  ],
};

// ═══════════════════════════════════════════════════════════════════════════════
// SAMPLE SIZE CHARTS
// ═══════════════════════════════════════════════════════════════════════════════

export const sampleSizeCharts: Record<string, InsertSizeChart> = {
  "custom-ski-jacket": {
    chartData: JSON.stringify([
      { size: "XS", chest: "34-36", waist: "28-30", hip: "34-36", sleeve: "31" },
      { size: "S", chest: "36-38", waist: "30-32", hip: "36-38", sleeve: "32" },
      { size: "M", chest: "38-40", waist: "32-34", hip: "38-40", sleeve: "33" },
      { size: "L", chest: "40-42", waist: "34-36", hip: "40-42", sleeve: "34" },
      { size: "XL", chest: "42-44", waist: "36-38", hip: "42-44", sleeve: "35" },
      { size: "XXL", chest: "44-46", waist: "38-40", hip: "44-46", sleeve: "36" },
      { size: "3XL", chest: "46-48", waist: "40-42", hip: "46-48", sleeve: "37" },
    ]),
    unit: "inches",
    notes: "Measurements are body measurements in inches. For a relaxed fit, order your standard size. For layering room, size up.",
  },
  "sublimated-soccer-jersey": {
    chartData: JSON.stringify([
      { size: "YS", chest: "26-28", length: "22" },
      { size: "YM", chest: "28-30", length: "24" },
      { size: "YL", chest: "30-32", length: "26" },
      { size: "S", chest: "34-36", length: "28" },
      { size: "M", chest: "38-40", length: "29" },
      { size: "L", chest: "42-44", length: "30" },
      { size: "XL", chest: "46-48", length: "31" },
      { size: "XXL", chest: "50-52", length: "32" },
    ]),
    unit: "inches",
    notes: "Athletic fit. Measure chest circumference at widest point. For looser fit, size up.",
  },
  "premium-streetwear-hoodie": {
    chartData: JSON.stringify([
      { size: "XS", chest: "38", length: "26", sleeve: "24" },
      { size: "S", chest: "40", length: "27", sleeve: "25" },
      { size: "M", chest: "44", length: "28", sleeve: "26" },
      { size: "L", chest: "48", length: "29", sleeve: "27" },
      { size: "XL", chest: "52", length: "30", sleeve: "28" },
      { size: "XXL", chest: "56", length: "31", sleeve: "29" },
    ]),
    unit: "inches",
    notes: "Oversized fit. Garment measurements in inches. Pre-shrunk. Minimal shrinkage expected.",
  },
  "tactical-cargo-pants": {
    chartData: JSON.stringify([
      { size: "28", waist: "28", inseam: "30/32/34" },
      { size: "30", waist: "30", inseam: "30/32/34" },
      { size: "32", waist: "32", inseam: "30/32/34" },
      { size: "34", waist: "34", inseam: "30/32/34" },
      { size: "36", waist: "36", inseam: "30/32/34" },
      { size: "38", waist: "38", inseam: "30/32/34" },
      { size: "40", waist: "40", inseam: "30/32/34" },
      { size: "42", waist: "42", inseam: "30/32/34" },
    ]),
    unit: "inches",
    notes: "Waist measurements are body measurements. Expandable waistband adds 2 inches of comfort stretch.",
  },
  "bjj-gi-pearl-weave": {
    chartData: JSON.stringify([
      { size: "A0", height: "5'2-5'5", weight: "110-140 lbs" },
      { size: "A1", height: "5'5-5'8", weight: "140-170 lbs" },
      { size: "A1L", height: "5'8-5'11", weight: "140-170 lbs" },
      { size: "A2", height: "5'8-5'11", weight: "170-200 lbs" },
      { size: "A2L", height: "5'11-6'2", weight: "170-200 lbs" },
      { size: "A3", height: "5'11-6'2", weight: "200-230 lbs" },
      { size: "A3L", height: "6'2-6'4", weight: "200-230 lbs" },
      { size: "A4", height: "6'0-6'3", weight: "230-260 lbs" },
      { size: "A5", height: "6'2-6'5", weight: "260-290 lbs" },
    ]),
    unit: "inches",
    notes: "Pre-shrunk gi. Minimal shrinkage expected with cold wash and hang dry. Size up if between sizes or for competition fit.",
  },
  "security-duty-uniform": {
    chartData: JSON.stringify([
      { size: "XS", chest: "30-32", waist: "24-26" },
      { size: "S", chest: "34-36", waist: "28-30" },
      { size: "M", chest: "38-40", waist: "32-34" },
      { size: "L", chest: "42-44", waist: "36-38" },
      { size: "XL", chest: "46-48", waist: "40-42" },
      { size: "XXL", chest: "50-52", waist: "44-46" },
      { size: "3XL", chest: "54-56", waist: "48-50" },
      { size: "4XL", chest: "58-60", waist: "52-54" },
    ]),
    unit: "inches",
    notes: "Professional fit with room for duty belt. Order standard suit jacket size for shirt. Pants have expandable waistband.",
  },
};

export default {
  products: sampleProducts,
  images: sampleProductImages,
  slabPrices: sampleSlabPrices,
  sizeCharts: sampleSizeCharts,
};
