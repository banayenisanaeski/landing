# Full-Stack Architecture Document
**BanaYeni SanaEski - AI-Enhanced Automobile Parts Marketplace**

**Version:** 1.0  
**Created:** August 2025  
**Status:** Implementation Ready  
**Architecture Type:** Monolithic Next.js with Serverless AI Services  

## Executive Summary

This document presents the complete full-stack architecture for BanaYeni SanaEski, an AI-enhanced automobile parts marketplace that connects buyers and sellers through reference-code based matching and instant notifications. The architecture prioritizes rapid development, scalability, and cost-effectiveness while delivering a seamless user experience across web and mobile platforms.

### Key Architectural Decisions

1. **Monolithic Next.js Application** - Simplified deployment and development workflow
2. **Supabase Backend Platform** - Managed PostgreSQL, real-time, auth, and storage
3. **Serverless AI Processing** - Cost-effective scaling for image recognition workloads
4. **Progressive Web App First** - Mobile experience without native app complexity
5. **Edge-Optimized CDN** - Fast global content delivery for Turkish market

## System Architecture Overview

### High-Level Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────────────┐
│                           Client Layer                                   │
├─────────────────────────┬─────────────────────┬────────────────────────┤
│   Progressive Web App   │   Mobile Web App    │   Admin Dashboard      │
│   (Desktop Users)       │   (Mobile Users)    │   (Platform Ops)       │
└───────────┬─────────────┴──────────┬──────────┴────────────┬──────────┘
            │                        │                        │
            └────────────────────────┼────────────────────────┘
                                     │
                        ┌────────────┴────────────┐
                        │   CDN / Edge Network    │
                        │   (Vercel Edge)         │
                        └────────────┬────────────┘
                                     │
                        ┌────────────┴────────────┐
                        │   Next.js Application   │
                        │   (App Router + API)    │
                        ├─────────────────────────┤
                        │ • Server Components     │
                        │ • API Routes            │
                        │ • Middleware            │
                        │ • Static Assets         │
                        └────────────┬────────────┘
                                     │
                ┌────────────────────┼────────────────────┐
                │                    │                    │
    ┌───────────┴──────────┐ ┌──────┴─────────┐ ┌───────┴────────┐
    │  Supabase Platform   │ │ AI Services    │ │ External APIs  │
    ├──────────────────────┤ ├────────────────┤ ├────────────────┤
    │ • PostgreSQL DB      │ │ • Google Vision│ │ • SMS Gateway  │
    │ • Realtime Engine    │ │ • Azure OCR    │ │ • Email Service│
    │ • Auth Service       │ │ • Custom ML    │ │ • Analytics    │
    │ • Storage + CDN      │ │ • Redis Cache  │ │ • Monitoring   │
    └──────────────────────┘ └────────────────┘ └────────────────┘
