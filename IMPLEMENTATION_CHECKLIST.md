# Sapphire Agent System — Implementation Checklist

## Overview

This checklist tracks the setup and deployment of the per-user AI agent system. All core files are written; this guide ensures proper Supabase configuration and deployment.

## Status: ✅ Core Implementation Complete

All core TypeScript, API, and UI files have been written. Remaining work is database setup and integration testing.

---

## Pre-Deployment Checklist

### 1. Database Setup

- [ ] Access Supabase project `awxkdzdjlgrzelznktre`
- [ ] Go to SQL Editor in dashboard
- [ ] Copy the migration SQL from `AGENT_SETUP.md` (Agent Tables section)
- [ ] Run each CREATE TABLE statement
- [ ] Run RLS policy statements
- [ ] Verify tables appear in Tables list (left sidebar)
  - [ ] `agent_dna`
  - [ ] `agent_sessions`
  - [ ] `agent_messages`
  - [ ] `user_token_balance`
  - [ ] `token_transactions`
- [ ] Verify indexes were created (check table details)

### 2. Environment Variables

- [ ] Copy `.env.example` to `.env.local` (or update existing `.env.local`)
- [ ] Ensure these variables are set:
  ```
  NEXT_PUBLIC_SUPABASE_URL=https://awxkdzdjlgrzelznktre.supabase.co
  NEXT_PUBLIC_SUPABASE_ANON_KEY=<your-key>
  SUPABASE_SERVICE_ROLE_KEY=<your-key>
  ANTHROPIC_API_KEY=<your-key>
  ```
- [ ] Verify keys are correct (test with curl if needed)
- [ ] Do NOT commit `.env.local` to git

### 3. Dependencies

- [ ] Run `npm install` (should include `@anthropic-ai/sdk`)
- [ ] Verify `@anthropic-ai/sdk` appears in `package-lock.json`
- [ ] Run `npm run build` to check for TypeScript errors
  - If errors: review error messages and fix imports/types

### 4. Auth Integration

- [ ] Edit `src/pages/api/auth/callback.ts`
- [ ] Add token balance initialization after privacy_settings creation:
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
- [ ] Test signup flow: create new account and verify `user_token_balance` row exists

### 5. Navigation

- [ ] Add link to `/companion` in main navigation (e.g., in `src/app/layout.tsx`)
- [ ] Option 1: Add to header nav menu
- [ ] Option 2: Add to dashboard sidebar
- [ ] Suggested label: "Companion" or "AI Stylist" with icon (Sparkles from lucide-react)

---

## File Inventory

### Core Libraries (`src/lib/agent/`)

- [x] `types.ts` — Type definitions for all agent entities
- [x] `dna.ts` — Agent DNA hydration, personality updates
- [x] `session.ts` — Session lifecycle (create, resume, end)
- [x] `tokens.ts` — Token balance tracking and consumption
- [x] `anthropic.ts` — Claude API wrapper with streaming
- [x] `utils.ts` — Helper functions for mood detection, scoring, etc.

### API Endpoints (`src/pages/api/agent/`)

- [x] `chat.ts` — POST streaming chat endpoint
- [x] `dna.ts` — GET/PUT agent DNA endpoint
- [x] `sessions.ts` — GET sessions, DELETE to end session
- [x] `messages.ts` — GET message history for a session

### UI (`src/app/companion/`)

- [x] `page.tsx` — Main chat interface (messaging, session list, token display)
- [x] `layout.tsx` — Wrapper layout

### Documentation

- [x] `AGENT_ARCHITECTURE.md` — System design and API documentation
- [x] `AGENT_SETUP.md` — Installation and setup guide
- [x] `IMPLEMENTATION_CHECKLIST.md` — This file

### Modified Files

- [x] `package.json` — Added `@anthropic-ai/sdk`
- [x] `src/app/globals.css` — Added `.animate-fadeUp` and animation delay utilities

