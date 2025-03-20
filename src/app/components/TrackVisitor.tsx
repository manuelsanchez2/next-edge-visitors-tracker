'use client'

import { useEffect, useState } from 'react'

export default function TrackVisitorSection() {
  const [sessionId, setSessionId] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function trackVisitor() {
      try {
        const res = await fetch('/api/track', {
          method: 'POST',
          credentials: 'include',
        })
        if (!res.ok) {
          const err = await res.json()
          throw new Error(err.error || 'Something went wrong')
        }
        const data = await res.json()
        setSessionId(data.sessionId)
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message)
        } else {
          setError('An unknown error occurred')
        }
      }
    }
    trackVisitor()
  }, [])

  // Once the sessionId is available, send a ping every 10 seconds
  useEffect(() => {
    if (!sessionId) return

    const interval = setInterval(async () => {
      try {
        const res = await fetch('/api/ping', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ sessionId }),
        })
        if (!res.ok) {
          const err = await res.json()
          console.error('Ping error:', err.error)
        } else {
          console.log('Ping sent successfully')
        }
      } catch (err) {
        console.error('Ping exception:', err)
      }
    }, 10000) // 10 seconds

    return () => clearInterval(interval)
  }, [sessionId])

  return (
    <div className="px-5">
      <h1 className="text-4xl font-bold">Visitor Tracking Demo</h1>
      {error && (
        <p className="text-xs absolute top-3 right-3 rounded-md border p-2 bg-red-200 text-red-800">
          Error: {error}
        </p>
      )}
      {sessionId ? (
        <p className="text-xs my-4 text-center">Your session ID: {sessionId}</p>
      ) : (
        <p className="text-xs my-4 text-center">Tracking your visit...</p>
      )}
    </div>
  )
}
