import { useState, useEffect, useMemo, useRef } from "react"
import {
  List,
  Search,
  Loader2,
  AlertTriangle,
  ChevronDown,
  ChevronRight,
  Tv,
  Play,
  X,
  Radio,
  Filter,
  Sparkles,
  Globe,
  SlidersHorizontal,
} from "lucide-react"
import { useTheme } from "../context/ThemeContext"
import VideoPlayer from "./VideoPlayer"
import type { M3UChannel } from "../types"

const M3U_SOURCES = [
  { url: "https://iptv-org.github.io/iptv/index.category.m3u", label: "iptv-org" },
  { url: "https://raw.githubusercontent.com/Free-TV/IPTV/master/playlist.m3u8", label: "Free-TV" },
]

function parseM3U(m3u: string): M3UChannel[] {
  const channels: M3UChannel[] = []
  const lines = m3u.split("\n")
  let currentExtinf: string | null = null

  for (const line of lines) {
    const trimmed = line.trim()
    if (trimmed.startsWith("#EXTINF:")) {
      currentExtinf = trimmed
    } else if (currentExtinf && trimmed && !trimmed.startsWith("#")) {
      const tvgId = (currentExtinf.match(/tvg-id="([^"]*)"/) || [])[1] || ""
      const tvgLogo = (currentExtinf.match(/tvg-logo="([^"]*)"/) || [])[1] || ""
      const groupTitle = (currentExtinf.match(/group-title="([^"]*)"/) || [])[1] || "Uncategorized"
      const name = currentExtinf.split(",").pop()?.trim() || "Unknown Channel"
      channels.push({ id: tvgId || `ch-${channels.length}`, name, url: trimmed, logo: tvgLogo, category: groupTitle, tvgId, raw: currentExtinf })
      currentExtinf = null
    }
  }
  return channels
}

function extractCountry(channel: M3UChannel): string | null {
  const tvgCountry = channel.raw?.match(/tvg-country="([^"]*)"/)?.[1]
  if (tvgCountry && tvgCountry !== "ALL" && tvgCountry.trim()) return tvgCountry.trim().toUpperCase()
  const id = channel.tvgId || channel.id
  const dotAtMatch = id.match(/\.([a-zA-Z]{2,3})@/)
  if (dotAtMatch) return dotAtMatch[1].toUpperCase()
  const dotTldMatch = id.match(/\.([a-zA-Z]{2,3})$/)
  if (dotTldMatch) return dotTldMatch[1].toUpperCase()
  const shortId = id.match(/^([a-zA-Z]{2,3})$/)
  if (shortId) return shortId[1].toUpperCase()
  return null
}

