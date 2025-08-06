# Deployment Guide - BanaYeni SanaEski

**Document Type:** Complete Production Deployment Guide  
**Created:** August 6, 2025  
**Version:** 1.0  
**Status:** Production Deployment Instructions  

---

## Deployment Overview

This guide provides comprehensive instructions for deploying BanaYeni SanaEski to production environments. The deployment strategy uses Vercel for frontend hosting and Supabase for backend services, optimized for Turkish users with Frankfurt region deployment and Turkish mobile network performance.

**Deployment Architecture:**
- **Frontend Hosting:** Vercel with global CDN and Frankfurt edge priority
- **Backend Platform:** Supabase with European region deployment
- **Database:** PostgreSQL via Supabase with Turkish text optimization
- **File Storage:** Supabase Storage with CDN delivery
- **Domain Management:** Custom domain with SSL/TLS termination

---

## Pre-Deployment Checklist

### Environment Validation

**Code Readiness:**
- [ ] All features tested and working in development
- [ ] Turkish text search functionality validated
- [ ] Interest-gating system tested end-to-end
- [ ] Image upload and storage working correctly
- [ ] Database migration completed and validated
- [ ] All environment variables configured
- [ ] TypeScript compilation successful with no errors
- [ ] ESLint and code quality checks passing

**Performance Validation:**
- [ ] Search performance under 300ms for Turkish queries
- [ ] Image optimization confirmed (WebP/AVIF support)
- [ ] Bundle size analysis completed (<300KB initial load)
- [ ] Mobile performance tested on Turkish network conditions
- [ ] Database indexes optimized for production queries

**Security Validation:**
- [ ] Row Level Security (RLS) policies tested
- [ ] Authentication flows validated
- [ ] API endpoints secured with proper authorization
- [ ] Sensitive data properly encrypted
- [ ] HTTPS configuration confirmed

---

## Supabase Production Setup

### 1. Production Supabase Project

**Create Production Project:**
```bash
# Login to Supabase CLI (install if needed)
npm install -g supabase
supabase login

# Create new project via CLI or web interface
# Recommended settings:
# - Name: banayeni-sanaeski-prod
# - Region: Europe (Frankfurt) - eu-central-1
# - Plan: Pro (for production workloads)
```

**Database Configuration:**
```sql
-- Connect to production Supabase SQL Editor
-- Run complete schema deployment

-- 1. Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS pg_trgm;
CREATE EXTENSION IF NOT EXISTS btree_gin;
CREATE EXTENSION IF NOT EXISTS pg_stat_statements;

-- 2. Deploy complete schema (from database-schema.md)
-- Run all table creation scripts:
-- - user_profiles
-- - parts  
-- - interests
-- - conversations
-- - messages

-- 3. Deploy all indexes for Turkish text search
-- Critical indexes for production performance:
CREATE INDEX CONCURRENTLY idx_parts_turkish_fts ON public.parts USING GIN (
    to_tsvector('turkish', title || ' ' || part_reference || ' ' || COALESCE(description, ''))
);

CREATE INDEX CONCURRENTLY idx_parts_search_text ON public.parts USING GIN (
    (title || ' ' || part_reference || ' ' || COALESCE(description, '')) gin_trgm_ops
);

-- 4. Deploy all RLS policies
-- Verify policies are enabled and working correctly

-- 5. Deploy Turkish search functions
-- Including search_parts_turkish function with all optimizations
```

**Production Database Settings:**
```sql
-- Optimize PostgreSQL for Turkish marketplace workload
-- These settings should be applied via Supabase dashboard or support

-- Connection settings for production load
-- max_connections = 100
-- shared_preload_libraries = 'pg_stat_statements,pg_trgm'

-- Memory settings optimized for search performance  
-- work_mem = '32MB'  -- For complex search queries
-- maintenance_work_mem = '256MB'  -- For index maintenance
-- effective_cache_size = '2GB'  -- Assuming 4GB RAM instance

-- Turkish text search optimization
-- default_text_search_config = 'turkish'

-- Query optimization
-- random_page_cost = 1.5  -- SSD storage optimization
-- seq_page_cost = 1.0
-- cpu_tuple_cost = 0.03
-- cpu_operator_cost = 0.0025
-- cpu_index_tuple_cost = 0.01

-- Logging for performance monitoring
-- log_min_duration_statement = 1000  -- Log slow queries (>1s)
-- log_checkpoints = on
-- log_connections = on
-- log_disconnections = on
-- log_lock_waits = on
```

