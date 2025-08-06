# Technology Stack - BanaYeni SanaEski

**Document Type:** Complete Technology Stack Specification  
**Created:** August 6, 2025  
**Version:** 1.0  
**Status:** Final - Single Source of Truth  

---

## Technology Stack Overview

This document defines the DEFINITIVE technology selection for the entire BanaYeni SanaEski project. This table serves as the single source of truth - all development must use these exact versions and technologies.

**Selection Criteria:**
- Turkish marketplace optimization
- Supabase migration compatibility  
- Mobile-first performance
- Development team productivity
- Operational simplicity
- Cost effectiveness

---

## Complete Technology Stack

| Category | Technology | Version | Purpose | Rationale |
|----------|------------|---------|---------|-----------|
| **Frontend Language** | TypeScript | 5.0+ | Type-safe JavaScript development | Prevents runtime errors, improves maintainability, already established in codebase |
| **Frontend Framework** | Next.js | 13.4.12 | React framework with SSR/SSG | Maintain existing Pages Router, proven SEO benefits for Google Ads strategy |
| **UI Component Library** | Headless UI | 1.7+ | Accessible UI primitives | Lightweight, works well with TailwindCSS, accessibility compliance |
| **State Management** | React Query + useState | 4.0+ | Server state + local state | Perfect for Supabase integration, caching, minimal complexity for MVP |
| **Backend Language** | TypeScript | 5.0+ | Unified language across stack | Shared types between frontend/backend, consistent development experience |
| **Backend Framework** | Next.js API Routes | 13.4.12 | Serverless API endpoints | Maintains current architecture, zero additional deployment complexity |
| **API Style** | REST + Supabase SDK | Latest | RESTful APIs with direct DB client | Supabase SDK reduces boilerplate, REST for external integrations |
| **Database** | Supabase PostgreSQL | Latest | Managed PostgreSQL database | Migration target, handles auth/storage/realtime in one platform |
| **Cache** | Vercel Edge Cache | Built-in | CDN and API caching | Automatic optimization, reduces Supabase load, improves Turkish user experience |
| **File Storage** | Supabase Storage | Latest | Part images and user uploads | Integrated with auth, CDN delivery, simple migration from current setup |
| **Authentication** | Supabase Auth | Latest | User management and sessions | Already implemented, email/password support, session handling |
| **Frontend Testing** | Jest + React Testing Library | 29.0+ | Unit and integration tests | Standard React testing, matches existing plan for Jest implementation |
| **Backend Testing** | Jest + Supertest | 29.0+ | API endpoint testing | Consistent testing framework, API route testing capabilities |
| **E2E Testing** | Playwright | 1.40+ | End-to-end user workflows | Superior to Cypress for Turkish mobile testing, better performance |
| **Build Tool** | Next.js Built-in | 13.4.12 | Webpack-based build system | Zero configuration, optimized for production, maintains current setup |
| **Bundler** | Next.js/Webpack | Built-in | Module bundling and optimization | Integrated with Next.js, no additional configuration needed |
| **IaC Tool** | Vercel CLI | Latest | Deployment and environment management | Simple deployment, environment variable management |
| **CI/CD** | GitHub Actions | Latest | Automated testing and deployment | Free for public repos, Vercel integration, Turkish timezone support |
| **Monitoring** | Vercel Analytics + Sentry | Latest | Performance and error monitoring | Real user metrics for Google Ads optimization, error tracking |
| **Logging** | Vercel Logs + Supabase Logs | Built-in | Application and database logging | Integrated logging, no additional setup required |
| **CSS Framework** | TailwindCSS | 3.4+ | Utility-first styling | Already established, mobile-first responsive design, small bundle size |

---

## Detailed Technology Analysis

### Frontend Stack

#### TypeScript 5.0+
**Selected For:**
- Type safety prevents runtime errors common in marketplace applications
- Better developer experience with autocomplete and refactoring
- Shared type definitions between frontend and backend
- Turkish character support with proper string typing

**Configuration:**
```typescript
// tsconfig.json optimized for Turkish marketplace
{
  "compilerOptions": {
    "target": "es2017",
    "lib": ["dom", "dom.iterable", "es6"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": false,  // Gradual migration approach
    "forceConsistentCasingInFileNames": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "node",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [{ "name": "next" }],
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"],
      "@/components/*": ["./components/*"],
      "@/lib/*": ["./lib/*"]
    }
  }
}
```

#### Next.js 13.4.12
**Selected For:**
- Maintains existing Pages Router (not App Router migration)
- Proven SSR/SSG performance for SEO optimization
- Built-in optimization for Turkish mobile networks
- Zero-config deployment with Vercel

**Key Features Utilized:**
- Server-Side Rendering for parts search pages
- Static Site Generation for landing pages
- API Routes for backend logic
- Image optimization for part photos
- Automatic code splitting for performance

