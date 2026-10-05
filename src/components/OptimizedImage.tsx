import React, { useState, useEffect, useRef } from 'react';

export interface OptimizedImageProps {
  src: string; // Base image path (or WebP path)
  fallbackSrc?: string; // Fallback JPEG/PNG path
  alt: string;
  className?: string;
  width?: number | string;
  height?: number | string;
  priority?: boolean; // If true, eager loads (e.g. for LCP hero banner)
  objectFit?: 'cover' | 'contain' | 'fill' | 'none';
  blurDataURL?: string; // Micro placeholder blur
  onClick?: () => void;
  sizes?: string;
}

/**
 * ⚡ OptimizedImage Component (Image Code-Splitting & WebP Acceleration)
 * - تحميل فائق السرعة يعتمد صيغة WebP أولاً مع دعم الرجوع التلقائي
 * - تقطيع الكود والتحميل الكسول المتكيف مع سرعة شبكة الجوال (2G / 3G / 4G / Data-Saver)
 * - فك تشفير غير متزامن (async decoding) لمنع تجميد واجهة المستخدم (Zero Main-Thread Janks)
 * - هيكل تحميل ضبابي ناعم (Blur-Up Shimmer Effect)
 */
export const OptimizedImage: React.FC<OptimizedImageProps> = ({
  src,
  fallbackSrc,
  alt,
  className = '',
  width,
  height,
  priority = false,
  objectFit = 'cover',
  blurDataURL,
  onClick,
  sizes = '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw',
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(priority);
  const [hasError, setHasError] = useState(false);
  const imgRef = useRef<HTMLDivElement>(null);

  // Network connection speed check (Data-Saver / 2G / 3G)
  const isSlowNetwork = typeof navigator !== 'undefined' && 'connection' in navigator && (
    (navigator as any).connection?.saveData ||
    (navigator as any).connection?.effectiveType === '2g' ||
    (navigator as any).connection?.effectiveType === '3g'
  );

  // Derive WebP and Fallback paths
  const getWebPSource = (pathStr: string) => {
    if (pathStr.endsWith('.webp')) return pathStr;
    const dotIdx = pathStr.lastIndexOf('.');
    if (dotIdx !== -1) {
      return `${pathStr.substring(0, dotIdx)}.webp`;
    }
    return `${pathStr}.webp`;
  };

  const webpSrc = src.endsWith('.webp') ? src : getWebPSource(src);
  const regularSrc = fallbackSrc || src;

  // IntersectionObserver for lazy viewport code-splitting
  useEffect(() => {
    if (priority) {
      setIsInView(true);
      return;
    }

    if (typeof window === 'undefined' || !('IntersectionObserver' in window)) {
      setIsInView(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsInView(true);
            observer.disconnect();
          }
        });
      },
      {
        rootMargin: isSlowNetwork ? '300px' : '150px', // Preload earlier on mobile
        threshold: 0.01,
      }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => {
      observer.disconnect();
    };
  }, [priority, isSlowNetwork]);

  return (
    <div
      ref={imgRef}
      onClick={onClick}
      className={`relative overflow-hidden ${onClick ? 'cursor-pointer' : ''} ${className}`}
      style={{
        width: width ? (typeof width === 'number' ? `${width}px` : width) : '100%',
        height: height ? (typeof height === 'number' ? `${height}px` : height) : 'auto',
      }}
    >
      {/* 🌟 Blur-Up Shimmer Placeholder */}
      {!isLoaded && !hasError && (
        <div 
          className="absolute inset-0 bg-gradient-to-r from-slate-100 via-amber-50/50 to-slate-100 animate-pulse flex items-center justify-center pointer-events-none"
          style={blurDataURL ? { backgroundImage: `url(${blurDataURL})`, backgroundSize: 'cover', filter: 'blur(10px)' } : undefined}
        >
          <div className="w-5 h-5 rounded-full border-2 border-amber-600/30 border-t-amber-600 animate-spin" />
        </div>
      )}

      {/* 🖼️ Picture element with WebP-First Code-Splitting */}
      {isInView && (
        <picture>
          {/* 1. Next-Gen Modern WebP Asset */}
          <source
            type="image/webp"
            srcSet={webpSrc}
            sizes={sizes}
          />

          {/* 2. Fallback Traditional Asset */}
          <source
            type="image/jpeg"
            srcSet={regularSrc}
            sizes={sizes}
          />

          {/* 3. Base HTML Image Element with Async Decoding */}
          <img
            src={regularSrc}
            alt={alt}
            loading={priority ? 'eager' : 'lazy'}
            decoding="async"
            onLoad={() => setIsLoaded(true)}
            onError={() => {
              setHasError(true);
              setIsLoaded(true);
            }}
            className={`w-full h-full transition-opacity duration-300 ${
              objectFit === 'cover' ? 'object-cover' : objectFit === 'contain' ? 'object-contain' : ''
            } ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
          />
        </picture>
      )}
    </div>
  );
};

export default OptimizedImage;
