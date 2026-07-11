import {
  Tv,
  List,
  Trophy,
  ExternalLink,
  Monitor,
  Radio,
  Zap,
  Globe,
  Heart,
  ArrowRight,
  Play,
  Wifi,
  Search,
  Scale,
  ChevronRight,
} from "lucide-react"
import { useTheme } from "../context/ThemeContext"
import type { Tab } from "../App"

interface HomePageProps {
  onNavigate: (tab: Tab) => void
}

const destinations = [
  {
    id: "iptv" as Tab,
    icon: Radio,
    title: "Live Streams",
    description: "Curated HLS channels with instant playback and category filters.",
    accentColor: "text-sport-red",
    bgColor: "bg-sport-red/10",
    borderColor: "border-sport-red/20",
    metric: "4+",
    metricLabel: "Curated Channels",
  },
  {
    id: "catalog" as Tab,
    icon: Tv,
    title: "IPTV Catalog",
    description: "Search & browse 4000+ channels from iptv-org and Free-TV.",
    accentColor: "text-accent-light",
    bgColor: "bg-accent/10",
    borderColor: "border-accent/20",
    metric: "4000+",
    metricLabel: "Channels",
  },
  {
    id: "sports" as Tab,
    icon: Trophy,
    title: "Live Sports",
    description: "Live and upcoming matches across 9 sports categories.",
    accentColor: "text-sport-yellow",
    bgColor: "bg-sport-yellow/10",
    borderColor: "border-sport-yellow/20",
    metric: "9",
    metricLabel: "Sports",
  },
]

const stats = [
  { label: "IPTV Channels", value: "4000+", icon: Radio, color: "text-accent-light", bg: "bg-accent/10" },
  { label: "Sports Categories", value: "9", icon: Trophy, color: "text-sport-yellow", bg: "bg-sport-yellow/10" },
  { label: "Open Source", value: "100%", icon: Heart, color: "text-sport-red", bg: "bg-sport-red/10" },
  { label: "Live Ready", value: "HLS", icon: Wifi, color: "text-sport-green", bg: "bg-sport-green/10" },
]

const sourceCards = [
  {
    title: "iptv-org/iptv",
    href: "https://github.com/iptv-org/iptv",
    icon: Globe,
    description: "Community-maintained M3U playlists with category-based grouping.",
    tags: ["M3U", "Open Source", "Global"],
    accentColor: "text-sport-green",
    bg: "bg-sport-green/10",
  },
  {
    title: "Free-TV/IPTV",
    href: "https://github.com/Free-TV/IPTV",
    icon: Globe,
    description: "Country-organized IPTV channels with 80+ countries and region tags.",
    tags: ["M3U", "Country-based", "1800+ channels"],
    accentColor: "text-accent-light",
    bg: "bg-accent/10",
  },
  {
    title: "SportSRC API",
    href: "https://sportsrc.org",
    icon: Trophy,
    description: "Match schedules and stream embeds for live sports categories.",
    tags: ["REST API", "Streams", "Sports"],
    accentColor: "text-sport-yellow",
    bg: "bg-sport-yellow/10",
  },
]

