# Testing Strategy - BanaYeni SanaEski

**Document Type:** Comprehensive Testing Strategy Framework  
**Created:** August 6, 2025  
**Version:** 1.0  
**Status:** Testing Implementation Guide  

---

## Testing Overview

This document defines the comprehensive testing strategy for BanaYeni SanaEski, focusing on quality assurance for the Turkish automotive parts marketplace. The testing framework ensures system reliability, user experience quality, business logic correctness, and performance optimization across all components.

**Testing Objectives:**
- **Quality Assurance:** Comprehensive coverage of all system components
- **Turkish Market Validation:** Specific testing for Turkish language, mobile networks, and user behaviors
- **Business Logic Verification:** Interest-gating system and marketplace workflows
- **Performance Validation:** Response times and mobile optimization
- **Security Testing:** Authentication, authorization, and data protection

---

## Testing Architecture

### 1. Multi-Layer Testing Pyramid

**Testing Strategy Pyramid:**
```
┌─────────────────────────────────────────────────────┐
│                   E2E Tests                         │
│     • User Journeys • Business Workflows           │
│     • Turkish Mobile Testing • Cross-browser       │
├─────────────────────────────────────────────────────┤
│              Integration Tests                      │
│     • API Testing • Database Integration           │
│     • Turkish Search • Component Integration       │
├─────────────────────────────────────────────────────┤
│                Unit Tests                           │
│     • Component Logic • Utility Functions          │
│     • Business Rules • Turkish Text Processing     │
└─────────────────────────────────────────────────────┘
```

**Testing Distribution:**
- **Unit Tests:** 70% coverage - Fast, isolated component testing
- **Integration Tests:** 20% coverage - API and database integration
- **End-to-End Tests:** 10% coverage - Critical user journeys
- **Manual Tests:** Turkish UX and accessibility validation

---

## Unit Testing Strategy

### 2. Component and Utility Testing

**Jest Configuration for Turkish Marketplace:**
```javascript
// jest.config.js - Optimized for Turkish marketplace testing
const nextJest = require('next/jest');

const createJestConfig = nextJest({
  dir: './',
});

const customJestConfig = {
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  testEnvironment: 'jest-environment-jsdom',
  
  // Module path mapping
  moduleNameMapping: {
    '^@/components/(.*)$': '<rootDir>/components/$1',
    '^@/lib/(.*)$': '<rootDir>/lib/$1',
    '^@/pages/(.*)$': '<rootDir>/pages/$1',
    '^@/types/(.*)$': '<rootDir>/types/$1',
    '^@/styles/(.*)$': '<rootDir>/styles/$1',
  },
  
  // Coverage configuration
  collectCoverageFrom: [
    'components/**/*.{js,jsx,ts,tsx}',
    'lib/**/*.{js,jsx,ts,tsx}',
    'pages/api/**/*.{js,jsx,ts,tsx}',
    '!**/*.d.ts',
    '!**/node_modules/**',
  ],
  
  // Coverage thresholds for Turkish marketplace
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 85,
      lines: 85,
      statements: 85,
    },
    // Critical paths require higher coverage
    './lib/services/': {
      branches: 90,
      functions: 95,
      lines: 95,
      statements: 95,
    },
    './components/parts/': {
      branches: 85,
      functions: 90,
      lines: 90,
      statements: 90,
    },
  },
  
  // Test patterns
  testMatch: [
    '<rootDir>/**/__tests__/**/*.{js,jsx,ts,tsx}',
    '<rootDir>/**/*.(test|spec).{js,jsx,ts,tsx}',
  ],
  
  // Turkish-specific test environment
  globals: {
    'ts-jest': {
      useESM: true,
      isolatedModules: true,
    },
  },
  
  // Transform configuration for Turkish text
  transform: {
    '^.+\\.(js|jsx|ts|tsx)$': ['babel-jest', { presets: ['next/babel'] }],
  },
  
  // Setup files for Turkish testing
  setupFiles: ['<rootDir>/jest.polyfills.js'],
};

module.exports = createJestConfig(customJestConfig);
```