```

### Component Architecture

```
BanaYeni SanaEski Platform
├── Frontend (Next.js App Router)
│   ├── App Routes
│   │   ├── (public)
│   │   │   ├── / (Landing page)
│   │   │   ├── /search (Parts search)
│   │   │   └── /parts/[id] (Part details)
│   │   ├── (auth)
│   │   │   ├── /login
│   │   │   ├── /register
│   │   │   └── /forgot-password
│   │   └── (dashboard)
│   │       ├── /dashboard (User dashboard)
│   │       ├── /listings (My listings)
│   │       ├── /wanted (Wanted listings)
│   │       ├── /messages (Chat interface)
│   │       └── /notifications (Notification center)
│   │
│   ├── Components
│   │   ├── ui/ (Reusable UI components)
│   │   ├── features/ (Feature-specific components)
│   │   └── layouts/ (Layout components)
│   │
│   └── Services
│       ├── api/ (API client functions)
│       ├── hooks/ (Custom React hooks)
│       └── utils/ (Utility functions)
│
├── Backend (Next.js API Routes + Supabase)
│   ├── API Routes
│   │   ├── /api/auth/* (Authentication endpoints)
│   │   ├── /api/listings/* (CRUD for listings)
│   │   ├── /api/wanted/* (Wanted listings)
│   │   ├── /api/notifications/* (Notification system)
│   │   ├── /api/ai/* (AI processing endpoints)
│   │   └── /api/chat/* (Messaging endpoints)
│   │
│   ├── Core Services
│   │   ├── MatchingEngine (Reference code matching)
│   │   ├── NotificationService (Real-time alerts)
│   │   ├── AIService (Image recognition)
│   │   └── TrustService (Verification & ratings)
│   │
│   └── Database Layer
│       ├── Models (TypeScript interfaces)
│       ├── Migrations (Database schema)
│       └── Queries (Optimized SQL)
│
└── Infrastructure
    ├── Deployment (Vercel)
    ├── Database (Supabase PostgreSQL)
    ├── Storage (Supabase Storage)
    ├── Caching (Redis)
    └── Monitoring (Sentry + PostHog)
```

## Frontend Architecture

### Technology Stack

- **Framework:** Next.js 14 with App Router
- **Language:** TypeScript 5.x
- **Styling:** TailwindCSS 3.x with custom design system
- **State Management:** 
  - Server State: TanStack Query (React Query) v5
  - Client State: Zustand v4
  - Form State: React Hook Form v7
- **UI Components:** Custom component library with Radix UI primitives
- **Real-time:** Supabase Realtime client
- **PWA:** next-pwa for offline capabilities

### Application Structure

```typescript
// app/layout.tsx - Root layout
export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="tr">
      <body>
        <Providers>
          <Header />
          <main>{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  )
}

// app/providers.tsx - Client-side providers
'use client'
export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <NotificationProvider>
          <ThemeProvider>
            {children}
          </ThemeProvider>
        </NotificationProvider>
      </AuthProvider>
    </QueryClientProvider>
  )
}
```

### Core Features Implementation

#### 1. Search & Discovery System

```typescript
// components/features/search/SearchInterface.tsx
interface SearchParams {
  query?: string
  referenceCode?: string
  make?: string
  model?: string
  year?: number
  condition?: 'working' | 'broken' | 'any'
  priceMin?: number
  priceMax?: number
  location?: string
  type?: 'part' | 'vehicle'
}

// Intelligent search with AI assistance
const SearchInterface = () => {
  const [searchParams, setSearchParams] = useState<SearchParams>({})
  const { data, isLoading } = useSearch(searchParams)
  
  return (
    <div className="search-container">
      <SearchBar 
        onSearch={setSearchParams}
        aiAssisted={true}
      />
      <FilterSidebar 
        filters={searchParams}
        onChange={setSearchParams}
      />
      <SearchResults 
        results={data?.results}
        loading={isLoading}
      />
    </div>
  )
}
```

#### 2. AI-Powered Listing Creation

```typescript
// components/features/listing/AIAssistedPartListing.tsx
const AIAssistedPartListing = () => {
  const [images, setImages] = useState<File[]>([])
  const [detectedCodes, setDetectedCodes] = useState<ReferenceCode[]>([])
  
  const processImages = async () => {
    const formData = new FormData()
    images.forEach(img => formData.append('images', img))
    
    const response = await fetch('/api/ai/extract-reference-codes', {
      method: 'POST',
      body: formData
    })
    
    const { codes } = await response.json()
    setDetectedCodes(codes)
  }
  
  return (
    <div className="ai-listing-wizard">
      <ImageUploader 
        onImagesChange={setImages}
        multiple={true}
        maxFiles={10}
      />
      <Button onClick={processImages}>
        Scan Reference Codes
      </Button>
      <ReferenceCodeSelector 
        detectedCodes={detectedCodes}
        onSelect={handleCodeSelection}
      />
    </div>
  )
}
```

#### 3. Real-time Notification System

```typescript
// hooks/useNotifications.ts
export const useNotifications = () => {
  const supabase = useSupabaseClient()
  const [notifications, setNotifications] = useState<Notification[]>([])
  
  useEffect(() => {
    // Subscribe to real-time notifications
    const channel = supabase
      .channel('notifications')
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'notifications',
        filter: `user_id=eq.${userId}`
      }, (payload) => {
        setNotifications(prev => [payload.new, ...prev])
        showNotificationToast(payload.new)
      })
      .subscribe()
    
    return () => {
      supabase.removeChannel(channel)
    }
  }, [supabase, userId])
  
  return { notifications, markAsRead, dismiss }
}
```

### Progressive Web App Configuration

```javascript
// next.config.js
const withPWA = require('next-pwa')({
  dest: 'public',
  register: true,
  skipWaiting: true,
  runtimeCaching: [
    {
      urlPattern: /^https:\/\/api\.*/i,
      handler: 'NetworkFirst',
      options: {
        cacheName: 'api-cache',
        expiration: {
          maxEntries: 100,
          maxAgeSeconds: 60 * 60 // 1 hour
        }
      }
    }
  ]
})

module.exports = withPWA({
  // Next.js config
})
```

## Backend Architecture

### API Design Principles

1. **RESTful Endpoints** - Clear resource-based URLs
2. **Consistent Response Format** - Standardized success/error responses
3. **Input Validation** - Zod schemas for all inputs
4. **Error Handling** - Comprehensive error codes and messages
5. **Rate Limiting** - Protection against abuse
6. **Authentication** - JWT-based with refresh tokens

### API Route Structure

```typescript
// app/api/listings/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { createServerClient } from '@/lib/supabase/server'
import { rateLimit } from '@/lib/rate-limit'

const CreateListingSchema = z.object({
  type: z.enum(['part', 'vehicle']),
  referenceCode: z.string().optional(),
  make: z.string(),
  model: z.string(),
  year: z.number().min(1990).max(2025),
  condition: z.enum(['working', 'broken']).optional(),
  price: z.number().positive(),
  images: z.array(z.string()).min(1).max(10),
  description: z.string().max(1000)
})

