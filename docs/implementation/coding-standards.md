# Coding Standards - BanaYeni SanaEski

**Document Type:** Complete Code Style and Standards Guide  
**Created:** August 6, 2025  
**Version:** 1.0  
**Status:** Enforced Development Standards  

---

## Coding Standards Overview

This document establishes comprehensive coding standards for the BanaYeni SanaEski Turkish automotive parts marketplace. These standards ensure consistency, maintainability, and optimal performance across the entire codebase while supporting Turkish language requirements and mobile-first development.

**Code Quality Principles:**
- **Consistency:** Uniform code patterns across all components and services
- **Turkish Optimization:** Proper handling of Turkish characters and localization
- **Type Safety:** Comprehensive TypeScript usage with gradual adoption
- **Mobile-First:** Code optimized for Turkish mobile network conditions
- **Maintainability:** Clear, readable, and well-documented code

---

## Language and Framework Standards

### TypeScript Standards

**Configuration Requirements:**
```typescript
// tsconfig.json standards for Turkish marketplace
{
  "compilerOptions": {
    "strict": false,                    // Gradual adoption approach
    "target": "es2017",                 // Broad browser support
    "jsx": "preserve",                  // Next.js optimization
    "moduleResolution": "node",         // Node.js module resolution
    "esModuleInterop": true,           // Better import compatibility
    "forceConsistentCasingInFileNames": true,  // Case sensitivity
    "skipLibCheck": true,              // Performance optimization
    "incremental": true                // Faster builds
  }
}
```

**Type Definition Standards:**
```typescript
// ✅ Correct: Explicit interface definitions
interface Part {
  id: string;
  seller_id: string;
  title: string;
  part_reference: string;          // Critical for Turkish marketplace
  condition: 'Kullanılabilir' | 'Arızalı';  // Turkish enum values
  price: number;
  location_city: string;
  brand: string;
  model: string;
  year: number;
  description?: string;            // Optional fields clearly marked
  images: string[];
  status: 'active' | 'sold' | 'inactive';
  created_at: string;
  updated_at: string;
}

// ✅ Correct: Component prop interfaces
interface PartCardProps {
  part: Part;
  variant: 'list' | 'detailed' | 'compact';
  showSellerInfo?: boolean;
  onInterest?: (partId: string, type: 'interested' | 'not_interested') => void;
  currentUserInterest?: 'interested' | 'not_interested' | null;
}

// ❌ Incorrect: Using 'any' type
interface BadComponentProps {
  data: any;                       // Too generic
  onClick: any;                    // No type safety
}

// ✅ Correct: Generic types with constraints
interface ApiResponse<T = unknown> {
  success: boolean;
  data: T;
  message?: string;
  error?: ApiError;
}

// Turkish marketplace specific types
type TurkishCity = 'İstanbul' | 'Ankara' | 'İzmir' | 'Bursa' | 'Antalya';
type PartCondition = 'Kullanılabilir' | 'Arızalı';
type InterestType = 'interested' | 'not_interested';
```

**Import/Export Conventions:**
```typescript
// ✅ Correct: Absolute imports using TypeScript paths
import { PartCard } from '@/components/parts/PartCard';
import { searchParts } from '@/lib/services/PartsService';
import { Part, SearchFilters } from '@/types/marketplace';
import type { NextApiRequest, NextApiResponse } from 'next';

// ✅ Correct: Named exports for utilities and components
export const formatTurkishPrice = (price: number): string => { /* ... */ };
export const PartCard: React.FC<PartCardProps> = ({ ... }) => { /* ... */ };

// ✅ Correct: Default exports for pages and major modules
const SearchPage: React.FC = () => { /* ... */ };
export default SearchPage;

// ❌ Incorrect: Relative imports for distant modules
import { PartCard } from '../../../components/parts/PartCard';

// ❌ Incorrect: Mixed export patterns in single file
export const ComponentA = () => {};
const ComponentB = () => {};
export default ComponentB;  // Confusing pattern
```

### React Component Standards

**Component Structure Pattern:**
```typescript
// ✅ Correct: Consistent component file structure
import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/router';
import { PartCard } from '@/components/parts/PartCard';
import { usePartsSearch } from '@/lib/hooks/usePartsSearch';
import type { Part, SearchFilters } from '@/types/marketplace';

// 1. Type definitions
interface SearchPageProps {
  initialFilters?: Partial<SearchFilters>;
  className?: string;
}

// 2. Component implementation
export const SearchPage: React.FC<SearchPageProps> = ({
  initialFilters = {},
  className = ''
}) => {
  // 3. State declarations (grouped logically)
  const [filters, setFilters] = useState<SearchFilters>({
    search: '',
    part_reference: '',
    condition: undefined,
    ...initialFilters
  });
  const [isLoading, setIsLoading] = useState(false);

  // 4. Custom hooks
  const router = useRouter();
  const { data: parts, error } = usePartsSearch(filters);

  // 5. Event handlers (use useCallback for performance)
  const handleSearch = useCallback((newFilters: SearchFilters) => {
    setFilters(newFilters);
    router.push({
      pathname: '/search',
      query: newFilters
    }, undefined, { shallow: true });
  }, [router]);

  // 6. Effects
  useEffect(() => {
    if (router.query) {
      setFilters(prev => ({ ...prev, ...router.query }));
    }
  }, [router.query]);

  // 7. Early returns for loading/error states
  if (error) {
    return <ErrorComponent message="Arama sırasında hata oluştu" />;
  }

  // 8. Render logic
  return (
    <div className={`search-page ${className}`}>
      <SearchForm
        initialFilters={filters}
        onSearch={handleSearch}
        isLoading={isLoading}
      />
      {parts && (
        <PartsList
          parts={parts}
          isLoading={isLoading}
          onInterest={handleInterestExpression}
        />
      )}
    </div>
  );
};

// 9. Default export for pages
export default SearchPage;
```

