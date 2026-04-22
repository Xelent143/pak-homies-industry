import { useState } from "react";
import { cn } from "@/lib/utils";
import { isExternalImage } from "@/lib/images";

interface PictureProps {
  src: string;           // Original image path (JPEG/PNG)
  srcWebp?: string;      // WebP version path (optional)
  alt: string;
  className?: string;
  containerClassName?: string;
  loading?: "lazy" | "eager";
  fetchPriority?: "high" | "low" | "auto";
  aspectRatio?: string;
  objectFit?: "cover" | "contain" | "fill" | "none" | "scale-down";
  onLoad?: () => void;
  onError?: () => void;
}

/**
 * Picture Component
 * 
 * Renders an image with WebP format support and JPEG/PNG fallback.
 * Automatically handles external images (no WebP conversion needed).
 * 
 * Features:
 * - WebP with automatic JPEG/PNG fallback
 * - Lazy loading support
 * - Blur-up loading effect
 * - Responsive image handling
 * - Accessibility optimized
 * 
 * @example
 * // With WebP version
 * <Picture
 *   src="/hero.jpg"
 *   srcWebp="/hero.webp"
 *   alt="Custom manufacturing facility"
 *   loading="eager"
 *   fetchPriority="high"
 * />
 * 
 * @example
 * // External image (no WebP)
 * <Picture
 *   src="https://cdn.example.com/image.jpg"
 *   alt="Product image"
 *   loading="lazy"
 * />
 */
export default function Picture({
  src,
  srcWebp,
  alt,
  className,
  containerClassName,
  loading = "lazy",
  fetchPriority = "auto",
  aspectRatio,
  objectFit = "cover",
  onLoad,
  onError,
}: PictureProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  // Check if this is an external image (no WebP available)
  const isExternal = isExternalImage(src);
  
  // Determine if we should use picture element
  const hasWebP = !isExternal && srcWebp;

  const handleLoad = () => {
    setIsLoaded(true);
    onLoad?.();
  };

  const handleError = () => {
    setHasError(true);
    onError?.();
  };

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

  const imageClasses = cn(
    "w-full h-full transition-opacity duration-300",
    objectFit === "cover" && "object-cover",
    objectFit === "contain" && "object-contain",
    objectFit === "fill" && "object-fill",
    objectFit === "none" && "object-none",
    objectFit === "scale-down" && "object-scale-down",
    !isLoaded && "opacity-0",
    isLoaded && "opacity-100",
    className
  );

  // External image or no WebP - use simple img tag
  if (!hasWebP) {
    return (
      <div
        className={cn("relative overflow-hidden", containerClassName)}
        style={{ aspectRatio }}
      >
        <img
          src={src}
          alt={alt}
          loading={loading}
          // @ts-ignore - fetchPriority is valid
          fetchPriority={fetchPriority}
          onLoad={handleLoad}
          onError={handleError}
          className={imageClasses}
        />
      </div>
    );
  }

  // Local image with WebP - use picture element
  return (
    <div
      className={cn("relative overflow-hidden", containerClassName)}
      style={{ aspectRatio }}
    >
      <picture>
        {/* WebP for modern browsers */}
        <source
          srcSet={srcWebp}
          type="image/webp"
        />
        {/* JPEG/PNG fallback for older browsers */}
        <img
          src={src}
          alt={alt}
          loading={loading}
          // @ts-ignore - fetchPriority is valid
          fetchPriority={fetchPriority}
          onLoad={handleLoad}
          onError={handleError}
          className={imageClasses}
        />
      </picture>
    </div>
  );
}

/**
 * Preload a critical image for better LCP
 * Use this for above-the-fold images in your page component
 */
export function preloadPicture(src: string, srcWebp?: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve();
    img.onerror = reject;
    // Prefer WebP if available
    img.src = srcWebp || src;
  });
}

/**
 * Generate srcSet for responsive images
 */
export function generateSrcSet(
  basePath: string,
  widths: number[] = [640, 750, 828, 1080, 1200, 1920]
): string {
  // Check if this is an external URL
  if (isExternalImage(basePath)) {
    // For external URLs (like Unsplash), add width parameter
    if (basePath.includes('unsplash.com')) {
      return widths
        .map((width) => `${basePath}&w=${width} ${width}w`)
        .join(', ');
    }
    return basePath;
  }

  // For local images, assume we have multiple sizes
  // In production, you'd generate these sizes during build
  return widths
    .map((width) => {
      const ext = basePath.split('.').pop();
      const base = basePath.replace(`.${ext}`, '');
      return `${base}-${width}.${ext} ${width}w`;
    })
    .join(', ');
}

/**
 * Picture component with art direction support
 * For different images at different breakpoints
 */
interface ArtDirectedPictureProps extends PictureProps {
  sources: Array<{
    media: string;
    srcSet: string;
    type?: string;
  }>;
}

export function ArtDirectedPicture({
  sources,
  src,
  alt,
  className,
  containerClassName,
  loading = "lazy",
  aspectRatio,
  objectFit = "cover",
}: ArtDirectedPictureProps) {
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <div
      className={cn("relative overflow-hidden", containerClassName)}
      style={{ aspectRatio }}
    >
      <picture>
        {sources.map((source, index) => (
          <source
            key={index}
            media={source.media}
            srcSet={source.srcSet}
            type={source.type}
          />
        ))}
        <img
          src={src}
          alt={alt}
          loading={loading}
          onLoad={() => setIsLoaded(true)}
          className={cn(
            "w-full h-full transition-opacity duration-300",
            objectFit === "cover" && "object-cover",
            !isLoaded && "opacity-0",
            isLoaded && "opacity-100",
            className
          )}
        />
      </picture>
    </div>
  );
}
