# Quick Start: Deploy Sapphire Agent in 10 Minutes

## Step-by-Step Setup

### 1. Install & Build (2 min)

```bash
npm install
npm run build
```

✅ Should complete with no TypeScript errors.

### 2. Set Environment Variables (2 min)

Create `.env.local` in project root:

```env
NEXT_PUBLIC_SUPABASE_URL=https://awxkdzdjlgrzelznktre.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<get from Supabase>
SUPABASE_SERVICE_ROLE_KEY=<get from Supabase>
ANTHROPIC_API_KEY=<get from Anthropic>
```

**Where to find keys:**
- Supabase: https://app.supabase.com → Project Settings → API
- Anthropic: https://console.anthropic.com → Account Keys

### 3. Create Database Tables (3 min)

Go to Supabase SQL Editor:
1. Click "SQL Editor" (left sidebar)
2. Click "New Query"
3. Paste this entire SQL block (from AGENT_SETUP.md under "Create Supabase Tables")
4. Click "Run"

**Tables created:**
- `agent_dna`
- `agent_sessions`
- `agent_messages`
- `user_token_balance`
- `token_transactions`

**Then enable RLS** (paste the RLS policies from AGENT_SETUP.md and run)

### 4. Update Auth Callback (1 min)

Edit `src/pages/api/auth/callback.ts`

Find the line where `privacy_settings` is created, and add after it:

```typescript
await service.from('user_token_balance').insert({
  user_id: userId,
  balance: 150,
  total_purchased: 0,
  total_earned_free: 150,
  total_consumed: 0,
  updated_at: new Date().toISOString(),
  created_at: new Date().toISOString()
})
```

### 5. Add Navigation Link (1 min)

In `src/app/layout.tsx`, add a link to the companion:

```typescript
<a href="/companion" className="...">
  <Sparkles size={14} /> Companion
</a>
```

Or add to dashboard sidebar.

### 6. Start Dev Server (1 min)

```bash
npm run dev
```

Visit http://localhost:3000

---

## Test It Out

### Signup & First Chat

1. Click "Get started" → Sign up
2. Navigate to `/companion`
3. Send a message: "What should I wear today?"
4. Watch response stream in real-time
5. Token balance should decrease (150 → ~110)
6. Refresh page → same session resumes ✅

### Verify Database

Supabase → SQL Editor → Run this query:

```sql
SELECT * FROM user_token_balance 
WHERE user_id = '<your-user-id>' 
LIMIT 1;
```

Should show balance < 150 after your first chat.

---

## What You Have

| Component | Location | Status |
|-----------|----------|--------|
| Core Agent | `src/lib/agent/` | ✅ Ready |
| API Endpoints | `src/pages/api/agent/` | ✅ Ready |
| Chat UI | `src/app/companion/page.tsx` | ✅ Ready |
| Database Schema | Supabase tables | 📋 To Create |
| Environment | `.env.local` | 📋 To Configure |
| Auth Integration | `src/pages/api/auth/callback.ts` | 📋 To Update |

---

## Troubleshooting

### Build fails with TypeScript errors
- Check that `@anthropic-ai/sdk` is installed: `npm ls @anthropic-ai/sdk`
- Re-run `npm install` to ensure all deps are present

### `/companion` page is blank
- Check browser console (F12) for errors
- Check that you're logged in (should have `ivee_session` cookie)
- Verify SUPABASE_SERVICE_ROLE_KEY is set in .env.local

### Chat sends but no response
- Check that `ANTHROPIC_API_KEY` is set
- Verify it's a valid key (not expired)
- Check Anthropic dashboard for API usage/errors

### "Insufficient token balance" immediately
- Check that token_balance was initialized on signup
- Query database: `SELECT * FROM user_token_balance`

---

## Full Documentation

For details on system design, architecture, and APIs, see:
- `AGENT_ARCHITECTURE.md` — System overview & design
- `AGENT_SETUP.md` — Full setup guide with migrations
- `IMPLEMENTATION_CHECKLIST.md` — Deployment checklist
- `AGENT_SUMMARY.md` — What was built & why

---

## Next Steps

1. ✅ Follow this guide (5-10 min)
2. ✅ Test signup → first chat
3. ✅ Deploy to staging
4. ✅ Run full test suite (QA)
5. ✅ Deploy to production
6. ✅ Monitor usage & errors

---

**Ready? Let's go! 🚀**

Start with Step 1 above.