**Component Naming and Organization:**
```typescript
// ✅ Correct: Component naming conventions
export const PartCard = () => {};           // UI component
export const SearchForm = () => {};         // Form component  
export const ConversationsList = () => {};  // List component
export const MessageThread = () => {};      // Feature component

// ✅ Correct: Custom hooks naming
export const usePartsSearch = () => {};     // Data fetching hook
export const useInterestManagement = () => {};  // Business logic hook
export const useTurkishFormatter = () => {}; // Utility hook

// ✅ Correct: Utility function naming
export const formatTurkishPrice = () => {};  // Formatting utility
export const validatePartReference = () => {};  // Validation utility
export const sanitizeTurkishText = () => {}; // Turkish text handling

// ❌ Incorrect: Inconsistent naming
export const partcard = () => {};           // Should be PascalCase
export const UsePartsSearch = () => {};     // Hook should start with 'use'
export const format_price = () => {};      // Should be camelCase
```

**State Management Patterns:**
```typescript
// ✅ Correct: State structure and updates
const SearchPage: React.FC = () => {
  // Group related state
  const [searchState, setSearchState] = useState({
    filters: initialFilters,
    isLoading: false,
    error: null,
    results: []
  });

  // Use functional updates for complex state
  const updateFilters = useCallback((newFilters: Partial<SearchFilters>) => {
    setSearchState(prev => ({
      ...prev,
      filters: { ...prev.filters, ...newFilters },
      isLoading: true,
      error: null
    }));
  }, []);

  // Handle arrays immutably
  const addToFavorites = useCallback((partId: string) => {
    setFavorites(prev => {
      if (prev.includes(partId)) return prev;
      return [...prev, partId];
    });
  }, []);
};

// ❌ Incorrect: Direct state mutation
const BadComponent = () => {
  const [parts, setParts] = useState([]);
  
  const addPart = (newPart) => {
    parts.push(newPart);          // Mutating state directly
    setParts(parts);              // React won't detect change
  };
};
```

---

## Turkish Language Standards

### Text Handling and Localization

**Turkish Character Support:**
```typescript
// ✅ Correct: Turkish text handling
const turkishTextUtils = {
  // Proper Turkish character validation
  validateTurkishText: (text: string): boolean => {
    const turkishRegex = /^[a-zA-ZçğıöşüÇĞIİÖŞÜ\s\d.,!?()-]*$/;
    return turkishRegex.test(text);
  },

  // Turkish city name standardization
  standardizeCityName: (city: string): string => {
    const cityMap: Record<string, string> = {
      'istanbul': 'İstanbul',
      'İstanbul': 'İstanbul',
      'ISTANBUL': 'İstanbul',
      'ankara': 'Ankara',
      'izmir': 'İzmir',
      'İzmir': 'İzmir'
    };
    
    return cityMap[city] || city.charAt(0).toUpperCase() + city.slice(1).toLowerCase();
  },

  // Turkish text search optimization
  prepareTurkishSearchText: (text: string): string => {
    return text
      .toLowerCase()
      .replace(/ç/g, 'c')
      .replace(/ğ/g, 'g')
      .replace(/ı/g, 'i')
      .replace(/ö/g, 'o')
      .replace(/ş/g, 's')
      .replace(/ü/g, 'u');
  }
};

// ✅ Correct: Turkish language constants
const TURKISH_CONSTANTS = {
  CITIES: ['İstanbul', 'Ankara', 'İzmir', 'Bursa', 'Antalya'] as const,
  PART_CONDITIONS: ['Kullanılabilir', 'Arızalı'] as const,
  VEHICLE_BRANDS: ['BMW', 'Mercedes', 'Audi', 'Volkswagen', 'Opel'] as const,
  MESSAGES: {
    SUCCESS: {
      PART_CREATED: 'Parça başarıyla eklendi',
      INTEREST_EXPRESSED: 'İlginiz kaydedildi',
      MESSAGE_SENT: 'Mesaj gönderildi'
    },
    ERROR: {
      PART_NOT_FOUND: 'Parça bulunamadı',
      INVALID_INPUT: 'Geçersiz giriş',
      SERVER_ERROR: 'Sunucu hatası oluştu'
    }
  }
} as const;

// ❌ Incorrect: English messages in Turkish app
const BAD_CONSTANTS = {
  MESSAGES: {
    SUCCESS: 'Part created successfully',  // Should be in Turkish
    ERROR: 'Server error occurred'         // Should be in Turkish
  }
};
```

