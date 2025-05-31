# JobTag Implementation Plan - 2 Week Sprint

## 🎯 Project Overview
Building a job application tracking SaaS with AI-powered email parsing and auto-labeling for Gmail and Outlook. Working solo with aggressive 2-week timeline to MVP.

**Tech Stack:**
- Frontend: Next.js 14 + TypeScript + shadcn/ui + Tailwind CSS
- Backend: Supabase (PostgreSQL + Edge Functions + Auth + Realtime)
- AI: OpenAI API for email parsing
- Email Integration: Gmail API + Microsoft Graph API

## 📦 Project Setup Guide

### Initial Setup Commands
```bash
# Create Next.js project in current directory
npx create-next-app@latest . --typescript --tailwind --eslint --app --src-dir

# When prompted:
# - TypeScript? → Yes
# - ESLint? → Yes  
# - Tailwind CSS? → Yes
# - src/ directory? → Yes
# - App Router? → Yes
# - Import alias? → Yes (use @/*)

# Install core dependencies
npm install @supabase/supabase-js @supabase/ssr --legacy-peer-deps
npm install framer-motion @react-spring/web --legacy-peer-deps
npm install class-variance-authority clsx tailwind-merge lucide-react date-fns --legacy-peer-deps

# Add shadcn/ui components (automatically installs Radix UI dependencies)
npx shadcn@latest add button card dialog select toast --legacy-peer-deps
```

**Note:** When using `npx shadcn@latest add [component]`, it automatically installs the required Radix UI dependencies for that component.

## 🚀 2-Week Sprint Timeline

### Week 1: Core Foundation + Killer Landing Page
**Goal:** Eye-catching landing page, authentication, database, and basic app functionality

#### Day 1-2: Landing Page & Setup
**Morning (Day 1):**
- [x] Project setup with Next.js 14, TypeScript, Tailwind CSS
- [x] Install all dependencies (shadcn/ui, Supabase, etc.)
- [x] Set up Supabase project
- [x] Configure space-themed design system

**Afternoon - Evening (Day 1):**
- [ ] Create killer landing page with:
  - [ ] Animated space background with floating particles
  - [ ] Glass morphism hero section
  - [ ] "Track Jobs Like NASA Tracks Satellites" tagline
  - [ ] Interactive demo showing email → organized applications
  - [ ] Animated statistics (95% parsing accuracy, 10x faster tracking)
  - [ ] Social proof section with fake testimonials
  - [ ] Pricing cards with glass effect
  - [ ] Call-to-action with cosmic button animations
  - [ ] **Mobile-first responsive design** (test on all screen sizes)

**Day 2:**
- [ ] Add landing page animations:
  - [ ] Parallax scrolling effects
  - [ ] Hover animations on cards
  - [ ] Smooth transitions between sections
  - [ ] **Responsive animations** (disable heavy animations on mobile)
- [ ] SEO optimization and meta tags
- [ ] Performance optimization (lazy loading, image optimization)
- [ ] **Push 1:** "feat: killer landing page with space theme and animations"

#### Day 3-4: Authentication & Database
**Day 3:**
- [ ] Implement Supabase Auth with email/password
- [ ] Build signup/login forms with glass morphism
- [ ] Create OTP verification flow
- [ ] Add OAuth buttons (Google/Microsoft) - UI only for now
- [ ] Design smart email connection prompt

**Day 4:**
- [ ] Create complete database schema
- [ ] Set up RLS policies
- [ ] Build user profile management
- [ ] Test auth flows end-to-end
- [ ] **Push 2:** "feat: complete auth system with OTP and database schema"

#### Day 5-6: Core Application Features
**Day 5:**
- [ ] Build dashboard layout with sidebar
- [ ] Create application CRUD operations
- [ ] Design application card component
- [ ] Implement application list with filters
- [ ] Add manual application entry form

**Day 6:**
- [ ] Create dashboard statistics overview
- [ ] Implement real-time updates with Supabase
- [ ] Add application status management
- [ ] Build search and filter functionality
- [ ] **Push 3:** "feat: core application tracking with real-time updates"

#### Day 7: Week 1 Polish
- [ ] Fix bugs from days 1-6
- [ ] Add loading states and error handling
- [ ] Create demo data for new users
- [ ] Improve UI/UX based on self-testing
- [ ] Deploy to Vercel for testing
- [ ] **Push 4:** "feat: week 1 complete - landing page + auth + core features"

