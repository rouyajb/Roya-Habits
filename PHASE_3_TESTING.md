# ✅ PHASE 3 TESTING CHECKLIST

Complete testing guide for Phase 3: Weekly Review feature (PRO-only).

---

## A) ACCESS + SCHEDULE ✅

### Test 1: Navigation
- [ ] Go to Today page → verify "Review" tab appears in bottom navigation
- [ ] Click "Review" tab → verify Weekly Review page loads
- [ ] Verify page shows current week (Mon-Sun) by default
- [ ] Check week range format: "Dec 23 – Dec 29, 2025"

### Test 2: Week Navigation
- [ ] Click left arrow (◀) → verify goes to previous week
- [ ] Click right arrow (▶) → verify goes to next week
- [ ] Verify future weeks are disabled (right arrow grayed out)
- [ ] Navigate back to current week → verify "current week" loads correctly

### Test 3: PRO Gating (FREE Users)
- [ ] Sign in as FREE user
- [ ] Go to Weekly Review page
- [ ] Verify locked preview with blur effect
- [ ] Verify lock icon and "Weekly Review is a Pro Feature" message
- [ ] Click "Unlock Pro" → verify paywall modal appears with "general" trigger

### Test 4: PRO Access
- [ ] Sign in as PRO or LIFETIME user
- [ ] Go to Weekly Review page
- [ ] Verify full access to all features
- [ ] Verify no blur or lock overlay

---

## B) WEEKLY REVIEW CONTENT ✅

### Test 1: Check-in Consistency
- [ ] Complete check-ins for 3 days (habits + mood)
- [ ] Go to Weekly Review
- [ ] Verify shows "3/7 days" with 43% progress bar
- [ ] Verify description: "Days with habits logged and mood tracked"
- [ ] Complete more check-ins → verify count updates

### Test 2: Habit Performance - WIN Habits
- [ ] Create 3+ WIN habits
- [ ] Log habits with varying completion rates
- [ ] Go to Weekly Review
- [ ] Verify "Top WIN Habits" section shows top 3 by completion rate
- [ ] Verify each habit shows: rank badge, name, completion %
- [ ] Verify habits are sorted by completion rate (highest first)

### Test 3: Habit Performance - QUIT Habits
- [ ] Create 1+ QUIT habits
- [ ] Log clean days and/or relapses
- [ ] Go to Weekly Review
- [ ] Verify "QUIT Habits" section shows total clean days
- [ ] Verify relapse count is shown but not prominent (green background, subtle)
- [ ] Check copy is compassionate (no guilt)

### Test 4: Best Streak Continued
- [ ] Maintain a habit streak ≥7 days
- [ ] Go to Weekly Review
- [ ] Verify "Best streak" badge appears with habit name and streak count
- [ ] Verify sparkle icon and primary color styling

### Test 5: Mood Summary - Average Score
- [ ] Log mood for multiple days with varying scores
- [ ] Go to Weekly Review
- [ ] Verify "Average mood" displays correct score (e.g., "3.5/5")
- [ ] Verify score is rounded to 1 decimal place

### Test 6: Mood Summary - Sparkline Chart
- [ ] Log mood for all 7 days of the week
- [ ] Go to Weekly Review
- [ ] Verify mood sparkline chart appears
- [ ] Verify X-axis shows day abbreviations (Mon, Tue, Wed, etc.)
- [ ] Verify Y-axis shows scale 1-5
- [ ] Verify line connects all mood scores
- [ ] Check chart is lightweight and renders quickly

### Test 7: Mood Summary - Top Tags
- [ ] Log mood with various tags (e.g., "energized", "calm", "anxious")
- [ ] Go to Weekly Review
- [ ] Verify "Most common tags" section shows top 3-5 tags
- [ ] Verify each tag shows count: "energized (3)"
- [ ] Verify tags are sorted by frequency