**Currency and Number Formatting:**
```typescript
// ✅ Correct: Turkish number and currency formatting
const turkishFormatters = {
  // Turkish Lira formatting
  formatPrice: (price: number): string => {
    return new Intl.NumberFormat('tr-TR', {
      style: 'currency',
      currency: 'TRY',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(price);
  },

  // Turkish number formatting (thousands separator)
  formatNumber: (num: number): string => {
    return new Intl.NumberFormat('tr-TR').format(num);
  },

  // Turkish date formatting
  formatDate: (date: Date | string): string => {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return new Intl.DateTimeFormat('tr-TR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      timeZone: 'Europe/Istanbul'
    }).format(dateObj);
  },

  // Relative time in Turkish
  formatRelativeTime: (date: Date): string => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Bugün';
    if (diffDays === 1) return 'Dün';
    if (diffDays < 7) return `${diffDays} gün önce`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} hafta önce`;
    return `${Math.floor(diffDays / 30)} ay önce`;
  }
};

// ✅ Correct: Usage in components
const PartCard: React.FC<PartCardProps> = ({ part }) => {
  const formattedPrice = turkishFormatters.formatPrice(part.price);
  const formattedDate = turkishFormatters.formatDate(part.created_at);
  
  return (
    <div className="part-card">
      <h3>{part.title}</h3>
      <p className="price">{formattedPrice}</p>
      <p className="date">{formattedDate}</p>
    </div>
  );
};
```

---

## API Design Standards

### RESTful API Conventions

**Endpoint Naming:**
```typescript
// ✅ Correct: RESTful endpoint structure
const API_ENDPOINTS = {
  // Parts management
  'GET /api/parts': 'Search parts with filters',
  'POST /api/parts': 'Create new part',
  'GET /api/parts/[id]': 'Get specific part details',
  'PUT /api/parts/[id]': 'Update part (seller only)',
  'DELETE /api/parts/[id]': 'Delete part (seller only)',
  
  // Interest management (core business logic)
  'POST /api/parts/[id]/interest': 'Express interest in part',
  'GET /api/interests': 'Get user interest history',
  
  // Conversations
  'GET /api/conversations': 'List user conversations',
  'GET /api/conversations/[id]/messages': 'Get conversation messages',
  'POST /api/conversations/[id]/messages': 'Send message',
  
  // User management
  'GET /api/user/profile': 'Get user profile',
  'PUT /api/user/profile': 'Update user profile',
  'GET /api/user/parts': 'Get user parts',
  
  // File uploads
  'POST /api/upload/images': 'Upload part images'
} as const;

// ❌ Incorrect: Inconsistent or non-RESTful naming
const BAD_ENDPOINTS = {
  'POST /api/getParts': 'Should use GET',
  'GET /api/parts/create': 'Should use POST /api/parts',
  'POST /api/delete-part': 'Should use DELETE /api/parts/[id]'
};
```

**Request/Response Standards:**
```typescript
// ✅ Correct: Consistent API response structure
interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  message?: string;          // Turkish localized message
  error?: {
    code: string;
    message: string;         // Turkish error message
    details?: unknown;
    timestamp: string;
    request_id: string;
  };
}

// ✅ Correct: API endpoint implementation
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse<Part[]>>
) {
  try {
    // Validate request method
    if (req.method !== 'POST') {
      return res.status(405).json({
        success: false,
        error: {
          code: 'METHOD_NOT_ALLOWED',
          message: 'Bu endpoint sadece POST isteklerini kabul eder',
          timestamp: new Date().toISOString(),
          request_id: generateRequestId()
        }
      });
    }

    // Validate and sanitize input
    const searchFilters = validateSearchFilters(req.body);
    if (!searchFilters) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Geçersiz arama kriterleri',
          timestamp: new Date().toISOString(),
          request_id: generateRequestId()
        }
      });
    }

    // Execute business logic
    const parts = await searchParts(searchFilters);
    
    // Return success response
    res.status(200).json({
      success: true,
      data: parts,
      message: `${parts.length} parça bulundu`
    });

  } catch (error) {
    console.error('Parts search error:', error);
    
    res.status(500).json({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: 'Arama sırasında bir hata oluştu',
        timestamp: new Date().toISOString(),
        request_id: generateRequestId()
      }
    });
  }
}

