# BanaYeni SanaEski Product Requirements Document (PRD)

## Goals and Background Context

### Goals

- Enable cost-effective automobile maintenance by connecting spare parts buyers with sellers through AI-enhanced reference-code matching
- Monetize valuable parts from accident-damaged and scrap vehicles that would otherwise be wasted
- Create supply-demand connections through targeted notifications to reduce inventory holding costs for sellers
- Provide access to rare and hard-to-find automotive parts at 50-75% savings compared to OEM alternatives
- Establish market leadership in AI-powered automotive parts matching in the Turkish market
- Build a sustainable circular economy platform that generates revenue through dual-value monetization

### Background Context

BanaYeni SanaEski addresses critical inefficiencies in the automobile parts market where functional components from accident-damaged vehicles are scrapped entirely, and owners of vehicles with 100K+ km face prohibitive OEM part costs. The platform leverages AI-powered visual recognition and vehicle compatibility mapping to create a specialized marketplace that connects buyers needing specific parts with sellers who have matching inventory. By focusing on reference-code precision and instant notification systems, the platform creates immediate value for both industrial sellers (scrapyards) who gain demand visibility and individual buyers who access otherwise unavailable parts at significant cost savings.

### Change Log

| Date | Version | Description | Author |
|------|---------|-------------|--------|
| 2025-08-08 | 1.0 | Initial PRD creation | PM John |

## Requirements

### Functional

- FR1: The platform uses AI-powered image recognition to extract mandatory automotive part reference codes from uploaded photographs with confidence scoring for individual part listings
- FR2: Buyers can create wanted listings using either reference codes or vehicle specifications (make/model/year)
- FR3: The platform instantly notifies relevant sellers when parts matching their inventory are requested through wanted listings
- FR4: The AI compatibility engine maps reference codes to all compatible vehicles to ensure notifications reach only relevant sellers
- FR5: Sellers can list complete vehicles for dismantling (no reference code required, only brand/model/year and description) OR individual spare parts (reference code mandatory)
- FR6: The platform provides differentiated interfaces for individual users (brand/model specific) and industrial users (product/component specific)
- FR7: The system implements trust verification including user authentication, listing quality control, and automated fraud detection
- FR8: The platform tracks notification delivery, engagement metrics, and conversion rates for optimization
- FR9: Users can search for parts using reference codes, vehicle specifications
- FR10: Platform enables direct chat communication between matched buyers and sellers after notification

### Non Functional

- NFR1: AI reference code recognition must achieve 90%+ accuracy in MVP, targeting 95%+ for production
- NFR2: Notification delivery must occur within 60 seconds of wanted listing creation
- NFR3: API response times must be <200ms for search operations and <500ms for AI processing
- NFR4: The platform must support Turkish language UI with proper automotive terminology localization
- NFR5: System must handle concurrent usage by 50+ industrial sellers without performance degradation
- NFR6: All user data must be encrypted at rest and in transit with GDPR compliance
- NFR7: Platform must maintain 99.9% uptime during business hours (8am-8pm Turkey time)
- NFR8: Mobile responsive design must support all features on devices 375px width and above

## User Interface Design Goals

### Overall UX Vision

The platform delivers a trust-first, efficiency-focused experience that bridges the technical gap between professional automotive users and individual sellers/buyers. The interface emphasizes visual communication through photos over technical jargon, with AI assistance seamlessly integrated to handle reference code complexities. The design philosophy centers on reducing friction in the listing and matching process while building confidence through transparency and social proof.

### Key Interaction Paradigms

- **Progressive Disclosure:** Complex features like reference codes are hidden from casual users but readily available for professionals
- **Visual-First Listings:** Photos are primary, with technical details supporting rather than leading
- **Instant Gratification:** Real-time notifications and immediate chat access create momentum in transactions
- **Guided Flows:** Step-by-step processes for listing creation with AI assistance at friction points
- **Trust Indicators:** Seller ratings, verification badges, and transaction history visible throughout

### Core Screens and Views

