# Performance Optimization - BanaYeni SanaEski

**Document Type:** Comprehensive Performance Optimization Guide  
**Created:** August 6, 2025  
**Version:** 1.0  
**Status:** Production Performance Framework  

---

## Performance Overview

This document provides comprehensive performance optimization strategies for BanaYeni SanaEski, focusing on Turkish marketplace requirements, mobile-first performance, and user experience optimization. The optimization framework addresses frontend performance, backend efficiency, database optimization, and infrastructure scaling.

**Performance Targets:**
- **Page Load Time:** <2 seconds for Turkish mobile networks
- **Search Response:** <300ms for Turkish text search queries  
- **Image Loading:** <1 second for part images (2MB max per image)
- **API Response Time:** <500ms for all business operations
- **Mobile Performance:** Optimized for Turkish 3G/4G networks

---

## Performance Architecture

### 1. Performance Monitoring Framework

**Core Web Vitals for Turkish Users:**
```typescript
// lib/performance/web-vitals.ts - Performance monitoring for Turkish marketplace
import { getCLS, getFID, getFCP, getLCP, getTTFB } from 'web-vitals';

export interface TurkishMarketplaceVitals {
  // Core Web Vitals
  lcp: number; // Largest Contentful Paint - Target: <2.5s
  fid: number; // First Input Delay - Target: <100ms
  cls: number; // Cumulative Layout Shift - Target: <0.1
  
  // Additional metrics for Turkish market
  fcp: number; // First Contentful Paint - Target: <1.8s
  ttfb: number; // Time to First Byte - Target: <600ms
  
  // Turkish-specific metrics
  turkishSearchLatency: number; // Turkish text search - Target: <300ms
  imageLoadTime: number; // Part image loading - Target: <1s
  mobilePerformanceScore: number; // Mobile optimization - Target: >90
  
  // User context
  connectionType: string; // 2g, 3g, 4g, wifi
  deviceType: string; // mobile, tablet, desktop
  location?: string; // Turkish city for CDN optimization
}

export class PerformanceTracker {
  private static instance: PerformanceTracker;
  private vitals: Partial<TurkishMarketplaceVitals> = {};

  static getInstance(): PerformanceTracker {
    if (!PerformanceTracker.instance) {
      PerformanceTracker.instance = new PerformanceTracker();
    }
    return PerformanceTracker.instance;
  }

  // Initialize performance tracking for Turkish users
  initializeTurkishTracking(): void {
    // Track Core Web Vitals
    getCLS(this.handleCLS.bind(this));
    getFID(this.handleFID.bind(this));
    getFCP(this.handleFCP.bind(this));
    getLCP(this.handleLCP.bind(this));
    getTTFB(this.handleTTFB.bind(this));

    // Track Turkish-specific metrics
    this.trackTurkishSearchLatency();
    this.trackImageLoadTimes();
    this.trackMobilePerformance();
    this.trackUserContext();
  }

  private handleLCP(metric: any): void {
    this.vitals.lcp = metric.value;
    
    if (metric.value > 2500) {
      this.reportPerformanceIssue('lcp_slow', {
        value: metric.value,
        threshold: 2500,
        recommendation: 'Optimize largest content element'
      });
    }
    
    this.sendVitalMetric('lcp', metric.value);
  }

  private handleFID(metric: any): void {
    this.vitals.fid = metric.value;
    
    if (metric.value > 100) {
      this.reportPerformanceIssue('fid_slow', {
        value: metric.value,
        threshold: 100,
        recommendation: 'Reduce JavaScript execution time'
      });
    }
    
    this.sendVitalMetric('fid', metric.value);
  }

  private handleCLS(metric: any): void {
    this.vitals.cls = metric.value;
    
    if (metric.value > 0.1) {
      this.reportPerformanceIssue('cls_high', {
        value: metric.value,
        threshold: 0.1,
        recommendation: 'Add size attributes to images and reserve space for dynamic content'
      });
    }
    
    this.sendVitalMetric('cls', metric.value);
  }

  private handleFCP(metric: any): void {
    this.vitals.fcp = metric.value;
    
    if (metric.value > 1800) {
      this.reportPerformanceIssue('fcp_slow', {
        value: metric.value,
        threshold: 1800,
        recommendation: 'Optimize critical rendering path for Turkish mobile'
      });
    }
    
    this.sendVitalMetric('fcp', metric.value);
  }

  private handleTTFB(metric: any): void {
    this.vitals.ttfb = metric.value;
    
    if (metric.value > 600) {
      this.reportPerformanceIssue('ttfb_slow', {
        value: metric.value,
        threshold: 600,
        recommendation: 'Optimize server response time or CDN configuration'
      });
    }
    
    this.sendVitalMetric('ttfb', metric.value);
  }

  // Track Turkish text search performance
  private trackTurkishSearchLatency(): void {
    const originalFetch = window.fetch;
    window.fetch = async (input: RequestInfo | URL, init?: RequestInit) => {
      const url = input.toString();
      
      if (url.includes('/api/search') || url.includes('/api/searchParts')) {
        const startTime = performance.now();
        const response = await originalFetch(input, init);
        const endTime = performance.now();
        const latency = endTime - startTime;
        
        this.vitals.turkishSearchLatency = latency;
        
        if (latency > 300) {
          this.reportPerformanceIssue('turkish_search_slow', {
            value: latency,
            threshold: 300,
            recommendation: 'Optimize Turkish text search indexes or caching'
          });
        }
        
        this.sendVitalMetric('turkish_search_latency', latency);
        return response;
      }
      
      return originalFetch(input, init);
    };
  }

  // Track image loading performance for Turkish mobile
  private trackImageLoadTimes(): void {
    const imageObserver = new PerformanceObserver((list) => {
      list.getEntries().forEach((entry) => {
        if (entry.initiatorType === 'img') {
          const loadTime = entry.responseEnd - entry.startTime;
          this.vitals.imageLoadTime = loadTime;
          
          if (loadTime > 1000) {
            this.reportPerformanceIssue('image_load_slow', {
              value: loadTime,
              threshold: 1000,
              url: entry.name,
              recommendation: 'Optimize image compression or use WebP/AVIF format'
            });
          }
          
          this.sendVitalMetric('image_load_time', loadTime);
        }
      });
    });
    
    imageObserver.observe({ type: 'resource', buffered: true });
  }

  // Track mobile performance for Turkish networks
  private trackMobilePerformance(): void {
    if ('connection' in navigator) {
      const connection = (navigator as any).connection;
      this.vitals.connectionType = connection.effectiveType || 'unknown';
      
      // Adjust performance expectations based on connection
      const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
      this.vitals.deviceType = isMobile ? 'mobile' : 'desktop';
      
      // Calculate mobile performance score
      const score = this.calculateMobilePerformanceScore();
      this.vitals.mobilePerformanceScore = score;
      
      if (score < 90) {
        this.reportPerformanceIssue('mobile_performance_low', {
          value: score,
          threshold: 90,
          connectionType: this.vitals.connectionType,
          recommendation: 'Optimize for Turkish mobile networks'
        });
      }
    }
  }

  private trackUserContext(): void {
    // Attempt to detect Turkish user context
    const language = navigator.language || 'unknown';
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    
    if (language.startsWith('tr') || timezone.includes('Istanbul')) {
      this.vitals.location = 'Turkey';
      // Apply Turkish-specific performance optimizations
      this.optimizeForTurkishUsers();
    }
  }

  private calculateMobilePerformanceScore(): number {
    let score = 100;
    
    // Deduct points for slow metrics
    if (this.vitals.lcp && this.vitals.lcp > 2500) score -= 20;
    if (this.vitals.fid && this.vitals.fid > 100) score -= 15;
    if (this.vitals.cls && this.vitals.cls > 0.1) score -= 15;
    if (this.vitals.fcp && this.vitals.fcp > 1800) score -= 15;
    if (this.vitals.ttfb && this.vitals.ttfb > 600) score -= 15;
    if (this.vitals.turkishSearchLatency && this.vitals.turkishSearchLatency > 300) score -= 10;
    if (this.vitals.imageLoadTime && this.vitals.imageLoadTime > 1000) score -= 10;
    
    return Math.max(0, score);
  }

  private optimizeForTurkishUsers(): void {
    // Enable aggressive caching for Turkish users
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw-turkish-optimization.js');
    }
    
    // Prefetch critical Turkish resources
    this.prefetchTurkishResources();
    
    // Optimize images for Turkish mobile networks
    this.enableAdaptiveImageLoading();
  }

  private prefetchTurkishResources(): void {
    const criticalResources = [
      '/api/cities-turkish.json',
      '/api/brands-popular-turkey.json',
      '/styles/turkish-optimized.css'
    ];
    
    criticalResources.forEach(resource => {
      const link = document.createElement('link');
      link.rel = 'prefetch';
      link.href = resource;
      document.head.appendChild(link);
    });
  }

  private enableAdaptiveImageLoading(): void {
    // Implement adaptive image loading based on connection speed
    const connection = (navigator as any).connection;
    if (connection) {
      const lowBandwidth = ['slow-2g', '2g', '3g'].includes(connection.effectiveType);
      
      if (lowBandwidth) {
        // Use lower quality images for slow connections
        document.documentElement.classList.add('low-bandwidth');
      }
    }
  }

  private reportPerformanceIssue(type: string, details: any): void {
    // Report to monitoring service
    if (process.env.NODE_ENV === 'production') {
      // Send to analytics/monitoring service
      console.warn(`Performance issue detected: ${type}`, details);
    }
  }

  private sendVitalMetric(metric: string, value: number): void {
    // Send to analytics service
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'performance_metric', {
        metric_name: metric,
        metric_value: value,
        custom_map: { metric_1: metric },
      });
    }
  }

  // Get performance summary for Turkish marketplace
  getPerformanceSummary(): TurkishMarketplaceVitals {
    return {
      lcp: this.vitals.lcp || 0,
      fid: this.vitals.fid || 0,
      cls: this.vitals.cls || 0,
      fcp: this.vitals.fcp || 0,
      ttfb: this.vitals.ttfb || 0,
      turkishSearchLatency: this.vitals.turkishSearchLatency || 0,
      imageLoadTime: this.vitals.imageLoadTime || 0,
      mobilePerformanceScore: this.vitals.mobilePerformanceScore || 0,
      connectionType: this.vitals.connectionType || 'unknown',
      deviceType: this.vitals.deviceType || 'unknown',
      location: this.vitals.location,
    };
  }
}

// Initialize performance tracking on page load
if (typeof window !== 'undefined') {
  const tracker = PerformanceTracker.getInstance();
  
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      tracker.initializeTurkishTracking();
    });
  } else {
    tracker.initializeTurkishTracking();
  }
}
```

