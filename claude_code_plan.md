# JobTracker SaaS - Full Stack Architecture Plan

## 🏗️ Architecture Overview: Supabase-First Approach

```
┌─────────────────────────────────────────────────────┐
│              React Frontend                         │
│        TypeScript + shadcn/ui + Tailwind           │
│              Space Glass Theme                      │
└─────────────────────┬───────────────────────────────┘
                      │ Supabase Client
┌─────────────────────┼───────────────────────────────┐
│                Supabase Edge Functions              │
│                  (TypeScript)                      │
├─────────────────────┼───────────────────────────────┤
│ email-sync/         │ ai-parsing/                   │
│ stripe-webhook/     │ analytics/                    │
│ notification/       │ data-export/                  │
└─────────────────────┼───────────────────────────────┘
                      │
┌─────────────────────┼───────────────────────────────┐
│                Supabase Services                    │
├─────────────────────┼───────────────────────────────┤
│ PostgreSQL Database │ Authentication + RLS          │
│ Real-time Engine    │ Storage (Files/Exports)       │
│ Row Level Security  │ Auto-generated APIs           │
└─────────────────────────────────────────────────────┘
```

**Key Decision: No separate backend needed!** Supabase handles everything.

---

## 📧 Auto-Labeling System (Gmail + Outlook)

### Hierarchical Labeling Structure

**Gmail Labels (Hierarchical - Recommended):**
```
JobTracker/
├── Meta - Software Engineer/
│   ├── Applied
│   ├── Screening
│   ├── Interview
│   ├── Technical
│   ├── Final
│   ├── Offer
│   ├── Rejected
│   └── Withdrawn
├── Google - Product Manager/
│   ├── Applied
│   ├── Interview
│   └── Rejected
└── Netflix - Data Scientist/
    ├── Applied
    └── Screening
```

**Why Hierarchical for Gmail:**
- ✅ **User Expectations**: Looks like folders, matches email client conventions
- ✅ **Visual Organization**: Clean, logical grouping by company
- ✅ **Professional Appearance**: Builds trust, looks like enterprise software
- ✅ **Scalability**: Handles 5 or 500 applications elegantly
- ✅ **Competitive Advantage**: No other job tracker offers this level of organization
- ✅ **Search Flexibility**: `label:"JobTracker/Meta"` (all Meta) or `label:"JobTracker"` (all jobs)

**Smart Implementation Strategy:**
```typescript
// Hierarchical with fallback to flat if hitting Gmail's 500 label limit
const createSmartLabels = async (company: string, position: string, status: string) => {
  const currentLabelCount = await getLabelCount(gmail)
  
  if (currentLabelCount > 450) {
    // Fallback to flat if approaching limit
    await createFlatLabel(gmail, `JobTracker-${company}-${position}-${status}`)
  } else {
    // Default hierarchical structure
    const labels = [
      'JobTracker',
      `JobTracker/${company} - ${position}`,
      `JobTracker/${company} - ${position}/${status}`
    ]
    
    for (const label of labels) {
      await createLabelIfNotExists(gmail, label)
    }
  }
}
```

**Outlook Categories:**
```
JobTracker - Meta - Software Engineer - Applied
JobTracker - Meta - Software Engineer - Interview
JobTracker - Google - Product Manager - Applied
JobTracker - Netflix - Data Scientist - Applied
```

### Auto-Labeling Workflow

#### 1. Initial Email Processing
```
New Email → AI Parsing → Create Application → Apply Label/Category
```

#### 2. Status Update Processing  
```
Follow-up Email → AI Parsing → Detect Duplicate → Update Status → Update Label/Category
```

#### 3. Duplicate Detection Logic
```typescript
// Check for existing application with same company + position
const existingApp = await supabase
  .from('applications')
  .select('*')
  .eq('user_id', userId)
  .eq('company_name', companyName)
  .eq('position_title', positionTitle)
  .single()

if (existingApp) {
  // Update existing application
  await updateApplicationStatus(existingApp.id, newStatus)
  await updateEmailLabels(emailAccount, existingApp, oldStatus, newStatus)
} else {
  // Create new application
  const newApp = await createApplication(applicationData)
  await applyInitialLabels(emailAccount, newApp)
}
```

### Implementation Details