- **Home/Search Screen** - Combined search and browse interface with quick filters for parts vs vehicles
- **Listing Creation Wizard** - Separate flows for vehicles (simple) vs parts (detailed with AI assistance)  
- **Wanted Listing Creation** - Smart form that adapts based on user knowledge (reference code vs vehicle selection)
- **Notification Center** - Real-time updates on matches with direct actions to view listing or start chat
- **Chat Interface** - In-app messaging with photo sharing and quick actions for price negotiation
- **Seller Dashboard** - Analytics, inventory management, and notification preferences for industrial users
- **Part Details Page** - Photos gallery, specifications, seller info, and prominent contact actions
- **My Listings** - Management interface for active listings, with edit/pause/delete capabilities

### Accessibility: WCAG AA

### Branding

Clean, professional automotive aesthetic with trust-building elements. Color palette should convey reliability and technical competence while remaining approachable for non-technical users. Visual hierarchy emphasizes photos and key information (price, location, condition) over technical specifications.

### Target Device and Platforms: Web Responsive, and all mobile platforms

## Technical Assumptions

### Repository Structure: Monorepo

All code (frontend, backend, AI services) will be maintained in a single repository to simplify deployment, share types/utilities, and ensure atomic updates across the full stack.

### Service Architecture

**CRITICAL DECISION** - The platform will be built as a monolithic Next.js application with serverless functions for AI processing. This provides:
- Simplified deployment via Vercel
- Built-in API routes for backend logic
- Serverless scaling for AI workloads
- Shared authentication context
- Lower operational complexity for MVP

### Testing Requirements

**CRITICAL DECISION** - Testing strategy will follow:
- Unit tests for critical business logic (matching algorithms, notification targeting)
- Integration tests for API endpoints and database operations  
- Manual testing workflows for UI/UX flows
- AI model validation tests with sample automotive images
- Performance tests for notification delivery times

### Additional Technical Assumptions and Requests

- **Frontend Framework:** Next.js 13.4+ with App Router for modern React patterns and built-in optimizations
- **UI Library:** TailwindCSS for rapid development with responsive design utilities built-in
- **Database:** Supabase PostgreSQL for complex relational queries, real-time capabilities, and built-in auth
- **AI Services:** Google Vision API for OCR with fallback to Azure Cognitive Services for redundancy
- **State Management:** React Query for server state, Zustand for client state (lightweight, TypeScript-friendly)
- **Image Storage:** Supabase Storage with CDN for part photos, automatic optimization
- **Notifications:** Supabase Realtime for instant push, with email/SMS fallback via SendGrid/Twilio
- **Deployment:** Vercel for frontend and serverless functions, Supabase cloud for backend services
- **Monitoring:** Sentry for error tracking, PostHog for user analytics, custom dashboards for business metrics
- **Development Tools:** TypeScript for type safety, ESLint/Prettier for code quality, GitHub Actions for CI/CD
- **Caching Strategy:** Redis for reference code lookups and AI results caching to reduce API costs
- **Mobile Strategy:** Progressive Web App initially, React Native planned for native features post-MVP

## Epic List

- **Epic 1: Foundation & Core Marketplace Infrastructure:** Establish project setup with Next.js/Supabase, implement basic user authentication, create vehicle/part listing capabilities, and deliver simple search functionality with a basic health check endpoint

- **Epic 2: Wanted Listings & Notification System:** Build the wanted listing creation flow for buyers, implement real-time notification dispatch to matching sellers, create notification management interface, and establish bidirectional communication between matched parties

- **Epic 3: AI-Powered Reference Code Recognition:** Integrate Google Vision API for image processing, build reference code extraction from part photos, implement confidence scoring and validation, and create fallback flows for manual entry when AI recognition fails

- **Epic 4: Trust, Quality & User Communication:** Implement user verification system, build seller ratings and feedback mechanisms, create in-app chat system for buyer-seller communication, and establish automated quality control for listings

## Epic 1: Foundation & Core Marketplace Infrastructure

**Epic Goal:** Establish the technical foundation and core marketplace functionality that enables users to list vehicles/parts and search for them. This epic delivers a minimal but functional marketplace where sellers can create listings and buyers can discover them through search, setting the groundwork for all advanced features.

### Story 1.1: Project Setup and Infrastructure

As a development team,
I want a properly configured Next.js application with Supabase integration,
so that we have a solid foundation for building marketplace features.

#### Acceptance Criteria

