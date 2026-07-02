import { createContext, useContext, useState, useCallback, useEffect, useRef, type ReactNode } from "react"

const API_BASE = "https://api.sportsrc.org"
const POLL_INTERVAL_MS = 5 * 60 * 1000 // 5 minutes
const APPROACHING_LIVE_MS = 30 * 60 * 1000 // 30 minutes before kickoff

export interface LiveMatch {
  id: string
  title: string
  category: string
  embedUrl: string
  date: number
  teams: {
    home: { name: string; badge: string }
    away: { name: string; badge: string }
  }
  source: string
  viewers: number
}

interface Source {
  id: string
  streamNo: number
  language: string
  hd: boolean
  embedUrl: string
  source: string
  viewers: number
}

interface MatchDetail {
  id: string
  title: string
  category: string
  date: number
  popular: boolean
  poster: string
  teams: {
    home: { name: string; badge: string }
    away: { name: string; badge: string }
  }
  sources: Source[]
}

interface PollingStatus {
  isPolling: boolean
  lastFetch: Date | null
  error: string | null
}

interface LiveStreamContextType {
  liveMatch: LiveMatch | null
  setLiveMatch: (match: LiveMatch | null) => void
  pollingStatus: PollingStatus
  nextUpcoming: { title: string; date: number; teams: { home: { name: string; badge: string }; away: { name: string; badge: string } } } | null
}

const LiveStreamContext = createContext<LiveStreamContextType>({
  liveMatch: null,
  setLiveMatch: () => {},
  pollingStatus: { isPolling: false, lastFetch: null, error: null },
  nextUpcoming: null,
})

function getDirectPlayerUrl(source: Source): string {
  return `https://embed.st/embed/${source.source}/${source.id}/${source.streamNo}`
}

function findLiveOrApproachingMatch(matches: Array<{ id: string; date: number }>): { id: string; date: number } | null {
  const now = Date.now()

  // Priority 1: Currently LIVE matches (started but not ended — assume max 2h duration)
  const liveMatch = matches.find((m) => {
    const diff = now - m.date
    return diff >= 0 && diff < 2 * 60 * 60 * 1000
  })
  if (liveMatch) return liveMatch

  // Priority 2: Match within 30 minutes of starting
  const approachingMatch = matches.find((m) => {
    const diff = m.date - now
    return diff > 0 && diff <= APPROACHING_LIVE_MS
  })
  if (approachingMatch) return approachingMatch

  return null
}

export function LiveStreamProvider({ children }: { children: ReactNode }) {
  const [liveMatch, setLiveMatchState] = useState<LiveMatch | null>(null)
  const [pollingStatus, setPollingStatus] = useState<PollingStatus>({
    isPolling: false,
    lastFetch: null,
    error: null,
  })
  const [nextUpcoming, setNextUpcoming] = useState<LiveStreamContextType["nextUpcoming"]>(null)
  const mountedRef = useRef(true)
  const fetchedMatchIdRef = useRef<string | null>(null)

  const setLiveMatch = useCallback((match: LiveMatch | null) => {
    setLiveMatchState(match)
    if (match) {
      fetchedMatchIdRef.current = match.id
    }
  }, [])

  // Polling effect: fetch football matches every 30 seconds
  useEffect(() => {
    mountedRef.current = true

    async function poll() {
      if (!mountedRef.current) return

      setPollingStatus((prev) => ({ ...prev, isPolling: true }))

      try {
        const res = await fetch(`${API_BASE}/?data=matches&category=football`, {
          signal: AbortSignal.timeout(15000),
        })
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        const json = await res.json()
        if (!json.success || !json.data) throw new Error("API returned unsuccessful response")

        if (!mountedRef.current) return

        const matches = json.data as Array<{ id: string; date: number; title: string; teams: { home: { name: string; badge: string }; away: { name: string; badge: string } } }>
        const target = findLiveOrApproachingMatch(matches)

        if (!target) {
          // No live/approaching match — store the next upcoming one for display
          const now = Date.now()
          const next = matches.find((m) => m.date > now)
          setNextUpcoming(next ? { title: next.title, date: next.date, teams: next.teams } : null)
          setPollingStatus({ isPolling: false, lastFetch: new Date(), error: null })
          return
        }

        // Clear nextUpcoming since we have a live/approaching match
        setNextUpcoming(null)

        // Only fetch detail if we haven't already fetched for this match
        if (fetchedMatchIdRef.current === target.id) {
          setPollingStatus({ isPolling: false, lastFetch: new Date(), error: null })
          return
        }

        const detailRes = await fetch(
          `${API_BASE}/?data=detail&category=football&id=${target.id}`,
          { signal: AbortSignal.timeout(10000) }
        )
        if (!detailRes.ok) throw new Error(`HTTP ${detailRes.status}`)
        const detailJson = await detailRes.json()
        if (!detailJson.success || !detailJson.data) throw new Error("No stream data available")

        if (!mountedRef.current) return

        const d = detailJson.data as MatchDetail
        if (!d.sources?.length) {
          setPollingStatus({ isPolling: false, lastFetch: new Date(), error: null })
          return
        }

        const bestSource = d.sources.find((s: Source) => s.hd) || d.sources[0]
        setLiveMatchState({
          id: d.id,
          title: d.title,
          category: d.category,
          embedUrl: getDirectPlayerUrl(bestSource),
          date: d.date,
          teams: d.teams,
          source: bestSource.source,
          viewers: bestSource.viewers,
        })
        fetchedMatchIdRef.current = d.id

        setPollingStatus({ isPolling: false, lastFetch: new Date(), error: null })
      } catch (err: unknown) {
        if (!mountedRef.current) return
        setPollingStatus({
          isPolling: false,
          lastFetch: new Date(),
          error: err instanceof Error ? err.message : "Polling failed",
        })
      }
    }

    // Run immediately on mount, then every 30 seconds
    void poll()
    const interval = setInterval(() => {
      void poll()
    }, POLL_INTERVAL_MS)

    return () => {
      mountedRef.current = false
      clearInterval(interval)
    }
  }, [])

  return (
    <LiveStreamContext.Provider value={{ liveMatch, setLiveMatch, pollingStatus, nextUpcoming }}>
      {children}
    </LiveStreamContext.Provider>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export const useLiveStream = () => useContext(LiveStreamContext)
