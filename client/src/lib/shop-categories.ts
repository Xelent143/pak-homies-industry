// Shop Category Structure with hierarchical navigation
// AUTO-GENERATED from template-config/categories.config.ts
// Run 'pnpm apply-template' to regenerate after editing

export interface SubCategory {
  id: string;
  name: string;
  slug: string;
  description?: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  icon?: string;
  subCategories: SubCategory[];
}

export const SHOP_CATEGORIES: Category[] = [
  {
    "id": "denim-jackets",
    "name": "Denim Jackets",
    "slug": "denim-jackets",
    "description": "Custom heavyweight denim jackets for streetwear brands. Oversized fit, vintage washes, custom hardware, embroidered labels.",
    "icon": "👕",
    "showInNav": true,
    "sortOrder": 1,
    "seo": {
      "title": "Custom Denim Jackets Manufacturer | Streetwear OEM | Pak Homies",
      "description": "Heavyweight denim jacket manufacturing from Sialkot. Custom washes, hardware, embroidered labels. MOQ 50 units. 7-day samples, 15-day bulk. BSCI certified.",
      "keywords": "custom denim jacket manufacturer, streetwear jacket supplier, oversized denim jacket, vintage wash denim, custom denim wholesale"
    },
    "subCategories": []
  },
  {
    "id": "fleece-pullovers",
    "name": "Fleece Pullovers",
    "slug": "fleece-pullovers",
    "description": "Premium fleece pullovers with custom dyeing, screenprinting, embroidery. Warm, lightweight, streetwear-ready.",
    "icon": "🧥",
    "showInNav": true,
    "sortOrder": 2,
    "seo": {
      "title": "Custom Fleece Pullover Manufacturer | Wholesale | Pak Homies",
      "description": "Premium fleece pullover manufacturing. Custom colors, embroidery, screenprinting. MOQ 50 units. Quick sampling and production.",
      "keywords": "fleece pullover manufacturer, custom sweatshirt supplier, streetwear pullover, wholesale fleece"
    },
    "subCategories": []
  },
  {
    "id": "trousers",
    "name": "Trousers",
    "slug": "trousers",
    "description": "Custom tailored trousers: cargo, chino, dressy styles. Precise fit, custom details, premium fabrics.",
    "icon": "👖",
    "showInNav": true,
    "sortOrder": 3,
    "seo": {
      "title": "Custom Trousers Manufacturer | Cargo Pants & Chinos | Pak Homies",
      "description": "Custom trouser manufacturing. Cargo pants, chinos, dress trousers. Perfect fit sampling, bulk production. MOQ 50.",
      "keywords": "custom trousers manufacturer, cargo pants supplier, chino pants wholesale, trouser manufacturing Pakistan"
    },
    "subCategories": []
  },
  {
    "id": "shorts",
    "name": "Shorts",
    "slug": "shorts",
    "description": "Custom shorts: athletic, cargo, chino, swim. Lightweight, durable, perfect for street and performance.",
    "icon": "🩳",
    "showInNav": true,
    "sortOrder": 4,
    "seo": {
      "title": "Custom Shorts Manufacturer | Wholesale | Pak Homies",
      "description": "Custom shorts manufacturing: athletic, cargo, swim. Premium fabrics, custom finishes. MOQ 50 units.",
      "keywords": "shorts manufacturer, cargo shorts supplier, athletic shorts wholesale, custom shorts Pakistan"
    },
    "subCategories": []
  },
  {
    "id": "t-shirts",
    "name": "T-Shirts",
    "slug": "t-shirts",
    "description": "Premium cotton and blended t-shirts. Heavyweight, perfect print surface, custom tags, fast color options.",
    "icon": "👚",
    "showInNav": true,
    "sortOrder": 5,
    "seo": {
      "title": "Custom T-Shirt Manufacturer | Premium Cotton | Pak Homies",
      "description": "Premium cotton t-shirt manufacturing. Heavyweight fabric, perfect for screenprinting and embroidery. MOQ 50. OEKO-TEX certified.",
      "keywords": "custom t-shirt manufacturer, premium cotton tee supplier, wholesale t-shirts, t-shirt manufacturing Pakistan"
    },
    "subCategories": []
  },
  {
    "id": "windbreakers",
    "name": "Windbreakers",
    "slug": "windbreakers",
    "description": "Lightweight windbreakers with water-resistant fabrics. Packable, custom colors, embroidery-ready.",
    "icon": "🧥",
    "showInNav": true,
    "sortOrder": 6,
    "seo": {
      "title": "Custom Windbreaker Manufacturer | Water-Resistant | Pak Homies",
      "description": "Custom windbreaker manufacturing. Water-resistant fabrics, lightweight, packable. MOQ 50.",
      "keywords": "windbreaker manufacturer, water-resistant jacket supplier, custom windbreaker wholesale"
    },
    "subCategories": []
  },
  {
    "id": "denim-pants",
    "name": "Denim Pants",
    "slug": "denim-pants",
    "description": "Custom denim pants: slim, straight, wide leg. Vintage washes, custom hardware, perfect fit.",
    "icon": "👖",
    "showInNav": true,
    "sortOrder": 7,
    "seo": {
      "title": "Custom Denim Pants Manufacturer | Vintage Wash | Pak Homies",
      "description": "Heavyweight denim pants manufacturing. Custom washes, fits, hardware. MOQ 50 units.",
      "keywords": "denim pants manufacturer, custom jeans supplier, vintage denim wholesale, denim manufacturer Pakistan"
    },
    "subCategories": []
  },
  {
    "id": "puffer-jackets",
    "name": "Puffer Jackets",
    "slug": "puffer-jackets",
    "description": "Insulated puffer jackets: cropped, oversized, long. Custom colors, embroidery, weather-resistant.",
    "icon": "🧥",
    "showInNav": true,
    "sortOrder": 8,
    "seo": {
      "title": "Custom Puffer Jacket Manufacturer | Insulated | Pak Homies",
      "description": "Premium puffer jacket manufacturing. Insulated, weather-resistant, custom styles. MOQ 50.",
      "keywords": "puffer jacket manufacturer, insulated jacket supplier, custom puffer wholesale"
    },
    "subCategories": []
  },
  {
    "id": "vests",
    "name": "Vests",
    "slug": "vests",
    "description": "Custom vests: insulated, quilted, technical. Lightweight layers for streetwear and performance.",
    "icon": "🦺",
    "showInNav": true,
    "sortOrder": 9,
    "seo": {
      "title": "Custom Vests Manufacturer | Insulated & Technical | Pak Homies",
      "description": "Custom vest manufacturing: insulated, quilted, technical. Lightweight, customizable. MOQ 50.",
      "keywords": "vest manufacturer, custom vest supplier, insulated vest wholesale, technical vest manufacturing"
    },
    "subCategories": []
  }
];

