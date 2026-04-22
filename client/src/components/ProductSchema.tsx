/**
 * Product Schema Component
 * 
 * Generates comprehensive Schema.org Product markup for SEO
 * This helps Google show rich snippets in search results:
 * - Price ranges
 * - Availability
 * - Ratings
 * - Product images
 * 
 * @see https://schema.org/Product
 * @see https://developers.google.com/search/docs/appearance/structured-data/product
 */

interface SlabPrice {
  minQty: number;
  maxQty: number | null;
  pricePerUnit: string;
}

interface ProductImage {
  url: string;
  alt?: string;
}

interface ProductSchemaProps {
  product: {
    id: number;
    title: string;
    slug: string;
    description?: string;
    shortDescription?: string;
    category: string;
    mainImage?: string;
    images?: ProductImage[];
    samplePrice?: string;
    isActive?: boolean;
  };
  slabs: SlabPrice[];
  rating?: {
    value: number;
    count: number;
  };
  reviews?: Array<{
    author: string;
    date: string;
    content: string;
    rating: number;
  }>;
}

export default function ProductSchema({ 
  product, 
  slabs, 
  rating,
  reviews 
}: ProductSchemaProps) {
  
  // Build image array
  const imageUrls: string[] = [];
  if (product.mainImage) imageUrls.push(product.mainImage);
  if (product.images) {
    imageUrls.push(...product.images.map(img => img.url));
  }
  
  // Build offers from slabs
  const offers = slabs.length > 0 
    ? {
        "@type": "AggregateOffer",
        "priceCurrency": "USD",
        "lowPrice": Math.min(...slabs.map(s => parseFloat(s.pricePerUnit))).toFixed(2),
        "highPrice": Math.max(...slabs.map(s => parseFloat(s.pricePerUnit))).toFixed(2),
        "offerCount": slabs.length,
        "availability": product.isActive !== false 
          ? "https://schema.org/InStock" 
          : "https://schema.org/OutOfStock",
        "offers": slabs.map(slab => ({
          "@type": "Offer",
          "price": slab.pricePerUnit,
          "priceCurrency": "USD",
          "availability": "https://schema.org/InStock",
          "eligibleQuantity": {
            "@type": "QuantifiedValue",
            "minValue": slab.minQty,
            "maxValue": slab.maxQty || undefined,
          },
          "priceValidUntil": new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 1 year from now
        })),
      }
    : product.samplePrice 
      ? {
          "@type": "Offer",
          "price": product.samplePrice,
          "priceCurrency": "USD",
          "availability": "https://schema.org/InStock",
          "priceValidUntil": new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        }
      : undefined;

  // Build aggregate rating
  const aggregateRating = rating ? {
    "@type": "AggregateRating",
    "ratingValue": rating.value.toFixed(1),
    "reviewCount": rating.count,
    "bestRating": "5",
    "worstRating": "1",
  } : undefined;

  // Build reviews
  const reviewData = reviews && reviews.length > 0 
    ? reviews.map(review => ({
        "@type": "Review",
        "author": {
          "@type": "Person",
          "name": review.author,
        },
        "datePublished": review.date,
        "reviewBody": review.content,
        "reviewRating": {
          "@type": "Rating",
          "ratingValue": review.rating,
          "bestRating": "5",
        },
      }))
    : undefined;

  // Build the complete Product schema
  const schema = {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": product.title,
    "image": imageUrls,
    "description": product.description || product.shortDescription || `Custom ${product.title} manufacturing from Sialkot, Pakistan`,
    "sku": `SSM-${product.id}`,
    "mpn": `SSM-${product.slug.toUpperCase().replace(/-/g, '')}`,
    "brand": {
      "@type": "Brand",
      "name": "Pak Homies Industry",
    },
    "manufacturer": {
      "@type": "Organization",
      "name": "Pak Homies Industry",
      "@id": "https://pakhomiesind.com/#organization",
    },
    "category": product.category,
    "material": "Premium quality fabrics (customizable)",
    "countryOfOrigin": {
      "@type": "Country",
      "name": "Pakistan",
    },
    "offers": offers,
    "aggregateRating": aggregateRating,
    "review": reviewData,
    "potentialAction": {
      "@type": "InquiryAction",
      "target": {
        "@type": "EntryPoint",
        "urlTemplate": `https://pakhomiesind.com/rfq?product=${product.slug}`,
      },
      "name": "Request Manufacturing Quote",
    },
  };

  return (
    <script 
      type="application/ld+json" 
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

/**
 * Hook to generate product schema data
 * Use this when you need the schema object for custom implementations
 */
export function useProductSchema(
  product: ProductSchemaProps['product'],
  slabs: SlabPrice[],
  rating?: ProductSchemaProps['rating']
) {
  const imageUrls: string[] = [];
  if (product.mainImage) imageUrls.push(product.mainImage);
  
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": product.title,
    "image": imageUrls,
    "description": product.shortDescription,
    "sku": `SSM-${product.id}`,
    "brand": { "@type": "Brand", "name": "Pak Homies Industry" },
    "offers": slabs.length > 0 ? {
      "@type": "AggregateOffer",
      "priceCurrency": "USD",
      "lowPrice": Math.min(...slabs.map(s => parseFloat(s.pricePerUnit))).toFixed(2),
      "highPrice": Math.max(...slabs.map(s => parseFloat(s.pricePerUnit))).toFixed(2),
      "availability": "https://schema.org/InStock",
    } : undefined,
    "aggregateRating": rating ? {
      "@type": "AggregateRating",
      "ratingValue": rating.value,
      "reviewCount": rating.count,
    } : undefined,
  };
}

/**
 * Product Availability Badge
 * Shows visual availability indicator with schema
 */
export function ProductAvailability({ 
  inStock = true 
}: { 
  inStock?: boolean 
}) {
  return (
    <div 
      itemProp="availability" 
      content={inStock ? "https://schema.org/InStock" : "https://schema.org/OutOfStock"}
      className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${
        inStock 
          ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400" 
          : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
      }`}
    >
      <span className={`w-2 h-2 rounded-full ${inStock ? "bg-green-500" : "bg-red-500"}`} />
      {inStock ? "In Stock & Ready to Produce" : "Out of Stock"}
    </div>
  );
}

/**
 * Product Price Display with Schema
 */
export function ProductPrice({ 
  price, 
  currency = "USD" 
}: { 
  price: string; 
  currency?: string;
}) {
  return (
    <span 
      itemProp="offers" 
      itemScope 
      itemType="https://schema.org/Offer"
      className="text-2xl font-bold text-gold"
    >
      <meta itemProp="priceCurrency" content={currency} />
      <meta itemProp="availability" content="https://schema.org/InStock" />
      <span itemProp="price">{price}</span>
    </span>
  );
}

