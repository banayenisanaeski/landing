# Technical Assumptions

## Repository Structure: Monorepo

All code (frontend, backend, AI services) will be maintained in a single repository to simplify deployment, share types/utilities, and ensure atomic updates across the full stack.

## Service Architecture

**CRITICAL DECISION** - The platform will be built as a monolithic Next.js application with serverless functions for AI processing. This provides:
- Simplified deployment via Vercel
- Built-in API routes for backend logic
- Serverless scaling for AI workloads
- Shared authentication context
- Lower operational complexity for MVP

## Testing Requirements

**CRITICAL DECISION** - Testing strategy will follow:
- Unit tests for critical business logic (matching algorithms, notification targeting)
- Integration tests for API endpoints and database operations  
- Manual testing workflows for UI/UX flows
- AI model validation tests with sample automotive images
- Performance tests for notification delivery times

## Additional Technical Assumptions and Requests

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
