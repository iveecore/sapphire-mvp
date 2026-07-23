# Sapphire Per-User Agent Architecture

## Overview

Each user on Sapphire gets their own dedicated AI agent instance with unique "DNA" — a persistent profile that contains style personality, body data, mood patterns, and conversational history. The agent is hydrated at session start and provides token-based usage limits for AI features.

## System Components

### 1. Database Schema

**New Tables (Additive):**

#### `agent_dna` (per-user agent profile)
```sql
- id: uuid (primary key)
- user_id: uuid (foreign key → users.id, unique, indexed)
- agent_name: text (user-chosen name for their Jarvis)
- persona_name: text (generated initial name if not customized)
- style_personality: jsonb (derived from quiz: preferences, vibe, archetypes)
- body_profile_summary: jsonb (cached from body_profiles table)
- mood_patterns: jsonb (time-of-day, season, event type correlations)
- conversation_style: jsonb (detected tone, formality, humor preference)
- total_messages_exchanged: int (aggregate for analytics)
- last_active_at: timestamptz
- created_at: timestamptz
- updated_at: timestamptz
```

#### `agent_sessions` (session-level isolation)
```sql
- id: uuid (primary key)
- user_id: uuid (foreign key → users.id, indexed)
- session_token: text (unique, url-safe random)
- started_at: timestamptz
- last_activity_at: timestamptz
- ended_at: timestamptz (null while active)
- message_count: int (local to session)
- tokens_used_in_session: int
- context_snapshot: jsonb (frozen DNA at session start for consistency)
- created_at: timestamptz
```

#### `agent_messages` (conversation history)
```sql
- id: uuid (primary key)
- user_id: uuid (foreign key → users.id, indexed)
- session_id: uuid (foreign key → agent_sessions.id, indexed)
- role: text ('user' or 'assistant')
- content: text (full message body)
- tokens_consumed: int (if assistant message)
- metadata: jsonb (mood detected, response time, etc.)
- created_at: timestamptz
```

#### `user_token_balance` (token accounting)
```sql
- user_id: uuid (primary key, foreign key → users.id)
- balance: int (cumulative tokens available)
- total_purchased: int (sum of all purchases)
- total_earned_free: int (starter allocation + events)
- total_consumed: int (lifetime used)
- updated_at: timestamptz
- created_at: timestamptz
```

#### `token_transactions` (audit log for token changes)
```sql
- id: uuid (primary key)
- user_id: uuid (foreign key → users.id, indexed)
- amount: int (positive or negative)
- reason: text ('purchase', 'message_consumption', 'signup_bonus', 'event_earned')
- reference_id: uuid (e.g., session_id or order_id)
- created_at: timestamptz
```

**Existing Tables (Referenced, Not Duplicated):**
- `users` — authentication
- `style_profiles` — style personality (merged with agent DNA on hydration)
- `body_profiles` — body measurements and fit preferences
- `style_answers` — quiz responses (referenced by agent during generation)
- `wardrobe_items` — user's wardrobe (context for recommendations)

### 2. API Architecture

#### `GET /api/agent/dna`
Fetch the current user's agent DNA. Hydrates the client with the agent profile.

**Request:**
- Auth: HttpOnly cookie `ivee_session`

**Response:**
```json
{
  "agentName": "Sapphire",
  "personaName": "Jasmine",
  "stylePers onality": { /* derived from quiz */ },
  "bodyProfile": { /* cached */ },
  "moodPatterns": { /* calendar data */ },
  "tokenBalance": 150,
  "nextPlan": "Icon" 
}
```

#### `POST /api/agent/chat` (Streaming)
Send a message to the AI agent. Streams the response via SSE and decrements tokens.

**Request:**
```json
{
  "message": "What should I wear to a brunch?",
  "sessionId": "uuid-optional-for-session-resume"
}
```

**Response (Streaming):**
Server-sent events, one event per chunk:
```
event: token
data: "hello"

event: token
data: " there"

event: done
data: {"tokensUsed": 45, "sessionId": "uuid"}
```

#### `GET /api/agent/sessions`
List the user's recent agent sessions (for session resumption).

**Response:**
```json
{
  "sessions": [
    {
      "id": "uuid",
      "startedAt": "2026-07-23T...",
      "messageCount": 5,
      "preview": "What should I wear to a brunch? → [response preview]"
    }
  ]
}
```

#### `GET /api/agent/messages?sessionId=uuid&limit=50&offset=0`
Fetch message history for a session.

**Response:**
```json
{
  "messages": [
    { "role": "user", "content": "...", "createdAt": "..." },
    { "role": "assistant", "content": "...", "createdAt": "..." }
  ],
  "hasMore": false
}
```

### 3. Core Libraries

#### `src/lib/agent/dna.ts`
Functions to read/write user agent DNA from Supabase.

- `hydrateAgentDNA(userId: string): Promise<AgentDNA>` — Merge `agent_dna`, `style_profiles`, `body_profiles`, and recent interactions into a single hydrated profile.
- `updateAgentPersonality(userId: string, updates: Partial<AgentDNA>): Promise<void>` — Write back updated personality after a conversation.
- `detectMoodPattern(userId: string, message: string): Promise<{ mood: string, confidence: number }>` — Analyze a user message to detect mood/context.

#### `src/lib/agent/session.ts`
Session lifecycle: start, hydrate context, track usage.

