/**
 * Analytics & Conversion Tracking Utility
 *
 * Provides type-safe event tracking for GA4 and GTM.
 * Replace G-XXXXXXXXXX and GTM-XXXXXXX in index.html with your actual IDs.
 *
 * @see https://developers.google.com/analytics/devguides/collection/ga4
 */

// Extend Window for GTM dataLayer and gtag
declare global {
  interface Window {
    dataLayer: Record<string, any>[];
    gtag: (...args: any[]) => void;
  }
}

/** Push an event to GTM dataLayer */
export function pushEvent(event: string, data?: Record<string, any>) {
  if (typeof window === "undefined") return;
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({ event, ...data });
}

/** Track GA4 event via gtag */
export function trackEvent(
  eventName: string,
  params?: Record<string, string | number | boolean>
) {
  if (typeof window === "undefined" || !window.gtag) return;
  window.gtag("event", eventName, params);
}

// ─── Pre-defined Conversion Events ──────────────────────────────────

/** Track RFQ form submission */
export function trackRFQSubmission(productType?: string, region?: string) {
  trackEvent("generate_lead", {
    event_category: "conversion",
    event_label: "rfq_submission",
    product_type: productType || "general",
    region: region || "unknown",
    value: 1,
  });
  pushEvent("rfq_submitted", { productType, region });
}

/** Track WhatsApp click */
export function trackWhatsAppClick(source: string) {
  trackEvent("contact", {
    event_category: "engagement",
    event_label: "whatsapp_click",
    contact_method: "whatsapp",
    source,
  });
  pushEvent("whatsapp_click", { source });
}

/** Track contact form submission */
export function trackContactSubmission() {
  trackEvent("generate_lead", {
    event_category: "conversion",
    event_label: "contact_form",
  });
  pushEvent("contact_form_submitted");
}

/** Track product view */
export function trackProductView(
  productName: string,
  productCategory: string,
  productId: string | number
) {
  trackEvent("view_item", {
    event_category: "ecommerce",
    item_name: productName,
    item_category: productCategory,
    item_id: String(productId),
  });
}

/** Track blog post read */
export function trackBlogRead(postTitle: string, postSlug: string) {
  trackEvent("page_view", {
    event_category: "content",
    event_label: "blog_read",
    post_title: postTitle,
    post_slug: postSlug,
  });
}

/** Track quote request from product page */
export function trackQuoteRequest(productName: string, quantity?: number) {
  trackEvent("add_to_cart", {
    event_category: "conversion",
    event_label: "quote_request",
    item_name: productName,
    quantity: quantity || 0,
  });
  pushEvent("quote_requested", { productName, quantity });
}

/** Track geo landing page visit */
export function trackGeoPageVisit(region: string) {
  trackEvent("page_view", {
    event_category: "geo",
    event_label: "geo_landing",
    region,
  });
}

/** Track file download (tech pack, catalog, etc.) */
export function trackDownload(fileName: string, fileType: string) {
  trackEvent("file_download", {
    event_category: "engagement",
    file_name: fileName,
    file_type: fileType,
  });
}

/** Track CTA button clicks */
export function trackCTAClick(ctaName: string, ctaLocation: string) {
  trackEvent("select_content", {
    event_category: "engagement",
    event_label: "cta_click",
    cta_name: ctaName,
    cta_location: ctaLocation,
  });
}

/** Track scroll depth milestones (25%, 50%, 75%, 100%) */
export function initScrollTracking() {
  if (typeof window === "undefined") return;

  const milestones = [25, 50, 75, 100];
  const reached = new Set<number>();

  const handleScroll = () => {
    const scrollPercent = Math.round(
      (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100
    );

    for (const milestone of milestones) {
      if (scrollPercent >= milestone && !reached.has(milestone)) {
        reached.add(milestone);
        trackEvent("scroll", {
          event_category: "engagement",
          event_label: `scroll_${milestone}`,
          percent_scrolled: milestone,
        });
      }
    }
  };

  window.addEventListener("scroll", handleScroll, { passive: true });
  return () => window.removeEventListener("scroll", handleScroll);
}
