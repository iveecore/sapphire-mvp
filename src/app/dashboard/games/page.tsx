'use client'

const GAMES = [
  {
    slug: 'style-clash',
    emoji: '👗',
    title: 'Style Clash',
    desc: 'Swipe left or right on outfit combinations. Rate fits, earn points, unlock AI suggestions.',
    tokens: '+50 tokens',
    status: 'coming-soon',
    color: 'from-violet-100 to-purple-50',
  },
  {
    slug: 'vibe-match',
    emoji: '🎴',
    title: 'Vibe Match',
    desc: 'Match aesthetic tiles in this fashion memory game. Win to earn bonus AI tokens.',
    tokens: '+30 tokens',
    status: 'coming-soon',
    color: 'from-rose-100 to-pink-50',
  },
  {
    slug: 'wardrobe-tetris',
    emoji: '🧩',
    title: 'Wardrobe Tetris',
    desc: 'Drag and stack your clothing items to organise the perfect capsule wardrobe.',
    tokens: '+20 tokens',
    status: 'coming-soon',
    color: 'from-orange-100 to-amber-50',
  },
]

export default function GamesPage() {
  return (
    <div className="p-5 sm:p-7 max-w-5xl mx-auto space-y-5">
      <div>
        <div className="micro-label mb-1">Fashion games</div>
        <h1 className="display-serif text-3xl font-black text-[#1a1626]">Play. Earn. <span className="gradient-text">Style.</span></h1>
        <p className="text-sm text-[#9e97a8] mt-1">Win games to earn AI tokens and unlock style rewards.</p>
      </div>

      <div className="grid sm:grid-cols-3 gap-4">
        {GAMES.map(game => (
          <div key={game.slug} className="panel rounded-[2rem] overflow-hidden card-hover">
            <div className={`bg-gradient-to-br ${game.color} p-6 flex items-center justify-center h-32`}>
              <span className="text-6xl">{game.emoji}</span>
            </div>
            <div className="p-5">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-base font-bold text-[#1a1626]">{game.title}</h3>
                <span className="rounded-full bg-emerald-50 text-emerald-700 px-2 py-0.5 text-xs font-semibold">{game.tokens}</span>
              </div>
              <p className="text-xs text-[#6d6875] leading-5 mb-4">{game.desc}</p>
              <button
                disabled
                className="w-full rounded-full bg-[#f3edff] text-[#7a4cf5] py-2.5 text-sm font-bold opacity-70 cursor-not-allowed"
              >
                Coming soon ✨
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
