# Synergy Dashboard
### Urban Population Dynamics & Sustainable Cities (SDG 11)
**Women Techsters Bootcamp 5.0 — Synergy Team — Demo Day: 25 March 2026**

---

## 🌐 Live Demo

👉 [Live Demo](https://synergy-team-dashboard.vercel.app/)
## Quick Start (3 commands)


```bash
# 1. Install dependencies
npm install

# 2. Start development server
npm run dev

# 3. Open http://localhost:5173 in your browser
```

That's it. The dashboard runs locally.

---

## Project Structure

```
synergy-dashboard/
├── index.html                  ← HTML entry point
├── vite.config.js              ← Vite configuration
├── tailwind.config.js          ← Tailwind (darkMode: 'class' set here)
├── postcss.config.js           ← PostCSS for Tailwind
├── package.json                ← Dependencies
└── src/
    ├── main.jsx                ← React entry point
    ├── App.jsx                 ← Main app + all 5 tabs
    ├── index.css               ← Tailwind directives + global styles
    ├── data.js                 ← All dataset constants (235 countries)
    ├── hooks/
    │   └── useTheme.js         ← Dark mode hook (THE FIX lives here)
    └── components/
        ├── ui.jsx              ← Reusable: KpiCard, HBar, Donut, Card, Insight
        ├── ScatterPlot.jsx     ← Fertility vs Urban scatter plot
        └── DataTable.jsx       ← Sortable, searchable data table
```


## Features

| Feature | Detail |
|---|---|
| Light / Dark theme | Persists in localStorage, respects system preference |
| 5 Navigation tabs | Overview, Pressure & Density, Migration, Population, Data Table |
| Animated KPI cards | Count-up animation on load |
| Animated bar charts | Smooth fill transitions with colour-coded thresholds |
| Donut charts | Risk, Urbanisation, Population Category distributions |
| Scatter plot | Fertility vs Urban % with hover tooltips |
| Sortable table | Click any column header to sort |
| Responsive | Works on mobile, tablet, and desktop |

---

## Build for Production

```bash
npm run build
# Output goes to /dist folder
# Deploy /dist to GitHub Pages, Netlify, or Vercel for your project URL
```

### Deploy to GitHub Pages (free)
```bash
# 1. Push this folder to a GitHub repo
# 2. Go to Settings → Pages → Source: GitHub Actions
# 3. Your URL becomes: https://yourusername.github.io/synergy-dashboard
```

---

## Tech Stack
- **React 18** — UI framework
- **Vite 5** — Build tool (fast hot reload)
- **Tailwind CSS 3** — Utility-first styling
- **Lucide React** — Icons
- **Pure SVG** — All charts (no chart library needed)

---

## Data Source
`src/data.js` — extracted from `Share_cleaned_data_set_world_population_by_country.xlsx`
Sheet: `Clean_world_population` · 235 rows × 16 columns
