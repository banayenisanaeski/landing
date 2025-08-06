# Glossary - BanaYeni SanaEski

**Document Type:** Comprehensive Technical and Business Terminology Reference  
**Created:** August 6, 2025  
**Version:** 1.0  
**Status:** Complete Reference Guide  

---

## Glossary Overview

This glossary provides comprehensive definitions of technical terms, business concepts, Turkish market terminology, and automotive industry terms used throughout the BanaYeni SanaEski documentation and platform development.

**Purpose:** Standardized terminology for all stakeholders  
**Scope:** Technical, business, automotive, and Turkish market terms  
**Audience:** Developers, business stakeholders, and Turkish market experts  
**Usage:** Reference for documentation, code comments, and communication  

---

## Technical Terms

### A

**API (Application Programming Interface)**  
A set of protocols and tools for building software applications. In BanaYeni SanaEski context, refers to RESTful endpoints for part search, user management, and interest expression.

**Authentication**  
The process of verifying user identity. BanaYeni SanaEski uses Supabase Auth with support for email/password, social login (Google, Facebook), and Turkish phone number verification.

**Agglutination**  
Turkish language characteristic where words are formed by adding suffixes. Critical for implementing Turkish text search and processing algorithms.

### B

**Business Logic**  
Core rules and processes that define how the Turkish automotive marketplace operates, including interest-gating, seller verification, and part authenticity validation.

**Bundle Splitting**  
Code optimization technique used in Next.js to split JavaScript bundles for faster loading on Turkish mobile networks.

### C

**Circuit Breaker**  
Software design pattern that prevents cascading failures by stopping requests to a failing service. Essential for maintaining service reliability in the Turkish market.

**CDN (Content Delivery Network)**  
Network of distributed servers that deliver web content to users based on geographic location. Critical for serving Turkish users with optimal performance.

**Collation**  
Database setting that determines how text is sorted and compared. Turkish collation (tr_TR.UTF-8) is required for proper Turkish text handling.

**CORS (Cross-Origin Resource Sharing)**  
Web standard that allows web pages to access resources from other domains. Configured to allow Turkish domain access to API endpoints.

### D

**Database Migration**  
Process of moving data from SQL Server + Supabase dual setup to Supabase-only architecture while preserving Turkish text encoding and business logic.

**Diacritics**  
Marks added to letters (like Turkish ç, ğ, ı, ö, ş, ü). Critical for Turkish text processing and search functionality.

### E

**Edge Functions**  
Server-side code that runs at the network edge, closer to users. Used for Turkish text processing and performance optimization.

**Environment Variables**  
Configuration values stored outside code (database URLs, API keys, Turkish-specific settings) for security and flexibility.

### F

**Fallback Mechanism**  
Backup system that activates when primary system fails. Essential for maintaining service during Turkish peak hours or network issues.

**Full-Text Search**  
Database feature for searching text content. Implemented with PostgreSQL's Turkish language configuration for automotive part searches.

### G

**Graceful Degradation**  
Design approach where system maintains basic functionality when advanced features fail. Critical for Turkish mobile network conditions.

**GraphQL**  
Query language for APIs that allows clients to request specific data. Alternative to REST APIs for complex data relationships.

### H

**Hot Module Replacement (HMR)**  
Development feature that updates code without full page reload. Accelerates Turkish marketplace feature development.

**HTTP Status Codes**  
Standard response codes from web servers (200 OK, 404 Not Found, 500 Server Error). All error messages localized in Turkish.

### I

**Internationalization (i18n)**  
Process of designing software for multiple languages and regions. BanaYeni SanaEski primarily focuses on Turkish localization.

**Idempotency**  
Property where repeated operations have same result. Important for preventing duplicate interest expressions or part listings.

### J

**JWT (JSON Web Token)**  
Secure method for transmitting user authentication information. Used by Supabase Auth for Turkish user session management.

**JIT (Just-In-Time)**  
Compilation or processing that happens at runtime. Used in Next.js for optimal performance on Turkish networks.

### K

**KVKK (Kişisel Verilerin Korunması Kanunu)**  
Turkish data protection law equivalent to GDPR. Mandatory compliance for handling Turkish user personal data.

### L

**Lazy Loading**  
Technique of loading content only when needed. Critical for optimizing performance on Turkish mobile networks.

**Load Balancer**  
System that distributes network traffic across multiple servers. Essential for handling Turkish traffic spikes.

### M

**Middleware**  
Software layer between operating system and applications. Used in Next.js for authentication, Turkish localization, and request processing.

