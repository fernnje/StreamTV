# StreamHub - IPTV Dashboard

A free, open-source IPTV dashboard for streaming live TV channels, browsing community playlists, and watching sports — all in one place.

![React](https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-6.0-3178C6?style=flat-square&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-06B6D4?style=flat-square&logo=tailwindcss)
![Vite](https://img.shields.io/badge/Vite-8.0-646CFF?style=flat-square&logo=vite)

---

## Features

- **IPTV Player** — Stream curated free IPTV channels with a built-in HLS player. Quality badges, category filters, and real-time connection status.
- **IPTV Catalog** — Browse 4,000+ community-maintained channels from [iptv-org/iptv](https://github.com/iptv-org/iptv) and [Free-TV/IPTV](https://github.com/Free-TV/IPTV) with automatic deduplication. Search by name, filter by category or country, and preview instantly.
- **Live Sports** — Watch live sports streams across football, basketball, NFL, hockey, cricket, and more via the free [SportSRC API](https://sportsrc.org) with embedded players.
- **Live → Streams Integration** — Latest football match from Live Sports automatically appears in the Streams section as a one-click live card.
- **Dark / Light Mode** — Full theme support with smooth transitions.
- **Responsive Design** — Works on desktop, tablet, and mobile.

---

## Screenshots
<img width="1433" height="760" alt="image" src="https://github.com/user-attachments/assets/696a8eb6-b947-4d3d-824c-7f86e07430eb" />
<img width="1433" height="760" alt="image" src="https://github.com/user-attachments/assets/bd2ff40f-b4da-4a82-b738-2d04d5a1cf93" />


---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | React 19 |
| Language | TypeScript 6.0 |
| Styling | Tailwind CSS 3.4 |
| Build Tool | Vite 8 |
| Video Player | HLS.js |
| Icons | Lucide React |

---

## Data Sources

| Source | Description | Channels | License |
|--------|-------------|----------|---------|
| [iptv-org/iptv](https://github.com/iptv-org/iptv) | Community-curated IPTV channels (category-grouped) | 2,500+ | MIT |
| [Free-TV/IPTV](https://github.com/Free-TV/IPTV) | Country-organized IPTV channels (80+ countries) | 1,800+ | MIT |
| [SportSRC API](https://sportsrc.org) | Free sports streaming API (match schedules + embedded streams) | — | Free API |

> **Deduplication:** Both M3U sources are merged at runtime. Duplicate streams (same URL) are automatically removed, resulting in ~4,000+ unique channels.

---

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) 18+ (recommended 20+)
- npm or yarn or pnpm

### Installation

```bash
# Clone the repository
git clone https://github.com/TechKnoWEB/iptv-dashboard.git
cd iptv-dashboard

# Install dependencies
npm install

# Start development server
npm run dev
```

The app will be available at `http://localhost:5173`.

### Build for Production

```bash
npm run build
```

Output will be in the `dist/` directory.

### Preview Production Build

```bash
npm run preview
```

---

## Project Structure

```
src/
├── components/
│   ├── HomePage.tsx          # Landing page with features & data sources
│   ├── IPTVPlayer.tsx        # Curated IPTV channel player + live match embed
│   ├── IPTVCatalog.tsx       # Multi-source channel catalog with filters
│   ├── LiveSports.tsx        # Live sports streams & match schedules
│   ├── LegalDisclaimer.tsx   # Legal & terms page
│   ├── Sidebar.tsx           # Navigation sidebar
│   └── VideoPlayer.tsx       # HLS video player component
├── context/
│   ├── ThemeContext.tsx       # Dark/Light theme provider
│   └── LiveStreamContext.tsx  # Live match state shared between Sports & Streams
├── types.ts                  # TypeScript interfaces
├── App.tsx                   # Root component with hash-based routing
├── main.tsx                  # Entry point
└── index.css                 # Global styles & Tailwind config
```

---

## Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start Vite dev server with HMR |
| `npm run build` | TypeScript compile + Vite production build |
| `npm run preview` | Preview the production build locally |
| `npm run lint` | Run ESLint |

---

## How It Works

### IPTV Player
Loads curated free IPTV channels (beIN Sports, Fox Sports, etc.) and streams them via HLS.js through a local proxy to handle CORS. When a live football match is available from the Sports section, a prominent red "Live Match" card appears at the top of the channel list — click to watch the embedded stream.

### IPTV Catalog
Fetches M3U playlists from **two sources** in parallel (iptv-org + Free-TV), deduplicates by stream URL, and merges into a single unified catalogue. Supports search, category filtering, and country filtering with a compact accordion-style filter panel.

### Live Sports
Connects to the SportSRC API to display upcoming match schedules across 9 sport categories. Selecting a match loads embedded stream players directly from `embed.st`. The latest football match is automatically pushed to the Streams section via a shared context.

### URL Hash Routing
Active tab state is stored in the URL hash (`#home`, `#iptv`, `# catalogue`, `#sports`). Refreshing the page restores the last-viewed section. Browser back/forward navigation also works correctly.

---

## Contributing

Contributions are welcome! Feel free to open an issue or submit a pull request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## License

This project is open source and available under the [MIT License](LICENSE).

---

## Acknowledgments

- [iptv-org/iptv](https://github.com/iptv-org/iptv) — Community-curated IPTV channel lists
- [Free-TV/IPTV](https://github.com/Free-TV/IPTV) — Country-organized IPTV channels
- [SportSRC](https://sportsrc.org) — Free sports streaming API
- [HLS.js](https://github.com/video-dev/hls.js) — HTTP Live Streaming client
- [Lucide](https://lucide.dev) — Beautiful open-source icons
- [Tailwind CSS](https://tailwindcss.com) — Utility-first CSS framework