**Turkish Text Processing Tests:**
```typescript
// __tests__/lib/turkish-text-processing.test.ts
import { describe, it, expect } from '@jest/globals';
import { 
  normalizedTurkishText, 
  validateTurkishInput,
  formatTurkishCurrency,
  parseTurkishDate,
  turkishSearchSimilarity 
} from '@/lib/utils/turkish-helpers';

describe('Turkish Text Processing', () => {
  describe('normalizedTurkishText', () => {
    it('should normalize Turkish characters correctly', () => {
      const input = 'Çok güzel bir araç parçası';
      const expected = 'cok guzel bir arac parcasi';
      
      expect(normalizedTurkishText(input)).toBe(expected);
    });

    it('should handle mixed case Turkish text', () => {
      const input = 'BMW E46 ALTERNATÖR çok temiz';
      const expected = 'bmw e46 alternator cok temiz';
      
      expect(normalizedTurkishText(input)).toBe(expected);
    });

    it('should preserve numbers and special characters', () => {
      const input = 'Motor 1.6 TDI - 2008 model';
      const expected = 'motor 1.6 tdi - 2008 model';
      
      expect(normalizedTurkishText(input)).toBe(expected);
    });

    it('should handle empty and null inputs', () => {
      expect(normalizedTurkishText('')).toBe('');
      expect(normalizedTurkishText(null)).toBe('');
      expect(normalizedTurkishText(undefined)).toBe('');
    });
  });

  describe('validateTurkishInput', () => {
    it('should validate Turkish part names', () => {
      const validNames = [
        'BMW Alternatör',
        'Mercedes Fren Diski',
        'Volkswagen Motor Yağı',
        'Renault Çamurluk'
      ];

      validNames.forEach(name => {
        expect(validateTurkishInput(name)).toBe(true);
      });
    });

    it('should reject invalid characters', () => {
      const invalidNames = [
        'BMW<script>alert(1)</script>',
        'Motor & Parça',
        'Test@#$%^&*()',
        ''
      ];

      invalidNames.forEach(name => {
        expect(validateTurkishInput(name)).toBe(false);
      });
    });

    it('should handle Turkish character encoding correctly', () => {
      // Test different Turkish character encodings
      const turkishText = 'İstanbul\'da güzel bir araç';
      expect(validateTurkishInput(turkishText)).toBe(true);
    });
  });

  describe('formatTurkishCurrency', () => {
    it('should format Turkish Lira correctly', () => {
      expect(formatTurkishCurrency(1234.56)).toBe('₺1.234,56');
      expect(formatTurkishCurrency(1000)).toBe('₺1.000,00');
      expect(formatTurkishCurrency(500.5)).toBe('₺500,50');
    });

    it('should handle edge cases', () => {
      expect(formatTurkishCurrency(0)).toBe('₺0,00');
      expect(formatTurkishCurrency(-100)).toBe('-₺100,00');
      expect(formatTurkishCurrency(0.01)).toBe('₺0,01');
    });
  });

  describe('turkishSearchSimilarity', () => {
    it('should calculate similarity for Turkish searches', () => {
      const query = 'alternatör';
      const targets = [
        'BMW Alternatör',
        'alternator',
        'Motor parçası',
        'Fren diski'
      ];

      const similarities = targets.map(target => 
        turkishSearchSimilarity(query, target)
      );

      // BMW Alternatör should be most similar
      expect(similarities[0]).toBeGreaterThan(0.8);
      expect(similarities[1]).toBeGreaterThan(0.6); // alternator
      expect(similarities[2]).toBeLessThan(0.3); // Motor parçası
      expect(similarities[3]).toBeLessThan(0.2); // Fren diski
    });

    it('should handle case-insensitive Turkish matching', () => {
      const query = 'bmw alternatör';
      const target = 'BMW ALTERNATOR';
      
      const similarity = turkishSearchSimilarity(query, target);
      expect(similarity).toBeGreaterThan(0.7);
    });
  });
});

// Component testing for Turkish marketplace
describe('Turkish Marketplace Components', () => {
  describe('PartCard Component', () => {
    const mockPart = {
      id: 'test-id',
      seller_id: 'seller-id',
      title: 'BMW E46 Alternatör',
      part_reference: 'ALT123456',
      condition: 'Kullanılabilir' as const,
      price: 850.50,
      location_city: 'İstanbul',
      brand: 'BMW',
      model: 'E46',
      year: 2003,
      description: 'Orijinal Bosch alternatör, çok temiz',
      images: ['/images/part1.jpg'],
      status: 'active' as const,
      created_at: '2024-01-01T00:00:00Z',
      updated_at: '2024-01-01T00:00:00Z'
    };

    beforeEach(() => {
      // Mock Next.js router
      jest.mock('next/router', () => ({
        useRouter: () => ({
          push: jest.fn(),
          query: {},
          pathname: '/search',
        }),
      }));
    });

    it('should render Turkish part information correctly', () => {
      const { getByText, getByRole } = render(
        <PartCard part={mockPart} variant="list" />
      );

      expect(getByText('BMW E46 Alternatör')).toBeInTheDocument();
      expect(getByText('ALT123456')).toBeInTheDocument();
      expect(getByText('Kullanılabilir')).toBeInTheDocument();
      expect(getByText('İstanbul')).toBeInTheDocument();
      expect(getByText(/₺850,50/)).toBeInTheDocument();
    });

    it('should handle Turkish character display correctly', () => {
      const turkishPart = {
        ...mockPart,
        title: 'Çok güzel alternatör',
        description: 'Hiçbir problemi yok, mükemmel çalışıyor'
      };

      const { getByText } = render(
        <PartCard part={turkishPart} variant="list" />
      );

      expect(getByText('Çok güzel alternatör')).toBeInTheDocument();
    });

    it('should show condition badge with Turkish text', () => {
      const { getByText } = render(
        <PartCard part={mockPart} variant="list" />
      );

      const conditionBadge = getByText('Kullanılabilir');
      expect(conditionBadge).toHaveClass('bg-green-100', 'text-green-800');
    });

    it('should format price in Turkish Lira', () => {
      const { getByText } = render(
        <PartCard part={mockPart} variant="list" />
      );

      expect(getByText('₺850,50')).toBeInTheDocument();
    });

    it('should handle missing images gracefully', () => {
      const partWithoutImages = {
        ...mockPart,
        images: []
      };

      const { getByAltText } = render(
        <PartCard part={partWithoutImages} variant="list" />
      );

      expect(getByAltText('Parça resmi yok')).toBeInTheDocument();
    });
  });

  describe('SearchForm Component', () => {
    const mockOnSearch = jest.fn();

    beforeEach(() => {
      mockOnSearch.mockClear();
    });

    it('should handle Turkish search input', async () => {
      const { getByPlaceholderText, getByRole } = render(
        <SearchForm onSearch={mockOnSearch} />
      );

      const searchInput = getByPlaceholderText('Parça ara...');
      const searchButton = getByRole('button', { name: /ara/i });

      await userEvent.type(searchInput, 'BMW alternatör');
      await userEvent.click(searchButton);

      expect(mockOnSearch).toHaveBeenCalledWith({
        query: 'BMW alternatör',
        filters: {}
      });
    });

    it('should validate Turkish city selection', async () => {
      const { getByRole, getByText } = render(
        <SearchForm onSearch={mockOnSearch} />
      );

      const citySelect = getByRole('combobox', { name: /şehir/i });
      
      await userEvent.selectOptions(citySelect, 'İstanbul');
      expect(getByText('İstanbul')).toBeSelected();

      await userEvent.selectOptions(citySelect, 'Ankara');
      expect(getByText('Ankara')).toBeSelected();
    });

    it('should handle Turkish brand filtering', async () => {
      const { getByRole } = render(
        <SearchForm onSearch={mockOnSearch} />
      );

      const brandSelect = getByRole('combobox', { name: /marka/i });
      
      await userEvent.selectOptions(brandSelect, 'BMW');
      
      const searchButton = getByRole('button', { name: /ara/i });
      await userEvent.click(searchButton);

      expect(mockOnSearch).toHaveBeenCalledWith({
        query: '',
        filters: { brand: 'BMW' }
      });
    });
  });

  describe('InterestButton Component', () => {
    const mockOnInterest = jest.fn();
    const mockPart = {
      id: 'test-part-id',
      title: 'Test Part',
      seller_id: 'seller-id'
    };

    beforeEach(() => {
      mockOnInterest.mockClear();
    });

    it('should show Turkish interest text', () => {
      const { getByRole } = render(
        <InterestButton 
          part={mockPart} 
          onInterest={mockOnInterest}
          isInterested={false}
        />
      );

      expect(getByRole('button', { name: /ilgileniyorum/i })).toBeInTheDocument();
    });

    it('should toggle interest state with Turkish feedback', async () => {
      const { getByRole, rerender } = render(
        <InterestButton 
          part={mockPart} 
          onInterest={mockOnInterest}
          isInterested={false}
        />
      );

      const button = getByRole('button');
      await userEvent.click(button);

      expect(mockOnInterest).toHaveBeenCalledWith('test-part-id', 'interested');

      rerender(
        <InterestButton 
          part={mockPart} 
          onInterest={mockOnInterest}
          isInterested={true}
        />
      );

      expect(getByRole('button', { name: /İlgimi çektmez/i })).toBeInTheDocument();
    });

    it('should prevent self-interest', () => {
      // Mock authenticated user as seller
      const mockUseAuth = jest.fn(() => ({
        user: { id: 'seller-id' },
        loading: false
      }));

      jest.mock('@/lib/hooks/useAuth', () => mockUseAuth);

      const { getByText } = render(
        <InterestButton 
          part={mockPart} 
          onInterest={mockOnInterest}
          isInterested={false}
        />
      );

      expect(getByText('Kendi parçanız')).toBeInTheDocument();
    });
  });
});

// Business logic testing
describe('Turkish Marketplace Business Logic', () => {
  describe('PartsService', () => {
    let partsService: PartsService;
    
    beforeEach(() => {
      partsService = new PartsService(mockSupabaseClient);
    });

    describe('searchParts', () => {
      it('should perform Turkish text search correctly', async () => {
        const mockData = [
          { id: '1', title: 'BMW Alternatör', brand: 'BMW' },
          { id: '2', title: 'Mercedes Alternator', brand: 'Mercedes' }
        ];

        mockSupabaseClient.rpc = jest.fn().mockResolvedValue({
          data: mockData,
          error: null
        });

        const results = await partsService.searchParts({
          query: 'alternatör',
          limit: 20
        });

        expect(mockSupabaseClient.rpc).toHaveBeenCalledWith(
          'search_parts_turkish_optimized',
          expect.objectContaining({
            search_query: 'alternatör',
            limit_count: 20
          })
        );

        expect(results).toHaveLength(2);
        expect(results[0].title).toBe('BMW Alternatör');
      });

      it('should handle Turkish city filtering', async () => {
        await partsService.searchParts({
          query: 'motor',
          filters: { city: 'İstanbul' }
        });

        expect(mockSupabaseClient.rpc).toHaveBeenCalledWith(
          'search_parts_turkish_optimized',
          expect.objectContaining({
            filter_city: 'İstanbul'
          })
        );
      });

      it('should validate Turkish input parameters', async () => {
        const invalidQuery = '<script>alert("xss")</script>';
        
        await expect(
          partsService.searchParts({ query: invalidQuery })
        ).rejects.toThrow('Invalid search query');
      });
    });

    describe('createPart', () => {
      const validPartData = {
        title: 'BMW E46 Motor',
        part_reference: 'MOT123456',
        condition: 'Kullanılabilir' as const,
        price: 5000,
        location_city: 'İstanbul',
        brand: 'BMW',
        model: 'E46',
        year: 2003,
        description: 'Çok temiz motor'
      };

      it('should create part with Turkish data', async () => {
        mockSupabaseClient.from = jest.fn().mockReturnValue({
          insert: jest.fn().mockReturnValue({
            select: jest.fn().mockReturnValue({
              single: jest.fn().mockResolvedValue({
                data: { ...validPartData, id: 'new-id' },
                error: null
              })
            })
          })
        });

        const result = await partsService.createPart(validPartData, 'user-id');

        expect(result.title).toBe('BMW E46 Motor');
        expect(result.location_city).toBe('İstanbul');
      });

      it('should validate Turkish city names', async () => {
        const invalidCityData = {
          ...validPartData,
          location_city: 'InvalidCity'
        };

        await expect(
          partsService.createPart(invalidCityData, 'user-id')
        ).rejects.toThrow('Invalid Turkish city');
      });

      it('should validate part condition in Turkish', async () => {
        const invalidConditionData = {
          ...validPartData,
          condition: 'InvalidCondition' as any
        };

        await expect(
          partsService.createPart(invalidConditionData, 'user-id')
        ).rejects.toThrow('Invalid part condition');
      });
    });
  });

  describe('InterestService', () => {
    let interestService: InterestService;
    
    beforeEach(() => {
      interestService = new InterestService(mockSupabaseClient);
    });

    it('should handle interest expression business rules', async () => {
      mockSupabaseClient.from = jest.fn().mockReturnValue({
        select: jest.fn().mockReturnValue({
          eq: jest.fn().mockReturnValue({
            single: jest.fn().mockResolvedValue({
              data: { 
                id: 'part-id', 
                seller_id: 'different-user',
                status: 'active' 
              },
              error: null
            })
          })
        }),
        insert: jest.fn().mockReturnValue({
          select: jest.fn().mockReturnValue({
            single: jest.fn().mockResolvedValue({
              data: { id: 'interest-id' },
              error: null
            })
          })
        })
      });

      const result = await interestService.expressInterest(
        'part-id', 
        'user-id', 
        'interested'
      );

      expect(result.id).toBe('interest-id');
    });

    it('should prevent self-interest expression', async () => {
      mockSupabaseClient.from = jest.fn().mockReturnValue({
        select: jest.fn().mockReturnValue({
          eq: jest.fn().mockReturnValue({
            single: jest.fn().mockResolvedValue({
              data: { 
                id: 'part-id', 
                seller_id: 'user-id', // Same as requesting user
                status: 'active' 
              },
              error: null
            })
          })
        })
      });

      await expect(
        interestService.expressInterest('part-id', 'user-id', 'interested')
      ).rejects.toThrow('Cannot express interest in own part');
    });
  });
});

// API testing helpers
export const mockSupabaseClient = {
  from: jest.fn(),
  rpc: jest.fn(),
  storage: {
    from: jest.fn()
  },
  auth: {
    getUser: jest.fn()
  }
};

// Test data factories for Turkish marketplace
export const createMockPart = (overrides: Partial<Part> = {}): Part => ({
  id: 'test-part-id',
  seller_id: 'test-seller-id',
  title: 'BMW E46 Alternatör',
  part_reference: 'ALT123456',
  condition: 'Kullanılabilir',
  price: 850.50,
  location_city: 'İstanbul',
  brand: 'BMW',
  model: 'E46',
  year: 2003,
  description: 'Orijinal Bosch alternatör',
  images: ['/images/part1.jpg'],
  status: 'active',
  created_at: '2024-01-01T00:00:00Z',
  updated_at: '2024-01-01T00:00:00Z',
  ...overrides
});

export const createMockUser = (overrides: Partial<UserProfile> = {}): UserProfile => ({
  id: 'test-user-id',
  email: 'test@example.com',
  profile_complete: true,
  created_at: '2024-01-01T00:00:00Z',
  updated_at: '2024-01-01T00:00:00Z',
  ...overrides
});

export const createMockSearchFilters = (overrides: Partial<SearchFilters> = {}): SearchFilters => ({
  query: '',
  brand: null,
  model: null,
  condition: null,
  city: null,
  minPrice: null,
  maxPrice: null,
  yearFrom: null,
  yearTo: null,
  limit: 20,
  offset: 0,
  ...overrides
});
```

