# Roya PWA - Habit Tracking & Personal Development App

A comprehensive Progressive Web App for tracking habits, mood, journal entries, goals, menstrual cycles, and prayer times. Built with React, TypeScript, and shadcn/ui.

## 🌟 Features

### Core Features
- **Habit Tracking**: Track habits to WIN (build) and habits to QUIT (break)
- **Compassionate Relapse Handling**: Preserves best streak and total clean days for QUIT habits
- **Mood & Journal**: Log daily mood with emoji, scale, and tags; write private journal entries
- **Goals Roadmap**: Set 3-month, 6-month, and 1-year goals with milestones
- **Period Tracker**: Track menstrual cycle with phase predictions and symptom logging (PRO)
- **Salah Module**: Muslim prayer times with calculation methods and .ICS export (PRO features)
- **Unified Calendar**: View all data (habits, mood, journal, period, prayers) in one place

### Premium Features (PRO/LIFETIME)
- Unlimited habits (FREE: 3 max)
- Full journal history (FREE: last 7 days only)
- Unlimited goals and milestones
- Period tracker with predictions
- Advanced prayer time settings
- Data export (CSV/JSON)
- Weekly review PDF
- Advanced analytics
- App lock with PIN
- Premium themes
- Focus mode customization

### Technical Features
- **PWA**: Installable on mobile and desktop
- **Offline Support**: Works without internet connection
- **Backend-Ready Architecture**: Easy to switch from localStorage to Supabase
- **Type-Safe**: Full TypeScript coverage
- **Modular Design**: Clean separation of concerns with repository pattern
- **GDPR Compliant**: Cookie consent, data export, account deletion

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and pnpm
- Modern browser (Chrome, Firefox, Safari, Edge)

### Installation

```bash
# Clone the repository
git clone <your-repo-url>
cd roya-pwa

# Install dependencies
pnpm install

# Start development server
pnpm run dev
```

The app will be available at `http://localhost:5173`

### Build for Production

```bash
# Build the app
pnpm run build

# Preview production build
pnpm run preview
```

## 📁 Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── layout/         # Layout components (AppLayout, BottomNav)
│   ├── ui/             # shadcn/ui components
│   └── ProtectedRoute.tsx
├── contexts/           # React contexts
│   ├── AuthContext.tsx
│   └── SubscriptionContext.tsx
├── pages/              # Page components
│   ├── auth/          # Authentication pages
│   ├── legal/         # Legal pages (Privacy, Terms, etc.)
│   ├── onboarding/    # Onboarding flow
│   ├── Today.tsx      # Daily check-in page
│   ├── Habits.tsx     # Habits management
│   ├── Calendar.tsx   # Unified calendar
│   ├── Goals.tsx      # Goals roadmap
│   └── Profile.tsx    # User profile & settings
├── services/          # Service layer (backend abstraction)
│   ├── interfaces/    # Service interfaces
│   ├── local/         # localStorage implementations
│   ├── supabase/      # Supabase implementations (stubs)
│   ├── mock/          # Mock services (payments)
│   └── ServiceFactory.ts
├── types/             # TypeScript type definitions
├── App.tsx            # Root component
└── main.tsx           # Entry point
```

## 🏗️ Architecture

### Service Layer Pattern

The app uses a **repository pattern** with interfaces to abstract data access:

```typescript
// Interface defines the contract
interface IAuthService {
  signUp(email: string, password: string): Promise<{user, session}>;
  signIn(email: string, password: string): Promise<{user, session}>;
  // ... other methods
}

// Local implementation (current)
class LocalAuthService implements IAuthService {
  // Uses localStorage
}

// Supabase implementation (ready to use)
class SupabaseAuthService implements IAuthService {
  // Uses Supabase
}

// Service factory switches implementations
const authService = serviceFactory.getAuthService();
```

### Current State: Local Prototype

All data is stored in **browser localStorage**:
- ✅ Data persists between sessions
- ✅ No backend required
- ✅ Fast and responsive
- ❌ Data is device-specific (no sync)
- ❌ No real payments (mock only)
- ❌ No email sending

### Switching to Supabase Backend

See [BACKEND_INTEGRATION.md](./BACKEND_INTEGRATION.md) for detailed instructions.

**Quick steps:**
1. Create Supabase project
2. Run SQL schema (provided in docs)
3. Set environment variables
4. Change `USE_SUPABASE = true` in ServiceFactory
5. Deploy

## 🔐 Authentication

### Current (Prototype)
- Email/password stored in localStorage
- Session tokens (30-day expiry)
- Password reset with mock email
- PIN lock for app privacy

### With Supabase
- Supabase Auth with email verification
- Google OAuth support
- Real password reset emails
- Secure session management

## 💳 Payments & Subscriptions

### Current (Prototype)
- Mock Stripe checkout
- Subscription state in localStorage
- Entitlement checks work correctly
- Paywall UI fully functional

### With Stripe
- Real Stripe Checkout
- Webhook handling for subscription events
- Automatic entitlement updates
- Billing portal for subscription management

## 📊 Data Export

Users can export all their data:
- **CSV**: Habits, mood logs, journal entries, goals, period logs, prayer logs
- **JSON**: Complete data dump
- **PDF**: Weekly review summary (PRO)

Export is available in Profile → Account Settings → Export Data

## 🌐 Deployment

### Vercel (Recommended)

```bash
# Install Vercel CLI
pnpm add -g vercel

# Deploy
vercel --prod
```

**Environment Variables** (set in Vercel dashboard):
```env
# Supabase (when backend is enabled)
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key

# Stripe (when payments are enabled)
VITE_STRIPE_PUBLISHABLE_KEY=pk_live_...
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Email Provider
EMAIL_PROVIDER_API_KEY=...
EMAIL_FROM=noreply@yourdomain.com