- `createAgentSession(userId: string): Promise<AgentSession>` — Create a new session, freeze current DNA snapshot.
- `getAgentSession(userId: string, sessionId?: string): Promise<AgentSession>` — Fetch active or specified session.
- `endAgentSession(userId: string, sessionId: string): Promise<void>` — Close session, finalize token accounting.
- `resumeAgentSession(userId: string, sessionId: string): Promise<AgentSession>` — Reopen a previous session (reads full message history).

#### `src/lib/agent/tokens.ts`
Token balance and consumption tracking.

- `getUserTokenBalance(userId: string): Promise<number>` — Fetch current balance.
- `deductTokens(userId: string, amount: int, reason: string, sessionId?: string): Promise<void>` — Decrement balance and log transaction.
- `grantTokens(userId: string, amount: int, reason: string): Promise<void>` — Grant tokens (signup bonus, achievements).
- `validateTokenAvailability(userId: string, estimatedCost: int): Promise<boolean>` — Pre-check before expensive operations.

#### `src/lib/agent/anthropic.ts`
Wrapper around Anthropic API with streaming and token counting.

- `streamAgentResponse(message: string, systemPrompt: string, messages: Message[]): AsyncIterable<{ token: string, usage?: TokenUsage }>` — Stream response from Claude, yield tokens as they arrive.

### 4. Client Components

#### `src/app/companion/page.tsx`
Main chat interface for the user's AI agent.

- Layout: Dark card, purple gradient header with blob background
- Chat bubbles: User right-aligned, assistant left-aligned with fade-in animation
- Input: Bottom-anchored textarea with token balance display
- Session list: Left sidebar showing recent chats (collapsible on mobile)
- Features:
  - Auto-save session on unmount
  - Scroll to bottom on new message
  - Loading skeleton while waiting for response
  - Error boundary with "agent offline" recovery

#### `src/app/companion/layout.tsx`
Wrapper for the companion feature with navigation and controls.

### 5. Authentication & Authorization

All agent endpoints use the same `ivee_session` cookie pattern as existing routes:
1. `readSessionCookie(req)` extracts `userId`
2. All queries are filtered by `userId` on the server
3. Anomaly detection (`detectReadAnomaly`) applies to prevent token harvesting via API abuse

Row-Level Security (RLS) policies on new tables:
- `agent_dna`: Users can read/write only their own row
- `agent_sessions`: Users can read/write/delete only their own sessions
- `agent_messages`: Users can read/write only messages in their sessions
- `user_token_balance`: Users can read their own balance (cannot write directly)
- `token_transactions`: Users can read their own transaction log (cannot write directly)

### 6. Token Consumption Model

- **Startup cost:** 0 tokens (reading DNA, hydrating)
- **Per message:** Estimated based on message length + response complexity
  - User message: ~1 token per 4 characters (advisory, not charged)
  - Assistant response: Actual `usage.output_tokens` from Anthropic API
- **Rate limit:** Checked via `detectReadAnomaly` per existing pattern
- **Insufficient balance:** Return 402 (Payment Required) before sending to Anthropic

### 7. Data Flow

```
User logs in
  ↓
Session cookie hydrated (ivee_session)
  ↓
User navigates to /companion
  ↓
Client fetches GET /api/agent/dna (reads agent_dna + style_profiles + body_profiles)
  ↓
Client creates/resumes session via POST /api/agent/chat (creates agent_sessions row)
  ↓
User sends message
  ↓
Server:
  - Validates token balance (user_token_balance)
  - Creates user message in agent_messages table
  - Calls Anthropic API with streamed response
  - Captures final usage stats
  - Writes assistant message to agent_messages
  - Deducts tokens via token_transactions
  ↓
Client streams chunks until done event
  ↓
User can close tab (session stays open for resume via sessionId)
  ↓
Next visit to /companion auto-resumes last session or creates new one
```

## Security Considerations

1. **Per-user isolation:** All queries filtered by `session.userId` server-side. Never trust client-supplied `userId`.
2. **Token anti-abuse:** Existing `detectReadAnomaly` applies. Extra check: if token balance < estimated cost, fail pre-request.
3. **API key protection:** `ANTHROPIC_API_KEY` stored as environment secret, only accessible server-side.
4. **Message retention:** Messages stored in DB for history/training. RLS ensures only the user can read their messages.
5. **Session tokens:** `agent_sessions.session_token` is ephemeral and session-scoped (not a persistent auth token).

## Environment Variables

- `NEXT_PUBLIC_SUPABASE_URL` — existing
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` — existing
- `SUPABASE_SERVICE_ROLE_KEY` — existing
- `ANTHROPIC_API_KEY` — new, required for Claude API calls

## Implementation Priority

1. **Schema migration:** Add tables + RLS policies to live Supabase
2. **`dna.ts`:** Read/write agent DNA from DB
3. **`session.ts`:** Session lifecycle
4. **`tokens.ts`:** Balance and consumption tracking
5. **`anthropic.ts`:** Streaming API wrapper
6. **`chat.ts`:** Chat API endpoint (Pages Router)
7. **`companion/page.tsx`:** Frontend chat UI (App Router)

## Testing Strategy

- Unit: Mock Supabase + Anthropic API, test DNA hydration and token math
- Integration: Spin up local Supabase, test full flow from signup → first chat → token deduction
- E2E: Selenium/Playwright on staging, verify chat bubbles render and tokens decrement

## Future Enhancements

- Mood-based response generation (system prompt varies by detected mood)
- Outfit memory (agent remembers "you wore this yesterday")
- Shared style insights (anonymized stats: "70% of your users love earth tones in fall")
- Agent learning (finetune on user's conversation history)
- Multi-turn outfit planning (e.g., "plan my week")
