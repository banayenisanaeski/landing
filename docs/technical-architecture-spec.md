# Technical Architecture Specification
**BanaYeni SanaEski - Automobile Parts Marketplace**

**Architecture Version:** 2.0 - AI-Enhanced Reference Matching  
**Last Updated:** August 7, 2025  
**Status:** Planning Phase - Strategic Pivot  
**Scope:** Core platform architecture with AI integration requirements  

## System Overview

The platform architecture centers on **reference-code based part matching** enhanced by **AI-powered identification and compatibility mapping**. The system enables instant notifications between buyers and sellers through intelligent part matching algorithms.

### Core Architecture Principles

1. **Reference-Code Centricity:** All parts identified by manufacturer reference codes for precise matching
2. **AI-Enhanced Discovery:** Visual recognition and compatibility mapping reduce manual entry barriers  
3. **Real-Time Notification System:** Instant alerts create immediate supply-demand connections
4. **Trust-First Design:** Quality control and verification systems built into core architecture
5. **Scalable Matching Engine:** Designed to handle high-volume industrial users and precise individual needs

## High-Level System Architecture

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   Web Client    │    │   Mobile App     │    │  Admin Portal   │
│   (Next.js)     │    │   (React Native) │    │   (Dashboard)   │
└─────────┬───────┘    └────────┬─────────┘    └─────────┬───────┘
          │                     │                        │
          └─────────────────────┼────────────────────────┘
                                │
                    ┌───────────┴────────────┐
                    │   API Gateway Layer    │
                    │   (Next.js API Routes) │
                    └───────────┬────────────┘
                                │
                ┌───────────────┼────────────────┐
                │               │                │
        ┌───────┴────────┐  ┌───┴────┐  ┌──────┴──────┐
        │ AI Processing  │  │ Core   │  │ Notification │
        │    Engine      │  │Business│  │   Service    │
        │                │  │ Logic  │  │              │
        └───────┬────────┘  └───┬────┘  └──────┬───────┘
                │               │              │
                └───────────────┼──────────────┘
                                │
                    ┌───────────┴────────────┐
                    │   Supabase Platform    │
                    │ • PostgreSQL Database  │
                    │ • Real-time Engine     │  
                    │ • Storage & CDN        │
                    │ • Authentication       │
                    └────────────────────────┘
```

## Core System Components

### 1. Reference Code Management System

**Purpose:** Central repository and matching engine for automotive part reference codes

**Components:**
```
ReferenceCodeService
├── PartReferenceDatabase
│   ├── ManufacturerCodes (OEM reference standards)
│   ├── AftermarketCodes (alternative part numbers)
│   └── CrossReferenceMapping (compatibility matrix)
├── ValidationEngine
│   ├── CodeFormatValidation
│   ├── ManufacturerVerification  
│   └── DuplicateDetection
└── SearchEngine
    ├── ExactMatchService
    ├── FuzzyMatchService (typo tolerance)
    └── CompatibilityLookup