---

## Frontend Performance Optimization

### 2. Code Splitting and Bundle Optimization

**Advanced Bundle Splitting Strategy:**
```typescript
// next.config.js - Optimized for Turkish marketplace performance
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Production optimizations
  swcMinify: true,
  compress: true,
  poweredByHeader: false,
  reactStrictMode: true,
  
  // Turkish localization
  i18n: {
    locales: ['tr'],
    defaultLocale: 'tr',
  },
  
  // Image optimization for Turkish mobile networks
  images: {
    domains: [
      'your-supabase-project.supabase.co',
      'your-cdn-domain.com'
    ],
    formats: ['image/webp', 'image/avif'],
    deviceSizes: [320, 420, 768, 1024, 1200], // Turkish mobile-first sizes
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 86400, // 24 hours
    dangerouslyAllowSVG: false,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
  
  // Performance optimizations for Turkish users
  experimental: {
    optimizeCss: true,
    modularizeImports: {
      'lodash': {
        transform: 'lodash/{{member}}',
      },
      '@heroicons/react/24/outline': {
        transform: '@heroicons/react/24/outline/{{member}}',
      },
    },
    browsersListForSwc: true,
  },
  
  // Webpack optimizations for Turkish marketplace
  webpack: (config, { dev, isServer, webpack }) => {
    // Production optimizations
    if (!dev && !isServer) {
      // Advanced code splitting
      config.optimization.splitChunks = {
        chunks: 'all',
        minSize: 20000,
        maxSize: 244000,
        cacheGroups: {
          // Vendor libraries
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendors',
            priority: 10,
            reuseExistingChunk: true,
          },
          
          // Common components
          common: {
            name: 'common',
            minChunks: 2,
            priority: 5,
            reuseExistingChunk: true,
          },
          
          // Turkish-specific code
          turkish: {
            test: /[\\/](turkish|tr-TR|locale)[\\/]/,
            name: 'turkish-locale',
            priority: 8,
            reuseExistingChunk: true,
          },
          
          // Parts marketplace code
          parts: {
            test: /[\\/](components|lib)[\\/](parts|search|marketplace)[\\/]/,
            name: 'parts-core',
            priority: 7,
            reuseExistingChunk: true,
          },
          
          // Authentication code
          auth: {
            test: /[\\/](supabase|auth)[\\/]/,
            name: 'auth-core',
            priority: 6,
            reuseExistingChunk: true,
          },
        },
      };
      
      // Tree shaking optimization
      config.optimization.usedExports = true;
      config.optimization.sideEffects = false;
      
      // Minimize bundle size for Turkish mobile
      config.optimization.minimize = true;
    }
    
    // Bundle analyzer
    if (process.env.ANALYZE === 'true') {
      config.plugins.push(
        new webpack.BundleAnalyzerPlugin({
          analyzerMode: 'static',
          openAnalyzer: true,
          reportFilename: 'bundle-analysis.html',
        })
      );
    }
    
    // Performance monitoring
    config.plugins.push(
      new webpack.DefinePlugin({
        'process.env.PERFORMANCE_MONITORING': JSON.stringify(process.env.NODE_ENV === 'production'),
      })
    );
    
    return config;
  },
  
  // Headers for Turkish CDN optimization
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Content-Language',
            value: 'tr-TR',
          },
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
        ],
      },
      {
        // Cache static assets for Turkish CDN
        source: '/static/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        // Cache images with Turkish optimization
        source: '/images/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=86400, s-maxage=86400',
          },
          {
            key: 'Vary',
            value: 'Accept, Accept-Encoding',
          },
        ],
      },
    ];
  },
  
  // Redirects for SEO and performance
  async redirects() {
    return [
      {
        source: '/parts',
        destination: '/search',
        permanent: true,
      },
      {
        source: '/ara',
        destination: '/search', 
        permanent: true,
      },
    ];
  },
  
  // Rewrites for API optimization
  async rewrites() {
    return [
      {
        source: '/api/v1/:path*',
        destination: '/api/:path*',
      },
    ];
  },
};

module.exports = withBundleAnalyzer(nextConfig);
```

