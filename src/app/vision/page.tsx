import type { ElementType } from 'react'
import {
  Activity,
  ArrowRight,
  BadgeCheck,
  Braces,
  Database,
  Eye,
  Fingerprint,
  GitBranch,
  KeyRound,
  Layers3,
  LockKeyhole,
  Network,
  Radar,
  ShieldCheck,
  TestTube2,
  Workflow,
} from 'lucide-react'

const platformLayers = [
  {
    label: 'Identity core',
    detail: 'Person, identity, profile, preferences, permissions, goals, relationships, and contexts.',
    tone: 'bg-[#111827] text-white',
  },
  {
    label: 'Trust system',
    detail: 'Authentication, authorization, consent, audit, transparency, recovery, verification, and safety.',
    tone: 'bg-[#0f766e] text-white',
  },
  {
    label: 'Intelligence layer',
    detail: 'Memory, knowledge graph, event stream, AI context, recommendations, decisions, and workflows.',
    tone: 'bg-[#7c2d12] text-white',
  },
  {
    label: 'Experiences',
    detail: 'Wardrobe, beauty, shopping, community, business, marketplace, education, and safety.',
    tone: 'bg-[#5b21b6] text-white',
  },
]

const primitives: Array<{ icon: ElementType; label: string; body: string }> = [
  { icon: Fingerprint, label: 'Person', body: 'The root owner of identity, consent, history, and preferences.' },
  { icon: Layers3, label: 'Object', body: 'Products, outfits, brands, stores, creators, media, bookings, and conversations.' },
  { icon: Activity, label: 'Event', body: 'Every signup, save, purchase, wear, return, export, report, and support action.' },
  { icon: Radar, label: 'Context', body: 'Weather, budget, occasion, fit, location, calendar, travel, and life stage.' },
]

const readiness = [
  ['Build health', 'Blocked', 'Fix CSS import order and dependency lock drift.'],
  ['Session security', 'Critical', 'Replace forgeable base64 sessions with verified server-side identity.'],
  ['Data isolation', 'Critical', 'Remove service-role access from user request paths unless strictly wrapped.'],
  ['Database hygiene', 'High risk', 'Retire destructive reset migrations and enforce explicit RLS write checks.'],
  ['Test coverage', 'Missing', 'Add unit, API, ownership, and smoke tests before product expansion.'],
  ['Operations', 'Early', 'Add logs, traces, alerts, release gates, backups, and rollback procedures.'],
]

const roadmap = [
  ['0', 'Stabilize', 'Build passes, dependencies are reproducible, generated junk is removed, encoding is fixed.'],
  ['1', 'Secure identity', 'Central auth helper, verified user identity, hardened cookies, cross-user access tests.'],
  ['2', 'Harden data', 'Clean migrations, explicit RLS, constraints, ownership checks, deterministic seed strategy.'],
  ['3', 'Contract APIs', 'Zod request and response schemas, explicit selects, safe errors, CSRF and idempotency.'],
  ['4', 'Reliability', 'Persistent rate limits, atomic token accounting, provider timeouts, fallback behavior.'],
  ['5', 'Quality gate', 'CI blocks failed builds, unsafe service-role imports, type regressions, and missing tests.'],
]

const standards: Array<{ icon: ElementType; label: string }> = [
  { icon: ShieldCheck, label: 'Security standard' },
  { icon: Database, label: 'Database standard' },
  { icon: Braces, label: 'API standard' },
  { icon: TestTube2, label: 'Testing standard' },
  { icon: Eye, label: 'Observability standard' },
  { icon: GitBranch, label: 'ADR standard' },
]