### 2. Storage Configuration

**Create Storage Buckets:**
```sql
-- Part images storage bucket
INSERT INTO storage.buckets (id, name, public, allowed_mime_types, file_size_limit) 
VALUES (
    'part-images', 
    'part-images', 
    true,
    ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/avif']::text[],
    2097152  -- 2MB limit for Turkish mobile optimization
);

-- Storage policies for part images
CREATE POLICY "Anyone can view part images"
ON storage.objects FOR SELECT
USING (bucket_id = 'part-images');

CREATE POLICY "Authenticated users can upload images"
ON storage.objects FOR INSERT
WITH CHECK (
    bucket_id = 'part-images' 
    AND auth.role() = 'authenticated'
    AND (storage.foldername(name))[1] = auth.uid()::text
);

CREATE POLICY "Users can update own images"
ON storage.objects FOR UPDATE
USING (
    bucket_id = 'part-images' 
    AND auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can delete own images"
ON storage.objects FOR DELETE
USING (
    bucket_id = 'part-images' 
    AND auth.uid()::text = (storage.foldername(name))[1]
);
```

**CDN and Image Optimization:**
```typescript
// Configure image transformation for Turkish mobile networks
// Add to next.config.js
const nextConfig = {
  images: {
    domains: [
      'your-supabase-project.supabase.co',
      'your-custom-domain.com'
    ],
    formats: ['image/webp', 'image/avif'],
    deviceSizes: [320, 420, 768, 1024, 1200],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 86400, // 24 hours cache
    dangerouslyAllowSVG: false,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  }
};
```

### 3. Authentication Configuration

**Auth Settings:**
```typescript
// Configure Supabase Auth for Turkish users
// Via Supabase Dashboard > Authentication > Settings

// Site URL (production domain)
// https://banayeni-sanaeski.com

// Redirect URLs
// https://banayeni-sanaeski.com/auth/callback
// https://banayeni-sanaeski.com/auth/confirm

// JWT Settings
// JWT expiry: 3600 (1 hour)
// Refresh token expiry: 2592000 (30 days)

// Email Auth Settings
// Enable email confirmations: true
// Enable email change confirmations: true
// Secure email change: true (recommended for Turkish data protection)

// Password Policy
// Minimum password length: 8
// Require uppercase: false (for Turkish user friendliness)
// Require lowercase: false
// Require numbers: true
// Require special characters: false
```

**Email Templates (Turkish):**
```html
<!-- Confirmation Email Template -->
<h2>Hesabınızı Doğrulayın</h2>
<p>BanaYeni SanaEski'ye hoş geldiniz!</p>
<p>Hesabınızı doğrulamak için aşağıdaki bağlantıya tıklayın:</p>
<p><a href="{{ .ConfirmationURL }}">Hesabımı Doğrula</a></p>
<p>Bu işlemi siz yapmadıysanız, bu e-postayı göz ardı edebilirsiniz.</p>

<!-- Reset Password Template -->
<h2>Şifre Sıfırlama</h2>
<p>Şifrenizi sıfırlamak için bir istek aldık.</p>
<p>Şifrenizi sıfırlamak için aşağıdaki bağlantıya tıklayın:</p>
<p><a href="{{ .ConfirmationURL }}">Şifremi Sıfırla</a></p>
<p>Bu işlemi siz yapmadıysanız, bu e-postayı güvenle silebilirsiniz.</p>
```

---

## Vercel Production Deployment

### 1. Vercel Project Setup

**Connect Repository:**
```bash
# Install Vercel CLI
npm install -g vercel

# Login to Vercel
vercel login

# Import project from Git repository
vercel --cwd /path/to/project

# Configure deployment settings:
# - Framework: Next.js
# - Build Command: npm run build
# - Output Directory: .next
# - Install Command: npm install
# - Development Command: npm run dev
```