```

**Database Schema:**
```sql
-- Core reference code table
CREATE TABLE part_references (
    id SERIAL PRIMARY KEY,
    reference_code VARCHAR(50) NOT NULL UNIQUE,
    manufacturer_id INTEGER REFERENCES manufacturers(id),
    part_category_id INTEGER REFERENCES part_categories(id),
    part_name VARCHAR(200),
    description TEXT,
    specifications JSONB,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Vehicle compatibility mapping
CREATE TABLE part_vehicle_compatibility (
    id SERIAL PRIMARY KEY,
    part_reference_id INTEGER REFERENCES part_references(id),
    vehicle_make VARCHAR(50),
    vehicle_model VARCHAR(100), 
    year_start INTEGER,
    year_end INTEGER,
    engine_type VARCHAR(100),
    additional_specs JSONB
);
```

### 2. AI Processing Engine

**Architecture Overview:**
```
AI Processing Pipeline
├── Image Processing Module
│   ├── ImagePreprocessing (noise reduction, enhancement)
│   ├── OCR Engine (text extraction from part images)
│   ├── ReferenceCodeDetection (identify codes in images)  
│   └── ValidationService (cross-check extracted codes)
├── Vehicle Compatibility Engine
│   ├── ReferenceToVehicleMapping
│   ├── CompatibilityScoring (match confidence levels)
│   └── NotificationTargeting (relevant seller identification)
└── Quality Verification System
    ├── ImageQualityAssessment
    ├── CodeAccuracyValidation
    └── FraudDetection (mismatched codes/images)
```

**AI Module 1: Image-to-Reference Recognition**

**Input:** Part photograph uploaded by user  
**Process:**
1. Image preprocessing and enhancement
2. OCR text extraction from multiple image regions
3. Reference code pattern recognition and validation
4. Confidence scoring for extracted codes
5. Cross-reference verification against part database

**Output:** 
- Extracted reference code(s) with confidence scores
- Alternative possible codes if confidence below threshold
- Request for additional images if recognition fails

**Technical Implementation:**
```javascript
// AI Service Integration
class ImageReferenceRecognition {
    async processPartImage(imageFile, userContext) {
        // 1. Image preprocessing
        const processedImage = await this.preprocessImage(imageFile);
        
        // 2. OCR extraction  
        const textExtractions = await this.extractText(processedImage);
        
        // 3. Reference pattern matching
        const candidateCodes = this.identifyReferenceCodes(textExtractions);
        
        // 4. Database validation
        const validatedCodes = await this.validateCodes(candidateCodes);
        
        // 5. Confidence scoring
        return this.scoreAndRankResults(validatedCodes);
    }
}
```

**AI Module 2: Reference-to-Vehicle Compatibility**

**Input:** Validated reference code from wanted listing  
**Process:**
1. Reference code lookup in compatibility database
2. Vehicle make/model/year identification
3. Compatible vehicle variant identification (engine types, trim levels)
4. Seller inventory matching based on vehicle specifications
5. Notification targeting with relevance scoring

**Output:**
- List of compatible vehicle specifications
- Ranked list of relevant sellers to notify
- Notification message customization based on match confidence

### 3. Wanted Listing & Notification System

**Core Workflow:**
```
Wanted Listing Creation
├── User Input Processing
│   ├── ReferenceCodeEntry (manual or AI-assisted)
│   ├── VehicleSpecification (make/model/year)
│   └── QuantityAndCondition (working/broken/either)
├── AI Compatibility Analysis  
│   ├── VehicleCompatibilityMapping
│   ├── SellerInventoryMatching
│   └── RelevanceScoring
└── Instant Notification Dispatch
    ├── TargetedSellerIdentification
    ├── NotificationCustomization  
    └── DeliveryTracking
```

**Database Schema:**
```sql
-- Wanted listings table
CREATE TABLE wanted_listings (
    id SERIAL PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id),
    reference_code VARCHAR(50),
    part_name VARCHAR(200),
    vehicle_make VARCHAR(50),
    vehicle_model VARCHAR(100),
    year_range_start INTEGER,
    year_range_end INTEGER,
    condition_required part_condition_enum,
    max_price_tl DECIMAL(10,2),
    location_preference TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    expires_at TIMESTAMP,
    status wanted_status_enum DEFAULT 'active'
);

-- Notification tracking
CREATE TABLE seller_notifications (
    id SERIAL PRIMARY KEY,
    wanted_listing_id INTEGER REFERENCES wanted_listings(id),
    seller_id UUID REFERENCES auth.users(id), 
    notification_sent_at TIMESTAMP DEFAULT NOW(),
    relevance_score DECIMAL(3,2), -- 0.00 to 1.00
    opened_at TIMESTAMP,
    responded_at TIMESTAMP,
    response_type notification_response_enum
);
```

### 4. Inventory & Listing Management

**Seller Listing System:**
```
Listing Management
├── Individual Seller Interface
│   ├── SinglePartListing (photo + basic details)
│   ├── AIAssistedReferenceRecognition
│   └── SimplifiedFlow (minimal technical knowledge required)
├── Industrial Seller Interface  
│   ├── BulkVehicleListing (entire vehicle for dismantling)
│   ├── BatchPartListing (multiple parts from inventory)
│   └── InventoryManagement (stock levels, pricing)
└── Automated Matching
    ├── WantedListingMatching (new listings trigger notifications)
    ├── InventoryUpdates (stock changes trigger re-matching)
    └── PriceOptimization (market data integration)
```

**Database Schema:**
```sql
-- Vehicle listings for dismantling
CREATE TABLE vehicle_listings (
    id SERIAL PRIMARY KEY,
    seller_id UUID REFERENCES auth.users(id),
    make VARCHAR(50) NOT NULL,
    model VARCHAR(100) NOT NULL,
    year INTEGER NOT NULL,
    mileage_km INTEGER,
    engine_type VARCHAR(100),
    damage_description TEXT,
    available_parts TEXT[], -- array of extractable parts
    location VARCHAR(200),
    price_tl DECIMAL(10,2),
    status vehicle_listing_status_enum DEFAULT 'available',
    created_at TIMESTAMP DEFAULT NOW()
);

-- Individual part listings  
CREATE TABLE part_listings (
    id SERIAL PRIMARY KEY,
    seller_id UUID REFERENCES auth.users(id),
    vehicle_listing_id INTEGER REFERENCES vehicle_listings(id), -- optional
    reference_code VARCHAR(50),
    part_name VARCHAR(200) NOT NULL,
    condition part_condition_enum NOT NULL,
    price_tl DECIMAL(10,2),
    stock_quantity INTEGER DEFAULT 1,
    images TEXT[], -- array of image URLs
    description TEXT,
    location VARCHAR(200),
    status part_listing_status_enum DEFAULT 'available',
    created_at TIMESTAMP DEFAULT NOW()
);
```

### 5. Trust & Quality Control System

**Multi-Layer Verification:**
```
Trust System Architecture
├── User Verification
│   ├── IdentityVerification (phone, email, ID)
│   ├── BusinessVerification (industrial sellers)
│   └── LocationVerification (GPS confirmation)
├── Listing Quality Control
│   ├── AIImageAnalysis (detect fake/stock photos)
│   ├── ReferenceCodeValidation (prevent incorrect listings)
│   └── DuplicateDetection (prevent spam listings)
├── Transaction Feedback
│   ├── BuyerSellerRatings
│   ├── QualityReports (condition accuracy)
│   └── CommunicationFeedback
└── Automated Enforcement
    ├── ReputationScoring
    ├── AutomaticSuspension (low ratings)
    └── CommunityReporting (user flagging system)
