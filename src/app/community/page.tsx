'use client'

export default function CommunityPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Community Looks</h1>
          <button className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700">
            Share Your Look
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(9)].map((_, i) => (
            <div key={i} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition">
              <div className="h-64 bg-gradient-to-br from-purple-200 to-pink-200"></div>
              <div className="p-4">
                <h3 className="font-semibold text-gray-900 mb-1">Summer Casual Look</h3>
                <p className="text-sm text-gray-600 mb-3">by @StyleHunter</p>
                <div className="flex justify-between items-center">
                  <div className="flex gap-4 text-sm">
                    <button className="text-red-500 hover:text-red-600 font-medium">❤ 234</button>
                    <button className="text-gray-600 hover:text-gray-900">💬 12</button>
                  </div>
                  <button className="bg-purple-100 text-purple-600 px-3 py-1 rounded text-sm hover:bg-purple-200">
                    Save
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
