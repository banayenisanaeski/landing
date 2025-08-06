# Project Structure - BanaYeni SanaEski

**Document Type:** Complete Project Organization Guide  
**Created:** August 6, 2025  
**Version:** 1.0  
**Status:** Current Structure Documentation  

---

## Project Structure Overview

BanaYeni SanaEski follows a Next.js Pages Router architecture with TypeScript, organized for the Turkish automotive parts marketplace. The structure emphasizes separation of concerns, Turkish market optimization, and maintainable code organization.

**Architecture Pattern:** Next.js Pages Router + Component-Based + Service Layer  
**Language:** TypeScript with gradual adoption  
**Styling:** TailwindCSS with custom Turkish marketplace configuration  
**Database Integration:** Dual-database (transitioning to Supabase-only)  

---

## Root Directory Structure

```
landing/
├── .claude/                 # Claude Code configuration
│   └── CLAUDE.md
├── .next/                   # Next.js build output (generated)
├── components/              # Reusable React components
├── lib/                     # Core utilities and database clients
├── pages/                   # Next.js Pages Router (routes + API)
├── public/                  # Static assets
├── styles/                  # Global CSS and Tailwind configuration
├── types/                   # TypeScript type definitions
├── docs/                    # Project documentation (this file)
├── .env.local              # Environment variables (local)
├── .env.example            # Environment variables template
├── .gitignore              # Git ignore patterns
├── next.config.js          # Next.js configuration
├── package.json            # Dependencies and scripts
├── package-lock.json       # Dependency lock file
├── tailwind.config.js      # TailwindCSS configuration
├── tsconfig.json           # TypeScript configuration
├── CLAUDE.md               # Claude Code project instructions
└── README.md               # Project overview
```

---

## Detailed Directory Analysis

### `/components/` - React Components

**Purpose:** Reusable UI components optimized for Turkish marketplace

```
components/
├── ui/                     # Basic UI building blocks
│   ├── Button.tsx         # Styled buttons with Turkish states
│   ├── Input.tsx          # Form inputs with Turkish validation
│   ├── Modal.tsx          # Overlay components
│   └── LoadingSpinner.tsx # Loading states
├── forms/                  # Form components
│   ├── SearchForm.tsx     # Parts search with Turkish filters
│   ├── PartForm.tsx       # Part creation/editing form
│   └── ContactForm.tsx    # User communication forms
├── parts/                  # Parts-specific components
│   ├── PartCard.tsx       # Part display component (critical)
│   ├── PartsList.tsx      # Parts listing with pagination
│   ├── InterestButton.tsx # Interest-gating UI (business logic)
│   └── ImageUpload.tsx    # Part image handling
├── navigation/            # Navigation components
│   ├── Navbar.tsx         # Main navigation (Turkish labels)
│   ├── Footer.tsx         # Site footer
│   └── MobileMenu.tsx     # Responsive mobile navigation
├── messaging/             # Conversation components
│   ├── ConversationList.tsx  # User conversations overview
│   ├── MessageThread.tsx     # Individual conversation view
│   └── MessageForm.tsx       # Message composition
└── layout/                # Layout components
    ├── Layout.tsx         # Main page wrapper
    ├── PageHeader.tsx     # Page-specific headers
    └── SEOMeta.tsx        # SEO optimization for Turkish content
```

**Key Component Patterns:**
- **Turkish Localization:** All text in Turkish with proper character support
- **Mobile-First Design:** Responsive components optimized for Turkish mobile networks
- **Interest-Gating Integration:** Components implement core business logic
- **Type Safety:** Full TypeScript integration with shared interfaces

### `/lib/` - Core Utilities and Services

**Purpose:** Business logic, database clients, and shared utilities