#### Gmail Auto-Labeling
```typescript
// supabase/functions/email-sync/gmail-labeling.ts
export async function updateGmailLabels(
  emailAccount: EmailAccount,
  application: Application,
  oldStatus?: string
) {
  const gmail = getGmailClient(emailAccount.access_token)
  
  // Create hierarchical label structure
  const baseLabel = 'JobTracker'
  const companyPositionLabel = `${baseLabel}/${application.company_name} - ${application.position_title}`
  const newStatusLabel = `${companyPositionLabel}/${application.current_status}`
  const oldStatusLabel = oldStatus ? `${companyPositionLabel}/${oldStatus}` : null
  
  // 1. Ensure all parent labels exist
  await createLabelIfNotExists(gmail, baseLabel)
  await createLabelIfNotExists(gmail, companyPositionLabel)
  await createLabelIfNotExists(gmail, newStatusLabel)
  
  // 2. Find all emails related to this application
  const emailIds = await findApplicationEmails(gmail, application)
  
  // 3. Update labels on all related emails
  for (const emailId of emailIds) {
    // Remove old status label
    if (oldStatusLabel) {
      await removeGmailLabel(gmail, emailId, oldStatusLabel)
    }
    
    // Add new status label
    await addGmailLabel(gmail, emailId, newStatusLabel)
  }
  
  // 4. Update database tracking
  await updateLabelTracking(application.id, emailAccount.id, newStatusLabel, oldStatusLabel)
}

async function createLabelIfNotExists(gmail: any, labelName: string) {
  try {
    // Check if label exists
    const labels = await gmail.users.labels.list({ userId: 'me' })
    const existingLabel = labels.data.labels?.find(l => l.name === labelName)
    
    if (!existingLabel) {
      // Create new label
      await gmail.users.labels.create({
        userId: 'me',
        resource: {
          name: labelName,
          messageListVisibility: 'show',
          labelListVisibility: 'labelShow'
        }
      })
    }
  } catch (error) {
    console.error(`Error creating Gmail label ${labelName}:`, error)
  }
}

async function findApplicationEmails(gmail: any, application: Application) {
  // Search for emails related to this application
  const searchQueries = [
    `from:"${application.company_name}"`,
    `subject:"${application.position_title}"`,
    `subject:"${application.company_name}"`,
    // Add more search patterns for job-related emails
  ]
  
  const emailIds = new Set<string>()
  
  for (const query of searchQueries) {
    try {
      const response = await gmail.users.messages.list({
        userId: 'me',
        q: query,
        maxResults: 50
      })
      
      response.data.messages?.forEach(m => emailIds.add(m.id))
    } catch (error) {
      console.error(`Error searching emails with query ${query}:`, error)
    }
  }
  
  return Array.from(emailIds)
}
```

#### Outlook Auto-Categorization
```typescript
// supabase/functions/email-sync/outlook-categorization.ts
export async function updateOutlookCategories(
  emailAccount: EmailAccount,
  application: Application,
  oldStatus?: string
) {
  const graph = getMicrosoftGraphClient(emailAccount.access_token)
  
  // Outlook uses flat category names (no hierarchical structure)
  const newCategory = `JobTracker - ${application.company_name} - ${application.position_title} - ${application.current_status}`
  const oldCategory = oldStatus ? `JobTracker - ${application.company_name} - ${application.position_title} - ${oldStatus}` : null
  
  // 1. Ensure category exists
  await createCategoryIfNotExists(graph, newCategory)
  
  // 2. Find all emails related to this application
  const emailIds = await findApplicationEmailsOutlook(graph, application)
  
  // 3. Update categories on all related emails
  for (const emailId of emailIds) {
    // Remove old category
    if (oldCategory) {
      await removeOutlookCategory(graph, emailId, oldCategory)
    }
    
    // Add new category
    await addOutlookCategory(graph, emailId, newCategory)
  }
  
  // 4. Update database tracking
  await updateLabelTracking(application.id, emailAccount.id, newCategory, oldCategory)
}

async function createCategoryIfNotExists(graph: any, categoryName: string) {
  try {
    // Check if category exists
    const categories = await graph.api('/me/outlook/masterCategories').get()
    const existingCategory = categories.value.find(c => c.displayName === categoryName)
    
    if (!existingCategory) {
      // Create new category with a color
      await graph.api('/me/outlook/masterCategories').post({
        displayName: categoryName,
        color: 'preset2' // Blue color for job tracking
      })
    }
  } catch (error) {
    console.error(`Error creating Outlook category ${categoryName}:`, error)
  }
}
```

### Database Schema Updates

```sql
-- Add auto-labeling tracking to applications table
ALTER TABLE applications ADD COLUMN auto_labeling_enabled BOOLEAN DEFAULT TRUE;
ALTER TABLE applications ADD COLUMN current_email_label TEXT;
ALTER TABLE applications ADD COLUMN label_last_updated TIMESTAMPTZ;

-- Email labeling history tracking
CREATE TABLE email_label_history (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  application_id UUID REFERENCES applications(id) ON DELETE CASCADE NOT NULL,
  email_account_id UUID REFERENCES email_accounts(id) ON DELETE CASCADE NOT NULL,
  old_label TEXT,
  new_label TEXT NOT NULL,
  provider TEXT NOT NULL CHECK (provider IN ('gmail', 'outlook')),
  changed_at TIMESTAMPTZ DEFAULT NOW(),
  email_ids TEXT[] DEFAULT '{}' -- Array of email IDs that were labeled
);

-- User email labeling preferences
CREATE TABLE email_labeling_preferences (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  auto_labeling_enabled BOOLEAN DEFAULT TRUE,
  label_prefix TEXT DEFAULT 'JobTracker',
  apply_to_existing_emails BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id)
);

-- Indexes for performance
CREATE INDEX idx_email_label_history_application ON email_label_history(application_id);
CREATE INDEX idx_email_label_history_account ON email_label_history(email_account_id);
CREATE INDEX idx_email_labeling_preferences_user ON email_labeling_preferences(user_id);
```

### User Settings & Controls

```typescript
// User can control auto-labeling behavior
interface EmailLabelingPreferences {
  auto_labeling_enabled: boolean
  label_prefix: string // Default: "JobTracker"
  apply_to_existing_emails: boolean
  providers: {
    gmail: boolean
    outlook: boolean
  }
}

// Settings component allows users to:
// - Enable/disable auto-labeling per provider
// - Customize label prefix
// - Choose whether to label existing emails
// - Retroactively apply labels to past emails
```

