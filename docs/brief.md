# Project Brief: BanaYeni SanaEski

**Project:** Turkish Sustainable Parts Marketplace  
**Created:** August 6, 2025  
**Version:** 1.0  
**Status:** MVP Planning Phase  

## Executive Summary

BanaYeni SanaEski ("Old2You, New2Me") is a Turkish digital marketplace connecting automotive and machinery parts buyers with sellers, promoting circular economy principles. The platform serves as an "online junkyard" where users can find rare/discontinued parts and sell unused/broken parts for repair rather than scrapping.

**Core Value Exchange:**
- **Sellers:** Have non-functional products (cars, machinery, equipment) but want to sell the working spare parts/components from these items rather than scrapping the entire unit
- **Buyers:** Need specific missing parts to repair their own products and restore them to working condition  
- **Result:** Working components get a second life instead of ending up in landfills, while buyers can affordably restore their equipment

**MVP Focus:** Traffic-driven revenue model through Google Ads, with organic growth strategy targeting all of Turkey. The platform facilitates connections between buyers and sellers through interest-gated messaging, avoiding payment processing and shipping complications.

**Key Differentiators:**
- Interest-based communication gating (prevents spam)
- Smart exclusion logic (users won't see same items they marked "not interested")
- Self-reported part conditions with photo verification
- Focus on rare and discontinued parts not available elsewhere
- Higher margins for sellers compared to scrapping entire units
- Parts-specific marketplace (not general products like Sahibinden)

## Problem Statement

**Primary Problem:**
Turkey's automotive and machinery repair ecosystem suffers from inefficient parts sourcing and wasteful disposal practices. When equipment breaks down, owners face two poor options:

1. **Expensive OEM Parts:** New replacement parts are often costly or unavailable for older models
2. **Total Disposal:** Functioning components are scrapped along with broken ones, creating waste and lost value

**Market Inefficiencies:**
- **For Parts Buyers:** Difficulty finding specific components for older/discontinued models, leading to premature equipment replacement
- **For Parts Sellers:** No efficient marketplace to monetize working components from otherwise broken equipment
- **Environmental Impact:** Valuable materials and functioning parts end up in landfills unnecessarily
- **Economic Loss:** Both buyers and sellers miss opportunities for cost-effective solutions

**Current Alternatives & Their Limitations:**
- **Traditional Scrapyards:** Limited inventory visibility, location-dependent, no quality assurance
- **General Classifieds (Sahibinden):** Focused on complete products, not specialized for individual parts
- **WhatsApp Groups:** Fragmented, temporary, no systematic organization

## Proposed Solution

**BanaYeni SanaEski Digital Parts-Specific Marketplace Platform**

A specialized marketplace focused exclusively on automotive/machinery **parts** (not complete products), serving distinct customer needs based on part condition requirements.

**Core Solution Components:**

**1. Condition-Specific Parts Marketplace**
- **Individual Buyers:** Search for operating/functional parts for direct installation
- **Industrial Buyers (Remanufacturers):** Search for broken parts as raw materials for refurbishment
- Clear condition categorization: "Kullanılabilir" (Usable/Operating) vs "Arızalı" (Faulty/Broken)
- Photo documentation with detailed condition descriptions

**2. Interest-Gated Communication**
- Users must express explicit interest before accessing chat functionality
- Built-in async messaging system (email-style, not real-time)
- **"Not Interested" exclusion:** Prevents the same exact item from appearing again (not similar items, just that specific listing)

**3. Parts-Specialized Search & Discovery**
- Advanced filtering by part condition, location, price range, brand/model
- Focused on individual components rather than complete vehicles/machines
- Targets parts not readily available on general marketplaces like Sahibinden

**4. Differentiation from General Marketplaces**
- **Sahibinden focus:** Complete functional products
- **BanaYeni SanaEski focus:** Individual parts in both working and broken conditions
- **Unique value:** Connects part-specific supply with part-specific demand

**Technical Architecture:**
- **Frontend:** Next.js with TypeScript, TailwindCSS for responsive design
- **Backend:** Supabase-only architecture (migration from current dual-database)
- **Authentication:** Supabase Auth with email/password
- **Storage:** Supabase for part images and user data
- **Testing:** Jest framework for quality assurance

## Target Users

**Primary Customer Segments by Part Condition Needs:**

**Individual Buyers (Seeking Operating Parts)**
- **Profile:** Car owners, hobbyists, DIY mechanics
- **Need:** Functional parts ready for installation
- **Motivation:** Cost-effective repairs using working components
- **Example:** Car owner needs a working alternator, transmission part, or engine component

**Industrial Buyers (Seeking Broken Parts)**
- **Profile:** Remanufacturing companies, refurbishment specialists
- **Need:** Broken parts as raw materials for restoration/remanufacturing
- **Motivation:** Source damaged components at low cost for professional refurbishment
- **Example:** Transmission remanufacturer buys broken gearboxes to rebuild and resell

**Individual Sellers**
- **Profile:** People with broken equipment containing valuable working parts
- **Motivation:** Monetize functional components before scrapping the whole unit
- **Example:** Car with blown engine but working transmission, electronics, body parts

**Industrial Sellers**
- **Profile:** Scrapyards, dismantling centers with organized part inventory
- **Motivation:** Better margins selling parts individually vs. bulk scrap
- **Supply:** Both working and broken components from dismantled equipment

## Goals & Success Metrics

**3-Month MVP Launch Goals:**

**Traffic & Content Metrics:**
- 500+ active part listings across Turkey
- 1,000+ monthly unique visitors
- 50+ daily search queries
- Geographic coverage in major Turkish cities (Istanbul, Ankara, Izmir)

**Engagement Metrics:**
- 20% conversion rate from search to "interested" selection
- Average 3+ messages per successful buyer-seller connection
- 10+ new listings added weekly through organic growth

**Platform Health Metrics:**
- <2 second page load times
- 95%+ uptime for search and messaging functionality
- Zero payment disputes (since we don't process transactions)

**Revenue Foundation:**
- Google Ads integration successfully implemented
- Ad revenue covering basic hosting/operational costs
- Traffic quality suitable for ad monetization (high intent, specific searches)

**Technical Success Criteria:**
- Complete migration from dual-database to Supabase-only architecture
- Jest testing coverage for core functionality (search, messaging, interest system)
- Mobile-responsive design working across Turkish mobile carriers

## MVP Scope

**Core Features for MVP Launch:**

**Phase 1: Database & Infrastructure (Week 1-2)**
- Complete migration from SQL Server + Supabase to Supabase-only
- New schema: users, parts, interests, conversations, messages, user_preferences
- Connection management and environment variable setup

**Phase 2: Interest System (Week 3)**
- Interest buttons: "İlgiliyim" (Interested) / "İlgili Değilim" (Not Interested)
- Interest gating before chat access
- "Not interested" exclusion logic for same items only

**Phase 3: Async Messaging (Week 4)**
- Email-style messaging system (not real-time)
- Chat history persistence
- Message status indicators
- Basic file/image sharing for part details

**Phase 4: Testing Infrastructure (Week 5)**
- Jest testing setup and configuration
- Test coverage for interest system, search filtering, authentication flows
- Message delivery testing

**Features NOT in MVP:**
- Real-time messaging (Phase 2 post-launch)
- Payment processing
- Shipping coordination
- Advanced recommendation algorithms
- Partnership integrations
- Advanced analytics dashboard

## Post-MVP Vision

**Phase 2 Features (Months 4-6):**
- Real-time messaging upgrade based on user feedback
- Advanced search with AI-powered part matching
- Seller reputation system
- Mobile app development (iOS/Android)
- Enhanced photo recognition for part identification

**Phase 3 Features (Months 7-12):**
- Commission-based transaction system
- Premium seller subscriptions
- Partnership integrations with scrapyards
- Data insights and market analytics
- Geographic expansion beyond Turkey

## Technical Considerations

**Current Architecture Issues:**
- Dual database complexity (SQL Server + Supabase)
- No testing framework in place
- Limited mobile optimization

**MVP Technical Requirements:**
- **Database:** Single Supabase instance with comprehensive schema
- **Frontend:** Maintain Next.js 13.4.12 with TypeScript
- **Styling:** Continue with TailwindCSS
- **Testing:** Implement Jest with focus on core user flows
- **Performance:** Target <2 second page loads across Turkey
- **Mobile:** Responsive design for Turkish mobile users

**Infrastructure Decisions:**
- **Messaging:** Async system using standard HTTP requests (not WebSocket)
- **File Storage:** Supabase storage for part images
- **Authentication:** Maintain Supabase Auth
- **Analytics:** Google Analytics for ad optimization

## Constraints & Assumptions

**Business Constraints:**
- No payment processing in MVP (users handle transactions directly)
- No shipping coordination (local pickup or user-arranged delivery)
- Turkey-focused market (Turkish language interface)
- Organic growth strategy (no paid acquisition budget)

**Technical Constraints:**
- Migration from existing dual-database must not lose current user data
- Maintain existing Next.js Pages Router (not App Router)
- Turkish language interface and error messages

**Key Assumptions:**
- Users will accept async messaging for parts negotiations
- Self-reported part conditions with photos are sufficient for MVP
- Google Ads revenue can support basic operational costs
- Turkish market has sufficient demand for parts-specific marketplace

## Risks & Open Questions

**Technical Risks:**
- Database migration complexity and potential data loss
- Performance issues with Supabase at scale
- Mobile experience on Turkish cellular networks

**Business Risks:**
- Competition response from established players (Sahibinden)
- User adoption without real-time messaging features
- Insufficient inventory for sustainable marketplace dynamics

**Open Questions:**
- Should we implement part number/VIN identification systems?
- How to handle counterfeit or misrepresented parts?
- When to introduce seller verification mechanisms?
- Optimal timing for mobile app development?

## Next Steps

**Immediate Actions (Week 1):**
1. Finalize database migration plan and backup strategy
2. Create detailed technical specifications for Supabase schema
3. Set up development environment with Jest testing
4. Define user acceptance criteria for interest system

**Development Roadmap:**
1. **Weeks 1-2:** Complete Supabase migration
2. **Week 3:** Implement interest-gated communication system
3. **Week 4:** Build async messaging functionality
4. **Week 5:** Establish comprehensive testing coverage
5. **Week 6:** Beta testing with select Turkish users
6. **Week 7-8:** Launch MVP and monitor core metrics

**Success Validation:**
- Weekly progress reviews against MVP metrics
- User feedback collection through built-in messaging system
- Google Analytics implementation for traffic optimization
- Monthly business review for revenue and growth assessment

---

*This project brief establishes the strategic foundation and technical roadmap for BanaYeni SanaEski MVP development. The focus on parts-specific marketplace with interest-gated communication positions the platform uniquely in the Turkish automotive parts ecosystem.*