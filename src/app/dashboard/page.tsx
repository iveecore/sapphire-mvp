'use client'
import { useState } from 'react'

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState('recommendations')

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Your Sapphire</h1>
          <button className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700">
            Take Style Quiz
          </button>
        </div>

        <div className="bg-white rounded-lg shadow">
          <div className="border-b flex">
            {['recommendations', 'community', 'achievements'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-4 font-medium capitalize ${
                  activeTab === tab
                    ? 'border-b-2 border-purple-600 text-purple-600'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="p-6">
            {activeTab === 'recommendations' && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div key={i} className="bg-gray-100 rounded-lg p-4 hover:shadow-lg transition">
                    <div className="h-48 bg-gradient-to-br from-purple-200 to-pink-200 rounded mb-4"></div>
                    <h3 className="font-semibold text-gray-900 mb-2">Outfit {i}</h3>
                    <p className="text-sm text-gray-600 mb-4">Score: {85 + i}%</p>
                    <button className="w-full bg-purple-600 text-white py-2 rounded hover:bg-purple-700">
                      View Details
                    </button>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'community' && (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex gap-4 p-4 bg-gray-50 rounded-lg">
                    <div className="w-20 h-20 bg-gradient-to-br from-purple-200 to-pink-200 rounded"></div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900">Community Look {i}</h3>
                      <p className="text-sm text-gray-600">by StyleHunter</p>
                      <div className="flex gap-4 mt-2 text-sm">
                        <button className="text-red-500 hover:text-red-600">❤ 234 Loves</button>
                        <button className="text-gray-600 hover:text-gray-900">💬 12 Comments</button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'achievements' && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {['⭐ Style Starter', '🎯 Quiz Master', '❤️ Community Helper', '🏆 Fashion Forward'].map((badge) => (
                  <div key={badge} className="bg-gradient-to-br from-yellow-100 to-orange-100 p-6 rounded-lg text-center">
                    <p className="text-2xl mb-2">{badge.split(' ')[0]}</p>
                    <p className="text-sm font-medium text-gray-900">{badge.split(' ').slice(1).join(' ')}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