**Project Configuration:**
```typescript
// vercel.json - Production deployment configuration
{
  "version": 2,
  "regions": ["fra1"], // Frankfurt region for Turkish users
  "builds": [
    {
      "src": "next.config.js",
      "use": "@vercel/next",
      "config": {
        "maxDuration": 30
      }
    }
  ],
  "routes": [
    {
      "src": "/api/(.*)",
      "dest": "/api/$1",
      "headers": {
        "cache-control": "s-maxage=0"
      }
    }
  ],
  "functions": {
    "pages/api/**/*.js": {
      "maxDuration": 30,
      "regions": ["fra1"]
    }
  },
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "Content-Language",
          "value": "tr-TR"
        },
        {
          "key": "X-Frame-Options",
          "value": "DENY"
        },
        {
          "key": "X-Content-Type-Options",
          "value": "nosniff"
        },
        {
          "key": "Referrer-Policy",
          "value": "strict-origin-when-cross-origin"
        },
        {
          "key": "Permissions-Policy",
          "value": "camera=(), microphone=(), geolocation=()"
        }
      ]
    },
    {
      "source": "/images/(.*)",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "public, max-age=86400, s-maxage=86400"
        }
      ]
    }
  ]
}
```

### 2. Environment Variables

**Production Environment Variables:**
```bash
# Production environment variables in Vercel Dashboard
# Settings > Environment Variables

# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-production-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-production-service-role-key

# Application Configuration
NEXT_PUBLIC_APP_URL=https://banayeni-sanaeski.com
NEXT_PUBLIC_DEFAULT_LOCALE=tr-TR
NEXT_PUBLIC_DEFAULT_TIMEZONE=Europe/Istanbul
NEXT_PUBLIC_CURRENCY=TRY

# File Upload Configuration (Turkish Mobile Optimized)
MAX_FILE_SIZE=2097152
MAX_FILES_PER_PART=5
ALLOWED_FILE_TYPES=image/jpeg,image/png,image/webp,image/avif

# Performance Configuration
NEXT_PUBLIC_API_TIMEOUT=10000
DATABASE_CONNECTION_LIMIT=20
CACHE_TTL=300

# Production Environment
NODE_ENV=production
NEXT_PUBLIC_ENV=production

# Analytics and Monitoring
NEXT_PUBLIC_VERCEL_ANALYTICS_ID=your-analytics-id
SENTRY_DSN=your-sentry-dsn
SENTRY_ORG=your-org
SENTRY_PROJECT=banayeni-sanaeski

# Turkish Market Specific
NEXT_PUBLIC_GOOGLE_ADS_ID=your-google-ads-id-turkey
NEXT_PUBLIC_FACEBOOK_PIXEL_ID=your-facebook-pixel-id

# Security
NEXTAUTH_SECRET=your-secure-secret-key
NEXTAUTH_URL=https://banayeni-sanaeski.com
```

### 3. Domain Configuration

**Custom Domain Setup:**
```bash
# Add domain via Vercel Dashboard or CLI
vercel domains add banayeni-sanaeski.com

# Configure DNS records:
# A Record: @ -> 76.76.19.61 (Vercel)
# CNAME Record: www -> cname.vercel-dns.com

# SSL Certificate (automatic via Vercel)
# - Automatic SSL provisioning via Let's Encrypt
# - HTTPS redirect enabled
# - HSTS headers configured
```

**DNS Configuration for Turkish Users:**
```bash
# Recommended DNS settings for optimal Turkish performance
# Use Cloudflare or similar CDN for additional optimization

# Main domain
banayeni-sanaeski.com A 76.76.19.61
www.banayeni-sanaeski.com CNAME cname.vercel-dns.com

# Additional performance optimizations
# Enable Cloudflare proxy for Turkish users if using Cloudflare DNS
# Configure Cloudflare settings:
# - SSL/TLS: Full (strict)
# - Always Use HTTPS: On
# - Minimum TLS Version: 1.2
# - HSTS: Enabled
# - Brotli Compression: Enabled
```

---

## Production Optimizations

### 1. Performance Optimization

