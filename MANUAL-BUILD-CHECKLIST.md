# Sapphire Manual Build Checklist

## **What's Already Done ✅**
- Frontend UI: Home, Signup, Login, Dashboard, Quiz, Community (live at vercel)
- GitHub repo: https://github.com/iveecore/sapphire-mvp
- Vercel deployment: Auto-deploys on git push
- Database schema: `/supabase/migrations/001_initial_schema.sql`
- Design system: Purple/pink Tailwind theme

---

## **What You Need To Do Manually**

### **1. Supabase Setup (15 min)**
- Go to https://supabase.com → Create project
- DB name: `sapphire_prod`
- Copy 3 keys:
  - `NEXT_PUBLIC_SUPABASE_URL`
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
  - `SUPABASE_SERVICE_ROLE_KEY`

### **2. Add Supabase to Vercel (5 min)**
- Vercel dashboard → Project settings → Environment Variables
- Paste the 3 keys from above
- Redeploy (git push empty commit or manually trigger)

### **3. Run Database Schema (5 min)**
- Supabase dashboard → SQL Editor
- Copy all SQL from: `supabase/migrations/001_initial_schema.sql`
- Paste & run
- Tables created: users, products, recommendations, community_posts, achievements, quests

### **4. Add OpenRouter API Key (5 min)**
- Go to https://openrouter.ai
- Create account → Get API key
- Add to Vercel: `OPENROUTER_API_KEY=your_key`

### **5. Build API Routes (Backend) — YOU CAN DO THIS**

**Copy this into `src/pages/api/auth/signup.ts`:**
```typescript
import { createClient } from '@supabase/supabase-js'
import type { NextApiRequest, NextApiResponse } from 'next'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end()

  const { email, password } = req.body

  try {
    const { data, error } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true
    })

    if (error) return res.status(400).json({ error: error.message })
    return res.status(200).json({ user: data.user })
  } catch (e) {
    return res.status(500).json({ error: 'Server error' })
  }
}
```

**Copy this into `src/pages/api/auth/login.ts`:**
```typescript
import { createClient } from '@supabase/supabase-js'
import type { NextApiRequest, NextApiResponse } from 'next'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end()

  const { email, password } = req.body

  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    })

    if (error) return res.status(400).json({ error: error.message })
    return res.status(200).json({ session: data.session })
  } catch (e) {
    return res.status(500).json({ error: 'Server error' })
  }
}
```

**Copy this into `src/pages/api/recommendations/generate.ts`:**
```typescript
import { createClient } from '@supabase/supabase-js'
import type { NextApiRequest, NextApiResponse } from 'next'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end()

  const { userId, styleAnswers } = req.body

  try {
    // Mock recommendations (replace with OpenRouter call later)
    const recommendations = [
      { id: '1', name: 'Summer Casual', score: 95 },
      { id: '2', name: 'Office Ready', score: 88 },
      { id: '3', name: 'Weekend Vibe', score: 92 },
      { id: '4', name: 'Night Out', score: 85 },
      { id: '5', name: 'Gym Fit', score: 79 },
      { id: '6', name: 'Travel Chic', score: 91 }
    ]

    return res.status(200).json({ recommendations })
  } catch (e) {
    return res.status(500).json({ error: 'Server error' })
  }
}
```

### **6. Test Everything**
1. Home page: https://sapphire-il23eh2t9-iveecores-projects.vercel.app ✅
2. Signup: Try signing up with test@example.com
3. API health: `/api/health` should return `{"status":"ok"}`
4. Recommendations: Quiz should generate 6 outfits

### **7. (Optional) Add More APIs**
Need help? I can build:
- `/api/products/list` (product gallery)
- `/api/community/feed` (community looks)
- `/api/orders/create` (checkout)
- `/api/quests/list` (gamification)

---

## **Git Workflow**
```bash
# Edit files locally
# Then push:
git add .
git commit -m "Add auth APIs"
git push origin main
# Vercel auto-deploys in 3 min
```

---

## **You're In Control Now**
- Edit `/src/pages/api/` to add more endpoints
- Edit `/src/app/` to change UI
- Push to GitHub → Vercel auto-deploys
- Check Vercel logs if anything breaks

**Questions?** I'm here to help. Just ask.