// ✅ Correct: Input validation with Turkish error messages
const validatePartData = (data: unknown): CreatePartRequest | null => {
  const schema = z.object({
    title: z.string()
      .min(5, 'Başlık en az 5 karakter olmalıdır')
      .max(200, 'Başlık en fazla 200 karakter olabilir'),
    part_reference: z.string()
      .min(3, 'Parça referansı en az 3 karakter olmalıdır')
      .regex(/^[A-Z0-9-]+$/i, 'Parça referansı sadece harf, rakam ve tire içerebilir'),
    condition: z.enum(['Kullanılabilir', 'Arızalı'], {
      errorMap: () => ({ message: 'Durum Kullanılabilir veya Arızalı olmalıdır' })
    }),
    price: z.number()
      .positive('Fiyat pozitif olmalıdır')
      .max(999999.99, 'Fiyat çok yüksek'),
    location_city: z.string()
      .min(2, 'Şehir adı en az 2 karakter olmalıdır'),
    brand: z.string()
      .min(2, 'Marka adı en az 2 karakter olmalıdır'),
    model: z.string()
      .min(1, 'Model adı gereklidir'),
    year: z.number()
      .int('Yıl tam sayı olmalıdır')
      .min(1900, 'Yıl 1900\'den küçük olamaz')
      .max(new Date().getFullYear() + 1, 'Yıl gelecek yıldan büyük olamaz'),
    description: z.string().optional(),
    images: z.array(z.string()).max(5, 'En fazla 5 resim eklenebilir')
  });

  try {
    return schema.parse(data);
  } catch (error) {
    console.error('Validation error:', error);
    return null;
  }
};
```

**Error Handling Standards:**
```typescript
// ✅ Correct: Centralized error handling with Turkish messages
export class TurkishMarketplaceError extends Error {
  constructor(
    message: string,
    public code: string,
    public statusCode: number = 500,
    public details?: unknown
  ) {
    super(message);
    this.name = 'TurkishMarketplaceError';
  }
}

// Error code constants with Turkish messages
export const ERROR_CODES = {
  // Authentication errors
  UNAUTHORIZED: {
    code: 'UNAUTHORIZED',
    message: 'Giriş yapmanız gerekiyor',
    statusCode: 401
  },
  FORBIDDEN: {
    code: 'FORBIDDEN', 
    message: 'Bu işlem için yetkiniz yok',
    statusCode: 403
  },

  // Validation errors
  VALIDATION_ERROR: {
    code: 'VALIDATION_ERROR',
    message: 'Geçersiz form verisi',
    statusCode: 400
  },
  PART_NOT_FOUND: {
    code: 'PART_NOT_FOUND',
    message: 'Parça bulunamadı',
    statusCode: 404
  },

  // Business logic errors
  OWN_PART_INTEREST: {
    code: 'OWN_PART_INTEREST',
    message: 'Kendi parçanıza ilgi bildiremezsiniz',
    statusCode: 400
  },
  INTEREST_EXISTS: {
    code: 'INTEREST_EXISTS',
    message: 'Bu parça için zaten ilgi bildirdiniz',
    statusCode: 409
  },

  // System errors
  INTERNAL_ERROR: {
    code: 'INTERNAL_ERROR',
    message: 'Sunucu hatası oluştu',
    statusCode: 500
  }
} as const;

