import { useState, useEffect, useCallback } from 'react'

const API_BASE = import.meta.env.VITE_API_URL || '/api'

export function useStats(source = 'all') {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [lastFetch, setLastFetch] = useState(null)

  const fetch_ = useCallback(async () => {
    try {
      const res = await fetch(`${API_BASE}/stats?source=${source}`)
      if (!res.ok) throw new Error('Failed to fetch stats')
      const json = await res.json()
      setData(json)
      setError(null)
      setLastFetch(new Date())
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }, [source])

  useEffect(() => {
    setLoading(true)
    fetch_()
    const interval = setInterval(fetch_, 30000) // refresh every 30s
    return () => clearInterval(interval)
  }, [fetch_])

  return { data, loading, error, refetch: fetch_, lastFetch }
}