### Edge Cases Handling

#### 1. Multiple Email Accounts
- Label each account separately
- Don't cross-contaminate between accounts
- User can enable/disable per account

#### 2. Existing User Labels
- Check for existing labels before creating
- Don't overwrite user's personal organization
- Use unique prefix to avoid conflicts

#### 3. API Rate Limits
- Batch label operations
- Implement retry logic with exponential backoff
- Queue label updates for processing

#### 4. Provider Limitations
- **Gmail**: 1000 label operations per day per user
- **Outlook**: 500 category operations per day per user
- Implement usage tracking and warnings

### Benefits for Users

#### 📧 **Email Organization**
- Automatic folder structure in email client
- Easy filtering by company, position, or status
- Visual progress tracking of applications
- Searchable by labels/categories

#### 🔄 **Real-time Updates**  
- Status changes automatically update email labels
- No manual email management needed
- Consistent organization across all job emails
- Retroactive labeling of related emails

#### 📊 **Enhanced Analytics**
- Track email response patterns by company
- Measure time between status changes
- Identify fast vs slow company processes
- Export organized emails for analysis

---

## 🚀 User Onboarding Flow Design

### Optimal User Journey: Email Verification + Smart Auto-Connect

#### Step 1: Landing & Sign Up Page
```
┌─────────────────────────────────────┐
│  Track Your Job Applications        │
│  with AI-Powered Email Parsing      │
│                                     │
│  ┌─────────────────────────────────┐ │
│  │ Email: user@gmail.com           │ │
│  └─────────────────────────────────┘ │
│  ┌─────────────────────────────────┐ │
│  │ Password: ****************      │ │
│  └─────────────────────────────────┘ │
│  ┌─────────────────────────────────┐ │
│  │     Create Account              │ │
│  └─────────────────────────────────┘ │
│                                     │
│  Or sign up with:                   │
│  [Google] [Microsoft] [GitHub]      │
└─────────────────────────────────────┘
```

**Implementation**: `/app/(auth)/signup/page.tsx`
- Glass-themed signup form with shadcn/ui components
- OAuth buttons for Google/Microsoft (auto-email verification)
- Email/password form triggers Supabase Auth signup with OTP

#### Step 2: Email Verification (OTP)
```
┌─────────────────────────────────────┐
│  📧 Verify your email               │
│                                     │
│  We sent a verification code to:    │
│  user@gmail.com                     │
│                                     │
│  ┌─────────────────────────────────┐ │
│  │ Enter 6-digit code: [_][_][_]   │ │
│  │                     [_][_][_]   │ │
│  └─────────────────────────────────┘ │
│                                     │
│  ┌─────────────────────────────────┐ │
│  │     Verify Email                │ │
│  └─────────────────────────────────┘ │
│                                     │
│  Didn't receive it?                 │
│  [Resend code] • [Change email]     │
│                                     │
│  ⏰ Code expires in 5:00            │
└─────────────────────────────────────┘
```

**Implementation**: `/app/(auth)/verify-email/page.tsx`
- Custom OTP input component with auto-focus and paste support
- Countdown timer for resend functionality
- Supabase `auth.verifyOtp()` integration
- Space-themed loading states with floating particles

#### Step 3: Smart Email Connection Prompt
```
┌─────────────────────────────────────┐
│  🎉 Email verified!                 │
│                                     │
│  Ready to track your job            │
│  applications from user@gmail.com?  │
│                                     │
│  ┌─────────────────────────────────┐ │
│  │ ✉️  Connect Gmail Account       │ │
│  │     Start tracking applications │ │
│  │     from this verified email    │ │
│  └─────────────────────────────────┘ │
│                                     │
│  ┌─────────────────────────────────┐ │
│  │     Connect Gmail               │ │
│  └─────────────────────────────────┘ │
│                                     │
│  ┌─────────────────────────────────┐ │
│  │     Skip for now                │ │
│  └─────────────────────────────────┘ │
└─────────────────────────────────────┘
```

**Implementation**: `/app/(auth)/connect-email/page.tsx`
- Detect email provider from verified address
- Context-aware messaging (Gmail vs Outlook vs other)
- Gmail/Outlook OAuth flow initiation
- Glass card with cosmic button styling

#### Step 4A: Email Scanning & Processing
```
┌─────────────────────────────────────┐
│  🔄 Scanning your emails...         │
│                                     │
│  ┌─────────────────────────────────┐ │
│  │ ████████████░░░  75%            │ │
│  └─────────────────────────────────┘ │
│                                     │
│  Found 12 job application emails    │
│  Processing with AI...              │
│                                     │
│  [View Dashboard] (auto-redirect)   │
└─────────────────────────────────────┘
```

**Implementation**: `/app/(auth)/processing/page.tsx`
- Real-time progress bar using Supabase Realtime
- Trigger Edge Function for email sync
- Stream processing updates via WebSocket
- Auto-redirect to dashboard when complete
- Cosmic loading animations and particle effects