// ✅ Correct: Error handler middleware
export const withErrorHandler = (
  handler: (req: NextApiRequest, res: NextApiResponse) => Promise<void>
) => {
  return async (req: NextApiRequest, res: NextApiResponse) => {
    try {
      await handler(req, res);
    } catch (error) {
      if (error instanceof TurkishMarketplaceError) {
        res.status(error.statusCode).json({
          success: false,
          error: {
            code: error.code,
            message: error.message,
            details: error.details,
            timestamp: new Date().toISOString(),
            request_id: generateRequestId()
          }
        });
      } else {
        console.error('Unhandled error:', error);
        res.status(500).json({
          success: false,
          error: ERROR_CODES.INTERNAL_ERROR
        });
      }
    }
  };
};
```

---

## Database Standards

### Naming Conventions

**Table and Column Standards:**
```sql
-- ✅ Correct: PostgreSQL naming conventions
-- Table names: lowercase with underscores, plural nouns
CREATE TABLE user_profiles (
    id UUID PRIMARY KEY,
    email TEXT NOT NULL,
    profile_complete BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE parts (
    id UUID PRIMARY KEY,
    seller_id UUID REFERENCES user_profiles(id),
    title TEXT NOT NULL,
    part_reference TEXT NOT NULL,        -- Critical for Turkish marketplace
    condition TEXT CHECK (condition IN ('Kullanılabilir', 'Arızalı')),
    price DECIMAL(10,2) NOT NULL,
    location_city TEXT NOT NULL,
    brand TEXT NOT NULL,
    model TEXT NOT NULL,
    year INTEGER NOT NULL,
    description TEXT,
    images TEXT[] DEFAULT '{}',
    status TEXT DEFAULT 'active',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index names: descriptive with table prefix
CREATE INDEX idx_parts_part_reference ON parts USING GIN (part_reference gin_trgm_ops);
CREATE INDEX idx_parts_brand_model ON parts (brand, model);
CREATE INDEX idx_parts_turkish_search ON parts USING GIN (
    to_tsvector('turkish', title || ' ' || part_reference || ' ' || COALESCE(description, ''))
);

-- ❌ Incorrect: Inconsistent naming
CREATE TABLE Part (                     -- Should be lowercase plural
    Id UUID PRIMARY KEY,                -- Should be lowercase
    sellerId UUID,                      -- Should use snake_case
    Title varchar(255),                 -- Should use TEXT
    createdDate timestamp               -- Should be created_at with timezone
);
```

**Query Standards:**
```sql
-- ✅ Correct: Formatted SQL with Turkish optimization
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
    up.email AS seller_email
FROM parts p
INNER JOIN user_profiles up ON p.seller_id = up.id
WHERE p.status = 'active'
    AND p.condition = 'Kullanılabilir'
    AND (
        p.title ILIKE '%' || $1 || '%'
        OR p.part_reference ILIKE '%' || $1 || '%'
        OR p.description ILIKE '%' || $1 || '%'
    )
    AND ($2 IS NULL OR p.location_city = $2)
    AND ($3 IS NULL OR p.brand ILIKE '%' || $3 || '%')
    AND ($4 IS NULL OR p.price >= $4)
    AND ($5 IS NULL OR p.price <= $5)
ORDER BY p.created_at DESC
LIMIT $6 OFFSET $7;

-- ✅ Correct: Turkish text search function
CREATE OR REPLACE FUNCTION search_parts_turkish(
    search_text TEXT DEFAULT NULL,
    city_filter TEXT DEFAULT NULL,
    brand_filter TEXT DEFAULT NULL,
    min_price DECIMAL DEFAULT NULL,
    max_price DECIMAL DEFAULT NULL,
    limit_count INTEGER DEFAULT 20,
    offset_count INTEGER DEFAULT 0
) RETURNS TABLE (
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
    seller_email TEXT
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        p.id, p.title, p.part_reference, p.condition, p.price,
        p.location_city, p.brand, p.model, p.year, p.description,
        p.images, p.created_at, up.email
    FROM parts p
    INNER JOIN user_profiles up ON p.seller_id = up.id
    WHERE p.status = 'active'
        AND (search_text IS NULL OR 
             to_tsvector('turkish', p.title || ' ' || p.part_reference || ' ' || COALESCE(p.description, ''))
             @@ plainto_tsquery('turkish', search_text))
        AND (city_filter IS NULL OR p.location_city = city_filter)
        AND (brand_filter IS NULL OR p.brand ILIKE '%' || brand_filter || '%')
        AND (min_price IS NULL OR p.price >= min_price)
        AND (max_price IS NULL OR p.price <= max_price)
    ORDER BY 
        CASE WHEN search_text IS NOT NULL THEN
            ts_rank(
                to_tsvector('turkish', p.title || ' ' || p.part_reference || ' ' || COALESCE(p.description, '')),
                plainto_tsquery('turkish', search_text)
            )
        END DESC,
        p.created_at DESC
    LIMIT limit_count OFFSET offset_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

---

## CSS and Styling Standards

### TailwindCSS Conventions

**Class Organization:**
```tsx
// ✅ Correct: Multi-line class organization with responsive design
const PartCard: React.FC<PartCardProps> = ({ part, variant }) => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden transition-shadow duration-200
                    hover:shadow-lg hover:scale-[1.02]
                    xs:p-4 xs:rounded-md
                    sm:p-6 sm:rounded-lg 
                    md:p-8 md:max-w-md
                    lg:p-10 lg:max-w-lg
                    xl:p-12 xl:max-w-xl">
      
      {/* Turkish price formatting */}
      <div className="flex justify-between items-center mb-4
                      xs:flex-col xs:items-start xs:gap-2
                      sm:flex-row sm:items-center sm:gap-0">
        <h3 className="text-lg font-semibold text-gray-900 line-clamp-2
                       xs:text-base
                       sm:text-lg
                       md:text-xl">
          {part.title}
        </h3>
        <span className="text-xl font-bold text-turkish-green-600 whitespace-nowrap
                         xs:text-lg
                         sm:text-xl
                         md:text-2xl">
          {formatTurkishPrice(part.price)}
        </span>
      </div>
      
      {/* Part reference with monospace font for readability */}
      <div className="mb-3 p-2 bg-gray-50 rounded border-l-4 border-blue-500">
        <span className="text-sm text-gray-600">Parça No:</span>
        <span className="ml-2 font-mono text-sm bg-white px-2 py-1 rounded border">
          {part.part_reference}
        </span>
      </div>
    </div>
  );
};

// ❌ Incorrect: Long single-line classes, no organization
const BadComponent = () => (
  <div className="bg-white rounded-lg shadow-md overflow-hidden transition-shadow duration-200 hover:shadow-lg hover:scale-[1.02] xs:p-4 xs:rounded-md sm:p-6 sm:rounded-lg md:p-8 md:max-w-md lg:p-10 lg:max-w-lg xl:p-12 xl:max-w-xl">
    {/* Hard to read and maintain */}
  </div>
);
```

**Turkish Market Color Palette:**
```typescript
// tailwind.config.js - Turkish marketplace colors
module.exports = {
  theme: {
    extend: {
      colors: {
        // Primary brand colors for Turkish marketplace
        'turkish-green': {
          50: '#f0fdf4',
          100: '#dcfce7',
          200: '#bbf7d0',
          300: '#86efac',
          400: '#4ade80',
          500: '#22c55e',     // Success states
          600: '#16a34a',     // Primary brand color
          700: '#15803d',     // Hover states
          800: '#166534',
          900: '#14532d',
        },
        'turkish-red': {
          50: '#fef2f2',
          100: '#fee2e2',
          200: '#fecaca',
          300: '#fca5a5',
          400: '#f87171',
          500: '#ef4444',     // Error states
          600: '#dc2626',     // Alert states
          700: '#b91c1c',
          800: '#991b1b',
          900: '#7f1d1d',
        },
        // Status colors
        'condition-working': '#22c55e',    // Kullanılabilir
        'condition-broken': '#f59e0b',     // Arızalı
        'price-highlight': '#1d4ed8',      // Price emphasis
        'turkish-blue': '#1e40af',        // Accent color
      },
      
      // Turkish mobile breakpoints
      screens: {
        'xs': '400px',        // Small Turkish mobile devices
        'sm': '640px',        // Standard mobile
        'md': '768px',        // Tablet
        'lg': '1024px',       // Desktop
        'xl': '1280px',       // Large desktop
        '2xl': '1536px',      // Extra large
      },
      
      // Turkish text optimizations
      fontFamily: {
        'sans': ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        'mono': ['JetBrains Mono', 'Consolas', 'monospace'],
      },
      
      // Turkish currency and number spacing
      spacing: {
        '18': '4.5rem',       // Custom spacing for price displays
        '88': '22rem',        // Large content areas
      }
    }
  }
};
```

---

## Testing Standards

### Unit Testing Conventions

**Test File Structure:**
```typescript
// __tests__/components/PartCard.test.tsx
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { PartCard } from '@/components/parts/PartCard';
import { turkishFormatters } from '@/lib/utils/formatters';
import type { Part } from '@/types/marketplace';

// Mock data with Turkish content
const mockTurkishPart: Part = {
  id: '123e4567-e89b-12d3-a456-426614174000',
  seller_id: '987fcdeb-51a2-43d1-9c4b-426614174111',
  title: 'BMW E46 Alternatör - Orijinal Bosch',
  part_reference: '12317501999',
  condition: 'Kullanılabilir',
  price: 850.00,
  location_city: 'İstanbul',
  brand: 'BMW',
  model: 'E46',
  year: 2003,
  description: 'Orijinal Bosch alternatör, 2 yıl garanti',
  images: [
    'https://example.com/image1.jpg',
    'https://example.com/image2.jpg'
  ],
  status: 'active',
  created_at: '2024-08-01T10:30:00Z',
  updated_at: '2024-08-01T10:30:00Z'
};

// Test suite organization
describe('PartCard Component', () => {
  // Group tests by functionality
  describe('Turkish Content Rendering', () => {
    it('should render Turkish part title correctly', () => {
      render(<PartCard part={mockTurkishPart} variant="list" />);
      
      expect(screen.getByText('BMW E46 Alternatör - Orijinal Bosch')).toBeInTheDocument();
    });

    it('should display Turkish condition labels', () => {
      render(<PartCard part={mockTurkishPart} variant="list" />);
      
      expect(screen.getByText('Kullanılabilir')).toBeInTheDocument();
      expect(screen.getByText('Kullanılabilir')).toHaveClass('text-green-600');
    });

    it('should show Turkish city name', () => {
      render(<PartCard part={mockTurkishPart} variant="list" />);
      
      expect(screen.getByText('İstanbul')).toBeInTheDocument();
    });
  });

  describe('Price Formatting', () => {
    it('should format price in Turkish Lira', () => {
      render(<PartCard part={mockTurkishPart} variant="list" />);
      
      const formattedPrice = turkishFormatters.formatPrice(850.00);
      expect(screen.getByText(formattedPrice)).toBeInTheDocument();
    });

    it('should handle decimal prices correctly', () => {
      const partWithDecimal = { ...mockTurkishPart, price: 1299.99 };
      render(<PartCard part={partWithDecimal} variant="list" />);
      
      expect(screen.getByText(/1\.299,99/)).toBeInTheDocument();
    });
  });

  describe('Part Reference Display', () => {
    it('should prominently display part reference number', () => {
      render(<PartCard part={mockTurkishPart} variant="detailed" />);
      
      const partRefElement = screen.getByText('12317501999');
      expect(partRefElement).toBeInTheDocument();
      expect(partRefElement).toHaveClass('font-mono'); // Monospace for readability
    });
  });

  describe('Interest Button Interaction', () => {
    it('should call onInterest with correct parameters when interested', async () => {
      const mockOnInterest = jest.fn();
      const user = userEvent.setup();
      
      render(
        <PartCard 
          part={mockTurkishPart} 
          variant="detailed" 
          onInterest={mockOnInterest}
        />
      );
      
      const interestedButton = screen.getByText('İlgileniyorum');
      await user.click(interestedButton);
      
      expect(mockOnInterest).toHaveBeenCalledWith(mockTurkishPart.id, 'interested');
    });
  });

  describe('Accessibility', () => {
    it('should have proper ARIA labels for Turkish users', () => {
      render(<PartCard part={mockTurkishPart} variant="list" />);
      
      const partTitle = screen.getByRole('heading');
      expect(partTitle).toBeInTheDocument();
      
      const partImage = screen.getByRole('img');
      expect(partImage).toHaveAttribute('alt', expect.stringContaining('BMW E46'));
    });
  });
});

// ✅ Correct: API endpoint testing with Turkish content
describe('POST /api/parts', () => {
  it('should create part with Turkish content', async () => {
    const turkishPartData = {
      title: 'Mercedes W203 Fren Diski',
      part_reference: 'A2034230612',
      condition: 'Kullanılabilir',
      price: 450.00,
      location_city: 'Ankara',
      brand: 'Mercedes',
      model: 'W203',
      year: 2005,
      description: 'Orijinal Mercedes fren diski, hiç kullanılmamış'
    };

    const response = await request(app)
      .post('/api/parts')
      .set('Authorization', `Bearer ${validToken}`)
      .send(turkishPartData)
      .expect(201);

    expect(response.body.success).toBe(true);
    expect(response.body.data.title).toBe('Mercedes W203 Fren Diski');
    expect(response.body.message).toBe('Parça başarıyla eklendi');
  });

  it('should validate Turkish city names', async () => {
    const invalidPartData = {
      ...validPartData,
      location_city: 'InvalidCity'
    };

    const response = await request(app)
      .post('/api/parts')
      .set('Authorization', `Bearer ${validToken}`)
      .send(invalidPartData)
      .expect(400);

    expect(response.body.success).toBe(false);
    expect(response.body.error.code).toBe('VALIDATION_ERROR');
    expect(response.body.error.message).toContain('şehir');
  });
});
```

---

## Performance Standards

### Code Optimization

**React Performance:**
```typescript
// ✅ Correct: Memoization for expensive operations
const PartsList: React.FC<PartsListProps> = ({ parts, filters, onInterest }) => {
  // Memoize expensive calculations
  const filteredParts = useMemo(() => {
    return parts.filter(part => {
      if (filters.condition && part.condition !== filters.condition) return false;
      if (filters.brand && !part.brand.toLowerCase().includes(filters.brand.toLowerCase())) return false;
      return true;
    });
  }, [parts, filters.condition, filters.brand]);

  // Memoize callback functions
  const handleInterest = useCallback((partId: string, type: InterestType) => {
    onInterest(partId, type);
  }, [onInterest]);

  // Virtual scrolling for large lists
  const [visibleRange, setVisibleRange] = useState({ start: 0, end: 20 });
  
  return (
    <VirtualizedList
      items={filteredParts}
      renderItem={(part, index) => (
        <PartCard
          key={part.id}
          part={part}
          variant="list"
          onInterest={handleInterest}
        />
      )}
      visibleRange={visibleRange}
      onRangeChange={setVisibleRange}
    />
  );
};

// ✅ Correct: Component memoization with custom comparison
export const PartCard = React.memo<PartCardProps>(
  ({ part, variant, onInterest, currentUserInterest }) => {
    // Component implementation
  },
  // Custom comparison function
  (prevProps, nextProps) => {
    return (
      prevProps.part.id === nextProps.part.id &&
      prevProps.part.updated_at === nextProps.part.updated_at &&
      prevProps.currentUserInterest === nextProps.currentUserInterest &&
      prevProps.variant === nextProps.variant
    );
  }
);
```

**Bundle Optimization:**
```typescript
// ✅ Correct: Dynamic imports for code splitting
const PartDetailsPage: React.FC = () => {
  const [showImageModal, setShowImageModal] = useState(false);

  // Lazy load heavy components
  const ImageModal = useMemo(() => 
    lazy(() => import('@/components/modals/ImageModal')), 
    []
  );

  const ConversationInterface = useMemo(() => 
    lazy(() => import('@/components/messaging/ConversationInterface')), 
    []
  );

  return (
    <div>
      {/* Always visible content */}
      <PartDetails part={part} />
      
      {/* Conditionally loaded heavy components */}
      {showImageModal && (
        <Suspense fallback={<LoadingSpinner />}>
          <ImageModal images={part.images} onClose={() => setShowImageModal(false)} />
        </Suspense>
      )}
    </div>
  );
};

// ✅ Correct: Tree shaking friendly imports
import { formatTurkishPrice } from '@/lib/utils/formatters';  // Specific import
import { debounce } from 'lodash-es';  // Tree-shakeable lodash

// ❌ Incorrect: Imports that hurt bundle size
import * as formatters from '@/lib/utils/formatters';  // Imports everything
import _ from 'lodash';  // Imports entire library
```

---

## Documentation Standards

### Code Documentation

**Function Documentation:**
```typescript
/**
 * Searches for parts using Turkish-optimized text search
 * @param filters - Search criteria including Turkish city names and text
 * @param userId - Optional user ID for personalized results
 * @returns Promise resolving to search results with Turkish formatting
 * 
 * @example
 * ```typescript
 * const results = await searchParts({
 *   search: 'BMW alternatör',
 *   location_city: 'İstanbul',
 *   condition: 'Kullanılabilir'
 * }, userId);
 * ```
 */
export async function searchParts(
  filters: SearchFilters,
  userId?: string
): Promise<SearchPartsResponse> {
  // Implementation with Turkish text optimization
  const startTime = Date.now();
  
  try {
    // Use trigram search for Turkish text matching
    const query = buildTurkishSearchQuery(filters);
    const parts = await executeSearch(query, userId);
    
    return {
      success: true,
      data: {
        parts: parts.map(part => ({
          ...part,
          // Mask seller email for privacy
          seller_email: maskEmail(part.seller_email)
        })),
        search_info: {
          query: filters.search || '',
          execution_time_ms: Date.now() - startTime,
          total_results: parts.length
        }
      }
    };
  } catch (error) {
    throw new TurkishMarketplaceError(
      'Parça arama başarısız oldu',
      'SEARCH_FAILED',
      500,
      { filters, error: error.message }
    );
  }
}

/**
 * Turkish-specific text utilities for marketplace content
 */
export const turkishTextUtils = {
  /**
   * Validates text contains only valid Turkish characters
   * @param text - Text to validate
   * @returns True if text contains only valid Turkish characters
   */
  isValidTurkishText: (text: string): boolean => {
    const turkishRegex = /^[a-zA-ZçğıöşüÇĞIİÖŞÜ\s\d.,!?()-]*$/;
    return turkishRegex.test(text);
  },

  /**
   * Standardizes Turkish city names to proper case
   * @param cityName - Raw city name input
   * @returns Standardized city name with proper Turkish capitalization
   */
  standardizeCityName: (cityName: string): string => {
    // Implementation details...
  }
};
```

**Component Documentation:**
```typescript
/**
 * PartCard component displays individual parts in the Turkish marketplace
 * 
 * Features:
 * - Turkish price formatting with TRY currency
 * - Part reference number prominence (critical for Turkish users)
 * - Interest-gating button integration
 * - Multiple display variants (list, detailed, compact)
 * - Mobile-first responsive design
 * 
 * @example
 * ```tsx
 * <PartCard
 *   part={turkishPart}
 *   variant="detailed"
 *   onInterest={handleInterestExpression}
 *   currentUserInterest="interested"
 * />
 * ```
 */
interface PartCardProps {
  /** Part data with Turkish content support */
  part: Part;
  /** Display variant for different use cases */
  variant: 'list' | 'detailed' | 'compact';
  /** Show seller information (masked email) */
  showSellerInfo?: boolean;
  /** Callback for interest expression (core business logic) */
  onInterest?: (partId: string, type: InterestType) => void;
  /** Current user's interest status for this part */
  currentUserInterest?: InterestType | null;
  /** Additional CSS classes */
  className?: string;
}

export const PartCard: React.FC<PartCardProps> = ({
  part,
  variant,
  showSellerInfo = false,
  onInterest,
  currentUserInterest,
  className = ''
}) => {
  // Component implementation with Turkish optimization
};
```

---

## Conclusion

These coding standards provide comprehensive guidelines for maintaining high-quality, consistent code across the BanaYeni SanaEski Turkish automotive parts marketplace. The standards emphasize:

**Code Quality:**
- Consistent TypeScript usage with gradual adoption
- Comprehensive error handling with Turkish localization
- Performance optimization for Turkish mobile networks
- Proper testing coverage with Turkish content validation

**Turkish Market Focus:**
- Proper Turkish character support throughout the codebase
- Currency and date formatting for Turkish users
- Search optimization for Turkish text patterns
- UI text and error messages in Turkish

**Maintainability:**
- Clear naming conventions and code organization
- Comprehensive documentation with examples
- Consistent API design patterns
- Automated code quality enforcement

**Performance:**
- Bundle optimization and code splitting
- Database query optimization for Turkish text search
- Component memoization and rendering optimization
- Mobile-first responsive design patterns

Following these standards ensures that all code contributions maintain the quality, consistency, and Turkish market optimization necessary for the success of BanaYeni SanaEski in the competitive Turkish automotive parts marketplace.

---

*These coding standards serve as the definitive reference for all development work on the BanaYeni SanaEski project and must be followed by all team members.*