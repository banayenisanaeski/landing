# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

BanaYeni SanaEski ("Old2You, New2Me") is a Turkish automotive parts marketplace promoting sustainable commerce through circular economy principles. The platform serves as an online "junkyard" connecting parts buyers and sellers with an interest-gated communication system to prevent spam.

## ⚠️ Important: Project Refactoring in Progress

**CRITICAL:** This codebase is undergoing complete refactoring. Always refer to the comprehensive documentation in `@docs/` folder instead of current implementation when making changes.

**Documentation Structure:**
- `@docs/README.md` - Complete project documentation index
- `@docs/business/` - Business strategy and migration plans  
- `@docs/architecture/` - System architecture and technology stack
- `@docs/implementation/` - Development setup and coding standards
- `@docs/operations/` - Deployment and monitoring guides
- `@docs/testing/` - Testing strategy and QA processes
- `@docs/workflows/` - Development processes and user journeys
- `@docs/reference/` - Turkish market requirements and integrations

## Target Architecture (Post-Refactoring)

### Technology Stack
- **Frontend:** Next.js 13.4.12 + TypeScript + TailwindCSS + Headless UI
- **Backend:** Next.js API Routes + Supabase (unified platform)
- **Database:** PostgreSQL via Supabase (migrating from dual SQL Server + Supabase)
- **Authentication:** Supabase Auth with email/password + social login
- **Storage:** Supabase Storage for part images
- **Deployment:** Vercel + Supabase
- **Testing:** Jest + React Testing Library + Playwright

### Key Architecture Changes
1. **Database Migration:** Dual-database (SQL Server + Supabase) → Supabase-only PostgreSQL
2. **Turkish Optimization:** Full Turkish text search with PostgreSQL trigram indexing
3. **Interest-Gating System:** Core business logic to prevent spam through seller approval
4. **Mobile-First:** Optimized for Turkish mobile networks and devices

## Development Commands

```bash
# Development
npm run dev          # Start development server
npm run build        # Production build
npm start            # Start production server

# Testing (Post-Refactoring)
npm run test         # Run Jest unit tests
npm run test:watch   # Watch mode for tests
npm run test:e2e     # Run Playwright E2E tests
npm run test:coverage # Generate test coverage report

# Quality Assurance
npm run lint         # ESLint code linting
npm run type-check   # TypeScript type checking
npm run format       # Prettier code formatting
```

## Core Business Logic

### Interest-Gating System
**Critical Feature:** Prevents spam by requiring seller approval before buyer-seller communication.

**Flow:**
1. Buyer finds part and clicks "İlgi Göster" (Show Interest)
2. Seller receives notification of buyer interest
3. Seller approves/rejects interest request
4. If approved, direct communication enabled (WhatsApp/phone)
5. Transaction completed offline

### Turkish Market Optimization
- **Language:** All UI in Turkish, supports Turkish characters (çğıöşü)
- **Currency:** Turkish Lira (TRY) formatting: "1.500 TL"
- **Location:** Turkish cities and regions
- **Mobile:** Optimized for Turkish mobile networks (Turkcell, Vodafone, Türk Telekom)
- **Cultural:** Business practices aligned with Turkish commerce patterns

### Part Reference System
**Critical Field:** `part_reference` - manufacturer part number essential for accurate parts matching in Turkish automotive market.

## Current vs Target Database Schema

### Current State (Dual Database)
```
SQL Server: Parts, Matches, Requests
Supabase: User authentication only
```

### Target State (Supabase-Only)
```sql
-- Key tables in PostgreSQL via Supabase
public.user_profiles    -- User accounts and profiles
public.parts           -- Parts inventory with Turkish optimization
public.interests       -- Interest-gating system
public.conversations   -- Buyer-seller messaging
public.matches         -- Successful connections
```

## Turkish Localization Requirements

### Text Processing
- UTF-8 encoding for Turkish characters
- Turkish collation (tr_TR.UTF-8) for proper sorting
- Trigram indexing for fuzzy Turkish text search
- Diacritic-insensitive search (ç↔c, ğ↔g, etc.)

### User Interface
- All text in Turkish language
- Turkish date format (dd.mm.yyyy)
- Turkish Lira currency formatting
- Turkish phone number format (+90 5XX XXX XXXX)

### Business Rules
- Turkish automotive brands and models
- Turkish cities (81 provinces)
- Turkish part condition terms: "Kullanılabilir" / "Arızalı"
- Turkish business hours and communication patterns

## Key API Endpoints (Target Architecture)

### Parts Management
- `GET /api/parts` - Search parts with Turkish filters
- `POST /api/parts` - Create new part listing
- `PUT /api/parts/[id]` - Update part listing
- `DELETE /api/parts/[id]` - Remove part listing

### Interest System
- `POST /api/interests` - Express interest in part
- `PUT /api/interests/[id]` - Approve/reject interest
- `GET /api/interests/user` - Get user's interests

### Communication
- `GET /api/conversations` - User's conversations
- `POST /api/conversations/[id]/messages` - Send message
- WebSocket: `/api/ws` - Real-time messaging

## Environment Variables

```env
# Supabase (Primary Database)
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# Application Configuration
NEXT_PUBLIC_APP_URL=
NEXT_PUBLIC_DEFAULT_LOCALE=tr-TR
NEXT_PUBLIC_CURRENCY=TRY

# External Integrations
NEXT_PUBLIC_GOOGLE_ADS_ID=
SENTRY_DSN=
TWILIO_ACCOUNT_SID=
TWILIO_AUTH_TOKEN=

# Legacy (Being Removed)
DB_USER=          # SQL Server (migration only)
DB_PASSWORD=      # SQL Server (migration only)  
DB_SERVER=        # SQL Server (migration only)
DB_DATABASE=      # SQL Server (migration only)
```

## Development Workflow

1. **Read Documentation First:** Always check `@docs/` for current specifications
2. **Follow Turkish Standards:** Implement Turkish localization requirements from `@docs/reference/turkish-market-requirements.md`
3. **Test Turkish Content:** Validate Turkish character handling and text processing
4. **Mobile-First:** Test on Turkish mobile network conditions
5. **Interest-Gating:** Ensure all buyer-seller interactions follow interest-gating rules

## Migration Status

**Current Phase:** Architecture Planning Complete
**Next Phase:** Database migration from dual setup to Supabase-only
**Migration Guide:** See `@docs/business/migration-strategy.md` for detailed 14-day migration plan

## Testing Strategy

**Framework:** Jest + React Testing Library + Playwright
**Focus Areas:**
- Turkish text processing and search
- Interest-gating business logic
- Mobile responsive design
- Cross-browser Turkish character support
- API endpoint validation
- End-to-end user workflows

**Turkish-Specific Testing:**
- Turkish character encoding (çğıöşü)
- Turkish text search accuracy
- Turkish currency formatting
- Turkish mobile device compatibility