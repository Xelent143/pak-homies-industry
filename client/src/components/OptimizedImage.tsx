import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

interface OptimizedImageProps {
  src: string;
  alt: string;
  className?: string;
  containerClassName?: string;
  loading?: "lazy" | "eager";
  decoding?: "async" | "sync" | "auto";
  fetchPriority?: "high" | "low" | "auto";
  aspectRatio?: string;
  objectFit?: "cover" | "contain" | "fill" | "none" | "scale-down";
  onLoad?: () => void;
  onError?: () => void;
  placeholder?: "blur" | "empty";
  blurDataUrl?: string;
}

/**
 * OptimizedImage Component
 * 
 * A performance-optimized image component that:
 * - Supports WebP/AVIF with JPEG fallback
 * - Implements lazy loading with Intersection Observer
 * - Provides blur placeholder for better LCP
 * - Handles loading states gracefully
 * - Supports priority loading for above-the-fold images
 * 
 * @example
 * <OptimizedImage
 *   src="/images/product.jpg"
 *   alt="Custom hoodie manufacturing in Sialkot Pakistan"
 *   loading="lazy"
 *   aspectRatio="4/3"
 * />
 */
export default function OptimizedImage({
  src,
  alt,
  className,
  containerClassName,
  loading = "lazy",
  decoding = "async",
  fetchPriority = "auto",
  aspectRatio,
  objectFit = "cover",
  onLoad,
  onError,
  placeholder = "empty",
  blurDataUrl,
}: OptimizedImageProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [shouldLoad, setShouldLoad] = useState(loading === "eager");

  // Generate modern format URLs
  const getModernSrc = (originalSrc: string, format: "webp" | "avif") => {
    // If it's an external URL (Manus CDN, Unsplash, etc.), don't transform
    if (originalSrc.startsWith("http") && !originalSrc.includes(window.location.hostname)) {
      return originalSrc;
    }
    // Replace extension with modern format
    return originalSrc.replace(/\.(jpg|jpeg|png)$/i, `.${format}`);
  };

  useEffect(() => {
    // If lazy loading, use Intersection Observer
    if (loading === "lazy" && !shouldLoad) {
      const observer = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting) {
            setShouldLoad(true);
            observer.disconnect();
          }
        },
        {
          rootMargin: "50px", // Start loading 50px before visible
          threshold: 0,
        }
      );

      const img = document.getElementById(`img-${src}`);
      if (img) {
        observer.observe(img);
      }

      return () => observer.disconnect();
    }
  }, [loading, shouldLoad, src]);

  const handleLoad = () => {
    setIsLoaded(true);
    onLoad?.();
  };

  const handleError = () => {
    setHasError(true);
    onError?.();
  };

  // Don't render anything if lazy loading and not yet intersecting
  if (loading === "lazy" && !shouldLoad) {
    return (
      <div
        id={`img-${src}`}
        className={cn(
          "bg-secondary animate-pulse",
          containerClassName
        )}
        style={{ aspectRatio }}
      />
    );
  }

  // Error state
  if (hasError) {
    return (
      <div
        className={cn(
          "bg-secondary flex items-center justify-center",
          containerClassName
        )}
        style={{ aspectRatio }}
      >
        <span className="text-muted-foreground text-sm">Failed to load image</span>
      </div>
    );
  }

  const isExternal = src.startsWith("http");
  
  // For external images, just use the original
  if (isExternal) {
    return (
      <div
        className={cn(
          "relative overflow-hidden",
          containerClassName
        )}
        style={{ aspectRatio }}
      >
        {placeholder === "blur" && blurDataUrl && !isLoaded && (
          <img
            src={blurDataUrl}
            alt=""
            className="absolute inset-0 w-full h-full object-cover blur-sm scale-110"
            aria-hidden="true"
          />
        )}
        <img
          src={src}
          alt={alt}
          loading={loading}
          decoding={decoding}
          // @ts-ignore - fetchPriority is valid but TypeScript may not recognize it
          fetchPriority={fetchPriority}
          onLoad={handleLoad}
          onError={handleError}
          className={cn(
            "w-full h-full transition-opacity duration-300",
            objectFit === "cover" && "object-cover",
            objectFit === "contain" && "object-contain",
            objectFit === "fill" && "object-fill",
            objectFit === "none" && "object-none",
            objectFit === "scale-down" && "object-scale-down",
            !isLoaded && "opacity-0",
            isLoaded && "opacity-100",
            className
          )}
        />
      </div>
    );
  }

  // For local images, use picture element with modern formats
  return (
    <div
      className={cn(
        "relative overflow-hidden",
        containerClassName
      )}
      style={{ aspectRatio }}
    >
      {placeholder === "blur" && blurDataUrl && !isLoaded && (
        <img
          src={blurDataUrl}
          alt=""
          className="absolute inset-0 w-full h-full object-cover blur-sm scale-110"
          aria-hidden="true"
        />
      )}
      <picture>
        {/* AVIF - Best compression, modern browsers */}
        <source
          srcSet={getModernSrc(src, "avif")}
          type="image/avif"
        />
        {/* WebP - Good compression, wide support */}
        <source
          srcSet={getModernSrc(src, "webp")}
          type="image/webp"
        />
        {/* JPEG fallback - Universal support */}
        <img
          src={src}
          alt={alt}
          loading={loading}
          decoding={decoding}
          // @ts-ignore - fetchPriority is valid
          fetchPriority={fetchPriority}
          onLoad={handleLoad}
          onError={handleError}
          className={cn(
            "w-full h-full transition-opacity duration-300",
            objectFit === "cover" && "object-cover",
            objectFit === "contain" && "object-contain",
            objectFit === "fill" && "object-fill",
            objectFit === "none" && "object-none",
            objectFit === "scale-down" && "object-scale-down",
            !isLoaded && "opacity-0",
            isLoaded && "opacity-100",
            className
          )}
        />
      </picture>
    </div>
  );
}

/**
 * Preload critical images for above-the-fold content
 * Call this in your page component's useEffect
 */
export function preloadImage(src: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve();
    img.onerror = reject;
    img.src = src;
  });
}

/**
 * Generate responsive srcSet for an image
 */
export function generateSrcSet(src: string, widths: number[] = [640, 750, 828, 1080, 1200, 1920]): string {
  return widths
    .map((width) => {
      // For external URLs, just append width parameter if supported
      if (src.includes("unsplash.com")) {
        return `${src}&w=${width} ${width}w`;
      }
      // For local images, you'd typically have multiple sizes
      // This is a simplified version
      return `${src} ${width}w`;
    })
    .join(", ");
}
