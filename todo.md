# Roya PWA - Development Plan

## ⚠️ CURRENT STATUS: BACKEND NOT ENABLED

**Important Note**: Supabase backend is not currently enabled for this project. This affects the implementation approach:

### Available Options:

**OPTION A: Frontend Demo/Prototype (Recommended - Can Start Now)**
- Build complete UI/UX with all screens and features
- Use localStorage for data persistence (demo purposes)
- Mock authentication flows
- Mock payment/subscription UI
- Interactive prototype showing all functionality
- PWA-ready (manifest, service worker, installable)
- Perfect for: Testing UX, validating features, investor demos, design validation

**OPTION B: Full Production Version (Requires Backend Setup)**
- Real Supabase database with all tables
- Real authentication (email/password, Google OAuth)
- Real Stripe payments and subscriptions
- Email sending for password resets
- Production-ready with proper security
- Perfect for: Actual product launch, real users, revenue generation

---

## Design Guidelines

### Design References (Primary Inspiration)
- **Notion.so**: Clean, minimal, organized information architecture
- **Headspace.com**: Calm, supportive, emotionally intelligent UI
- **Calm.com**: Soothing colors, gentle animations, wellness-focused
- **Style**: Modern Minimalism + Wellness + Privacy-First + Emotional Intelligence

### Color Palette
- Primary: #6B4CE6 (Soft Purple - main actions, spiritual connection)
- Secondary: #8B7FD9 (Light Purple - hover states, secondary elements)
- Accent Success: #10B981 (Emerald - habit completion, positive actions)
- Accent Warning: #F59E0B (Amber - gentle reminders, phase warnings)
- Accent Calm: #3B82F6 (Blue - prayer times, calm elements)
- Background Light: #FAFAFA (Off-white - light mode background)
- Background Dark: #0F0F0F (Deep Black - dark mode background)
- Surface Light: #FFFFFF (White - cards in light mode)
- Surface Dark: #1A1A1A (Charcoal - cards in dark mode)
- Text Primary: #1F2937 (Dark Gray - light mode text)
- Text Primary Dark: #F9FAFB (Off-white - dark mode text)
- Text Secondary: #6B7280 (Medium Gray - secondary text)
- Border: #E5E7EB (Light Gray - borders and dividers)

### Typography
- Heading1: Inter font-weight 700 (32px) - Page titles
- Heading2: Inter font-weight 600 (24px) - Section headers
- Heading3: Inter font-weight 600 (18px) - Card titles
- Body/Normal: Inter font-weight 400 (14px) - Regular text
- Body/Emphasis: Inter font-weight 600 (14px) - Important info
- Caption: Inter font-weight 400 (12px) - Helper text, timestamps
- Button: Inter font-weight 600 (14px) - Action buttons

### Generated Images (Ready to Use)
All images have been generated and are hosted on CDN. Use these URLs directly in the code:

1. **Onboarding Welcome** - Serene sunrise over calm water
2. **Onboarding Habits** - Person journaling peacefully at desk
3. **Onboarding Goals** - Mountain peak with pathway
4. **Empty State Habits** - Clean desk with journal and plant
5. **Empty State Journal** - Open notebook with pen
6. **Empty State Goals** - Empty road with morning light
7. **Phase Menstrual** - Abstract flowing water in blue/purple
8. **Phase Follicular** - Spring flowers blooming
9. **Phase Ovulation** - Sunlight through green leaves
10. **Phase Luteal** - Autumn leaves in warm tones
11. **Prayer Background** - Islamic geometric patterns
12. **Focus Mode** - Soft gradient with bokeh lights

---

## Development Tasks - OPTION A: Frontend Demo/Prototype

### Phase 1: Core Structure & Routing (PRIORITY)
- [x] Initialize project with shadcn-ui template
- [x] Generate all required images
- [ ] Set up React Router with all routes
- [ ] Create main layout with bottom navigation
- [ ] Implement theme context (light/dark mode)
- [ ] Create localStorage utilities for data persistence
- [ ] Set up mock authentication context

### Phase 2: Authentication Flows (Mock)
- [ ] Sign Up page with form validation
- [ ] Sign In page with "Forgot Password" link
- [ ] Password reset flow (mock email sent)
- [ ] Mock Google OAuth button
- [ ] Protected route wrapper
- [ ] Auth state management with localStorage

