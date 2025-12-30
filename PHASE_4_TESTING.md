# ✅ PHASE 4 TESTING CHECKLIST

Complete testing guide for Phase 4: Cycle Lens (Period Phases) feature.

---

## A) ONBOARDING + SETTINGS ✅

### Test 1: Enable Cycle Lens
- [ ] Go to Profile page → verify no Cycle Lens settings visible initially
- [ ] Navigate to /app/cycle → verify "Cycle Lens is not enabled" message
- [ ] Click "Enable Cycle Lens" → verify settings modal opens
- [ ] Toggle "Enable Cycle Lens" switch → verify form fields appear

### Test 2: Setup Fields
- [ ] Enter last period start date (e.g., 2 weeks ago)
- [ ] Verify average cycle length defaults to 28 days
- [ ] Verify average period length defaults to 5 days
- [ ] Change cycle length to 30 → verify accepts value
- [ ] Change period length to 7 → verify accepts value
- [ ] Click "Save Settings" → verify success toast

### Test 3: Edit/Reset Settings
- [ ] After enabling, click Settings icon (top-right) → verify modal opens with existing values
- [ ] Change last period start date → save → verify updates
- [ ] Change cycle/period lengths → save → verify predictions update
- [ ] Toggle "Enable Cycle Lens" OFF → click "Disable" → verify Cycle Lens disabled
- [ ] Verify Today page no longer shows phase card
- [ ] Re-enable Cycle Lens → verify works again

### Test 4: Disclaimer
- [ ] Verify settings modal shows disclaimer: "Informational only, not medical advice"
- [ ] Verify disclaimer is visible and readable

---

## B) PHASE MODEL + CALENDAR ✅

### Test 1: Phase-Colored Calendar
- [ ] Enable Cycle Lens with recent period start date
- [ ] Go to Cycle Lens page → verify calendar displays
- [ ] Verify days are colored by phase:
  - Red: Menstrual (period days)
  - Green: Follicular
  - Purple: Ovulation window
  - Blue: Luteal
- [ ] Verify today's date has ring highlight
- [ ] Verify colors match phase legend at bottom

### Test 2: Date Details
- [ ] Click on a menstrual phase date → verify modal opens
- [ ] Verify shows: phase name, cycle day, description, suggestions
- [ ] Verify description is appropriate for menstrual phase
- [ ] Verify suggestions are gentle and non-medical
- [ ] Click on follicular date → verify different description/suggestions
- [ ] Click on ovulation date → verify peak energy messaging
- [ ] Click on luteal date → verify comfort/routine messaging

### Test 3: Predictions
- [ ] Verify "Predictions" card shows:
  - Next period start date
  - Ovulation window (start - end dates)
- [ ] Change last period start date in settings → verify predictions update
- [ ] Change cycle length → verify predictions recalculate correctly

### Test 4: Month Navigation
- [ ] Click left arrow (◀) → verify goes to previous month
- [ ] Click right arrow (▶) → verify goes to next month
- [ ] Verify phase colors update correctly for different months
- [ ] Navigate back to current month → verify displays correctly

---

## C) DAILY LOGGING (OPTIONAL - PRO) ✅

### Test 1: Flow Level Logging (PRO)
- [ ] Sign in as PRO user
- [ ] Click on a date in Cycle Lens calendar → verify modal opens
- [ ] Verify flow level buttons: None, Light, Medium, Heavy
- [ ] Select "Medium" → verify button highlights
- [ ] Click "Save Log" → verify success toast
- [ ] Reopen same date → verify "Medium" is selected

### Test 2: Symptoms Logging (PRO)
- [ ] In date modal, verify symptoms checkboxes:
  - Cramps, Headache, Fatigue, Bloating, Mood changes, Tender breasts, Back pain, Acne
- [ ] Check "Cramps" and "Fatigue" → verify both selected
- [ ] Click "Save Log" → verify success toast
- [ ] Reopen same date → verify both symptoms still checked

### Test 3: Notes (PRO)
- [ ] In date modal, add notes: "Feeling tired today"
- [ ] Click "Save Log" → verify success toast
- [ ] Reopen same date → verify notes persist

### Test 4: PRO Gating (FREE Users)
- [ ] Sign in as FREE user
- [ ] Click on a date → verify modal opens
- [ ] Try to select flow level → verify paywall modal appears
- [ ] Try to check symptom → verify paywall modal appears
- [ ] Try to add notes → verify paywall modal appears
- [ ] Verify "Pro" badge shows on "Daily Log" section