#### Step 4B: Demo Dashboard (Skip Flow)
```
┌─────────────────────────────────────┐
│  📊 Dashboard - Demo View           │
│                                     │
│  Here's what your dashboard will    │
│  look like with real data:          │
│                                     │
│  ┌─────────────────────────────────┐ │
│  │ 📧 Demo Company - SWE Role      │ │
│  │    Applied: May 15              │ │
│  │    Status: Phone Interview      │ │
│  └─────────────────────────────────┘ │
│                                     │
│  ┌─────────────────────────────────┐ │
│  │ 🔗 Connect Email to See Real    │ │
│  │    Applications                 │ │
│  └─────────────────────────────────┘ │
└─────────────────────────────────────┘
```

**Implementation**: `/app/(dashboard)/dashboard/page.tsx`
- Demo data showing potential value
- Clear call-to-action for email connection
- Persistent banner encouraging email setup
- All components styled with space glass theme

### Onboarding Components Structure

```typescript
// components/auth/onboarding-flow.tsx
export const OnboardingProvider = ({ children }) => {
  // Manages onboarding state across steps
}

// components/auth/signup-form.tsx
export const SignupForm = () => {
  // Email/password form with validation
  // OAuth provider buttons
  // Glass card styling
}

// components/auth/otp-verification.tsx
export const OTPVerification = () => {
  // 6-digit input with auto-focus
  // Resend timer functionality
  // Error handling and validation
}

// components/auth/email-connection-prompt.tsx
export const EmailConnectionPrompt = () => {
  // Smart provider detection
  // Context-aware messaging
  // OAuth initiation buttons
}

// components/auth/email-processing.tsx
export const EmailProcessing = () => {
  // Real-time progress tracking
  // Processing status updates
  // Auto-redirect logic
}

// components/dashboard/demo-view.tsx
export const DemoView = () => {
  // Sample application cards
  // Value proposition display
  // Email connection CTA
}
```

### Expected Conversion Rates

**Email/Password Flow:**
- Signup → OTP: 85%
- OTP Verification → Email Connect Prompt: 75%
- Email Connect Prompt → Connected: 70%
- **Overall Activation: 45%**

**OAuth Flow (Google/Microsoft):**
- OAuth Signup → Auto-connected: 85%
- **Overall Activation: 85%**

**Why This Flow Works:**
1. **Progressive commitment** - Each step builds on the previous
2. **Immediate value** - Users see their applications within minutes
3. **Natural progression** - "You verified this email, want to connect it?"
4. **Fallback options** - Demo view for users who skip
5. **Professional UX** - Email verification builds trust

---

## 📁 Project Structure

```
jobtracker-saas/
├── app/                              # Next.js 14 App Router
│   ├── (auth)/
│   │   ├── login/
│   │   ├── signup/
│   │   └── verify-email/
│   │
│   ├── (dashboard)/
│   │   ├── dashboard/
│   │   ├── applications/
│   │   ├── emails/
│   │   ├── analytics/
│   │   ├── settings/
│   │   └── billing/
│   │
│   ├── (marketing)/
│   │   ├── page.tsx                  # Landing page
│   │   ├── pricing/
│   │   └── docs/
│   │
│   ├── api/                          # API routes for webhooks
│   │   ├── stripe/
│   │   └── oauth/
│   │
│   ├── globals.css
│   └── layout.tsx
│
├── components/
│   ├── ui/                           # shadcn/ui components
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── input.tsx
│   │   ├── dialog.tsx
│   │   ├── select.tsx
│   │   ├── table.tsx
│   │   ├── badge.tsx
│   │   └── toast.tsx
│   │
│   ├── custom/                       # Custom space-themed components
│   │   ├── glass-card.tsx
│   │   ├── cosmic-button.tsx
│   │   ├── space-background.tsx
│   │   ├── floating-particles.tsx
│   │   └── nebula-gradient.tsx
│   │
│   ├── auth/
│   │   ├── login-form.tsx
│   │   ├── signup-form.tsx
│   │   ├── otp-verification.tsx
│   │   └── oauth-buttons.tsx
│   │
│   ├── applications/
│   │   ├── application-card.tsx
│   │   ├── application-list.tsx
│   │   ├── application-filters.tsx
│   │   ├── application-timeline.tsx
│   │   ├── status-badge.tsx
│   │   └── quick-add-form.tsx
│   │
│   ├── email/
│   │   ├── email-connection-card.tsx
│   │   ├── email-sync-status.tsx
│   │   ├── oauth-flow.tsx
│   │   └── email-preview.tsx
│   │
│   ├── dashboard/
│   │   ├── stats-overview.tsx
│   │   ├── recent-activity.tsx
│   │   ├── quick-actions.tsx
│   │   ├── application-funnel.tsx
│   │   └── weekly-summary.tsx
│   │
│   ├── analytics/
│   │   ├── response-rate-chart.tsx
│   │   ├── timeline-chart.tsx
│   │   ├── company-breakdown.tsx
│   │   ├── status-distribution.tsx
│   │   └── insights-panel.tsx
│   │
│   └── billing/
│       ├── pricing-cards.tsx
│       ├── subscription-manager.tsx
│       ├── usage-display.tsx
│       └── payment-history.tsx
│
├── lib/
│   ├── supabase/
│   │   ├── client.ts                 # Supabase client setup
│   │   ├── server.ts                 # Server-side client
│   │   ├── middleware.ts             # Auth middleware
│   │   └── types.ts                  # Generated types
│   │
│   ├── services/
│   │   ├── auth-service.ts
│   │   ├── application-service.ts
│   │   ├── email-service.ts
│   │   ├── billing-service.ts
│   │   └── analytics-service.ts
│   │
│   ├── hooks/
│   │   ├── use-auth.ts
│   │   ├── use-applications.ts
│   │   ├── use-email-accounts.ts
│   │   ├── use-subscription.ts
│   │   ├── use-analytics.ts
│   │   └── use-real-time.ts
│   │
│   ├── utils/
│   │   ├── cn.ts                     # Class name utility
│   │   ├── date-utils.ts
│   │   ├── formatters.ts
│   │   ├── validators.ts
│   │   └── constants.ts
│   │
│   └── types/
│       ├── database.ts               # Supabase generated types
│       ├── application.ts
│       ├── user.ts
│       └── billing.ts
│
├── supabase/
│   ├── functions/                    # Edge Functions
│   │   ├── email-sync/
│   │   │   ├── index.ts
│   │   │   └── gmail-oauth.ts
│   │   │
│   │   ├── ai-parsing/
│   │   │   ├── index.ts
│   │   │   ├── email-parser.ts
│   │   │   └── confidence-scorer.ts
│   │   │
│   │   ├── stripe-webhook/
│   │   │   ├── index.ts
│   │   │   └── subscription-handler.ts
│   │   │
│   │   ├── analytics/
│   │   │   ├── index.ts
│   │   │   └── insights-generator.ts
│   │   │
│   │   └── shared/
│   │       ├── types.ts
│   │       ├── email-clients.ts
│   │       └── ai-prompts.ts
│   │
│   ├── migrations/                   # Database schema
│   │   ├── 20250601000001_initial_schema.sql
│   │   ├── 20250601000002_rls_policies.sql
│   │   └── 20250601000003_indexes.sql
│   │
│   ├── seed.sql                      # Initial data
│   └── config.toml                   # Supabase config
│
├── styles/
│   ├── globals.css
│   ├── space-theme.css               # Space glass theme
│   └── components.css
│
├── public/
│   ├── icons/
│   ├── images/
│   └── space-assets/                 # Space-themed graphics
│
├── context-7/                        # Documentation access for Claude Code
│   └── README.md                     # Instructions for latest docs access
│
├── package.json
├── tailwind.config.ts
├── next.config.js
├── tsconfig.json
└── README.md
```