### Test 8: Gentle Insights
- [ ] Complete ≥80% habits on several days
- [ ] Log mood for those days
- [ ] Go to Weekly Review
- [ ] Verify insight 1: "On days you completed most of your habits, your mood was X/5 on average"
- [ ] Verify insight 2: "Your best day this week was [day] (X/5)"
- [ ] Verify insight 3: "One habit that supported you most: [habit name]"
- [ ] Verify max 3 insights shown
- [ ] Verify disclaimer: "Insights are informational and show associations, not causation"

---

## C) NEXT WEEK FOCUS ✅

### Test 1: Set Intentions (Current Week Only)
- [ ] Navigate to current week in Weekly Review
- [ ] Verify "Next Week Focus" card appears
- [ ] Click "Set Next Week Focus" button
- [ ] Verify form shows 4 preset options:
  - "Keep habits small"
  - "Protect mornings"
  - "Earlier sleep"
  - "Movement"
- [ ] Verify custom text area for additional intention

### Test 2: Select Intentions (Max 3)
- [ ] Select 2 preset intentions
- [ ] Try to select 4th intention → verify error: "Maximum 3 intentions allowed"
- [ ] Deselect one → verify can select another
- [ ] Add custom intention text
- [ ] Click "Save Intentions" → verify success toast

### Test 3: View Saved Intentions
- [ ] After saving intentions, verify they appear in "Next Week Focus" card
- [ ] Verify each intention shows with numbered badge (1, 2, 3)
- [ ] Verify "Update Intentions" button appears
- [ ] Click "Update Intentions" → verify can modify

### Test 4: Intentions on Today Page
- [ ] Save intentions for next week (Mon-Sun)
- [ ] Wait until next week starts (or manually change date for testing)
- [ ] Go to Today page
- [ ] Verify "This Week's Focus" card appears at top
- [ ] Verify shows all saved intentions with numbered badges
- [ ] Verify "View Review" button links to Weekly Review page

### Test 5: Intentions Persistence
- [ ] Set intentions for next week
- [ ] Refresh page → verify intentions persist
- [ ] Sign out and sign in → verify intentions still saved
- [ ] Navigate to different weeks → verify intentions only show for correct week

---

## D) EXPORT / SHARE (PRO) ✅

### Test 1: Copy Summary (Plain Text)
- [ ] Go to Weekly Review page (PRO user)
- [ ] Click "Copy Summary" button
- [ ] Verify toast: "Summary copied to clipboard"
- [ ] Paste into text editor → verify format:
  ```
  WEEKLY REVIEW: Dec 23 – Dec 29, 2025
  
  CHECK-IN CONSISTENCY
  5/7 days completed (71%)
  
  HABIT PERFORMANCE
  Top WIN habits:
  1. Morning meditation (100%)
  2. Exercise (85%)
  3. Reading (71%)
  
  MOOD SUMMARY
  Average mood: 3.8/5
  Top tags: energized, calm, focused
  
  INSIGHTS
  1. On days you completed most of your habits, your mood was 4.2/5 on average.
  2. Your best day this week was Wednesday (5/5).
  3. One habit that supported you most: "Morning meditation".
  
  NEXT WEEK FOCUS
  1. Keep habits small
  2. Protect mornings
  3. Earlier sleep
  ```

### Test 2: Export PDF
- [ ] Go to Weekly Review page (PRO user)
- [ ] Click "Export PDF" button
- [ ] Verify button shows "Exporting..." during generation
- [ ] Verify PDF downloads: `roya-weekly-review-Dec-23-Dec-29-2025.pdf`
- [ ] Open PDF → verify contains all sections:
  - Week range header
  - Check-in consistency with progress bar
  - Habit performance with top habits
  - Mood summary with chart
  - Insights
  - Next week intentions (if set)
- [ ] Verify PDF is clean, readable, and printable

### Test 3: Export Locked (FREE Users)
- [ ] Sign in as FREE user
- [ ] Go to Weekly Review page
- [ ] Verify export buttons are not visible (page is locked)
- [ ] Verify must unlock Pro to access export features

---

## E) UX / TONE ✅