#### Headless UI 1.7+
**Selected For:**
- Accessible components out of the box
- Perfect integration with TailwindCSS
- Lightweight compared to full UI libraries
- Keyboard navigation support for accessibility

**Turkish Marketplace Components:**
```typescript
// Example usage for Turkish marketplace
import { Dialog, Listbox } from '@headlessui/react';

// City selection dropdown with Turkish cities
const CitySelector = () => {
  const turkishCities = ['İstanbul', 'Ankara', 'İzmir', 'Bursa', 'Antalya'];
  
  return (
    <Listbox value={selectedCity} onChange={setSelectedCity}>
      {/* Accessible dropdown for Turkish cities */}
    </Listbox>
  );
};
```

#### React Query 4.0+ + useState
**Selected For:**
- Perfect for Supabase integration with built-in caching
- Server state management with automatic refetching
- Optimistic updates for better UX
- Background data synchronization

**Implementation Pattern:**
```typescript
// Turkish parts search with React Query
const usePartsSearch = (filters: SearchFilters) => {
  return useQuery({
    queryKey: ['parts', 'search', filters],
    queryFn: () => supabase.rpc('search_parts', filters),
    staleTime: 5 * 60 * 1000, // 5 minutes cache for parts search
    enabled: !!filters.query || !!filters.part_reference,
  });
};
```

### Backend Stack

#### Next.js API Routes
**Selected For:**
- Maintains existing architecture without additional complexity
- Serverless deployment with automatic scaling
- TypeScript support across frontend and backend
- Built-in middleware support for authentication

**API Structure:**
```typescript
// pages/api/parts/[id]/interest.ts
export default withAuth(async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'POST') {
    const { type } = validateInterestData(req.body);
    const result = await expressInterest(user.id, partId, type);
    
    res.status(201).json({
      success: true,
      message: type === 'interested' ? 'İlginiz kaydedildi!' : 'Bu parça gösterilmeyecek.',
      data: result
    });
  }
});
```

#### Supabase PostgreSQL
**Selected For:**
- Migration target from dual-database setup
- Integrated auth, storage, and real-time capabilities
- Advanced PostgreSQL features (trigrams, full-text search)
- Turkish text search optimization

**Turkish Optimization Features:**
```sql
-- Turkish text search configuration
CREATE TEXT SEARCH CONFIGURATION turkish_parts (COPY = turkish);
ALTER TEXT SEARCH CONFIGURATION turkish_parts 
    ALTER MAPPING FOR asciiword, asciihword, hword_asciipart,
    word, hword, hword_part WITH turkish_stem;

-- Optimized search function
CREATE OR REPLACE FUNCTION search_parts_turkish(
    search_text TEXT
) RETURNS TABLE(...) AS $$
BEGIN
    RETURN QUERY
    SELECT * FROM parts 
    WHERE to_tsvector('turkish_parts', title || ' ' || part_reference) 
          @@ plainto_tsquery('turkish_parts', search_text);
END;
$$ LANGUAGE plpgsql;
```

### Storage & Assets

#### Supabase Storage
**Selected For:**
- Integrated with authentication system
- CDN delivery optimized for Turkish users
- Image transformation APIs
- Simple migration from current file handling

**Configuration:**
```typescript
// Image upload optimized for Turkish mobile networks
const uploadPartImages = async (files: File[]) => {
  const maxSize = 2 * 1024 * 1024; // 2MB limit for Turkish mobile
  const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
  
  const uploads = await Promise.all(
    files.map(async (file, index) => {
      const fileName = `${partId}/image_${index}_${Date.now()}.${file.name.split('.').pop()}`;
      
      const { data, error } = await supabase.storage
        .from('part-images')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false
        });
      
      return data?.path;
    })
  );
  
  return uploads;
};
```

#### TailwindCSS 3.4+
**Selected For:**
- Already established in current codebase
- Mobile-first responsive design principles
- Small bundle size with purging
- Utility-first approach speeds development

**Turkish Mobile Configuration:**
```javascript
// tailwind.config.js optimized for Turkish marketplace
module.exports = {
  content: ['./pages/**/*.{js,ts,jsx,tsx}', './components/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      screens: {
        'xs': '400px', // Additional breakpoint for Turkish mobile devices
      },
      colors: {
        'turkish-green': {
          50: '#f0fdf4',
          500: '#22c55e',
          600: '#16a34a', // Primary Turkish marketplace green
          700: '#15803d',
        }
      },
      fontFamily: {
        'sans': ['Inter', 'system-ui', 'sans-serif'], // Good Turkish character support
      }
    }
  }
};
```

### Testing Stack