export default function HomePage({ onNavigate }: HomePageProps) {
  const { theme } = useTheme()
  const isDark = theme === "dark"

  const muted = isDark ? "text-dark-100/60" : "text-slate-400"
  const strong = isDark ? "text-white" : "text-slate-900"
  const body = isDark ? "text-dark-100/80" : "text-slate-600"
  const cardBg = isDark ? "bg-dark-300 border-white/[0.06]" : "bg-white border-slate-200/80"
  const cardBgHover = isDark ? "hover:bg-white/[0.04] hover:border-white/10" : "hover:bg-slate-50 hover:border-slate-300"

  return (
    <div className="flex flex-col gap-6 max-w-5xl mx-auto w-full pb-6">

      {/* Hero Banner */}
      <section className={`relative overflow-hidden rounded-2xl border p-6 sm:p-8 ${isDark ? "bg-dark-300 border-white/[0.06]" : "bg-white border-slate-200/80"}`}>
        {/* Ambient glow */}
        {isDark && (
          <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-2xl">
            <div className="absolute -top-20 -left-10 w-64 h-64 rounded-full bg-accent/10 blur-3xl" />
            <div className="absolute -bottom-10 right-10 w-48 h-48 rounded-full bg-sport-green/8 blur-3xl" />
          </div>
        )}

        <div className="relative flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center gap-4">
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 ${isDark ? "bg-accent/20 border border-accent/20" : "bg-accent/10 border border-accent/20"}`}>
              <Monitor className="w-7 h-7 text-accent-light" />
            </div>
            <div>
              <h1 className={`text-3xl sm:text-4xl font-black tracking-tight leading-none ${strong}`}>
                FernnTV
              </h1>
              <p className={`mt-1.5 text-sm sm:text-base leading-relaxed ${body}`}>
                IPTV, channel discovery, and live sports in one focused dashboard.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={() => onNavigate("iptv")}
              className="inline-flex min-h-[42px] items-center gap-2 rounded-xl bg-accent px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-accent/25 transition-all hover:bg-accent-light active:scale-95"
            >
              <Play className="w-4 h-4" fill="currentColor" />
              Watch Now
            </button>
            <button
              onClick={() => onNavigate("catalog")}
              className={`inline-flex min-h-[42px] items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold transition-all active:scale-95 ${
                isDark
                  ? "bg-white/8 text-white hover:bg-white/12 border border-white/8"
                  : "bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200"
              }`}
              style={isDark ? { background: "rgba(255,255,255,0.07)", borderColor: "rgba(255,255,255,0.08)" } : {}}
            >
              <Search className="w-4 h-4" />
              Browse
            </button>
          </div>
        </div>
      </section>

      {/* Stats Row */}
      <section className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className={`rounded-2xl border p-4 ${cardBg}`}
          >
            <div className="flex items-center justify-between gap-2 mb-3">
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${stat.bg}`}>
                <stat.icon className={`w-4 h-4 ${stat.color}`} />
              </div>
            </div>
            <p className={`text-xl font-black leading-none ${strong}`}>{stat.value}</p>
            <p className={`text-[11px] font-medium mt-1 ${muted}`}>{stat.label}</p>
          </div>
        ))}
      </section>

      {/* Sections */}
      <section>
        <div className="flex items-center gap-2 mb-4">
          <Zap className={`w-3.5 h-3.5 ${muted}`} />
          <h2 className={`text-[11px] font-semibold uppercase tracking-widest ${muted}`}>
            Sections
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {destinations.map((item) => (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`group relative overflow-hidden rounded-2xl border p-5 text-left transition-all duration-200 ${cardBg} ${cardBgHover}`}
            >
              {/* Card ambient */}
              {isDark && (
                <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${item.bgColor} blur-2xl`} />
              )}

              <div className="relative">
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${item.bgColor} border ${item.borderColor}`}>
                    <item.icon className={`w-5 h-5 ${item.accentColor}`} />
                  </div>
                  <div className="text-right">
                    <p className={`text-xl font-black leading-none ${strong}`}>{item.metric}</p>
                    <p className={`text-[9px] font-semibold uppercase tracking-widest mt-0.5 ${muted}`}>{item.metricLabel}</p>
                  </div>
                </div>

                <h3 className={`text-base font-bold mb-1 ${strong}`}>{item.title}</h3>
                <p className={`text-[13px] leading-relaxed ${body}`}>{item.description}</p>

                <div className={`mt-4 inline-flex items-center gap-1.5 text-[12px] font-semibold transition-all duration-200 group-hover:gap-2.5 ${item.accentColor}`}>
                  Open
                  <ChevronRight className="w-3.5 h-3.5" />
                </div>
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* Data Sources */}
      <section>
        <div className="flex items-center gap-2 mb-4">
          <Heart className={`w-3.5 h-3.5 ${muted}`} />
          <h2 className={`text-[11px] font-semibold uppercase tracking-widest ${muted}`}>
            Data Sources
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {sourceCards.map((source) => (
            <div
              key={source.title}
              className={`rounded-2xl border p-4 ${cardBg}`}
            >
              <div className="flex items-start gap-3 mb-3">
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${source.bg}`}>
                  <source.icon className={`w-4.5 h-4.5 ${source.accentColor}`} style={{ width: 18, height: 18 }} />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5">
                    <h3 className={`text-[13px] font-bold truncate ${strong}`}>{source.title}</h3>
                    <a
                      href={source.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`shrink-0 transition-colors ${source.accentColor} opacity-60 hover:opacity-100`}
                      aria-label={`Open ${source.title}`}
                    >
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                  <p className={`text-[12px] leading-relaxed mt-0.5 ${body}`}>{source.description}</p>
                </div>
              </div>

              <div className="flex flex-wrap gap-1.5">
                {source.tags.map((tag) => (
                  <span
                    key={tag}
                    className={`rounded-lg px-2 py-0.5 text-[10px] font-semibold tracking-wide ${
                      isDark ? "bg-white/[0.06] text-dark-100/70" : "bg-slate-100 text-slate-500"
                    }`}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Legal */}
      <section className={`rounded-2xl border ${cardBg}`}>
        <button
          onClick={() => onNavigate("legal")}
          className={`w-full flex items-center gap-4 px-5 py-4 text-left rounded-2xl transition-colors ${
            isDark ? "hover:bg-white/[0.03]" : "hover:bg-slate-50"
          }`}
        >
          <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${isDark ? "bg-white/[0.05]" : "bg-slate-100"}`}>
            <Scale className="w-4 h-4 text-accent-light" />
          </div>
          <div className="flex-1 min-w-0">
            <p className={`text-[13px] font-semibold ${strong}`}>Legal &amp; Terms</p>
            <p className={`text-[12px] mt-0.5 ${body}`}>Disclaimer, terms and conditions, privacy policy, and liability information.</p>
          </div>
          <ArrowRight className={`w-4 h-4 shrink-0 ${muted}`} />
        </button>
      </section>
    </div>
  )
}