---

## Testing Checklist

### Unit Tests (Optional but Recommended)

- [ ] Test `dna.ts`: hydrate for new user, existing user
- [ ] Test `tokens.ts`: initialize, grant, deduct, validate
- [ ] Test `session.ts`: create, resume, end sessions
- [ ] Test `utils.ts`: mood detection, color palette mapping

### Integration Tests

- [ ] Test full signup → token init → first chat flow
- [ ] Test session resumption (close browser, reopen → same session)
- [ ] Test streaming response (watch tokens arrive in real-time)
- [ ] Test token deduction (verify balance decreases after each message)

### Manual Testing (QA)

1. **Setup**
   - [ ] Start dev server: `npm run dev`
   - [ ] Clear browser cookies
   - [ ] Clear `localStorage`

2. **Signup Flow**
   - [ ] Navigate to `/signup`
   - [ ] Create new account
   - [ ] Verify redirects to `/dashboard`
   - [ ] Check that `user_token_balance` row exists in Supabase

3. **Companion First Visit**
   - [ ] Navigate to `/companion`
   - [ ] See agent name and 150 token balance
   - [ ] No sessions yet (sidebar is empty)
   - [ ] Hero state visible ("Hi, I'm Sapphire!")

4. **Send First Message**
   - [ ] Click on a suggested message or type one
   - [ ] Watch response stream token-by-token
   - [ ] Response should complete in 2-5 seconds
   - [ ] Token balance should decrease (150 → 105 or similar)
   - [ ] Message saved with role="user" and role="assistant"

5. **Session Persistence**
   - [ ] Refresh the page
   - [ ] Same session resumes (messages still visible)
   - [ ] Session appears in sidebar
   - [ ] Message count accurate

6. **Multiple Sessions**
   - [ ] Click "New chat" button
   - [ ] Sidebar shows both old and new sessions
   - [ ] New session has 0 messages
   - [ ] Send a message to new session
   - [ ] Click old session → messages return
   - [ ] Click new session → new messages return

7. **Edge Cases**
   - [ ] Send very long message (2000+ chars) → should be rejected
   - [ ] Send empty message → should be rejected
   - [ ] Deplete tokens → should show error
   - [ ] Close browser during streaming → should handle gracefully
   - [ ] Network interruption → should show error state

8. **Mobile Responsive**
   - [ ] View on mobile (DevTools device mode)
   - [ ] Sidebar collapses by default
   - [ ] Menu icon opens/closes sidebar
   - [ ] Chat bubbles readable
   - [ ] Input area usable

### Performance Testing

- [ ] Response time <100ms to first token
- [ ] Full response <10 seconds
- [ ] Page load <2 seconds
- [ ] No console errors or warnings
- [ ] Memory usage stable (no leaks)

---

## Deployment Checklist

### Pre-Deploy

- [ ] All tests passing
- [ ] No TypeScript errors: `npm run build`
- [ ] No console errors in browser DevTools
- [ ] Environment variables set in deployment platform
- [ ] RLS policies verified in Supabase (Tables → select table → Security)

### Deploy to Vercel (or similar)

- [ ] Push code to GitHub
- [ ] Vercel auto-deploys OR manually deploy
- [ ] Verify all environment variables are set in Vercel dashboard
- [ ] Test on deployed URL:
  - [ ] Signup → gets token balance
  - [ ] Navigate to `/companion`
  - [ ] Send message → token deducted
  - [ ] Refresh → session resumes

### Post-Deploy

- [ ] Monitor error logs (Vercel Logs, Sentry, etc.)
- [ ] Check Anthropic API usage dashboard
- [ ] Verify no rate limit errors
- [ ] Set up alerts for:
  - [ ] Anthropic API errors
  - [ ] Database query timeouts
  - [ ] Streaming timeout errors

---

## Known Issues & Workarounds

