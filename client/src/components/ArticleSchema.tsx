/**
 * ArticleSchema Component
 *
 * Generates comprehensive Schema.org Article markup for blog posts.
 * Adds author, publisher, datePublished, and other signals
 * critical for E-E-A-T and GEO (AI engine) optimization.
 *
 * @see https://schema.org/Article
 * @see https://developers.google.com/search/docs/appearance/structured-data/article
 */

interface ArticleSchemaProps {
  title: string;
  description: string;
  slug: string;
  datePublished: string;  // ISO 8601 format: "2026-03-15"
  dateModified?: string;
  author?: {
    name: string;
    title?: string;
    url?: string;
  };
  category?: string;
  tags?: string[];
  image?: string;
  wordCount?: number;
  readingTime?: string;
}

const SITE_URL = "https://pakhomiesind.com";
const DEFAULT_AUTHOR = {
  name: "Pak Homies Industry",
  title: "Manufacturing & Export Division",
  url: `${SITE_URL}/about`,
};
const DEFAULT_IMAGE = "https://files.manuscdn.com/user_upload_by_module/session_file/310419663026792105/RfANkMVkQHIazGrh.jpg";

export default function ArticleSchema({
  title,
  description,
  slug,
  datePublished,
  dateModified,
  author = DEFAULT_AUTHOR,
  category,
  tags,
  image,
  wordCount,
  readingTime,
}: ArticleSchemaProps) {
  const articleUrl = `${SITE_URL}/blog/${slug}`;

  const schema = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": title,
    "description": description,
    "url": articleUrl,
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": articleUrl,
    },
    "image": image || DEFAULT_IMAGE,
    "datePublished": datePublished,
    "dateModified": dateModified || datePublished,
    "author": {
      "@type": "Organization",
      "name": author.name,
      "url": author.url || `${SITE_URL}/about`,
      "logo": {
        "@type": "ImageObject",
        "url": `${SITE_URL}/logo.png`,
      },
    },
    "publisher": {
      "@type": "Organization",
      "@id": `${SITE_URL}/#organization`,
      "name": "Pak Homies Industry",
      "url": SITE_URL,
      "logo": {
        "@type": "ImageObject",
        "url": `${SITE_URL}/logo.png`,
        "width": 600,
        "height": 60,
      },
    },
    "isPartOf": {
      "@type": "Blog",
      "@id": `${SITE_URL}/blog`,
      "name": "Pak Homies Industry Manufacturing Blog",
      "description": "Expert guides on apparel manufacturing, sourcing, and export from Pakistan",
    },
    ...(category && { "articleSection": category }),
    ...(tags && { "keywords": tags.join(", ") }),
    ...(wordCount && { "wordCount": wordCount }),
    ...(readingTime && {
      "timeRequired": `PT${readingTime.replace(/[^0-9]/g, "")}M`,
    }),
    "inLanguage": "en-US",
    "copyrightHolder": {
      "@type": "Organization",
      "name": "Pak Homies Industry",
    },
    "speakable": {
      "@type": "SpeakableSpecification",
      "cssSelector": ["h1", ".speakable-description"],
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
 * AuthorBio Component
 *
 * Displays author info at the bottom of blog posts.
 * Adds E-E-A-T signals for search engines and AI crawlers.
 */
export function AuthorBio({
  name = "Pak Homies Industry",
  role = "Manufacturing & Export Division",
  bio = "Pak Homies Industry is an ISO 9001:2015 certified custom apparel manufacturer based in Sialkot, Pakistan. Since 2010, we have manufactured over 2 million garments for 500+ brands across 30 countries, specializing in streetwear, sportswear, hunting wear, and technical outerwear with a minimum order quantity of just 50 pieces.",
  image,
}: {
  name?: string;
  role?: string;
  bio?: string;
  image?: string;
}) {
  return (
    <div
      className="flex items-start gap-5 p-6 bg-card border border-border rounded-lg mt-12"
      itemScope
      itemType="https://schema.org/Organization"
    >
      {image && (
        <img
          src={image}
          alt={`${name} - Custom apparel manufacturer Sialkot`}
          className="w-16 h-16 rounded-full object-cover border-2 border-gold/30"
          itemProp="image"
          loading="lazy"
        />
      )}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <h4
            className="font-semibold text-foreground"
            itemProp="name"
          >
            {name}
          </h4>
          <span className="text-[10px] font-condensed font-bold tracking-widest uppercase text-gold bg-gold/10 px-2 py-0.5 rounded-sm">
            Verified Manufacturer
          </span>
        </div>
        <p className="text-muted-foreground text-sm mb-2" itemProp="description">
          {role}
        </p>
        <p className="text-muted-foreground text-sm leading-relaxed" itemProp="description">
          {bio}
        </p>
        <div className="flex items-center gap-4 mt-3">
          <span className="text-xs text-muted-foreground flex items-center gap-1">
            <span className="text-gold">🏅</span> ISO 9001:2015 Certified
          </span>
          <span className="text-xs text-muted-foreground flex items-center gap-1">
            <span className="text-green-500">🌱</span> 80% Solar Powered
          </span>
          <span className="text-xs text-muted-foreground flex items-center gap-1">
            <span className="text-blue-500">🌍</span> Exports to 30+ Countries
          </span>
        </div>
      </div>
    </div>
  );
}

