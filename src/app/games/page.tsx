'use client'

const GAMES = [
  {
    slug: 'style-clash',
    emoji: '👗',
    title: 'Style Clash',
    description: 'Swipe on outfit combos. Rate looks, earn tokens, unlock AI drops.',
    reward: '+5 tokens per session',
    color: 'from-violet-100 to-purple-50',
    badge: 'Hot 🔥',
  },
  {
    slug: 'vibe-match',
    emoji: '✨',
    title: 'Vibe Match',
    description: 'Match aesthetic tiles in this fashion memory game. Win = bonus tokens.',
    reward: '+3 tokens per win',
    color: 'from-rose-100 to-pink-50',
    badge: 'Fan fave',
  },
  {
    slug: 'wardrobe-tetris',
    emoji: '🧥',
    title: 'Wardrobe Tetris',
    description: 'Drag & organise your virtual closet. Curate your capsule wardrobe.',
    reward: 'Unlocks AI capsule report',
    color: 'from-orange-100 to-amber-50',
    badge: 'New',
  },
]

export default function GamesPage() {
  return (
    <div className="blob-bg min-h-screen px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <div className="micro-label mb-3">Earn while you play</div>
          <h1 className="display-serif text-5xl font-black text-[#1a1626] mb-3">
            Style <span className="gradient-text">Games</span>
          </h1>
          <p className="text-[#6d6875] text-lg">Play to earn tokens. Tokens unlock AI features.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-5">
          {GAMES.map(game => (
            <a
              key={game.slug}
              href={`/games/${game.slug}`}
              className="panel rounded-[2rem] p-6 card-hover block group"
            >
              <div className={`rounded-[1.5rem] bg-gradient-to-br ${game.color} p-6 mb-4 text-center`}>
                <div className="text-5xl mb-2">{game.emoji}</div>
                <span className="rounded-full bg-white/70 px-3 py-1 text-xs font-bold text-[#7a4cf5]">
                  {game.badge}
                </span>
              </div>
              <h2 className="text-xl font-bold text-[#1a1626] mb-2">{game.title}</h2>
              <p className="text-sm text-[#6d6875] leading-6 mb-4">{game.description}</p>
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 rounded-full px-3 py-1">
                  {game.reward}
                </span>
                <span className="text-[#7a4cf5] font-bold text-sm group-hover:translate-x-1 transition-transform inline-block">
                  Play →
                </span>
              </div>
            </a>
          ))}
        </div>
      </div>
    </div>
  )
}