**Dynamic Component Loading:**
```typescript
// lib/performance/dynamic-loading.ts - Dynamic imports for Turkish marketplace
import dynamic from 'next/dynamic';
import { ComponentType } from 'react';

// Lazy load heavy components with Turkish loading messages
export const DynamicComponents = {
  // Parts search components (critical path)
  SearchForm: dynamic(() => import('@/components/search/SearchForm'), {
    loading: () => <div className="animate-pulse">Arama formu yükleniyor...</div>,
    ssr: true, // Keep SSR for SEO
  }),
  
  PartCard: dynamic(() => import('@/components/parts/PartCard'), {
    loading: () => <div className="animate-pulse bg-gray-200 h-48 rounded"></div>,
    ssr: true,
  }),
  
  // Heavy components (lazy loaded)
  ImageUpload: dynamic(() => import('@/components/parts/ImageUpload'), {
    loading: () => <div className="text-center">Resim yükleme hazırlanıyor...</div>,
    ssr: false, // Not needed for SEO
  }),
  
  ConversationView: dynamic(() => import('@/components/messaging/ConversationView'), {
    loading: () => <div className="text-center">Konuşma yükleniyor...</div>,
    ssr: false,
  }),
  
  AdvancedFilters: dynamic(() => import('@/components/search/AdvancedFilters'), {
    loading: () => <div className="text-sm text-gray-500">Gelişmiş filtreler yükleniyor...</div>,
    ssr: false,
  }),
  
  // Analytics and non-critical components
  AnalyticsDashboard: dynamic(() => import('@/components/analytics/Dashboard'), {
    loading: () => <div className="text-center">İstatistikler yükleniyor...</div>,
    ssr: false,
  }),
  
  // Map components (heavy third-party libraries)
  LocationMap: dynamic(() => import('@/components/maps/LocationMap'), {
    loading: () => <div className="bg-gray-100 h-64 flex items-center justify-center">Harita yükleniyor...</div>,
    ssr: false,
  }),
};

// Dynamic page loading with Turkish optimization
export const DynamicPages = {
  // Admin pages (not critical for most users)
  AdminDashboard: dynamic(() => import('@/pages/admin/dashboard'), {
    loading: () => <div className="text-center p-8">Yönetim paneli yükleniyor...</div>,
    ssr: false,
  }),
  
  // Profile pages (user-specific)
  UserProfile: dynamic(() => import('@/pages/profile'), {
    loading: () => <div className="text-center p-4">Profil yükleniyor...</div>,
    ssr: false, // User-specific content
  }),
  
  // Help and support pages
  HelpCenter: dynamic(() => import('@/pages/help'), {
    loading: () => <div className="text-center">Yardım merkezi yükleniyor...</div>,
    ssr: true, // Good for SEO
  }),
};

// Conditional loading based on user context
export const loadComponentConditionally = <T extends ComponentType<any>>(
  componentLoader: () => Promise<{ default: T }>,
  condition: boolean,
  fallback?: ComponentType
): ComponentType | null => {
  if (!condition) {
    return fallback || null;
  }
  
  return dynamic(componentLoader, {
    loading: () => <div className="animate-pulse">Yükleniyor...</div>,
    ssr: false,
  });
};

// Progressive loading for Turkish mobile networks
export const ProgressiveLoader = {
  // Load critical content first, then enhance
  enhanceWithFeatures: async (features: string[]) => {
    const loadPromises = features.map(async (feature) => {
      switch (feature) {
        case 'advanced-search':
          return import('@/components/search/AdvancedFilters');
        case 'image-gallery':
          return import('@/components/parts/ImageGallery');
        case 'messaging':
          return import('@/components/messaging/MessageCenter');
        case 'notifications':
          return import('@/components/notifications/NotificationCenter');
        default:
          return null;
      }
    });
    
    const results = await Promise.allSettled(loadPromises);
    return results.filter(result => result.status === 'fulfilled');
  },
  
  // Load based on connection speed
  loadBasedOnConnection: async (connectionType: string) => {
    const isSlowConnection = ['slow-2g', '2g', '3g'].includes(connectionType);
    
    if (isSlowConnection) {
      // Load minimal components for slow connections
      return {
        search: await import('@/components/search/BasicSearchForm'),
        parts: await import('@/components/parts/MinimalPartCard'),
      };
    } else {
      // Load full-featured components for fast connections
      return {
        search: await import('@/components/search/SearchForm'),
        parts: await import('@/components/parts/PartCard'),
        extras: await import('@/components/search/AdvancedFilters'),
      };
    }
  },
};
```

### 3. Image Optimization Strategy