---

## 🎨 Space-Themed Design System with shadcn/ui

### Core Design Tokens
```css
/* globals.css - Space Theme Variables */
@import "tailwindcss/base";
@import "tailwindcss/components";
@import "tailwindcss/utilities";

@layer base {
  :root {
    /* Space Colors */
    --background: 220 13% 6%;          /* Deep space dark */
    --foreground: 220 8% 95%;          /* Star white */
    
    --card: 220 12% 9%;                /* Card background */
    --card-foreground: 220 8% 95%;
    
    --popover: 220 12% 9%;
    --popover-foreground: 220 8% 95%;
    
    --primary: 262 80% 45%;            /* Nebula purple */
    --primary-foreground: 220 8% 95%;
    
    --secondary: 215 58% 45%;          /* Cosmic blue */
    --secondary-foreground: 220 8% 95%;
    
    --muted: 220 8% 15%;
    --muted-foreground: 220 5% 65%;
    
    --accent: 45 93% 60%;              /* Cosmic gold */
    --accent-foreground: 220 13% 6%;
    
    --destructive: 0 75% 60%;
    --destructive-foreground: 220 8% 95%;
    
    --border: 220 8% 20%;
    --input: 220 8% 20%;
    --ring: 262 80% 45%;
    
    /* Glass Effects */
    --glass-bg: rgba(255, 255, 255, 0.05);
    --glass-border: rgba(255, 255, 255, 0.1);
    --glass-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
    
    /* Animations */
    --duration-slow: 1000ms;
    --duration-normal: 300ms;
    --duration-fast: 150ms;
  }
}

/* Glass morphism utilities */
.glass {
  background: var(--glass-bg);
  backdrop-filter: blur(16px);
  border: 1px solid var(--glass-border);
  box-shadow: var(--glass-shadow);
}

.glass-card {
  @apply glass rounded-xl p-6 transition-all duration-300;
}

.glass-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 12px 48px rgba(0, 0, 0, 0.4);
}

/* Cosmic animations */
@keyframes float {
  0%, 100% { transform: translateY(0px) rotate(0deg); }
  50% { transform: translateY(-10px) rotate(1deg); }
}

@keyframes pulse-glow {
  0%, 100% { box-shadow: 0 0 20px var(--primary); }
  50% { box-shadow: 0 0 40px var(--primary), 0 0 60px var(--primary); }
}

.floating { animation: float 6s ease-in-out infinite; }
.pulse-glow { animation: pulse-glow 3s ease-in-out infinite; }
```

### Custom Components
```tsx
// components/custom/glass-card.tsx
import { cn } from "@/lib/utils"
import { Card } from "@/components/ui/card"

interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "hoverable" | "glowing"
  children: React.ReactNode
}

export function GlassCard({ 
  className, 
  variant = "default", 
  children, 
  ...props 
}: GlassCardProps) {
  return (
    <Card
      className={cn(
        "glass-card",
        {
          "hover:scale-[1.02] cursor-pointer": variant === "hoverable",
          "pulse-glow": variant === "glowing",
        },
        className
      )}
      {...props}
    >
      {children}
    </Card>
  )
}
```