1: Next.js 13.4+ application initialized with TypeScript, App Router, and proper folder structure
2: Supabase project created with authentication, database, and storage buckets configured
3: Environment variables properly set up for local development and production
4: Basic CI/CD pipeline configured with GitHub Actions for automated testing and deployment
5: Health check endpoint at /api/health returning platform status and version
6: Error tracking (Sentry) and analytics (PostHog) integrated with basic event capture
7: README updated with setup instructions and architecture overview

### Story 1.2: User Authentication and Profile Management

As a user (buyer or seller),
I want to create an account and manage my profile,
so that I can participate in the marketplace with a verified identity.

#### Acceptance Criteria

1: User registration with email/password and phone number verification
2: Social login options (Google, Facebook) for easier onboarding
3: User profile page with editable fields: name, phone, location (city), profile photo
4: Account type selection: Individual or Industrial (Business) with appropriate fields
5: Password reset functionality via email
6: Session management with secure JWT tokens and proper expiration
7: Profile data stored in Supabase with proper Row Level Security policies

### Story 1.3: Vehicle Listing Creation and Management

As a seller,
I want to list my complete vehicle for parts extraction,
so that interested buyers can be notified when I have matching parts.

#### Acceptance Criteria

1: Vehicle listing form with fields: make (brand), model, year, description, photos (up to 10)
2: Dynamic dropdown selection for make > model > year using Turkish automotive database
3: Rich text description field for damage details and available parts information
4: Multi-photo upload with drag-and-drop support and image optimization
5: Listing status management: active, paused, sold, deleted
6: My Listings page showing all user's vehicle listings with edit/delete actions
7: Form validation ensuring all required fields are completed before submission

### Story 1.4: Individual Part Listing Creation

As a seller with spare parts,
I want to list individual parts with reference codes,
so that buyers can find exactly what they need.

#### Acceptance Criteria

1: Part listing form with fields: make, model, year, part name, reference code (required), condition (working/broken), price, photos
2: Reference code field with format validation and duplicate checking
3: Condition selector limited to "Working" or "Broken" options
4: Price field with Turkish Lira formatting and reasonable min/max validation
5: Part category selection to improve searchability
6: Inventory quantity management for sellers with multiple identical parts
7: Ability to link part listing to an existing vehicle listing if applicable

### Story 1.5: Search and Browse Functionality

As a buyer,
I want to search and browse available parts and vehicles,
so that I can find what I need for my repairs.

#### Acceptance Criteria

1: Search bar accepting text queries for part names, reference codes, or vehicle details
2: Filter sidebar with options: make/model/year, condition, price range, location, listing type (vehicle/part)
3: Search results displaying photo thumbnails, title, price, location, and seller verification status
4: Sorting options: price (low to high, high to low), date listed, distance from user
5: Pagination or infinite scroll for large result sets
6: Quick view modal showing listing details without leaving search results
7: SEO-friendly URLs for search results to improve discoverability

## Epic 2: Wanted Listings & Notification System

**Epic Goal:** Implement the core differentiating feature of the platform - the ability for buyers to create wanted listings and receive instant notifications when matching parts become available. This creates the demand-driven marketplace that connects buyers with sellers efficiently.

### Story 2.1: Wanted Listing Creation Flow

As a buyer looking for specific parts,
I want to create a wanted listing with my requirements,
so that sellers with matching inventory can be notified and contact me.

#### Acceptance Criteria

1: Wanted listing form with two paths: reference code entry OR vehicle selection (make/model/year) + part name
2: Optional fields: max price willing to pay, preferred condition (working/broken/either), location preference
3: Listing duration selection: 7 days, 14 days, 30 days with automatic expiration
4: Preview screen showing how the wanted listing will appear to sellers
5: Ability to create multiple wanted listings with a reasonable limit (10 active per user)
6: My Wanted Listings page showing all active/expired listings with renewal options
7: Form remembers recent vehicle selections for faster subsequent listings

### Story 2.2: Seller Notification System

As a seller with inventory,
I want to receive instant notifications when buyers want parts I might have,
so that I can quickly respond and make sales.

#### Acceptance Criteria

