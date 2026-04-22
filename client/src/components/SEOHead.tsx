import { Helmet } from "react-helmet-async";

interface BreadcrumbItem {
  name: string;
  item: string;
}

interface SEOHeadProps {
  title?: string;
  description?: string;
  keywords?: string;
  canonical?: string;
  ogImage?: string;
  ogType?: string;
  schema?: object;
  noIndex?: boolean;
  breadcrumbs?: BreadcrumbItem[];
  hreflangs?: Array<{ rel: string; href: string }>;
  product?: {
    brand?: string;
    availability?: string; // "in stock", "out of stock", "preorder", "available for order", "discontinued"
    condition?: string; // "new", "refurbished", "used"
    priceAmount?: string;
    priceCurrency?: string;
    retailerItemId?: string;
    itemGroupId?: string; // useful for variants
  };
  faq?: Array<{ question: string; answer: string }>;
  itemList?: Array<{ name: string; url: string }>;
}

const SITE_NAME = "Pak Homies Industry - Custom Apparel Manufacturer Pakistan";
const DEFAULT_DESCRIPTION =
  "Pak Homies Industry is Pakistan's leading custom apparel manufacturer based in Sialkot. We specialize in Hunting Wear, Sports Wear, Ski Wear, Tech Wear, Streetwear, and Martial Arts Wear (BJJ Kimonos & Rashguards). Private label, low MOQ from 50 pcs, bulk export for global brands in USA, UAE & Europe.";
const DEFAULT_KEYWORDS =
  "custom apparel manufacturer Pakistan, hunting wear manufacturer Sialkot, sports wear manufacturer Pakistan, ski wear manufacturer Pakistan, tech wear manufacturer Sialkot, streetwear manufacturer Pakistan, martial arts wear manufacturer Pakistan, bulk BJJ kimonos manufacturer, custom rashguards supplier, private label clothing Pakistan, B2B clothing manufacturer Sialkot, OEM apparel manufacturer Pakistan, wholesale hunting clothing supplier, custom ski jacket manufacturer Pakistan";
const DEFAULT_OG_IMAGE = "https://files.manuscdn.com/user_upload_by_module/session_file/310419663026792105/RfANkMVkQHIazGrh.jpg";
const SITE_URL = "https://pakhomiesind.com";

