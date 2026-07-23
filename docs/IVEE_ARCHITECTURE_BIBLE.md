# IVEE Architecture Bible

Status: engineering architecture draft v0.1

This document translates the IVEE Constitution and IVEE OS Specification into implementation direction.

## 1. Repository Direction

The current repository is still named `sapphire-mvp`, but the architecture should be treated as:

```text
IVEE company
  IVEE OS platform
    Sapphire consumer application
```

Future repository structure may become:

```text
ivee-platform/
  00_constitution/
  01_company/
  02_brand/
  03_product/
  04_design/
  05_research/
  platform/
    identity/
    trust/
    memory/
    graph/
    permissions/
    events/
    search/
    recommendations/
    automation/
    ai/
  apps/
    consumer/
    business/
    creator/
    admin/
  services/
    auth/
    wardrobe/
    products/
    community/
    marketplace/
    payments/
    analytics/
  docs/
    ADRs/
    RFCs/
    APIs/
    DB/
    ThreatModels/
    SOPs/
  tests/
```

## 2. Engineering Principle

Build engines before pages.

Pages are replaceable surfaces. Engines, contracts, events, and permissions become infrastructure.

Preferred flow:

```text
engine -> API contract -> persistent state -> feature -> page
```

Avoid:

```text
page -> mock feature -> isolated state
```

## 3. Phase 0 Scope

Phase 0 freezes non-essential feature expansion and builds the platform core.

Required systems:

1. Identity foundation
2. Permission model
3. Privacy and trust records
4. Event taxonomy
5. Memory model
6. Knowledge graph seed
7. API contract standards
8. Database lifecycle rules
9. Design system foundation
10. Observability
11. Testing strategy
12. Documentation process

## 4. Service Boundaries

Initial boundaries can be implemented inside the current Next.js app, but code should follow domain ownership.

| Boundary | Owns |
| --- | --- |
| Identity | Users, profiles, organizations, agents, object identities. |
| Permissions | Grants, scopes, access checks, revocation, audit records. |
| Trust | Privacy settings, consent, transparency, export, deletion, recovery. |
| Events | Event ingestion, immutable event log, event schemas. |
| Memory | Memory records, retention, correction, forgetting, explanation traces. |
| Graph | Relationships between identities, objects, events, contexts, and memories. |
| Wardrobe | Closet items, outfits, outfit items, wear history, laundry state. |
| Recommendations | Recommendation runs, candidates, ranking, outcomes, explanations. |
| Community | Posts, comments, likes, forks, credits, moderation. |
| Products | Brands, products, materials, colors, sizing, stores, inventory links. |

## 5. Database Direction

Do not add hundreds of tables immediately.

Do define the primitives and lifecycle model now so the database can grow coherently.

Phase 0 tables should include:

1. `identities`
2. `users`
3. `profiles`
4. `permissions`
5. `privacy_settings`
6. `audit_events`
7. `memory_events`
8. `objects`
9. `object_relationships`
10. `contexts`
11. `style_answers`
12. `wardrobe_items`
13. `outfits`
14. `outfit_items`
15. `products`
16. `brands`
17. `recommendation_runs`
18. `recommendation_items`
19. `feedback_events`

## 6. Required API Standards

Every API endpoint should define:

1. Purpose
2. Auth requirement
3. Permission requirement
4. Request schema
5. Response schema
6. Event emitted
7. Audit behavior
8. Error codes
9. Rate limit
10. Test coverage

## 7. Initial API Contracts

| Endpoint | Purpose |
| --- | --- |
| `GET /api/profile/state` | Return identity, profile, onboarding, permissions, and next route. |
| `POST /api/auth/signup` | Create auth user, app identity, profile, privacy settings, and events. |
| `POST /api/auth/login` | Create session and return next route based on profile state. |
| `POST /api/onboarding/answers` | Save style answers and profile memories. |
| `POST /api/wardrobe/items` | Add a wardrobe item. |
| `GET /api/wardrobe/items` | List wardrobe items visible to the current identity. |
| `POST /api/outfits` | Create or save an outfit. |
| `POST /api/recommendations/runs` | Generate an explainable recommendation run. |
| `POST /api/feedback/events` | Store user feedback as memory. |
| `GET /api/trust/activity` | Show data, permission, and decision history. |

## 8. Event Taxonomy v0

Identity events:

1. `identity.created`
2. `user.registered`
3. `user.logged_in`
4. `user.logged_out`
5. `profile.created`
6. `profile.updated`

Permission events:

1. `permission.granted`
2. `permission.revoked`
3. `permission.checked`
4. `permission.denied`

Memory events:

1. `memory.created`
2. `memory.updated`
3. `memory.corrected`
4. `memory.archived`
5. `memory.destroyed`

Wardrobe events:

1. `wardrobe.item_added`
2. `wardrobe.item_updated`
3. `wardrobe.item_archived`
4. `outfit.created`
5. `outfit.worn`
6. `outfit.forked`

Recommendation events:

1. `recommendation.run_created`
2. `recommendation.item_ranked`
3. `recommendation.accepted`
4. `recommendation.rejected`
5. `recommendation.saved`
6. `recommendation.feedback_submitted`

Trust events:

1. `trust.export_requested`
2. `trust.delete_requested`
3. `trust.data_viewed`
4. `trust.consent_updated`

## 9. Security Requirements

Minimum security posture:

1. Server-side validation for every mutation.
2. Row-level security on user-owned data.
3. Service-role key used only in server routes.
4. Rate limiting for auth and AI endpoints.
5. Generic auth errors to avoid account discovery.
6. Audit events for sensitive actions.
7. Permission checks before memory, wardrobe, profile, or recommendation access.
8. Soft delete before permanent destruction.
9. Threat models for identity, permissions, AI memory, and community.
10. Secrets never exposed to client bundles.

## 10. Testing Strategy

Minimum Phase 0 coverage:

1. Auth validation tests
2. Profile state tests
3. Permission evaluation tests
4. Database migration smoke tests
5. Onboarding answer persistence tests
6. Recommendation explanation tests
7. Wardrobe ownership tests
8. Event emission tests
9. Trust export/delete lifecycle tests
10. API error handling tests

## 11. Decision Records

Every major architecture decision should create an ADR covering:

1. Context
2. Decision
3. Alternatives considered
4. Consequences
5. Security impact
6. Data impact
7. Reversal plan