export async function POST(request: NextRequest) {
  try {
    // Rate limiting
    const identifier = request.ip ?? 'anonymous'
    const { success } = await rateLimit.check(identifier)
    if (!success) {
      return NextResponse.json(
        { error: 'Too many requests' },
        { status: 429 }
      )
    }
    
    // Authentication
    const supabase = createServerClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }
    
    // Validation
    const body = await request.json()
    const validatedData = CreateListingSchema.parse(body)
    
    // Business logic
    const listing = await createListing(user.id, validatedData)
    
    // Trigger matching engine
    await triggerMatchingEngine(listing.id)
    
    return NextResponse.json({ 
      success: true, 
      data: listing 
    })
    
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid input', details: error.errors },
        { status: 400 }
      )
    }
    
    console.error('Listing creation error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
```

### Core Services Implementation

#### 1. Matching Engine Service

```typescript
// services/matching-engine.ts
export class MatchingEngine {
  constructor(
    private db: SupabaseClient,
    private notificationService: NotificationService
  ) {}
  
  async processWantedListing(wantedListingId: string) {
    const wanted = await this.getWantedListing(wantedListingId)
    
    // Find matching inventory
    const matches = await this.findMatches(wanted)
    
    // Score and rank matches
    const rankedMatches = this.rankMatches(matches, wanted)
    
    // Send notifications to top matches
    await this.notifyMatches(rankedMatches, wanted)
  }
  
  private async findMatches(wanted: WantedListing) {
    if (wanted.referenceCode) {
      // Exact reference code match
      return this.db
        .from('part_listings')
        .select('*, seller:users(*)')
        .eq('reference_code', wanted.referenceCode)
        .eq('status', 'available')
    } else {
      // Vehicle-based match
      return this.db
        .from('part_listings')
        .select('*, seller:users(*)')
        .eq('make', wanted.make)
        .eq('model', wanted.model)
        .gte('year', wanted.yearStart)
        .lte('year', wanted.yearEnd)
        .eq('status', 'available')
    }
  }
  
  private rankMatches(matches: PartListing[], wanted: WantedListing) {
    return matches
      .map(match => ({
        ...match,
        relevanceScore: this.calculateRelevance(match, wanted)
      }))
      .sort((a, b) => b.relevanceScore - a.relevanceScore)
      .slice(0, 10) // Top 10 matches
  }
  
  private calculateRelevance(listing: PartListing, wanted: WantedListing) {
    let score = 0
    
    // Location proximity
    if (listing.location === wanted.locationPreference) score += 0.3
    
    // Price match
    if (wanted.maxPrice && listing.price <= wanted.maxPrice) score += 0.3
    
    // Condition match
    if (wanted.condition === listing.condition) score += 0.2
    
    // Seller rating
    score += (listing.seller.rating / 5) * 0.2
    
    return score
  }
}
```

#### 2. AI Service Integration

```typescript
// services/ai-service.ts
import { ImageAnnotatorClient } from '@google-cloud/vision'

export class AIService {
  private visionClient: ImageAnnotatorClient
  private cache: Redis
  
  constructor() {
    this.visionClient = new ImageAnnotatorClient()
    this.cache = new Redis(process.env.REDIS_URL!)
  }
  
  async extractReferenceCode(imageBuffer: Buffer): Promise<ReferenceCodeResult> {
    // Check cache first
    const imageHash = await this.hashImage(imageBuffer)
    const cached = await this.cache.get(`ref_code:${imageHash}`)
    if (cached) return JSON.parse(cached)
    
    try {
      // Process with Google Vision
      const [result] = await this.visionClient.textDetection(imageBuffer)
      const detections = result.textAnnotations || []
      
      // Extract potential reference codes
      const candidates = this.extractCandidates(detections)
      
      // Validate and score candidates
      const validated = await this.validateCodes(candidates)
      
      // Cache results
      await this.cache.set(
        `ref_code:${imageHash}`, 
        JSON.stringify(validated),
        'EX',
        3600 // 1 hour cache
      )
      
      return validated
      
    } catch (error) {
      // Fallback to Azure if Google fails
      return this.fallbackToAzure(imageBuffer)
    }
  }
  
  private extractCandidates(detections: TextAnnotation[]): string[] {
    const refCodePattern = /^[A-Z0-9]{6,20}$/
    return detections
      .map(d => d.description)
      .filter(text => refCodePattern.test(text))
      .slice(0, 5) // Top 5 candidates
  }
  
  private async validateCodes(candidates: string[]): Promise<ReferenceCodeResult> {
    const validations = await Promise.all(
      candidates.map(async (code) => ({
        code,
        confidence: await this.calculateConfidence(code),
        isValid: await this.checkDatabase(code)
      }))
    )
    
    return {
      codes: validations
        .filter(v => v.isValid)
        .sort((a, b) => b.confidence - a.confidence),
      processingTime: Date.now()
    }
  }
}
```

#### 3. Notification Service

```typescript
// services/notification-service.ts
export class NotificationService {
  constructor(
    private db: SupabaseClient,
    private emailService: EmailService,
    private smsService: SMSService
  ) {}
  
  async notifySeller(sellerId: string, notification: NotificationPayload) {
    // Create database notification
    const dbNotification = await this.db
      .from('notifications')
      .insert({
        user_id: sellerId,
        type: notification.type,
        title: notification.title,
        body: notification.body,
        metadata: notification.metadata,
        created_at: new Date().toISOString()
      })
      .select()
      .single()
    
    // Get user preferences
    const { data: preferences } = await this.db
      .from('notification_preferences')
      .select('*')
      .eq('user_id', sellerId)
      .single()
    
    // Send based on preferences
    if (preferences.email_enabled) {
      await this.emailService.send({
        to: preferences.email,
        subject: notification.title,
        template: 'notification',
        data: notification
      })
    }
    
    if (preferences.sms_enabled && notification.priority === 'high') {
      await this.smsService.send({
        to: preferences.phone,
        message: `${notification.title}: ${notification.body}`
      })
    }
    
    // Real-time push
    await this.db.channel('notifications').send({
      type: 'broadcast',
      event: 'new_notification',
      payload: dbNotification
    })
  }
}
```

## Database Architecture

### Schema Design

```sql
-- Core Tables

-- Users table (extends Supabase auth.users)
CREATE TABLE public.users (
  id UUID PRIMARY KEY REFERENCES auth.users(id),
  user_type user_type_enum NOT NULL DEFAULT 'individual',
  business_name VARCHAR(255),
  phone VARCHAR(20) NOT NULL,
  location VARCHAR(100) NOT NULL,
  avatar_url TEXT,
  rating DECIMAL(3,2) DEFAULT 0,
  rating_count INTEGER DEFAULT 0,
  verified_phone BOOLEAN DEFAULT FALSE,
  verified_id BOOLEAN DEFAULT FALSE,
  verified_business BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Part reference database
CREATE TABLE part_references (
  id SERIAL PRIMARY KEY,
  reference_code VARCHAR(50) NOT NULL UNIQUE,
  manufacturer_id INTEGER REFERENCES manufacturers(id),
  part_category_id INTEGER REFERENCES part_categories(id),
  part_name VARCHAR(200) NOT NULL,
  description TEXT,
  specifications JSONB,
  search_vector tsvector GENERATED ALWAYS AS (
    to_tsvector('turkish', part_name || ' ' || COALESCE(description, ''))
  ) STORED,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Vehicle compatibility mapping
CREATE TABLE part_vehicle_compatibility (
  id SERIAL PRIMARY KEY,
  part_reference_id INTEGER REFERENCES part_references(id),
  make VARCHAR(50) NOT NULL,
  model VARCHAR(100) NOT NULL,
  year_start INTEGER NOT NULL,
  year_end INTEGER NOT NULL,
  engine_type VARCHAR(100),
  trim_level VARCHAR(100),
  notes TEXT,
  INDEX idx_vehicle_lookup (make, model, year_start, year_end)
);

-- Part listings
CREATE TABLE part_listings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  seller_id UUID REFERENCES users(id) NOT NULL,
  vehicle_listing_id UUID REFERENCES vehicle_listings(id),
  reference_code VARCHAR(50),
  part_name VARCHAR(200) NOT NULL,
  make VARCHAR(50) NOT NULL,
  model VARCHAR(100) NOT NULL,
  year INTEGER NOT NULL,
  condition part_condition_enum NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  currency VARCHAR(3) DEFAULT 'TRY',
  stock_quantity INTEGER DEFAULT 1,
  images TEXT[] NOT NULL,
  description TEXT,
  location VARCHAR(200) NOT NULL,
  location_point GEOGRAPHY(POINT),
  status listing_status_enum DEFAULT 'active',
  view_count INTEGER DEFAULT 0,
  ai_confidence DECIMAL(3,2),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  CONSTRAINT valid_price CHECK (price > 0),
  INDEX idx_reference_code (reference_code),
  INDEX idx_vehicle_search (make, model, year),
  INDEX idx_location_geo (location_point),
  INDEX idx_status_created (status, created_at DESC)
);

-- Wanted listings
CREATE TABLE wanted_listings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  buyer_id UUID REFERENCES users(id) NOT NULL,
  reference_code VARCHAR(50),
  part_name VARCHAR(200),
  make VARCHAR(50),
  model VARCHAR(100),
  year_start INTEGER,
  year_end INTEGER,
  condition_preference condition_preference_enum DEFAULT 'any',
  max_price DECIMAL(10,2),
  location_preference VARCHAR(200),
  location_radius_km INTEGER DEFAULT 50,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  status wanted_status_enum DEFAULT 'active',
  matched_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  INDEX idx_active_wanted (status, expires_at),
  INDEX idx_wanted_match (reference_code, make, model)
);

-- Notifications
CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) NOT NULL,
  type notification_type_enum NOT NULL,
  title VARCHAR(255) NOT NULL,
  body TEXT NOT NULL,
  metadata JSONB,
  read_at TIMESTAMP WITH TIME ZONE,
  clicked_at TIMESTAMP WITH TIME ZONE,
  relevance_score DECIMAL(3,2),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  INDEX idx_user_unread (user_id, read_at),
  INDEX idx_created (created_at DESC)
);

