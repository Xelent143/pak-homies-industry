import { Link, useLocation } from "wouter";
import { ChevronRight, Home } from "lucide-react";
import { cn } from "@/lib/utils";

export interface BreadcrumbItem {
  name: string;
  href: string;
  isCurrent?: boolean;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
  className?: string;
  showHome?: boolean;
  separator?: React.ReactNode;
}

/**
 * Breadcrumb Component with Schema.org markup
 * 
 * SEO Benefits:
 * - Helps search engines understand site structure
 * - Improves click-through rate in SERPs
 * - Google may show breadcrumbs in search results
 * 
 * @example
 * <Breadcrumb 
 *   items={[
 *     { name: "Shop", href: "/shop" },
 *     { name: "Streetwear", href: "/shop?category=streetwear" },
 *     { name: "Custom Hoodie", href: "/shop/custom-hoodie", isCurrent: true }
 *   ]}
 * />
 */
export default function Breadcrumb({
  items,
  className,
  showHome = true,
  separator = <ChevronRight className="w-4 h-4" />,
}: BreadcrumbProps) {
  const [location] = useLocation();
  
  // Build full breadcrumb list with home
  const allItems: BreadcrumbItem[] = showHome
    ? [{ name: "Home", href: "/" }, ...items]
    : items;

  // Generate JSON-LD schema
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": allItems.map((item, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": item.name,
      "item": item.href.startsWith("http") 
        ? item.href 
        : `https://pakhomiesind.com${item.href}`,
    })),
  };

  return (
    <>
      {/* JSON-LD Schema for SEO */}
      <script type="application/ld+json">
        {JSON.stringify(breadcrumbSchema)}
      </script>

      {/* Visual Breadcrumb Navigation */}
      <nav 
        aria-label="Breadcrumb" 
        className={cn(
          "flex items-center flex-wrap text-sm text-muted-foreground",
          className
        )}
      >
        <ol 
          className="flex items-center flex-wrap gap-1"
          itemScope 
          itemType="https://schema.org/BreadcrumbList"
        >
          {allItems.map((item, index) => {
            const isLast = index === allItems.length - 1;
            
            return (
              <li 
                key={item.href + index}
                className="flex items-center"
                itemProp="itemListElement" 
                itemScope 
                itemType="https://schema.org/ListItem"
              >
                {/* Separator (not for first item) */}
                {index > 0 && (
                  <span className="mx-2 text-muted-foreground/50">
                    {separator}
                  </span>
                )}

                {/* Link or Current Page */}
                {isLast || item.isCurrent ? (
                  <span
                    itemProp="name"
                    className="font-medium text-foreground"
                    aria-current="page"
                  >
                    {item.name}
                  </span>
                ) : (
                  <Link 
                    href={item.href}
                    itemProp="item"
                    className="hover:text-gold transition-colors"
                  >
                    <span itemProp="name">
                      {index === 0 && showHome ? (
                        <span className="flex items-center gap-1">
                          <Home className="w-4 h-4" />
                          <span className="sr-only">Home</span>
                        </span>
                      ) : (
                        item.name
                      )}
                    </span>
                  </Link>
                )}
                
                {/* Hidden position for schema */}
                <meta itemProp="position" content={String(index + 1)} />
              </li>
            );
          })}
        </ol>
      </nav>
    </>
  );
}

/**
 * Hook to generate breadcrumbs based on current route
 */
export function useBreadcrumbs() {
  const [location] = useLocation();
  const path = location.split("?")[0]; // Remove query params
  const segments = path.split("/").filter(Boolean);
  
  const breadcrumbs: BreadcrumbItem[] = [];
  let currentPath = "";
  
  segments.forEach((segment, index) => {
    currentPath += `/${segment}`;
    
    // Format segment name (e.g., "custom-hoodie" → "Custom Hoodie")
    const name = segment
      .replace(/-/g, " ")
      .replace(/\b\w/g, (l) => l.toUpperCase())
      .replace(/\b(Id|Url|Rfq)\b/g, (m) => m.toUpperCase());
    
    breadcrumbs.push({
      name,
      href: currentPath,
      isCurrent: index === segments.length - 1,
    });
  });
  
  return breadcrumbs;
}

/**
 * Predefined breadcrumb configurations for common pages
 */
export const BREADCRUMB_CONFIGS: Record<string, BreadcrumbItem[]> = {
  "/shop": [
    { name: "Shop", href: "/shop", isCurrent: true }
  ],
  
  "/shop/:slug": [
    { name: "Shop", href: "/shop" },
    { name: "Product", href: "#", isCurrent: true }
  ],
  
  "/about": [
    { name: "About Us", href: "/about", isCurrent: true }
  ],
  
  "/services": [
    { name: "Services", href: "/services", isCurrent: true }
  ],
  
  "/portfolio": [
    { name: "Portfolio", href: "/portfolio", isCurrent: true }
  ],
  
  "/blog": [
    { name: "Blog", href: "/blog", isCurrent: true }
  ],
  
  "/blog/:slug": [
    { name: "Blog", href: "/blog" },
    { name: "Article", href: "#", isCurrent: true }
  ],
  
  "/rfq": [
    { name: "Request Quote", href: "/rfq", isCurrent: true }
  ],
  
  "/contact": [
    { name: "Contact", href: "/contact", isCurrent: true }
  ],
  
  "/manufacturing/:region": [
    { name: "Manufacturing", href: "/manufacturing/usa" },
    { name: "Region", href: "#", isCurrent: true }
  ],
};

/**
 * Get breadcrumbs for a specific route
 */
export function getBreadcrumbsForRoute(
  route: string, 
  dynamicParams?: Record<string, string>
): BreadcrumbItem[] {
  // Try exact match first
  if (BREADCRUMB_CONFIGS[route]) {
    return BREADCRUMB_CONFIGS[route];
  }
  
  // Try pattern match (e.g., /shop/custom-hoodie matches /shop/:slug)
  for (const [pattern, items] of Object.entries(BREADCRUMB_CONFIGS)) {
    const regex = new RegExp(
      "^" + pattern.replace(/:[^/]+/g, "([^/]+)") + "$"
    );
    
    if (regex.test(route) && dynamicParams) {
      // Replace dynamic params in breadcrumbs
      return items.map(item => ({
        ...item,
        name: Object.entries(dynamicParams).reduce(
          (name, [key, value]) => name.replace(`:${key}`, value),
          item.name
        ),
      }));
    }
  }
  
  // Generate from path if no config found
  const segments = route.split("/").filter(Boolean);
  let currentPath = "";
  
  return segments.map((segment, index) => {
    currentPath += `/${segment}`;
    return {
      name: segment
        .replace(/-/g, " ")
        .replace(/\b\w/g, (l) => l.toUpperCase()),
      href: currentPath,
      isCurrent: index === segments.length - 1,
    };
  });
}

