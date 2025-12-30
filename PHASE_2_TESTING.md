# ✅ PHASE 2 TESTING CHECKLIST

Complete testing guide for Phase 2 features: Mood Trends, Insights, FREE Tier Limits, Theme Switcher, Exports, and Paywall.

---

## A) MOOD TRENDS (LIGHTWEIGHT) ✅

### Test 1: Mood Charts Display
- [ ] Go to Calendar page
- [ ] Verify mood trends chart appears if you have mood data
- [ ] Switch between "Last 7 Days" and "Last 30 Days" tabs
- [ ] Verify chart updates correctly
- [ ] Check average mood score displays correctly
- [ ] Check check-in count displays correctly

### Test 2: Most Common Tags
- [ ] Complete several check-ins with different mood tags
- [ ] Go to Calendar page
- [ ] Verify "Most Common Tags" section shows top 5 tags with counts
- [ ] Verify tags are sorted by frequency

### Test 3: Empty State
- [ ] Create a new account with no mood data
- [ ] Go to Calendar page
- [ ] Verify empty state message appears: "No mood data yet"

---

## B) CORRELATIONS (SIMPLE + HONEST) ✅

### Test 1: Habit Completion vs Mood Insight
- [ ] Complete ≥80% of habits on several days
- [ ] Log mood for those days
- [ ] Go to Calendar page
- [ ] Verify insight card shows: "On days you completed ≥80% of your habits, your average mood was X/5"

### Test 2: Best Mood Day
- [ ] Log mood for multiple days with varying scores
- [ ] Go to Calendar page
- [ ] Verify "Best Mood Day" insight shows the highest mood day with date and emoji

### Test 3: Habit Association
- [ ] Complete specific habits on higher-mood days (at least 3 times)
- [ ] Go to Calendar page
- [ ] Verify insight shows: "[Habit name] is often completed on higher-mood days"

### Test 4: Disclaimer
- [ ] Check all insight cards have "Informational only" label
- [ ] Verify footer text: "Insights are informational and show associations, not causation"

---

## C) JOURNAL PRIVACY + FREE LIMITS ✅

### Test 1: Journal Privacy Mode (Default)
- [ ] Complete check-in with journal entry
- [ ] View in report mode
- [ ] Verify journal is hidden by default with "Tap to reveal" button
- [ ] Click "Tap to reveal" → verify journal content shows

### Test 2: Always Reveal Journal Setting
- [ ] Go to Profile page
- [ ] Toggle "Always reveal journal" switch ON
- [ ] Go to Today page in report mode
- [ ] Verify journal is visible without tapping
- [ ] Toggle switch OFF
- [ ] Verify journal is hidden again

### Test 3: FREE Habit Limit (Max 3)
- [ ] Sign in as FREE user
- [ ] Create 3 habits
- [ ] Try to create 4th habit
- [ ] Verify paywall modal appears with "habit_limit" trigger
- [ ] Verify copy: "You've reached the free habit limit..."

### Test 4: FREE Journal History (Last 7 Days)
- [ ] Create journal entries for 10+ days
- [ ] As FREE user, try to view entries older than 7 days
- [ ] Verify older entries show lock icon or paywall CTA
- [ ] (Note: Full implementation requires journal history page - placeholder for now)

### Test 5: FREE Theme Limit (Minimal + Soft Only)
- [ ] Go to Profile → Themes
- [ ] Verify Minimal and Soft themes are unlocked
- [ ] Verify Bold and Dark themes show lock icon and "Pro" badge
- [ ] Try to select Bold or Dark theme
- [ ] Verify paywall modal appears with "theme_locked" trigger

---

## D) THEME SWITCHER UI ✅

### Test 1: Theme Selection
- [ ] Go to Profile page
- [ ] See 4 theme options: Minimal, Soft, Bold, Dark
- [ ] Click Minimal → verify theme applies (clean neutrals)
- [ ] Click Soft → verify theme applies (warm peachy tones)
- [ ] As PRO user, click Bold → verify theme applies (purple accent)
- [ ] As PRO user, click Dark → verify theme applies (dark mode)

### Test 2: Theme Persistence
- [ ] Select a theme
- [ ] Refresh page
- [ ] Verify theme persists after refresh

### Test 3: Locked Themes (FREE)
- [ ] As FREE user, verify Bold and Dark show lock icon
- [ ] Click locked theme → verify paywall appears
- [ ] Verify paywall shows "theme_locked" copy

---

## E) EXPORTS (LOCAL DOWNLOADS) ✅

### Test 1: Export CSV (PRO)
- [ ] As PRO user, go to Profile → Export Center
- [ ] Click "Export as CSV"
- [ ] Verify 4 CSV files download:
  - roya-habits-[date].csv
  - roya-habit-logs-[date].csv
  - roya-mood-logs-[date].csv
  - roya-journal-[date].csv
