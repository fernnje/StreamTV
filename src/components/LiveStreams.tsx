import { useState, useMemo, useEffect } from "react"
import {
  Tv,
  Radio,
  Play,
  Signal,
  CircleDot,
  Clock,
  Calendar,
} from "lucide-react"
import { useTheme } from "../context/ThemeContext"
import { useLiveStream } from "../context/LiveStreamContext"
import VideoPlayer from "./VideoPlayer"
import type { Channel } from "../types"

const channels: Channel[] = [
  {
    id: "bein-xtra",
    name: "beIN SPORTS XTRA",
    url: "https://bein-xtra-bein.amagi.tv/playlist.m3u8",
    category: "Sports",
    quality: "FHD",
  },
  {
    id: "caze-tv",
    name: "Caze TV BR (FIFA World Cup)",
    url: "https://dfr80qz435crc.cloudfront.net/MNOP/Amagi/Caze/Caze_TV_BR/Caze_TV.m3u8",
    category: "Sports",
    quality: "HD",
  },
  {
    id: "ct-sport",
    name: "CT Sport 25p (FIFA World Cup)",
    url: "http://88.212.15.19/live/test_ctsport_25p/playlist.m3u8",
    category: "Sports",
    quality: "HD",
  },
]

function QualityBadge({ quality, isDark }: { quality: string; isDark: boolean }) {
  const map: Record<string, string> = {
    FHD: isDark
      ? "bg-sport-green/15 text-sport-green border-sport-green/25"
      : "bg-emerald-50 text-emerald-700 border-emerald-200",
    HD: isDark
      ? "bg-accent/15 text-accent-light border-accent/25"
      : "bg-violet-50 text-violet-700 border-violet-200",
    SD: isDark
      ? "bg-white/[0.05] text-dark-100/60 border-white/10"
      : "bg-slate-100 text-slate-500 border-slate-200",
  }
  const cls = map[quality] ?? (isDark ? "bg-white/[0.05] text-dark-100/60 border-white/10" : "bg-slate-100 text-slate-500 border-slate-200")
  return (
    <span className={`px-1.5 py-0.5 text-[9px] font-bold rounded-md border tracking-wide ${cls}`}>
      {quality}
    </span>
  )
}