```tsx
// components/custom/cosmic-button.tsx
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface CosmicButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "cosmic" | "glass" | "outline"
  size?: "sm" | "md" | "lg"
  children: React.ReactNode
}

export function CosmicButton({ 
  className, 
  variant = "cosmic", 
  size = "md",
  children, 
  ...props 
}: CosmicButtonProps) {
  return (
    <Button
      className={cn(
        "relative overflow-hidden transition-all duration-300",
        {
          "bg-gradient-to-r from-primary to-secondary hover:from-primary/80 hover:to-secondary/80 text-primary-foreground": variant === "cosmic",
          "glass hover:bg-white/10": variant === "glass",
          "border border-primary/50 bg-transparent hover:bg-primary/10": variant === "outline",
        },
        {
          "h-8 px-3 text-sm": size === "sm",
          "h-10 px-4": size === "md",
          "h-12 px-6 text-lg": size === "lg",
        },
        className
      )}
      {...props}
    >
      <span className="relative z-10">{children}</span>
      {variant === "cosmic" && (
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full hover:translate-x-full transition-transform duration-700" />
      )}
    </Button>
  )
}
```

---

## 🗄️ Database Schema (Supabase)

```sql
-- migrations/20250601000001_initial_schema.sql

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table (extends Supabase auth.users)
CREATE TABLE public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  subscription_tier TEXT DEFAULT 'free' CHECK (subscription_tier IN ('free', 'starter', 'pro', 'enterprise')),
  stripe_customer_id TEXT,
  stripe_subscription_id TEXT,
  subscription_status TEXT DEFAULT 'active',
  trial_ends_at TIMESTAMPTZ,
  current_period_end TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Email accounts
CREATE TABLE public.email_accounts (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  email_address TEXT NOT NULL,
  provider TEXT NOT NULL CHECK (provider IN ('gmail', 'outlook', 'yahoo')),
  access_token TEXT, -- Encrypted
  refresh_token TEXT, -- Encrypted
  is_active BOOLEAN DEFAULT true,
  last_sync TIMESTAMPTZ,
  sync_status TEXT DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Applications
CREATE TABLE public.applications (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  company_name TEXT NOT NULL,
  position_title TEXT NOT NULL,
  application_date DATE NOT NULL,
  current_status TEXT DEFAULT 'applied' CHECK (
    current_status IN ('applied', 'screening', 'interview', 'technical', 'final', 'offer', 'rejected', 'withdrawn')
  ),
  source_url TEXT,
  location TEXT,
  salary_range TEXT,
  job_description TEXT,
  notes TEXT,
  confidence_score REAL DEFAULT 0.0,
  tags TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Application status history
CREATE TABLE public.application_status_history (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  application_id UUID REFERENCES public.applications(id) ON DELETE CASCADE NOT NULL,
  old_status TEXT,
  new_status TEXT NOT NULL,
  changed_at TIMESTAMPTZ DEFAULT NOW(),
  source_email_id TEXT,
  confidence_score REAL DEFAULT 0.0,
  notes TEXT
);

-- Processed emails (to avoid reprocessing)
CREATE TABLE public.processed_emails (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  email_account_id UUID REFERENCES public.email_accounts(id) ON DELETE CASCADE NOT NULL,
  email_id TEXT NOT NULL, -- Gmail/Outlook message ID
  subject TEXT,
  sender TEXT,
  received_at TIMESTAMPTZ,
  parsed_data JSONB,
  processing_status TEXT DEFAULT 'pending',
  error_message TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(email_account_id, email_id)
);

-- Usage tracking for billing
CREATE TABLE public.usage_tracking (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  month_year TEXT NOT NULL, -- '2025-06'
  applications_processed INTEGER DEFAULT 0,
  emails_parsed INTEGER DEFAULT 0,
  emails_labeled INTEGER DEFAULT 0, -- Track labeling operations
  api_calls INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, month_year)
);

-- Email labeling history tracking
CREATE TABLE public.email_label_history (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  application_id UUID REFERENCES public.applications(id) ON DELETE CASCADE NOT NULL,
  email_account_id UUID REFERENCES public.email_accounts(id) ON DELETE CASCADE NOT NULL,
  old_label TEXT,
  new_label TEXT NOT NULL,
  provider TEXT NOT NULL CHECK (provider IN ('gmail', 'outlook')),
  changed_at TIMESTAMPTZ DEFAULT NOW(),
  email_ids TEXT[] DEFAULT '{}' -- Array of email IDs that were labeled
);

-- User email labeling preferences
CREATE TABLE public.email_labeling_preferences (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  auto_labeling_enabled BOOLEAN DEFAULT TRUE,
  label_prefix TEXT DEFAULT 'JobTracker',
  apply_to_existing_emails BOOLEAN DEFAULT TRUE,
  gmail_labeling_enabled BOOLEAN DEFAULT TRUE,
  outlook_labeling_enabled BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id)
);

-- Add auto-labeling fields to applications table
ALTER TABLE applications ADD COLUMN auto_labeling_enabled BOOLEAN DEFAULT TRUE;
ALTER TABLE applications ADD COLUMN current_email_label TEXT;
ALTER TABLE applications ADD COLUMN label_last_updated TIMESTAMPTZ;

-- Indexes for performance
CREATE INDEX idx_applications_user_id ON public.applications(user_id);
CREATE INDEX idx_applications_status ON public.applications(current_status);
CREATE INDEX idx_applications_date ON public.applications(application_date DESC);
CREATE INDEX idx_applications_company ON public.applications(company_name);
CREATE INDEX idx_email_accounts_user_id ON public.email_accounts(user_id);
CREATE INDEX idx_processed_emails_user_id ON public.processed_emails(user_id);
CREATE INDEX idx_processed_emails_status ON public.processed_emails(processing_status);
CREATE INDEX idx_usage_tracking_user_month ON public.usage_tracking(user_id, month_year);
CREATE INDEX idx_email_label_history_application ON public.email_label_history(application_id);
CREATE INDEX idx_email_label_history_account ON public.email_label_history(email_account_id);
CREATE INDEX idx_email_labeling_preferences_user ON public.email_labeling_preferences(user_id);

-- Updated_at triggers
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_applications_updated_at BEFORE UPDATE ON public.applications
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
```