```
lib/
├── supabaseClient.ts      # Supabase client configuration
├── db.ts                  # SQL Server client (legacy, being migrated)
├── auth.ts                # Authentication helpers
├── api/                   # API utilities
│   ├── supabaseParts.ts   # Parts API via Supabase
│   ├── validation.ts      # Request validation schemas
│   └── errors.ts          # Error handling utilities
├── services/              # Business logic services
│   ├── PartsService.ts    # Parts management (Turkish optimized)
│   ├── InterestService.ts # Interest-gating business logic
│   ├── UserService.ts     # User management
│   └── SearchService.ts   # Turkish text search optimization
├── utils/                 # General utilities
│   ├── formatters.ts      # Turkish currency/date formatting
│   ├── validators.ts      # Turkish-specific validation
│   ├── constants.ts       # Turkish cities, brands, etc.
│   └── helpers.ts         # General helper functions
└── types/                 # Shared TypeScript types
    ├── database.ts        # Database schema types
    ├── api.ts             # API request/response types
    └── marketplace.ts     # Business domain types
```

**Key Patterns:**
- **Database Abstraction:** Services layer abstracts database operations
- **Turkish Optimization:** Text processing and formatting for Turkish market
- **Type Safety:** Comprehensive TypeScript coverage
- **Error Handling:** Centralized error management with Turkish messages

### `/pages/` - Next.js Pages Router

**Purpose:** Application routes and API endpoints

```
pages/
├── api/                   # Backend API endpoints
│   ├── auth/             # Authentication endpoints
│   │   ├── login.ts      # User login
│   │   ├── logout.ts     # User logout
│   │   └── register.ts   # User registration
│   ├── parts/            # Parts management API
│   │   ├── index.ts      # Create new part (POST)
│   │   ├── [id].ts       # Get/update specific part
│   │   └── [id]/
│   │       └── interest.ts  # Express interest (core business logic)
│   ├── search/           # Search functionality
│   │   └── parts.ts      # Turkish-optimized parts search
│   ├── conversations/    # Messaging system
│   │   ├── index.ts      # List user conversations
│   │   └── [id]/
│   │       └── messages.ts  # Get/send messages
│   ├── upload/           # File upload handling
│   │   └── images.ts     # Part image uploads
│   └── user/             # User management
│       ├── profile.ts    # User profile operations
│       └── interests.ts  # User interest history
├── _app.tsx              # Next.js app wrapper (global setup)
├── _document.tsx         # HTML document configuration
├── index.tsx             # Homepage (Turkish landing page)
├── search.tsx            # Parts search page (core functionality)
├── sell.tsx              # Part selling page (authenticated)
├── parts/                # Parts-related pages
│   └── [id].tsx         # Individual part details
├── conversations/        # Messaging pages
│   ├── index.tsx        # Conversations list
│   └── [id].tsx         # Individual conversation
├── my-parts.tsx          # User's parts management (authenticated)
├── requests.tsx          # Incoming purchase requests (authenticated)
├── my-matches.tsx        # Successful matches (authenticated)
├── profile.tsx           # User profile page (authenticated)
├── login.tsx             # Authentication page
├── register.tsx          # User registration page
└── 404.tsx               # Custom 404 page (Turkish)
```

**API Endpoint Patterns:**
- **RESTful Design:** Standard HTTP methods with consistent responses
- **Turkish Error Messages:** All API responses localized for Turkish users
- **Authentication Integration:** Supabase Auth middleware for protected routes
- **Business Logic Enforcement:** Interest-gating rules enforced at API level

### `/public/` - Static Assets

**Purpose:** Public assets optimized for Turkish marketplace

```
public/
├── logo.png              # BanaYeni SanaEski logo
├── favicon.ico           # Site favicon
├── images/               # Static images
│   ├── hero/            # Homepage hero images
│   ├── placeholders/    # Part image placeholders
│   └── icons/           # Custom icons for Turkish marketplace
├── manifest.json         # PWA manifest (Turkish localization)
└── robots.txt           # Search engine directives
```

**Asset Optimization:**
- **Image Compression:** Optimized for Turkish mobile networks
- **Turkish Branding:** Assets reflect Turkish market positioning
- **Performance Focus:** Minimal asset sizes for fast loading

### `/styles/` - Styling and Design System

**Purpose:** Global styles and TailwindCSS configuration

```
styles/
├── globals.css           # Global CSS reset and base styles
├── components.css        # Component-specific styles
└── utilities.css         # Custom utility classes for Turkish marketplace
```

**Styling Approach:**
- **TailwindCSS Primary:** Utility-first approach with Turkish customizations
- **Custom Components:** Styled components for complex UI patterns
- **Turkish Typography:** Font choices supporting Turkish characters
- **Mobile-First:** Responsive design optimized for Turkish mobile users