- [ ] Open each CSV → verify data is correct and formatted properly

### Test 2: Export JSON (PRO)
- [ ] As PRO user, go to Profile → Export Center
- [ ] Click "Export as JSON"
- [ ] Verify 1 JSON file downloads: roya-export-[date].json
- [ ] Open JSON → verify contains: user, habits, habitLogs, moodLogs, journalEntries

### Test 3: Export Locked (FREE)
- [ ] As FREE user, go to Profile → Export Center
- [ ] Click "Export as CSV" or "Export as JSON"
- [ ] Verify paywall modal appears with "export_locked" trigger
- [ ] Verify copy: "Pro unlocks exports so you can keep a copy..."

---

## F) PAYWALL / ENTITLEMENTS UX ✅

### Test 1: Paywall Triggers
- [ ] Trigger paywall from 4th habit creation → verify "habit_limit" copy
- [ ] Trigger paywall from locked theme → verify "theme_locked" copy
- [ ] Trigger paywall from export → verify "export_locked" copy
- [ ] Trigger paywall from older journal (when implemented) → verify "journal_history" copy

### Test 2: Paywall Content
- [ ] Verify headline: "Unlock Pro"
- [ ] Verify subhead changes based on trigger
- [ ] Verify 5 benefit bullets with checkmarks
- [ ] Verify 3 plan buttons:
  - "Go Pro (Monthly)" with "flexible" badge
  - "Go Pro (Yearly)" with "best value" badge (green)
  - "Get Lifetime Access" with "own it" badge

### Test 3: Paywall Actions
- [ ] Click "Go Pro (Monthly)" → verify console log (placeholder)
- [ ] Click "Go Pro (Yearly)" → verify console log (placeholder)
- [ ] Click "Get Lifetime Access" → verify console log (placeholder)
- [ ] Click "Restore purchase" → verify console log (placeholder)
- [ ] Click "Not now" → verify modal closes

### Test 4: Paywall Copy Tone
- [ ] Verify reassurance line: "No pressure. You can keep using Roya for free..."
- [ ] Verify footer: "Your data stays yours. Upgrade only unlocks features."
- [ ] Verify tone is calm, not salesy or pressuring

---

## G) BACKFILL LOGGING (DEFERRED TO PHASE 2.1)

⚠️ **Not implemented in Phase 2** - Requires date picker UI and complex streak recalculation.

**Planned for Phase 2.1:**
- [ ] Add date picker to Habit Detail page
- [ ] Allow logging past 7 days
- [ ] Recalculate streaks based on backfilled logs
- [ ] Show visual indicator for backfilled vs real-time logs

---

## ADDITIONAL TESTS

### Test 1: FREE vs PRO Entitlements
- [ ] As FREE user, verify:
  - Max 3 habits
  - Only Minimal + Soft themes
  - No exports
  - Journal history limited (when implemented)
- [ ] As PRO user, verify:
  - Unlimited habits
  - All 4 themes unlocked
  - Exports enabled
  - Full journal history

### Test 2: Subscription Status Display
- [ ] Go to Profile page
- [ ] As FREE user, verify "FREE" badge and "Upgrade to Pro" link
- [ ] As PRO user, verify "PRO" badge with crown icon
- [ ] As LIFETIME user, verify "LIFETIME" badge with crown icon

### Test 3: Bundle Size
- [ ] Check build output
- [ ] Verify bundle size is reasonable (~963 KB, ~280 KB gzipped)
- [ ] Recharts library added but bundle still acceptable

---

## KNOWN LIMITATIONS (PHASE 2)

1. **Backfill Logging**: Not implemented - deferred to Phase 2.1
2. **Journal History Page**: Full journal history with FREE limits needs dedicated page (Phase 2.1)
3. **Stripe Integration**: Paywall buttons are placeholders - real payment flow in Phase 3
4. **Weekly Review**: Mentioned in paywall copy but not implemented yet (Phase 3)
5. **Advanced Analytics**: Mentioned in entitlements but basic insights only for now

---

## SUCCESS CRITERIA

✅ All mood trends display correctly with lightweight charts
✅ Insights show associations without medical claims
✅ FREE tier limits enforced consistently
✅ Theme switcher works with PRO locks
✅ Exports download correct data (CSV + JSON)
✅ Paywall triggers appropriately with calm, premium copy
✅ Journal privacy mode works with toggle setting
✅ Bundle size remains reasonable (<1 MB)

---

**Phase 2 Status**: ✅ Complete (except backfill logging - deferred to Phase 2.1)

**Next Steps**:
- Phase 2.1: Backfill logging with date picker
- Phase 3: Period tracker, Salah module, Weekly Review
- Phase 4: Stripe integration, real payment flow