### Issue: "ANTHROPIC_API_KEY missing"
**Cause:** Environment variable not set  
**Fix:** Add to `.env.local` or deployment platform env vars

### Issue: Streaming stops mid-response
**Cause:** Network interruption or long response time  
**Fix:** Show error UI and allow user to retry (already implemented)

### Issue: Token deduction doesn't match Anthropic tokens
**Cause:** Timing between streaming completion and final usage event  
**Fix:** We capture usage on stream end; diff < 5% normal

### Issue: Session not found after refresh
**Cause:** RLS policy blocking read  
**Fix:** Verify user is authenticated and user_id matches

### Issue: Response takes >10 seconds
**Cause:** Model latency (Claude Haiku is usually fast)  
**Fix:** Monitor Anthropic dashboard; consider implementing timeout with user feedback

---

## Future Enhancements

### Phase 2 (Recommended)

- [ ] **Outfit memory:** Agent remembers past outfits and references them
- [ ] **Multi-turn planning:** "Plan my week" → generates 7-day outfit plan
- [ ] **Mood-aware generation:** System prompt adjusts based on detected user mood
- [ ] **Function calling:** Agent can query wardrobe, recommendations, body profile directly
- [ ] **Shared insights:** "70% of our users wear earth tones in fall" (anonymized)

### Phase 3 (Long-term)

- [ ] **Agent learning:** Finetune on user's conversation history
- [ ] **Voice interface:** Speak to agent, get spoken response
- [ ] **Image generation:** "Generate a mood board for my spring wardrobe"
- [ ] **Social sharing:** "Share this chat as a style guide"
- [ ] **Multi-agent:** Multiple personality modes ("Edgy Luna" vs "Classic Sophia")

---

## Support & Debugging

### Common Debug Steps

1. **Check browser console:** `F12` → Console tab
2. **Check server logs:** `npm run dev` terminal output
3. **Check Supabase logs:** Dashboard → Logs → API activity
4. **Check Anthropic dashboard:** https://console.anthropic.com → Logs

### Useful Commands

```bash
# Check types
npm run build

# Format code
npm run lint

# Test auth flow
curl -X GET http://localhost:3000/api/auth/me \
  -H "Cookie: ivee_session=<your-cookie>"

# Manually call chat API
curl -X POST http://localhost:3000/api/agent/chat \
  -H "Content-Type: application/json" \
  -H "Cookie: ivee_session=<your-cookie>" \
  -d '{"message": "Hello!"}'
```

### Database Queries (Supabase SQL Editor)

```sql
-- Check token balance for a user
SELECT * FROM user_token_balance WHERE user_id = '<user-id>';

-- Check recent messages
SELECT * FROM agent_messages 
WHERE user_id = '<user-id>' 
ORDER BY created_at DESC 
LIMIT 10;

-- Check token transactions
SELECT * FROM token_transactions 
WHERE user_id = '<user-id>' 
ORDER BY created_at DESC 
LIMIT 20;

-- Count sessions per user
SELECT user_id, COUNT(*) as session_count 
FROM agent_sessions 
GROUP BY user_id;
```

---

## Success Criteria

✅ **Deployment is successful when:**

1. New users get 150 starter tokens on signup
2. Navigating to `/companion` loads agent DNA
3. Sending a message streams response token-by-token
4. Token balance decreases after each message
5. Refreshing the page resumes the same session
6. Multiple sessions can be created and switched between
7. No console errors or database errors
8. Response time <5 seconds (including streaming)
9. Mobile-responsive UI works on all screen sizes
10. Logout works and clears session data

---

## Sign-Off

- [ ] Database migrations completed
- [ ] Environment variables configured
- [ ] Auth integration tested
- [ ] Manual QA passed
- [ ] Performance acceptable
- [ ] Deployed and live
- [ ] Post-deploy monitoring active

**Date Completed:** ___________  
**Deployed By:** ___________  
**Version:** 1.0.0  