**Advanced Image Optimization:**
```typescript
// lib/performance/image-optimization.ts - Turkish marketplace image optimization
import { useState, useEffect } from 'react';

export interface ImageOptimizationOptions {
  quality: number;
  format: 'webp' | 'avif' | 'jpeg' | 'png';
  width: number;
  height?: number;
  priority: boolean;
  lazy: boolean;
  placeholder: 'blur' | 'empty';
  progressive: boolean;
}

export class ImageOptimizationService {
  private static readonly TURKISH_MOBILE_SIZES = [320, 420, 768, 1024];
  private static readonly CDN_BASE_URL = process.env.NEXT_PUBLIC_CDN_URL || '';

  // Optimize images for Turkish mobile networks
  static optimizeForTurkishMobile(
    src: string,
    options: Partial<ImageOptimizationOptions> = {}
  ): ImageOptimizationOptions {
    const connection = this.getConnectionType();
    const deviceWidth = this.getDeviceWidth();
    
    const defaults: ImageOptimizationOptions = {
      quality: this.getQualityForConnection(connection),
      format: this.getFormatForConnection(connection),
      width: this.getOptimalWidth(deviceWidth),
      priority: false,
      lazy: true,
      placeholder: 'blur',
      progressive: true,
    };
    
    return { ...defaults, ...options };
  }

  // Generate responsive image sources for Turkish devices
  static generateResponsiveSources(src: string, alt: string): {
    srcSet: string;
    sizes: string;
    src: string;
  } {
    const baseUrl = this.CDN_BASE_URL || '';
    const extension = src.split('.').pop() || 'jpg';
    const baseName = src.replace(/\.[^/.]+$/, '');
    
    // Generate WebP and AVIF sources for modern browsers
    const webpSrcSet = this.TURKISH_MOBILE_SIZES
      .map(size => `${baseUrl}${baseName}-${size}.webp ${size}w`)
      .join(', ');
    
    const avifSrcSet = this.TURKISH_MOBILE_SIZES
      .map(size => `${baseUrl}${baseName}-${size}.avif ${size}w`)
      .join(', ');
    
    const fallbackSrcSet = this.TURKISH_MOBILE_SIZES
      .map(size => `${baseUrl}${baseName}-${size}.${extension} ${size}w`)
      .join(', ');
    
    return {
      srcSet: avifSrcSet, // Use AVIF as primary for best compression
      sizes: '(max-width: 420px) 320px, (max-width: 768px) 420px, (max-width: 1024px) 768px, 1024px',
      src: `${baseUrl}${baseName}-768.${extension}`, // Fallback for older browsers
    };
  }

  // Generate blur placeholder for Turkish network conditions
  static generateBlurPlaceholder(width: number, height: number): string {
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return '';
    
    // Generate a simple gradient placeholder
    const gradient = ctx.createLinearGradient(0, 0, width, height);
    gradient.addColorStop(0, '#f3f4f6');
    gradient.addColorStop(1, '#e5e7eb');
    
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);
    
    return canvas.toDataURL('image/jpeg', 0.1); // Very low quality placeholder
  }

  // Preload critical images for Turkish marketplace
  static preloadCriticalImages(images: string[]): void {
    images.forEach(src => {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.as = 'image';
      link.href = src;
      link.type = 'image/webp';
      document.head.appendChild(link);
    });
  }

  // Lazy load non-critical images
  static setupLazyLoading(): void {
    if ('IntersectionObserver' in window) {
      const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const img = entry.target as HTMLImageElement;
            const src = img.dataset.src;
            
            if (src) {
              img.src = src;
              img.classList.remove('lazy-loading');
              img.classList.add('lazy-loaded');
              imageObserver.unobserve(img);
            }
          }
        });
      }, {
        rootMargin: '50px 0px', // Start loading 50px before image enters viewport
        threshold: 0.1,
      });

      // Observe all lazy images
      document.querySelectorAll('img[data-src]').forEach(img => {
        imageObserver.observe(img);
      });
    }
  }

  // Progressive image loading for Turkish networks
  static async loadProgressively(src: string, quality: number[] = [20, 50, 90]): Promise<void> {
    return new Promise((resolve) => {
      let currentQuality = 0;
      
      const loadNextQuality = () => {
        if (currentQuality >= quality.length) {
          resolve();
          return;
        }
        
        const img = new Image();
        const qualityParam = quality[currentQuality];
        const progressiveSrc = `${src}?quality=${qualityParam}`;
        
        img.onload = () => {
          // Replace image source in DOM
          const targetImg = document.querySelector(`img[data-progressive-src="${src}"]`) as HTMLImageElement;
          if (targetImg) {
            targetImg.src = progressiveSrc;
            targetImg.style.filter = currentQuality === quality.length - 1 ? 'none' : 'blur(2px)';
          }
          
          currentQuality++;
          setTimeout(loadNextQuality, 100); // Small delay between quality levels
        };
        
        img.src = progressiveSrc;
      };
      
      loadNextQuality();
    });
  }

  // Helper methods
  private static getConnectionType(): string {
    if ('connection' in navigator) {
      return (navigator as any).connection.effectiveType || '4g';
    }
    return '4g';
  }

  private static getDeviceWidth(): number {
    return window.innerWidth || 768;
  }

  private static getQualityForConnection(connection: string): number {
    switch (connection) {
      case 'slow-2g':
      case '2g':
        return 40; // Very low quality for slow connections
      case '3g':
        return 60; // Medium quality
      case '4g':
      default:
        return 80; // High quality for fast connections
    }
  }

  private static getFormatForConnection(connection: string): 'webp' | 'avif' | 'jpeg' {
    const isSlowConnection = ['slow-2g', '2g', '3g'].includes(connection);
    
    if (isSlowConnection) {
      return 'webp'; // Better compression than JPEG
    }
    
    // Check for AVIF support
    const supportsAvif = document.createElement('canvas').toDataURL('image/avif').indexOf('data:image/avif') === 0;
    return supportsAvif ? 'avif' : 'webp';
  }

  private static getOptimalWidth(deviceWidth: number): number {
    if (deviceWidth <= 420) return 320;
    if (deviceWidth <= 768) return 420;
    if (deviceWidth <= 1024) return 768;
    return 1024;
  }
}

// React hook for optimized image loading
export function useOptimizedImage(src: string, options: Partial<ImageOptimizationOptions> = {}) {
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [optimizedSrc, setOptimizedSrc] = useState<string>('');

  useEffect(() => {
    const optimizedOptions = ImageOptimizationService.optimizeForTurkishMobile(src, options);
    
    // Generate optimized image URL
    const params = new URLSearchParams({
      quality: optimizedOptions.quality.toString(),
      format: optimizedOptions.format,
      width: optimizedOptions.width.toString(),
    });
    
    if (optimizedOptions.height) {
      params.append('height', optimizedOptions.height.toString());
    }
    
    const optimizedUrl = `${src}?${params.toString()}`;
    setOptimizedSrc(optimizedUrl);
    
    // Preload the image
    const img = new Image();
    img.onload = () => setIsLoading(false);
    img.onerror = () => {
      setIsError(true);
      setIsLoading(false);
    };
    img.src = optimizedUrl;
  }, [src, options]);

  return {
    src: optimizedSrc,
    isLoading,
    isError,
    placeholder: ImageOptimizationService.generateBlurPlaceholder(
      options.width || 400,
      options.height || 300
    ),
  };
}

// Component for optimized part images
export function OptimizedPartImage({ 
  src, 
  alt, 
  priority = false,
  className = '' 
}: {
  src: string;
  alt: string;
  priority?: boolean;
  className?: string;
}) {
  const { src: optimizedSrc, isLoading, isError, placeholder } = useOptimizedImage(src, {
    priority,
    quality: 80,
    format: 'webp',
    width: 400,
    height: 300,
  });

  if (isError) {
    return (
      <div className={`bg-gray-200 flex items-center justify-center ${className}`}>
        <span className="text-gray-500 text-sm">Resim yüklenemedi</span>
      </div>
    );
  }

  return (
    <div className={`relative ${className}`}>
      {isLoading && (
        <img
          src={placeholder}
          alt=""
          className="absolute inset-0 w-full h-full object-cover blur-sm"
        />
      )}
      <img
        src={optimizedSrc}
        alt={alt}
        className={`w-full h-full object-cover transition-opacity duration-300 ${
          isLoading ? 'opacity-0' : 'opacity-100'
        }`}
        loading={priority ? 'eager' : 'lazy'}
      />
    </div>
  );
}
```

---

## Backend Performance Optimization

### 4. Database Query Optimization