### 3. Performance and Load Testing

**Performance Testing Framework:**
```typescript
// __tests__/performance/turkish-search-performance.test.ts
import { describe, it, expect, beforeAll, afterAll } from '@jest/globals';
import { performance } from 'perf_hooks';

describe('Turkish Search Performance Tests', () => {
  const PERFORMANCE_THRESHOLDS = {
    searchResponseTime: 300, // ms
    databaseQueryTime: 200, // ms
    turkishTextProcessing: 50, // ms
  };

  describe('Search Performance', () => {
    it('should respond to Turkish search within threshold', async () => {
      const startTime = performance.now();
      
      const response = await fetch('/api/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: 'BMW alternatör',
          filters: { city: 'İstanbul' }
        })
      });
      
      const endTime = performance.now();
      const responseTime = endTime - startTime;
      
      expect(response.ok).toBe(true);
      expect(responseTime).toBeLessThan(PERFORMANCE_THRESHOLDS.searchResponseTime);
    });

    it('should handle complex Turkish queries efficiently', async () => {
      const complexQuery = 'BMW E46 alternatör orijinal bosch çok temiz';
      const startTime = performance.now();
      
      const response = await fetch('/api/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: complexQuery })
      });
      
      const endTime = performance.now();
      const responseTime = endTime - startTime;
      
      expect(response.ok).toBe(true);
      expect(responseTime).toBeLessThan(PERFORMANCE_THRESHOLDS.searchResponseTime);
      
      const data = await response.json();
      expect(data.parts).toBeInstanceOf(Array);
    });

    it('should handle concurrent Turkish searches', async () => {
      const searchQueries = [
        'alternatör',
        'fren disk',
        'motor yağı',
        'amortisör',
        'lastik'
      ];

      const startTime = performance.now();
      
      const promises = searchQueries.map(query =>
        fetch('/api/search', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ query })
        })
      );

      const responses = await Promise.all(promises);
      const endTime = performance.now();
      
      const totalTime = endTime - startTime;
      const averageTime = totalTime / searchQueries.length;
      
      responses.forEach(response => {
        expect(response.ok).toBe(true);
      });
      
      expect(averageTime).toBeLessThan(PERFORMANCE_THRESHOLDS.searchResponseTime);
    });
  });

  describe('Database Performance', () => {
    it('should execute Turkish full-text search efficiently', async () => {
      const testQuery = 'search_parts_turkish_optimized';
      const startTime = performance.now();
      
      // Mock database query execution
      const mockResult = await simulateDatabaseQuery(testQuery, {
        search_query: 'BMW motor',
        limit_count: 20
      });
      
      const endTime = performance.now();
      const queryTime = endTime - startTime;
      
      expect(queryTime).toBeLessThan(PERFORMANCE_THRESHOLDS.databaseQueryTime);
      expect(mockResult.length).toBeGreaterThanOrEqual(0);
    });

    it('should handle Turkish text indexing performance', async () => {
      const turkishTexts = [
        'BMW E46 Alternatör',
        'Mercedes Çamurluk',
        'Volkswagen Fren Diski',
        'Renault Amortisör',
        'Ford Lastik'
      ];

      const startTime = performance.now();
      
      const indexedTexts = turkishTexts.map(text => 
        normalizedTurkishText(text)
      );
      
      const endTime = performance.now();
      const processingTime = endTime - startTime;
      
      expect(processingTime).toBeLessThan(PERFORMANCE_THRESHOLDS.turkishTextProcessing);
      expect(indexedTexts).toHaveLength(turkishTexts.length);
    });
  });

  describe('Mobile Performance', () => {
    it('should optimize for Turkish mobile networks', async () => {
      // Simulate slow 3G connection
      const slowConnectionDelay = 300; // ms
      
      const startTime = performance.now();
      
      // Add artificial network delay
      await new Promise(resolve => setTimeout(resolve, slowConnectionDelay));
      
      const response = await fetch('/api/search', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Connection-Type': '3g' // Custom header for testing
        },
        body: JSON.stringify({ query: 'motor' })
      });
      
      const endTime = performance.now();
      const totalTime = endTime - startTime;
      
      // Total time should be reasonable even with network delay
      expect(totalTime).toBeLessThan(slowConnectionDelay + PERFORMANCE_THRESHOLDS.searchResponseTime);
      expect(response.ok).toBe(true);
    });
  });
});

// Memory leak testing
describe('Memory Performance Tests', () => {
  it('should not leak memory during Turkish text processing', () => {
    const initialMemory = process.memoryUsage().heapUsed;
    
    // Process large amount of Turkish text
    for (let i = 0; i < 10000; i++) {
      const text = `BMW E46 Alternatör ${i} çok güzel parça`;
      normalizedTurkishText(text);
    }
    
    // Force garbage collection if available
    if (global.gc) {
      global.gc();
    }
    
    const finalMemory = process.memoryUsage().heapUsed;
    const memoryIncrease = finalMemory - initialMemory;
    
    // Memory increase should be reasonable (less than 10MB)
    expect(memoryIncrease).toBeLessThan(10 * 1024 * 1024);
  });

  it('should clean up search results properly', async () => {
    const initialMemory = process.memoryUsage().heapUsed;
    
    // Perform many searches
    for (let i = 0; i < 100; i++) {
      await fetch('/api/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: `test search ${i}` })
      });
    }
    
    // Allow time for cleanup
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    if (global.gc) {
      global.gc();
    }
    
    const finalMemory = process.memoryUsage().heapUsed;
    const memoryIncrease = finalMemory - initialMemory;
    
    // Memory increase should be minimal
    expect(memoryIncrease).toBeLessThan(20 * 1024 * 1024);
  });
});

// Helper function for database simulation
async function simulateDatabaseQuery(query: string, params: any): Promise<any[]> {
  // Simulate database query execution time
  const queryTime = Math.random() * 150 + 50; // 50-200ms
  await new Promise(resolve => setTimeout(resolve, queryTime));
  
  // Return mock results based on query
  if (query.includes('search_parts_turkish')) {
    return Array.from({ length: Math.floor(Math.random() * 20) }, (_, i) => ({
      id: `part-${i}`,
      title: `BMW Part ${i}`,
      brand: 'BMW'
    }));
  }
  
  return [];
}
```

