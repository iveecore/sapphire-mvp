# Sapphire Agent System Setup Guide

## Overview

This guide walks through setting up the per-user AI agent system for Sapphire. Each user gets their own "DNA" profile with unique personality, style preferences, and conversation history.

## Prerequisites

- Supabase project ID: `awxkdzdjlgrzelznktre`
- Anthropic API key (from [console.anthropic.com](https://console.anthropic.com))
- Node.js 18+ and npm

## Installation

### 1. Install Dependencies

```bash
npm install
```

This includes:
- `@anthropic-ai/sdk` — Claude API client
- Existing: `@supabase/supabase-js`, `next`, `react`, etc.

### 2. Environment Variables

Add these to `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://awxkdzdjlgrzelznktre.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<your-anon-key>
SUPABASE_SERVICE_ROLE_KEY=<your-service-role-key>
ANTHROPIC_API_KEY=<your-anthropic-api-key>
```

**Where to find these:**
- Supabase keys: Project Settings → API in the Supabase dashboard
- Anthropic key: https://console.anthropic.com/account/keys

### 3. Create Supabase Tables

Run these migrations in your Supabase project. Use the SQL editor in the dashboard (SQL Editor in the left sidebar) or the CLI.

#### Migration: Create Agent Tables

```sql
-- Agent DNA: per-user personality and preferences
CREATE TABLE IF NOT EXISTS agent_dna (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  agent_name TEXT DEFAULT 'Sapphire',
  persona_name TEXT DEFAULT 'Jasmine',
  style_personality JSONB DEFAULT '{}',
  body_profile_summary JSONB DEFAULT '{}',
  mood_patterns JSONB DEFAULT '{}',
  conversation_style JSONB DEFAULT '{}',
  total_messages_exchanged INT DEFAULT 0,
  last_active_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Agent sessions: conversation sessions
CREATE TABLE IF NOT EXISTS agent_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  session_token TEXT NOT NULL UNIQUE,
  started_at TIMESTAMPTZ DEFAULT NOW(),
  last_activity_at TIMESTAMPTZ DEFAULT NOW(),
  ended_at TIMESTAMPTZ,
  message_count INT DEFAULT 0,
  tokens_used_in_session INT DEFAULT 0,
  context_snapshot JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Agent messages: conversation history
CREATE TABLE IF NOT EXISTS agent_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  session_id UUID NOT NULL REFERENCES agent_sessions(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('user', 'assistant')),
  content TEXT NOT NULL,
  tokens_consumed INT,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- User token balances
CREATE TABLE IF NOT EXISTS user_token_balance (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  balance INT DEFAULT 150,
  total_purchased INT DEFAULT 0,
  total_earned_free INT DEFAULT 150,
  total_consumed INT DEFAULT 0,
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Token transaction log
CREATE TABLE IF NOT EXISTS token_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  amount INT NOT NULL,
  reason TEXT NOT NULL CHECK (reason IN ('purchase', 'message_consumption', 'signup_bonus', 'event_earned')),
  reference_id UUID,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_agent_dna_user_id ON agent_dna(user_id);
CREATE INDEX idx_agent_sessions_user_id ON agent_sessions(user_id);
CREATE INDEX idx_agent_sessions_user_started ON agent_sessions(user_id, started_at DESC);
CREATE INDEX idx_agent_messages_user_id ON agent_messages(user_id);
CREATE INDEX idx_agent_messages_session_id ON agent_messages(session_id);
CREATE INDEX idx_token_transactions_user_id ON token_transactions(user_id);
```

#### Enable Row-Level Security (RLS)

```sql
-- Enable RLS on agent tables
ALTER TABLE agent_dna ENABLE ROW LEVEL SECURITY;
ALTER TABLE agent_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE agent_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_token_balance ENABLE ROW LEVEL SECURITY;

-- Agent DNA: users see only their own
CREATE POLICY agent_dna_user_read ON agent_dna FOR SELECT
  USING (auth.uid() = user_id);
CREATE POLICY agent_dna_user_write ON agent_dna FOR UPDATE
  USING (auth.uid() = user_id);

-- Agent sessions: users see only their own
CREATE POLICY agent_sessions_user_read ON agent_sessions FOR SELECT
  USING (auth.uid() = user_id);
CREATE POLICY agent_sessions_user_write ON agent_sessions FOR INSERT
  WITH CHECK (auth.uid() = user_id);
CREATE POLICY agent_sessions_user_update ON agent_sessions FOR UPDATE
  USING (auth.uid() = user_id);

-- Agent messages: users see only their own session messages
CREATE POLICY agent_messages_user_read ON agent_messages FOR SELECT
  USING (auth.uid() = user_id);
CREATE POLICY agent_messages_user_write ON agent_messages FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Token balance: users see only their own
CREATE POLICY token_balance_user_read ON user_token_balance FOR SELECT
  USING (auth.uid() = user_id);

-- Token transactions: users see only their own
CREATE POLICY token_transactions_user_read ON token_transactions FOR SELECT
  USING (auth.uid() = user_id);
```

### 4. Update Auth Callback

When a new user signs up, initialize their token balance. Edit `src/pages/api/auth/callback.ts`:

```typescript
// After creating privacy_settings, add:
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

## File Structure

```
src/lib/agent/
├── types.ts              # Type definitions
├── dna.ts                # Agent DNA hydration & updates
├── session.ts            # Session lifecycle
├── tokens.ts             # Token balance tracking
└── anthropic.ts          # Claude API wrapper

src/pages/api/agent/
├── chat.ts               # POST /api/agent/chat (streaming)
├── dna.ts                # GET/PUT /api/agent/dna
├── sessions.ts           # GET/DELETE /api/agent/sessions
└── messages.ts           # GET /api/agent/messages

src/app/companion/
├── layout.tsx            # Wrapper layout
└── page.tsx              # Main chat UI
```

## API Endpoints

### `POST /api/agent/chat` (Streaming)

Sends a message and streams the AI response.

**Request:**
```json
{
  "message": "What should I wear to a casual brunch?",
  "sessionId": "optional-uuid-to-resume-session"
}
```

**Response (Server-Sent Events):**
```
event: token
data: "I"

event: token
data: "'d"

event: done
data: {"tokensUsed": 45, "newBalance": 105, "sessionId": "uuid"}
```

### `GET /api/agent/dna`

Fetch the user's agent DNA and token balance.

**Response:**
```json
{
  "agentName": "Sapphire",
  "personaName": "Jasmine",
  "stylePersonality": { /* ... */ },
  "bodyProfile": { /* ... */ },
  "moodPatterns": { /* ... */ },
  "conversationStyle": { /* ... */ },
  "totalMessages": 42,
  "tokenBalance": 105,
  "createdAt": "2026-07-23T...",
  "updatedAt": "2026-07-23T..."
}
```

### `PUT /api/agent/dna`

Update the agent's name.

**Request:**
```json
{
  "agentName": "Luna"
}
```

### `GET /api/agent/sessions`

List user's recent sessions.

**Response:**
```json
{
  "sessions": [
    {
      "id": "uuid",
      "startedAt": "2026-07-23T...",
      "lastActivityAt": "2026-07-23T...",
      "endedAt": null,
      "messageCount": 5,
      "tokensUsedInSession": 30
    }
  ]
}
```

### `DELETE /api/agent/sessions?sessionId=uuid`

End a session (archive it).

### `GET /api/agent/messages?sessionId=uuid&limit=50&offset=0`

Fetch message history for a session.

**Response:**
```json
{
  "messages": [
    {
      "id": "uuid",
      "role": "user",
      "content": "What should I wear?",
      "tokensConsumed": null,
      "metadata": {},
      "createdAt": "2026-07-23T..."
    },
    {
      "id": "uuid",
      "role": "assistant",
      "content": "...",
      "tokensConsumed": 45,
      "metadata": {},
      "createdAt": "2026-07-23T..."
    }
  ],
  "hasMore": false,
  "count": 2
}
```

## Frontend

The companion page is at `/companion`. It includes:

- **Sidebar:** Session list, new chat button
- **Main chat:** Message bubbles, typing indicator, streaming response
- **Header:** Agent name, token balance, settings button
- **Footer:** Message input, send button, token display

### Key Features

- Auto-resume last session on page load
- Streaming responses with token feedback
- Session persistence (sessions stay open until explicitly ended)
- Mobile responsive (sidebar collapses on small screens)
- Smooth animations and Sapphire design language

## Token Accounting

### Startup Allocation

- New users get **150 free tokens** on signup
- Stored in `user_token_balance.total_earned_free`

### Consumption

- **Assistant responses:** Charged based on actual `output_tokens` from Anthropic API
- User messages are not charged (reading is free)
- Deducted from `balance` and logged to `token_transactions`

### Example Flow

1. User starts with 150 tokens
2. Sends a message → creates user message in DB (0 tokens)
3. Receives response → calls Anthropic (40 output tokens used)
4. Balance drops to 110 tokens
5. Transaction logged: `-40` tokens, reason: `message_consumption`, reference: `session_id`

### Future: Token Purchases

Add a `purchase` reason to `token_transactions`:
```sql
INSERT INTO token_transactions (user_id, amount, reason, created_at)
VALUES (user_id, 100, 'purchase', NOW());

UPDATE user_token_balance
SET balance = balance + 100, total_purchased = total_purchased + 100
WHERE user_id = user_id;
```

## Testing

### Quick Start

```bash
npm run dev
```

Navigate to http://localhost:3000/companion after logging in.

### Manual Test Flow

1. Log in or create an account
2. Navigate to `/companion`
3. See agent DNA loaded (agent name, token balance)
4. Send a message: "What color palette suits me?"
5. Watch response stream in real-time
6. Check token balance decreased
7. Refresh page → session resumes
8. Start new chat → creates new session

### Debug Logs

Check browser DevTools Console for:
- Session creation/resumption
- Message streaming
- Token balance updates

Check server logs for:
- API errors
- Anthropic API calls
- Database writes

## Security

1. **Authentication:** All endpoints require valid `ivee_session` cookie
2. **Authorization:** All queries filtered by `session.userId` server-side
3. **Rate limiting:** Existing `detectReadAnomaly` applies to all agent endpoints
4. **RLS policies:** Database enforces row-level security by user
5. **API key:** `ANTHROPIC_API_KEY` never exposed to client

## Known Limitations & Future Work

- **No finetune:** System prompt is static per session; could improve with user-specific finetune
- **No function calling:** Agent can't directly query wardrobe/recommendations; could add tools
- **Session limit:** No hardcoded limit on message history; could paginate for performance
- **Token refunds:** No mechanism to refund tokens on error; could add retry logic

## Troubleshooting

### "Not authenticated"
- Make sure you're logged in
- Check that `ivee_session` cookie exists in DevTools

### "Insufficient token balance"
- User needs to purchase tokens or wait for allocation
- Check `user_token_balance` table in Supabase

### "ANTHROPIC_API_KEY missing"
- Add `ANTHROPIC_API_KEY` to `.env.local`
- Restart dev server

### Streaming not working
- Browser may not support EventSource
- Check that `res.setHeader('Content-Type', 'text/event-stream')` is set
- Try different browser if issue persists

### Database errors
- Check that tables exist (run SQL migrations)
- Verify RLS policies are enabled
- Check that `user_id` matches authenticated user

## Support

For issues:
1. Check `AGENT_ARCHITECTURE.md` for system design
2. Review inline code comments in `/src/lib/agent`
3. Check Anthropic SDK docs: https://github.com/anthropics/anthropic-sdk-python
4. Check Supabase docs: https://supabase.com/docs