export default function IPTVChannels() {
  const { theme } = useTheme()
  const isDark = theme === "dark"
  const [channels, setChannels] = useState<M3UChannel[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [search, setSearch] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string>("All")
  const [selectedCountry, setSelectedCountry] = useState<string>("All")
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set())
  const [activeChannel, setActiveChannel] = useState<M3UChannel | null>(null)
  const [totalCount, setTotalCount] = useState(0)
  const [sourcesLoaded, setSourcesLoaded] = useState(0)
  const searchRef = useRef<HTMLInputElement>(null)
  const channelListRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    let cancelled = false
    async function fetchAll() {
      try {
        const results = await Promise.allSettled(
          M3U_SOURCES.map((src) =>
            fetch(src.url, { signal: AbortSignal.timeout(30000) })
              .then((res) => {
                if (!res.ok) throw new Error(`HTTP ${res.status}`)
                return res.text()
              })
          )
        )
        if (cancelled) return
        const seen = new Set<string>()
        const merged: M3UChannel[] = []
        for (const result of results) {
          if (result.status === "fulfilled") {
            const parsed = parseM3U(result.value)
            for (const ch of parsed) {
              const key = ch.url.toLowerCase().trim()
              if (!seen.has(key)) { seen.add(key); merged.push(ch) }
            }
          }
          setSourcesLoaded((p) => p + 1)
        }
        if (merged.length === 0) throw new Error("No channels found in any source")
        setChannels(merged)
        setTotalCount(merged.length)
        setLoading(false)
      } catch (err) {
        if (cancelled) return
        setError((err as Error).message || "Failed to load channel list")
        setLoading(false)
      }
    }
    fetchAll()
    return () => { cancelled = true }
  }, [])

  const categories = useMemo(() => {
    const cats = new Map<string, number>()
    for (const ch of channels) cats.set(ch.category, (cats.get(ch.category) || 0) + 1)
    return Array.from(cats.entries()).sort(([, a], [, b]) => b - a)
  }, [channels])

  const countries = useMemo(() => {
    const map = new Map<string, number>()
    for (const ch of channels) {
      const country = extractCountry(ch)
      if (country) map.set(country, (map.get(country) || 0) + 1)
    }
    return Array.from(map.entries()).sort(([, a], [, b]) => b - a)
  }, [channels])

  const filtered = useMemo(() => {
    let result = channels
    if (selectedCategory !== "All") result = result.filter((c) => c.category === selectedCategory)
    if (selectedCountry !== "All") result = result.filter((c) => extractCountry(c) === selectedCountry)
    if (search.trim()) {
      const q = search.toLowerCase()
      result = result.filter((c) => c.name.toLowerCase().includes(q) || c.category.toLowerCase().includes(q))
    }
    return result
  }, [channels, selectedCategory, selectedCountry, search])

  const grouped = useMemo(() => {
    const map = new Map<string, M3UChannel[]>()
    for (const ch of filtered) {
      if (!map.has(ch.category)) map.set(ch.category, [])
      map.get(ch.category)!.push(ch)
    }
    return Array.from(map.entries()).sort(([a], [b]) => a.localeCompare(b))
  }, [filtered])

  const toggleCategory = (cat: string) => {
    setExpandedCategories((prev) => {
      const next = new Set(prev)
      if (next.has(cat)) next.delete(cat)
      else next.add(cat)
      return next
    })
  }

  const clearSearch = () => { setSearch(""); searchRef.current?.focus() }
  const hasActiveFilters = selectedCategory !== "All" || selectedCountry !== "All"
  const clearAllFilters = () => { setSelectedCategory("All"); setSelectedCountry("All"); setSearch("") }

  const muted = isDark ? "text-dark-100/60" : "text-slate-400"
  const strong = isDark ? "text-white" : "text-slate-900"
  const body = isDark ? "text-dark-100/70" : "text-slate-500"
  const cardBg = isDark ? "bg-dark-300 border-white/[0.06]" : "bg-white border-slate-200/80"

  return (
    <div className="flex flex-col xl:h-full max-w-6xl mx-auto w-full">
      {/* Header */}
      <div className="mb-5">
        <div className="flex flex-wrap items-center gap-3">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${isDark ? "bg-accent/15 border border-accent/20" : "bg-accent/10 border border-accent/20"}`}>
            <List className="w-5 h-5 text-accent-light" />
          </div>
          <div>
            <h2 className={`text-xl font-black tracking-tight ${strong}`}>IPTV Catalog</h2>
            <p className={`text-xs ${muted}`}>Browse channels from iptv-org &amp; Free-TV</p>
          </div>
          {totalCount > 0 && (
            <span className={`sm:ml-auto px-3 py-1.5 text-[11px] font-bold rounded-full border ${isDark ? "bg-accent/15 text-accent-light border-accent/25" : "bg-accent/10 text-accent-dark border-accent/20"}`}>
              {totalCount.toLocaleString()} channels
            </span>
          )}
        </div>
      </div>

      {/* Loading */}
      {loading && (
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="relative mb-4">
              <Loader2 className="w-10 h-10 text-accent-light animate-spin mx-auto" />
              <div className="absolute inset-0 w-10 h-10 border-2 border-accent/15 rounded-full mx-auto" />
            </div>
            <p className={`text-[13px] font-semibold mb-1 ${strong}`}>Loading channels</p>
            <p className={`text-[11px] ${muted}`}>
              Fetching playlists ({sourcesLoaded}/{M3U_SOURCES.length} sources)…
            </p>
          </div>
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center max-w-md">
            <div className="w-14 h-14 rounded-2xl bg-sport-red/10 flex items-center justify-center mx-auto mb-4">
              <AlertTriangle className="w-7 h-7 text-sport-red" />
            </div>
            <h3 className={`text-base font-bold mb-2 ${strong}`}>Failed to Load</h3>
            <p className={`text-[13px] mb-4 ${body}`}>{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-accent hover:bg-accent-light text-white text-[13px] font-semibold rounded-xl transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      )}

      {/* Main Content */}
      {!loading && !error && (
        <div className="flex flex-col xl:grid xl:grid-cols-[minmax(0,1fr)_360px] gap-4 sm:gap-5 xl:flex-1 xl:min-h-0">
          {/* Channel List */}
          <div className="flex flex-col min-h-0 order-2 xl:order-1">
            {/* Search */}
            <div className="mb-3">
              <div className="relative">
                <Search className={`absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 ${muted}`} />
                <input
                  ref={searchRef}
                  type="text"
                  placeholder="Search channels or categories..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className={`w-full pl-10 pr-10 py-3 rounded-2xl text-[13px] focus:outline-none focus:ring-2 focus:ring-accent/20 transition-all min-h-[48px] ${
                    isDark
                      ? "bg-dark-300 border border-white/[0.07] text-white placeholder-dark-100/40 focus:border-accent/40"
                      : "bg-white border border-slate-200 text-slate-900 placeholder-slate-400 focus:border-accent/40"
                  }`}
                />
                {search && (
                  <button
                    type="button"
                    onClick={clearSearch}
                    aria-label="Clear search"
                    className={`absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-lg transition-colors ${
                      isDark ? "hover:bg-white/[0.07] text-dark-100/60 hover:text-white" : "hover:bg-slate-100 text-slate-400 hover:text-slate-600"
                    }`}
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
              {(search || hasActiveFilters) && (
                <div className="flex items-center gap-2 mt-2 px-1">
                  <p className={`text-[11px] ${muted}`}>
                    {filtered.length.toLocaleString()} results
                    {search && <> for &quot;{search}&quot;</>}
                  </p>
                  {hasActiveFilters && (
                    <button
                      onClick={clearAllFilters}
                      className="text-[11px] font-medium text-accent hover:text-accent-light transition-colors"
                    >
                      Clear filters
                    </button>
                  )}
                </div>
              )}
            </div>

            {/* Grouped channel list */}
            <div ref={channelListRef} className="max-h-[58vh] xl:max-h-none xl:flex-1 overflow-y-auto space-y-1.5 pr-0.5 pb-1">
              {grouped.length === 0 && (
                <div className="flex flex-col items-center justify-center py-16">
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-4 ${isDark ? "bg-white/[0.04]" : "bg-slate-100"}`}>
                    <Radio className={`w-7 h-7 ${muted}`} />
                  </div>
                  <p className={`text-[13px] font-semibold mb-1 ${strong}`}>No channels found</p>
                  <p className={`text-[11px] ${muted}`}>Try adjusting your search or filters</p>
                </div>
              )}

              {grouped.map(([category, chs]) => (
                <div
                  key={category}
                  className={`rounded-2xl border overflow-hidden transition-colors ${cardBg}`}
                >
                  <button
                    onClick={() => toggleCategory(category)}
                    className={`w-full flex items-center justify-between px-4 py-3 transition-colors group ${isDark ? "hover:bg-white/[0.03]" : "hover:bg-slate-50"}`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-7 h-7 rounded-lg flex items-center justify-center transition-all ${
                        expandedCategories.has(category)
                          ? isDark ? "bg-accent/20 text-accent-light" : "bg-accent/10 text-accent-dark"
                          : isDark ? "bg-white/[0.05] text-dark-100/50" : "bg-slate-100 text-slate-400"
                      }`}>
                        {expandedCategories.has(category)
                          ? <ChevronDown className="w-3.5 h-3.5" />
                          : <ChevronRight className="w-3.5 h-3.5" />}
                      </div>
                      <div className="text-left">
                        <span className={`text-[13px] font-medium transition-colors ${isDark ? "text-white group-hover:text-accent-light" : "text-slate-900 group-hover:text-accent-dark"}`}>
                          {category}
                        </span>
                        <p className={`text-[11px] mt-0.5 ${muted}`}>
                          {chs.length.toLocaleString()} channel{chs.length !== 1 ? "s" : ""}
                        </p>
                      </div>
                    </div>
                    <span className={`px-2.5 py-1 text-[11px] font-semibold rounded-lg ${
                      expandedCategories.has(category)
                        ? isDark ? "bg-accent/20 text-accent-light" : "bg-accent/10 text-accent-dark"
                        : isDark ? "bg-white/[0.05] text-dark-100/60" : "bg-slate-100 text-slate-500"
                    }`}>
                      {chs.length}
                    </span>
                  </button>

                  {expandedCategories.has(category) && (
                    <div className={`border-t max-h-72 sm:max-h-96 overflow-y-auto ${isDark ? "border-white/[0.05]" : "border-slate-100"}`}>
                      {chs.slice(0, 200).map((ch) => {
                        const country = extractCountry(ch)
                        const isActive = activeChannel?.id === ch.id
                        return (
                          <button
                            key={ch.id}
                            onClick={() => setActiveChannel(ch)}
                            className={`w-full flex items-center gap-3 px-4 py-2.5 text-left transition-all border-l-2 ${
                              isActive
                                ? isDark ? "bg-accent/[0.07] border-accent-light" : "bg-accent/[0.04] border-accent"
                                : isDark ? "hover:bg-white/[0.03] border-transparent" : "hover:bg-slate-50/80 border-transparent"
                            }`}
                          >
                            {ch.logo ? (
                              <img
                                src={ch.logo}
                                alt=""
                                className={`w-6 h-6 rounded-md object-contain shrink-0 ${isDark ? "bg-black/20" : "bg-slate-100"}`}
                                onError={(e) => { (e.target as HTMLImageElement).style.display = "none" }}
                              />
                            ) : (
                              <div className={`w-6 h-6 rounded-md flex items-center justify-center shrink-0 ${isDark ? "bg-white/[0.05]" : "bg-slate-100"}`}>
                                <Tv className={`w-3 h-3 ${muted}`} />
                              </div>
                            )}
                            <div className="flex-1 min-w-0">
                              <p className={`text-[12px] truncate ${isActive ? "text-accent-light font-medium" : strong}`}>
                                {ch.name}
                              </p>
                            </div>
                            {country && (
                              <span className={`px-1.5 py-0.5 text-[9px] font-mono rounded-md shrink-0 ${isDark ? "bg-white/[0.05] text-dark-100/50" : "bg-slate-100 text-slate-400"}`}>
                                {country}
                              </span>
                            )}
                            {isActive && (
                              <div className="w-1.5 h-1.5 rounded-full bg-sport-green animate-pulse shrink-0" />
                            )}
                          </button>
                        )
                      })}
                      {chs.length > 200 && (
                        <p className={`px-4 py-3 text-[11px] text-center border-t ${isDark ? "text-dark-100/50 border-white/[0.05]" : "text-slate-400 border-slate-100"}`}>
                          +{(chs.length - 200).toLocaleString()} more channels
                        </p>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Sidebar: Filters + Player */}
          <div className="flex flex-col min-h-0 gap-4 order-1 xl:order-2">
            <FilterPanel
              isDark={isDark}
              categories={categories}
              countries={countries}
              selectedCategory={selectedCategory}
              selectedCountry={selectedCountry}
              onSelectCategory={setSelectedCategory}
              onSelectCountry={setSelectedCountry}
            />

            {/* Player */}
            {activeChannel && (
              <div className="flex flex-col min-h-0 xl:flex-1">
                <div className="flex items-center gap-2 mb-2.5">
                  <div className="w-6 h-6 rounded-lg bg-sport-yellow/15 flex items-center justify-center">
                    <Sparkles className="w-3 h-3 text-sport-yellow" />
                  </div>
                  <h3 className={`text-[11px] font-semibold uppercase tracking-widest ${muted}`}>Now Playing</h3>
                </div>
                <div className={`rounded-2xl border p-3.5 mb-3 ${cardBg}`}>
                  <div className="flex items-center gap-3">
                    {activeChannel.logo ? (
                      <img
                        src={activeChannel.logo}
                        alt=""
                        className={`w-10 h-10 rounded-xl object-contain shrink-0 ${isDark ? "bg-black/20" : "bg-slate-100"}`}
                        onError={(e) => { (e.target as HTMLImageElement).style.display = "none" }}
                      />
                    ) : (
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${isDark ? "bg-accent/15" : "bg-accent/10"}`}>
                        <Tv className="w-5 h-5 text-accent-light" />
                      </div>
                    )}
                    <div className="min-w-0 flex-1">
                      <p className={`text-[13px] font-semibold truncate ${strong}`}>{activeChannel.name}</p>
                      <p className={`text-[11px] mt-0.5 ${muted}`}>{activeChannel.category}</p>
                    </div>
                    <div className="w-2 h-2 rounded-full bg-sport-green animate-pulse shrink-0" />
                  </div>
                </div>
                <div className="aspect-video w-full min-h-0 rounded-2xl overflow-hidden bg-black border border-white/[0.06] xl:aspect-auto xl:flex-1 xl:min-h-0">
                  <VideoPlayer
                    src={activeChannel.url}
                    title={`${activeChannel.name} — ${activeChannel.category}`}
                    fillContainer
                  />
                </div>
              </div>
            )}

            {!activeChannel && (
              <div className={`rounded-2xl border p-8 flex flex-col items-center justify-center text-center ${cardBg}`}>
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-3 ${isDark ? "bg-white/[0.05]" : "bg-slate-100"}`}>
                  <Play className={`w-6 h-6 ${muted}`} />
                </div>
                <p className={`text-[13px] font-semibold mb-1 ${strong}`}>No channel selected</p>
                <p className={`text-[11px] ${muted}`}>Click a channel to preview</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

/* ─── Compact Filter Panel ────────────────────────────── */

interface FilterPanelProps {
  isDark: boolean
  categories: [string, number][]
  countries: [string, number][]
  selectedCategory: string
  selectedCountry: string
  onSelectCategory: (cat: string) => void
  onSelectCountry: (country: string) => void
}

function FilterPanel({
  isDark,
  categories,
  countries,
  selectedCategory,
  selectedCountry,
  onSelectCategory,
  onSelectCountry,
}: FilterPanelProps) {
  const [openSection, setOpenSection] = useState<"category" | "country" | null>("category")
  const [countrySearch, setCountrySearch] = useState("")

  const filteredCountries = useMemo(() => {
    if (!countrySearch.trim()) return countries
    const q = countrySearch.toLowerCase()
    return countries.filter(([name]) => name.toLowerCase().includes(q))
  }, [countries, countrySearch])

  const toggle = (section: "category" | "country") => {
    setOpenSection((prev) => (prev === section ? null : section))
  }

  const muted = isDark ? "text-dark-100/60" : "text-slate-400"
  const strong = isDark ? "text-white" : "text-slate-700"
  const cardBg = isDark ? "bg-dark-300 border-white/[0.06]" : "bg-white border-slate-200/80"

  return (
    <div className={`rounded-2xl border overflow-hidden ${cardBg}`}>
      {/* Panel Header */}
      <div className={`flex items-center gap-2 px-4 py-3 border-b ${isDark ? "border-white/[0.06]" : "border-slate-100"}`}>
        <SlidersHorizontal className="w-3.5 h-3.5 text-accent-light" />
        <span className={`text-[11px] font-semibold uppercase tracking-widest ${muted}`}>Filters</span>
        <span className={`ml-auto text-[10px] font-semibold px-1.5 py-0.5 rounded-md ${isDark ? "bg-white/[0.06] text-dark-100/60" : "bg-slate-100 text-slate-500"}`}>
          {categories.length + countries.length}
        </span>
      </div>

      {/* Category */}
      <div className={`border-b ${isDark ? "border-white/[0.05]" : "border-slate-100"}`}>
        <button
          onClick={() => toggle("category")}
          className={`w-full flex items-center justify-between px-4 py-2.5 transition-colors ${isDark ? "hover:bg-white/[0.02]" : "hover:bg-slate-50"}`}
        >
          <div className="flex items-center gap-2">
            <Filter className="w-3 h-3 text-accent-light" />
            <span className={`text-[12px] font-medium ${strong}`}>Category</span>
            {selectedCategory !== "All" && (
              <span className="px-1.5 py-0.5 text-[9px] font-bold bg-accent text-white rounded-full">1</span>
            )}
          </div>
          <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${openSection === "category" ? "rotate-180" : ""} ${muted}`} />
        </button>
        {openSection === "category" && (
          <div className="px-3 pb-3">
            <div className="flex flex-wrap gap-1 max-h-40 overflow-y-auto pr-1">
              <PillButton label="All" count={categories.reduce((s, [, c]) => s + c, 0)} active={selectedCategory === "All"} onClick={() => onSelectCategory("All")} isDark={isDark} />
              {categories.map(([cat, count]) => (
                <PillButton key={cat} label={cat} count={count} active={selectedCategory === cat} onClick={() => onSelectCategory(cat)} isDark={isDark} />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Country */}
      <div>
        <button
          onClick={() => toggle("country")}
          className={`w-full flex items-center justify-between px-4 py-2.5 transition-colors ${isDark ? "hover:bg-white/[0.02]" : "hover:bg-slate-50"}`}
        >
          <div className="flex items-center gap-2">
            <Globe className="w-3 h-3 text-accent-light" />
            <span className={`text-[12px] font-medium ${strong}`}>Country</span>
            {selectedCountry !== "All" && (
              <span className="px-1.5 py-0.5 text-[9px] font-bold bg-accent text-white rounded-full">1</span>
            )}
          </div>
          <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${openSection === "country" ? "rotate-180" : ""} ${muted}`} />
        </button>
        {openSection === "country" && (
          <div className="px-3 pb-3">
            {countries.length > 15 && (
              <div className="relative mb-2">
                <Search className={`absolute left-2.5 top-1/2 -translate-y-1/2 w-3 h-3 ${muted}`} />
                <input
                  type="text"
                  placeholder="Search countries..."
                  value={countrySearch}
                  onChange={(e) => setCountrySearch(e.target.value)}
                  className={`w-full pl-7 pr-3 py-1.5 rounded-lg text-[11px] focus:outline-none focus:ring-1 focus:ring-accent/30 transition-all ${
                    isDark
                      ? "bg-white/[0.04] border border-white/[0.07] text-white placeholder-dark-100/40"
                      : "bg-slate-50 border border-slate-200 text-slate-900 placeholder-slate-400"
                  }`}
                />
              </div>
            )}
            <div className="flex flex-wrap gap-1 max-h-40 overflow-y-auto pr-1">
              <PillButton label="All" count={countries.reduce((s, [, c]) => s + c, 0)} active={selectedCountry === "All"} onClick={() => onSelectCountry("All")} isDark={isDark} />
              {filteredCountries.map(([country, count]) => (
                <PillButton key={country} label={country} count={count} active={selectedCountry === country} onClick={() => onSelectCountry(country)} isDark={isDark} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

/* ─── Pill Button ─────────────────────────────────────── */

function PillButton({ label, count, active, onClick, isDark }: {
  label: string; count: number; active: boolean; onClick: () => void; isDark: boolean
}) {
  return (
    <button
      onClick={onClick}
      className={`inline-flex items-center gap-1 px-2 py-1 text-[10px] font-medium rounded-md whitespace-nowrap transition-all duration-150 cursor-pointer min-h-[26px] ${
        active
          ? "bg-accent text-white shadow-sm shadow-accent/20"
          : isDark
            ? "bg-white/[0.05] text-dark-100/60 hover:text-white hover:bg-white/[0.09]"
            : "bg-slate-100 text-slate-500 hover:text-slate-900 hover:bg-slate-200"
      }`}
    >
      {label}
      <span className="opacity-50">{count}</span>
    </button>
  )
}
