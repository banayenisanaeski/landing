# Development Setup - BanaYeni SanaEski

**Document Type:** Complete Development Environment Setup Guide  
**Created:** August 6, 2025  
**Version:** 1.0  
**Status:** Current Setup Instructions  

---

## Setup Overview

This guide provides comprehensive instructions for setting up the BanaYeni SanaEski development environment. The setup includes both the current dual-database architecture and preparation for the upcoming Supabase-only migration.

**Target Environment:** Local development with full Turkish marketplace functionality  
**Database Configuration:** Dual setup (SQL Server + Supabase) transitioning to Supabase-only  
**Development Features:** Hot reloading, TypeScript checking, Turkish text optimization  

---

## Prerequisites

### System Requirements

**Operating System:**
- macOS (recommended for development)
- Linux (Ubuntu 20.04+ or equivalent)
- Windows 10+ with WSL2

**Software Requirements:**
```bash
# Required installations
Node.js: v18.0.0 or higher (LTS recommended)
npm: v8.0.0 or higher
Git: v2.30.0 or higher
```

**Development Tools (Recommended):**
- VS Code with recommended extensions
- Postman or similar API testing tool
- TablePlus or similar database management tool
- Chrome DevTools for debugging

### Node.js Installation

**Using Node Version Manager (Recommended):**
```bash
# Install nvm (macOS/Linux)
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash

# Reload shell configuration
source ~/.bashrc  # or ~/.zshrc

# Install and use Node.js LTS
nvm install --lts
nvm use --lts

# Verify installation
node --version  # Should show v18.x.x or higher
npm --version   # Should show v8.x.x or higher
```

**Direct Installation (Alternative):**
```bash
# Visit https://nodejs.org and download LTS version
# Or use package manager:

# macOS with Homebrew
brew install node@18

# Ubuntu/Debian
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs
```

---

## Project Installation

### 1. Repository Setup

**Clone Repository:**
```bash
# Clone the project
git clone [repository-url] banayeni-sanaeski
cd banayeni-sanaeski

# Verify project structure
ls -la
# Should show: components/, lib/, pages/, public/, styles/, etc.
```

**Branch Setup:**
```bash
# Set up development branch
git checkout -b feature/setup-development
git push -u origin feature/setup-development

# Verify current branch
git branch
# Should show: * feature/setup-development
```

### 2. Dependencies Installation

**Install Project Dependencies:**
```bash
# Install all dependencies
npm install

# Verify installation
npm list --depth=0
# Should show Next.js 13.4.12, React 18.2.0, Supabase client, etc.
```

**Development Dependencies Verification:**
```bash
# Check TypeScript installation
npx tsc --version
# Should show: Version 5.1.6 or higher

# Check TailwindCSS installation
npx tailwindcss --help
# Should show TailwindCSS help information
```

**Optional: Global Tools:**
```bash
# Install useful development tools globally
npm install -g @next/bundle-analyzer
npm install -g typescript
npm install -g eslint
```

---

## Environment Configuration

### 3. Environment Variables Setup

**Create Environment File:**
```bash
# Copy template file
cp .env.example .env.local

# Edit environment variables
code .env.local  # or your preferred editor
```

