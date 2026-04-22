import { Router } from "express";
import { getDb } from "../db";
import { products, blogPosts, portfolioItems } from "../../drizzle/schema";
import { eq, and, desc } from "drizzle-orm";

const router = Router();

const DOMAIN = "https://pakhomiesind.com";

// Hreflang configurations for international targeting
const HREFLANG_ALTERNATES = [
    { lang: "en-us", country: "USA" },
    { lang: "en-gb", country: "UK" },
    { lang: "en-ca", country: "Canada" },
    { lang: "en-au", country: "Australia" },
    { lang: "en-de", country: "Germany" },
    { lang: "en-fr", country: "France" },
    { lang: "x-default", country: "Global" }
];

router.get("/sitemap.xml", async (req, res) => {
    try {
        const db = await getDb();
        if (!db) {
            return res.status(500).send("Database not available");
        }

        // Fetch all active entities with updated timestamps
        const activeProducts = await db.select({ 
            slug: products.slug, 
            updatedAt: products.updatedAt,
            mainImage: products.mainImage,
            title: products.title
        })
            .from(products)
            .where(eq(products.isActive, true))
            .orderBy(desc(products.updatedAt));

        const publishedPosts = await db.select({ 
            slug: blogPosts.slug, 
            publishedAt: blogPosts.publishedAt,
            featuredImage: blogPosts.featuredImage,
            title: blogPosts.title,
            updatedAt: blogPosts.updatedAt
        })
            .from(blogPosts)
            .where(eq(blogPosts.published, true))
            .orderBy(desc(blogPosts.publishedAt));

        const activePortfolio = await db.select({ 
            id: portfolioItems.id, 
            updatedAt: portfolioItems.updatedAt,
            coverImage: portfolioItems.coverImage,
            title: portfolioItems.title
        })
            .from(portfolioItems)
            .where(eq(portfolioItems.isActive, true))
            .orderBy(desc(portfolioItems.updatedAt));

        // Enhanced static pages with lastmod and better priorities
        const staticPages = [
            { path: "", priority: "1.0", changefreq: "daily", lastmod: new Date().toISOString().split('T')[0] },
            { path: "/about", priority: "0.9", changefreq: "monthly", lastmod: new Date().toISOString().split('T')[0] },
            { path: "/services", priority: "0.9", changefreq: "monthly", lastmod: new Date().toISOString().split('T')[0] },
            { path: "/products", priority: "0.9", changefreq: "weekly", lastmod: new Date().toISOString().split('T')[0] },
            { path: "/shop", priority: "0.9", changefreq: "daily", lastmod: new Date().toISOString().split('T')[0] },
            { path: "/portfolio", priority: "0.8", changefreq: "weekly", lastmod: new Date().toISOString().split('T')[0] },
            { path: "/blog", priority: "0.8", changefreq: "daily", lastmod: new Date().toISOString().split('T')[0] },
            { path: "/rfq", priority: "0.9", changefreq: "monthly", lastmod: new Date().toISOString().split('T')[0] },
            { path: "/contact", priority: "0.8", changefreq: "monthly", lastmod: new Date().toISOString().split('T')[0] },
        ];

        let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">`;

        // Static pages with hreflang alternates
        staticPages.forEach(page => {
            xml += `
  <url>
    <loc>${DOMAIN}${page.path}</loc>
    <lastmod>${page.lastmod}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>`;
            
            // Add hreflang alternates for homepage and key pages
            if (page.path === "" || page.path === "/products" || page.path === "/shop") {
                HREFLANG_ALTERNATES.forEach(alt => {
                    xml += `
    <xhtml:link rel="alternate" hreflang="${alt.lang}" href="${DOMAIN}${page.path}" />`;
                });
            }
            
            xml += `
  </url>`;
        });

        // Dynamic Products with enhanced metadata
        activeProducts.forEach(p => {
            const lastmod = (p.updatedAt || new Date()).toISOString().split('T')[0];
            xml += `
  <url>
    <loc>${DOMAIN}/shop/${p.slug}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>`;
            
            // Add product image if available
            if (p.mainImage) {
                xml += `
    <image:image>
      <image:loc>${p.mainImage.startsWith('http') ? p.mainImage : DOMAIN + p.mainImage}</image:loc>
      <image:title>${escapeXml(p.title || 'Product Image')}</image:title>
      <image:caption>${escapeXml(p.title || 'Custom apparel manufactured in Sialkot, Pakistan')}</image:caption>
    </image:image>`;
            }
            
            xml += `
  </url>`;
        });

        // Dynamic Blog Posts with enhanced metadata
        publishedPosts.forEach(post => {
            const lastmod = (post.updatedAt || post.publishedAt || new Date()).toISOString().split('T')[0];
            xml += `
  <url>
    <loc>${DOMAIN}/blog/${post.slug}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>`;
            
            // Add blog image if available
            if (post.featuredImage) {
                xml += `
    <image:image>
      <image:loc>${post.featuredImage.startsWith('http') ? post.featuredImage : DOMAIN + post.featuredImage}</image:loc>
      <image:title>${escapeXml(post.title || 'Blog Image')}</image:title>
    </image:image>`;
            }
            
            xml += `
  </url>`;
        });

        // Portfolio items
        activePortfolio.forEach(item => {
            const lastmod = (item.updatedAt || new Date()).toISOString().split('T')[0];
            xml += `
  <url>
    <loc>${DOMAIN}/portfolio/${item.id}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>`;
            
            // Add portfolio image if available
            if (item.coverImage) {
                xml += `
    <image:image>
      <image:loc>${item.coverImage.startsWith('http') ? item.coverImage : DOMAIN + item.coverImage}</image:loc>
      <image:title>${escapeXml(item.title || 'Portfolio Item')}</image:title>
    </image:image>`;
            }
            
            xml += `
  </url>`;
        });

        // GEO Landing Pages with hreflang
        const regions = [
            { code: "usa", lang: "en-us" },
            { code: "uk", lang: "en-gb" },
            { code: "europe", lang: "en-eu" },
            { code: "australia", lang: "en-au" },
            { code: "canada", lang: "en-ca" },
            { code: "germany", lang: "en-de" },
            { code: "france", lang: "en-fr" }
        ];
        
        regions.forEach(region => {
            xml += `
  <url>
    <loc>${DOMAIN}/manufacturing/${region.code}</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.9</priority>
    <xhtml:link rel="alternate" hreflang="${region.lang}" href="${DOMAIN}/manufacturing/${region.code}" />
    <xhtml:link rel="alternate" hreflang="x-default" href="${DOMAIN}/manufacturing/usa" />
  </url>`;
        });

        xml += `
</urlset>`;

        res.header("Content-Type", "application/xml");
        res.status(200).send(xml);
    } catch (error) {
        console.error("[Sitemap] Generation error:", error);
        res.status(500).send("Error generating sitemap");
    }
});

// Helper function to escape XML special characters
function escapeXml(str: string): string {
    return str
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&apos;');
}

export default router;

