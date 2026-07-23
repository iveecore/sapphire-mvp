export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50">
      <div className="max-w-7xl mx-auto px-4 py-20">
        <h2 className="text-5xl font-bold mb-6 text-gray-900">
          Your AI Stylist Awaits
        </h2>
        <p className="text-xl text-gray-600 mb-8 max-w-2xl">
          Get personalized outfit recommendations. Connect with a 10k-look community.
          All 100% private. No tracking. No algorithms.
        </p>
        <div className="flex gap-4">
          <a href="/signup" className="bg-purple-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-purple-700">
            Get Started
          </a>
          <a href="/community" className="border border-purple-600 text-purple-600 px-8 py-3 rounded-lg font-semibold hover:bg-purple-50">
            See Community
          </a>
        </div>
      </div>

      <div className="bg-white border-t">
        <div className="max-w-7xl mx-auto px-4 py-20">
          <div className="grid grid-cols-3 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-2">AI Stylist</h3>
              <p className="text-gray-600">Smart recommendations from your style profile</p>
            </div>
            <div>
              <h3 className="text-xl font-bold mb-2">Community</h3>
              <p className="text-gray-600">10k+ real looks from women like you</p>
            </div>
            <div>
              <h3 className="text-xl font-bold mb-2">100% Private</h3>
              <p className="text-gray-600">No tracking, no data selling, full control</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