**Environment Variables Configuration:**
```bash
# .env.local - Complete development configuration

# ================================
# SUPABASE CONFIGURATION
# ================================
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# ================================
# SQL SERVER CONFIGURATION (LEGACY)
# Will be removed after migration
# ================================
DB_USER=your-sql-server-username
DB_PASSWORD=your-sql-server-password
DB_SERVER=your-sql-server-host
DB_DATABASE=BanaYeniSanaEski
DB_PORT=1433

# ================================
# APPLICATION CONFIGURATION
# ================================
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_DEFAULT_LOCALE=tr-TR
NEXT_PUBLIC_DEFAULT_TIMEZONE=Europe/Istanbul
NEXT_PUBLIC_CURRENCY=TRY

# ================================
# FILE UPLOAD CONFIGURATION
# Optimized for Turkish mobile networks
# ================================
MAX_FILE_SIZE=2097152              # 2MB per file
MAX_FILES_PER_PART=5               # Maximum 5 images per part
ALLOWED_FILE_TYPES=image/jpeg,image/png,image/webp

# ================================
# PERFORMANCE CONFIGURATION
# ================================
NEXT_PUBLIC_API_TIMEOUT=10000      # 10 seconds for Turkish mobile
DATABASE_CONNECTION_LIMIT=20       # Connection pool limit
CACHE_TTL=300                      # 5 minutes cache TTL

# ================================
# DEVELOPMENT CONFIGURATION
# ================================
NODE_ENV=development
NEXT_PUBLIC_ENV=development
DEBUG=true

# ================================
# OPTIONAL SERVICES
# ================================
# Google Analytics (for production)
NEXT_PUBLIC_GA_ID=your-ga-id

# Sentry (for error monitoring)
SENTRY_DSN=your-sentry-dsn

# Vercel (for deployment)
VERCEL_URL=your-vercel-url
```

**Environment Validation:**
```bash
# Create validation script
echo 'console.log("Supabase URL:", process.env.NEXT_PUBLIC_SUPABASE_URL);' > validate-env.js
node validate-env.js
# Should output your Supabase URL
rm validate-env.js
```

---

## Database Setup

### 4. Supabase Setup