### Week 2: Email Integration + AI + Auto-Labeling
**Goal:** Complete email integration with AI parsing and auto-labeling

#### Day 8-9: Email OAuth Integration
**Day 8:**
- [ ] Implement Gmail OAuth flow
- [ ] Create Gmail API service
- [ ] Build email sync Edge Function
- [ ] Design email account connection UI
- [ ] Test Gmail integration end-to-end

**Day 9:**
- [ ] Implement Outlook OAuth flow
- [ ] Create Microsoft Graph service
- [ ] Update email sync for Outlook
- [ ] Handle OAuth token refresh
- [ ] **Push 5:** "feat: Gmail and Outlook OAuth integration complete"

#### Day 10-11: AI Parsing & Auto-Labeling
**Day 10:**
- [ ] Set up OpenAI API integration
- [ ] Create AI email parsing Edge Function
- [ ] Implement confidence scoring
- [ ] Build email processing queue
- [ ] Add parsing status indicators

**Day 11:**
- [ ] Implement Gmail hierarchical labeling
- [ ] Implement Outlook categorization
- [ ] Add duplicate detection
- [ ] Create label update logic
- [ ] Test auto-labeling with real emails
- [ ] **Push 6:** "feat: AI parsing and auto-labeling system complete"

#### Day 12-13: Processing Flow & Analytics
**Day 12:**
- [ ] Build email processing progress UI
- [ ] Create batch processing for existing emails
- [ ] Add email preview with parsed data
- [ ] Implement manual correction option
- [ ] Design email sync status dashboard

**Day 13:**
- [ ] Create basic analytics dashboard
- [ ] Add response rate tracking
- [ ] Build application timeline view
- [ ] Implement quick insights
- [ ] **Push 7:** "feat: email processing flow and analytics"

#### Day 14: MVP Launch Preparation
- [ ] Comprehensive testing of all features
- [ ] Fix critical bugs
- [ ] Performance optimization
- [ ] Update landing page with real features
- [ ] Deploy to production
- [ ] Create demo video
- [ ] **Push 8:** "feat: MVP complete - JobTag v1.0.0"

## 🎨 Killer Landing Page Components

### Hero Section
```tsx
// components/landing/hero-section.tsx
- Animated tagline: "Track Job Applications Like NASA Tracks Satellites"
- Subtitle: "AI-powered email parsing organizes your job hunt automatically"
- Floating astronaut illustration
- CTA: "Launch Your Job Search" button with rocket animation
- Background: Animated star field with parallax effect
```

### Features Section
```tsx
// components/landing/features-section.tsx
- 3 glass cards with hover effects:
  1. "AI Email Parser" - Brain icon with neural network animation
  2. "Auto-Organization" - Folder icon transforming into organized structure
  3. "Real-time Tracking" - Satellite icon with orbit animation
- Each card reveals details on hover
```

### Demo Section
```tsx
// components/landing/demo-section.tsx
- Interactive before/after slider:
  - Before: Messy inbox with job emails
  - After: Organized applications with labels
- Animated email flying into organized structure
- "See the magic happen" with sparkle effects
```

### Stats Section
```tsx
// components/landing/stats-section.tsx
- Animated counters:
  - "95% Parsing Accuracy"
  - "10x Faster Tracking"
  - "0 Manual Entry"
- Numbers animate when scrolled into view
- Glowing effect on numbers
```

### Testimonials Section
```tsx
// components/landing/testimonials-section.tsx
- Glass cards with user testimonials
- Floating animation on cards
- Star ratings with glow effect
- Profile pictures with space helmets (fun touch)
```

### Pricing Section
```tsx
// components/landing/pricing-section.tsx
- Two glass cards: Free & Pro
- Popular badge with pulse animation on Pro
- Feature list with check animations
- "Get Started" buttons with hover effects
```

## 📁 Priority File Structure

### Immediate Files (Day 1-2)
```
app/
├── page.tsx                 # Landing page
├── globals.css             # Global styles with space theme
└── layout.tsx              # Root layout

components/
├── landing/
│   ├── hero-section.tsx
│   ├── features-section.tsx
│   ├── demo-section.tsx
│   ├── stats-section.tsx
│   ├── testimonials-section.tsx
│   └── pricing-section.tsx
├── ui/                     # shadcn components
└── custom/
    ├── space-background.tsx
    ├── floating-particles.tsx
    └── glass-card.tsx
```

