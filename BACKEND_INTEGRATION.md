# Backend Integration Guide

This document explains how to integrate Supabase backend and Stripe payments into the Roya PWA prototype.

## Current State: Local Prototype

The app currently uses:
- **LocalAuthService**: localStorage-based authentication
- **LocalHabitsRepository**: localStorage for habits data
- **LocalSubscriptionService**: localStorage for subscription state
- **MockPaymentService**: Simulated Stripe payments
- **LocalAnalyticsService**: Console-based analytics logging

All data is stored in browser localStorage and persists between sessions on the same device.

---

## Switching to Supabase Backend

### Step 1: Enable Supabase

1. **Create a Supabase Project**
   - Go to https://supabase.com
   - Create a new project
   - Note your project URL and anon key

2. **Install Supabase Client**
   ```bash
   pnpm add @supabase/supabase-js
   ```

3. **Set Environment Variables**
   Create `.env.local`:
   ```env
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-key
   ```

### Step 2: Database Schema

Run this SQL in your Supabase SQL Editor:

```sql
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table (managed by Supabase Auth, but we can add custom fields)
-- No need to create auth.users, but we can create a profiles table

-- User settings
CREATE TABLE user_settings (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  theme TEXT DEFAULT 'calm',
  custom_background_url TEXT,
  custom_background_blur INTEGER DEFAULT 0,
  dark_mode BOOLEAN DEFAULT false,
  muslim_mode BOOLEAN DEFAULT false,
  location TEXT,
  city TEXT,
  country TEXT,
  pin_enabled BOOLEAN DEFAULT false,
  pin_hash TEXT,
  notifications_enabled BOOLEAN DEFAULT true,
  analytics_consent BOOLEAN DEFAULT false,
  marketing_consent BOOLEAN DEFAULT false,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Habits
CREATE TABLE habits (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('WIN', 'QUIT')),
  identity_statement TEXT,
  frequency TEXT NOT NULL CHECK (frequency IN ('daily', 'weekly', 'custom')),
  custom_schedule INTEGER[],
  reminder_times TEXT[],
  start_date DATE NOT NULL,
  notes TEXT,
  archived BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_habits_user_id ON habits(user_id);
CREATE INDEX idx_habits_archived ON habits(user_id, archived);

-- Habit logs
CREATE TABLE habit_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  habit_id UUID NOT NULL REFERENCES habits(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('done', 'missed', 'clean', 'relapse')),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(habit_id, date)
);

CREATE INDEX idx_habit_logs_habit_date ON habit_logs(habit_id, date);
CREATE INDEX idx_habit_logs_user_date ON habit_logs(user_id, date);

-- Mood logs
CREATE TABLE mood_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  emoji TEXT NOT NULL,
  score INTEGER NOT NULL CHECK (score >= 1 AND score <= 5),
  tags TEXT[],
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, date)
);

CREATE INDEX idx_mood_logs_user_date ON mood_logs(user_id, date);

-- Journal entries
CREATE TABLE journal_entries (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  content TEXT NOT NULL,
  privacy_mode BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, date)
);

CREATE INDEX idx_journal_entries_user_date ON journal_entries(user_id, date);

-- Goals
CREATE TABLE goals (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  timeframe TEXT NOT NULL CHECK (timeframe IN ('3m', '6m', '1y')),
  title TEXT NOT NULL,
  why TEXT NOT NULL,
  priority_order INTEGER NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_goals_user_timeframe ON goals(user_id, timeframe);

-- Goal milestones
CREATE TABLE goal_milestones (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  goal_id UUID NOT NULL REFERENCES goals(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  due_date DATE,
  completed BOOLEAN DEFAULT false,
  completed_at TIMESTAMPTZ,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_milestones_goal ON goal_milestones(goal_id);
CREATE INDEX idx_milestones_user_due ON goal_milestones(user_id, due_date);

-- Period settings
CREATE TABLE period_settings (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  cycle_length INTEGER NOT NULL,
  period_length INTEGER NOT NULL,
  last_start_date DATE NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Period logs
CREATE TABLE period_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  flow_level TEXT CHECK (flow_level IN ('light', 'medium', 'heavy')),
  symptoms TEXT[],
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, date)
);

CREATE INDEX idx_period_logs_user_date ON period_logs(user_id, date);

-- Salah settings
CREATE TABLE salah_settings (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  calculation_method TEXT NOT NULL,
  asr_madhhab TEXT NOT NULL,
  manual_adjustments JSONB DEFAULT '{}',
  location JSONB,
  city TEXT,
  country TEXT,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Salah times cache
CREATE TABLE salah_times_cache (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  prayer_name TEXT NOT NULL,
  time TEXT NOT NULL,
  location_hash TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, date, prayer_name)
);

CREATE INDEX idx_salah_times_user_date ON salah_times_cache(user_id, date);

-- Salah logs
CREATE TABLE salah_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  prayer_name TEXT NOT NULL,
  prayed BOOLEAN DEFAULT false,
  niyyah_text TEXT,
  prayed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, date, prayer_name)
);

CREATE INDEX idx_salah_logs_user_date ON salah_logs(user_id, date);

-- Subscriptions
CREATE TABLE subscriptions (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  plan TEXT NOT NULL CHECK (plan IN ('FREE', 'PRO_MONTHLY', 'PRO_YEARLY', 'LIFETIME')),
  status TEXT NOT NULL CHECK (status IN ('active', 'canceled', 'expired', 'trial')),
  stripe_customer_id TEXT,
  stripe_subscription_id TEXT,
  current_period_start TIMESTAMPTZ,
  current_period_end TIMESTAMPTZ,
  cancel_at_period_end BOOLEAN DEFAULT false,
  trial_ends_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Referrals
CREATE TABLE referrals (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  code TEXT UNIQUE NOT NULL,
  inviter_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  invited_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  reward_status TEXT NOT NULL CHECK (reward_status IN ('pending', 'granted', 'expired')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  used_at TIMESTAMPTZ
);

CREATE INDEX idx_referrals_inviter ON referrals(inviter_id);
CREATE INDEX idx_referrals_code ON referrals(code);

-- Consent logs
CREATE TABLE consent_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  consent_type TEXT NOT NULL CHECK (consent_type IN ('analytics', 'marketing', 'essential')),
  granted BOOLEAN NOT NULL,
  timestamp TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_consent_logs_user ON consent_logs(user_id);

-- Row Level Security (RLS) Policies

-- Enable RLS on all tables
ALTER TABLE user_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE habits ENABLE ROW LEVEL SECURITY;
ALTER TABLE habit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE mood_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE journal_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE goals ENABLE ROW LEVEL SECURITY;
ALTER TABLE goal_milestones ENABLE ROW LEVEL SECURITY;
ALTER TABLE period_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE period_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE salah_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE salah_times_cache ENABLE ROW LEVEL SECURITY;
ALTER TABLE salah_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE referrals ENABLE ROW LEVEL SECURITY;
ALTER TABLE consent_logs ENABLE ROW LEVEL SECURITY;

-- User settings policies
CREATE POLICY "Users can view own settings" ON user_settings FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own settings" ON user_settings FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own settings" ON user_settings FOR UPDATE USING (auth.uid() = user_id);

-- Habits policies
CREATE POLICY "Users can view own habits" ON habits FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own habits" ON habits FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own habits" ON habits FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own habits" ON habits FOR DELETE USING (auth.uid() = user_id);

-- Habit logs policies
CREATE POLICY "Users can view own habit logs" ON habit_logs FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own habit logs" ON habit_logs FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own habit logs" ON habit_logs FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own habit logs" ON habit_logs FOR DELETE USING (auth.uid() = user_id);

-- Repeat similar policies for all other tables...
-- (For brevity, the pattern is: users can only access their own data)

-- Functions for habit stats calculation
CREATE OR REPLACE FUNCTION calculate_habit_stats(p_habit_id UUID)
RETURNS TABLE (
  habit_id UUID,
  current_streak INTEGER,
  best_streak INTEGER,
  total_completions INTEGER,
  total_clean_days INTEGER,
  relapse_count INTEGER
) AS $$
DECLARE
  v_habit_type TEXT;
BEGIN
  -- Get habit type
  SELECT type INTO v_habit_type FROM habits WHERE id = p_habit_id;
  
  -- Calculate stats based on habit type
  -- (Implementation details omitted for brevity)
  -- This would calculate streaks, totals, etc.
  
  RETURN QUERY SELECT p_habit_id, 0, 0, 0, 0, 0; -- Placeholder
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function for account deletion
CREATE OR REPLACE FUNCTION delete_user_account()
RETURNS void AS $$
BEGIN
  -- Delete all user data
  DELETE FROM user_settings WHERE user_id = auth.uid();
  DELETE FROM habits WHERE user_id = auth.uid();
  DELETE FROM habit_logs WHERE user_id = auth.uid();
  DELETE FROM mood_logs WHERE user_id = auth.uid();
  DELETE FROM journal_entries WHERE user_id = auth.uid();
  DELETE FROM goals WHERE user_id = auth.uid();
  DELETE FROM goal_milestones WHERE user_id = auth.uid();
  DELETE FROM period_settings WHERE user_id = auth.uid();
  DELETE FROM period_logs WHERE user_id = auth.uid();
  DELETE FROM salah_settings WHERE user_id = auth.uid();
  DELETE FROM salah_times_cache WHERE user_id = auth.uid();
  DELETE FROM salah_logs WHERE user_id = auth.uid();
  DELETE FROM subscriptions WHERE user_id = auth.uid();
  DELETE FROM referrals WHERE inviter_id = auth.uid();
  DELETE FROM consent_logs WHERE user_id = auth.uid();
  
  -- Delete auth user (requires service role)
  -- This should be called from a secure backend endpoint
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

### Step 3: Implement Supabase Services

The stub implementations are already in place at:
- `src/services/supabase/SupabaseAuthService.ts`
- `src/services/supabase/SupabaseHabitsRepository.ts`

Complete these implementations following the patterns in the Local versions.

Example for SupabaseAuthService:

```typescript
import { createClient } from '@supabase/supabase-js';
import { IAuthService } from '../interfaces/IAuthService';
import { User, AuthSession } from '@/types';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export class SupabaseAuthService implements IAuthService {
  private supabase = createClient(supabaseUrl, supabaseAnonKey);

  async signUp(email: string, password: string, displayName?: string) {
    const { data, error } = await this.supabase.auth.signUp({
      email,
      password,
      options: {
        data: { display_name: displayName }
      }
    });
    
    if (error) throw error;
    
    return {
      user: this.mapSupabaseUser(data.user!),
      session: this.mapSupabaseSession(data.session!)
    };
  }

  // ... implement other methods
  
  private mapSupabaseUser(supabaseUser: any): User {
    return {
      id: supabaseUser.id,
      email: supabaseUser.email!,
      displayName: supabaseUser.user_metadata?.display_name,
      createdAt: new Date(supabaseUser.created_at),
      lastLoginAt: new Date(supabaseUser.last_sign_in_at || supabaseUser.created_at)
    };
  }

  private mapSupabaseSession(supabaseSession: any): AuthSession {
    return {
      userId: supabaseSession.user.id,
      token: supabaseSession.access_token,
      expiresAt: new Date(supabaseSession.expires_at * 1000)
    };
  }
}
```

### Step 4: Switch Service Factory

In `src/services/ServiceFactory.ts`, change:

```typescript
const USE_SUPABASE = true; // Changed from false