**Migration Script**  
Code that updates database structure or moves data. Used for transitioning from dual-database to Supabase-only architecture.

### N

**Normalization (Text)**  
Process of converting text to standard form. Critical for Turkish character handling (ç→c, ğ→g) in search functionality.

**Next.js**  
React framework for production web applications. Chosen for BanaYeni SanaEski for its performance and SEO capabilities.

### O

**OEM (Original Equipment Manufacturer)**  
Company that produces parts for original vehicle assembly. Important distinction in Turkish automotive parts market.

**Optimization**  
Process of improving performance or efficiency. Critical for Turkish mobile network conditions and user experience.

### P

**PostgreSQL**  
Open-source relational database system. Used by Supabase with Turkish language extensions for text search.

**PWA (Progressive Web App)**  
Web application that functions like native mobile app. Future consideration for BanaYeni SanaEski Turkish mobile users.

### Q

**Query Optimization**  
Process of improving database query performance. Essential for fast Turkish text search and part filtering.

**Queue System**  
Method of managing background tasks or message processing. Used for handling interest notifications and email delivery.

### R

**Rate Limiting**  
Technique to control request frequency to prevent abuse. Implemented to prevent spam in Turkish interest-gating system.

**Responsive Design**  
Web design approach that adapts to different screen sizes. Critical for Turkish mobile-first user experience.

**Row Level Security (RLS)**  
Database security feature that restricts data access based on user context. Used in Supabase for Turkish user data protection.

### S

**SSR (Server-Side Rendering)**  
Technique where web pages are rendered on server before sending to browser. Used in Next.js for SEO and Turkish market performance.

**Supabase**  
Open-source Firebase alternative providing database, authentication, and storage. Primary backend for BanaYeni SanaEski.

### T

**TypeScript**  
Strongly typed programming language that builds on JavaScript. Used for better code quality and Turkish market feature development.

**Throttling**  
Technique to limit rate of operations. Used to prevent overwhelming Turkish mobile networks or third-party APIs.

### U

**UUID (Universally Unique Identifier)**  
128-bit unique identifier. Used for part IDs, user IDs, and interest records in BanaYeni SanaEski database.

**UTF-8**  
Character encoding standard that supports Turkish characters (çğıöşü). Mandatory for all text processing and storage.

### V

**Validation**  
Process of checking data correctness. Includes Turkish phone format, city names, and automotive part reference validation.

**Vercel**  
Platform for deploying web applications. Chosen for BanaYeni SanaEski for its global CDN and Turkish performance optimization.

### W

**Webhook**  
HTTP callback triggered by events. Used for real-time notifications between BanaYeni SanaEski and third-party services.

**WebP**  
Modern image format with better compression. Used for optimizing part images for Turkish mobile networks.

---

## Business and Marketing Terms

### A

**Acquisition Cost**  
Cost to acquire new Turkish users through marketing channels. Tracked separately for buyers and sellers.

**Automotive Aftermarket**  
Market for automotive parts, equipment, and services after vehicle sale. Primary market for BanaYeni SanaEski.

### B

**B2B (Business-to-Business)**  
Commerce between businesses. BanaYeni SanaEski serves B2B sellers like auto shops and parts dealers.

**B2C (Business-to-Consumer)**  
Commerce between business and individual consumers. BanaYeni SanaEski serves individual car owners seeking parts.

**Brand Loyalty**  
Customer preference for specific automotive brands. Important factor in Turkish automotive parts market.

### C

**Churn Rate**  
Percentage of users who stop using platform over time. Critical metric for BanaYeni SanaEski user retention.

**Commission**  
Fee charged for facilitating transactions. BanaYeni SanaEski's primary revenue source from successful parts sales.

**Conversion Rate**  
Percentage of visitors who complete desired action (registration, listing, interest expression). Key performance metric.

**Customer Lifetime Value (CLV)**  
Predicted total revenue from customer relationship. Important for Turkish market investment decisions.

### D

**Direct Message (DM)**  
Private communication between users. In BanaYeni SanaEski context, refers to buyer-seller communication after interest approval.

**Drop Shipping**  
Retail method where seller doesn't keep inventory. Some Turkish automotive parts sellers use this model.

### E

**E-commerce**  
Electronic commerce conducted over internet. BanaYeni SanaEski operates in Turkish automotive e-commerce market.

**Engagement Rate**  
Measure of user interaction with platform features. Tracked for Turkish user behavior analysis.

### F

