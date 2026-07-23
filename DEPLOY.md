# Sapphire MVP — Deployment Guide

## Step 1: Connect to Vercel (5 min)

1. Go to https://vercel.com/new
2. Select "Import Git Repository"
3. Paste: `https://github.com/iveecore/sapphire-mvp`
4. Click "Import"

## Step 2: Set Environment Variables

In Vercel dashboard, add these env vars:

```
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
OPENROUTER_API_KEY=your-api-key
```

**How to get these:**

1. **Supabase setup:**
   - Go to https://supabase.com → create new project
   - Database name: `sapphire_prod`
   - Note the connection string + keys from Project Settings
   - Run SQL migrations (copy content of `supabase/migrations/001_initial_schema.sql`)

2. **OpenRouter:**
   - Sign up at https://openrouter.ai
   - Create API key in dashboard
   - Paste into Vercel env vars

## Step 3: Deploy

1. Click "Deploy" in Vercel
2. Wait 3-5 minutes for build
3. Your app is live at: `https://sapphire-mvp.vercel.app`

## Step 4: Verify Deployment

1. Visit https://sapphire-mvp.vercel.app
2. Test: Click "Get Started" → Should load signup page
3. Test: `/api/health` endpoint → Should return `{"status":"ok"}`

## Troubleshooting

**Build fails:** Check Vercel logs for missing env vars or syntax errors
**Blank page:** Clear browser cache, check console for errors
**API 500:** Supabase not connected — verify SUPABASE_URL and keys

## Auto-Deploy

Every push to GitHub `main` branch auto-deploys to Vercel. 

To deploy a change:
```bash
git push origin main
# Vercel builds + deploys automatically
```

---

## RELIABILITY CHECKLIST

✅ Code on GitHub (version control)
✅ Automated builds (Vercel CI/CD)
✅ HTTPS enabled (Vercel auto)
✅ 99.9% uptime (Vercel SLA)
✅ Auto-rollback on build failure
✅ Preview deployments for every PR

**Reliability Score: PRODUCTION-READY** 🚀