// Uncomment Supabase imports
import { SupabaseAuthService } from './supabase/SupabaseAuthService';
import { SupabaseHabitsRepository } from './supabase/SupabaseHabitsRepository';
// ... etc
```

---

## Stripe Integration

### Step 1: Set Up Stripe

1. **Create Stripe Account**
   - Go to https://stripe.com
   - Create products and prices for:
     - PRO Monthly (€6.99/month)
     - PRO Yearly (€49.99/year)
     - LIFETIME (€79-€129 one-time)

2. **Get API Keys**
   ```env
   VITE_STRIPE_PUBLISHABLE_KEY=pk_test_...
   STRIPE_SECRET_KEY=sk_test_...
   STRIPE_WEBHOOK_SECRET=whsec_...
   ```

### Step 2: Install Stripe

```bash
pnpm add @stripe/stripe-js stripe
```

### Step 3: Implement Stripe Service

Create `src/services/stripe/StripePaymentService.ts`:

```typescript
import { loadStripe } from '@stripe/stripe-js';
import { IPaymentService, StripeWebhookEvent } from '../interfaces/IPaymentService';
import { SubscriptionPlan } from '@/types';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

export class StripePaymentService implements IPaymentService {
  async initialize() {
    await stripePromise;
  }

  async createCheckoutSession(params: {
    userId: string;
    plan: SubscriptionPlan;
    successUrl: string;
    cancelUrl: string;
  }) {
    // Call your backend API to create Stripe checkout session
    const response = await fetch('/api/create-checkout-session', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params)
    });
    
    const { sessionId, url } = await response.json();
    return { sessionId, url };
  }

  // ... implement other methods
}
```

### Step 4: Backend Webhook Endpoint

Create a serverless function (e.g., Vercel, Netlify) to handle Stripe webhooks:

```typescript
// api/stripe-webhook.ts
import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY! // Use service role key
);