-- Chat messages
CREATE TABLE chat_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID REFERENCES conversations(id) NOT NULL,
  sender_id UUID REFERENCES users(id) NOT NULL,
  message_type message_type_enum DEFAULT 'text',
  content TEXT,
  attachments JSONB,
  read_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  INDEX idx_conversation_created (conversation_id, created_at)
);

-- Enums
CREATE TYPE user_type_enum AS ENUM ('individual', 'industrial');
CREATE TYPE part_condition_enum AS ENUM ('working', 'broken');
CREATE TYPE listing_status_enum AS ENUM ('active', 'paused', 'sold', 'deleted');
CREATE TYPE wanted_status_enum AS ENUM ('active', 'paused', 'fulfilled', 'expired');
CREATE TYPE notification_type_enum AS ENUM ('new_match', 'new_message', 'price_drop', 'system');
CREATE TYPE message_type_enum AS ENUM ('text', 'image', 'voice', 'location', 'price_offer');
```

### Performance Optimization

```sql
-- Composite indexes for common queries
CREATE INDEX idx_listings_search ON part_listings (status, make, model, year) 
  WHERE status = 'active';

CREATE INDEX idx_wanted_active ON wanted_listings (status, expires_at) 
  WHERE status = 'active';

-- Full-text search
CREATE INDEX idx_part_search ON part_references USING GIN (search_vector);