export default function SEOHead({
  title,
  description = DEFAULT_DESCRIPTION,
  keywords = DEFAULT_KEYWORDS,
  canonical,
  ogImage = DEFAULT_OG_IMAGE,
  ogType = "website",
  schema,
  noIndex = false,
  breadcrumbs,
  hreflangs,
  product,
  faq,
  itemList,
}: SEOHeadProps) {
  const fullTitle = title ? `${title} | Pak Homies Industry Pakistan` : SITE_NAME;
  const canonicalUrl = canonical ? `${SITE_URL}${canonical}` : SITE_URL;

  // JSON-LD Schema
  const defaultSchemaGraph: any[] = [
    {
      "@type": "Organization",
      "@id": `${SITE_URL}/#organization`,
      name: "Pak Homies Industry",
      url: SITE_URL,
      logo: `${SITE_URL}/logo.png`,
      description: DEFAULT_DESCRIPTION,
      foundingDate: "2010",
      address: {
        "@type": "PostalAddress",
        streetAddress: "Sialkot Industrial Estate",
        addressLocality: "Sialkot",
        addressRegion: "Punjab",
        addressCountry: "PK",
      },
      contactPoint: {
        "@type": "ContactPoint",
        telephone: "+92-302-292-2242",
        contactType: "sales",
        availableLanguage: ["English", "Urdu"],
        areaServed: ["US", "GB", "AU", "AE", "EU"],
      },
      potentialAction: {
        "@type": "InquiryAction",
        target: `${SITE_URL}/rfq`,
        name: "Request Manufacturing Quote"
      },
      sameAs: [
        "https://instagram.com/sialkotsamplemasters",
        "https://linkedin.com/company/sialkot-sample-masters",
      ],
    },
    {
      "@type": "LocalBusiness",
      "@id": `${SITE_URL}/#localbusiness`,
      name: "Pak Homies Industry",
      image: DEFAULT_OG_IMAGE,
      url: SITE_URL,
      telephone: "+92-302-292-2242",
      email: "info@pakhomiesind.com",
      address: {
        "@type": "PostalAddress",
        streetAddress: "Sialkot Industrial Estate",
        addressLocality: "Sialkot",
        addressRegion: "Punjab",
        postalCode: "51310",
        addressCountry: "PK",
      },
      geo: {
        "@type": "GeoCoordinates",
        latitude: 32.4945,
        longitude: 74.5229,
      },
      openingHoursSpecification: [
        {
          "@type": "OpeningHoursSpecification",
          dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
          opens: "09:00",
          closes: "18:00",
        },
      ],
      priceRange: "$$",
      currenciesAccepted: "USD, EUR, GBP, PKR",
      paymentAccepted: "Wire Transfer, PayPal, LC",
    },
    {
      "@type": "WebSite",
      "@id": `${SITE_URL}/#website`,
      url: SITE_URL,
      name: "Pak Homies Industry",
      description: DEFAULT_DESCRIPTION,
      publisher: { "@id": `${SITE_URL}/#organization` },
      potentialAction: {
        "@type": "SearchAction",
        "target": {
          "@type": "EntryPoint",
          "urlTemplate": `${SITE_URL}/shop?search={search_term_string}`
        },
        "query-input": "required name=search_term_string"
      }
    },
    {
      "@type": "Speakable",
      cssSelector: [".speakable-title", ".speakable-description"]
    }
  ];

  if (faq) {
    defaultSchemaGraph.push({
      "@type": "FAQPage",
      mainEntity: faq.map(item => ({
        "@type": "Question",
        name: item.question,
        acceptedAnswer: {
          "@type": "Answer",
          text: item.answer,
        },
      })),
    });
  }

  if (itemList) {
    defaultSchemaGraph.push({
      "@type": "ItemList",
      numberOfItems: itemList.length,
      itemListElement: itemList.map((item, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: item.name,
        url: item.url.startsWith("http") ? item.url : `${SITE_URL}${item.url}`,
      })),
    });
  }

  if (breadcrumbs) {
    defaultSchemaGraph.push({
      "@type": "BreadcrumbList",
      itemListElement: breadcrumbs.map((crumb, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: crumb.name,
        item: crumb.item.startsWith("http") ? crumb.item : `${SITE_URL}${crumb.item}`,
      })),
    });
  }

  if (schema) {
    if (Array.isArray(schema)) {
      defaultSchemaGraph.push(...schema);
    } else {
      defaultSchemaGraph.push(schema);
    }
  }

  const schemaJson = JSON.stringify({
    "@context": "https://schema.org",
    "@graph": defaultSchemaGraph,
  });

  return (
    <Helmet>
      {/* Basic HTML Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <meta name="author" content="Pak Homies Industry, Sialkot, Pakistan" />
      <meta name="robots" content={noIndex ? "noindex,nofollow" : "index,follow,max-image-preview:large,max-snippet:-1"} />

      {/* GEO Meta Tags */}
      <meta name="geo.region" content="PK-PB" />
      <meta name="geo.placename" content="Sialkot, Punjab, Pakistan" />
      <meta name="geo.position" content="32.4945;74.5229" />
      <meta name="ICBM" content="32.4945, 74.5229" />

      {/* Open Graph Tags */}
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content={ogType} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:site_name" content="Pak Homies Industry" />
      <meta property="og:locale" content="en_US" />
      <meta property="og:locale:alternate" content="en_GB" />
      <meta property="og:locale:alternate" content="en_AE" />
      <meta property="og:url" content={canonicalUrl} />

      {/* Twitter Card Tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />

      {/* Canonical Link */}
      <link rel="canonical" href={canonicalUrl} />

      {/* Additional SEO Meta Tags */}
      <meta name="format-detection" content="telephone=yes" />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="default" />

      {/* E-E-A-T: Publisher & Author Signals */}
      <meta name="publisher" content="Pak Homies Industry" />
      <meta name="copyright" content="Pak Homies Industry" />

      {/* Hreflang Tags */}
      {hreflangs?.map((hl, index) => (
        <link key={index} rel="alternate" href={hl.href} hrefLang={hl.rel} />
      ))}
      <link rel="alternate" href={canonicalUrl} hrefLang="en" />
      <link rel="alternate" href={canonicalUrl} hrefLang="x-default" />

      {/* Structured Data (JSON-LD) */}
      <script type="application/ld+json">{schemaJson}</script>

      {/* Conditionally Rendered Product Meta Tags */}
      {product && product.brand && <meta property="product:brand" content={product.brand} />}
      {product && product.availability && <meta property="product:availability" content={product.availability} />}
      {product && product.condition && <meta property="product:condition" content={product.condition} />}
      {product && product.priceAmount && <meta property="product:price:amount" content={product.priceAmount} />}
      {product && product.priceCurrency && <meta property="product:price:currency" content={product.priceCurrency} />}
      {product && product.retailerItemId && <meta property="product:retailer_item_id" content={product.retailerItemId} />}
      {product && product.itemGroupId && <meta property="product:item_group_id" content={product.itemGroupId} />}
    </Helmet>
  );
}