**Next.js Production Configuration:**
```typescript
// next.config.js - Production optimizations
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

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
  
  // Image optimization for Turkish mobile
  images: {
    domains: ['your-supabase-project.supabase.co'],
    formats: ['image/webp', 'image/avif'],
    deviceSizes: [320, 420, 768, 1024, 1200],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 86400,
  },
  
  // Performance optimizations
  experimental: {
    optimizeCss: true,
    modularizeImports: {
      'lodash': {
        transform: 'lodash/{{member}}',
      },
    },
  },
  
  // Webpack optimizations
  webpack: (config, { dev, isServer }) => {
    if (!dev && !isServer) {
      // Production bundle optimizations
      config.optimization.splitChunks = {
        chunks: 'all',
        cacheGroups: {
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendors',
            chunks: 'all',
            priority: 10,
          },
          common: {
            name: 'common',
            minChunks: 2,
            chunks: 'all',
            priority: 5,
          },
          default: {
            minChunks: 2,
            priority: -10,
          },
        },
      };
      
      // Tree shaking optimizations
      config.optimization.usedExports = true;
      config.optimization.sideEffects = false;
    }
    
    return config;
  },
  
  // Headers for Turkish users
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
        ],
      },
      {
        source: '/api/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, s-maxage=300, stale-while-revalidate=600',
          },
        ],
      },
    ];
  },
  
  // Redirects for SEO
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
};

module.exports = withBundleAnalyzer(nextConfig);
```

**Database Connection Optimization:**
```typescript
// lib/supabase-prod.ts - Production Supabase client
import { createClient } from '@supabase/supabase-js';
import type { Database } from '@/types/database';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// Production optimized client
export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    flowType: 'pkce', // More secure for production
  },
  db: {
    schema: 'public',
  },
  realtime: {
    params: {
      eventsPerSecond: 10, // Rate limit for Turkish mobile networks
    },
  },
  global: {
    headers: {
      'User-Agent': 'BanaYeni-SanaEski/1.0',
    },
  },
});

// Connection pool management for API routes
export const getSupabaseServiceClient = () => {
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
  
  return createClient<Database>(supabaseUrl, serviceKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
    db: {
      schema: 'public',
    },
    global: {
      headers: {
        'User-Agent': 'BanaYeni-SanaEski-Service/1.0',
      },
    },
  });
};
```

### 2. Caching Strategy

**CDN and Edge Caching:**
```typescript
// API caching configuration for Turkish marketplace
export const cacheConfig = {
  // Static content caching
  static: {
    maxAge: 31536000, // 1 year
    sMaxAge: 31536000,
    staleWhileRevalidate: false,
  },
  
  // API response caching
  api: {
    search: {
      maxAge: 0,
      sMaxAge: 300, // 5 minutes edge cache
      staleWhileRevalidate: 600, // 10 minutes stale
    },
    parts: {
      maxAge: 60, // 1 minute browser cache
      sMaxAge: 300, // 5 minutes edge cache
      staleWhileRevalidate: 3600, // 1 hour stale
    },
    user: {
      maxAge: 0, // No browser cache for user data
      sMaxAge: 0, // No edge cache for user data
      staleWhileRevalidate: false,
    },
  },
  
  // Image caching
  images: {
    maxAge: 86400, // 24 hours browser cache
    sMaxAge: 604800, // 1 week edge cache
    staleWhileRevalidate: false,
  },
};

// Apply caching headers in API routes
export const withCaching = (
  handler: (req: NextApiRequest, res: NextApiResponse) => Promise<void>,
  cacheType: keyof typeof cacheConfig.api
) => {
  return async (req: NextApiRequest, res: NextApiResponse) => {
    const config = cacheConfig.api[cacheType];
    
    res.setHeader(
      'Cache-Control',
      `public, max-age=${config.maxAge}, s-maxage=${config.sMaxAge}${
        config.staleWhileRevalidate ? `, stale-while-revalidate=${config.staleWhileRevalidate}` : ''
      }`
    );
    
    return handler(req, res);
  };
};
```

---

## Monitoring and Analytics

### 1. Error Monitoring Setup

**Sentry Configuration:**
```typescript
// sentry.config.js - Production error monitoring
import * as Sentry from '@sentry/nextjs';

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV,
  tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,
  
  // Turkish marketplace specific configuration
  beforeSend(event, hint) {
    // Filter out known Turkish character encoding issues
    if (event.exception) {
      const error = hint.originalException;
      if (error instanceof Error && error.message.includes('encoding')) {
        return null; // Don't send encoding errors
      }
    }
    
    // Add Turkish user context
    if (event.user) {
      event.tags = {
        ...event.tags,
        region: 'Turkey',
        locale: 'tr-TR',
      };
    }
    
    return event;
  },
  
  // Performance monitoring
  beforeTransaction(context) {
    context.tags = {
      ...context.tags,
      turkish_marketplace: true,
    };
    
    return context;
  },
});
```

