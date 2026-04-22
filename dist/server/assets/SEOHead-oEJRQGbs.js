import { jsxs, jsx } from "react/jsx-runtime";
import { Helmet } from "react-helmet-async";
const SITE_NAME = "Pak Homies Industry - Custom Apparel Manufacturer Pakistan";
const DEFAULT_DESCRIPTION = "Pak Homies Industry is Pakistan's leading custom apparel manufacturer based in Sialkot. We specialize in Hunting Wear, Sports Wear, Ski Wear, Tech Wear, Streetwear, and Martial Arts Wear (BJJ Kimonos & Rashguards). Private label, low MOQ from 50 pcs, bulk export for global brands in USA, UAE & Europe.";
const DEFAULT_KEYWORDS = "custom apparel manufacturer Pakistan, hunting wear manufacturer Sialkot, sports wear manufacturer Pakistan, ski wear manufacturer Pakistan, tech wear manufacturer Sialkot, streetwear manufacturer Pakistan, martial arts wear manufacturer Pakistan, bulk BJJ kimonos manufacturer, custom rashguards supplier, private label clothing Pakistan, B2B clothing manufacturer Sialkot, OEM apparel manufacturer Pakistan, wholesale hunting clothing supplier, custom ski jacket manufacturer Pakistan";
const DEFAULT_OG_IMAGE = "https://files.manuscdn.com/user_upload_by_module/session_file/310419663026792105/RfANkMVkQHIazGrh.jpg";
const SITE_URL = "https://pakhomiesind.com";
function SEOHead({
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
  itemList
}) {
  const fullTitle = title ? `${title} | Pak Homies Industry Pakistan` : SITE_NAME;
  const canonicalUrl = canonical ? `${SITE_URL}${canonical}` : SITE_URL;
  const defaultSchemaGraph = [
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
        addressCountry: "PK"
      },
      contactPoint: {
        "@type": "ContactPoint",
        telephone: "+92-302-292-2242",
        contactType: "sales",
        availableLanguage: ["English", "Urdu"],
        areaServed: ["US", "GB", "AU", "AE", "EU"]
      },
      potentialAction: {
        "@type": "InquiryAction",
        target: `${SITE_URL}/rfq`,
        name: "Request Manufacturing Quote"
      },
      sameAs: [
        "https://instagram.com/sialkotsamplemasters",
        "https://linkedin.com/company/sialkot-sample-masters"
      ]
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
        addressCountry: "PK"
      },
      geo: {
        "@type": "GeoCoordinates",
        latitude: 32.4945,
        longitude: 74.5229
      },
      openingHoursSpecification: [
        {
          "@type": "OpeningHoursSpecification",
          dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
          opens: "09:00",
          closes: "18:00"
        }
      ],
      priceRange: "$$",
      currenciesAccepted: "USD, EUR, GBP, PKR",
      paymentAccepted: "Wire Transfer, PayPal, LC"
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
      mainEntity: faq.map((item) => ({
        "@type": "Question",
        name: item.question,
        acceptedAnswer: {
          "@type": "Answer",
          text: item.answer
        }
      }))
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
        url: item.url.startsWith("http") ? item.url : `${SITE_URL}${item.url}`
      }))
    });
  }
  if (breadcrumbs) {
    defaultSchemaGraph.push({
      "@type": "BreadcrumbList",
      itemListElement: breadcrumbs.map((crumb, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: crumb.name,
        item: crumb.item.startsWith("http") ? crumb.item : `${SITE_URL}${crumb.item}`
      }))
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
    "@graph": defaultSchemaGraph
  });
  return /* @__PURE__ */ jsxs(Helmet, { "data-loc": "client\\src\\components\\SEOHead.tsx:200", children: [
    /* @__PURE__ */ jsx("title", { "data-loc": "client\\src\\components\\SEOHead.tsx:202", children: fullTitle }),
    /* @__PURE__ */ jsx("meta", { "data-loc": "client\\src\\components\\SEOHead.tsx:203", name: "description", content: description }),
    /* @__PURE__ */ jsx("meta", { "data-loc": "client\\src\\components\\SEOHead.tsx:204", name: "keywords", content: keywords }),
    /* @__PURE__ */ jsx("meta", { "data-loc": "client\\src\\components\\SEOHead.tsx:205", name: "author", content: "Pak Homies Industry, Sialkot, Pakistan" }),
    /* @__PURE__ */ jsx("meta", { "data-loc": "client\\src\\components\\SEOHead.tsx:206", name: "robots", content: noIndex ? "noindex,nofollow" : "index,follow,max-image-preview:large,max-snippet:-1" }),
    /* @__PURE__ */ jsx("meta", { "data-loc": "client\\src\\components\\SEOHead.tsx:209", name: "geo.region", content: "PK-PB" }),
    /* @__PURE__ */ jsx("meta", { "data-loc": "client\\src\\components\\SEOHead.tsx:210", name: "geo.placename", content: "Sialkot, Punjab, Pakistan" }),
    /* @__PURE__ */ jsx("meta", { "data-loc": "client\\src\\components\\SEOHead.tsx:211", name: "geo.position", content: "32.4945;74.5229" }),
    /* @__PURE__ */ jsx("meta", { "data-loc": "client\\src\\components\\SEOHead.tsx:212", name: "ICBM", content: "32.4945, 74.5229" }),
    /* @__PURE__ */ jsx("meta", { "data-loc": "client\\src\\components\\SEOHead.tsx:215", property: "og:title", content: fullTitle }),
    /* @__PURE__ */ jsx("meta", { "data-loc": "client\\src\\components\\SEOHead.tsx:216", property: "og:description", content: description }),
    /* @__PURE__ */ jsx("meta", { "data-loc": "client\\src\\components\\SEOHead.tsx:217", property: "og:type", content: ogType }),
    /* @__PURE__ */ jsx("meta", { "data-loc": "client\\src\\components\\SEOHead.tsx:218", property: "og:image", content: ogImage }),
    /* @__PURE__ */ jsx("meta", { "data-loc": "client\\src\\components\\SEOHead.tsx:219", property: "og:site_name", content: "Pak Homies Industry" }),
    /* @__PURE__ */ jsx("meta", { "data-loc": "client\\src\\components\\SEOHead.tsx:220", property: "og:locale", content: "en_US" }),
    /* @__PURE__ */ jsx("meta", { "data-loc": "client\\src\\components\\SEOHead.tsx:221", property: "og:locale:alternate", content: "en_GB" }),
    /* @__PURE__ */ jsx("meta", { "data-loc": "client\\src\\components\\SEOHead.tsx:222", property: "og:locale:alternate", content: "en_AE" }),
    /* @__PURE__ */ jsx("meta", { "data-loc": "client\\src\\components\\SEOHead.tsx:223", property: "og:url", content: canonicalUrl }),
    /* @__PURE__ */ jsx("meta", { "data-loc": "client\\src\\components\\SEOHead.tsx:226", name: "twitter:card", content: "summary_large_image" }),
    /* @__PURE__ */ jsx("meta", { "data-loc": "client\\src\\components\\SEOHead.tsx:227", name: "twitter:title", content: fullTitle }),
    /* @__PURE__ */ jsx("meta", { "data-loc": "client\\src\\components\\SEOHead.tsx:228", name: "twitter:description", content: description }),
    /* @__PURE__ */ jsx("meta", { "data-loc": "client\\src\\components\\SEOHead.tsx:229", name: "twitter:image", content: ogImage }),
    /* @__PURE__ */ jsx("link", { "data-loc": "client\\src\\components\\SEOHead.tsx:232", rel: "canonical", href: canonicalUrl }),
    /* @__PURE__ */ jsx("meta", { "data-loc": "client\\src\\components\\SEOHead.tsx:235", name: "format-detection", content: "telephone=yes" }),
    /* @__PURE__ */ jsx("meta", { "data-loc": "client\\src\\components\\SEOHead.tsx:236", name: "apple-mobile-web-app-capable", content: "yes" }),
    /* @__PURE__ */ jsx("meta", { "data-loc": "client\\src\\components\\SEOHead.tsx:237", name: "apple-mobile-web-app-status-bar-style", content: "default" }),
    /* @__PURE__ */ jsx("meta", { "data-loc": "client\\src\\components\\SEOHead.tsx:240", name: "publisher", content: "Pak Homies Industry" }),
    /* @__PURE__ */ jsx("meta", { "data-loc": "client\\src\\components\\SEOHead.tsx:241", name: "copyright", content: "Pak Homies Industry" }),
    hreflangs?.map((hl, index) => /* @__PURE__ */ jsx("link", { "data-loc": "client\\src\\components\\SEOHead.tsx:245", rel: "alternate", href: hl.href, hrefLang: hl.rel }, index)),
    /* @__PURE__ */ jsx("link", { "data-loc": "client\\src\\components\\SEOHead.tsx:247", rel: "alternate", href: canonicalUrl, hrefLang: "en" }),
    /* @__PURE__ */ jsx("link", { "data-loc": "client\\src\\components\\SEOHead.tsx:248", rel: "alternate", href: canonicalUrl, hrefLang: "x-default" }),
    /* @__PURE__ */ jsx("script", { "data-loc": "client\\src\\components\\SEOHead.tsx:251", type: "application/ld+json", children: schemaJson }),
    product && product.brand && /* @__PURE__ */ jsx("meta", { "data-loc": "client\\src\\components\\SEOHead.tsx:254", property: "product:brand", content: product.brand }),
    product && product.availability && /* @__PURE__ */ jsx("meta", { "data-loc": "client\\src\\components\\SEOHead.tsx:255", property: "product:availability", content: product.availability }),
    product && product.condition && /* @__PURE__ */ jsx("meta", { "data-loc": "client\\src\\components\\SEOHead.tsx:256", property: "product:condition", content: product.condition }),
    product && product.priceAmount && /* @__PURE__ */ jsx("meta", { "data-loc": "client\\src\\components\\SEOHead.tsx:257", property: "product:price:amount", content: product.priceAmount }),
    product && product.priceCurrency && /* @__PURE__ */ jsx("meta", { "data-loc": "client\\src\\components\\SEOHead.tsx:258", property: "product:price:currency", content: product.priceCurrency }),
    product && product.retailerItemId && /* @__PURE__ */ jsx("meta", { "data-loc": "client\\src\\components\\SEOHead.tsx:259", property: "product:retailer_item_id", content: product.retailerItemId }),
    product && product.itemGroupId && /* @__PURE__ */ jsx("meta", { "data-loc": "client\\src\\components\\SEOHead.tsx:260", property: "product:item_group_id", content: product.itemGroupId })
  ] });
}
export {
  SEOHead as S
};