### Test 1: Premium, Calm Design
- [ ] Review overall page design
- [ ] Verify feels "report-like" and professional
- [ ] Verify uses soft colors (primary/5 backgrounds)
- [ ] Verify rounded corners and subtle shadows
- [ ] Verify no heavy animations or confetti
- [ ] Check subtle celebration for best streak (sparkle icon + badge)

### Test 2: Compassionate Copy
- [ ] Review all text on the page
- [ ] Verify no guilt-inducing language
- [ ] Check QUIT habits section uses "clean days" (not "abstinence")
- [ ] Verify relapse count is shown but not prominent
- [ ] Check insights use soft wording: "associated with", "supported you"

### Test 3: Empty States
- [ ] Create new account with no data
- [ ] Go to Weekly Review
- [ ] Verify shows "No data available for this week" (not error)
- [ ] Log some data → verify page updates correctly

### Test 4: Loading States
- [ ] Navigate to Weekly Review
- [ ] Verify loading spinner appears briefly
- [ ] Verify smooth transition to content

---

## F) DATA REQUIREMENTS ✅

### Test 1: Data Sources
- [ ] Verify Weekly Review uses existing localStorage data:
  - Habit logs
  - Mood logs
  - Journal entries (optional, not required for review)
  - Milestones (optional, for best streak)

### Test 2: Week Calculation (Mon-Sun, Europe/Berlin)
- [ ] Check week ranges align with Monday-Sunday
- [ ] Verify timezone is Europe/Berlin (CET/CEST)
- [ ] Test across month boundaries (e.g., Dec 30 - Jan 5)
- [ ] Test across year boundaries (e.g., Dec 28, 2025 - Jan 3, 2026)

### Test 3: Data Accuracy
- [ ] Manually count check-in days → verify matches review
- [ ] Calculate habit completion rates → verify matches top habits
- [ ] Calculate average mood → verify matches mood summary
- [ ] Count mood tags → verify matches top tags
- [ ] Verify insights are based on actual data (not random)

---

## G) BUNDLE SIZE ✅

### Test 1: Dependencies Added
- [ ] Verify `html2canvas` added for PDF export
- [ ] Verify `jspdf` added for PDF generation
- [ ] Check `package.json` includes both dependencies

### Test 2: Build Size
- [ ] Run `pnpm run build`
- [ ] Check bundle size is reasonable (<1.5 MB uncompressed)
- [ ] Verify gzipped size is acceptable (<400 KB)
- [ ] Compare with Phase 2 bundle size (should be similar, ~50-100 KB increase)

---

## H) INTEGRATION TESTS ✅

### Test 1: Navigation Flow
- [ ] Start on Today page
- [ ] Click "Review" tab → verify Weekly Review loads
- [ ] Click "Today" tab → verify returns to Today page
- [ ] Verify bottom nav highlights correct tab

### Test 2: Intentions Flow
- [ ] Set intentions in Weekly Review for next week
- [ ] Wait until next week (or change date)
- [ ] Go to Today page → verify intentions card appears
- [ ] Click "View Review" → verify navigates to Weekly Review

### Test 3: Cross-Page Data Sync
- [ ] Log habits and mood on Today page
- [ ] Go to Weekly Review → verify data appears immediately
- [ ] Go back to Today page → verify no data loss

---

## SUCCESS CRITERIA

✅ Weekly Review page loads correctly for current and previous weeks
✅ All metrics match actual logged data (check-in consistency, habit performance, mood summary)
✅ FREE users see locked preview and paywall triggers
✅ PRO users can export weekly review (PDF) and copy summary (plain text)
✅ Next Week intentions persist and appear on Today page during that week
✅ Week calculation uses Mon-Sun with Europe/Berlin timezone
✅ UX feels premium, calm, and "report-like"
✅ Relapse language is compassionate and not prominent
✅ Bundle size remains reasonable (<1.5 MB uncompressed)
✅ No new heavy libraries added (html2canvas + jspdf are acceptable)

---

**Phase 3 Status**: ✅ Complete

**Next Steps**:
- Phase 2.1: Backfill logging with date picker
- Phase 4: Period tracker, Salah module
- Phase 5: Stripe integration, real payment flow