**Create Supabase Project:**
1. Visit [supabase.com](https://supabase.com)
2. Create new project: `banayeni-sanaeski-dev`
3. Choose region: Europe (Frankfurt) for Turkish users
4. Copy URL and keys to `.env.local`

**Database Schema Setup:**
```sql
-- Connect to Supabase SQL Editor
-- Run the following commands:

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS pg_trgm;

-- User profiles table (extends Supabase Auth)
CREATE TABLE public.user_profiles (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    email TEXT NOT NULL,
    profile_complete BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    
    -- Constraints
    CONSTRAINT valid_email CHECK (email ~* '^[A-Za-z0-9._%-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,4}$')
);

-- Parts table with Turkish optimization
CREATE TABLE public.parts (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    seller_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE NOT NULL,
    title TEXT NOT NULL,
    part_reference TEXT NOT NULL,
    condition TEXT NOT NULL CHECK (condition IN ('Kullanılabilir', 'Arızalı')),
    price DECIMAL(10,2) NOT NULL CHECK (price >= 0),
    location_city TEXT NOT NULL,
    brand TEXT NOT NULL,
    model TEXT NOT NULL,
    year INTEGER NOT NULL CHECK (year >= 1900 AND year <= 2030),
    description TEXT,
    images TEXT[] DEFAULT '{}',
    status TEXT DEFAULT 'active' CHECK (status IN ('active', 'sold', 'inactive')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    
    -- Additional constraints
    CONSTRAINT valid_price CHECK (price <= 999999.99),
    CONSTRAINT valid_title_length CHECK (length(title) >= 5 AND length(title) <= 200),
    CONSTRAINT valid_part_reference CHECK (length(part_reference) >= 3),
    CONSTRAINT valid_images_count CHECK (array_length(images, 1) <= 5)
);

-- Interests table (core business logic)
CREATE TABLE public.interests (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE NOT NULL,
    part_id UUID REFERENCES public.parts(id) ON DELETE CASCADE NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('interested', 'not_interested')),
    conversation_id UUID,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    
    -- Ensure one interest per user per part
    UNIQUE(user_id, part_id)
);

-- Conversations table
CREATE TABLE public.conversations (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    buyer_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE NOT NULL,
    seller_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE NOT NULL,
    part_id UUID REFERENCES public.parts(id) ON DELETE CASCADE NOT NULL,
    status TEXT DEFAULT 'active' CHECK (status IN ('active', 'closed')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    last_message_at TIMESTAMPTZ DEFAULT NOW(),
    
    -- Business rules
    CHECK (buyer_id != seller_id),
    UNIQUE(buyer_id, part_id)
);

-- Messages table
CREATE TABLE public.messages (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    conversation_id UUID REFERENCES public.conversations(id) ON DELETE CASCADE NOT NULL,
    sender_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE NOT NULL,
    content TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    read_at TIMESTAMPTZ,
    
    -- Content constraints
    CONSTRAINT valid_content_length CHECK (length(content) > 0 AND length(content) <= 2000),
    CONSTRAINT no_empty_content CHECK (trim(content) != '')
);
```

**Performance Indexes:**
```sql
-- Turkish text search indexes
CREATE INDEX idx_parts_part_reference ON public.parts USING GIN (part_reference gin_trgm_ops);
CREATE INDEX idx_parts_search_text ON public.parts USING GIN (
    (title || ' ' || part_reference || ' ' || COALESCE(description, '')) gin_trgm_ops
);
CREATE INDEX idx_parts_brand_model ON public.parts (brand, model);
CREATE INDEX idx_parts_location_city ON public.parts (location_city);
CREATE INDEX idx_parts_condition ON public.parts (condition);
CREATE INDEX idx_parts_price ON public.parts (price);
CREATE INDEX idx_parts_status_created ON public.parts (status, created_at DESC);

-- Turkish full-text search
CREATE INDEX idx_parts_turkish_fts ON public.parts USING GIN (
    to_tsvector('turkish', title || ' ' || part_reference || ' ' || COALESCE(description, ''))
);

-- Interest and conversation indexes
CREATE INDEX idx_interests_user_part ON public.interests (user_id, part_id);
CREATE INDEX idx_interests_part_type ON public.interests (part_id, type);
CREATE INDEX idx_conversations_buyer ON public.conversations (buyer_id, last_message_at DESC);
CREATE INDEX idx_conversations_seller ON public.conversations (seller_id, last_message_at DESC);
CREATE INDEX idx_messages_conversation_time ON public.messages (conversation_id, created_at DESC);
```

**Row Level Security (RLS):**
```sql
-- Enable RLS on all tables
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.parts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.interests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

-- User profiles policies
CREATE POLICY "Users can view own profile" ON public.user_profiles
    FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON public.user_profiles
    FOR UPDATE USING (auth.uid() = id);

-- Parts policies
CREATE POLICY "Anyone can view active parts" ON public.parts
    FOR SELECT USING (status = 'active');
CREATE POLICY "Sellers can manage own parts" ON public.parts
    FOR ALL USING (auth.uid() = seller_id);

-- Interests policies
CREATE POLICY "Users can manage own interests" ON public.interests
    FOR ALL USING (auth.uid() = user_id);

-- Conversations policies
CREATE POLICY "Participants can access conversation" ON public.conversations
    FOR ALL USING (auth.uid() = buyer_id OR auth.uid() = seller_id);

-- Messages policies
CREATE POLICY "Participants can access messages" ON public.messages
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.conversations 
            WHERE conversations.id = messages.conversation_id 
            AND (conversations.buyer_id = auth.uid() OR conversations.seller_id = auth.uid())
        )
    );
```

**Storage Setup:**
```sql
-- Create storage bucket for part images
INSERT INTO storage.buckets (id, name, public) VALUES ('part-images', 'part-images', true);

-- Storage policies
CREATE POLICY "Anyone can view part images" ON storage.objects
    FOR SELECT USING (bucket_id = 'part-images');

CREATE POLICY "Authenticated users can upload part images" ON storage.objects
    FOR INSERT WITH CHECK (bucket_id = 'part-images' AND auth.role() = 'authenticated');

CREATE POLICY "Users can update own part images" ON storage.objects
    FOR UPDATE USING (bucket_id = 'part-images' AND auth.uid()::text = (storage.foldername(name))[1]);
```

### 5. SQL Server Setup (Legacy - for current dual-database)

**Database Connection Test:**
```bash
# Create connection test script
cat > test-db-connection.js << EOF
const sql = require('mssql');

const config = {
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    server: process.env.DB_SERVER,
    database: process.env.DB_DATABASE,
    port: parseInt(process.env.DB_PORT || '1433'),
    options: {
        encrypt: true,
        trustServerCertificate: true
    }
};

async function testConnection() {
    try {
        const pool = await sql.connect(config);
        console.log('✅ SQL Server connection successful');
        
        const result = await pool.request().query('SELECT COUNT(*) as count FROM Parts');
        console.log('Parts count:', result.recordset[0].count);
        
        await pool.close();
    } catch (err) {
        console.error('❌ SQL Server connection failed:', err.message);
    }
}

testConnection();
EOF

# Run test
node test-db-connection.js

# Clean up
rm test-db-connection.js
```

---

## Development Server

### 6. Start Development Environment

**Basic Development Server:**
```bash
# Start development server
npm run dev

# Server should start on http://localhost:3000
# You should see:
# ✓ Ready in 2.3s
# ✓ Local: http://localhost:3000
# ✓ Network: http://192.168.x.x:3000
```

**Development Server with Custom Configuration:**
```bash
# Start with custom port
PORT=3001 npm run dev

# Start with TypeScript checking
npm run dev & npm run type-check -- --watch

# Start with debugging
DEBUG=* npm run dev
```

**Verify Development Environment:**
```bash
# Open browser and test the following:
# 1. Homepage: http://localhost:3000
# 2. Search page: http://localhost:3000/search  
# 3. Sell page: http://localhost:3000/sell (should redirect to login)
# 4. API health: http://localhost:3000/api/health (if implemented)
```

---

## Development Tools Configuration

### 7. VS Code Setup

**Install VS Code Extensions:**
```bash
# Open VS Code in project directory
code .

# Install recommended extensions (VS Code will prompt)
# Or install manually:
# - TypeScript and JavaScript Language Features
# - Tailwind CSS IntelliSense
# - ESLint
# - Prettier
# - Supabase
```

**VS Code Workspace Configuration:**
```json
// .vscode/settings.json
{
  "typescript.preferences.importModuleSpecifier": "absolute",
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true,
    "source.organizeImports": true
  },
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "tailwindCSS.includeLanguages": {
    "typescript": "html",
    "typescriptreact": "html"
  },
  "emmet.includeLanguages": {
    "typescript": "html",
    "typescriptreact": "html"
  },
  "files.associations": {
    "*.css": "tailwindcss"
  },
  "typescript.preferences.quoteStyle": "single",
  "javascript.preferences.quoteStyle": "single"
}
```

**VS Code Launch Configuration:**
```json
// .vscode/launch.json
{
  "version": "0.2.0",
  "configurations": [
    {
      "name": "Next.js: debug server-side",
      "type": "node",
      "request": "attach",
      "port": 9229,
      "skipFiles": ["<node_internals>/**"]
    },
    {
      "name": "Next.js: debug client-side",
      "type": "pwa-chrome",
      "request": "launch",
      "url": "http://localhost:3000"
    },
    {
      "name": "Next.js: debug full stack",
      "type": "node",
      "request": "launch",
      "program": "${workspaceFolder}/node_modules/.bin/next",
      "args": ["dev"],
      "console": "integratedTerminal",
      "skipFiles": ["<node_internals>/**"]
    }
  ]
}
```

### 8. Git Configuration

**Git Hooks Setup:**
```bash
# Create pre-commit hook for Turkish marketplace
cat > .git/hooks/pre-commit << EOF
#!/bin/sh
# Turkish marketplace pre-commit checks

echo "🔍 Running pre-commit checks..."

# Run TypeScript type checking
echo "📝 Checking TypeScript..."
npm run type-check
if [ $? -ne 0 ]; then
    echo "❌ TypeScript errors found. Commit aborted."
    exit 1
fi

# Run ESLint
echo "🔍 Running ESLint..."
npx eslint . --ext .ts,.tsx,.js,.jsx
if [ $? -ne 0 ]; then
    echo "❌ ESLint errors found. Commit aborted."
    exit 1
fi

# Check for Turkish character support in new files
echo "🇹🇷 Checking Turkish character support..."
git diff --cached --name-only | grep -E '\.(ts|tsx|js|jsx)$' | while read file; do
    if git show ":$file" | grep -qP '[çğıöşüÇĞIİÖŞÜ]'; then
        echo "✅ Turkish characters detected in $file"
    fi
done

echo "✅ All pre-commit checks passed!"
EOF

# Make hook executable
chmod +x .git/hooks/pre-commit
```

**Git Configuration:**
```bash
# Configure Git for Turkish development
git config user.name "Your Name"
git config user.email "your.email@domain.com"

# Set up Turkish commit template
cat > .gitmessage << EOF
# Commit Message Template for BanaYeni SanaEski
# 
# Type: Subject (max 50 characters)
# |<----  Using a Maximum Of 50 Characters  ---->|
#
# Explain why this change is being made
# |<----   Try To Limit Each Line to a Maximum Of 72 Characters   ---->|
#
# Provide links or keys to any relevant tickets, articles or other resources
# Example: Closes #123, Related to #456
#
# Types:
# feat: New feature for Turkish marketplace
# fix: Bug fix
# docs: Documentation changes
# style: Code style changes (formatting, etc.)
# refactor: Code changes that neither fix bugs nor add features
# test: Adding or changing tests
# chore: Changes to build process or auxiliary tools
EOF

git config commit.template .gitmessage
```

---

## Testing Setup

### 9. Testing Environment Configuration

**Unit Testing Setup:**
```bash
# Install testing dependencies (if not already installed)
npm install --save-dev jest @testing-library/react @testing-library/jest-dom

# Create Jest configuration
cat > jest.config.js << EOF
const nextJest = require('next/jest')

const createJestConfig = nextJest({
  dir: './',
})

const customJestConfig = {
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  moduleNameMapping: {
    '^@/components/(.*)$': '<rootDir>/components/$1',
    '^@/lib/(.*)$': '<rootDir>/lib/$1',
    '^@/types/(.*)$': '<rootDir>/types/$1',
    '^@/pages/(.*)$': '<rootDir>/pages/$1',
  },
  testEnvironment: 'jest-environment-jsdom',
  collectCoverageFrom: [
    'components/**/*.{js,jsx,ts,tsx}',
    'lib/**/*.{js,jsx,ts,tsx}',
    'pages/api/**/*.{js,jsx,ts,tsx}',
    '!**/*.d.ts',
  ],
  coverageThreshold: {
    global: {
      branches: 60,
      functions: 60,
      lines: 60,
      statements: 60,
    },
  },
}

module.exports = createJestConfig(customJestConfig)
EOF

# Create Jest setup file
cat > jest.setup.js << EOF
import '@testing-library/jest-dom'

// Mock Next.js router
jest.mock('next/router', () => ({
  useRouter() {
    return {
      route: '/',
      pathname: '/',
      query: {},
      asPath: '/',
      push: jest.fn(),
      replace: jest.fn(),
    }
  },
}))

// Mock environment variables for tests
process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://test.supabase.co'
process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = 'test-anon-key'
EOF
```

**Test Examples:**
```bash
# Create sample test
mkdir -p __tests__/components
cat > __tests__/components/PartCard.test.tsx << EOF
import { render, screen } from '@testing-library/react'
import { PartCard } from '@/components/parts/PartCard'
import type { Part } from '@/types/marketplace'

const mockPart: Part = {
  id: '123',
  seller_id: '456',
  title: 'BMW E46 Alternatör',
  part_reference: '12317501999',
  condition: 'Kullanılabilir',
  price: 850.00,
  location_city: 'İstanbul',
  brand: 'BMW',
  model: 'E46',
  year: 2003,
  description: 'Orijinal Bosch alternatör',
  images: [],
  status: 'active',
  created_at: '2024-01-01T00:00:00Z',
  updated_at: '2024-01-01T00:00:00Z'
}

describe('PartCard Component', () => {
  it('renders Turkish part information correctly', () => {
    render(<PartCard part={mockPart} variant="list" />)
    
    expect(screen.getByText('BMW E46 Alternatör')).toBeInTheDocument()
    expect(screen.getByText('12317501999')).toBeInTheDocument()
    expect(screen.getByText('Kullanılabilir')).toBeInTheDocument()
    expect(screen.getByText('İstanbul')).toBeInTheDocument()
  })

  it('formats Turkish price correctly', () => {
    render(<PartCard part={mockPart} variant="list" />)
    
    // Should format price in Turkish Lira
    expect(screen.getByText(/₺/)).toBeInTheDocument()
  })
})
EOF
```

**Run Tests:**
```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm test -- --coverage

# Run specific test file
npm test -- __tests__/components/PartCard.test.tsx
```

---

## Development Workflow Commands

### 10. Common Development Commands

**Development Commands:**
```bash
# Start development server
npm run dev                    # Start Next.js dev server

# Build and production
npm run build                  # Build for production
npm run start                  # Start production server
npm run export                 # Export static site (if configured)

# Code quality
npm run lint                   # Run ESLint
npm run lint:fix              # Auto-fix ESLint issues
npm run type-check            # TypeScript type checking
npm run format                # Format code with Prettier

# Testing
npm test                      # Run Jest unit tests
npm run test:watch           # Run tests in watch mode
npm run test:coverage        # Run tests with coverage report
npm run test:e2e             # Run Playwright e2e tests (when configured)

# Database operations
npm run db:migrate           # Run database migrations (when implemented)
npm run db:seed              # Seed database with test data (when implemented)
npm run db:reset             # Reset database (when implemented)

# Utilities
npm run analyze              # Analyze bundle size
npm run clean                # Clean build artifacts
```

**Custom Scripts (add to package.json):**
```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "lint:fix": "next lint --fix",
    "type-check": "tsc --noEmit",
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage",
    "format": "prettier --write .",
    "format:check": "prettier --check .",
    "analyze": "cross-env ANALYZE=true next build",
    "clean": "rm -rf .next out coverage",
    "db:studio": "supabase db studio",
    "postinstall": "husky install"
  }
}
```

---

## Troubleshooting

### 11. Common Issues and Solutions

**Port Already in Use:**
```bash
# Error: Port 3000 is already in use
# Solution 1: Use different port
PORT=3001 npm run dev

# Solution 2: Kill process using port 3000
lsof -ti:3000 | xargs kill -9

# Solution 3: Find and kill specific process
lsof -i :3000
kill -9 [PID]
```

**Environment Variables Not Loading:**
```bash
# Issue: Environment variables undefined
# Solution: Check file name and location
ls -la .env*
# Should show: .env.local (not .env)

# Verify variables are loaded
node -e "console.log(process.env.NEXT_PUBLIC_SUPABASE_URL)"
```

**TypeScript Errors:**
```bash
# Issue: TypeScript compilation errors
# Solution: Clear Next.js cache
rm -rf .next
npm run dev

# Check TypeScript configuration
npx tsc --showConfig

# Reinstall type definitions
rm -rf node_modules/@types
npm install
```

**Database Connection Issues:**
```bash
# Issue: Cannot connect to Supabase
# Solution: Verify environment variables
echo $NEXT_PUBLIC_SUPABASE_URL
echo $NEXT_PUBLIC_SUPABASE_ANON_KEY

# Test connection
node -e "
const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
console.log('Supabase client created successfully');
"
```

**Turkish Character Display Issues:**
```bash
# Issue: Turkish characters not displaying correctly
# Solution: Check locale settings
locale
# Should include: tr_TR.UTF-8

# Verify UTF-8 encoding in files
file -I components/parts/PartCard.tsx
# Should show: charset=utf-8

# Check browser encoding (open DevTools, look at response headers)
# Content-Type should include: charset=utf-8
```

**Performance Issues:**
```bash
# Issue: Slow development server
# Solution: Analyze bundle size
npm install --save-dev @next/bundle-analyzer
ANALYZE=true npm run build

# Check for large dependencies
npx webpack-bundle-analyzer .next/static/chunks/*.js

# Clear development cache
rm -rf .next/cache
```

**Node.js Version Issues:**
```bash
# Issue: Node.js version compatibility
# Solution: Check Node.js version
node --version
# Should be v18.0.0 or higher

# Use nvm to switch versions
nvm install 18
nvm use 18

# Update npm to latest
npm install -g npm@latest
```

### 12. Development Best Practices

**File Watching Issues:**
```bash
# Issue: Hot reload not working
# Solution: Increase file watch limit (Linux/macOS)
echo fs.inotify.max_user_watches=524288 | sudo tee -a /etc/sysctl.conf
sudo sysctl -p

# For macOS, use fsevents
npm install --save-dev fsevents
```

**Memory Issues:**
```bash
# Issue: Development server running out of memory
# Solution: Increase Node.js memory limit
NODE_OPTIONS="--max-old-space-size=4096" npm run dev

# For permanent solution, add to package.json scripts:
"dev": "NODE_OPTIONS='--max-old-space-size=4096' next dev"
```

**Git Issues:**
```bash
# Issue: Git pre-commit hooks failing
# Solution: Bypass for urgent commits (use sparingly)
git commit --no-verify -m "urgent fix"

# Fix hook permissions
chmod +x .git/hooks/pre-commit

# Reset hooks
rm .git/hooks/pre-commit
git config --unset core.hooksPath
```

---

## Development Checklist

### 13. Setup Verification Checklist

**Environment Setup:**
- [ ] Node.js v18+ installed and active
- [ ] npm v8+ available
- [ ] Git configured with user info
- [ ] VS Code with recommended extensions
- [ ] Project cloned and dependencies installed

**Configuration:**
- [ ] `.env.local` file created with all required variables
- [ ] Supabase project created and connected
- [ ] Database schema deployed to Supabase
- [ ] SQL Server connection tested (if using dual-database)
- [ ] Storage bucket configured in Supabase

**Development Server:**
- [ ] `npm run dev` starts without errors
- [ ] Homepage loads at http://localhost:3000
- [ ] Turkish characters display correctly
- [ ] Hot reload works when editing files
- [ ] TypeScript compilation successful

**Database Connectivity:**
- [ ] Supabase client connects successfully
- [ ] Can query user_profiles table
- [ ] Can query parts table with Turkish text
- [ ] Row Level Security policies working
- [ ] File upload to Supabase Storage working

**Development Tools:**
- [ ] VS Code IntelliSense working for TypeScript
- [ ] TailwindCSS autocomplete functional
- [ ] ESLint showing warnings/errors
- [ ] Prettier formatting on save
- [ ] Git hooks running on commit

**Testing:**
- [ ] Unit tests run with `npm test`
- [ ] Test coverage reports generate
- [ ] Turkish character testing works
- [ ] Component tests pass

---

## Next Steps

After completing the development setup:

1. **Explore Codebase:** Familiarize yourself with project structure
2. **Run Tests:** Ensure all existing tests pass
3. **Create Test Data:** Add sample parts and users for development
4. **Try User Flows:** Test search, part creation, interest expression
5. **Review Documentation:** Read other docs in `/docs` folder

**Migration Preparation:**
- Understand current dual-database architecture
- Review migration strategy in `docs/business/migration-strategy.md`
- Prepare for Supabase-only transition

**Development Workflow:**
- Follow branching strategy in project documentation
- Use Turkish commit messages where appropriate
- Test with Turkish text input
- Consider mobile-first development approach

---

## Conclusion

This development setup provides a comprehensive environment for Turkish marketplace development. The configuration optimizes for:

**Development Productivity:**
- Fast development server with hot reload
- TypeScript type safety with gradual adoption
- Comprehensive tooling with VS Code integration
- Automated code quality checks

**Turkish Market Focus:**
- Turkish character support throughout the stack
- Local timezone and currency configuration
- Mobile-optimized development settings
- Turkish text search capabilities

**Quality Assurance:**
- Automated testing setup
- Code quality enforcement
- Git hooks for consistent standards
- Performance monitoring tools

The setup supports both current dual-database architecture and preparation for the upcoming Supabase-only migration, ensuring development continuity throughout the transition.

---

*This development setup guide serves as the definitive reference for establishing a BanaYeni SanaEski development environment.*