**Custom Error Tracking:**
```typescript
// lib/error-tracking.ts - Turkish marketplace error tracking
import * as Sentry from '@sentry/nextjs';

interface TurkishMarketplaceError {
  operation: string;
  userId?: string;
  partId?: string;
  searchQuery?: string;
  error: Error;
  context?: Record<string, unknown>;
}

export const trackTurkishMarketplaceError = (errorInfo: TurkishMarketplaceError) => {
  Sentry.withScope((scope) => {
    // Set Turkish marketplace context
    scope.setTag('operation', errorInfo.operation);
    scope.setTag('marketplace', 'turkish_parts');
    
    // User context (if available)
    if (errorInfo.userId) {
      scope.setUser({ id: errorInfo.userId });
    }
    
    // Part context (if relevant)
    if (errorInfo.partId) {
      scope.setContext('part', { partId: errorInfo.partId });
    }
    
    // Search context (if relevant)
    if (errorInfo.searchQuery) {
      scope.setContext('search', { 
        query: errorInfo.searchQuery,
        hasTurkish: /[çğıöşüÇĞIİÖŞÜ]/.test(errorInfo.searchQuery)
      });
    }
    
    // Additional context
    if (errorInfo.context) {
      scope.setContext('marketplace', errorInfo.context);
    }
    
    Sentry.captureException(errorInfo.error);
  });
};

// Track Turkish search performance
export const trackSearchPerformance = (query: string, duration: number, resultCount: number) => {
  Sentry.addBreadcrumb({
    message: 'Turkish search performed',
    category: 'search',
    data: {
      query: query,
      duration: duration,
      resultCount: resultCount,
      hasTurkishChars: /[çğıöşüÇĞIİÖŞÜ]/.test(query),
    },
    level: 'info',
  });
  
  // Track slow searches
  if (duration > 1000) {
    Sentry.captureMessage('Slow Turkish search detected', 'warning');
  }
};
```

### 2. Analytics Setup

**Vercel Analytics:**
```typescript
// pages/_app.tsx - Analytics integration
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/next';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Component {...pageProps} />
      <Analytics />
      <SpeedInsights />
    </>
  );
}
```

**Custom Turkish Marketplace Analytics:**
```typescript
// lib/analytics.ts - Turkish marketplace analytics
interface TurkishMarketplaceEvent {
  action: string;
  category: string;
  label?: string;
  value?: number;
  turkishContext?: {
    hasWrote Turkish?: boolean;
    city?: string;
    partReference?: string;
  };
}

export const trackTurkishMarketplaceEvent = (event: TurkishMarketplaceEvent) => {
  // Google Analytics 4
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', event.action, {
      event_category: event.category,
      event_label: event.label,
      value: event.value,
      custom_parameters: {
        turkish_marketplace: true,
        ...event.turkishContext,
      },
    });
  }
  
  // Vercel Analytics
  if (typeof window !== 'undefined' && window.va) {
    window.va('track', event.action, {
      category: event.category,
      label: event.label,
      value: event.value,
      ...event.turkishContext,
    });
  }
};

// Track search events
export const trackPartSearch = (query: string, resultCount: number) => {
  trackTurkishMarketplaceEvent({
    action: 'search',
    category: 'parts',
    label: query,
    value: resultCount,
    turkishContext: {
      hasTurkishChars: /[çğıöşüÇĞIİÖŞÜ]/.test(query),
    },
  });
};

// Track interest expressions
export const trackInterestExpression = (partId: string, type: 'interested' | 'not_interested') => {
  trackTurkishMarketplaceEvent({
    action: 'express_interest',
    category: 'engagement',
    label: type,
    value: type === 'interested' ? 1 : 0,
  });
};
```

---

## Health Checks and Monitoring

### 1. Application Health Monitoring