### `/types/` - TypeScript Definitions

**Purpose:** Centralized type definitions for type safety

```
types/
├── index.ts              # Main type exports
├── database.ts           # Database schema types
├── api.ts                # API request/response interfaces
├── components.ts         # Component prop interfaces
├── auth.ts               # Authentication types
└── marketplace.ts        # Business domain types (parts, interests, etc.)
```

**Type System Patterns:**
- **Database Types:** Generated from actual database schema
- **API Types:** Request/response interfaces for all endpoints
- **Component Types:** Props interfaces for all React components
- **Business Types:** Domain-specific types for marketplace logic

### `/docs/` - Project Documentation

**Purpose:** Comprehensive project documentation

```
docs/
├── README.md             # Documentation index
├── business/             # Business documentation
│   ├── strategic-analysis.md
│   ├── project-brief.md
│   └── migration-strategy.md
├── architecture/         # Technical architecture
│   ├── system-overview.md
│   ├── technology-stack.md
│   ├── data-models.md
│   ├── api-specifications.md
│   └── component-architecture.md
├── implementation/       # Implementation guides
│   ├── project-structure.md  # This file
│   ├── development-setup.md
│   ├── coding-standards.md
│   └── database-schema.md
├── operations/           # Operational documentation
├── testing/              # Testing documentation
├── workflows/            # Development workflows
└── reference/            # Reference materials
```

---

## Configuration Files Analysis

### `next.config.js` - Next.js Configuration

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  
  // Turkish market optimizations
  i18n: {
    locales: ['tr'],
    defaultLocale: 'tr',
  },
  
  // Image optimization for part photos
  images: {
    domains: ['supabase.co', 'your-supabase-project.supabase.co'],
    formats: ['image/webp', 'image/avif'],
  },
  
  // Environment variables
  env: {
    CUSTOM_KEY: process.env.CUSTOM_KEY,
  },
  
  // Performance optimizations for Turkish mobile
  experimental: {
    optimizeCss: true,
  },
}