**Turkish Search Performance:**
```sql
-- Advanced indexing strategy for Turkish marketplace
-- PostgreSQL optimization for Turkish text search and filtering

-- Turkish text search optimization
CREATE EXTENSION IF NOT EXISTS pg_trgm;
CREATE EXTENSION IF NOT EXISTS btree_gin;
CREATE EXTENSION IF NOT EXISTS unaccent;

-- Custom Turkish text normalization function
CREATE OR REPLACE FUNCTION turkish_normalize(text) RETURNS text AS $$
BEGIN
  RETURN lower(
    replace(
      replace(
        replace(
          replace(
            replace(
              replace(
                replace(
                  replace(
                    replace($1, 'ç', 'c'),
                    'ğ', 'g'),
                  'ı', 'i'),
                'ö', 'o'),
              'ş', 's'),
            'ü', 'u'),
          'Ç', 'c'),
        'Ğ', 'g'),
      'İ', 'i'),
    'Ö', 'o')
  );
END;
$$ LANGUAGE plpgsql IMMUTABLE STRICT;

-- Advanced search indexes for parts table
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_parts_turkish_search_gin 
ON parts USING GIN (
  to_tsvector('turkish', title || ' ' || part_reference || ' ' || COALESCE(description, ''))
);

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_parts_normalized_search 
ON parts USING GIN (
  (turkish_normalize(title) || ' ' || turkish_normalize(part_reference) || ' ' || 
   COALESCE(turkish_normalize(description), '')) gin_trgm_ops
);

-- Multi-column indexes for common filter combinations
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_parts_brand_model_year 
ON parts (brand, model, year) WHERE status = 'active';

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_parts_city_brand_condition 
ON parts (location_city, brand, condition) WHERE status = 'active';

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_parts_price_range 
ON parts (price) WHERE status = 'active';

-- Composite index for search + filters
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_parts_search_filters 
ON parts USING GIN (
  to_tsvector('turkish', title || ' ' || part_reference),
  brand gin_trgm_ops,
  location_city gin_trgm_ops,
  condition,
  price
) WHERE status = 'active';

-- Covering index for parts list queries
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_parts_list_covering 
ON parts (created_at DESC) 
INCLUDE (id, title, part_reference, condition, price, location_city, brand, model, year, images)
WHERE status = 'active';

-- Optimized Turkish search function with performance monitoring
CREATE OR REPLACE FUNCTION search_parts_turkish_optimized(
  search_query TEXT DEFAULT NULL,
  filter_brand TEXT DEFAULT NULL,
  filter_model TEXT DEFAULT NULL,
  filter_condition TEXT DEFAULT NULL,
  filter_city TEXT DEFAULT NULL,
  min_price DECIMAL DEFAULT NULL,
  max_price DECIMAL DEFAULT NULL,
  year_from INTEGER DEFAULT NULL,
  year_to INTEGER DEFAULT NULL,
  limit_count INTEGER DEFAULT 20,
  offset_count INTEGER DEFAULT 0
)
RETURNS TABLE (
  id UUID,
  title TEXT,
  part_reference TEXT,
  condition TEXT,
  price DECIMAL,
  location_city TEXT,
  brand TEXT,
  model TEXT,
  year INTEGER,
  description TEXT,
  images TEXT[],
  created_at TIMESTAMPTZ,
  search_rank REAL
) AS $$
DECLARE
  query_start_time TIMESTAMP;
  query_plan TEXT;
BEGIN
  -- Performance monitoring
  query_start_time := clock_timestamp();
  
  -- Build dynamic query with proper indexing
  RETURN QUERY
  WITH search_results AS (
    SELECT 
      p.id,
      p.title,
      p.part_reference,
      p.condition,
      p.price,
      p.location_city,
      p.brand,
      p.model,
      p.year,
      p.description,
      p.images,
      p.created_at,
      -- Multi-factor search ranking
      CASE 
        WHEN search_query IS NULL THEN 1.0
        ELSE (
          -- Turkish full-text search score
          ts_rank(
            to_tsvector('turkish', p.title || ' ' || p.part_reference || ' ' || COALESCE(p.description, '')),
            plainto_tsquery('turkish', search_query)
          ) * 0.5 +
          -- Trigram similarity score
          GREATEST(
            similarity(p.title, search_query),
            similarity(p.part_reference, search_query),
            COALESCE(similarity(p.description, search_query), 0)
          ) * 0.3 +
          -- Exact match bonus
          CASE 
            WHEN p.part_reference ILIKE '%' || search_query || '%' THEN 0.2
            ELSE 0
          END
        )
      END AS search_rank
    FROM parts p
    WHERE p.status = 'active'
      -- Text search filter
      AND (
        search_query IS NULL OR
        to_tsvector('turkish', p.title || ' ' || p.part_reference || ' ' || COALESCE(p.description, '')) 
        @@ plainto_tsquery('turkish', search_query)
        OR p.title ILIKE '%' || search_query || '%'
        OR p.part_reference ILIKE '%' || search_query || '%'
      )
      -- Brand filter
      AND (filter_brand IS NULL OR p.brand ILIKE '%' || filter_brand || '%')
      -- Model filter
      AND (filter_model IS NULL OR p.model ILIKE '%' || filter_model || '%')
      -- Condition filter
      AND (filter_condition IS NULL OR p.condition = filter_condition)
      -- City filter
      AND (filter_city IS NULL OR p.location_city = filter_city)
      -- Price range filters
      AND (min_price IS NULL OR p.price >= min_price)
      AND (max_price IS NULL OR p.price <= max_price)
      -- Year range filters
      AND (year_from IS NULL OR p.year >= year_from)
      AND (year_to IS NULL OR p.year <= year_to)
  )
  SELECT 
    sr.id,
    sr.title,
    sr.part_reference,
    sr.condition,
    sr.price,
    sr.location_city,
    sr.brand,
    sr.model,
    sr.year,
    sr.description,
    sr.images,
    sr.created_at,
    sr.search_rank
  FROM search_results sr
  ORDER BY 
    sr.search_rank DESC NULLS LAST,
    sr.created_at DESC
  LIMIT limit_count
  OFFSET offset_count;
  
  -- Log performance metrics
  INSERT INTO query_performance_log (
    query_name,
    execution_time_ms,
    search_query,
    result_count,
    created_at
  ) VALUES (
    'search_parts_turkish_optimized',
    EXTRACT(MILLISECONDS FROM (clock_timestamp() - query_start_time)),
    search_query,
    (SELECT COUNT(*) FROM search_parts_turkish_optimized(
      search_query, filter_brand, filter_model, filter_condition, filter_city,
      min_price, max_price, year_from, year_to, 999999, 0
    )),
    NOW()
  );
  
END;
$$ LANGUAGE plpgsql;

-- Query performance logging table
CREATE TABLE IF NOT EXISTS query_performance_log (
  id SERIAL PRIMARY KEY,
  query_name TEXT NOT NULL,
  execution_time_ms NUMERIC NOT NULL,
  search_query TEXT,
  result_count INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index on performance log for analysis
CREATE INDEX IF NOT EXISTS idx_query_performance_log_created_at 
ON query_performance_log (created_at DESC);

CREATE INDEX IF NOT EXISTS idx_query_performance_log_query_time 
ON query_performance_log (query_name, execution_time_ms);

-- Materialized view for popular searches (updated hourly)
CREATE MATERIALIZED VIEW IF NOT EXISTS popular_turkish_searches AS
SELECT 
  search_query,
  COUNT(*) as search_count,
  AVG(execution_time_ms) as avg_execution_time,
  AVG(result_count) as avg_result_count,
  DATE_TRUNC('hour', created_at) as hour_bucket
FROM query_performance_log 
WHERE search_query IS NOT NULL 
  AND created_at >= NOW() - INTERVAL '24 hours'
GROUP BY search_query, DATE_TRUNC('hour', created_at)
HAVING COUNT(*) >= 5
ORDER BY search_count DESC, avg_execution_time ASC;

-- Unique index for materialized view
CREATE UNIQUE INDEX IF NOT EXISTS idx_popular_searches_unique 
ON popular_turkish_searches (search_query, hour_bucket);

-- Function to refresh popular searches (run via cron)
CREATE OR REPLACE FUNCTION refresh_popular_searches()
RETURNS void AS $$
BEGIN
  REFRESH MATERIALIZED VIEW CONCURRENTLY popular_turkish_searches;
  
  -- Clean old performance logs (keep 7 days)
  DELETE FROM query_performance_log 
  WHERE created_at < NOW() - INTERVAL '7 days';
END;
$$ LANGUAGE plpgsql;

-- Optimized interests query for user activity
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_interests_user_recent 
ON interests (user_id, created_at DESC) 
WHERE type = 'interested';

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_interests_part_count 
ON interests (part_id, type) 
WHERE created_at >= NOW() - INTERVAL '30 days';

-- Function to get user's recent interests with part details
CREATE OR REPLACE FUNCTION get_user_interests_optimized(
  user_id_param UUID,
  limit_count INTEGER DEFAULT 10
)
RETURNS TABLE (
  interest_id UUID,
  part_id UUID,
  part_title TEXT,
  part_reference TEXT,
  part_price DECIMAL,
  part_brand TEXT,
  part_model TEXT,
  seller_email TEXT,
  created_at TIMESTAMPTZ
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    i.id,
    p.id,
    p.title,
    p.part_reference,
    p.price,
    p.brand,
    p.model,
    up.email,
    i.created_at
  FROM interests i
  JOIN parts p ON i.part_id = p.id
  JOIN user_profiles up ON p.seller_id = up.id
  WHERE i.user_id = user_id_param
    AND i.type = 'interested'
    AND p.status = 'active'
  ORDER BY i.created_at DESC
  LIMIT limit_count;
END;
$$ LANGUAGE plpgsql;
```

### 5. API Response Optimization