**Freemium Model**  
Business model with free basic features and paid premium features. Potential future monetization for BanaYeni SanaEski.

**Funnel Analysis**  
Analysis of user journey through conversion stages. Used to optimize Turkish user experience and conversion rates.

### G

**GMV (Gross Merchandise Value)**  
Total value of transactions on platform. Primary business metric for BanaYeni SanaEski marketplace performance.

**Growth Hacking**  
Marketing techniques focused on rapid growth. Used for Turkish market penetration and user acquisition.

### I

**Interest-Gating**  
BanaYeni SanaEski's unique system requiring seller approval before buyer contact. Prevents spam and improves match quality.

### L

**Lead Generation**  
Process of attracting potential customers. BanaYeni SanaEski generates leads for Turkish automotive parts sellers.

**Lifetime Value to Customer Acquisition Cost (LTV:CAC)**  
Ratio measuring business sustainability. Critical metric for Turkish market investment decisions.

### M

**Marketplace Model**  
Platform that connects buyers and sellers. BanaYeni SanaEski's core business model for Turkish automotive parts.

**Monthly Active Users (MAU)**  
Number of unique users active within 30-day period. Key metric for Turkish market penetration success.

**Monetization**  
Process of generating revenue from platform. BanaYeni SanaEski primarily through transaction commissions and advertising.

### N

**Network Effect**  
Phenomenon where service value increases with more users. Critical for BanaYeni SanaEski marketplace growth in Turkey.

**NPS (Net Promoter Score)**  
Customer loyalty metric based on likelihood to recommend. Important for measuring Turkish user satisfaction.

### O

**Onboarding**  
Process of introducing new users to platform. Critical for Turkish user adoption and platform success.

**OEM Parts**  
Original Equipment Manufacturer parts. Premium category in Turkish automotive aftermarket.

### P

**Price Discovery**  
Process of determining fair market price. BanaYeni SanaEski facilitates price discovery for Turkish automotive parts.

**Product-Market Fit**  
Degree to which product satisfies strong market demand. BanaYeni SanaEski seeks strong fit in Turkish automotive market.

### R

**Retention Rate**  
Percentage of users who continue using platform over time. Critical for long-term success in Turkish market.

**Revenue Sharing**  
Model where platform takes percentage of transaction value. Primary monetization strategy for BanaYeni SanaEski.

### S

**Scalability**  
Ability to handle growing user base without performance degradation. Critical for Turkish market expansion.

**SEO (Search Engine Optimization)**  
Techniques to improve search engine rankings. Important for organic Turkish user acquisition.

**Stickiness**  
Measure of user engagement and return frequency. Important for Turkish marketplace platform success.

### T

**Total Addressable Market (TAM)**  
Total market demand for Turkish automotive parts. Used for business planning and investor discussions.

**Transaction Volume**  
Number of completed transactions on platform. Key business metric for BanaYeni SanaEski growth.

### U

**User-Generated Content (UGC)**  
Content created by platform users. In BanaYeni SanaEski: part listings, photos, reviews, and descriptions.

**Upselling**  
Technique to sell higher-value products to existing customers. Future opportunity for premium seller services.

### V

**Viral Coefficient**  
Measure of how many new users each existing user brings. Important for organic growth in Turkish market.

**Value Proposition**  
Benefit promised to customers. BanaYeni SanaEski's value: simplified Turkish automotive parts discovery and purchasing.

---

## Turkish Market Terms

### A

**Atatürk**  
Founder of modern Turkey. Name must be respected in all Turkish communications and never used inappropriately.

**Ankara**  
Capital city of Turkey. Second-largest automotive market after Istanbul.

### B

**BDDK (Bankacılık Düzenleme ve Denetleme Kurumu)**  
Turkish banking regulation authority. Oversees payment processing regulations affecting BanaYeni SanaEski.

**Bayram**  
Turkish religious holidays (Ramadan Bayramı, Kurban Bayramı). Periods of reduced business activity.

### E

**E-Devlet**  
Turkish government's digital services platform. Potential integration point for business verification services.

### İ

**İstanbul**  
Largest city and economic center of Turkey. Primary market for BanaYeni SanaEski with highest user concentration.

**İzmir**  
Third-largest city in Turkey. Important industrial center and automotive market.

### G

**Garanti BBVA**  
One of Turkey's largest banks. Important payment processing partner for Turkish users.

### K

**KVKK (Kişisel Verilerin Korunması Kanunu)**  
Turkish Personal Data Protection Law. Mandatory compliance for handling Turkish citizen data.