export default function LiveStreams() {
  const { theme } = useTheme()
  const isDark = theme === "dark"
  const { liveMatch, pollingStatus, nextUpcoming } = useLiveStream()
  const [activeChannel, setActiveChannel] = useState<Channel>(channels[0])
  const [filter, setFilter] = useState<string>("All")
  const [watchingLive, setWatchingLive] = useState(false)

  useEffect(() => {
    if (liveMatch && !watchingLive) setWatchingLive(true)
  }, [liveMatch]) // eslint-disable-line react-hooks/exhaustive-deps

  const matchStatus = useMemo(() => {
    if (!liveMatch) return null
    const now = Date.now()
    const diff = liveMatch.date - now
    if (diff <= 0) return { isLive: true, countdown: null }
    const hours = Math.floor(diff / 3600000)
    const mins = Math.floor((diff % 3600000) / 60000)
    return { isLive: false, countdown: hours > 0 ? `${hours}h ${mins}m` : `${mins}m` }
  }, [liveMatch])

  const filtered = useMemo(
    () => (filter === "All" ? channels : channels.filter((c) => c.category === filter)),
    [filter]
  )

  const categoryCounts = useMemo(() => {
    const map = new Map<string, number>()
    for (const ch of channels) map.set(ch.category, (map.get(ch.category) || 0) + 1)
    return map
  }, [])

  const muted = isDark ? "text-dark-100/60" : "text-slate-400"
  const strong = isDark ? "text-white" : "text-slate-900"
  const body = isDark ? "text-dark-100/70" : "text-slate-500"
  const cardBg = isDark ? "bg-dark-300 border-white/[0.06]" : "bg-white border-slate-200/80"

  return (
    <div className="flex flex-col xl:h-full max-w-6xl mx-auto w-full">

      {/* Header */}
      <div className="mb-5">
        <div className="flex flex-wrap items-center gap-3">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${isDark ? "bg-sport-red/15 border border-sport-red/20" : "bg-sport-red/10 border border-sport-red/20"}`}>
            <Radio className="w-5 h-5 text-sport-red" />
          </div>
          <div>
            <h2 className={`text-xl font-black tracking-tight ${strong}`}>Live Streams</h2>
            <p className={`text-xs ${muted}`}>Select a channel to start streaming</p>
          </div>
          <span className="sm:ml-auto inline-flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-bold bg-sport-green/15 text-sport-green rounded-full border border-sport-green/25 tracking-wide">
            <span className="w-1.5 h-1.5 rounded-full bg-sport-green animate-pulse" />
            LIVE
          </span>
        </div>
      </div>

      {/* Live Match Hero */}
      {liveMatch && matchStatus && (
        <div className={`mb-5 rounded-2xl border p-4 sm:p-5 transition-all duration-300 ${
          watchingLive
            ? isDark
              ? "border-sport-red/35 bg-sport-red/[0.05]"
              : "border-sport-red/25 bg-sport-red/[0.03]"
            : cardBg
        }`}>
          <div className="flex items-center justify-between gap-3 mb-3">
            <div className="flex items-center gap-2">
              <div className={`w-7 h-7 rounded-lg flex items-center justify-center ${matchStatus.isLive ? "bg-sport-red/15" : "bg-sport-yellow/15"}`}>
                <CircleDot className={`w-3.5 h-3.5 ${matchStatus.isLive ? "text-sport-red" : "text-sport-yellow"}`} />
              </div>
              <span className={`text-[11px] font-bold uppercase tracking-widest ${matchStatus.isLive ? "text-sport-red" : "text-sport-yellow"}`}>
                {matchStatus.isLive ? "Live Football" : "Upcoming Football"}
              </span>
            </div>
            {!matchStatus.isLive && matchStatus.countdown && (
              <span className="inline-flex items-center gap-1 px-2 py-1 text-[10px] font-bold bg-sport-yellow/12 text-sport-yellow rounded-lg border border-sport-yellow/20">
                <Clock className="w-3 h-3" />
                Starting in {matchStatus.countdown}
              </span>
            )}
            {pollingStatus.isPolling && (
              <span className={`text-[10px] ${muted}`}>Checking streams…</span>
            )}
          </div>

          <div className="flex items-center justify-between gap-4">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className={`text-base font-bold ${strong}`}>
                  {liveMatch.teams.home.name} vs {liveMatch.teams.away.name}
                </span>
                {matchStatus.isLive && (
                  <span className="inline-flex items-center gap-1 px-1.5 py-0.5 text-[9px] font-bold bg-sport-red/15 text-sport-red rounded-md border border-sport-red/20 shrink-0">
                    <span className="w-1 h-1 rounded-full bg-sport-red animate-pulse" />
                    LIVE
                  </span>
                )}
              </div>
              <p className={`text-xs mt-0.5 ${body}`}>{liveMatch.title}</p>
            </div>
            <button
              onClick={() => setWatchingLive(true)}
              className={`flex items-center gap-2 px-4 py-2.5 text-white text-[13px] font-semibold rounded-xl transition-all active:scale-95 shrink-0 ${
                matchStatus.isLive
                  ? "bg-sport-red hover:bg-sport-red/85 shadow-lg shadow-sport-red/20"
                  : "bg-sport-yellow hover:bg-sport-yellow/85 shadow-lg shadow-sport-yellow/20 text-slate-900"
              }`}
            >
              <Play className="w-3.5 h-3.5" fill="currentColor" />
              {watchingLive ? "Watching" : matchStatus.isLive ? "Watch Now" : "Remind Me"}
            </button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 sm:gap-5 xl:flex-1 xl:min-h-0">
        {/* Player */}
        <div className="xl:col-span-2 flex flex-col min-h-0">
          <div className="aspect-video w-full rounded-2xl overflow-hidden bg-black border border-white/[0.06] xl:aspect-auto xl:flex-1 xl:min-h-0">
            {watchingLive && liveMatch ? (
              <iframe
                src={liveMatch.embedUrl}
                className="w-full h-full border-0"
                title={liveMatch.title}
                allow="autoplay; encrypted-media; fullscreen"
                allowFullScreen
              />
            ) : (
              <VideoPlayer
                src={activeChannel.url}
                title={`${activeChannel.name} — ${activeChannel.category}`}
                fillContainer
              />
            )}
          </div>

          {/* Now Playing Bar */}
          <div className={`mt-3 p-3.5 rounded-2xl border ${cardBg}`}>
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3 min-w-0">
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${watchingLive ? "bg-sport-red/15" : isDark ? "bg-accent/15" : "bg-accent/10"}`}>
                  {watchingLive ? (
                    <CircleDot className="w-4 h-4 text-sport-red" />
                  ) : (
                    <Radio className="w-4 h-4 text-accent-light" />
                  )}
                </div>
                <div className="min-w-0">
                  <p className={`text-[13px] font-semibold truncate ${strong}`}>
                    {watchingLive && liveMatch ? liveMatch.title : activeChannel.name}
                  </p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className={`text-[11px] ${body}`}>
                      {watchingLive && liveMatch
                        ? `${liveMatch.teams.home.name} vs ${liveMatch.teams.away.name}`
                        : activeChannel.category}
                    </span>
                    {watchingLive ? (
                      <span className="inline-flex items-center gap-1 px-1.5 py-0.5 text-[9px] font-bold bg-sport-red/15 text-sport-red rounded-md">
                        <span className="w-1 h-1 rounded-full bg-sport-red animate-pulse" />
                        LIVE
                      </span>
                    ) : (
                      <QualityBadge quality={activeChannel.quality} isDark={isDark} />
                    )}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-1.5 shrink-0">
                <Signal className="w-3.5 h-3.5 text-sport-green" />
                <span className="text-[11px] text-sport-green font-medium hidden sm:inline">Connected</span>
              </div>
            </div>
          </div>
        </div>

        {/* Channel Sidebar */}
        <div className="flex flex-col min-h-0">
          {/* Filter chips */}
          <div className="mb-3">
            <div className="flex items-center gap-2 mb-2.5">
              <h3 className={`text-[11px] font-semibold uppercase tracking-widest ${muted}`}>Channels</h3>
              <span className={`text-[11px] ${muted}`}>({channels.length})</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              <button
                onClick={() => setFilter("All")}
                className={`h-8 px-3 text-[12px] font-medium rounded-xl transition-all ${
                  filter === "All"
                    ? "bg-accent text-white shadow-md shadow-accent/25"
                    : isDark
                      ? "bg-white/[0.05] text-dark-100/70 hover:text-white hover:bg-white/[0.09] border border-white/[0.05]"
                      : "bg-slate-100 text-slate-500 hover:text-slate-900 hover:bg-slate-200 border border-slate-200"
                }`}
              >
                All
              </button>
              {Array.from(categoryCounts.entries()).map(([cat, count]) => (
                <button
                  key={cat}
                  onClick={() => setFilter(cat)}
                  className={`h-8 px-3 text-[12px] font-medium rounded-xl transition-all ${
                    filter === cat
                      ? "bg-accent text-white shadow-md shadow-accent/25"
                      : isDark
                        ? "bg-white/[0.05] text-dark-100/70 hover:text-white hover:bg-white/[0.09] border border-white/[0.05]"
                        : "bg-slate-100 text-slate-500 hover:text-slate-900 hover:bg-slate-200 border border-slate-200"
                  }`}
                >
                  {cat}
                  <span className="ml-1 opacity-50">{count}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Channel list */}
          <div className="max-h-[46vh] xl:max-h-none xl:flex-1 overflow-y-auto space-y-1.5 pr-0.5 pb-1">

            {/* No live match notice */}
            {!liveMatch && !pollingStatus.isPolling && (
              <div className={`rounded-2xl border p-4 ${cardBg}`}>
                <div className="flex items-center gap-3">
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${isDark ? "bg-white/[0.04]" : "bg-slate-100"}`}>
                    <Calendar className={`w-4 h-4 ${muted}`} />
                  </div>
                  <div className="min-w-0">
                    <p className={`text-[13px] font-semibold ${strong}`}>No live matches now</p>
                    {nextUpcoming ? (
                      <p className={`text-[11px] mt-0.5 ${body}`}>
                        Next: {nextUpcoming.teams.home.name} vs {nextUpcoming.teams.away.name} —{" "}
                        {new Date(nextUpcoming.date).toLocaleDateString("en-US", {
                          month: "short", day: "numeric", hour: "2-digit", minute: "2-digit",
                        })}
                      </p>
                    ) : (
                      <p className={`text-[11px] mt-0.5 ${body}`}>Football matches appear here when live.</p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Live match card */}
            {liveMatch && matchStatus && (
              <button
                onClick={() => setWatchingLive(true)}
                className={`w-full text-left p-3.5 rounded-2xl border transition-all duration-200 ${
                  watchingLive
                    ? isDark
                      ? "border-sport-red/40 bg-sport-red/[0.08]"
                      : "border-sport-red/25 bg-sport-red/[0.04]"
                    : isDark
                      ? "border-sport-red/15 bg-sport-red/[0.04] hover:border-sport-red/25 hover:bg-sport-red/[0.07]"
                      : "border-sport-red/15 bg-red-50/50 hover:border-sport-red/25 hover:bg-red-50"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 bg-sport-red/15">
                    <CircleDot className="w-5 h-5 text-sport-red" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="text-[13px] font-semibold truncate text-sport-red">
                        {liveMatch.teams.home.name} vs {liveMatch.teams.away.name}
                      </p>
                      {matchStatus.isLive ? (
                        <span className="inline-flex items-center gap-1 px-1.5 py-0.5 text-[9px] font-bold bg-sport-red/15 text-sport-red rounded-md border border-sport-red/20 shrink-0">
                          <span className="w-1 h-1 rounded-full bg-sport-red animate-pulse" />
                          LIVE
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-1.5 py-0.5 text-[9px] font-bold bg-sport-yellow/15 text-sport-yellow rounded-md shrink-0">
                          <Clock className="w-2.5 h-2.5" />
                          {matchStatus.countdown}
                        </span>
                      )}
                    </div>
                    <p className={`text-[11px] mt-0.5 truncate ${body}`}>{liveMatch.title}</p>
                  </div>
                  {watchingLive && (
                    <div className="flex items-center gap-1.5 shrink-0">
                      <div className="w-2 h-2 rounded-full bg-sport-red animate-pulse" />
                    </div>
                  )}
                </div>
              </button>
            )}

            {/* Regular channels */}
            {filtered.map((channel) => {
              const isActive = !watchingLive && activeChannel.id === channel.id
              return (
                <button
                  key={channel.id}
                  onClick={() => { setActiveChannel(channel); setWatchingLive(false) }}
                  className={`w-full text-left p-3.5 rounded-2xl border transition-all duration-200 ${
                    isActive
                      ? isDark
                        ? "border-accent/35 bg-accent/[0.08]"
                        : "border-accent/25 bg-accent/[0.04]"
                      : isDark
                        ? "border-white/[0.05] bg-dark-300/60 hover:border-white/[0.09] hover:bg-white/[0.04]"
                        : "border-slate-200/80 bg-white/70 hover:border-slate-300 hover:bg-white"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-all ${
                      isActive
                        ? "bg-accent/20 text-accent-light"
                        : isDark
                          ? "bg-white/[0.04] text-dark-100/50"
                          : "bg-slate-100 text-slate-400"
                    }`}>
                      <Tv className="w-4.5 h-4.5" style={{ width: 18, height: 18 }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={`text-[13px] font-medium truncate ${isActive ? "text-accent-light" : strong}`}>
                        {channel.name}
                      </p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className={`text-[11px] ${body}`}>{channel.category}</span>
                        <QualityBadge quality={channel.quality} isDark={isDark} />
                      </div>
                    </div>
                    {isActive && (
                      <div className="flex items-center gap-1.5 shrink-0">
                        <div className="w-2 h-2 rounded-full bg-sport-green animate-pulse" />
                      </div>
                    )}
                  </div>
                </button>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
