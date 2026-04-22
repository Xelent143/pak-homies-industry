export interface SlabRow {
  qty: string;
  price: number;
  savings: string;
}

export interface SizeChartRow {
  size: string;
  chest: string;
  length: string;
  sleeve?: string;
  waist?: string;
}

export interface Product {
  // Identity
  slug: string;
  name: string;
  category: string;
  tagline: string; // = shortDescription
  description: string;
  // Media
  img: string; // mainImage
  gallery: string[]; // product images
  manufacturingInfographic: string;
  // Commercial
  basePrice: number;
  slabPricing: SlabRow[];
  freeShipping: boolean;
  // Construction
  fabric: string; // material
  weight: string;
  availableSizes: string[];
  availableColors: { name: string; hex: string }[];
  customizations: string[];
  sizeChart: SizeChartRow[];
  // Story
  manufacturingStory: string;
}

// Reasonable defaults applied across all SKUs
const defaultSizes = ["XS", "S", "M", "L", "XL", "XXL"];

const defaultColors: Product["availableColors"] = [
  { name: "Off-White", hex: "#F8F8F8" },
  { name: "Charcoal", hex: "#3A3A3A" },
  { name: "Jet Black", hex: "#1A1A1A" },
  { name: "Pak Blue", hex: "#3E41B6" },
  { name: "Stamp Red", hex: "#FE3136" },
  { name: "Sage", hex: "#7A8A6B" },
];

const defaultSizeChart: SizeChartRow[] = [
  { size: "XS", chest: '38"', length: '26"', sleeve: '23"', waist: '30"' },
  { size: "S", chest: '40"', length: '27"', sleeve: '24"', waist: '32"' },
  { size: "M", chest: '42"', length: '28"', sleeve: '24.5"', waist: '34"' },
  { size: "L", chest: '44"', length: '29"', sleeve: '25"', waist: '36"' },
  { size: "XL", chest: '46"', length: '30"', sleeve: '25.5"', waist: '38"' },
  { size: "XXL", chest: '48"', length: '31"', sleeve: '26"', waist: '40"' },
];

const defaultStory =
  "Cut, sewn, and finished on our own floor on Airport Road in Sialkot — the same team that holds BSCI, OEKO-TEX, and WRAP certifications. Every unit is inspected seam-by-seam before it leaves the floor. No subcontractors, no middlemen, no surprises.";

const defaultInfographic = "/images/generated/factory-floor-workspace.webp";