1: Real-time notification when wanted listing matches seller's vehicle listings (by make/model/year)
2: Real-time notification when wanted listing reference code matches seller's part listings
3: Notification includes: buyer's requirements, max price if specified, listing duration
4: Notification center/inbox showing all received notifications with unread indicators
5: Email/SMS notification options with user preference settings
6: Ability to dismiss irrelevant notifications to train the matching algorithm
7: Notification relevance scoring to prioritize most likely matches

### Story 2.3: Buyer Notification System  

As a buyer who created a wanted listing,
I want to be notified when sellers have matching parts,
so that I can quickly secure the parts I need.

#### Acceptance Criteria

1: Real-time notification when new part listings match wanted listing criteria
2: Real-time notification when new vehicle listings match wanted listing vehicle specs
3: Notification shows seller info, part details, price, and location
4: Direct link from notification to view full listing details
5: Notification preferences: instant, daily digest, or weekly summary
6: Ability to mark wanted listing as fulfilled to stop notifications
7: Smart deduplication to prevent notification spam from same seller

### Story 2.4: Bidirectional Matching Engine

As a platform operator,
I want an efficient matching system that connects wanted listings with inventory,
so that both buyers and sellers receive relevant notifications.

#### Acceptance Criteria

1: Background job processes new wanted listings against existing inventory within 60 seconds
2: Background job processes new inventory listings against active wanted listings
3: Matching logic: exact reference code match OR (make + model + year range + part category)
4: Relevance scoring based on: location proximity, price match, condition match, seller rating
5: Notification delivery tracking with success/failure metrics
6: Prevented duplicate notifications for same buyer-seller-part combination
7: Database indexes optimized for fast matching queries on reference codes and vehicle specs

### Story 2.5: Communication Initiation

As a notified user (buyer or seller),
I want to easily start communication with the other party,
so that we can negotiate and complete the transaction.

#### Acceptance Criteria

1: "Start Chat" button prominently displayed in notification interface
2: Chat initiation creates a conversation thread between buyer and seller
3: Initial message template provided with listing details for context
4: Both parties can access chat history from their dashboard
5: Unread message indicators and notification badges
6: Basic message features: text, emoji support, typing indicators
7: Chat list showing all active conversations with last message preview

## Epic 3: AI-Powered Reference Code Recognition

**Epic Goal:** Integrate AI-powered image recognition to automatically extract reference codes from part photos, making it easier for non-technical sellers to list parts accurately. This removes the technical barrier of knowing reference codes while maintaining the precision that makes our matching system valuable.

### Story 3.1: Google Vision API Integration

As a platform developer,
I want to integrate Google Vision API for OCR capabilities,
so that we can extract text from automotive part images.

#### Acceptance Criteria

1: Google Cloud account setup with Vision API enabled and API keys configured
2: Serverless function endpoint that accepts image uploads and returns OCR results
3: Support for common image formats: JPEG, PNG, WebP with max size 10MB
4: Response includes all detected text with bounding box coordinates
5: Error handling for API limits, network failures, and invalid images
6: Fallback to Azure Cognitive Services if Google API fails
7: API response caching to avoid duplicate processing of same images

### Story 3.2: Reference Code Pattern Recognition

As a seller uploading part photos,
I want the system to identify and extract reference codes from the detected text,
so that I don't have to manually type complex codes.

#### Acceptance Criteria

1: Pattern matching algorithm that identifies automotive reference code formats
2: Support for major manufacturer code patterns (alphanumeric combinations)
3: Confidence scoring for each detected reference code (0-100%)
4: Handle multiple potential codes in single image with ranking
5: Validation against known reference code database when available
6: Special handling for commonly confused characters (0/O, 1/I, etc.)
7: Return top 3 most likely reference codes for user selection

### Story 3.3: AI-Assisted Part Listing Flow

As a seller listing individual parts,
I want AI assistance to identify reference codes from photos,
so that I can list parts accurately without technical knowledge.

#### Acceptance Criteria

1: "Scan Reference Code" button in part listing form triggers camera/upload
2: Loading state while AI processes image with progress indication
3: Display extracted reference codes with confidence scores for user selection
4: Allow manual editing of AI-suggested reference codes
5: "Try Another Photo" option if results are unsatisfactory
6: Guidance overlay showing where to find reference codes on common parts
7: Success/failure metrics tracked for continuous improvement