---

## ⚡ Supabase Edge Functions

### 1. Email Sync Function
```typescript
// supabase/functions/email-sync/index.ts
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { emailAccountId } = await req.json()
    
    // Get email account details
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const { data: emailAccount } = await supabase
      .from('email_accounts')
      .select('*')
      .eq('id', emailAccountId)
      .single()

    if (!emailAccount) {
      throw new Error('Email account not found')
    }

    // Sync emails based on provider
    let syncResult
    if (emailAccount.provider === 'gmail') {
      syncResult = await syncGmailEmails(emailAccount)
    } else if (emailAccount.provider === 'outlook') {
      syncResult = await syncOutlookEmails(emailAccount)
    }

    // Update sync status
    await supabase
      .from('email_accounts')
      .update({ 
        last_sync: new Date().toISOString(),
        sync_status: 'completed'
      })
      .eq('id', emailAccountId)

    return new Response(
      JSON.stringify({ success: true, syncResult }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
    )
  }
})

async function syncGmailEmails(emailAccount: any) {
  // Gmail API integration
  // Fetch new emails
  // Process with AI parsing
  // Store results
  // Apply hierarchical labels
}

async function syncOutlookEmails(emailAccount: any) {
  // Microsoft Graph API integration
  // Fetch new emails  
  // Process with AI parsing
  // Store results
  // Apply hierarchical categories
}
```

### 2. AI Parsing Function
```typescript
// supabase/functions/ai-parsing/index.ts
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { OpenAI } from "https://deno.land/x/openai@v4.24.0/mod.ts"

const openai = new OpenAI({
  apiKey: Deno.env.get('OPENAI_API_KEY'),
})

serve(async (req) => {
  const { emailContent, emailMetadata } = await req.json()

  const systemPrompt = `
You are an AI assistant that parses job application emails. 
Extract the following information from the email:
- Company name
- Position/role title
- Application status (applied, screening, interview, rejected, etc.)
- Any mentioned dates
- Confidence score (0-1)

Return JSON format only.
`

  const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: `Email: ${emailContent}` }
    ],
    response_format: { type: "json_object" }
  })

  const parsedData = JSON.parse(completion.choices[0].message.content || '{}')

  return new Response(JSON.stringify(parsedData), {
    headers: { 'Content-Type': 'application/json' }
  })
})
```



---

## 🚀 Development Workflow

### 1. Setup Commands
```bash
# Initialize project
npx create-next-app@latest jobtracker-saas --typescript --tailwind --eslint --app
cd jobtracker-saas

# Install dependencies
npm install @supabase/supabase-js @supabase/ssr
npm install lucide-react class-variance-authority clsx tailwind-merge
npm install @radix-ui/react-dialog @radix-ui/react-select @radix-ui/react-toast
npm install stripe @stripe/stripe-js
npm install date-fns recharts

# Install shadcn/ui
npx shadcn-ui@latest init
npx shadcn-ui@latest add button card input dialog select table badge toast

# Setup Supabase
npx supabase init
npx supabase start
npx supabase gen types typescript --local > lib/supabase/types.ts
```

### 2. Development Process
```bash
# Local development
npm run dev                    # Frontend
npx supabase start            # Local Supabase
npx supabase functions serve # Edge functions

# Database changes
npx supabase db reset         # Reset local DB
npx supabase db push         # Push schema changes
npx supabase gen types typescript --local > lib/supabase/types.ts

# Deploy
npx supabase functions deploy # Deploy edge functions
npx supabase db push         # Deploy database changes
npm run build && npm run start # Deploy frontend
```

### 3. Essential GitHub Pushes (Minimum)

#### **Phase 1: Core MVP (Weeks 1-4) - 8 Essential Pushes**

**Push 1: Project Foundation**
```bash
git commit -m "feat: initial setup - Next.js + Supabase + shadcn/ui + space theme"
git push origin main
```
- Complete project structure
- Space theme design system
- shadcn/ui components setup

**Push 2: Authentication System**
```bash
git commit -m "feat: complete auth flow - signup, OTP verification, email connection"
git push origin main
```
- Signup/login forms
- OTP verification component
- OAuth integration (Google/Microsoft)
- Complete onboarding flow

**Push 3: Database Schema**
```bash
git commit -m "feat: database schema with RLS policies and auto-labeling support"
git push origin main
```
- All tables (users, applications, email_accounts, etc.)
- RLS policies
- Indexes and triggers
- Migration files

