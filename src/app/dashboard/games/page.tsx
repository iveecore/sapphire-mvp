'use client'

const GAMES = [
  {
    emoji: '👗',
    name: 'Style Clash',
    desc: 'Swipe left or right on outfit combos. Rate looks, earn tokens, and train your AI stylist.',
    reward: '+5 tokens per session',
    color: 'from-violet-100 to-purple-50',
    accent: '#7a4cf5',
  },
  {
    emoji: '🎨',
    name: 'Vibe Match',
    desc: 'Match aesthetic tiles before the timer runs out. Unlock bonus AI suggestions with every win.',
    reward: '+10 tokens per win',
    color: 'from-rose-100 to-pink-50',
    accent: '#f43f7e',
  },
  {
    emoji: '🧥',
    name: 'Wardrobe Tetris',
    desc: 'Organise your virtual closet by dragging clothing into the perfect capsule. Curate your signature look.',
    reward: 'Unlocks capsule wardrobe badge',
    color: 'from-amber-100 to-orange-50',
    accent: '#f97316',
  },
]

export default function GamesPage() {
  return (
    <div className="blob-bg min-h-screen p-6 lg:p-10">
      {/* Header */}
      <div className="rounded-[2rem] overflow-hidden mb-8" style={{background: 'linear-gradient(135deg, #1a1626, #2d1f4e)'}}>
        <div className="p-8">
          <div className="micro-label text-white/50 mb-2">Earn tokens while you play</div>
          <h1 className="display-serif text-5xl font-black text-white">
            Games <span className="text-[#c084fc]">🎮</span>
          </h1>
          <p className="text-white/60 mt-2 text-base">Style games built for the main character in you.</p>
        </div>
      </div>

      {/* Game cards */}
      <div className="grid md:grid-cols-3 gap-5">
        {GAMES.map(game => (
          <div key={game.name} className="panel rounded-[2rem] overflow-hidden card-hover">
            <div className={`bg-gradient-to-br ${game.color} p-8 text-center`}>
              <div className="text-6xl mb-3">{game.emoji}</div>
            </div>
            <div className="p-6">
              <div className="text-lg font-bold text-[#1a1626] mb-2">{game.name}</div>
              <p className="text-sm text-[#6d6875] leading-6 mb-4">{game.desc}</p>
              <div className="rounded-xl bg-purple-50 px-3 py-2 text-xs font-semibold text-[#7a4cf5] mb-4 inline-block">
                🏆 {game.reward}
              </div>
              <div className="flex items-center gap-2">
                <button
                  disabled
                  className="flex-1 rounded-full bg-[#1a1626]/10 px-4 py-2.5 text-sm font-bold text-[#9e97a8] cursor-not-allowed"
                >
                  Play
                </button>
                <span className="rounded-full bg-amber-100 px-3 py-1.5 text-xs font-bold text-amber-700">
                  Coming soon
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Leaderboard teaser */}
      <div className="mt-8 panel rounded-2xl p-6 text-center">
        <div className="text-3xl mb-2">🏆</div>
        <div className="font-bold text-[#1a1626] mb-1">Weekly Leaderboard</div>
        <p className="text-sm text-[#6d6875]">Top players win free Muse plan upgrades and exclusive style drops. Coming soon.</p>
      </div>
    </div>
  )
}
