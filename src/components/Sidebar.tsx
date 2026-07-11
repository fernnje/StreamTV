import type React from "react"
import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Tv, Monitor, Trophy, Sun, Moon, Home, TvMinimalPlay, X, Radio } from "lucide-react"
import { useTheme } from "../context/ThemeContext"

type Tab = "home" | "iptv" | "catalog" | "sports" | "legal"

interface SidebarProps {
  activeTab: Tab
  onTabChange: (tab: Tab) => void
  isOpen: boolean
  onClose: () => void
}

const navItems: { id: Tab; label: string; icon: React.ComponentType<{ className?: string }>; accent?: string }[] = [
  { id: "home", label: "Home", icon: Home },
  { id: "iptv", label: "Live Streams", icon: Radio, accent: "text-sport-red" },
  { id: "catalog", label: "IPTV Channels", icon: TvMinimalPlay, accent: "text-accent-light" },
  { id: "sports", label: "Live Sports", icon: Trophy, accent: "text-sport-yellow" },
]

const SPRING_CONFIG = { type: "spring" as const, stiffness: 400, damping: 32 }

export default function Sidebar({ activeTab, onTabChange, isOpen, onClose }: SidebarProps) {
  const { theme, toggle } = useTheme()
  const isDark = theme === "dark"
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const handleNav = (id: Tab) => {
    onTabChange(id)
    onClose()
  }

  return (
    <>
      {/* Backdrop — mobile only */}
      <motion.div
        className="fixed inset-0 z-40 lg:hidden"
        initial={false}
        animate={{
          opacity: isOpen ? 1 : 0,
          pointerEvents: isOpen ? "auto" : "none",
        }}
        transition={{ duration: 0.25 }}
        style={{
          background: "rgba(0,0,0,0.75)",
          backdropFilter: "blur(8px)",
        }}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Sidebar */}
      <motion.aside
        className={`fixed top-0 left-0 z-50 h-full w-60 flex flex-col shrink-0
          lg:static lg:z-auto
          ${isDark
            ? "bg-dark-300 border-r border-white/[0.05]"
            : "bg-white border-r border-slate-200/80"
          }`}
        initial={false}
        animate={{
          x: isOpen || (typeof window !== "undefined" && window.innerWidth >= 1024) ? 0 : -240,
        }}
        transition={SPRING_CONFIG}
      >
        {/* Logo */}
        <div className={`px-5 pt-6 pb-5 border-b ${isDark ? "border-white/[0.05]" : "border-slate-200/80"}`}>
          <motion.div
            className="flex items-center justify-between"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.05, duration: 0.3 }}
          >
            <div className="flex items-center gap-3">
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${isDark ? "bg-accent/20 border border-accent/20" : "bg-accent/10 border border-accent/20"}`}>
                <Monitor className="w-4.5 h-4.5 text-accent-light" style={{ width: 18, height: 18 }} />
              </div>
              <div>
                <h1 className={`text-[15px] font-bold leading-tight ${isDark ? "text-white" : "text-slate-900"}`}>
                  FernnTV
                </h1>
                <p className={`text-[11px] font-medium ${isDark ? "text-dark-100/60" : "text-slate-400"}`}>
                  IPTV Dashboard
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className={`lg:hidden p-1.5 rounded-lg transition-colors ${
                isDark ? "hover:bg-white/8 text-dark-100" : "hover:bg-slate-100 text-slate-400"
              }`}
              style={{ background: "transparent" }}
              aria-label="Close menu"
            >
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto scrollbar-hide">
          <p className={`px-3 mb-2 text-[10px] font-semibold uppercase tracking-widest ${isDark ? "text-dark-100/40" : "text-slate-400"}`}>
            Menu
          </p>
          {navItems.map(({ id, label, icon: Icon, accent }, index) => {
            const isActive = activeTab === id
            return (
              <motion.button
                key={id}
                onClick={() => handleNav(id)}
                className={`nav-item group ${
                  isActive
                    ? isDark
                      ? "text-white"
                      : "text-slate-900"
                    : isDark
                      ? "text-dark-100/70 hover:text-white"
                      : "text-slate-500 hover:text-slate-900"
                }`}
                initial={mounted ? false : { opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.04, duration: 0.25, ease: "easeOut" }}
                whileHover={{ x: 2 }}
                whileTap={{ scale: 0.98 }}
              >
                {/* Active background */}
                {isActive && (
                  <motion.div
                    layoutId="activeTab"
                    className={`absolute inset-0 rounded-xl ${
                      isDark
                        ? "bg-white/[0.07] border border-white/[0.08]"
                        : "bg-slate-100 border border-slate-200"
                    }`}
                    transition={SPRING_CONFIG}
                  />
                )}

                {/* Icon */}
                <div className={`relative z-10 w-8 h-8 rounded-lg flex items-center justify-center shrink-0 transition-all duration-150 ${
                  isActive
                    ? isDark
                      ? "bg-accent/20"
                      : "bg-accent/10"
                    : isDark
                      ? "bg-white/[0.04] group-hover:bg-white/[0.07]"
                      : "bg-slate-100 group-hover:bg-slate-200"
                }`}>
                  <Icon className={`w-4 h-4 ${isActive ? (accent || "text-accent-light") : isDark ? "text-dark-100/70 group-hover:text-white" : "text-slate-500 group-hover:text-slate-900"}`} />
                </div>

                <span className="relative z-10 text-[13.5px]">{label}</span>

                {/* Active dot */}
                {isActive && (
                  <motion.div
                    className="relative z-10 ml-auto w-1.5 h-1.5 rounded-full bg-accent-light"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 500, damping: 25 }}
                  />
                )}
              </motion.button>
            )
          })}
        </nav>

        {/* Footer */}
        <div className={`px-3 pb-5 pt-3 border-t safe-area-bottom ${isDark ? "border-white/[0.05]" : "border-slate-200/80"}`}>
          {/* Theme Toggle */}
          <motion.button
            onClick={toggle}
            className={`nav-item w-full ${
              isDark
                ? "text-dark-100/70 hover:text-white hover:bg-white/[0.06]"
                : "text-slate-500 hover:text-slate-900 hover:bg-slate-100"
            }`}
            whileHover={{ x: 2 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${isDark ? "bg-white/[0.04]" : "bg-slate-100"}`}>
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={isDark ? "sun" : "moon"}
                  initial={{ opacity: 0, rotate: -45, scale: 0.7 }}
                  animate={{ opacity: 1, rotate: 0, scale: 1 }}
                  exit={{ opacity: 0, rotate: 45, scale: 0.7 }}
                  transition={{ duration: 0.15 }}
                >
                  {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                </motion.div>
              </AnimatePresence>
            </div>
            <span className="text-[13.5px]">{isDark ? "Light Mode" : "Dark Mode"}</span>
          </motion.button>

          {/* Status dot */}
          <div className={`mt-2 flex items-center gap-2.5 px-3 py-2 rounded-xl ${isDark ? "bg-white/[0.03]" : "bg-slate-50"}`}>
            <motion.div
              className="w-1.5 h-1.5 rounded-full bg-sport-green"
              animate={{ scale: [1, 1.4, 1], opacity: [1, 0.6, 1] }}
              transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
            />
            <span className={`text-[11px] font-medium ${isDark ? "text-dark-100/50" : "text-slate-400"}`}>
              System Ready
            </span>
          </div>
        </div>
      </motion.aside>
    </>
  )
}