**Health Check API:**
```typescript
// pages/api/health.ts - Production health check
import type { NextApiRequest, NextApiResponse } from 'next';
import { supabase } from '@/lib/supabase-prod';

interface HealthCheckResult {
  status: 'healthy' | 'degraded' | 'unhealthy';
  timestamp: string;
  checks: {
    database: boolean;
    storage: boolean;
    search: boolean;
  };
  performance: {
    databaseLatency: number;
    searchLatency: number;
  };
  version: string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<HealthCheckResult>
) {
  const startTime = Date.now();
  const checks = {
    database: false,
    storage: false,
    search: false,
  };
  const performance = {
    databaseLatency: 0,
    searchLatency: 0,
  };
  
  try {
    // Database health check
    const dbStart = Date.now();
    const { error: dbError } = await supabase
      .from('user_profiles')
      .select('id')
      .limit(1);
    
    checks.database = !dbError;
    performance.databaseLatency = Date.now() - dbStart;
    
    // Storage health check
    const { error: storageError } = await supabase.storage
      .from('part-images')
      .list('', { limit: 1 });
    
    checks.storage = !storageError;
    
    // Turkish search health check
    const searchStart = Date.now();
    const { error: searchError } = await supabase.rpc('search_parts_turkish', {
      search_query: 'BMW',
      limit_count: 1
    });
    
    checks.search = !searchError;
    performance.searchLatency = Date.now() - searchStart;
    
    // Determine overall status
    const allHealthy = Object.values(checks).every(Boolean);
    const status = allHealthy ? 'healthy' : 'degraded';
    
    const result: HealthCheckResult = {
      status,
      timestamp: new Date().toISOString(),
      checks,
      performance,
      version: process.env.npm_package_version || '1.0.0',
    };
    
    res.status(allHealthy ? 200 : 503).json(result);
    
  } catch (error) {
    console.error('Health check failed:', error);
    
    res.status(503).json({
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      checks,
      performance,
      version: process.env.npm_package_version || '1.0.0',
    });
  }
}
```

### 2. Database Performance Monitoring

**Performance Monitoring Queries:**
```sql
-- Monitor Turkish search performance in production
CREATE OR REPLACE VIEW public.production_performance_metrics AS
SELECT 
    'turkish_search_avg_time' as metric,
    AVG(
        CASE 
            WHEN query LIKE '%search_parts_turkish%' THEN mean_time
            ELSE NULL
        END
    ) as value,
    'milliseconds' as unit
FROM pg_stat_statements
WHERE query LIKE '%search_parts_turkish%'
UNION ALL
SELECT 
    'database_connections' as metric,
    COUNT(*) as value,
    'connections' as unit
FROM pg_stat_activity
WHERE state = 'active'
UNION ALL
SELECT 
    'parts_table_size' as metric,
    pg_total_relation_size('public.parts') as value,
    'bytes' as unit
UNION ALL
SELECT 
    'active_parts_count' as metric,
    COUNT(*) as value,
    'parts' as unit
FROM public.parts
WHERE status = 'active';

-- Create monitoring function for Cron jobs
CREATE OR REPLACE FUNCTION public.collect_performance_metrics()
RETURNS jsonb
LANGUAGE plpgsql
AS $$
DECLARE
    metrics jsonb;
BEGIN
    SELECT jsonb_object_agg(metric, jsonb_build_object('value', value, 'unit', unit))
    INTO metrics
    FROM public.production_performance_metrics;
    
    -- Log to table for historical tracking
    INSERT INTO public.performance_logs (metrics, created_at)
    VALUES (metrics, NOW());
    
    RETURN metrics;
END;
$$;
```

---

## Rollback and Recovery

### 1. Deployment Rollback Strategy

**Vercel Rollback:**
```bash
# List recent deployments
vercel list

# Rollback to previous deployment
vercel rollback [deployment-url]

# Or rollback to specific deployment
vercel rollback https://banayeni-sanaeski-xyz.vercel.app
```

**Database Rollback Plan:**
```sql
-- Create database backup before major changes
-- Supabase provides automatic backups, but manual backups for safety

-- Export critical data
COPY public.parts TO '/tmp/parts_backup.csv' WITH CSV HEADER;
COPY public.user_profiles TO '/tmp/users_backup.csv' WITH CSV HEADER;
COPY public.interests TO '/tmp/interests_backup.csv' WITH CSV HEADER;

-- Rollback procedure (if needed)
-- 1. Stop application traffic (maintenance mode)
-- 2. Restore database from backup
-- 3. Verify data integrity
-- 4. Test critical functions
-- 5. Resume traffic
```

### 2. Disaster Recovery