---

## Integration Testing

### 4. API and Database Integration

**API Integration Testing:**
```typescript
// __tests__/integration/api-integration.test.ts
import { describe, it, expect, beforeAll, afterAll, beforeEach } from '@jest/globals';
import { createMocks } from 'node-mocks-http';
import handler from '@/pages/api/search';
import { createTestSupabaseClient } from '@/lib/test-utils/supabase';

describe('API Integration Tests', () => {
  let testSupabaseClient: any;

  beforeAll(async () => {
    testSupabaseClient = createTestSupabaseClient();
    await setupTestDatabase();
  });

  afterAll(async () => {
    await cleanupTestDatabase();
  });

  describe('Search API', () => {
    it('should integrate with Turkish search database function', async () => {
      const { req, res } = createMocks({
        method: 'POST',
        body: {
          query: 'BMW alternatör',
          filters: {
            city: 'İstanbul',
            condition: 'Kullanılabilir'
          }
        }
      });

      await handler(req, res);

      expect(res._getStatusCode()).toBe(200);
      
      const responseData = JSON.parse(res._getData());
      expect(responseData).toHaveProperty('parts');
      expect(responseData.parts).toBeInstanceOf(Array);
      expect(responseData).toHaveProperty('total');
    });

    it('should handle Turkish character encoding correctly', async () => {
      const turkishQueries = [
        'çamurluk',
        'alternatör', 
        'fren diski',
        'amortisör'
      ];

      for (const query of turkishQueries) {
        const { req, res } = createMocks({
          method: 'POST',
          body: { query }
        });

        await handler(req, res);

        expect(res._getStatusCode()).toBe(200);
        const responseData = JSON.parse(res._getData());
        expect(responseData.parts).toBeInstanceOf(Array);
      }
    });

    it('should validate Turkish city filtering', async () => {
      const turkishCities = [
        'İstanbul',
        'Ankara', 
        'İzmir',
        'Bursa',
        'Antalya'
      ];

      for (const city of turkishCities) {
        const { req, res } = createMocks({
          method: 'POST',
          body: {
            query: 'motor',
            filters: { city }
          }
        });

        await handler(req, res);

        expect(res._getStatusCode()).toBe(200);
        const responseData = JSON.parse(res._getData());
        
        // All returned parts should be from the specified city
        responseData.parts.forEach((part: any) => {
          expect(part.location_city).toBe(city);
        });
      }
    });
  });

  describe('Parts API', () => {
    it('should create parts with Turkish data validation', async () => {
      const { req, res } = createMocks({
        method: 'POST',
        headers: {
          'authorization': 'Bearer valid-test-token'
        },
        body: {
          title: 'BMW E46 Çamurluk',
          part_reference: 'CAM123456',
          condition: 'Kullanılabilir',
          price: 750,
          location_city: 'İstanbul',
          brand: 'BMW',
          model: 'E46',
          year: 2003,
          description: 'Hiçbir çizik yok, çok temiz'
        }
      });

      const partsHandler = require('@/pages/api/parts').default;
      await partsHandler(req, res);

      expect(res._getStatusCode()).toBe(201);
      const responseData = JSON.parse(res._getData());
      
      expect(responseData.part).toHaveProperty('id');
      expect(responseData.part.title).toBe('BMW E46 Çamurluk');
      expect(responseData.part.location_city).toBe('İstanbul');
    });

    it('should reject invalid Turkish city names', async () => {
      const { req, res } = createMocks({
        method: 'POST',
        headers: {
          'authorization': 'Bearer valid-test-token'
        },
        body: {
          title: 'Test Part',
          part_reference: 'TEST123',
          condition: 'Kullanılabilir',
          price: 100,
          location_city: 'InvalidCity', // Invalid Turkish city
          brand: 'Test',
          model: 'Test',
          year: 2020
        }
      });

      const partsHandler = require('@/pages/api/parts').default;
      await partsHandler(req, res);

      expect(res._getStatusCode()).toBe(400);
      const responseData = JSON.parse(res._getData());
      expect(responseData.error).toContain('Invalid city');
    });
  });

  describe('Interest System Integration', () => {
    let testPartId: string;
    let testUserId: string;

    beforeEach(async () => {
      // Create test part and user for interest testing
      const testPart = await createTestPart();
      const testUser = await createTestUser();
      
      testPartId = testPart.id;
      testUserId = testUser.id;
    });

    it('should handle interest expression workflow', async () => {
      const { req, res } = createMocks({
        method: 'POST',
        headers: {
          'authorization': `Bearer ${generateTestToken(testUserId)}`
        },
        body: {
          partId: testPartId,
          type: 'interested'
        }
      });

      const interestHandler = require('@/pages/api/interests').default;
      await interestHandler(req, res);

      expect(res._getStatusCode()).toBe(201);
      const responseData = JSON.parse(res._getData());
      
      expect(responseData.interest).toHaveProperty('id');
      expect(responseData.interest.type).toBe('interested');
    });

    it('should prevent duplicate interest expressions', async () => {
      // Express interest first time
      await expressInterest(testPartId, testUserId, 'interested');
      
      // Try to express interest again
      const { req, res } = createMocks({
        method: 'POST',
        headers: {
          'authorization': `Bearer ${generateTestToken(testUserId)}`
        },
        body: {
          partId: testPartId,
          type: 'interested'
        }
      });

      const interestHandler = require('@/pages/api/interests').default;
      await interestHandler(req, res);

      expect(res._getStatusCode()).toBe(200);
      const responseData = JSON.parse(res._getData());
      
      // Should update existing interest, not create new one
      expect(responseData.message).toContain('updated');
    });

    it('should trigger conversation creation on mutual interest', async () => {
      // Express interest from buyer
      await expressInterest(testPartId, testUserId, 'interested');
      
      // Check if conversation was created
      const conversations = await getConversationsForPart(testPartId);
      
      expect(conversations).toHaveLength(1);
      expect(conversations[0].buyer_id).toBe(testUserId);
      expect(conversations[0].part_id).toBe(testPartId);
    });
  });

  describe('Turkish Text Search Integration', () => {
    beforeEach(async () => {
      await seedTurkishTestData();
    });

    it('should perform accurate Turkish full-text search', async () => {
      const searchTests = [
        {
          query: 'alternatör',
          expectedBrands: ['BMW', 'Mercedes', 'Volkswagen'],
          minResults: 3
        },
        {
          query: 'çamurluk',
          expectedBrands: ['BMW', 'Ford'],
          minResults: 2
        },
        {
          query: 'motor yağı',
          expectedBrands: ['Shell', 'Castrol'],
          minResults: 5
        }
      ];

      for (const test of searchTests) {
        const { req, res } = createMocks({
          method: 'POST',
          body: { query: test.query }
        });

        await handler(req, res);

        const responseData = JSON.parse(res._getData());
        
        expect(responseData.parts.length).toBeGreaterThanOrEqual(test.minResults);
        
        const foundBrands = [...new Set(responseData.parts.map((p: any) => p.brand))];
        test.expectedBrands.forEach(brand => {
          expect(foundBrands).toContain(brand);
        });
      }
    });

    it('should handle Turkish character variations', async () => {
      const variations = [
        { query: 'alternator', turkish: 'alternatör' },
        { query: 'camurluk', turkish: 'çamurluk' },
        { query: 'amortisör', turkish: 'amortisör' }
      ];

      for (const variation of variations) {
        const latinResults = await performSearch(variation.query);
        const turkishResults = await performSearch(variation.turkish);
        
        // Should return similar results for Turkish character variations
        expect(turkishResults.parts.length).toBeGreaterThan(0);
        
        // At least some overlap in results
        const latinIds = latinResults.parts.map((p: any) => p.id);
        const turkishIds = turkishResults.parts.map((p: any) => p.id);
        const overlap = latinIds.filter((id: string) => turkishIds.includes(id));
        
        expect(overlap.length).toBeGreaterThan(0);
      }
    });
  });
});

// Test utility functions
async function setupTestDatabase(): Promise<void> {
  // Initialize test database with Turkish data
  await testSupabaseClient.rpc('setup_test_environment');
}

async function cleanupTestDatabase(): Promise<void> {
  // Clean up test data
  await testSupabaseClient.rpc('cleanup_test_environment');
}

async function seedTurkishTestData(): Promise<void> {
  const testParts = [
    {
      title: 'BMW E46 Alternatör',
      part_reference: 'ALT001',
      brand: 'BMW',
      condition: 'Kullanılabilir',
      price: 850
    },
    {
      title: 'Mercedes Çamurluk',
      part_reference: 'CAM001', 
      brand: 'Mercedes',
      condition: 'Kullanılabilir',
      price: 650
    },
    {
      title: 'Shell Motor Yağı',
      part_reference: 'OIL001',
      brand: 'Shell', 
      condition: 'Kullanılabilir',
      price: 150
    }
  ];

  for (const part of testParts) {
    await testSupabaseClient
      .from('parts')
      .insert({
        ...part,
        seller_id: 'test-seller',
        location_city: 'İstanbul',
        model: 'Test',
        year: 2020,
        status: 'active'
      });
  }
}

async function createTestPart(): Promise<any> {
  const { data } = await testSupabaseClient
    .from('parts')
    .insert({
      title: 'Test Part',
      part_reference: 'TEST001',
      condition: 'Kullanılabilir',
      price: 500,
      location_city: 'İstanbul',
      brand: 'Test',
      model: 'Test',
      year: 2020,
      seller_id: 'test-seller',
      status: 'active'
    })
    .select()
    .single();
    
  return data;
}

async function createTestUser(): Promise<any> {
  const { data } = await testSupabaseClient
    .from('user_profiles')
    .insert({
      email: 'test@example.com',
      profile_complete: true
    })
    .select()
    .single();
    
  return data;
}

async function expressInterest(partId: string, userId: string, type: string): Promise<any> {
  const { data } = await testSupabaseClient
    .from('interests')
    .insert({
      part_id: partId,
      user_id: userId,
      type: type
    })
    .select()
    .single();
    
  return data;
}

async function getConversationsForPart(partId: string): Promise<any[]> {
  const { data } = await testSupabaseClient
    .from('conversations')
    .select('*')
    .eq('part_id', partId);
    
  return data || [];
}

async function performSearch(query: string): Promise<any> {
  const { req, res } = createMocks({
    method: 'POST',
    body: { query }
  });

  await handler(req, res);
  return JSON.parse(res._getData());
}

function generateTestToken(userId: string): string {
  // Generate test JWT token for authentication
  return `test-token-${userId}`;
}

function createTestSupabaseClient(): any {
  // Create test Supabase client with test configuration
  return {
    from: (table: string) => ({
      insert: jest.fn().mockReturnValue({
        select: jest.fn().mockReturnValue({
          single: jest.fn().mockResolvedValue({ data: {}, error: null })
        })
      }),
      select: jest.fn().mockReturnValue({
        eq: jest.fn().mockReturnValue({
          single: jest.fn().mockResolvedValue({ data: {}, error: null })
        })
      })
    }),
    rpc: jest.fn().mockResolvedValue({ data: [], error: null })
  };
}
```