---

## D) TODAY PAGE INTEGRATION ✅

### Test 1: Phase Card Display
- [ ] Enable Cycle Lens
- [ ] Go to Today page
- [ ] Verify "Cycle Lens" card appears near top (after header, before weekly intentions)
- [ ] Verify shows: phase name (e.g., "Cycle Lens: Follicular")
- [ ] Verify shows one gentle suggestion
- [ ] Verify card has purple/pink gradient background
- [ ] Verify "View Calendar" button links to /app/cycle

### Test 2: Phase Card Visibility
- [ ] Disable Cycle Lens in settings
- [ ] Go to Today page → verify phase card does NOT appear
- [ ] Re-enable Cycle Lens → verify phase card reappears

### Test 3: Phase Updates
- [ ] Check phase shown on Today page
- [ ] Go to Cycle Lens calendar → verify same phase
- [ ] Change last period start date to trigger different phase
- [ ] Go back to Today page → verify phase updates

---

## E) WEEKLY REVIEW INTEGRATION ✅

### Test 1: Cycle Phase Context
- [ ] Enable Cycle Lens
- [ ] Complete check-ins for current week
- [ ] Go to Weekly Review page
- [ ] Verify "Cycle Lens" card appears (purple/pink gradient)
- [ ] Verify shows: "This week was mostly: [phase(s)]"
- [ ] Verify shows gentle insight: "Your energy may vary across phases — plan gently"

### Test 2: Multiple Phases in Week
- [ ] Set last period start date so week spans 2+ phases
- [ ] Go to Weekly Review
- [ ] Verify shows all phases that occurred during week (e.g., "Menstrual, Follicular")

### Test 3: Export Includes Cycle Data
- [ ] Go to Weekly Review with Cycle Lens enabled
- [ ] Click "Copy Summary" → paste into text editor
- [ ] Verify includes "CYCLE LENS" section with phases
- [ ] Click "Export PDF" → open PDF
- [ ] Verify PDF includes Cycle Lens card

### Test 4: Cycle Lens Disabled
- [ ] Disable Cycle Lens
- [ ] Go to Weekly Review → verify NO Cycle Lens card appears
- [ ] Click "Copy Summary" → verify NO cycle section in text
- [ ] Click "Export PDF" → verify NO cycle card in PDF

---

## F) FREE/PRO GATING ✅

### Test 1: FREE Tier Access
- [ ] Sign in as FREE user
- [ ] Enable Cycle Lens → verify works
- [ ] Go to Cycle Lens calendar → verify can view
- [ ] Click on date → verify can see phase info
- [ ] Verify Today page shows phase card
- [ ] Verify Weekly Review shows cycle context

### Test 2: PRO Tier Access
- [ ] Sign in as PRO user
- [ ] Enable Cycle Lens → verify works
- [ ] Click on date → verify can log flow/symptoms/notes
- [ ] Save log → verify persists
- [ ] Verify no paywall triggers

### Test 3: Logging History (PRO Only)
- [ ] As PRO user, log flow/symptoms for multiple dates
- [ ] Verify all logs persist
- [ ] As FREE user, try to log → verify paywall appears
- [ ] Verify FREE users can't access logging history

---

## G) EXPORT (PRO) ✅

### Test 1: Cycle Data in Export Center
- [ ] As PRO user with Cycle Lens enabled
- [ ] Go to Weekly Review → click "Copy Summary"
- [ ] Verify includes cycle phase context
- [ ] Click "Export PDF" → verify includes Cycle Lens card

### Test 2: Export Locked (FREE)
- [ ] As FREE user with Cycle Lens enabled
- [ ] Go to Weekly Review → verify can copy summary (includes cycle data)
- [ ] Verify can export PDF (includes cycle data)
- [ ] Note: Export is PRO-gated for Weekly Review, not Cycle Lens specifically

---

## H) BUNDLE SIZE ✅

### Test 1: No New Heavy Dependencies
- [ ] Check package.json → verify NO new heavy dependencies added
- [ ] Verify only lightweight calculations in cycleCalculations.ts
- [ ] Run `pnpm run build` → check bundle size
- [ ] Compare with Phase 3 bundle size (1,527 KB / 451 KB gzipped)
- [ ] Verify increase is minimal (<50 KB uncompressed)