-- Materialized view for popular parts
CREATE MATERIALIZED VIEW popular_parts AS
SELECT 
  p.reference_code,
  p.part_name,
  p.make,
  p.model,
  COUNT(DISTINCT w.id) as wanted_count,
  AVG(pl.price) as avg_price,
  COUNT(DISTINCT pl.id) as listing_count
FROM part_references p
LEFT JOIN wanted_listings w ON w.reference_code = p.reference_code
LEFT JOIN part_listings pl ON pl.reference_code = p.reference_code
GROUP BY p.reference_code, p.part_name, p.make, p.model
HAVING COUNT(DISTINCT w.id) > 5;

-- Refresh materialized view daily
CREATE OR REPLACE FUNCTION refresh_popular_parts()
RETURNS void AS $$
BEGIN
  REFRESH MATERIALIZED VIEW CONCURRENTLY popular_parts;
END;
$$ LANGUAGE plpgsql;
```

### Row Level Security (RLS)

```sql
-- Enable RLS
ALTER TABLE part_listings ENABLE ROW LEVEL SECURITY;
ALTER TABLE wanted_listings ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;

-- Listings policies
CREATE POLICY "Public listings are viewable by everyone" 
  ON part_listings FOR SELECT 
  USING (status = 'active');

CREATE POLICY "Users can insert their own listings" 
  ON part_listings FOR INSERT 
  WITH CHECK (auth.uid() = seller_id);

CREATE POLICY "Users can update their own listings" 
  ON part_listings FOR UPDATE 
  USING (auth.uid() = seller_id);

-- Notifications policies
CREATE POLICY "Users can view their own notifications" 
  ON notifications FOR SELECT 
  USING (auth.uid() = user_id);

-- Chat policies
CREATE POLICY "Users can view their conversations" 
  ON chat_messages FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM conversations c
      WHERE c.id = conversation_id
      AND (c.buyer_id = auth.uid() OR c.seller_id = auth.uid())
    )
  );
```

## AI Integration Architecture

### AI Processing Pipeline

```
┌─────────────────┐     ┌──────────────────┐     ┌─────────────────┐
│  Image Upload   │────▶│ Preprocessing    │────▶│ OCR Processing  │
└─────────────────┘     └──────────────────┘     └─────────────────┘
                                                           │
                                                           ▼
┌─────────────────┐     ┌──────────────────┐     ┌─────────────────┐
│ User Selection  │◀────│ Confidence Score │◀────│ Code Extraction │
└─────────────────┘     └──────────────────┘     └─────────────────┘
                                                           │
                                                           ▼
┌─────────────────┐     ┌──────────────────┐     ┌─────────────────┐
│ Listing Created │◀────│ DB Validation    │◀────│ Code Validation │
└─────────────────┘     └──────────────────┘     └─────────────────┘
```

### Serverless AI Functions

```typescript
// api/ai/process-image/route.ts
export async function POST(request: NextRequest) {
  const formData = await request.formData()
  const image = formData.get('image') as File
  
  // Convert to buffer
  const buffer = Buffer.from(await image.arrayBuffer())
  
  // Process with AI service
  const aiService = new AIService()
  const result = await aiService.extractReferenceCode(buffer)
  
  // Store results for analytics
  await storeAIResult({
    userId: request.userId,
    success: result.codes.length > 0,
    confidence: result.codes[0]?.confidence || 0,
    processingTime: result.processingTime
  })
  
  return NextResponse.json(result)
}
```

### AI Model Training Pipeline

```python
# scripts/train_reference_model.py
import tensorflow as tf
from tensorflow import keras
import numpy as np

