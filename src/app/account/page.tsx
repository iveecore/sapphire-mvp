'use client'

import { useEffect, useState } from 'react'

type TrustPayload = {
  privacy: {
    allow_personalization: boolean
    allow_community_visibility: boolean
    allow_marketing_emails: boolean
  } | null
  permissions: Array<{
    resource_type: string
    resource_id: string | null
    action: string
    allowed: boolean
    reason: string | null
    created_at: string
  }>
  auditEvents: Array<{
    event_type: string
    metadata: Record<string, unknown>
    created_at: string
  }>
  memoryEvents: Array<{
    memory_type: string
    payload: Record<string, unknown>
    created_at: string
  }>
}

export default function AccountPage() {
  const [data, setData] = useState<TrustPayload | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch('/api/trust/activity')
        const payload = await res.json()
        if (!res.ok) throw new Error(payload.error ?? 'Could not load trust activity.')
        setData(payload)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Could not load trust activity.')
      } finally {
        setLoading(false)
      }
    }

    load()
  }, [])

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Trust Center</h1>
        <p className="text-gray-600 mb-8">Review privacy, permissions, audit events, and memory records.</p>

        {error && <p className="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}
        {loading && <p className="text-sm text-gray-600">Loading trust activity...</p>}

        {data && (
          <div className="space-y-6">
            <section className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-3">Privacy Settings</h2>
              <div className="grid sm:grid-cols-3 gap-4 text-sm text-gray-700">
                <div>Personalization: {data.privacy?.allow_personalization ? 'On' : 'Off'}</div>
                <div>Community visibility: {data.privacy?.allow_community_visibility ? 'On' : 'Off'}</div>
                <div>Marketing emails: {data.privacy?.allow_marketing_emails ? 'On' : 'Off'}</div>
              </div>
            </section>

            <section className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-3">Recent Permissions</h2>
              <div className="space-y-3 text-sm text-gray-700">
                {data.permissions.length === 0 && <div>No permission records yet.</div>}
                {data.permissions.map((row, index) => (
                  <div key={index} className="border rounded-lg p-3">
                    <div className="font-medium text-gray-900">{row.resource_type} / {row.action}</div>
                    <div>{row.allowed ? 'Allowed' : 'Denied'}</div>
                    <div className="text-gray-500">{row.reason ?? 'No reason recorded'}</div>
                  </div>
                ))}
              </div>
            </section>

            <section className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-3">Audit Events</h2>
              <div className="space-y-3 text-sm text-gray-700">
                {data.auditEvents.length === 0 && <div>No audit events yet.</div>}
                {data.auditEvents.map((row, index) => (
                  <div key={index} className="border rounded-lg p-3">
                    <div className="font-medium text-gray-900">{row.event_type}</div>
                    <div>{new Date(row.created_at).toLocaleString()}</div>
                  </div>
                ))}
              </div>
            </section>

            <section className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-3">Memory Events</h2>
              <div className="space-y-3 text-sm text-gray-700">
                {data.memoryEvents.length === 0 && <div>No memory events yet.</div>}
                {data.memoryEvents.map((row, index) => (
                  <div key={index} className="border rounded-lg p-3">
                    <div className="font-medium text-gray-900">{row.memory_type}</div>
                    <div>{new Date(row.created_at).toLocaleString()}</div>
                  </div>
                ))}
              </div>
            </section>
          </div>
        )}
      </div>
    </div>
  )
}