export const PRODUCTS: Product[] = [
  {
    slug: "denim-jackets",
    name: "Denim Jackets",
    category: "Outerwear",
    tagline: "Heavyweight Type-II silhouettes, custom washes, contrast stitching.",
    description:
      "Our signature Type-II denim jacket is built on 14.5oz raw selvedge indigo, finished with copper rivets, chain-stitched seams, and a boxy oversized cut. Designed to hold its shape through every wash — a canvas for your label.",
    img: "/images/generated/product-denim-jacket-hero.webp",
    gallery: [
      "/images/generated/product-denim-jacket-hero.webp",
      "/images/generated/product-denim-pants-hero.webp",
      "/images/generated/factory-floor-workspace.webp",
    ],
    manufacturingInfographic: defaultInfographic,
    basePrice: 18.5,
    slabPricing: [
      { qty: "50–99", price: 18.5, savings: "—" },
      { qty: "100–199", price: 16.0, savings: "13%" },
      { qty: "200–499", price: 14.5, savings: "22%" },
      { qty: "500+", price: 12.5, savings: "32%" },
    ],
    freeShipping: true,
    fabric: "12–14oz selvedge denim",
    weight: "12oz / 14oz",
    availableSizes: defaultSizes,
    availableColors: [
      { name: "Raw Indigo", hex: "#1C2C4A" },
      { name: "Mid Wash", hex: "#5A7AA3" },
      { name: "Dark Wash", hex: "#2C3E55" },
      { name: "Black Wash", hex: "#1A1A1A" },
      { name: "Acid", hex: "#AFBCCC" },
    ],
    customizations: [
      "Wash (raw, mid, dark, acid)",
      "Stitch color & weight",
      "Hardware (rivets, buttons)",
      "Custom labels",
      "Embroidery & patches",
    ],
    sizeChart: defaultSizeChart,
    manufacturingStory: defaultStory,
  },
  {
    slug: "fleece-pullovers",
    name: "Fleece Pullovers",
    category: "Tops",
    tagline: "450gsm heavyweight fleece with brushed interior.",
    description:
      "Heavyweight 450gsm loopback fleece with a brushed interior for warmth and drape. Boxy cut, thick rib at the hem and cuffs, reinforced kangaroo pocket. Available as hoodie, half-zip, or crewneck.",
    img: "/images/generated/product-fleece-pullover-hero.webp",
    gallery: ["/images/generated/product-fleece-pullover-hero.webp", "/images/generated/factory-floor-workspace.webp"],
    manufacturingInfographic: defaultInfographic,
    basePrice: 16.0,
    slabPricing: [
      { qty: "50–99", price: 16.0, savings: "—" },
      { qty: "100–199", price: 14.0, savings: "12%" },
      { qty: "200–499", price: 12.5, savings: "22%" },
      { qty: "500+", price: 11.0, savings: "31%" },
    ],
    freeShipping: true,
    fabric: "450gsm cotton/poly fleece",
    weight: "450gsm",
    availableSizes: defaultSizes,
    availableColors: defaultColors,
    customizations: ["Hood, half-zip or crewneck", "Drawcord material", "Custom rib", "Puff print, embroidery, patches"],
    sizeChart: defaultSizeChart,
    manufacturingStory: defaultStory,
  },
  {
    slug: "trousers",
    name: "Trousers",
    category: "Bottoms",
    tagline: "Cargo, pleated, work and wide-leg silhouettes.",
    description:
      "Workwear-grade trousers built from twill, ripstop, or canvas. Reinforced stress points, double-needle stitching, and deep pockets. Available in slim, relaxed, or wide-leg cuts.",
    img: "/images/generated/product-trousers-hero.webp",
    gallery: ["/images/generated/product-trousers-hero.webp", "/images/generated/factory-floor-workspace.webp"],
    manufacturingInfographic: defaultInfographic,
    basePrice: 14.5,
    slabPricing: [
      { qty: "50–99", price: 14.5, savings: "—" },
      { qty: "100–199", price: 12.5, savings: "13%" },
      { qty: "200–499", price: 11.0, savings: "24%" },
      { qty: "500+", price: 9.5, savings: "34%" },
    ],
    freeShipping: true,
    fabric: "Twill, ripstop, canvas",
    weight: "10oz / 12oz",
    availableSizes: defaultSizes,
    availableColors: defaultColors,
    customizations: ["Cut (slim, relaxed, wide)", "Pocket placement", "Hardware", "Custom waistband"],
    sizeChart: defaultSizeChart,
    manufacturingStory: defaultStory,
  },
  {
    slug: "shorts",
    name: "Shorts",
    category: "Bottoms",
    tagline: "Mesh, fleece, denim and cargo shorts.",
    description:
      "Street-ready shorts in mesh, fleece, denim or cargo. Choose inseam, pocket style, and waistband treatment. Reinforced side seams and bar-tacked stress points.",
    img: "/images/generated/product-shorts-hero.webp",
    gallery: ["/images/generated/product-shorts-hero.webp"],
    manufacturingInfographic: defaultInfographic,
    basePrice: 9.0,
    slabPricing: [
      { qty: "50–99", price: 9.0, savings: "—" },
      { qty: "100–199", price: 7.5, savings: "16%" },
      { qty: "200–499", price: 6.5, savings: "27%" },
      { qty: "500+", price: 5.5, savings: "38%" },
    ],
    freeShipping: true,
    fabric: "Cotton, polyester, fleece",
    weight: "180–280gsm",
    availableSizes: defaultSizes,
    availableColors: defaultColors,
    customizations: ['Length (5", 7", 9")', "Pocket style", "Drawcord", "Print/embroidery"],
    sizeChart: defaultSizeChart,
    manufacturingStory: defaultStory,
  },
  {
    slug: "t-shirts",
    name: "T-Shirts",
    category: "Tops",
    tagline: "Heavyweight 240–280gsm cotton, boxy and oversized fits.",
    description:
      "Heavyweight supima cotton t-shirts, 240–280gsm, with a boxy or oversized silhouette and ribbed collar. Pre-shrunk and garment-dyed for deep color retention.",
    img: "/images/generated/product-tshirt-hero.webp",
    gallery: ["/images/generated/product-tshirt-hero.webp"],
    manufacturingInfographic: defaultInfographic,
    basePrice: 7.5,
    slabPricing: [
      { qty: "50–99", price: 7.5, savings: "—" },
      { qty: "100–199", price: 6.25, savings: "16%" },
      { qty: "200–499", price: 5.5, savings: "26%" },
      { qty: "500+", price: 4.75, savings: "36%" },
    ],
    freeShipping: true,
    fabric: "240–280gsm cotton",
    weight: "240gsm / 260gsm / 280gsm",
    availableSizes: defaultSizes,
    availableColors: defaultColors,
    customizations: ["Cut (boxy, oversized, fitted)", "Garment dye", "DTG, screen, puff print", "Custom labels"],
    sizeChart: defaultSizeChart,
    manufacturingStory: defaultStory,
  },
  {
    slug: "windbreakers",
    name: "Windbreakers",
    category: "Outerwear",
    tagline: "Lightweight nylon shells, half-zip pullovers, full anoraks.",
    description:
      "Technical nylon shells with taped seams, zippered pockets, and storm flaps. Available as half-zip pullovers, full-zip jackets, or anorak silhouettes.",
    img: "/images/generated/product-windbreaker-hero.webp",
    gallery: ["/images/generated/product-windbreaker-hero.webp"],
    manufacturingInfographic: defaultInfographic,
    basePrice: 17.0,
    slabPricing: [
      { qty: "50–99", price: 17.0, savings: "—" },
      { qty: "100–199", price: 14.5, savings: "14%" },
      { qty: "200–499", price: 13.0, savings: "23%" },
      { qty: "500+", price: 11.5, savings: "32%" },
    ],
    freeShipping: true,
    fabric: "Nylon ripstop, taslan",
    weight: "70–110gsm",
    availableSizes: defaultSizes,
    availableColors: defaultColors,
    customizations: ["Zipper style", "Reflective taping", "Custom lining", "Logo printing"],
    sizeChart: defaultSizeChart,
    manufacturingStory: defaultStory,
  },
  {
    slug: "denim-pants",
    name: "Denim Pants",
    category: "Bottoms",
    tagline: "Selvedge denim jeans in straight, slim and baggy fits.",
    description:
      "Raw selvedge denim jeans with chain-stitched hems, hidden rivets, and custom hardware. Choose from straight, slim, relaxed, or baggy fit — each with its own pattern block.",
    img: "/images/generated/product-denim-pants-hero.webp",
    gallery: ["/images/generated/product-denim-pants-hero.webp"],
    manufacturingInfographic: defaultInfographic,
    basePrice: 16.5,
    slabPricing: [
      { qty: "50–99", price: 16.5, savings: "—" },
      { qty: "100–199", price: 14.5, savings: "12%" },
      { qty: "200–499", price: 13.0, savings: "21%" },
      { qty: "500+", price: 11.5, savings: "30%" },
    ],
    freeShipping: true,
    fabric: "12–14oz selvedge denim",
    weight: "12oz / 14oz",
    availableSizes: defaultSizes,
    availableColors: defaultColors,
    customizations: ["Wash", "Hardware", "Pocket detailing", "Custom rivets"],
    sizeChart: defaultSizeChart,
    manufacturingStory: defaultStory,
  },
  {
    slug: "puffer-jackets",
    name: "Puffer Jackets",
    category: "Outerwear",
    tagline: "Down-alternative insulated puffers and bombers.",
    description:
      "Heavyweight quilted puffers with recycled down-alternative fill (300–400). Horizontal baffle channels, oversized boxy fit, YKK zippers, and optional hood or high collar.",
    img: "/images/generated/product-puffer-jacket-hero.webp",
    gallery: ["/images/generated/product-puffer-jacket-hero.webp"],
    manufacturingInfographic: defaultInfographic,
    basePrice: 24.0,
    slabPricing: [
      { qty: "50–99", price: 24.0, savings: "—" },
      { qty: "100–199", price: 21.0, savings: "12%" },
      { qty: "200–499", price: 19.0, savings: "21%" },
      { qty: "500+", price: 17.0, savings: "29%" },
    ],
    freeShipping: true,
    fabric: "Nylon shell + recycled fill",
    weight: "300–400 fill",
    availableSizes: defaultSizes,
    availableColors: defaultColors,
    customizations: ["Length (cropped, regular, long)", "Hood / collar", "Color blocking", "Embroidery, screen print"],
    sizeChart: defaultSizeChart,
    manufacturingStory: defaultStory,
  },
  {
    slug: "vests",
    name: "Vests",
    category: "Outerwear",
    tagline: "Utility, puffer and tactical vests.",
    description:
      "Utility, tactical, and puffer vests with multi-pocket configurations and heavyweight hardware. Canvas, nylon or fleece shells — insulation and lining optional.",
    img: "/images/generated/product-vests-hero.webp",
    gallery: ["/images/generated/product-vests-hero.webp"],
    manufacturingInfographic: defaultInfographic,
    basePrice: 13.0,
    slabPricing: [
      { qty: "50–99", price: 13.0, savings: "—" },
      { qty: "100–199", price: 11.0, savings: "15%" },
      { qty: "200–499", price: 10.0, savings: "23%" },
      { qty: "500+", price: 8.5, savings: "35%" },
    ],
    freeShipping: true,
    fabric: "Canvas, nylon, fleece",
    weight: "Variable",
    availableSizes: defaultSizes,
    availableColors: defaultColors,
    customizations: ["Pocket count & style", "Hardware", "Insulation", "Lining"],
    sizeChart: defaultSizeChart,
    manufacturingStory: defaultStory,
  },
];

export const getProduct = (slug: string) => PRODUCTS.find((p) => p.slug === slug);
