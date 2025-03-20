// File: components/ActiveVisitorIndicator.tsx
'use client'

import { useEffect, useState } from 'react'

export default function ActiveVisitorIndicator() {
  const [activeCount, setActiveCount] = useState<number>(0)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchActiveCount() {
      try {
        const res = await fetch('/api/activeVisitors')
        if (!res.ok) {
          const data: { error?: string } = await res.json()
          throw new Error(data.error || 'Error fetching active visitors')
        }
        const data: { activeVisitors: number } = await res.json()
        setActiveCount(data.activeVisitors)
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message)
        } else {
          setError('An unknown error occurred')
        }
      }
    }

    // Fetch immediately and then poll every 5 seconds.
    fetchActiveCount()
    const interval = setInterval(fetchActiveCount, 5000)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="flex items-center space-x-1 text-xs border w-fit px-2 py-1 rounded-full bg-gray-100 text-black">
      <div
        className={`h-3 w-3 rounded-full ${
          activeCount > 0 ? 'bg-green-600' : 'bg-red-300'
        }`}
      ></div>
      <strong>Online:</strong> <span>{activeCount}</span>
      {error && <span style={{ color: 'red' }}> ({error})</span>}
    </div>
  )
}