export default async function handler(req, res) {
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err) {
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  switch (event.type) {
    case 'checkout.session.completed':
      const session = event.data.object;
      // Update subscription in database
      await supabase
        .from('subscriptions')
        .upsert({
          user_id: session.metadata.userId,
          plan: session.metadata.plan,
          status: 'active',
          stripe_customer_id: session.customer,
          stripe_subscription_id: session.subscription,
          updated_at: new Date().toISOString()
        });
      break;

    case 'customer.subscription.updated':
    case 'customer.subscription.deleted':
    case 'invoice.payment_failed':
      // Handle other events
      break;
  }

  res.json({ received: true });
}
```

---

## Email Provider Setup

### Option 1: Resend

```bash
pnpm add resend
```

```typescript
// src/services/email/ResendEmailService.ts
import { Resend } from 'resend';

const resend = new Resend(process.env.EMAIL_PROVIDER_API_KEY);

export async function sendPasswordResetEmail(to: string, resetToken: string) {
  await resend.emails.send({
    from: 'Roya <noreply@yourdomain.com>',
    to,
    subject: 'Reset your password',
    html: `<p>Click here to reset your password: <a href="https://yourdomain.com/reset-password?token=${resetToken}">Reset Password</a></p>`
  });
}
```

### Option 2: SendGrid

```bash
pnpm add @sendgrid/mail
```

### Option 3: Use Supabase Auth Email Templates

Configure in Supabase Dashboard → Authentication → Email Templates

---

## Push Notifications

### Generate VAPID Keys

```bash
npx web-push generate-vapid-keys
```

Add to `.env.local`:
```env
VITE_VAPID_PUBLIC_KEY=...
VAPID_PRIVATE_KEY=...
```

### Service Worker

Already configured in `public/sw.js` (create this file):

```javascript
self.addEventListener('push', (event) => {
  const data = event.data.json();
  self.registration.showNotification(data.title, {
    body: data.body,
    icon: '/icon-192x192.png',
    badge: '/badge-72x72.png'
  });
});
```

---

## Deployment Checklist

### Vercel Deployment

1. **Install Vercel CLI**
   ```bash
   pnpm add -g vercel
   ```

2. **Deploy**
   ```bash
   vercel --prod
   ```

3. **Set Environment Variables** in Vercel Dashboard

4. **Configure Redirects** (vercel.json already in place)

### Netlify Deployment

1. **Install Netlify CLI**
   ```bash
   pnpm add -g netlify-cli
   ```

2. **Deploy**
   ```bash
   netlify deploy --prod
   ```

3. **Set Environment Variables** in Netlify Dashboard

---

## Testing Checklist

- [ ] Sign up with email/password
- [ ] Sign in with existing account
- [ ] Password reset flow
- [ ] Create habits (WIN and QUIT)
- [ ] Log habit completions
- [ ] Test relapse handling (preserves best streak)
- [ ] Log mood and journal entries
- [ ] Create goals and milestones
- [ ] Enable period tracker (PRO)
- [ ] Enable Muslim mode and set prayer times
- [ ] Test paywall triggers
- [ ] Complete Stripe checkout (test mode)
- [ ] Verify webhook updates subscription
- [ ] Cancel subscription
- [ ] Export data
- [ ] Delete account

---

## Migration from Local to Supabase

To migrate existing local data:

1. **Export Local Data**
   - Use the "Export Data" feature in the app
   - Downloads JSON with all user data

2. **Import to Supabase**
   - Create a migration script
   - Parse JSON and insert into Supabase tables
   - Maintain data integrity (UUIDs, relationships)

3. **Verify Migration**
   - Check all data is present
   - Test app functionality
   - Verify RLS policies work correctly

---

## Support & Troubleshooting

### Common Issues

1. **CORS Errors**
   - Configure allowed origins in Supabase dashboard
   - Add your domain to Stripe allowed domains

2. **RLS Policy Errors**
   - Verify policies are correctly set up
   - Check auth.uid() is available
   - Use service role key for admin operations

3. **Webhook Not Receiving Events**
   - Verify webhook URL is publicly accessible
   - Check Stripe webhook logs
   - Verify webhook secret matches

4. **Email Not Sending**
   - Check email provider API key
   - Verify sender domain is verified
   - Check spam folder

### Getting Help

- Supabase Docs: https://supabase.com/docs
- Stripe Docs: https://stripe.com/docs
- GitHub Issues: [Your repo URL]
- Email Support: [support@yourdomain.com]