module.exports = nextConfig;
```

### `tailwind.config.js` - TailwindCSS Configuration

```javascript
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        'turkish-green': {
          50: '#f0fdf4',
          500: '#22c55e',
          600: '#16a34a',  // Primary brand color
          700: '#15803d',
        }
      },
      fontFamily: {
        'sans': ['Inter', 'system-ui', 'sans-serif'],
      },
      screens: {
        'xs': '400px', // Additional breakpoint for Turkish mobile
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
  ],
};
```

### `tsconfig.json` - TypeScript Configuration

```json
{
  "compilerOptions": {
    "target": "es2017",
    "lib": ["dom", "dom.iterable", "es6"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": false,  // Gradual adoption approach
    "forceConsistentCasingInFileNames": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "node",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [
      {
        "name": "next"
      }
    ],
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"],
      "@/components/*": ["./components/*"],
      "@/lib/*": ["./lib/*"],
      "@/types/*": ["./types/*"]
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

### `package.json` - Dependencies and Scripts

```json
{
  "name": "banayeni-sanaeski",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "type-check": "tsc --noEmit",
    "test": "jest",
    "test:watch": "jest --watch",
    "test:e2e": "playwright test"
  },
  "dependencies": {
    "next": "13.4.12",
    "react": "18.2.0",
    "react-dom": "18.2.0",
    "@supabase/supabase-js": "^2.38.0",
    "mssql": "^9.1.1",
    "typescript": "5.1.6"
  },
  "devDependencies": {
    "@types/node": "20.4.5",
    "@types/react": "18.2.17",
    "@types/react-dom": "18.2.7",
    "tailwindcss": "3.3.3",
    "autoprefixer": "10.4.14",
    "postcss": "8.4.27",
    "eslint": "8.45.0",
    "eslint-config-next": "13.4.12"
  }
}
```

---

## Code Organization Patterns

### Import/Export Conventions

**Absolute Imports Pattern:**
```typescript
// Use absolute imports with TypeScript path mapping
import { PartCard } from '@/components/parts/PartCard';
import { searchParts } from '@/lib/services/PartsService';
import { Part, SearchFilters } from '@/types/marketplace';

// Avoid relative imports
// import { PartCard } from '../../components/parts/PartCard'; ❌
```

**Export Patterns:**
```typescript
// Named exports for components
export const PartCard: React.FC<PartCardProps> = ({ ... }) => {
  // Component implementation
};

// Default exports for pages
const SearchPage: React.FC = () => {
  // Page implementation
};

export default SearchPage;

// Service exports
export class PartsService {
  // Service implementation
}

// Utility exports
export const formatTurkishPrice = (price: number): string => {
  // Utility implementation
};
```

### File Naming Conventions

**Component Files:**
- **React Components:** PascalCase (e.g., `PartCard.tsx`, `SearchForm.tsx`)
- **Page Components:** PascalCase (e.g., `SearchPage.tsx`, `ProfilePage.tsx`)
- **Utility Files:** camelCase (e.g., `apiHelpers.ts`, `formatters.ts`)

**API Routes:**
- **Endpoint Files:** camelCase (e.g., `searchParts.ts`, `expressInterest.ts`)
- **Dynamic Routes:** Bracket notation (e.g., `[id].ts`, `[...slug].ts`)

**Directory Structure:**
- **Feature Grouping:** Components grouped by feature (e.g., `/parts/`, `/messaging/`)
- **Layer Separation:** Clear separation between UI, services, and utilities
- **Consistent Naming:** Predictable patterns across all directories

### Component Organization Pattern

**Component File Structure:**
```typescript
// 1. Imports (external libraries first, internal second)
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { PartCard } from '@/components/parts/PartCard';
import { usePartsSearch } from '@/lib/hooks/usePartsSearch';
import type { Part, SearchFilters } from '@/types/marketplace';

// 2. Type definitions
interface SearchPageProps {
  initialFilters?: Partial<SearchFilters>;
}

// 3. Component implementation
export const SearchPage: React.FC<SearchPageProps> = ({ initialFilters }) => {
  // Component logic
};

// 4. Default export (for pages)
export default SearchPage;
```

### Service Layer Pattern

**Service Class Structure:**
```typescript
// lib/services/PartsService.ts
import { SupabaseClient } from '@supabase/supabase-js';
import type { Part, SearchFilters, CreatePartRequest } from '@/types/marketplace';

export class PartsService {
  constructor(private supabase: SupabaseClient) {}

  // Public methods (business logic)
  async searchParts(filters: SearchFilters): Promise<Part[]> {
    // Implementation
  }

  async createPart(data: CreatePartRequest, userId: string): Promise<Part> {
    // Implementation
  }

  // Private methods (internal logic)
  private validatePartData(data: CreatePartRequest): void {
    // Validation logic
  }

  private formatTurkishText(text: string): string {
    // Turkish text processing
  }
}
```

---

## Environment Configuration

### Environment Variables Structure

```bash
# .env.local (development)
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# SQL Server (Legacy - will be removed after migration)
DB_USER=your-sql-server-user
DB_PASSWORD=your-sql-server-password
DB_SERVER=your-sql-server-host
DB_DATABASE=BanaYeniSanaEski
DB_PORT=1433

# Application Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_DEFAULT_LOCALE=tr-TR
NEXT_PUBLIC_CURRENCY=TRY

# File Upload Configuration
MAX_FILE_SIZE=2097152  # 2MB for Turkish mobile optimization
MAX_FILES_PER_PART=5
ALLOWED_FILE_TYPES=image/jpeg,image/png,image/webp

# External Services
NEXT_PUBLIC_GOOGLE_ADS_ID=your-google-ads-id
SENTRY_DSN=your-sentry-dsn (optional)
```

### Build Configuration

**Production Build Optimization:**
```bash
# Build command with Turkish optimization
npm run build

# Generated build structure
.next/
├── cache/              # Build cache
├── static/             # Static assets with hashing
│   ├── css/           # Optimized CSS bundles
│   ├── js/            # JavaScript bundles
│   └── media/         # Optimized images
├── server/            # Server-side code
│   ├── pages/         # Pre-rendered pages
│   └── chunks/        # Code splitting chunks
└── trace             # Performance traces
```

---

## Development Workflow Integration

### IDE Configuration (VS Code)

**Recommended Extensions:**
```json
// .vscode/extensions.json
{
  "recommendations": [
    "ms-vscode.vscode-typescript-next",
    "bradlc.vscode-tailwindcss",
    "esbenp.prettier-vscode",
    "ms-vscode.vscode-eslint",
    "supabase.supabase-vscode"
  ]
}
```

**Workspace Settings:**
```json
// .vscode/settings.json
{
  "typescript.preferences.importModuleSpecifier": "absolute",
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true,
    "source.organizeImports": true
  },
  "tailwindCSS.includeLanguages": {
    "typescript": "html",
    "typescriptreact": "html"
  },
  "emmet.includeLanguages": {
    "typescript": "html",
    "typescriptreact": "html"
  }
}
```

### Git Configuration

**Branching Strategy:**
```bash
# Main branches
main/              # Production-ready code
develop/           # Integration branch
feature/*          # Feature development
hotfix/*           # Emergency fixes
release/*          # Release preparation
```

**Commit Message Format:**
```
feat: Add Turkish parts search optimization
fix: Resolve interest button loading state
docs: Update API documentation for Turkish endpoints
refactor: Simplify database connection logic
test: Add Turkish text search unit tests
```

---

## Migration Considerations

### Current State (Dual Database)

**Complexity Areas:**
```
Current Issues:
├── Database Connection Management
│   ├── SQL Server connection pooling
│   ├── Supabase client initialization
│   └── Cross-database query complexity
├── Data Synchronization
│   ├── User data across systems
│   ├── Business logic coordination
│   └── Error handling complexity
└── Development Overhead
    ├── Context switching between systems
    ├── Testing complexity
    └── Deployment coordination
```

### Target State (Supabase-Only)

**Simplified Architecture:**
```
Target Benefits:
├── Unified Database Context
│   ├── Single connection management
│   ├── Integrated authentication
│   └── Real-time capabilities
├── Development Productivity
│   ├── Reduced context switching
│   ├── Simplified testing
│   └── Faster development cycles
└── Enhanced Capabilities
    ├── Row-level security
    ├── Built-in file storage
    └── Real-time subscriptions
```

---

## Performance Considerations

### Bundle Analysis

**Current Bundle Sizes (estimated):**
```
Bundle Analysis:
├── Main Bundle: ~250KB (gzipped)
│   ├── Next.js Runtime: ~80KB
│   ├── React: ~40KB
│   ├── Supabase Client: ~30KB
│   ├── Application Code: ~60KB
│   └── Styles: ~40KB
├── Page Bundles: ~20-50KB each
└── Total Initial Load: ~300KB
```

**Optimization Strategies:**
- **Code Splitting:** Automatic Next.js route-based splitting
- **Dynamic Imports:** Lazy loading for heavy components
- **Bundle Analysis:** Regular monitoring with `@next/bundle-analyzer`
- **Image Optimization:** Next.js Image component with WebP/AVIF

### Database Performance

**Query Patterns:**
```sql
-- Optimized queries for Turkish marketplace
-- Parts search with Turkish text optimization
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_parts_turkish_search
ON parts USING GIN (to_tsvector('turkish', title || ' ' || part_reference));

-- Interest-gating query optimization
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_interests_user_part
ON interests (user_id, part_id);
```

---

## Conclusion

The BanaYeni SanaEski project structure provides a solid foundation for the Turkish automotive parts marketplace while maintaining simplicity and development velocity. The organization supports:

**Structural Strengths:**
- **Clear Separation:** Components, services, and utilities properly organized
- **Turkish Optimization:** All layers optimized for Turkish market requirements  
- **Type Safety:** Comprehensive TypeScript integration across all layers
- **Performance Focus:** Bundle optimization and database query efficiency

**Development Benefits:**
- **Maintainable Codebase:** Predictable patterns and consistent organization
- **Developer Experience:** Clear paths for adding features and fixing bugs
- **Testing Support:** Structure supports comprehensive testing strategies
- **Migration Ready:** Architecture prepared for Supabase-only transition

This project structure positions BanaYeni SanaEski for sustainable growth while maintaining the development agility necessary for success in the competitive Turkish automotive parts market.

---

*This project structure documentation serves as the definitive guide for understanding and navigating the BanaYeni SanaEski codebase.*