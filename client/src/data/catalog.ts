export type ProductDoc = {
  slug: string;
  name: string;
  image: string;
  tagline: string;
  moq: string;
  sampleLead: string;
  bulkLead: string;
  fabric: string;
  construction: string[];
  decoration: string[];
  priceFrom: string;
};

export const PRODUCTS: ProductDoc[] = [
  { slug: "tshirts", name: "Heavyweight T-Shirts", image: "/images/generated/product-tshirt-hero.webp", tagline: "240–280 GSM combed cotton tees in boxy, classic, or oversized blocks.", moq: "50 pcs/style", sampleLead: "7 days", bulkLead: "15 days", fabric: "240–280 GSM combed/ringspun cotton, optional 100% organic", construction: ["Side-seamed or tubular", "Double-needle hems", "Twill neck tape", "Shoulder-to-shoulder taping"], decoration: ["Screen print", "DTF", "Puff print", "Embroidery", "Woven neck labels"], priceFrom: "$4.20" },
  { slug: "fleece", name: "Fleece Pullovers & Hoodies", image: "/images/generated/product-fleece-pullover-hero.webp", tagline: "380–480 GSM brushed-back fleece. Crew, zip, or hooded silhouettes.", moq: "50 pcs/style", sampleLead: "10 days", bulkLead: "18 days", fabric: "380–480 GSM brushed fleece, French terry, or heavyweight loopback", construction: ["Kangaroo pocket", "Flatlock or overlock", "Rib cuffs and hem", "Metal tipped drawcords"], decoration: ["Embroidery", "Puff print", "Screen", "DTF", "Applique"], priceFrom: "$11.80" },
  { slug: "denim-jackets", name: "Denim Jackets", image: "/images/generated/product-denim-jacket-hero.webp", tagline: "12–14 oz selvedge & non-selvedge denim. Trucker, Type II, custom blocks.", moq: "50 pcs/style", sampleLead: "14 days", bulkLead: "25 days", fabric: "12–14 oz selvedge or non-selvedge denim, optional raw or pre-washed", construction: ["Chain-stitch felled seams", "Custom rivets and buttons", "Chest pockets and flaps"], decoration: ["Stonewash", "Acid wash", "Enzyme wash", "Laser distress", "Embroidery"], priceFrom: "$24.50" },
  { slug: "denim-pants", name: "Denim Pants", image: "/images/generated/product-denim-pants-hero.webp", tagline: "11–14 oz denim pants. Straight, tapered, baggy, carpenter.", moq: "50 pcs/style", sampleLead: "14 days", bulkLead: "25 days", fabric: "11–14 oz denim, optional stretch blends", construction: ["5-pocket or carpenter", "Chain-stitch hems", "YKK zippers", "Custom hardware"], decoration: ["Wash house on-site", "Embroidery", "Leather patches"], priceFrom: "$18.90" },
  { slug: "trousers", name: "Trousers", image: "/images/generated/product-trousers-hero.webp", tagline: "Twill, ripstop, nylon, or poly-blend trousers in utility or tailored fits.", moq: "50 pcs/style", sampleLead: "10 days", bulkLead: "20 days", fabric: "8–12 oz twill, ripstop, nylon, or poly blend", construction: ["Cargo or plain front", "Reinforced knees optional", "YKK zippers"], decoration: ["Embroidery", "Screen print", "Reflective tape"], priceFrom: "$14.20" },
  { slug: "shorts", name: "Shorts", image: "/images/generated/product-shorts-hero.webp", tagline: "Knit, woven, mesh, or denim shorts. 5-inch to 9-inch inseams.", moq: "50 pcs/style", sampleLead: "7 days", bulkLead: "15 days", fabric: "Cotton twill, poly mesh, fleece, or denim", construction: ["Elastic or belted waist", "Drawcord options", "Side and back pockets"], decoration: ["Screen", "DTF", "Embroidery", "Heat transfer"], priceFrom: "$6.80" },
  { slug: "windbreakers", name: "Windbreakers", image: "/images/generated/product-windbreaker-hero.webp", tagline: "Nylon or poly shell windbreakers. Coach, anorak, track, half-zip.", moq: "50 pcs/style", sampleLead: "12 days", bulkLead: "22 days", fabric: "Nylon, poly taffeta, or ripstop shell with mesh or taffeta lining", construction: ["Snap or zip closure", "Drawcord hood optional", "Concealed pockets"], decoration: ["Screen", "Embroidery", "Heat transfer", "Reflective piping"], priceFrom: "$13.40" },
  { slug: "puffers", name: "Puffer Jackets", image: "/images/generated/product-puffer-jacket-hero.webp", tagline: "Down or synthetic fill puffers. Matte, glossy, or ripstop shells.", moq: "50 pcs/style", sampleLead: "15 days", bulkLead: "28 days", fabric: "Nylon, ripstop, or poly shells; 90/10 down or synthetic fill", construction: ["Box or channel quilting", "YKK zippers", "Rib or elastic cuffs"], decoration: ["Embroidery", "Leather patches", "Rubber badges"], priceFrom: "$32.60" },
  { slug: "vests", name: "Vests", image: "/images/generated/product-vests-hero.webp", tagline: "Puffer, fleece, denim, or utility vests for layering across any drop.", moq: "50 pcs/style", sampleLead: "10 days", bulkLead: "20 days", fabric: "Fleece, denim, poly shell with fill, or canvas", construction: ["Full zip or button", "Utility pockets optional"], decoration: ["Embroidery", "Screen", "Custom patches"], priceFrom: "$12.10" },
];

export type CityDoc = {
  slug: string;
  name: string;
  region: string;
  angle: string;
  localBrands: string[];
};

export const CITIES: CityDoc[] = [
  { slug: "atlanta", name: "Atlanta", region: "Georgia, USA", angle: "Atlanta is the heartbeat of Black-owned streetwear in the South. We partner with ATL founders to manufacture heavyweight tees, fleece, and denim at MOQ 50 — direct from Sialkot.", localBrands: ["Streetwear drops", "Music merch", "Boutique labels"] },
  { slug: "houston", name: "Houston", region: "Texas, USA", angle: "Houston's independent streetwear scene needs factories that move at culture speed. 7-day samples, 15-day bulk, private label ready.", localBrands: ["Hip-hop merch", "Independent boutiques", "Event apparel"] },
  { slug: "los-angeles", name: "Los Angeles", region: "California, USA", angle: "LA founders compete with the best. We match their standards with heavyweight tees, fleece, and denim — BSCI, OEKO-TEX, WRAP certified.", localBrands: ["West Coast streetwear", "Skate brands", "Celebrity merch"] },
  { slug: "new-york", name: "New York", region: "New York, USA", angle: "NYC moves fast. MOQ 50, 7-day samples, direct founder access — built for brands that ship drops monthly.", localBrands: ["Harlem-born labels", "Brooklyn boutiques", "Fashion-week merch"] },
  { slug: "chicago", name: "Chicago", region: "Illinois, USA", angle: "Chicago's South Side streetwear scene punches above its weight. We supply heavyweight fleece and denim for drops that sell out in hours.", localBrands: ["South Side labels", "Drill merch", "Independent denim"] },
  { slug: "detroit", name: "Detroit", region: "Michigan, USA", angle: "Detroit founders carry culture forward. Pak Homies manufactures their streetwear with direct factory access and certified ethical production.", localBrands: ["Motor City labels", "Hip-hop merch", "Heritage streetwear"] },
];