### Test 2: Build Success
- [ ] Run `pnpm run lint` → verify 0 errors
- [ ] Run `pnpm run build` → verify successful build
- [ ] Check dist/ folder → verify files generated

---

## I) DATA REQUIREMENTS ✅

### Test 1: Data Sources
- [ ] Verify Cycle Lens uses localStorage (LocalCycleService)
- [ ] Verify settings persist across sessions
- [ ] Verify logs persist across sessions
- [ ] Sign out and sign in → verify data still present

### Test 2: Phase Calculations
- [ ] Set last period start to 1 day ago → verify in Menstrual phase
- [ ] Set to 10 days ago (28-day cycle) → verify in Follicular phase
- [ ] Set to 14 days ago → verify in Ovulation phase
- [ ] Set to 20 days ago → verify in Luteal phase
- [ ] Verify predictions are accurate based on cycle length

### Test 3: Week Calculations
- [ ] Verify Weekly Review correctly identifies phases during week
- [ ] Test across month boundaries (e.g., Jan 28 - Feb 3)
- [ ] Verify phase context matches calendar view

---

## J) UX / TONE ✅

### Test 1: Calm, Gentle Design
- [ ] Review all Cycle Lens UI → verify feels calm and supportive
- [ ] Verify no medical jargon or clinical language
- [ ] Verify suggestions are gentle (e.g., "plan gently", "honor need for rest")
- [ ] Verify colors are soft (purple/pink gradients)

### Test 2: Disclaimers
- [ ] Verify settings modal shows disclaimer
- [ ] Verify Cycle Lens page shows disclaimer at bottom
- [ ] Verify disclaimer is clear: "Informational only, not medical advice"

### Test 3: Empty States
- [ ] Disable Cycle Lens → verify graceful empty state on Cycle Lens page
- [ ] Verify Today page doesn't show phase card when disabled
- [ ] Verify Weekly Review doesn't show cycle context when disabled

---

## K) INTEGRATION TESTS ✅

### Test 1: Navigation Flow
- [ ] Start on Today page → click "View Calendar" on phase card → verify navigates to Cycle Lens
- [ ] Go to Cycle Lens → click Settings icon → verify modal opens
- [ ] Go to Weekly Review → verify cycle context appears
- [ ] Navigate between pages → verify no data loss

### Test 2: Settings Changes Propagate
- [ ] Change last period start date in settings
- [ ] Verify Today page phase card updates
- [ ] Verify Cycle Lens calendar colors update
- [ ] Verify Weekly Review phase context updates
- [ ] Verify predictions update

### Test 3: Cross-Page Data Sync
- [ ] Enable Cycle Lens on Cycle Lens page
- [ ] Go to Today page → verify phase card appears immediately
- [ ] Go to Weekly Review → verify cycle context appears
- [ ] Disable Cycle Lens → verify all pages update

---

## SUCCESS CRITERIA

✅ Cycle Lens is optional (OFF by default, user can enable anytime)
✅ Setup fields work: last period start, cycle length, period length
✅ Phase-colored calendar displays correctly with accurate predictions
✅ Date details show phase info, description, and gentle suggestions
✅ Today page shows subtle phase card (if enabled)
✅ Weekly Review shows phase context (if enabled)
✅ FREE users can enable Cycle Lens + see phase calendar + phase card
✅ PRO users can log flow/symptoms + access history + export
✅ Export includes Cycle Lens data (PRO)
✅ No new heavy dependencies added
✅ Bundle size increase is minimal (<50 KB)
✅ Design is calm, gentle, and non-medical
✅ Disclaimers are clear and visible

---

**Phase 4 Status**: ✅ Complete

**Next Steps**:
- Phase 2.1: Backfill logging with date picker
- Phase 5: Stripe integration, real payment flow
- Deployment: Vercel/Netlify with SPA routing

---

## DEPLOYMENT PREPARATION ✅

### Test 1: Vercel Deployment
- [ ] Add vercel.json for SPA routing
- [ ] Test build locally: `pnpm run build`
- [ ] Deploy to Vercel
- [ ] Test all routes work on refresh
- [ ] Verify Cycle Lens page loads correctly

### Test 2: Netlify Deployment
- [ ] Add _redirects file for SPA routing
- [ ] Test build locally: `pnpm run build`
- [ ] Deploy to Netlify
- [ ] Test all routes work on refresh
- [ ] Verify Cycle Lens page loads correctly

---

**Deployment Instructions**: See README.md for Vercel and Netlify deployment steps with SPA routing configuration.