#### Jest 29.0+ + React Testing Library
**Selected For:**
- Industry standard for React applications
- Excellent TypeScript integration
- Snapshot testing for UI components
- Mock capabilities for Supabase integration

**Test Configuration:**
```typescript
// jest.config.js for Turkish marketplace testing
module.exports = {
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/test-setup.ts'],
  testMatch: ['**/__tests__/**/*.test.{js,ts,tsx}'],
  moduleNameMapping: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '^@/components/(.*)$': '<rootDir>/components/$1',
  },
  transform: {
    '^.+\\.(js|jsx|ts|tsx)$': ['babel-jest', { presets: ['next/babel'] }],
  },
  collectCoverageFrom: [
    'components/**/*.{ts,tsx}',
    'lib/**/*.{ts,tsx}',
    'pages/api/**/*.{ts,tsx}',
    '!**/*.d.ts',
  ],
  coverageThreshold: {
    global: {
      branches: 70,
      functions: 70,
      lines: 70,
      statements: 70,
    },
  },
};
```

#### Playwright 1.40+
**Selected For:**
- Superior mobile device testing (critical for Turkish market)
- Better performance than Cypress
- Cross-browser testing capabilities
- Network condition simulation for Turkish mobile

**Turkish Mobile Test Configuration:**
```typescript
// playwright.config.ts for Turkish marketplace
export default defineConfig({
  projects: [
    {
      name: 'turkish-mobile',
      use: {
        ...devices['iPhone 12'],
        locale: 'tr-TR',
        timezoneId: 'Europe/Istanbul',
        // Simulate Turkish mobile network conditions
        launchOptions: {
          slowMo: 100, // Simulate slower networks
        }
      },
    },
    {
      name: 'turkish-desktop',
      use: {
        ...devices['Desktop Chrome'],
        locale: 'tr-TR',
        timezoneId: 'Europe/Istanbul',
      },
    },
  ],
});
```

### DevOps & Deployment

#### Vercel Platform
**Selected For:**
- Native Next.js optimization and zero-config deployment
- Global CDN with Frankfurt edge location for Turkish users
- Automatic HTTPS and domain management
- Environment variable management

#### GitHub Actions
**Selected For:**
- Free for public repositories
- Excellent integration with Vercel
- Turkish timezone support for scheduled jobs
- Comprehensive workflow automation

**CI/CD Pipeline:**
```yaml
# .github/workflows/turkish-marketplace-ci.yml
name: Turkish Marketplace CI/CD

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '18'
          cache: 'npm'
          
      - name: Install dependencies
        run: npm ci
        
      - name: Run Turkish locale tests
        run: npm run test
        env:
          LOCALE: 'tr-TR'
          TZ: 'Europe/Istanbul'
          
      - name: Run E2E tests on Turkish mobile
        run: npx playwright test --project=turkish-mobile
```

### Monitoring & Analytics

#### Vercel Analytics + Sentry
**Selected For:**
- Real User Monitoring for Turkish traffic patterns
- Core Web Vitals tracking for mobile performance
- Error tracking with Turkish localization
- Integration with Google Ads optimization

**Configuration:**
```typescript
// lib/monitoring.ts for Turkish marketplace
import { Analytics } from '@vercel/analytics/react';
import * as Sentry from '@sentry/nextjs';

// Sentry configuration for Turkish marketplace
Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV,
  locale: 'tr-TR',
  beforeSend(event) {
    // Filter out Turkish-specific noise
    if (event.request?.headers?.['accept-language']?.includes('tr')) {
      return event;
    }
    return null;
  },
});

// Turkish marketplace analytics events
export const trackTurkishEvent = (eventName: string, properties: object) => {
  // Track events with Turkish context
  gtag('event', eventName, {
    event_category: 'turkish_marketplace',
    event_label: 'tr-TR',
    ...properties,
  });
};
```

---

## Technology Integration Patterns

### Frontend-Backend Type Sharing

```typescript
// types/marketplace.ts - Shared between frontend and backend
export interface Part {
  id: string;
  seller_id: string;
  title: string;
  part_reference: string;  // Critical for Turkish marketplace
  condition: 'Kullanılabilir' | 'Arızalı';
  price: number;
  location_city: string;
  brand: string;
  model: string;
  year: number;
  description?: string;
  images: string[];
  status: 'active' | 'sold' | 'inactive';
  created_at: string;
  updated_at: string;
}

export interface TurkishSearchFilters {
  search?: string;
  part_reference?: string;
  condition?: Part['condition'];
  brand?: string;
  model?: string;
  location_city?: string;
  min_price?: number;
  max_price?: number;
  limit?: number;
  offset?: number;
}
```

### Supabase Integration Pattern

```typescript
// lib/supabase.ts - Unified client configuration
import { createClient } from '@supabase/supabase-js';
import type { Database } from '@/types/database';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
  realtime: {
    params: {
      eventsPerSecond: 10, // Optimized for Turkish mobile
    },
  },
});
```