### Story 3.4: Bulk Reference Code Extraction

As an industrial seller with many parts,
I want to upload multiple photos and extract reference codes in batch,
so that I can efficiently list large inventories.

#### Acceptance Criteria

1: Batch upload interface accepting up to 20 images simultaneously
2: Progress bar showing processing status for each image
3: Results table showing image thumbnail, extracted codes, and confidence
4: Ability to assign each code to a new part listing with one click
5: Export results to CSV for inventory management
6: Pause/resume capability for large batch processing
7: Automatic retry for failed images with exponential backoff

### Story 3.5: AI Confidence and Manual Override

As a platform user,
I want transparency about AI accuracy and ability to correct errors,
so that I can trust the system while maintaining control.

#### Acceptance Criteria

1: Confidence scores displayed as visual indicators (green >90%, yellow 70-90%, red <70%)
2: "Report Incorrect Code" button to flag AI errors for improvement
3: Manual reference code entry always available as primary option
4: AI suggestions appear as optional assistance, not mandatory step
5: User corrections stored to improve future recognition accuracy
6: Monthly accuracy reports available for industrial sellers
7: Tooltip explanations for how confidence scores are calculated

## Epic 4: Trust, Quality & User Communication

**Epic Goal:** Build comprehensive trust and communication systems that give users confidence to transact on the platform. This includes user verification, rating systems, quality control mechanisms, and robust in-app communication tools that keep transactions safe and transparent.

### Story 4.1: User Verification System

As a marketplace user,
I want to know that other users are verified and trustworthy,
so that I can transact with confidence.

#### Acceptance Criteria

1: Phone number verification via SMS with 6-digit code during registration
2: Optional ID verification for "Verified Seller" badge (Turkish ID number validation)
3: Business verification for industrial sellers (tax number, business license)
4: Verification badges displayed on profiles and listings
5: Different badge types: Phone Verified, ID Verified, Business Verified
6: Verification status affects search ranking and visibility
7: Re-verification required if phone number or critical details change

### Story 4.2: Rating and Review System

As a buyer or seller,
I want to rate and review my transaction experience,
so that future users can make informed decisions.

#### Acceptance Criteria

1: Post-transaction rating prompt (1-5 stars) with optional text review
2: Separate ratings for: Communication, Accuracy, Transaction Speed
3: Reviews visible on user profiles with aggregate scores
4: Ability to respond to reviews as seller (one response per review)
5: Review moderation for inappropriate content with automated flagging
6: Minimum character requirement (50) for written reviews to ensure quality
7: Historical rating trends displayed on seller profiles

### Story 4.3: Listing Quality Control

As a platform operator,
I want automated quality control for listings,
so that the marketplace maintains high standards and prevents fraud.

#### Acceptance Criteria

1: Automated detection of stock/duplicate images using image hashing
2: Reference code validation against known patterns and database
3: Price anomaly detection (too high/low compared to similar parts)
4: Prohibited content detection (non-automotive items, inappropriate content)
5: Automatic flagging of suspicious listings for manual review
6: Three-strike policy for quality violations with automated enforcement
7: Quality score affecting listing visibility and search ranking

### Story 4.4: Enhanced Chat System

As a user engaged in negotiation,
I want rich communication features,
so that I can effectively discuss and finalize transactions.

#### Acceptance Criteria

1: Real-time messaging with delivery and read receipts
2: Photo sharing within chat (up to 5 photos per message)
3: Voice message support (up to 60 seconds) for detailed explanations
4: Location sharing for pickup coordination
5: Price offer feature with accept/reject/counter buttons
6: Chat translation option between Turkish and other languages
7: 30-day chat history with search functionality

### Story 4.5: Transaction Safety Features

As a platform user,
I want safety features during transactions,
so that I can avoid scams and problematic users.

#### Acceptance Criteria

1: "Report User" button in chat with categorized reasons
2: Automated detection of suspicious behavior (spam, phishing attempts)
3: Block user functionality preventing future contact
4: Safety tips displayed before first transaction
5: Escrow payment information and recommendations (external service links)
6: Transaction completion confirmation with mutual acknowledgment
7: Post-transaction survey to identify safety issues