```

## API Architecture

### Core API Endpoints

**Wanted Listings API:**
```
POST /api/wanted-listings
├── Create new wanted listing
├── Trigger AI compatibility analysis
└── Dispatch seller notifications

GET /api/wanted-listings/user/{userId}
├── Retrieve user's wanted listings
├── Include notification statistics
└── Show matching progress

PUT /api/wanted-listings/{id}/status
├── Update listing status (active/paused/fulfilled)
├── Trigger re-matching if reactivated
└── Update notification targeting
```

**AI Processing API:**
```
POST /api/ai/image-recognition
├── Process part image for reference codes
├── Return confidence-scored results
└── Suggest manual verification if needed

POST /api/ai/compatibility-check  
├── Analyze reference code vehicle compatibility
├── Return compatible vehicle specifications
└── Identify relevant seller inventory
```

**Notification API:**
```
POST /api/notifications/dispatch
├── Send targeted notifications to sellers
├── Track delivery and engagement metrics
└── Handle notification preferences

GET /api/notifications/seller/{sellerId}
├── Retrieve seller's received notifications
├── Include relevance scores and actions
└── Support filtering and sorting
```

## Technology Stack

### Frontend Architecture
- **Framework:** Next.js 13.4+ with TypeScript
- **Styling:** TailwindCSS for responsive design
- **State Management:** React Query for server state, Zustand for client state
- **Mobile:** Progressive Web App (PWA) approach initially, React Native for native apps

### Backend Architecture  
- **API Layer:** Next.js API Routes with TypeScript
- **Database:** Supabase PostgreSQL with Row Level Security
- **Authentication:** Supabase Auth with social login options
- **File Storage:** Supabase Storage for images and documents
- **Real-time:** Supabase Realtime for instant notifications

### AI Integration
- **Image Processing:** Cloud-based OCR service (Google Vision API or Azure Cognitive Services)
- **Reference Recognition:** Custom-trained models for automotive part identification
- **Compatibility Engine:** Rule-based system with machine learning optimization
- **Hosting:** Serverless functions for AI processing (Vercel Functions or AWS Lambda)

### Infrastructure
- **Deployment:** Vercel for frontend, Supabase for backend infrastructure
- **CDN:** Supabase CDN for image delivery
- **Monitoring:** Sentry for error tracking, PostHog for analytics
- **Performance:** Redis caching for frequently accessed data

## Security & Performance Considerations

### Security Architecture
```
Security Layers
├── Authentication & Authorization
│   ├── JWT tokens with short expiration
│   ├── Role-based access control (individual/industrial)
│   └── API rate limiting per user type
├── Data Protection
│   ├── Encryption at rest (database)
│   ├── Encryption in transit (HTTPS/TLS)
│   └── Personal data anonymization
├── AI Security
│   ├── Image content validation (prevent malicious uploads)
│   ├── Reference code sanitization
│   └── AI model access controls
└── Business Logic Security
    ├── Listing validation rules
    ├── Notification spam prevention
    └── Fraud detection algorithms
```

### Performance Optimization
- **Database:** Indexing on reference codes, vehicle specifications, and user IDs
- **Caching:** Redis for AI results, reference lookups, and compatibility matrices  
- **Image Processing:** Lazy loading, WebP format, responsive sizing
- **API Response Times:** <200ms for search, <500ms for AI processing
- **Notification Delivery:** <60 seconds from wanted listing creation

## Development & Deployment Strategy

### Phase 1: MVP Core (Months 1-2)
- Reference code database setup and basic matching
- Wanted listing creation and simple notifications  
- Basic AI image recognition (limited accuracy acceptable)
- User authentication and basic trust system

### Phase 2: AI Enhancement (Month 3)
- Advanced AI Module 2 (compatibility mapping)
- Improved notification targeting and relevance
- Industrial seller bulk listing tools
- Enhanced trust and verification systems

### Phase 3: Scale & Optimize (Month 4+)
- Performance optimization for high-volume usage
- Advanced AI accuracy improvements  
- Mobile native app development
- Analytics dashboard for sellers and platform optimization

---

*This technical architecture specification provides the foundation for developing BanaYeni SanaEski's AI-enhanced automobile parts marketplace platform.*