class ReferenceCodeModel:
    def __init__(self):
        self.model = self.build_model()
    
    def build_model(self):
        model = keras.Sequential([
            keras.layers.Conv2D(32, (3, 3), activation='relu'),
            keras.layers.MaxPooling2D((2, 2)),
            keras.layers.Conv2D(64, (3, 3), activation='relu'),
            keras.layers.MaxPooling2D((2, 2)),
            keras.layers.Flatten(),
            keras.layers.Dense(128, activation='relu'),
            keras.layers.Dense(36, activation='softmax')  # 0-9, A-Z
        ])
        
        model.compile(
            optimizer='adam',
            loss='categorical_crossentropy',
            metrics=['accuracy']
        )
        
        return model
    
    def train(self, train_data, validation_data):
        history = self.model.fit(
            train_data,
            validation_data=validation_data,
            epochs=50,
            batch_size=32
        )
        return history
```

## Infrastructure & Deployment

### Deployment Architecture

```yaml
# vercel.json
{
  "functions": {
    "app/api/ai/process-image/route.ts": {
      "maxDuration": 30,
      "memory": 3008
    },
    "app/api/listings/*/route.ts": {
      "maxDuration": 10
    }
  },
  "crons": [
    {
      "path": "/api/cron/expire-listings",
      "schedule": "0 0 * * *"
    },
    {
      "path": "/api/cron/refresh-materialized-views",
      "schedule": "0 2 * * *"
    }
  ]
}
```

### Environment Configuration

```bash
# .env.local
# Next.js
NEXT_PUBLIC_APP_URL=https://banayenisanaeski.com

# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=xxxx
SUPABASE_SERVICE_ROLE_KEY=xxxx

# AI Services
GOOGLE_CLOUD_PROJECT_ID=banayeni-sanaeski
GOOGLE_APPLICATION_CREDENTIALS=./service-account.json
AZURE_COGNITIVE_SERVICES_KEY=xxxx
AZURE_COGNITIVE_SERVICES_ENDPOINT=https://xxxx.cognitiveservices.azure.com/

# Redis
REDIS_URL=redis://xxxx.upstash.io:6379

# External Services
SENDGRID_API_KEY=xxxx
TWILIO_ACCOUNT_SID=xxxx
TWILIO_AUTH_TOKEN=xxxx
SENTRY_DSN=https://xxxx@sentry.io/xxxx
POSTHOG_API_KEY=xxxx

# Feature Flags
NEXT_PUBLIC_ENABLE_AI_ASSISTANCE=true
NEXT_PUBLIC_ENABLE_VOICE_MESSAGES=false
```

### CI/CD Pipeline

```yaml
# .github/workflows/deploy.yml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'
      
      - run: npm ci
      - run: npm run lint
      - run: npm run type-check
      - run: npm run test
      - run: npm run test:e2e
  
  deploy:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: vercel/action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          vercel-args: '--prod'
```

### Monitoring & Observability

```typescript
// lib/monitoring.ts
import * as Sentry from '@sentry/nextjs'
import { PostHog } from 'posthog-node'

// Error tracking
export const captureError = (error: Error, context?: any) => {
  console.error(error)
  Sentry.captureException(error, { extra: context })
}

// Analytics
export const analytics = new PostHog(
  process.env.POSTHOG_API_KEY!,
  { host: 'https://app.posthog.com' }
)

// Performance monitoring
export const measurePerformance = async <T>(
  operation: string,
  fn: () => Promise<T>
): Promise<T> => {
  const start = performance.now()
  
  try {
    const result = await fn()
    const duration = performance.now() - start
    
    analytics.capture({
      distinctId: 'system',
      event: 'performance_metric',
      properties: {
        operation,
        duration,
        success: true
      }
    })
    
    return result
  } catch (error) {
    const duration = performance.now() - start
    
    analytics.capture({
      distinctId: 'system',
      event: 'performance_metric',
      properties: {
        operation,
        duration,
        success: false,
        error: error.message
      }
    })
    
    throw error
  }
}
```

## Security Architecture

### Authentication Flow

```typescript
// lib/auth/auth-flow.ts
export class AuthenticationService {
  async register(data: RegisterData) {
    // 1. Create auth user
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
      options: {
        data: {
          user_type: data.userType,
          phone: data.phone
        }
      }
    })
    
    if (authError) throw authError
    
    // 2. Send phone verification
    await this.sendPhoneVerification(data.phone)
    
    // 3. Create user profile
    const { error: profileError } = await supabase
      .from('users')
      .insert({
        id: authData.user!.id,
        user_type: data.userType,
        phone: data.phone,
        location: data.location
      })
    
    if (profileError) {
      // Rollback auth user
      await supabase.auth.admin.deleteUser(authData.user!.id)
      throw profileError
    }
    
    return authData.user
  }
  
  async verifyPhone(userId: string, code: string) {
    const isValid = await this.validateOTP(userId, code)
    
    if (isValid) {
      await supabase
        .from('users')
        .update({ verified_phone: true })
        .eq('id', userId)
    }
    
    return isValid
  }
}
```

### API Security Middleware

```typescript
// middleware.ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'