### Week 1 Core Files
```
app/
├── (auth)/
│   ├── login/page.tsx
│   ├── signup/page.tsx
│   └── verify-email/page.tsx
└── (dashboard)/
    ├── dashboard/page.tsx
    └── applications/page.tsx

components/
├── auth/
│   ├── signup-form.tsx
│   └── otp-verification.tsx
└── applications/
    ├── application-card.tsx
    └── application-list.tsx

lib/
├── supabase/
│   ├── client.ts
│   └── types.ts
└── utils/
    └── cn.ts

supabase/
└── migrations/
    └── 001_initial_schema.sql
```

### Week 2 Integration Files
```
supabase/
└── functions/
    ├── email-sync/
    ├── ai-parsing/
    └── auto-labeling/

components/
├── email/
│   ├── oauth-connect.tsx
│   ├── sync-status.tsx
│   └── processing-progress.tsx
└── analytics/
    └── quick-stats.tsx

lib/
└── services/
    ├── gmail-service.ts
    ├── outlook-service.ts
    └── ai-service.ts
```

## 🎯 Daily Goals & Metrics

### Week 1 Daily Goals
- **Day 1-2:** Landing page that makes people say "wow"
- **Day 3-4:** Working auth that feels premium
- **Day 5-6:** Core app that's actually useful
- **Day 7:** Deployed and shareable

### Week 2 Daily Goals
- **Day 8-9:** Email connection that "just works"
- **Day 10-11:** AI parsing that feels magical
- **Day 12-13:** Polish that makes it feel complete
- **Day 14:** Launch-ready product

## 🚀 MVP Definition (End of Week 2)

### Must Have
- [ ] Stunning landing page that converts
- [ ] Email/password authentication with OTP
- [ ] Gmail OR Outlook integration (at least one)
- [ ] AI email parsing creating applications
- [ ] Auto-labeling in email client
- [ ] Basic dashboard with stats
- [ ] Manual application entry
- [ ] Deployed and accessible

### Nice to Have (if time permits)
- [ ] Both Gmail AND Outlook
- [ ] OAuth login
- [ ] Export functionality
- [ ] Email notifications
- [ ] Advanced analytics

### Can Wait for v2
- [ ] Stripe integration
- [ ] Team features
- [ ] Mobile app
- [ ] Browser extension
- [ ] Advanced AI insights

## 🎨 Landing Page Copy

### Hero Section
```
Headline: "Track Job Applications Like NASA Tracks Satellites"
Subheadline: "Your inbox becomes mission control for your career"
CTA: "Launch Your Job Search" → "Start Free Mission"
```

### Feature Headlines
1. "AI That Reads Your Mind (And Emails)"
2. "Labels That Organize Themselves"
3. "Updates at Light Speed"

### Social Proof
"Join 1,000+ job seekers who've upgraded their hunt"
(Start with aspirational numbers)

### Pricing
- **Free Forever**: 50 applications/month
- **Pro ($9/mo)**: Unlimited + Analytics + Priority Support

## 💡 Speed Hacks for Solo Dev

1. **Use Cursor/AI extensively** for boilerplate code
2. **Copy shadcn/ui examples** and modify
3. **Use Supabase templates** for auth flows
4. **Deploy early** (Day 7) for real-world testing
5. **Focus on one email provider first** (Gmail recommended)
6. **Skip perfection** - ship working features
7. **Use dummy data** for testimonials/stats initially
8. **Leverage Vercel** for easy deployment

## 🚨 Critical Path (What Could Break MVP)

1. **OAuth setup** - Have backup plan (manual email forward)
2. **AI parsing accuracy** - Start with simple patterns
3. **Email API limits** - Implement rate limiting early
4. **Auto-labeling bugs** - Make it toggleable
5. **Performance issues** - Paginate everything

## 📊 Success Metrics (End of Week 2)

- [ ] Landing page conversion >5%
- [ ] 10+ real users signed up
- [ ] 5+ users with connected email
- [ ] 50+ applications tracked
- [ ] <3s page load time
- [ ] 0 critical bugs
- [ ] Deployed and stable

---

This aggressive 2-week plan focuses on shipping a working MVP with a killer landing page. The key is to build fast, test often, and prioritize features that deliver immediate value. The landing page should be impressive enough to get users excited while the product delivers on the core promise of automated job tracking.