**Kuruş**  
Subunit of Turkish Lira (1 Lira = 100 Kuruş). Used in precise pricing for automotive parts.

### M

**Mahalle**  
Turkish neighborhood administrative unit. Used in Turkish address formatting and delivery coordination.

### T

**TRT (Turkey Time)**  
Turkish timezone (UTC+3 year-round). All business hours and communications use Turkish time.

**Turkcell**  
Largest mobile network operator in Turkey. Primary target for SMS and mobile optimization.

**Turkish Lira (TRY)**  
Official currency of Turkey. All pricing and transactions in BanaYeni SanaEski use Turkish Lira.

### V

**Vodafone Turkey**  
Major mobile network operator. Important for SMS delivery and mobile performance optimization.

---

## Automotive Industry Terms

### A

**Aftermarket Parts**  
Replacement parts not made by original vehicle manufacturer. Large segment of Turkish automotive parts market.

**ABS (Anti-lock Braking System)**  
Safety system preventing wheel lockup during braking. Common part category in Turkish marketplace.

### B

**Balata**  
Turkish term for brake pads. One of highest-demand part categories on BanaYeni SanaEski.

**BMW**  
German luxury automotive brand. Popular in Turkish market with strong aftermarket parts demand.

### C

**Catalytic Converter**  
Emission control device. High-value part category with specific Turkish environmental regulations.

**Clutch (Debriyaj)**  
Vehicle component for manual transmission. Popular part category in Turkish market (high manual transmission usage).

### D

**Diagnostic Port (OBD)**  
Vehicle computer interface. Growing importance with electronic diagnostic tools in Turkish market.

**Differential**  
Drivetrain component allowing wheels to rotate at different speeds. Technical part category requiring expertise.

### E

**ECU (Engine Control Unit)**  
Vehicle computer controlling engine functions. High-tech part category with growing Turkish market demand.

**EGR Valve**  
Emission control component. Important for Turkish environmental compliance.

### F

**Fren Sistemi**  
Turkish term for brake system. Critical safety component category with consistent demand.

**Fuel Injector**  
Engine component delivering fuel. Technical part requiring proper fitment verification.

### G

**Gearbox (Şanzıman)**  
Vehicle transmission system. Major component category with manual/automatic variants popular in Turkey.

### H

**HID (High-Intensity Discharge)**  
Type of automotive lighting. Aftermarket upgrade popular among Turkish car enthusiasts.

**Hydraulic System**  
System using fluid pressure for various vehicle functions. Important for brakes, steering, and suspension.

### I

**Intake Manifold**  
Engine component distributing air/fuel mixture. Performance part popular in Turkish tuning market.

### J

**Jack Points**  
Designated vehicle lifting points. Safety information critical for Turkish DIY maintenance culture.

### L

**LED Lighting**  
Modern automotive lighting technology. Growing aftermarket category in Turkish market.

**Lastik**  
Turkish term for tires. Seasonal demand (winter/summer tires) creates market opportunities.

### M

**Mercedes**  
German luxury automotive brand. Strong presence in Turkish market with established parts distribution.

**Motor Yağı**  
Turkish term for engine oil. Consumable product with regular replacement cycle and consistent demand.

### O

**OBD-II**  
Standardized diagnostic interface. Important for Turkish automotive service industry modernization.

**OEM (Original Equipment Manufacturer)**  
Company producing parts for original vehicle assembly. Premium quality tier in Turkish market.

### P

**Part Number**  
Unique identifier for specific automotive part. Critical for accurate part identification and fitment.

**Power Steering**  
Vehicle steering assistance system. Common repair category in Turkish automotive service.

### R

**Radiator**  
Engine cooling system component. Important part category for Turkish climate conditions.

**Renault**  
French automotive brand with highest market share in Turkey. Large aftermarket parts demand.

### S

**Spark Plug**  
Engine ignition component. Regular maintenance item with consistent Turkish market demand.

**Suspension**  
Vehicle system providing ride comfort and handling. Important category for Turkish road conditions.

### T

**Turbocharger**  
Engine performance enhancement component. Growing category with increasing turbocharged vehicles in Turkey.

**Timing Belt**  
Engine component requiring periodic replacement. Critical maintenance item with safety implications.

### V

**VIN (Vehicle Identification Number)**  
Unique vehicle identifier. Used for accurate part compatibility verification.

**Volkswagen**  
German automotive brand popular in Turkey. Strong aftermarket parts market with established distribution.

