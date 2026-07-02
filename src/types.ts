export interface Channel {
  id: string
  name: string
  url: string
  logo?: string
  category: string
  quality: string
}

export interface StreamSource {
  id: string
  label: string
  url: string
  type: "iptv" | "web"
}

export interface M3UChannel {
  id: string
  name: string
  url: string
  logo: string
  category: string
  tvgId: string
  raw: string
}

export interface Match {
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
}

export interface MatchDetail {
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
  sources: {
    id: string
    streamNo: number
    language: string
    hd: boolean
    embedUrl: string
    source: string
    viewers: number
  }[]
}