export default function VisionPage() {
  return (
    <div className="min-h-screen bg-[#f7f3ec] text-[#17131f]">
      <section className="border-b border-black/10 bg-[#f7f3ec]">
        <div className="mx-auto grid min-h-[78vh] max-w-7xl gap-10 px-4 py-10 sm:px-6 lg:grid-cols-[0.95fr_1.05fr] lg:py-14">
          <div className="flex flex-col justify-center">
            <div className="inline-flex w-fit items-center gap-2 rounded-full border border-black/10 bg-white px-3 py-1.5 text-xs font-bold uppercase tracking-[0.16em] text-[#6d4a00]">
              <BadgeCheck size={14} />
              IVEE architecture bible
            </div>
            <h1 className="mt-6 max-w-3xl text-5xl font-black leading-[0.96] tracking-normal sm:text-6xl lg:text-7xl">
              Sapphire is not a wardrobe app. It is an identity-first platform.
            </h1>
            <p className="mt-6 max-w-2xl text-base leading-8 text-[#594f45] sm:text-lg">
              This visual turns the current product direction into an engineering map: identity at the root, trust around every action, events as the memory, and production readiness as the next milestone.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href="#roadmap"
                className="inline-flex items-center gap-2 rounded-full bg-[#17131f] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#2b2338]"
              >
                View roadmap <ArrowRight size={16} />
              </a>
              <a
                href="/dashboard"
                className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-white px-5 py-3 text-sm font-bold text-[#17131f] transition hover:bg-[#fffaf2]"
              >
                Open product
              </a>
            </div>
          </div>

          <div className="flex items-center">
            <div className="w-full rounded-[2rem] border border-black/10 bg-white p-4 shadow-[0_30px_90px_rgba(23,19,31,0.12)]">
              <div className="rounded-[1.5rem] bg-[#17131f] p-5 text-white">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <div className="text-xs font-bold uppercase tracking-[0.18em] text-white/55">Platform core</div>
                    <div className="mt-2 text-2xl font-black">Human Identity OS</div>
                  </div>
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white text-[#17131f]">
                    <Fingerprint size={22} />
                  </div>
                </div>
              </div>

              <div className="mt-4 grid gap-3">
                {platformLayers.map((layer, index) => (
                  <div key={layer.label} className="grid grid-cols-[3rem_1fr] gap-3">
                    <div className="flex flex-col items-center">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full border border-black/10 bg-[#f7f3ec] text-sm font-black">
                        {index + 1}
                      </div>
                      {index < platformLayers.length - 1 ? <div className="h-full w-px bg-black/10" /> : null}
                    </div>
                    <div className={`rounded-[1.25rem] p-4 ${layer.tone}`}>
                      <div className="text-sm font-black">{layer.label}</div>
                      <p className="mt-2 text-sm leading-6 opacity-80">{layer.detail}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
        <section className="grid gap-4 md:grid-cols-4">
          {primitives.map(({ icon: Icon, label, body }) => (
            <div key={label} className="rounded-[1.25rem] border border-black/10 bg-white p-5 shadow-[0_16px_45px_rgba(23,19,31,0.06)]">
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#0f766e] text-white">
                <Icon size={18} />
              </div>
              <div className="mt-4 text-base font-black">{label}</div>
              <p className="mt-2 text-sm leading-6 text-[#594f45]">{body}</p>
            </div>
          ))}
        </section>

        <section className="mt-10 grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
          <div className="rounded-[1.5rem] border border-black/10 bg-white p-6 shadow-[0_16px_45px_rgba(23,19,31,0.06)]">
            <div className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.16em] text-[#7c2d12]">
              <LockKeyhole size={15} />
              Principal engineer review
            </div>
            <h2 className="mt-4 text-3xl font-black tracking-normal">What blocks production today</h2>
            <div className="mt-5 divide-y divide-black/10">
              {readiness.map(([area, status, detail]) => (
                <div key={area} className="grid gap-3 py-4 sm:grid-cols-[8rem_7rem_1fr]">
                  <div className="text-sm font-black">{area}</div>
                  <div className="w-fit rounded-full bg-[#fff3d6] px-3 py-1 text-xs font-black text-[#7c2d12]">{status}</div>
                  <p className="text-sm leading-6 text-[#594f45]">{detail}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[1.5rem] border border-black/10 bg-[#111827] p-6 text-white shadow-[0_16px_45px_rgba(23,19,31,0.12)]">
            <div className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.16em] text-white/55">
              <Network size={15} />
              Decision engine
            </div>
            <h2 className="mt-4 text-3xl font-black tracking-normal">How the platform should reason</h2>
            <div className="mt-6 grid gap-3">
              {['Identity', 'Consent', 'Context', 'Memory', 'Objects', 'Events', 'Decision', 'Explanation'].map((item, index) => (
                <div key={item} className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-xs font-black">
                    {String(index + 1).padStart(2, '0')}
                  </div>
                  <div className="h-px flex-1 bg-white/10" />
                  <div className="w-28 text-right text-sm font-bold">{item}</div>
                </div>
              ))}
            </div>
            <p className="mt-6 text-sm leading-7 text-white/70">
              The moat is not an AI chat box. The moat is a governed decision system that can explain why it recommended an outfit, a tailor, a product, or a workflow.
            </p>
          </div>
        </section>

        <section id="roadmap" className="mt-10 rounded-[1.5rem] border border-black/10 bg-white p-6 shadow-[0_16px_45px_rgba(23,19,31,0.06)]">
          <div className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.16em] text-[#5b21b6]">
            <Workflow size={15} />
            No-new-features hardening plan
          </div>
          <h2 className="mt-4 text-3xl font-black tracking-normal">Roadmap to 9.5+ engineering quality</h2>
          <div className="mt-6 grid gap-4 lg:grid-cols-3">
            {roadmap.map(([phase, title, body]) => (
              <div key={phase} className="rounded-[1.25rem] border border-black/10 bg-[#fbfaf7] p-5">
                <div className="flex items-center justify-between gap-3">
                  <div className="text-xs font-black uppercase tracking-[0.14em] text-[#594f45]">Phase {phase}</div>
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#17131f] text-sm font-black text-white">{phase}</div>
                </div>
                <div className="mt-4 text-lg font-black">{title}</div>
                <p className="mt-2 text-sm leading-6 text-[#594f45]">{body}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-10 grid gap-6 lg:grid-cols-[1fr_0.85fr]">
          <div className="rounded-[1.5rem] border border-black/10 bg-white p-6 shadow-[0_16px_45px_rgba(23,19,31,0.06)]">
            <div className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.16em] text-[#0f766e]">
              <KeyRound size={15} />
              Engineering constitution
            </div>
            <h2 className="mt-4 text-3xl font-black tracking-normal">The rules that keep IVEE scalable</h2>
            <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {standards.map(({ icon: Icon, label }) => (
                <div key={label} className="flex min-h-24 items-center gap-3 rounded-[1.1rem] border border-black/10 bg-[#fbfaf7] p-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#fff3d6] text-[#7c2d12]">
                    <Icon size={17} />
                  </div>
                  <div className="text-sm font-black leading-5">{label}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[1.5rem] border border-black/10 bg-[#f4dfc1] p-6 shadow-[0_16px_45px_rgba(23,19,31,0.06)]">
            <div className="text-xs font-black uppercase tracking-[0.16em] text-[#7c2d12]">Target state</div>
            <h2 className="mt-4 text-3xl font-black tracking-normal">A platform, not a pile of pages.</h2>
            <p className="mt-4 text-sm leading-7 text-[#4d3927]">
              The repository earns a 9.5+ when it has reproducible builds, verified identity, enforced ownership, deterministic migrations, automated tests, visible operations, and standards that guide every future feature.
            </p>
          </div>
        </section>
      </main>
    </div>
  )
}