**Recovery Procedures:**
```bash
# Complete disaster recovery checklist

# 1. Assess Impact
# - Check Vercel status page
# - Check Supabase status page  
# - Verify DNS resolution
# - Test from different locations (Turkish ISPs)

# 2. Communication
# - Update status page (if available)
# - Notify users via social media/email
# - Prepare Turkish language communications

# 3. Recovery Actions
# - Switch to backup Vercel project (if configured)
# - Restore from Supabase backup
# - Verify all Turkish search functions
# - Test interest-gating system
# - Validate image uploads

# 4. Post-Recovery
# - Monitor error rates
# - Check performance metrics
# - Verify Turkish user experience
# - Document lessons learned
```

---

## Production Maintenance

### 1. Regular Maintenance Tasks

**Weekly Maintenance:**
```sql
-- Database maintenance (run weekly)
-- Vacuum and analyze critical tables
VACUUM ANALYZE public.parts;
VACUUM ANALYZE public.interests;
VACUUM ANALYZE public.conversations;
VACUUM ANALYZE public.messages;

-- Update table statistics for query optimization
ANALYZE public.user_profiles;

-- Check for slow queries
SELECT query, mean_time, calls, total_time
FROM pg_stat_statements
WHERE mean_time > 1000  -- Queries taking >1 second
ORDER BY mean_time DESC
LIMIT 10;

-- Monitor Turkish text search performance
SELECT 
    COUNT(*) as search_count,
    AVG(EXTRACT(MILLISECONDS FROM (NOW() - created_at))) as avg_response_time
FROM public.search_logs
WHERE created_at > NOW() - INTERVAL '7 days';
```

**Monthly Maintenance:**
```bash
# Monthly maintenance checklist

# 1. Performance Review
# - Analyze bundle size reports
# - Review Core Web Vitals scores
# - Check Turkish mobile performance metrics
# - Review database query performance

# 2. Security Review
# - Update dependencies (npm audit)
# - Review Supabase security logs
# - Check SSL certificate expiry
# - Audit user authentication logs

# 3. Data Cleanup
# - Remove inactive user accounts (>6 months)
# - Archive old conversations (>1 year)
# - Clean up unused images
# - Optimize database indexes

# 4. Backup Verification
# - Test database restore procedure
# - Verify image storage backups
# - Test complete disaster recovery
```

### 2. Scaling Considerations

**Horizontal Scaling Plan:**
```typescript
// Scaling thresholds and actions
const scalingThresholds = {
  database: {
    connections: {
      warning: 80,  // 80% of max connections
      critical: 95, // 95% of max connections
      action: 'upgrade_supabase_plan',
    },
    queryTime: {
      warning: 500,  // 500ms average query time
      critical: 1000, // 1s average query time  
      action: 'optimize_indexes_or_upgrade',
    },
  },
  
  api: {
    responseTime: {
      warning: 800,  // 800ms API response time
      critical: 1500, // 1.5s API response time
      action: 'optimize_code_or_upgrade_vercel',
    },
    errorRate: {
      warning: 0.01,  // 1% error rate
      critical: 0.05, // 5% error rate
      action: 'investigate_and_fix_errors',
    },
  },
  
  storage: {
    usage: {
      warning: 0.8,  // 80% storage used
      critical: 0.95, // 95% storage used
      action: 'upgrade_storage_plan',
    },
  },
};

// Automated scaling alerts (integrate with monitoring)
export const checkScalingThresholds = async () => {
  // Implementation would check current metrics
  // against thresholds and trigger alerts
};
```

---

## Conclusion

This comprehensive deployment guide provides all necessary instructions for successfully deploying BanaYeni SanaEski to production. The deployment strategy ensures:

**Turkish Market Optimization:**
- Frankfurt region deployment for optimal Turkish user performance
- Turkish text search fully configured and optimized
- Mobile-first performance tuning for Turkish network conditions
- Turkish language error messages and user communications

**Production Readiness:**
- Scalable architecture supporting growth
- Comprehensive monitoring and error tracking
- Automated performance optimization
- Security best practices implementation

**Operational Excellence:**
- Detailed health checks and monitoring procedures
- Clear rollback and disaster recovery plans  
- Regular maintenance procedures and scaling guidelines
- Performance metrics tracking and optimization

**Business Continuity:**
- High availability deployment configuration
- Automated backups and recovery procedures
- Clear escalation and communication plans
- Comprehensive documentation for operations team

This deployment configuration positions BanaYeni SanaEski for sustainable growth while maintaining optimal performance and reliability for Turkish users in the competitive automotive parts marketplace.

---

*This deployment guide serves as the definitive reference for all production deployment activities for the BanaYeni SanaEski project.*