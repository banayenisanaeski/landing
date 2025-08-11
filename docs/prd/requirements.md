# Requirements

## Functional

- FR1: The platform uses AI-powered image recognition to extract mandatory automotive part reference codes from uploaded photographs with confidence scoring for individual part listings
- FR2: Buyers can create wanted listings using either reference codes or vehicle specifications (make/model/year)
- FR3: The platform notifies relevant sellers when parts matching their inventory are requested through wanted listings
- FR4: The AI compatibility engine maps reference codes to all compatible vehicles to ensure notifications reach only relevant sellers
- FR5: Sellers can list complete vehicles for dismantling (no reference code required, only brand/model/year and description) OR individual spare parts (reference code mandatory)
- FR6: The platform provides differentiated interfaces for individual users (brand/model specific) and industrial users (product/component specific)
- FR7: The system implements trust verification including user authentication, listing quality control, and automated fraud detection
- FR8: The platform tracks notification delivery, engagement metrics, and conversion rates for optimization
- FR9: Users can search for parts using reference codes, vehicle specifications
- FR10: Platform enables direct chat communication between matched buyers and sellers after notification

## Non Functional

- NFR1: AI reference code recognition must achieve 90%+ accuracy in MVP, targeting 95%+ for production
- NFR2: Notification delivery must occur within 60 seconds of wanted listing creation
- NFR3: API response times must be <200ms for search operations and <500ms for AI processing
- NFR4: The platform must support Turkish language UI with proper automotive terminology localization
- NFR5: System must handle concurrent usage by 50+ industrial sellers without performance degradation
- NFR6: All user data must be encrypted at rest and in transit with GDPR compliance
- NFR7: Platform must maintain 99.9% uptime during business hours (8am-8pm Turkey time)
- NFR8: Mobile responsive design must support all features on devices 375px width and above