# Analytics (optional)
VITE_ANALYTICS_ID=...

# Push Notifications (optional)
VITE_VAPID_PUBLIC_KEY=...
VAPID_PRIVATE_KEY=...
```

### Netlify

```bash
# Install Netlify CLI
pnpm add -g netlify-cli

# Deploy
netlify deploy --prod
```

Set the same environment variables in Netlify dashboard.

### Custom Hosting

Build the app and serve the `dist` folder:

```bash
pnpm run build
# Serve dist/ with any static hosting
```

**Requirements:**
- HTTPS (required for PWA)
- SPA routing support (redirect all routes to index.html)

## 📱 PWA Installation

### iOS (Safari)
1. Open the app in Safari
2. Tap the Share button
3. Tap "Add to Home Screen"
4. Tap "Add"

### Android (Chrome)
1. Open the app in Chrome
2. Tap the menu (⋮)
3. Tap "Install App" or "Add to Home Screen"

### Desktop (Chrome/Edge)
1. Open the app
2. Look for the install icon in the address bar
3. Click "Install"

## 🔔 Notifications

### Web Push (Best-effort)
- Habit reminders
- Prayer time notifications
- Period predictions
- Goal milestone reminders

**Limitations:**
- iOS Safari has limited support
- Requires PWA installation
- User must grant permission

### .ICS Calendar Export (Reliable)
For prayer times, we provide .ICS file export:
1. Go to Profile → Salah Settings
2. Click "Export Prayer Times"
3. Import to Apple Calendar or Google Calendar
4. Get reliable native notifications

## 🍪 GDPR & Privacy

### Cookie Consent
- Banner appears on first visit
- Options: Accept All / Reject All / Customize
- Analytics blocked until consent granted
- Consent stored for 1 year

### User Rights
- **Access**: Export all data
- **Rectification**: Edit data in app
- **Erasure**: Delete account (hard delete)
- **Portability**: Export as CSV/JSON
- **Objection**: Reject analytics cookies

### Legal Pages
- Impressum (Germany)
- Privacy Policy
- Terms of Service
- Cookie Policy
- Medical Disclaimer (for period tracker)

**⚠️ Important**: These are templates. Replace placeholders with your actual business information and consult a legal professional.

## 🩺 Medical Disclaimer

The period tracker is **informational only** and **NOT medical advice**:
- Predictions may not be accurate
- Not for contraception
- Consult healthcare provider for medical concerns
- See full disclaimer at `/legal/medical-disclaimer`

## 🛠️ Development

### Available Scripts

```bash
# Development
pnpm run dev          # Start dev server
pnpm run build        # Build for production
pnpm run preview      # Preview production build
pnpm run lint         # Run ESLint
pnpm run type-check   # Run TypeScript compiler check

# Testing (to be added)
pnpm run test         # Run tests
pnpm run test:e2e     # Run E2E tests
```

### Code Style

- **TypeScript**: Strict mode enabled
- **ESLint**: Enforced on build
- **Prettier**: Recommended (configure in your editor)
- **Naming**: camelCase for variables, PascalCase for components

### Adding a New Feature

1. **Define types** in `src/types/index.ts`
2. **Create interface** in `src/services/interfaces/`
3. **Implement local version** in `src/services/local/`
4. **Create stub for Supabase** in `src/services/supabase/`
5. **Add to ServiceFactory** if needed
6. **Build UI components** in `src/components/` or `src/pages/`
7. **Update routes** in `src/App.tsx`
8. **Test thoroughly**

## 🐛 Troubleshooting

### Build Errors

```bash
# Clear cache and reinstall
rm -rf node_modules pnpm-lock.yaml
pnpm install

# Update browserslist
npx update-browserslist-db@latest
```

### Service Worker Issues

```bash
# Clear service worker cache
# In browser DevTools:
# Application → Service Workers → Unregister
# Application → Storage → Clear site data
```

### Data Not Persisting

- Check browser localStorage is enabled
- Check for private/incognito mode (data won't persist)
- Check browser storage quota

### PWA Not Installing

- Verify HTTPS is enabled
- Check manifest.json is served correctly
- Check service worker is registered
- Check browser console for errors

## 📚 Resources

### Documentation
- [Supabase Docs](https://supabase.com/docs)
- [Stripe Docs](https://stripe.com/docs)
- [shadcn/ui](https://ui.shadcn.com/)
- [React Router](https://reactrouter.com/)
- [Tailwind CSS](https://tailwindcss.com/)

### Prayer Time Calculation
- [adhan-js](https://github.com/batoulapps/adhan-js) - Accurate prayer time calculations
- [Islamic Finder](https://www.islamicfinder.org/) - Verify prayer times

### Period Tracking Resources
- [Clue](https://helloclue.com/) - Research-backed cycle tracking
- [ACOG](https://www.acog.org/) - Medical guidelines

## 🤝 Contributing

Contributions are welcome! Please:
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests (when available)
5. Submit a pull request

## 📄 License

[Your License Here - e.g., MIT]

## 👥 Support

- **Email**: [support@yourdomain.com]
- **GitHub Issues**: [Your repo URL]
- **Documentation**: [Your docs URL]

## 🙏 Acknowledgments

- Built with [shadcn/ui](https://ui.shadcn.com/)
- Icons from [Lucide](https://lucide.dev/)
- Hosted on [Vercel](https://vercel.com/) / [Netlify](https://netlify.com/)
- Backend by [Supabase](https://supabase.com/)
- Payments by [Stripe](https://stripe.com/)

---

**Made with 🌙 for personal growth and accountability**