// Helper function to get category by slug
export function getCategoryBySlug(slug: string): Category | undefined {
  return SHOP_CATEGORIES.find((cat) => cat.slug === slug);
}

// Helper function to get subcategory by slug
export function getSubCategoryBySlug(categorySlug: string, subCategorySlug: string): SubCategory | undefined {
  const category = getCategoryBySlug(categorySlug);
  return category?.subCategories.find((sub) => sub.slug === subCategorySlug);
}

// Get all subcategories flattened (for search/filtering)
export function getAllSubCategories(): (SubCategory & { categoryId: string; categoryName: string })[] {
  return SHOP_CATEGORIES.flatMap((cat) =>
    cat.subCategories.map((sub) => ({
      ...sub,
      categoryId: cat.id,
      categoryName: cat.name,
    }))
  );
}

// SEO-friendly category descriptions
export const CATEGORY_SEO_CONTENT: Record<string, { title: string; description: string; keywords: string }> = {
  "denim-jackets": {
    "title": "Custom Denim Jackets Manufacturer | Streetwear OEM | Pak Homies",
    "description": "Heavyweight denim jacket manufacturing from Sialkot. Custom washes, hardware, embroidered labels. MOQ 50 units. 7-day samples, 15-day bulk. BSCI certified.",
    "keywords": "custom denim jacket manufacturer, streetwear jacket supplier, oversized denim jacket, vintage wash denim, custom denim wholesale"
  },
  "fleece-pullovers": {
    "title": "Custom Fleece Pullover Manufacturer | Wholesale | Pak Homies",
    "description": "Premium fleece pullover manufacturing. Custom colors, embroidery, screenprinting. MOQ 50 units. Quick sampling and production.",
    "keywords": "fleece pullover manufacturer, custom sweatshirt supplier, streetwear pullover, wholesale fleece"
  },
  "trousers": {
    "title": "Custom Trousers Manufacturer | Cargo Pants & Chinos | Pak Homies",
    "description": "Custom trouser manufacturing. Cargo pants, chinos, dress trousers. Perfect fit sampling, bulk production. MOQ 50.",
    "keywords": "custom trousers manufacturer, cargo pants supplier, chino pants wholesale, trouser manufacturing Pakistan"
  },
  "shorts": {
    "title": "Custom Shorts Manufacturer | Wholesale | Pak Homies",
    "description": "Custom shorts manufacturing: athletic, cargo, swim. Premium fabrics, custom finishes. MOQ 50 units.",
    "keywords": "shorts manufacturer, cargo shorts supplier, athletic shorts wholesale, custom shorts Pakistan"
  },
  "t-shirts": {
    "title": "Custom T-Shirt Manufacturer | Premium Cotton | Pak Homies",
    "description": "Premium cotton t-shirt manufacturing. Heavyweight fabric, perfect for screenprinting and embroidery. MOQ 50. OEKO-TEX certified.",
    "keywords": "custom t-shirt manufacturer, premium cotton tee supplier, wholesale t-shirts, t-shirt manufacturing Pakistan"
  },
  "windbreakers": {
    "title": "Custom Windbreaker Manufacturer | Water-Resistant | Pak Homies",
    "description": "Custom windbreaker manufacturing. Water-resistant fabrics, lightweight, packable. MOQ 50.",
    "keywords": "windbreaker manufacturer, water-resistant jacket supplier, custom windbreaker wholesale"
  },
  "denim-pants": {
    "title": "Custom Denim Pants Manufacturer | Vintage Wash | Pak Homies",
    "description": "Heavyweight denim pants manufacturing. Custom washes, fits, hardware. MOQ 50 units.",
    "keywords": "denim pants manufacturer, custom jeans supplier, vintage denim wholesale, denim manufacturer Pakistan"
  },
  "puffer-jackets": {
    "title": "Custom Puffer Jacket Manufacturer | Insulated | Pak Homies",
    "description": "Premium puffer jacket manufacturing. Insulated, weather-resistant, custom styles. MOQ 50.",
    "keywords": "puffer jacket manufacturer, insulated jacket supplier, custom puffer wholesale"
  },
  "vests": {
    "title": "Custom Vests Manufacturer | Insulated & Technical | Pak Homies",
    "description": "Custom vest manufacturing: insulated, quilted, technical. Lightweight, customizable. MOQ 50.",
    "keywords": "vest manufacturer, custom vest supplier, insulated vest wholesale, technical vest manufacturing"
  }
};