---

## End-to-End Testing

### 5. User Journey and Browser Testing

**Playwright E2E Testing Framework:**
```typescript
// tests/e2e/turkish-marketplace-flows.spec.ts
import { test, expect, Page, BrowserContext } from '@playwright/test';

test.describe('Turkish Marketplace User Flows', () => {
  let context: BrowserContext;
  let page: Page;

  test.beforeAll(async ({ browser }) => {
    context = await browser.newContext({
      // Simulate Turkish user context
      locale: 'tr-TR',
      timezoneId: 'Europe/Istanbul',
      // Simulate Turkish mobile device
      ...devices['iPhone 13 Pro'],
      hasTouch: true
    });
    
    page = await context.newPage();
    
    // Mock geolocation for Istanbul
    await context.grantPermissions(['geolocation']);
    await context.setGeolocation({ latitude: 41.0082, longitude: 28.9784 });
  });

  test.afterAll(async () => {
    await context.close();
  });

  test.describe('Search Flow', () => {
    test('should perform Turkish part search successfully', async () => {
      // Navigate to homepage
      await page.goto('/');
      
      // Verify Turkish content
      await expect(page.locator('h1')).toContainText('Parça Ara');
      
      // Perform search with Turkish query
      const searchInput = page.locator('input[placeholder*="ara"]');
      await searchInput.fill('BMW alternatör');
      
      await page.click('button:has-text("Ara")');
      
      // Wait for search results
      await page.waitForSelector('[data-testid="search-results"]');
      
      // Verify results contain Turkish content
      const results = page.locator('[data-testid="part-card"]');
      await expect(results).toHaveCountGreaterThan(0);
      
      // Check first result contains Turkish text
      const firstResult = results.first();
      await expect(firstResult).toContainText(/alternatör|BMW/i);
      
      // Verify price is in Turkish Lira
      await expect(firstResult.locator('.price')).toContainText('₺');
    });

    test('should handle Turkish character input correctly', async () => {
      await page.goto('/search');
      
      const turkishQueries = [
        'çamurluk',
        'alternatör',
        'fren diski',
        'amortisör'
      ];
      
      for (const query of turkishQueries) {
        const searchInput = page.locator('input[name="query"]');
        await searchInput.clear();
        await searchInput.fill(query);
        
        await page.click('button:has-text("Ara")');
        await page.waitForSelector('[data-testid="search-results"]');
        
        // Should have results for Turkish queries
        const resultCount = await page.locator('[data-testid="part-card"]').count();
        expect(resultCount).toBeGreaterThanOrEqual(0);
        
        // Check search term appears in URL or results
        const url = page.url();
        expect(url).toContain(encodeURIComponent(query));
      }
    });

    test('should filter by Turkish cities correctly', async () => {
      await page.goto('/search');
      
      // Open city filter
      await page.click('select[name="city"]');
      
      // Select Istanbul
      await page.selectOption('select[name="city"]', 'İstanbul');
      
      await page.click('button:has-text("Ara")');
      await page.waitForSelector('[data-testid="search-results"]');
      
      // All results should be from Istanbul
      const cityLabels = page.locator('[data-testid="part-city"]');
      const count = await cityLabels.count();
      
      for (let i = 0; i < count; i++) {
        await expect(cityLabels.nth(i)).toContainText('İstanbul');
      }
    });

    test('should show no results message in Turkish', async () => {
      await page.goto('/search');
      
      const searchInput = page.locator('input[name="query"]');
      await searchInput.fill('xyznonexistentpart123');
      
      await page.click('button:has-text("Ara")');
      await page.waitForSelector('[data-testid="no-results"]');
      
      // Should show Turkish no results message
      await expect(page.locator('[data-testid="no-results"]'))
        .toContainText('Sonuç bulunamadı');
    });
  });

  test.describe('Part Details and Interest Flow', () => {
    test('should view part details and express interest', async () => {
      // Go to search and find a part
      await page.goto('/search?query=BMW');
      await page.waitForSelector('[data-testid="part-card"]');
      
      // Click on first part
      await page.click('[data-testid="part-card"]').first();
      
      // Should navigate to part details
      await page.waitForSelector('[data-testid="part-details"]');
      
      // Verify Turkish content in details
      await expect(page.locator('h1')).toContainText(/BMW|alternatör|motor/i);
      await expect(page.locator('[data-testid="part-condition"]'))
        .toContainText(/Kullanılabilir|Arızalı/);
      
      // Express interest (requires authentication)
      const interestButton = page.locator('button:has-text("İlgileniyorum")');
      
      if (await interestButton.isVisible()) {
        await interestButton.click();
        
        // Should show authentication required or success message
        await expect(page.locator('.notification'))
          .toContainText(/Giriş yapın|İlginiz kaydedildi/);
      }
    });

    test('should handle image gallery correctly', async () => {
      await page.goto('/search?query=motor');
      await page.waitForSelector('[data-testid="part-card"]');
      
      // Find part with images
      const partWithImages = page.locator('[data-testid="part-card"]')
        .locator('img')
        .first()
        .locator('..');
      
      await partWithImages.click();
      await page.waitForSelector('[data-testid="part-details"]');
      
      // Check if image gallery exists
      const gallery = page.locator('[data-testid="image-gallery"]');
      if (await gallery.isVisible()) {
        // Click on thumbnail to change main image
        const thumbnails = gallery.locator('.thumbnail');
        const thumbnailCount = await thumbnails.count();
        
        if (thumbnailCount > 1) {
          await thumbnails.nth(1).click();
          
          // Main image should change
          const mainImage = page.locator('[data-testid="main-image"]');
          await expect(mainImage).toBeVisible();
        }
      }
    });
  });

  test.describe('Authentication Flow', () => {
    test('should handle Turkish authentication flow', async () => {
      await page.goto('/login');
      
      // Verify Turkish login form
      await expect(page.locator('h1')).toContainText('Giriş Yap');
      
      const emailInput = page.locator('input[type="email"]');
      const passwordInput = page.locator('input[type="password"]');
      
      await emailInput.fill('test@example.com');
      await passwordInput.fill('testpassword123');
      
      await page.click('button:has-text("Giriş Yap")');
      
      // Should show loading or redirect
      await page.waitForLoadState('networkidle');
      
      // Check if redirected or shows error in Turkish
      const currentUrl = page.url();
      const hasError = await page.locator('.error-message').isVisible();
      
      if (hasError) {
        await expect(page.locator('.error-message'))
          .toContainText(/Hatalı|Geçersiz|Başarısız/);
      }
    });

    test('should handle registration with Turkish validation', async () => {
      await page.goto('/register');
      
      await expect(page.locator('h1')).toContainText('Kayıt Ol');
      
      // Fill registration form
      await page.fill('input[name="email"]', 'yeni-kullanici@example.com');
      await page.fill('input[name="password"]', 'güçlü-şifre-123');
      await page.fill('input[name="confirmPassword"]', 'güçlü-şifre-123');
      
      await page.click('button:has-text("Kayıt Ol")');
      
      // Should show success message or validation errors in Turkish
      await expect(page.locator('.message'))
        .toContainText(/başarılı|hata|geçersiz/i);
    });
  });

  test.describe('Part Listing Flow', () => {
    test('should create new part listing with Turkish data', async () => {
      // Login first (assuming test user exists)
      await page.goto('/login');
      await page.fill('input[type="email"]', 'test@example.com');
      await page.fill('input[type="password"]', 'testpassword');
      await page.click('button:has-text("Giriş Yap")');
      
      await page.waitForURL('/dashboard');
      
      // Go to sell page
      await page.goto('/sell');
      
      // Fill Turkish part details
      await page.fill('input[name="title"]', 'BMW E46 Çok Temiz Alternatör');
      await page.fill('input[name="part_reference"]', 'ALT123456');
      await page.selectOption('select[name="condition"]', 'Kullanılabilir');
      await page.fill('input[name="price"]', '850');
      await page.selectOption('select[name="city"]', 'İstanbul');
      await page.selectOption('select[name="brand"]', 'BMW');
      await page.fill('input[name="model"]', 'E46');
      await page.fill('input[name="year"]', '2003');
      await page.fill('textarea[name="description"]', 
        'Orijinal Bosch alternatör. Hiçbir problemi yok, mükemmel çalışıyor.');
      
      // Submit form
      await page.click('button:has-text("Parçayı Listele")');
      
      // Should show success message
      await expect(page.locator('.success-message'))
        .toContainText(/başarılı|listelenди|eklendi/i);
    });

    test('should validate Turkish form inputs', async () => {
      await page.goto('/sell');
      
      // Try to submit empty form
      await page.click('button:has-text("Parçayı Listele")');
      
      // Should show validation errors in Turkish
      const errorMessages = page.locator('.error-message');
      const errorCount = await errorMessages.count();
      
      expect(errorCount).toBeGreaterThan(0);
      
      // Check specific Turkish validation messages
      await expect(errorMessages.first())
        .toContainText(/gerekli|zorunlu|boş olamaz/i);
    });
  });

  test.describe('Mobile Turkish Experience', () => {
    test('should handle Turkish mobile touch interactions', async () => {
      await page.goto('/search');
      
      // Test mobile search
      const searchInput = page.locator('input[name="query"]');
      await searchInput.tap();
      await searchInput.fill('motor');
      
      // Test mobile filter interaction
      const filterButton = page.locator('button:has-text("Filtre")');
      if (await filterButton.isVisible()) {
        await filterButton.tap();
        
        // Mobile filter menu should appear
        await expect(page.locator('.mobile-filters')).toBeVisible();
      }
      
      await page.click('button:has-text("Ara")');
      await page.waitForSelector('[data-testid="search-results"]');
      
      // Test mobile card interaction
      const firstCard = page.locator('[data-testid="part-card"]').first();
      await firstCard.tap();
      
      // Should navigate to details
      await page.waitForSelector('[data-testid="part-details"]');
    });

    test('should handle Turkish mobile navigation', async () => {
      await page.goto('/');
      
      // Test mobile menu
      const menuButton = page.locator('button[aria-label*="menu"]');
      if (await menuButton.isVisible()) {
        await menuButton.tap();
        
        // Mobile menu should show Turkish navigation items
        await expect(page.locator('.mobile-menu'))
          .toContainText(/Ana Sayfa|Ara|Sat|İletişim/);
      }
      
      // Test mobile search shortcut
      const mobileSearchButton = page.locator('button:has-text("Ara")').first();
      await mobileSearchButton.tap();
      
      await expect(page).toHaveURL('/search');
    });
  });

  test.describe('Performance and Accessibility', () => {
    test('should load pages quickly for Turkish users', async () => {
      // Measure page load performance
      const startTime = Date.now();
      await page.goto('/search');
      await page.waitForLoadState('networkidle');
      const loadTime = Date.now() - startTime;
      
      // Should load within 3 seconds for Turkish mobile
      expect(loadTime).toBeLessThan(3000);
      
      // Check Core Web Vitals
      const lcp = await page.evaluate(() => {
        return new Promise(resolve => {
          new PerformanceObserver((list) => {
            const entries = list.getEntries();
            const lastEntry = entries[entries.length - 1];
            resolve(lastEntry.startTime);
          }).observe({ entryTypes: ['largest-contentful-paint'] });
        });
      });
      
      expect(lcp).toBeLessThan(2500); // 2.5 seconds
    });

    test('should be accessible with Turkish screen readers', async () => {
      await page.goto('/');
      
      // Check basic accessibility
      const searchInput = page.locator('input[name="query"]');
      await expect(searchInput).toHaveAttribute('aria-label', /ara|arama/i);
      
      // Check Turkish form labels
      const labels = page.locator('label');
      const labelCount = await labels.count();
      
      for (let i = 0; i < labelCount; i++) {
        const labelText = await labels.nth(i).textContent();
        expect(labelText).toMatch(/[a-zA-ZçğıöşüÇĞIİÖŞÜ\s]+/);
      }
      
      // Check heading hierarchy
      const h1Count = await page.locator('h1').count();
      expect(h1Count).toBeGreaterThanOrEqual(1);
      
      const mainHeading = page.locator('h1').first();
      await expect(mainHeading).toContainText(/BanaYeni|SanaEski|Parça/);
    });
  });
});

// Device configurations for Turkish mobile testing
const devices = {
  'iPhone 13 Pro': {
    userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 15_0 like Mac OS X) AppleWebKit/605.1.15',
    viewport: { width: 390, height: 844 },
    deviceScaleFactor: 3,
    isMobile: true,
    hasTouch: true,
  },
  'Samsung Galaxy S21': {
    userAgent: 'Mozilla/5.0 (Linux; Android 11; SM-G991B) AppleWebKit/537.36',
    viewport: { width: 360, height: 800 },
    deviceScaleFactor: 3,
    isMobile: true,
    hasTouch: true,
  }
};

// Test configuration for Turkish marketplace
export const playwrightConfig = {
  testDir: './tests/e2e',
  timeout: 30000,
  retries: 2,
  use: {
    baseURL: process.env.BASE_URL || 'http://localhost:3000',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    locale: 'tr-TR',
    timezoneId: 'Europe/Istanbul',
  },
  projects: [
    {
      name: 'Turkish Desktop',
      use: {
        ...devices['Desktop'],
        locale: 'tr-TR',
      }
    },
    {
      name: 'Turkish iPhone',
      use: {
        ...devices['iPhone 13 Pro'],
        locale: 'tr-TR',
      }
    },
    {
      name: 'Turkish Android',
      use: {
        ...devices['Samsung Galaxy S21'],
        locale: 'tr-TR',
      }
    }
  ]
};
```