### Phase 3: Onboarding Flow
- [ ] Welcome screen with generated image
- [ ] Theme selection step (3 preset themes)
- [ ] Add starter habits step (max 3)
- [ ] Enable mood & journal step
- [ ] Period tracker setup (optional)
- [ ] Muslim mode setup (optional)
- [ ] Set first goal step
- [ ] Completion celebration

### Phase 4: Today Page (Daily Check-in)
- [ ] Date header with time-based greeting
- [ ] Habits checklist (WIN + QUIT combined)
- [ ] Mood emoji picker (5 emojis)
- [ ] Mood scale slider (1-5)
- [ ] Mood tags selection
- [ ] Journal entry textarea
- [ ] Reflection prompt display
- [ ] Identity statement reminder
- [ ] Prayer countdown (if Muslim mode)
- [ ] Complete check-in button
- [ ] Daily streak counter

### Phase 5: Habits Management
- [ ] Habits page with WIN/QUIT tabs
- [ ] Add habit form with all fields
- [ ] Habit card component with stats
- [ ] Edit habit modal
- [ ] Delete habit confirmation
- [ ] Habit detail page with heatmap
- [ ] Streak calculation logic
- [ ] Milestone celebrations (7/14/30/60/100)
- [ ] Relapse flow for QUIT habits
- [ ] Best streak preservation

### Phase 6: Mood & Journal
- [ ] Mood history page with calendar
- [ ] Mood trends chart (line graph)
- [ ] Mood distribution chart (pie chart)
- [ ] Journal history page with entries
- [ ] Journal entry detail view
- [ ] Privacy mode toggle
- [ ] Search and filter functionality
- [ ] Mood vs habit correlation display
- [ ] FREE tier lock for entries >7 days old

### Phase 7: Goals Roadmap
- [ ] Goals page with 3 tabs (3m/6m/1y)
- [ ] Add goal form
- [ ] Add milestone to goal
- [ ] Goal card with progress bar
- [ ] Mark milestone completed
- [ ] Weekly focus section
- [ ] Edit/delete goals
- [ ] FREE tier limitation (1 priority, 1 milestone per timeframe)

### Phase 8: Period Tracker
- [ ] Period setup form
- [ ] Period settings page
- [ ] Log period start
- [ ] Daily flow and symptoms logging
- [ ] Phase calculation logic
- [ ] Phase-colored calendar component
- [ ] Phase info cards (what to expect)
- [ ] Predictions display
- [ ] Medical disclaimer page
- [ ] PRO feature gate

### Phase 9: Salah Module
- [ ] Muslim mode toggle in settings
- [ ] Location setup (mock geolocation)
- [ ] Calculation method selector
- [ ] Asr madhhab selector
- [ ] Manual adjustments inputs
- [ ] Prayer times display
- [ ] Prayer checklist for today
- [ ] Mark prayer as prayed
- [ ] Weekly chart
- [ ] .ICS export (generate file)
- [ ] Niyyah prompt modal
- [ ] Gratitude after Isha
- [ ] Advanced settings PRO gate

### Phase 10: Unified Calendar
- [ ] Month view calendar component
- [ ] Layer toggles (habits/mood/journal/period/salah)
- [ ] Color-coded cells
- [ ] Day detail modal
- [ ] Month/year navigation
- [ ] Today button
- [ ] Swipe gestures

### Phase 11: Mock Payments & Subscription
- [ ] Paywall modal component
- [ ] Plan comparison table
- [ ] Mock checkout flow
- [ ] Subscription status display
- [ ] Mock Stripe Customer Portal
- [ ] Entitlement checks throughout app
- [ ] FREE tier limitations
- [ ] PRO feature gates
- [ ] Referral code generation
- [ ] Referral stats display

### Phase 12: Profile & Settings
- [ ] Profile page layout
- [ ] Account settings section
- [ ] Theme customization
- [ ] Custom background upload (mock)
- [ ] Notification settings
- [ ] Muslim mode toggle
- [ ] App lock PIN setup (mock)
- [ ] Export data button (generate JSON)
- [ ] Delete account flow (mock)
- [ ] Subscription management