---

## Performance Optimization Configuration

### Bundle Optimization

```typescript
// next.config.js optimized for Turkish marketplace
const nextConfig = {
  // Optimize for Turkish mobile networks
  compress: true,
  poweredByHeader: false,
  
  // Image optimization for part photos
  images: {
    domains: ['supabase.co', 'your-supabase-project.supabase.co'],
    formats: ['image/webp', 'image/avif'],
    deviceSizes: [320, 420, 768, 1024, 1200],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
  
  // Webpack optimization
  webpack: (config, { dev, isServer }) => {
    if (!dev && !isServer) {
      // Optimize bundle size for Turkish mobile
      config.optimization.splitChunks = {
        chunks: 'all',
        cacheGroups: {
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendors',
            chunks: 'all',
          },
          common: {
            name: 'common',
            minChunks: 2,
            chunks: 'all',
          },
        },
      };
    }
    return config;
  },
  
  // Headers for Turkish marketplace
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Content-Language',
            value: 'tr-TR',
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
        ],
      },
    ];
  },
};
```

---

## Development Environment Configuration

### Environment Variables

```bash
# .env.local.example - Turkish marketplace configuration
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Turkish Marketplace Configuration
NEXT_PUBLIC_DEFAULT_LOCALE=tr-TR
NEXT_PUBLIC_DEFAULT_TIMEZONE=Europe/Istanbul
NEXT_PUBLIC_CURRENCY=TRY

# Google Ads (Turkish market)
NEXT_PUBLIC_GOOGLE_ADS_ID=your-turkish-ads-id

# File Upload Limits (optimized for Turkish mobile)
MAX_FILE_SIZE=2097152  # 2MB
MAX_FILES_PER_PART=5
ALLOWED_FILE_TYPES=image/jpeg,image/png,image/webp

# Performance Configuration
NEXT_PUBLIC_API_TIMEOUT=10000  # 10 seconds for Turkish mobile
DATABASE_CONNECTION_LIMIT=20
```

---

## Technology Decision Rationale Summary

### Key Strategic Decisions

**1. Supabase Platform Choice**
- **Decision:** All-in-one backend platform vs. microservices
- **Rationale:** Simplifies migration, reduces operational overhead, enables rapid development
- **Trade-off:** Vendor lock-in accepted for development velocity

**2. Next.js Pages Router Retention**
- **Decision:** Maintain Pages Router vs. migrate to App Router
- **Rationale:** Preserves existing code, proven stability, team familiarity
- **Trade-off:** Missing latest Next.js features for migration simplicity

**3. TypeScript Strict Mode Disabled**
- **Decision:** Gradual TypeScript adoption vs. strict enforcement
- **Rationale:** Allows incremental migration without blocking development
- **Trade-off:** Some type safety for faster migration timeline

**4. React Query for State Management**
- **Decision:** React Query + useState vs. Redux/Zustand
- **Rationale:** Perfect for server-state heavy application, caching benefits, simple learning curve
- **Trade-off:** Limited complex state management for simpler architecture

**5. Playwright Over Cypress**
- **Decision:** Playwright for E2E testing vs. Cypress
- **Rationale:** Superior mobile device testing, better performance for Turkish network simulation
- **Trade-off:** Newer tool with smaller community for better mobile support

---

## Technology Upgrade Path

### Phase 2 Enhancements (Months 4-6)
- **Real-time Features:** Leverage Supabase Realtime for instant messaging
- **Mobile App:** React Native with shared TypeScript types
- **Advanced Caching:** Redis integration for high-performance scenarios
- **AI Features:** Integration with AI services for part recognition

### Phase 3 Scaling (Months 7-12)
- **Microservices Evolution:** Extract services as needed
- **Multi-region:** Supabase multi-region for international expansion
- **Advanced Monitoring:** Custom metrics and alerting systems
- **Performance Optimization:** Advanced bundling and CDN strategies

---

## Conclusion

This technology stack provides a solid foundation for the BanaYeni SanaEski Turkish parts marketplace while supporting the strategic migration from dual-database to Supabase-only architecture. The selections prioritize:

**Operational Simplicity:** Unified platform reduces complexity  
**Turkish Market Optimization:** Mobile-first, language support, CDN optimization  
**Development Productivity:** Type safety, modern tooling, integrated services  
**Performance:** Caching, bundling, database optimization  
**Scalability:** Foundation for growth without over-engineering

The stack enables rapid development while maintaining the flexibility to evolve based on user feedback and market growth in the Turkish automotive parts ecosystem.

---

*This technology stack specification serves as the definitive reference for all technical decisions in the BanaYeni SanaEski project. All development must adhere to these specifications.*