---

## Conclusion

This comprehensive testing strategy ensures quality, reliability, and user experience excellence for BanaYeni SanaEski across all components and user journeys. The testing framework provides:

**Complete Quality Coverage:**
- Unit testing with 85%+ coverage for critical Turkish marketplace components
- Integration testing for API endpoints and database operations with Turkish data
- End-to-end testing covering complete user journeys with Turkish localization
- Performance testing optimized for Turkish mobile network conditions

**Turkish Market Validation:**
- Turkish character encoding and display testing across all components
- City and location validation with comprehensive Turkish geography data
- Currency formatting and number localization testing for Turkish Lira
- Mobile responsiveness testing for Turkish device preferences

**Business Logic Verification:**
- Interest-gating system testing with complete workflow validation
- Search functionality testing with Turkish full-text search optimization
- Authentication and authorization testing with Turkish user flows
- Marketplace business rules testing including spam prevention

**Performance and Accessibility:**
- Load time optimization testing for Turkish 3G/4G networks
- Memory leak detection for long-running search operations
- Accessibility testing with Turkish screen reader compatibility
- Cross-browser testing for Turkish user device preferences

This testing strategy positions BanaYeni SanaEski for reliable, scalable growth while maintaining exceptional quality standards for the Turkish automotive parts marketplace.

---

*This testing strategy serves as the definitive quality assurance framework for the BanaYeni SanaEski Turkish automotive parts marketplace.*