### W

**Water Pump**  
Engine cooling system component. Regular replacement item with consistent market demand.

**Wheel Bearing**  
Component allowing wheel rotation. Wear item requiring replacement based on mileage and road conditions.

---

## Platform-Specific Terms

### B

**BanaYeni SanaEski**  
Platform name meaning "Mine New, Yours Old" - expressing the value exchange of giving new life to used automotive parts.

**Buyer Interest**  
Expression of interest in purchasing specific automotive part. Triggers seller notification and potential communication.

### C

**Condition Status**  
Part condition classification: "Kullanılabilir" (usable) or "Arızalı" (faulty). Critical for buyer decision-making.

### I

**Interest Approval**  
Seller's decision to allow direct communication with interested buyer. Core feature of interest-gating system.

**Interest-Gating System**  
BanaYeni SanaEski's proprietary system requiring seller approval before buyer-seller communication. Prevents spam and improves match quality.

### P

**Part Listing**  
Seller's advertisement for automotive part including photos, description, price, and condition. Core platform content.

**Part Reference**  
Manufacturer's part number used for accurate part identification. Critical field for Turkish automotive parts matching.

### S

**Seller Verification**  
Process of confirming seller identity and legitimacy. Important for building trust in Turkish marketplace.

**Search Relevance**  
Measure of how well search results match user query. Optimized for Turkish text processing and automotive terminology.

### U

**User Profile**  
Account information including contact details, verification status, and transaction history. Foundation of trust system.

**User Rating**  
Peer rating system for buyers and sellers based on transaction experiences. Important for trust building in Turkish market.

---

## Development and Operations Terms

### A

**A/B Testing**  
Method of comparing two versions to determine which performs better. Used for optimizing Turkish user experience.

**Agile Development**  
Iterative software development methodology. Used for rapid feature development for Turkish market needs.

### C

**CI/CD (Continuous Integration/Continuous Deployment)**  
Development practices for automated testing and deployment. Ensures reliable updates for Turkish users.

**Code Review**  
Process where developers examine code changes. Includes Turkish localization and business logic validation.

### D

**DevOps**  
Practices combining development and operations. Critical for maintaining high availability for Turkish users.

**Documentation**  
Written explanations of system functionality. Includes Turkish market requirements and cultural considerations.

### F

**Feature Flag**  
Technique to enable/disable features without code deployment. Used for gradual rollout to Turkish users.

### M

**Monitoring**  
Process of tracking system performance and health. Includes Turkish-specific metrics and user experience indicators.

### Q

**QA (Quality Assurance)**  
Testing process ensuring software meets requirements. Includes Turkish localization testing and cultural appropriateness.

### S

**Sprint**  
Time-boxed development cycle in Agile methodology. Typically 2 weeks for BanaYeni SanaEski feature development.

**Staging Environment**  
Testing environment that mirrors production. Used for validating Turkish features before release.

### T

**Technical Debt**  
Cost of choosing easy solution now versus better solution later. Managed carefully for long-term platform scalability.

**Test Coverage**  
Percentage of code tested by automated tests. Target 90%+ coverage including Turkish-specific functionality.

---

## Conclusion

This comprehensive glossary serves as the definitive reference for all terminology used in BanaYeni SanaEski development, documentation, and business operations. It ensures consistent understanding across:

**Technical Stakeholders:**
- Developers implementing Turkish marketplace features
- DevOps engineers managing platform infrastructure  
- QA engineers testing Turkish localization and functionality
- Technical architects planning system scalability

**Business Stakeholders:**
- Product managers defining Turkish market requirements
- Marketing teams understanding automotive and Turkish terminology
- Customer support teams using correct technical and business terms
- Executive team understanding platform capabilities and market positioning

**Turkish Market Experts:**
- Cultural consultants ensuring appropriate terminology usage
- Automotive industry experts validating technical accuracy
- Legal advisors ensuring compliance terminology correctness
- Local partners understanding platform capabilities

**Usage Guidelines:**
- Reference this glossary when writing documentation
- Use standardized terms in code comments and variable names
- Ensure consistent terminology in user-facing content
- Update glossary when introducing new concepts or terms

This living document will evolve as BanaYeni SanaEski grows and adapts to the Turkish automotive parts marketplace, ensuring all stakeholders maintain shared understanding of the platform's technical capabilities, business model, and market positioning.

---

*This Glossary serves as the central terminology reference for the entire BanaYeni SanaEski project, ensuring consistent communication across all stakeholders and documentation.*