export async function middleware(request: NextRequest) {
  const res = NextResponse.next()
  const supabase = createMiddlewareClient({ req: request, res })
  
  // Rate limiting
  const ip = request.ip || 'anonymous'
  const identifier = `${ip}:${request.nextUrl.pathname}`
  const { success } = await rateLimit.check(identifier)
  
  if (!success) {
    return new NextResponse('Too Many Requests', { status: 429 })
  }
  
  // CSRF protection
  if (['POST', 'PUT', 'DELETE'].includes(request.method)) {
    const token = request.headers.get('x-csrf-token')
    if (!token || !validateCSRFToken(token)) {
      return new NextResponse('Invalid CSRF Token', { status: 403 })
    }
  }
  
  // Authentication for protected routes
  if (request.nextUrl.pathname.startsWith('/api/protected')) {
    const { data: { session } } = await supabase.auth.getSession()
    
    if (!session) {
      return new NextResponse('Unauthorized', { status: 401 })
    }
  }
  
  return res
}

export const config = {
  matcher: ['/api/:path*', '/dashboard/:path*']
}
```

## Performance Optimization

### Frontend Optimization

```typescript
// next.config.js
module.exports = {
  images: {
    domains: ['supabase.co'],
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
  
  experimental: {
    optimizeCss: true,
  },
  
  webpack: (config, { dev, isServer }) => {
    // Bundle analyzer
    if (!dev && !isServer) {
      const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer')
      config.plugins.push(
        new BundleAnalyzerPlugin({
          analyzerMode: 'static',
          reportFilename: './analyze.html',
          openAnalyzer: false,
        })
      )
    }
    
    return config
  },
}
```

### Database Query Optimization

```typescript
// lib/db/optimized-queries.ts
export const getPartListingsOptimized = async (filters: SearchFilters) => {
  let query = supabase
    .from('part_listings')
    .select(`
      id,
      reference_code,
      part_name,
      price,
      condition,
      location,
      images,
      created_at,
      seller:users!inner(
        id,
        business_name,
        rating,
        verified_business
      )
    `)
    .eq('status', 'active')
  
  // Apply filters efficiently
  if (filters.referenceCode) {
    query = query.eq('reference_code', filters.referenceCode)
  } else if (filters.make && filters.model) {
    query = query
      .eq('make', filters.make)
      .eq('model', filters.model)
    
    if (filters.year) {
      query = query.eq('year', filters.year)
    }
  }
  
  // Pagination with cursor
  if (filters.cursor) {
    query = query.lt('created_at', filters.cursor)
  }
  
  const { data, error } = await query
    .order('created_at', { ascending: false })
    .limit(20)
  
  return { data, error }
}
```

### Caching Strategy

```typescript
// lib/cache/redis-cache.ts
export class CacheService {
  private redis: Redis
  
  constructor() {
    this.redis = new Redis(process.env.REDIS_URL!)
  }
  
  async get<T>(key: string): Promise<T | null> {
    const value = await this.redis.get(key)
    return value ? JSON.parse(value) : null
  }
  
  async set(key: string, value: any, ttl?: number) {
    const serialized = JSON.stringify(value)
    if (ttl) {
      await this.redis.set(key, serialized, 'EX', ttl)
    } else {
      await this.redis.set(key, serialized)
    }
  }
  
  async invalidate(pattern: string) {
    const keys = await this.redis.keys(pattern)
    if (keys.length > 0) {
      await this.redis.del(...keys)
    }
  }
  
  // Cache wrapper for expensive operations
  async cached<T>(
    key: string,
    fn: () => Promise<T>,
    ttl: number = 3600
  ): Promise<T> {
    const cached = await this.get<T>(key)
    if (cached) return cached
    
    const result = await fn()
    await this.set(key, result, ttl)
    return result
  }
}

// Usage example
const cache = new CacheService()

export const getPopularParts = async () => {
  return cache.cached(
    'popular_parts',
    async () => {
      const { data } = await supabase
        .from('popular_parts')
        .select('*')
        .limit(20)
      return data
    },
    3600 // 1 hour cache
  )
}
```

## Testing Strategy

### Unit Testing

```typescript
// __tests__/services/matching-engine.test.ts
import { MatchingEngine } from '@/services/matching-engine'
import { mockSupabase } from '@/test/mocks'

describe('MatchingEngine', () => {
  let matchingEngine: MatchingEngine
  
  beforeEach(() => {
    matchingEngine = new MatchingEngine(mockSupabase)
  })
  
  describe('findMatches', () => {
    it('should find exact reference code matches', async () => {
      const wanted = {
        id: '123',
        referenceCode: 'ABC123',
        buyerId: 'user1'
      }
      
      mockSupabase.from.mockReturnValue({
        select: jest.fn().mockReturnValue({
          eq: jest.fn().mockReturnValue({
            eq: jest.fn().mockResolvedValue({
              data: [{ id: '1', reference_code: 'ABC123' }]
            })
          })
        })
      })
      
      const matches = await matchingEngine.findMatches(wanted)
      expect(matches).toHaveLength(1)
      expect(matches[0].reference_code).toBe('ABC123')
    })
  })
  
  describe('calculateRelevance', () => {
    it('should calculate relevance score correctly', () => {
      const listing = {
        location: 'Istanbul',
        price: 500,
        condition: 'working',
        seller: { rating: 4.5 }
      }
      
      const wanted = {
        locationPreference: 'Istanbul',
        maxPrice: 1000,
        condition: 'working'
      }
      
      const score = matchingEngine.calculateRelevance(listing, wanted)
      expect(score).toBeCloseTo(0.98, 2)
    })
  })
})
```

### Integration Testing

```typescript
// __tests__/api/listings.test.ts
import { createMocks } from 'node-mocks-http'
import { POST } from '@/app/api/listings/route'

describe('/api/listings', () => {
  it('should create a new listing', async () => {
    const { req, res } = createMocks({
      method: 'POST',
      body: {
        type: 'part',
        referenceCode: 'ABC123',
        make: 'Toyota',
        model: 'Corolla',
        year: 2015,
        condition: 'working',
        price: 1000,
        images: ['image1.jpg'],
        description: 'Test part'
      }
    })
    
    await POST(req)
    
    expect(res._getStatusCode()).toBe(200)
    const json = JSON.parse(res._getData())
    expect(json.success).toBe(true)
    expect(json.data).toHaveProperty('id')
  })
  
  it('should validate required fields', async () => {
    const { req, res } = createMocks({
      method: 'POST',
      body: {
        type: 'part',
        // Missing required fields
      }
    })
    
    await POST(req)
    
    expect(res._getStatusCode()).toBe(400)
    const json = JSON.parse(res._getData())
    expect(json.error).toBe('Invalid input')
  })
})
```

### E2E Testing

```typescript
// e2e/listing-flow.spec.ts
import { test, expect } from '@playwright/test'

test.describe('Listing Creation Flow', () => {
  test('should create a part listing with AI assistance', async ({ page }) => {
    // Login
    await page.goto('/login')
    await page.fill('[name="email"]', 'test@example.com')
    await page.fill('[name="password"]', 'password123')
    await page.click('button[type="submit"]')
    
    // Navigate to create listing
    await page.goto('/dashboard/listings/new')
    
    // Upload image for AI processing
    const fileInput = page.locator('input[type="file"]')
    await fileInput.setInputFiles('test-assets/part-with-code.jpg')
    
    // Click AI scan button
    await page.click('button:has-text("Scan Reference Code")')
    
    // Wait for AI results
    await page.waitForSelector('[data-testid="ai-results"]')
    
    // Select detected code
    await page.click('[data-testid="code-option-0"]')
    
    // Fill remaining fields
    await page.selectOption('[name="make"]', 'Toyota')
    await page.selectOption('[name="model"]', 'Corolla')
    await page.fill('[name="year"]', '2015')
    await page.selectOption('[name="condition"]', 'working')
    await page.fill('[name="price"]', '1000')
    
    // Submit
    await page.click('button:has-text("Create Listing")')
    
    // Verify success
    await expect(page).toHaveURL(/\/dashboard\/listings/)
    await expect(page.locator('[data-testid="success-message"]')).toBeVisible()
  })
})
```

## Migration Strategy

### Phase 1: Database Migration (Week 1-2)

```typescript
// scripts/migrate-to-supabase.ts
import { createClient } from '@supabase/supabase-js'
import { SqlServerClient } from './legacy/sql-server'

async function migrateParts() {
  const legacy = new SqlServerClient()
  const supabase = createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_KEY!
  )
  
  // Fetch legacy data
  const parts = await legacy.query('SELECT * FROM parts')
  
  // Transform and insert
  const transformed = parts.map(part => ({
    reference_code: part.ReferenceCode,
    part_name: part.PartName,
    make: part.Make,
    model: part.Model,
    year: part.Year,
    condition: part.Condition.toLowerCase(),
    price: part.Price,
    seller_id: part.SellerID,
    images: JSON.parse(part.Images || '[]'),
    created_at: part.CreatedDate
  }))
  
  const { error } = await supabase
    .from('part_listings')
    .insert(transformed)
  
  if (error) {
    console.error('Migration error:', error)
  } else {
    console.log(`Migrated ${transformed.length} parts`)
  }
}
```

### Phase 2: Feature Parity (Week 3-4)

- Implement all existing features in new architecture
- Maintain backward compatibility with old URLs
- Run parallel systems for testing

### Phase 3: Cutover (Week 5)

- DNS update to new infrastructure
- Monitor for issues
- Keep old system as fallback

## Conclusion

This full-stack architecture provides a solid foundation for building BanaYeni SanaEski into a market-leading automobile parts marketplace. The architecture emphasizes:

1. **Rapid Development** - Monolithic Next.js with integrated tooling
2. **Scalability** - Serverless functions and managed services
3. **Performance** - Edge optimization and intelligent caching
4. **User Experience** - PWA with real-time features
5. **AI Integration** - Seamless reference code recognition
6. **Cost Efficiency** - Pay-per-use infrastructure

The modular design allows for iterative development and easy scaling as the platform grows from MVP to full production serving the Turkish automotive market.