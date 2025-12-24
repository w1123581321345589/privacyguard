# PrivacyGuard - Personal Data Privacy Protection Platform

## Overview

PrivacyGuard is a comprehensive web application designed to help users protect their online privacy by scanning data broker websites for personal information exposure and automating the removal process. The platform provides users with privacy scoring, detailed exposure reports, automated removal request management, and educational resources about digital privacy.

The application follows a modern full-stack architecture with a React-based frontend using shadcn/ui components, an Express.js backend, and PostgreSQL database managed through Drizzle ORM. The system is designed to handle the complete lifecycle of privacy protection: user onboarding, data scanning, exposure detection, removal request submission, and progress tracking.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Framework & Routing**: React 18 with Wouter for client-side routing, providing a lightweight single-page application experience. The routing structure includes home, onboarding, dashboard, and not-found pages.

**UI Component System**: Utilizes shadcn/ui (New York variant) built on Radix UI primitives with Tailwind CSS for styling. Components are fully typed with TypeScript and follow a consistent design system with CSS variables for theming support (light/dark modes).

**State Management**: TanStack Query (React Query) handles server state with configured caching strategies (staleTime: Infinity, no automatic refetching). Form state is managed through React Hook Form with Zod validation integration.

**Design Rationale**: This component-driven architecture was chosen for its type safety, accessibility (Radix UI primitives), and maintainability. The separation of UI components allows for consistent styling across the application while maintaining flexibility.

### Backend Architecture

**Server Framework**: Express.js with TypeScript running in ESM mode. The server implements middleware for JSON parsing with raw body preservation (needed for webhook verification scenarios) and comprehensive request/response logging for API routes.

**Authentication & Security**: Session-based authentication using express-session with httpOnly, SameSite cookies. Session data stores userId for authenticated users. All endpoints exposing user PII are protected with authentication middleware and ownership verification. Sessions are automatically established on user registration.

**API Design**: RESTful API structure with resource-based endpoints:
- `/api/users` - User registration (establishes session)
- `/api/users/by-email/:email` - User retrieval (protected, ownership verified)
- `/api/scans` - Privacy scan initiation (protected, ownership verified)
- `/api/users/:userId/latest-scan` - Latest scan retrieval (protected, ownership verified)
- `/api/scans/:id/results` - Scan results and exposures (protected, ownership verified)
- `/api/scans/:id/remove` - Removal process initiation (protected, ownership verified)
- `/api/scans/:id/removal-progress` - Removal request tracking (protected, ownership verified)
- `/api/exposures/:id/removal-form` - Personalized removal form generation (protected, ownership verified)
- `/api/data-brokers` - Data broker information retrieval (public)

**Authorization Pattern**: All protected endpoints follow a consistent authorization pattern: (1) Authenticate via session middleware, (2) Fetch requested resource, (3) Verify authenticated user owns the resource, (4) Return 401 for unauthenticated requests and 403 for unauthorized access.

**Development vs Production**: Vite integration in development mode with HMR support; production builds serve static files from `dist/public`. Custom error handling and logging differentiates API routes from asset requests. MemoryStore sessions in development should be replaced with Redis/Postgres for production.

### Data Storage Architecture

**Database**: PostgreSQL accessed through Neon serverless driver (`@neondatabase/serverless`), configured via `DATABASE_URL` environment variable.

**ORM Layer**: Drizzle ORM with schema-first design approach. Schema definitions live in `shared/schema.ts` for type sharing between frontend and backend. Migrations are generated to `./migrations` directory.

**Database Schema**:

1. **users**: Core user profiles with personal information (name, email, phone, date of birth, addresses) used for data broker scanning. UUID primary keys with generated defaults.

2. **dataBrokers**: Catalog of data broker websites including metadata (name, URL, category, priority), opt-out information (URL, process, required fields), and difficulty ratings. Categories include people-search, marketing, credit, and public-records.

3. **scans**: Scan execution records tracking status (running/completed/failed), progress metrics (sites scanned/found), privacy scores, and timestamps.

4. **exposures**: Individual data exposures discovered during scans, linked to both scans and data brokers, containing exposed data details and profile URLs.

5. **removalRequests**: Removal request lifecycle tracking with status (pending/submitted/completed/failed), retry counts, submission timestamps, and action requirements.

**Storage Abstraction**: `IStorage` interface with in-memory implementation (`MemStorage`) for development/testing. The interface is designed to be swapped with a Drizzle-based implementation for production use. Pre-seeded with real data broker information.

### Service Layer Architecture

**ScanningService**: Orchestrates the privacy scanning process:
- Creates scan records and initiates asynchronous scanning
- Simulates scanning across all data brokers with probabilistic exposure detection (based on broker priority)
- Generates realistic exposed data based on user information
- Calculates privacy scores (0-100) inversely proportional to exposure count
- Updates scan status and completion timestamps

**RemovalService**: Manages the data removal lifecycle:
- Creates removal requests for all exposures discovered in a scan
- Processes removal requests asynchronously with simulated delays
- Determines outcomes based on broker difficulty ratings and priorities
- Tracks retry counts and action requirements
- Updates request statuses through the removal pipeline

**FormGenerationService**: Generates personalized opt-out request forms:
- Creates pre-filled removal request letters with user data
- Customizes content based on broker requirements
- Formats professional correspondence with legal language
- Includes all relevant user PII and exposure details
- Supports copy-to-clipboard and text file download

**Design Rationale**: Service layer separation provides clear boundaries between business logic and API routing, making the codebase more testable and maintainable. Services can be enhanced with real implementations without changing API contracts.

### External Dependencies

**UI Framework**: shadcn/ui components library built on Radix UI primitives, providing accessible, customizable components with consistent styling through Tailwind CSS.

**Database Provider**: Neon serverless PostgreSQL for cloud-hosted database with automatic scaling. Connection managed through `@neondatabase/serverless` driver.

**Development Tools**:
- Vite for frontend build tooling and development server
- Replit-specific plugins for development experience (cartographer, dev banner, runtime error overlay)
- Drizzle Kit for database migrations and schema management
- tsx for TypeScript execution in development

**Validation & Forms**:
- Zod for runtime type validation and schema definition
- React Hook Form for form state management
- @hookform/resolvers for Zod integration
- drizzle-zod for generating Zod schemas from Drizzle tables

**Styling**:
- Tailwind CSS with custom configuration for theming
- PostCSS with autoprefixer for CSS processing
- class-variance-authority for component variant management
- clsx and tailwind-merge utilities for className composition

**Build & Runtime**:
- esbuild for server-side bundling in production
- Node.js with ES modules support
- TypeScript with strict mode and bundler module resolution

**Design Philosophy**: The dependency stack prioritizes developer experience, type safety, and modern web standards while maintaining flexibility for production deployment scenarios.