**Push 4: Email Integration**
```bash
git commit -m "feat: Gmail + Outlook OAuth and email sync Edge Functions"
git push origin main
```
- Gmail API integration
- Outlook Graph API integration
- Email sync Edge Functions
- OAuth flow completion

**Push 5: Auto-Labeling System**
```bash
git commit -m "feat: hierarchical auto-labeling for Gmail and Outlook"
git push origin main
```
- Gmail hierarchical labels
- Outlook categories
- Duplicate detection
- Label update logic

**Push 6: AI Email Parsing**
```bash
git commit -m "feat: AI-powered email parsing with OpenAI integration"
git push origin main
```
- OpenAI Edge Function
- Email content parsing
- Application data extraction
- Confidence scoring

**Push 7: Core Application Features**
```bash
git commit -m "feat: application CRUD, dashboard, and real-time updates"
git push origin main
```
- Application management (create, read, update, delete)
- Dashboard with stats
- Real-time Supabase subscriptions
- Application cards and lists

**Push 8: MVP Complete**
```bash
git commit -m "feat: MVP complete - working job tracker with auto-labeling"
git tag -a v1.0.0-mvp -m "MVP Release: Core job tracking with AI parsing and auto-labeling"
git push origin main --tags
```
- Demo data and onboarding
- Error handling
- Basic responsive design
- Deployment ready

#### **Phase 2: AI & Analytics (Weeks 5-8) - 4 Essential Pushes**

**Push 9: Enhanced AI Features**
```bash
git commit -m "feat: advanced AI parsing and batch processing"
git push origin main
```
- Improved parsing accuracy
- Batch email processing
- Background job queues

**Push 10: Analytics Dashboard**
```bash
git commit -m "feat: analytics dashboard with charts and insights"
git push origin main
```
- Response rate tracking
- Application funnel
- Company analytics
- Charts with Recharts

**Push 11: Advanced Features**
```bash
git commit -m "feat: advanced application management and insights"
git push origin main
```
- Application timeline
- Status history
- Smart insights
- Export functionality

**Push 12: Phase 2 Complete**
```bash
git commit -m "feat: AI and analytics features complete"
git tag -a v1.1.0 -m "Release: AI-powered insights and analytics"
git push origin main --tags
```

#### **Phase 3: Monetization (Weeks 9-12) - 4 Essential Pushes**

**Push 13: Stripe Integration**
```bash
git commit -m "feat: Stripe billing and subscription management"
git push origin main
```
- Stripe checkout
- Subscription plans
- Webhook handling
- Customer portal

**Push 14: Usage Limits & Billing**
```bash
git commit -m "feat: usage tracking and plan limitations"
git push origin main
```
- Free vs Pro features
- Usage tracking
- Billing enforcement
- Upgrade prompts

**Push 15: Premium Features**
```bash
git commit -m "feat: premium analytics and export features"
git push origin main
```
- Advanced analytics (Pro only)
- PDF/CSV exports
- Email notifications
- Premium UI components

**Push 16: Production Ready**
```bash
git commit -m "feat: production ready SaaS with full monetization"
git tag -a v1.2.0 -m "Release: Full SaaS with billing and premium features"
git push origin main --tags
```
- Performance optimization
- Error monitoring
- Security hardening
- Production deployment

#### **Emergency/Checkpoint Pushes (As Needed)**

**Before Major Changes:**
```bash
git commit -m "checkpoint: working state before [major change]"
git push origin main
```

**Critical Bug Fixes:**
```bash
git commit -m "fix: [critical issue description]"
git push origin main
```

**End of Week Backups:**
```bash
git commit -m "wip: week [X] progress - [brief status]"
git push origin main
```

---

**📊 Summary: 16 Essential Pushes Total**
- **Phase 1 (MVP)**: 8 pushes
- **Phase 2 (AI/Analytics)**: 4 pushes  
- **Phase 3 (Monetization)**: 4 pushes
- **Plus**: Emergency/checkpoint pushes as needed

**🎯 Minimum Goal**: 1-2 pushes per week with working features
**🏷️ Tags**: 3 major release tags (MVP, Analytics, Production)

---

## 📊 Key Features Implementation Priority

### Phase 1: Core MVP (Weeks 1-4)
1. **Authentication Flow** (OTP verification)
2. **Email Connection** (Gmail + Outlook OAuth)
3. **Basic Application Tracking** (CRUD operations)
4. **Auto-Labeling System** (Hierarchical Gmail labels + Outlook categories)
5. **Real-time Updates** (Supabase subscriptions)
6. **Glass Theme UI** (shadcn/ui + custom components)

### Phase 2: AI & Analytics (Weeks 5-8)
1. **AI Email Parsing** (OpenAI integration)
2. **Background Email Sync** (Edge functions)
3. **Analytics Dashboard** (Charts with Recharts)
4. **Application Insights** (AI-generated recommendations)
5. **Context 7 Integration** (Real-time data access)

### Phase 3: Monetization (Weeks 9-12)
1. **Stripe Integration** (Subscriptions)
2. **Usage Limits** (Free vs Pro tiers)
3. **Advanced Analytics** (Pro features)
4. **Export Features** (PDF/CSV reports)
5. **Email Notifications** (Weekly summaries)

This architecture eliminates the need for a separate Python backend while maintaining modularity and scalability. Everything runs on Supabase with TypeScript, making it simpler to develop and maintain.