### Phase 13: Legal Pages
- [ ] Impressum page (template)
- [ ] Privacy Policy page (template)
- [ ] Terms of Service page (template)
- [ ] Cookie Policy page (template)
- [ ] Medical Disclaimer page
- [ ] Footer with legal links
- [ ] Cookie consent banner
- [ ] Consent management

### Phase 14: Support & Help
- [ ] FAQ page with accordion
- [ ] Contact support form (mock)
- [ ] Feedback form (mock)
- [ ] In-app help tooltips
- [ ] Onboarding tour (optional)

### Phase 15: PWA Configuration
- [ ] Create manifest.json
- [ ] Generate PWA icons
- [ ] Configure service worker
- [ ] Offline fallback page
- [ ] Install prompt
- [ ] Add to home screen instructions

### Phase 16: Polish & Animations
- [ ] Page transition animations
- [ ] Habit check bounce animation
- [ ] Milestone confetti effect
- [ ] Mood emoji scale animation
- [ ] Loading states with pulse
- [ ] Success feedback animations
- [ ] Smooth scrolling
- [ ] Haptic feedback (if supported)

### Phase 17: Testing & Refinement
- [ ] Test all user flows
- [ ] Test responsive design (mobile/tablet/desktop)
- [ ] Test dark/light mode
- [ ] Test localStorage persistence
- [ ] Test PWA installation
- [ ] Cross-browser testing
- [ ] Accessibility audit
- [ ] Performance optimization

### Phase 18: Documentation
- [ ] README with setup instructions
- [ ] Feature documentation
- [ ] Mock data structure documentation
- [ ] Deployment guide
- [ ] PWA installation guide
- [ ] Known limitations (localStorage, no real backend)
- [ ] Future roadmap (backend integration)

---

## Development Tasks - OPTION B: Full Production Version

### Phase 1: Backend Setup
- [ ] Enable Supabase for project
- [ ] Create all database tables with RLS
- [ ] Set up authentication providers
- [ ] Configure email templates
- [ ] Set up Stripe integration
- [ ] Configure webhook endpoints
- [ ] Set up email provider (Resend/SendGrid)
- [ ] Configure VAPID keys for push notifications

### Phase 2-18: Same as Option A, but with:
- Real database queries instead of localStorage
- Real authentication flows
- Real Stripe checkout and webhooks
- Real email sending
- Real push notifications
- Production security measures
- Rate limiting
- Error tracking (Sentry)
- Analytics integration

---

## Key Differences: Demo vs Production

| Feature | Demo (Option A) | Production (Option B) |
|---------|----------------|----------------------|
| Data Storage | localStorage | Supabase PostgreSQL |
| Authentication | Mock (localStorage) | Real (Supabase Auth) |
| Payments | Mock UI only | Real Stripe integration |
| Email | Mock "sent" messages | Real transactional emails |
| Push Notifications | Mock UI only | Real web push |
| Security | Basic | Production-grade RLS, encryption |
| Multi-device | No sync | Real-time sync |
| Data Export | JSON from localStorage | Full database export |
| Scalability | Single user | Unlimited users |
| Privacy | Client-side only | Server-side encryption |

---

## Success Criteria

### For Demo (Option A):
✅ All screens and flows are visually complete
✅ User can navigate through entire app
✅ Data persists in localStorage between sessions
✅ PWA can be installed on mobile devices
✅ Responsive design works on all screen sizes
✅ Dark/light mode works correctly
✅ All animations and interactions feel smooth
✅ Mock paywall demonstrates subscription tiers
✅ README clearly explains limitations

### For Production (Option B):
✅ All Demo criteria PLUS:
✅ Real user accounts with secure authentication
✅ Data syncs across devices
✅ Stripe payments process successfully
✅ Email notifications work reliably
✅ Push notifications deliver on time
✅ App handles concurrent users
✅ Security audit passes
✅ GDPR compliance verified
✅ Production deployment successful

---

## Next Steps

**Waiting for user decision on which option to proceed with.**

Once decided, I will:
1. Update this todo.md with the chosen path
2. Begin implementation phase by phase
3. Test each feature as it's built
4. Provide regular progress updates
5. Deliver a complete, polished result

---

**Note**: The demo version (Option A) can be built immediately and serves as a perfect foundation. If backend is enabled later, the real implementation can be added incrementally without rebuilding the UI from scratch.