**Caching and Response Optimization:**
```typescript
// lib/performance/api-optimization.ts - API performance optimization
import { NextApiRequest, NextApiResponse } from 'next';
import { createClient } from '@supabase/supabase-js';
import { LRUCache } from 'lru-cache';

// Multi-level cache configuration for Turkish marketplace
export class ApiCacheManager {
  private static readonly caches = {
    // Hot data cache (in-memory, very fast)
    hot: new LRUCache<string, any>({
      max: 1000,
      ttl: 5 * 60 * 1000, // 5 minutes
    }),
    
    // Warm data cache (larger, longer TTL)
    warm: new LRUCache<string, any>({
      max: 10000,
      ttl: 30 * 60 * 1000, // 30 minutes
    }),
    
    // Cold data cache (persistent, long TTL)
    cold: new LRUCache<string, any>({
      max: 50000,
      ttl: 4 * 60 * 60 * 1000, // 4 hours
    }),
    
    // Turkish-specific cache for common searches
    turkishSearches: new LRUCache<string, any>({
      max: 5000,
      ttl: 15 * 60 * 1000, // 15 minutes
    }),
  };

  // Generate cache key with Turkish optimization
  static generateCacheKey(prefix: string, params: Record<string, any>): string {
    const sortedParams = Object.keys(params)
      .sort()
      .reduce((result, key) => {
        result[key] = params[key];
        return result;
      }, {} as Record<string, any>);
    
    const paramString = JSON.stringify(sortedParams);
    const hash = this.simpleHash(paramString);
    return `${prefix}:${hash}`;
  }

  // Get cached response with fallback strategy
  static get(key: string): any | null {
    // Check hot cache first
    const hotResult = this.caches.hot.get(key);
    if (hotResult) return hotResult;
    
    // Check warm cache
    const warmResult = this.caches.warm.get(key);
    if (warmResult) {
      // Promote to hot cache
      this.caches.hot.set(key, warmResult);
      return warmResult;
    }
    
    // Check cold cache
    const coldResult = this.caches.cold.get(key);
    if (coldResult) {
      // Promote to warm cache
      this.caches.warm.set(key, coldResult);
      return coldResult;
    }
    
    return null;
  }

  // Set cached response with intelligent placement
  static set(key: string, value: any, options: {
    hot?: boolean;
    warm?: boolean;
    cold?: boolean;
    turkish?: boolean;
  } = {}): void {
    if (options.hot || (!options.warm && !options.cold && !options.turkish)) {
      this.caches.hot.set(key, value);
    }
    
    if (options.warm) {
      this.caches.warm.set(key, value);
    }
    
    if (options.cold) {
      this.caches.cold.set(key, value);
    }
    
    if (options.turkish) {
      this.caches.turkishSearches.set(key, value);
    }
  }

  // Get Turkish search from dedicated cache
  static getTurkishSearch(query: string, filters: any): any | null {
    const key = this.generateCacheKey('turkish-search', { query, ...filters });
    return this.caches.turkishSearches.get(key);
  }

  // Set Turkish search in dedicated cache
  static setTurkishSearch(query: string, filters: any, results: any): void {
    const key = this.generateCacheKey('turkish-search', { query, ...filters });
    this.caches.turkishSearches.set(key, results);
  }

  // Clear cache by pattern
  static clearByPattern(pattern: RegExp): void {
    Object.values(this.caches).forEach(cache => {
      cache.forEach((value, key) => {
        if (pattern.test(key)) {
          cache.delete(key);
        }
      });
    });
  }

  // Cache statistics for monitoring
  static getStats(): Record<string, any> {
    return {
      hot: {
        size: this.caches.hot.size,
        max: this.caches.hot.max,
        hitRate: this.caches.hot.calculatedSize / (this.caches.hot.calculatedSize + this.caches.hot.size),
      },
      warm: {
        size: this.caches.warm.size,
        max: this.caches.warm.max,
      },
      cold: {
        size: this.caches.cold.size,
        max: this.caches.cold.max,
      },
      turkishSearches: {
        size: this.caches.turkishSearches.size,
        max: this.caches.turkishSearches.max,
      },
    };
  }

  private static simpleHash(str: string): string {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32bit integer
    }
    return Math.abs(hash).toString(36);
  }
}

// Response compression and optimization middleware
export function withApiOptimization<T extends Record<string, any>>(
  handler: (req: NextApiRequest, res: NextApiResponse) => Promise<void>,
  options: {
    cache?: boolean;
    compress?: boolean;
    rateLimit?: boolean;
    metrics?: boolean;
  } = {}
) {
  return async (req: NextApiRequest, res: NextApiResponse) => {
    const startTime = Date.now();
    const {
      cache = true,
      compress = true,
      rateLimit = true,
      metrics = true
    } = options;

    try {
      // Set performance headers
      res.setHeader('X-Response-Time-Start', startTime.toString());
      
      if (compress) {
        // Enable compression for Turkish mobile networks
        res.setHeader('Content-Encoding', 'gzip');
        res.setHeader('Vary', 'Accept-Encoding');
      }

      // Check cache before processing
      if (cache && req.method === 'GET') {
        const cacheKey = ApiCacheManager.generateCacheKey(
          req.url || 'unknown',
          { ...req.query, ...req.body }
        );
        
        const cached = ApiCacheManager.get(cacheKey);
        if (cached) {
          res.setHeader('X-Cache', 'HIT');
          res.setHeader('X-Response-Time', (Date.now() - startTime).toString());
          return res.status(200).json(cached);
        }
        
        // Intercept response to cache it
        const originalJson = res.json.bind(res);
        res.json = (data: any) => {
          if (res.statusCode === 200) {
            ApiCacheManager.set(cacheKey, data, {
              warm: true,
              turkish: req.url?.includes('/search') || false,
            });
          }
          res.setHeader('X-Cache', 'MISS');
          return originalJson(data);
        };
      }

      // Execute the API handler
      await handler(req, res);

      // Add performance metrics
      if (metrics) {
        const responseTime = Date.now() - startTime;
        res.setHeader('X-Response-Time', responseTime.toString());
        
        // Log slow requests
        if (responseTime > 1000) {
          console.warn(`Slow API request: ${req.url} took ${responseTime}ms`);
        }
      }

    } catch (error) {
      console.error('API optimization error:', error);
      
      // Return error response with Turkish message
      res.status(500).json({
        error: 'Sunucu hatası oluştu', // "Server error occurred" in Turkish
        code: 'INTERNAL_ERROR',
      });
    }
  };
}

// Optimized search API with Turkish caching
export const optimizedTurkishSearch = withApiOptimization(
  async (req: NextApiRequest, res: NextApiResponse) => {
    const {
      query,
      brand,
      model,
      condition,
      city,
      minPrice,
      maxPrice,
      yearFrom,
      yearTo,
      limit = 20,
      offset = 0
    } = req.query;

    // Check Turkish-specific cache first
    const cached = ApiCacheManager.getTurkishSearch(
      query as string || '',
      { brand, model, condition, city, minPrice, maxPrice, yearFrom, yearTo }
    );

    if (cached) {
      res.setHeader('X-Cache', 'HIT-TURKISH');
      return res.status(200).json(cached);
    }

    // Execute optimized search
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    const { data, error } = await supabase.rpc('search_parts_turkish_optimized', {
      search_query: query || null,
      filter_brand: brand || null,
      filter_model: model || null,
      filter_condition: condition || null,
      filter_city: city || null,
      min_price: minPrice ? parseFloat(minPrice as string) : null,
      max_price: maxPrice ? parseFloat(maxPrice as string) : null,
      year_from: yearFrom ? parseInt(yearFrom as string) : null,
      year_to: yearTo ? parseInt(yearTo as string) : null,
      limit_count: parseInt(limit as string),
      offset_count: parseInt(offset as string)
    });

    if (error) {
      console.error('Turkish search error:', error);
      return res.status(500).json({
        error: 'Arama sırasında hata oluştu', // "Error occurred during search"
        code: 'SEARCH_ERROR'
      });
    }

    const response = {
      parts: data || [],
      total: data?.length || 0,
      query: {
        text: query,
        filters: { brand, model, condition, city, minPrice, maxPrice, yearFrom, yearTo },
        pagination: { limit, offset }
      },
      performance: {
        cached: false,
        searchTime: Date.now() - parseInt(res.getHeader('X-Response-Time-Start') as string)
      }
    };

    // Cache Turkish search results
    ApiCacheManager.setTurkishSearch(
      query as string || '',
      { brand, model, condition, city, minPrice, maxPrice, yearFrom, yearTo },
      response
    );

    res.setHeader('X-Cache', 'MISS-TURKISH');
    return res.status(200).json(response);
  },
  { cache: true, compress: true, metrics: true }
);

// Batch API operations for mobile optimization
export class BatchApiOptimizer {
  private static batchQueue: Map<string, any[]> = new Map();
  private static batchTimeouts: Map<string, NodeJS.Timeout> = new Map();

  // Batch similar requests for mobile efficiency
  static batchRequest(
    operation: string,
    params: any,
    callback: (result: any) => void,
    batchDelay: number = 50 // ms
  ): void {
    const batchKey = `${operation}:${this.hashParams(params)}`;
    
    if (!this.batchQueue.has(batchKey)) {
      this.batchQueue.set(batchKey, []);
    }
    
    this.batchQueue.get(batchKey)!.push({ params, callback });
    
    // Clear existing timeout and set new one
    if (this.batchTimeouts.has(batchKey)) {
      clearTimeout(this.batchTimeouts.get(batchKey)!);
    }
    
    this.batchTimeouts.set(batchKey, setTimeout(() => {
      this.executeBatch(operation, batchKey);
    }, batchDelay));
  }

  private static async executeBatch(operation: string, batchKey: string): Promise<void> {
    const batch = this.batchQueue.get(batchKey);
    if (!batch || batch.length === 0) return;

    try {
      // Execute batched operation
      const results = await this.performBatchOperation(operation, batch);
      
      // Send results to callbacks
      batch.forEach((item, index) => {
        item.callback(results[index]);
      });

    } catch (error) {
      // Send error to all callbacks
      batch.forEach(item => {
        item.callback({ error: 'Batch operation failed' });
      });
    } finally {
      // Clean up
      this.batchQueue.delete(batchKey);
      this.batchTimeouts.delete(batchKey);
    }
  }

  private static async performBatchOperation(operation: string, batch: any[]): Promise<any[]> {
    switch (operation) {
      case 'get-parts-details':
        return this.batchGetPartsDetails(batch.map(b => b.params));
      case 'get-user-profiles':
        return this.batchGetUserProfiles(batch.map(b => b.params));
      default:
        throw new Error(`Unknown batch operation: ${operation}`);
    }
  }

  private static async batchGetPartsDetails(partsIds: string[]): Promise<any[]> {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    const { data, error } = await supabase
      .from('parts')
      .select('*')
      .in('id', partsIds);

    if (error) throw error;

    // Maintain order of results
    return partsIds.map(id => data?.find(part => part.id === id) || null);
  }

  private static async batchGetUserProfiles(userIds: string[]): Promise<any[]> {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    const { data, error } = await supabase
      .from('user_profiles')
      .select('id, email, profile_complete')
      .in('id', userIds);

    if (error) throw error;

    return userIds.map(id => data?.find(profile => profile.id === id) || null);
  }

  private static hashParams(params: any): string {
    return JSON.stringify(params);
  }
}
```

