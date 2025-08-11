# Epic 2: Wanted Listings & Notification System

**Epic Goal:** Implement the core differentiating feature of the platform - the ability for buyers to create wanted listings and receive instant notifications when matching parts become available. This creates the demand-driven marketplace that connects buyers with sellers efficiently.

## Story 2.1: Wanted Listing Creation Flow

As a buyer looking for specific parts,
I want to create a wanted listing with my requirements,
so that sellers with matching inventory can be notified and contact me.

### Acceptance Criteria

1: Wanted listing form with two paths: reference code entry OR vehicle selection (make/model/year) + part name
2: Optional fields: max price willing to pay, preferred condition (working/broken/either), location preference
3: Listing duration selection: 7 days, 14 days, 30 days with automatic expiration
4: Preview screen showing how the wanted listing will appear to sellers
5: Ability to create multiple wanted listings with a reasonable limit (10 active per user)
6: My Wanted Listings page showing all active/expired listings with renewal options
7: Form remembers recent vehicle selections for faster subsequent listings

## Story 2.2: Seller Notification System

As a seller with inventory,
I want to receive instant notifications when buyers want parts I might have,
so that I can quickly respond and make sales.

### Acceptance Criteria

1: Real-time notification when wanted listing matches seller's vehicle listings (by make/model/year)
2: Real-time notification when wanted listing reference code matches seller's part listings
3: Notification includes: buyer's requirements, max price if specified, listing duration
4: Notification center/inbox showing all received notifications with unread indicators
5: Email/SMS notification options with user preference settings
6: Ability to dismiss irrelevant notifications to train the matching algorithm
7: Notification relevance scoring to prioritize most likely matches

## Story 2.3: Buyer Notification System  

As a buyer who created a wanted listing,
I want to be notified when sellers have matching parts,
so that I can quickly secure the parts I need.

### Acceptance Criteria

1: Real-time notification when new part listings match wanted listing criteria
2: Real-time notification when new vehicle listings match wanted listing vehicle specs
3: Notification shows seller info, part details, price, and location
4: Direct link from notification to view full listing details
5: Notification preferences: instant, daily digest, or weekly summary
6: Ability to mark wanted listing as fulfilled to stop notifications
7: Smart deduplication to prevent notification spam from same seller

## Story 2.4: Bidirectional Matching Engine

As a platform operator,
I want an efficient matching system that connects wanted listings with inventory,
so that both buyers and sellers receive relevant notifications.

### Acceptance Criteria

1: Background job processes new wanted listings against existing inventory within 60 seconds
2: Background job processes new inventory listings against active wanted listings
3: Matching logic: exact reference code match OR (make + model + year range + part category)
4: Relevance scoring based on: location proximity, price match, condition match, seller rating
5: Notification delivery tracking with success/failure metrics
6: Prevented duplicate notifications for same buyer-seller-part combination
7: Database indexes optimized for fast matching queries on reference codes and vehicle specs

## Story 2.5: Communication Initiation

As a notified user (buyer or seller),
I want to easily start communication with the other party,
so that we can negotiate and complete the transaction.

### Acceptance Criteria

1: "Start Chat" button prominently displayed in notification interface
2: Chat initiation creates a conversation thread between buyer and seller
3: Initial message template provided with listing details for context
4: Both parties can access chat history from their dashboard
5: Unread message indicators and notification badges
6: Basic message features: text, emoji support, typing indicators
7: Chat list showing all active conversations with last message preview
