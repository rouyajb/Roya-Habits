# 🚀 DEPLOYMENT GUIDE

This guide covers deploying the Roya PWA to Vercel or Netlify with proper SPA routing configuration.

---

## Prerequisites

- Node.js 18+ installed
- pnpm installed (`npm install -g pnpm`)
- Git repository initialized
- Vercel or Netlify account

---

## Option 1: Deploy to Vercel (Recommended)

### Step 1: Install Vercel CLI (Optional)

```bash
npm install -g vercel
```

### Step 2: Create vercel.json

Create `vercel.json` in project root:

```json
{
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

This ensures all routes fallback to index.html for React Router to handle.

### Step 3: Deploy via Vercel Dashboard

1. Go to [vercel.com](https://vercel.com)
2. Click "Add New Project"
3. Import your Git repository
4. Configure build settings:
   - **Framework Preset**: Vite
   - **Build Command**: `pnpm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `pnpm install`
5. Click "Deploy"

### Step 4: Deploy via Vercel CLI (Alternative)

```bash
# Login to Vercel
vercel login

# Deploy to production
vercel --prod
```

### Step 5: Verify Deployment

- Visit your deployed URL
- Test navigation: click through Today, Habits, Calendar, Weekly Review, Cycle Lens
- Refresh on each page → verify no 404 errors
- Test authentication flow
- Test Cycle Lens calendar and settings

---

## Option 2: Deploy to Netlify

### Step 1: Create _redirects File

Create `public/_redirects`:

```
/*    /index.html   200
```

This ensures all routes fallback to index.html for React Router to handle.

### Step 2: Deploy via Netlify Dashboard

1. Go to [netlify.com](https://netlify.com)
2. Click "Add new site" → "Import an existing project"
3. Connect your Git repository
4. Configure build settings:
   - **Build command**: `pnpm run build`
   - **Publish directory**: `dist`
   - **Base directory**: (leave empty)
5. Click "Deploy site"

### Step 3: Deploy via Netlify CLI (Alternative)

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Login to Netlify
netlify login

# Build the project
pnpm run build

# Deploy to production
netlify deploy --prod --dir=dist
```

### Step 4: Verify Deployment

- Visit your deployed URL
- Test navigation: click through Today, Habits, Calendar, Weekly Review, Cycle Lens
- Refresh on each page → verify no 404 errors
- Test authentication flow
- Test Cycle Lens calendar and settings

---

## Environment Variables

If you plan to add backend services (Supabase, Stripe, etc.) later, configure environment variables:

### Vercel

1. Go to Project Settings → Environment Variables
2. Add variables:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
   - `VITE_STRIPE_PUBLISHABLE_KEY`

### Netlify

1. Go to Site Settings → Environment Variables
2. Add variables:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
   - `VITE_STRIPE_PUBLISHABLE_KEY`

---

## Custom Domain

### Vercel

1. Go to Project Settings → Domains
2. Add your custom domain
3. Configure DNS records as instructed
4. Wait for SSL certificate provisioning

### Netlify

1. Go to Site Settings → Domain Management
2. Add custom domain
3. Configure DNS records as instructed
4. Wait for SSL certificate provisioning

---

## Performance Optimization

### Enable Compression

Both Vercel and Netlify automatically enable gzip/brotli compression.

### Enable Caching

Vercel and Netlify automatically cache static assets with proper headers.

### Monitor Bundle Size

Current bundle size (Phase 4):
- Main bundle: ~1,547 KB (456 KB gzipped)
- CSS: ~67 KB (12 KB gzipped)

If bundle grows significantly, consider:
- Code splitting with React.lazy()
- Lazy loading html2canvas and jsPDF
- Tree shaking unused dependencies

---

## Troubleshooting

### 404 Errors on Refresh

**Problem**: Refreshing on /app/habits returns 404

**Solution**: 
- Vercel: Ensure `vercel.json` exists with rewrites
- Netlify: Ensure `public/_redirects` exists

### Build Fails

**Problem**: Build fails with "out of memory" error

**Solution**: Increase Node memory limit in build command:
```bash
NODE_OPTIONS=--max_old_space_size=4096 pnpm run build
```

### Slow Initial Load

**Problem**: First page load is slow

**Solution**:
- Enable code splitting
- Lazy load heavy components (Weekly Review, Cycle Lens)
- Optimize images (use WebP format)

---

## Post-Deployment Checklist

- [ ] All routes work on refresh
- [ ] Authentication flow works
- [ ] Habits can be created and logged
- [ ] Mood logging works
- [ ] Journal entries save
- [ ] Weekly Review generates correctly
- [ ] Cycle Lens calendar displays
- [ ] Cycle Lens settings persist
- [ ] Today page shows phase card (if enabled)
- [ ] Export PDF works
- [ ] Copy summary works
- [ ] Mobile responsive design works
- [ ] Dark mode works
- [ ] PWA install prompt appears (mobile)

---

## Monitoring

### Vercel Analytics

Enable Vercel Analytics in Project Settings → Analytics

### Netlify Analytics

Enable Netlify Analytics in Site Settings → Analytics

### Custom Analytics

If using Google Analytics or Plausible, add tracking code to `index.html`.

---

## Continuous Deployment

Both Vercel and Netlify support automatic deployments:

1. Push to `main` branch → auto-deploys to production
2. Push to `develop` branch → auto-deploys to preview
3. Pull requests → auto-generates preview URLs

---

## Rollback

### Vercel

1. Go to Deployments
2. Find previous working deployment
3. Click "Promote to Production"

### Netlify

1. Go to Deploys
2. Find previous working deploy
3. Click "Publish deploy"

---

## Support

- Vercel: [vercel.com/support](https://vercel.com/support)
- Netlify: [netlify.com/support](https://netlify.com/support)
- Roya PWA: See PROJECT_STATUS.md for project overview

---

**Deployment Status**: Ready for deployment

**Recommended Platform**: Vercel (better React/Vite integration, faster builds)

**Next Steps After Deployment**:
1. Test all features on production
2. Share link for user testing
3. Gather feedback
4. Implement Phase 2.1 (Backfill Logging)
5. Implement Phase 5 (Stripe Integration)