---

## Infrastructure Performance

### 6. CDN and Edge Optimization

**Global Performance Strategy:**
```typescript
// lib/performance/cdn-optimization.ts - CDN optimization for Turkish users
export class CDNOptimizationService {
  private static readonly TURKISH_REGIONS = [
    'fra1', // Frankfurt - Primary for Turkish users
    'arn1', // Stockholm - Secondary
    'lhr1', // London - Tertiary
  ];

  private static readonly PERFORMANCE_BUDGETS = {
    // Turkish mobile network targets
    mobile3G: {
      maxBundleSize: 170, // KB
      maxImageSize: 100, // KB per image
      maxTotalSize: 500, // KB
    },
    mobile4G: {
      maxBundleSize: 250, // KB
      maxImageSize: 150, // KB per image
      maxTotalSize: 800, // KB
    },
    wifi: {
      maxBundleSize: 350, // KB
      maxImageSize: 200, // KB per image
      maxTotalSize: 1200, // KB
    },
  };

  // Optimize content delivery for Turkish users
  static getOptimalCDNConfiguration(): CDNConfig {
    return {
      regions: this.TURKISH_REGIONS,
      caching: {
        staticAssets: {
          maxAge: 31536000, // 1 year
          immutable: true,
        },
        apiResponses: {
          turkishSearch: {
            maxAge: 300, // 5 minutes
            staleWhileRevalidate: 600, // 10 minutes
          },
          partDetails: {
            maxAge: 1800, // 30 minutes
            staleWhileRevalidate: 3600, // 1 hour
          },
          userProfiles: {
            maxAge: 0, // No caching for user data
            private: true,
          },
        },
        images: {
          maxAge: 86400, // 24 hours
          formats: ['avif', 'webp', 'jpeg'],
          qualities: [40, 60, 80], // Based on connection speed
          responsive: true,
        },
      },
      compression: {
        enabled: true,
        algorithms: ['brotli', 'gzip'],
        minSize: 1024, // Compress files > 1KB
      },
      security: {
        headers: {
          'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
          'Content-Security-Policy': "default-src 'self'; img-src 'self' data: https:",
          'X-Frame-Options': 'DENY',
          'X-Content-Type-Options': 'nosniff',
        },
      },
      geolocation: {
        redirectRules: [
          {
            country: 'TR',
            region: 'fra1',
            priority: 1,
          },
          {
            continent: 'EU',
            region: 'fra1',
            priority: 2,
          },
        ],
      },
    };
  }

  // Adaptive loading based on Turkish network conditions
  static async loadAdaptiveContent(
    connectionType: string,
    deviceType: string
  ): Promise<AdaptiveLoadingStrategy> {
    const budget = this.getPerformanceBudget(connectionType);
    
    return {
      bundleStrategy: this.getBundleStrategy(budget),
      imageStrategy: this.getImageStrategy(budget, deviceType),
      preloadStrategy: this.getPreloadStrategy(connectionType),
      cacheStrategy: this.getCacheStrategy(connectionType),
    };
  }

  // Service Worker configuration for Turkish marketplace
  static generateServiceWorkerConfig(): ServiceWorkerConfig {
    return {
      caching: {
        // Cache Turkish-specific resources aggressively
        turkishAssets: [
          '/api/cities-turkish.json',
          '/api/brands-popular-turkey.json',
          '/images/turkish-brands/',
          '/styles/turkish-optimized.css',
        ],
        strategies: {
          // Search API - Network first with cache fallback
          searchApi: {
            pattern: /\/api\/search/,
            strategy: 'NetworkFirst',
            options: {
              cacheName: 'turkish-search-cache',
              networkTimeoutSeconds: 3,
              expiration: {
                maxEntries: 1000,
                maxAgeSeconds: 300, // 5 minutes
              },
            },
          },
          
          // Static assets - Cache first
          staticAssets: {
            pattern: /\.(js|css|png|jpg|jpeg|webp|avif|woff2?)$/,
            strategy: 'CacheFirst',
            options: {
              cacheName: 'static-assets',
              expiration: {
                maxEntries: 500,
                maxAgeSeconds: 2592000, // 30 days
              },
            },
          },
          
          // Part images - Stale while revalidate
          partImages: {
            pattern: /\/images\/parts\//,
            strategy: 'StaleWhileRevalidate',
            options: {
              cacheName: 'part-images',
              expiration: {
                maxEntries: 2000,
                maxAgeSeconds: 86400, // 24 hours
              },
            },
          },
        },
      },
      
      backgroundSync: {
        // Sync interest expressions when back online
        interests: {
          tag: 'interest-sync',
          options: {
            maxRetentionTime: 24 * 60, // 24 hours in minutes
          },
        },
        
        // Sync search analytics
        analytics: {
          tag: 'analytics-sync',
          options: {
            maxRetentionTime: 7 * 24 * 60, // 7 days in minutes
          },
        },
      },
      
      pushNotifications: {
        enabled: true,
        vapidKeys: {
          publicKey: process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY,
          privateKey: process.env.VAPID_PRIVATE_KEY,
        },
      },
    };
  }

  // Resource hints for Turkish marketplace
  static generateResourceHints(): ResourceHint[] {
    return [
      // DNS prefetch for external services
      { rel: 'dns-prefetch', href: '//fonts.googleapis.com' },
      { rel: 'dns-prefetch', href: '//your-supabase-project.supabase.co' },
      { rel: 'dns-prefetch', href: '//www.google-analytics.com' },
      
      // Preconnect for critical resources
      { rel: 'preconnect', href: '//fonts.gstatic.com', crossorigin: true },
      { rel: 'preconnect', href: '//your-supabase-project.supabase.co' },
      
      // Prefetch critical Turkish data
      { rel: 'prefetch', href: '/api/cities-turkish.json' },
      { rel: 'prefetch', href: '/api/brands-popular-turkey.json' },
      
      // Preload critical fonts
      {
        rel: 'preload',
        href: '/fonts/inter-var-turkish.woff2',
        as: 'font',
        type: 'font/woff2',
        crossorigin: true,
      },
    ];
  }

  // Performance budget validation
  static validatePerformanceBudget(
    metrics: PerformanceMetrics,
    connectionType: string
  ): ValidationResult {
    const budget = this.getPerformanceBudget(connectionType);
    const violations: string[] = [];

    if (metrics.bundleSize > budget.maxBundleSize) {
      violations.push(`Bundle size (${metrics.bundleSize}KB) exceeds budget (${budget.maxBundleSize}KB)`);
    }

    if (metrics.totalSize > budget.maxTotalSize) {
      violations.push(`Total size (${metrics.totalSize}KB) exceeds budget (${budget.maxTotalSize}KB)`);
    }

    metrics.imageSizes?.forEach((size, index) => {
      if (size > budget.maxImageSize) {
        violations.push(`Image ${index + 1} (${size}KB) exceeds budget (${budget.maxImageSize}KB)`);
      }
    });

    return {
      isValid: violations.length === 0,
      violations,
      recommendations: this.getPerformanceRecommendations(violations),
    };
  }

  // Helper methods
  private static getPerformanceBudget(connectionType: string) {
    switch (connectionType) {
      case 'slow-2g':
      case '2g':
      case '3g':
        return this.PERFORMANCE_BUDGETS.mobile3G;
      case '4g':
        return this.PERFORMANCE_BUDGETS.mobile4G;
      default:
        return this.PERFORMANCE_BUDGETS.wifi;
    }
  }

  private static getBundleStrategy(budget: any): BundleStrategy {
    return {
      splitThreshold: Math.floor(budget.maxBundleSize * 0.3),
      preloadCritical: true,
      lazyLoadNonCritical: true,
      treeShaking: true,
      minification: true,
    };
  }

  private static getImageStrategy(budget: any, deviceType: string): ImageStrategy {
    return {
      formats: ['avif', 'webp', 'jpeg'],
      qualities: deviceType === 'mobile' ? [40, 60] : [60, 80],
      maxSize: budget.maxImageSize,
      lazyLoading: true,
      progressive: true,
      responsive: true,
    };
  }

  private static getPreloadStrategy(connectionType: string): PreloadStrategy {
    const isSlowConnection = ['slow-2g', '2g', '3g'].includes(connectionType);
    
    return {
      criticalResources: isSlowConnection ? 2 : 4,
      prefetchResources: isSlowConnection ? 1 : 3,
      preconnectDomains: isSlowConnection ? 1 : 2,
    };
  }

  private static getCacheStrategy(connectionType: string): CacheStrategy {
    const isSlowConnection = ['slow-2g', '2g', '3g'].includes(connectionType);
    
    return {
      aggressiveMode: isSlowConnection,
      maxCacheSize: isSlowConnection ? 50 : 100, // MB
      offlineSupport: true,
      backgroundSync: true,
    };
  }

  private static getPerformanceRecommendations(violations: string[]): string[] {
    const recommendations: string[] = [];
    
    violations.forEach(violation => {
      if (violation.includes('Bundle size')) {
        recommendations.push('Consider code splitting and dynamic imports');
        recommendations.push('Remove unused dependencies');
        recommendations.push('Use tree shaking optimization');
      }
      
      if (violation.includes('Image')) {
        recommendations.push('Compress images with WebP/AVIF format');
        recommendations.push('Implement responsive images');
        recommendations.push('Use lazy loading for non-critical images');
      }
      
      if (violation.includes('Total size')) {
        recommendations.push('Enable gzip/brotli compression');
        recommendations.push('Implement service worker caching');
        recommendations.push('Use CDN for static assets');
      }
    });
    
    return [...new Set(recommendations)]; // Remove duplicates
  }
}

// TypeScript interfaces
interface CDNConfig {
  regions: string[];
  caching: any;
  compression: any;
  security: any;
  geolocation: any;
}

interface AdaptiveLoadingStrategy {
  bundleStrategy: BundleStrategy;
  imageStrategy: ImageStrategy;
  preloadStrategy: PreloadStrategy;
  cacheStrategy: CacheStrategy;
}

interface ServiceWorkerConfig {
  caching: any;
  backgroundSync: any;
  pushNotifications: any;
}

interface ResourceHint {
  rel: string;
  href: string;
  as?: string;
  type?: string;
  crossorigin?: boolean;
}

interface PerformanceMetrics {
  bundleSize: number;
  totalSize: number;
  imageSizes?: number[];
}

interface ValidationResult {
  isValid: boolean;
  violations: string[];
  recommendations: string[];
}

interface BundleStrategy {
  splitThreshold: number;
  preloadCritical: boolean;
  lazyLoadNonCritical: boolean;
  treeShaking: boolean;
  minification: boolean;
}

interface ImageStrategy {
  formats: string[];
  qualities: number[];
  maxSize: number;
  lazyLoading: boolean;
  progressive: boolean;
  responsive: boolean;
}

interface PreloadStrategy {
  criticalResources: number;
  prefetchResources: number;
  preconnectDomains: number;
}

interface CacheStrategy {
  aggressiveMode: boolean;
  maxCacheSize: number;
  offlineSupport: boolean;
  backgroundSync: boolean;
}
```

---

## Conclusion

This comprehensive performance optimization framework ensures BanaYeni SanaEski delivers exceptional user experience for Turkish mobile users while maintaining scalability and cost-effectiveness. The optimization strategy addresses all critical performance vectors:

**Frontend Performance Excellence:**
- Advanced code splitting and bundle optimization for Turkish mobile networks
- Progressive image loading with WebP/AVIF support for 2MB image constraints
- Service worker implementation for offline capability and background sync
- Comprehensive Web Vitals monitoring with Turkish-specific thresholds

**Backend Optimization Framework:**
- Advanced PostgreSQL indexing with Turkish text search optimization
- Multi-level caching strategy with intelligent cache promotion
- Batched API operations for mobile network efficiency
- Response compression and optimization middleware

**Database Performance Mastery:**
- Turkish full-text search with trigram similarity ranking
- Materialized views for popular searches with hourly refresh cycles
- Query performance logging and optimization feedback loops
- Connection pooling and query plan optimization

**Infrastructure Performance Leadership:**
- CDN configuration optimized for Frankfurt region and Turkish users  
- Adaptive loading strategies based on Turkish network conditions
- Performance budgets enforced for 3G/4G/WiFi connection types
- Edge caching with intelligent invalidation policies

This performance framework positions BanaYeni SanaEski to deliver sub-2-second page loads and sub-300ms search responses, ensuring competitive advantage in the Turkish automotive parts marketplace while supporting sustainable user growth and engagement.

---

*This performance optimization guide serves as the definitive performance implementation reference for the BanaYeni SanaEski Turkish automotive parts marketplace.*