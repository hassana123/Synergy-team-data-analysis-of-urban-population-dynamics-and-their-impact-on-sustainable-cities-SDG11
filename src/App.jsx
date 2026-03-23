import { useState } from 'react'
import {
  Sun, Moon, Globe, Users, TrendingUp, AlertTriangle,
  ArrowUpRight, ArrowDownRight, Building2, Map, Activity,
  ChevronDown, ChevronUp,
} from 'lucide-react'

import { useTheme }    from './hooks/useTheme.js'
import { KPI, RISK_DIST, URBAN_DIST, POP_CAT, TOP_PRESSURE, TOP_DENSITY,
         TOP_GROWTH, TOP_MIGRATION_IN, TOP_MIGRATION_OUT, TOP_POP } from './data.js'
import { AnimNum, HBar, Donut, KpiCard, Card, Insight } from './components/ui.jsx'
import ScatterPlot from './components/ScatterPlot.jsx'
import DataTable   from './components/DataTable.jsx'

const TABS = ['Overview', 'Pressure & Density', 'Migration', 'Population', 'Data Table']

export default function App() {
  // ── Theme — the fix is inside useTheme (adds 'dark' to <html>) ──────────────
  const { dark, toggleTheme } = useTheme()

  const [tab, setTab] = useState('Overview')

  return (
    // No dark wrapper div needed — Tailwind reads the class on <html> now
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-100 transition-colors duration-300">

      {/* ── HEADER ──────────────────────────────────────────────────────────── */}
      <header className="sticky top-0 z-40 bg-white/90 dark:bg-gray-900/90 backdrop-blur-md border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">

          {/* Logo + title */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-500 to-blue-600 flex items-center justify-center shadow-sm">
              <Globe size={16} className="text-white" />
            </div>
            <div>
              <div className="font-bold text-sm text-gray-900 dark:text-white leading-tight">Urban Population Dynamics</div>
              <div className="text-[11px] text-gray-400">Synergy Team · SDG 11 · Women Techsters 5.0</div>
            </div>
          </div>

          {/* Right side */}
          <div className="flex items-center gap-2">
            <span className="hidden sm:flex items-center gap-1.5 text-[11px] px-2.5 py-1 rounded-full border
              bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400
              border-indigo-100 dark:border-indigo-800">
              <Activity size={10} />
              235 Countries · 16 Indicators
            </span>

            {/* Dark mode toggle — works because useTheme touches <html> */}
            <button
              onClick={toggleTheme}
              aria-label="Toggle theme"
              className="p-2 rounded-xl border border-gray-200 dark:border-gray-700
                hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
              {dark
                ? <Sun  size={16} className="text-amber-400" />
                : <Moon size={16} className="text-gray-500"  />}
            </button>
          </div>
        </div>

        {/* Tab bar */}
        <div className="max-w-7xl mx-auto px-4 flex gap-0.5 overflow-x-auto scrollbar-hide">
          {TABS.map(t => (
            <button key={t} onClick={() => setTab(t)}
              className={`px-4 py-2.5 text-xs font-semibold whitespace-nowrap border-b-2 transition-all duration-200
                ${tab === t
                  ? 'border-indigo-500 text-indigo-600 dark:text-indigo-400'
                  : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'}`}>
              {t}
            </button>
          ))}
        </div>
      </header>

      {/* ── MAIN ─────────────────────────────────────────────────────────────── */}
      <main className="max-w-7xl mx-auto px-4 py-6 space-y-5">

        {/* ════════════════════════════════ TAB: OVERVIEW ════════════════════ */}
        {tab === 'Overview' && (
          <>
            {/* Hero */}
            <div className="rounded-2xl bg-gradient-to-r from-indigo-600 via-blue-600 to-cyan-500 p-6 text-white relative overflow-hidden">
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_rgba(255,255,255,0.12)_0%,_transparent_60%)]" />
              <div className="relative">
                <p className="text-[11px] font-semibold uppercase tracking-widest opacity-75 mb-2">
                  SDG 11 — Sustainable Cities & Communities
                </p>
                <h1 className="text-2xl sm:text-3xl font-bold mb-2 leading-tight">
                  Urban Population Dynamics<br className="hidden sm:block" /> & Sustainable Cities Analysis
                </h1>
                <p className="text-sm opacity-85 max-w-2xl leading-relaxed">
                  A data-driven analysis of 235 countries examining urbanisation trends, population
                  density, migration flows, and risk levels — generating actionable insights to support
                  sustainable city development aligned with SDG 11.
                </p>
                <div className="flex flex-wrap gap-2.5 mt-4 text-xs">
                  {[['235','Countries'],['16','Indicators'],['SDG 11','Aligned'],['Synergy Team','Women Techsters 5.0']].map(([n,l]) => (
                    <div key={l} className="bg-white/20 rounded-lg px-3 py-1.5">
                      <span className="font-bold">{n}</span> <span className="opacity-80">{l}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* KPI row */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
              <KpiCard icon={Globe}     label="Countries"       value={<AnimNum value={235} />}              sub="Full global coverage"   color="#6366f1" delay={0}   />
              <KpiCard icon={Activity}  label="Avg Pressure"    value={<AnimNum value={4.58} decimals={2} />} sub="Urban stress index"     color="#ef4444" delay={80}  />
              <KpiCard icon={Building2} label="Avg Urban Pop"   value={<><AnimNum value={59.23} decimals={1}/>%</>} sub="Live in urban areas" color="#06b6d4" delay={160} />
              <KpiCard icon={Map}       label="Avg Density/km²" value={<AnimNum value={475} />}               sub="People per sq km"       color="#8b5cf6" delay={240} />
              <KpiCard icon={TrendingUp}label="Avg Growth Rate" value={<><AnimNum value={1.1} decimals={1}/>%</>}  sub="Annual population"  color="#10b981" delay={320} />
              <KpiCard icon={Users}     label="Net Migration"   value={<AnimNum value={1263} />}              sub="Global net balance"     color="#f59e0b" delay={400} />
            </div>

            {/* Donuts */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card title="Risk Level Distribution" sub="Countries by urban pressure risk">
                <Donut data={RISK_DIST} colors={['#22c55e','#f59e0b','#ef4444']} />
                <div className="mt-3">
                  <Insight icon={AlertTriangle} color="#ef4444"
                    title="6 High-Risk Countries"
                    text="Dense city-states like Macao, Monaco, and Bahrain face extreme pressure with virtually zero room to expand." />
                </div>
              </Card>
              <Card title="Urbanisation Level" sub="Concentration of population in cities">
                <Donut data={URBAN_DIST} colors={['#6366f1','#06b6d4','#f97316']} />
                <div className="mt-3">
                  <Insight icon={Building2} color="#6366f1"
                    title="86 Moderately Urban"
                    text="The largest group — mid-transition nations balancing rural and urban populations. SDG 11 planning is most critical here." />
                </div>
              </Card>
              <Card title="Population Category" sub="Countries grouped by size">
                <Donut data={POP_CAT} colors={['#94a3b8','#6366f1','#ef4444']} />
                <div className="mt-3">
                  <Insight icon={Users} color="#6366f1"
                    title="14 High Population Nations"
                    text="China, India, Nigeria and 11 others drive the majority of global urban pressure and housing demand." />
                </div>
              </Card>
            </div>

            {/* Scatter + SDG insights */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <Card title="Fertility Rate vs Urban Population %" sub="Hover any dot to see country details · dot size = population">
                <ScatterPlot dark={dark} />
                <p className="mt-3 text-[11px] text-gray-400 leading-relaxed">
                  Key pattern: high-fertility countries (Africa, orange) cluster top-left with low urbanisation.
                  Highly urban nations (Japan, South Korea) sit bottom-right with near-replacement fertility.
                </p>
              </Card>
              <Card title="SDG 11 Key Insights" sub="What the data tells us about sustainable cities">
                <div className="space-y-2">
                  <Insight icon={AlertTriangle} color="#ef4444"
                    title="Rapid Growth in Low-Urban Countries"
                    text="Niger (3.84%), Uganda (3.32%), DR Congo (3.19%) grow fastest but have the weakest urban infrastructure — a critical SDG 11 challenge." />
                  <Insight icon={TrendingUp} color="#6366f1"
                    title="Asia's Deep Urban Transition"
                    text="Japan (92%), South Korea (82%), China (61%) are deeply urbanised. Japan is now declining at -0.3%/yr — a post-urban plateau." />
                  <Insight icon={Building2} color="#06b6d4"
                    title="City-States at Maximum Capacity"
                    text="Monaco (26,337/km²) and Macao (21,645/km²) have no room to expand. Sustainable development means vertical and smart-city solutions only." />
                  <Insight icon={Globe} color="#10b981"
                    title="Migration Reshaping Cities"
                    text="USA (+954K) and Germany (+544K) absorb the most migrants — directly pressuring housing, transport, and public services." />
                  <Insight icon={Users} color="#f59e0b"
                    title="Africa: The Urban Frontier"
                    text="Nigeria (52%, 2.58% growth) and Ethiopia (21%, 2.57% growth) will drive the next global urbanisation wave. Planning now is critical." />
                </div>
              </Card>
            </div>
          </>
        )}

        {/* ════════════════════════ TAB: PRESSURE & DENSITY ══════════════════ */}
        {tab === 'Pressure & Density' && (
          <>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <Card title="Top 10 — Population Pressure Index" sub="Higher score = greater urban stress relative to land area and growth rate">
                {TOP_PRESSURE.map(([c, v]) => (
                  <HBar key={c} label={c} value={v} max={310}
                    color={v > 100 ? '#ef4444' : v > 40 ? '#f59e0b' : '#6366f1'} />
                ))}
                <div className="mt-3 p-3 rounded-xl text-[11px] bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-800 text-red-700 dark:text-red-400">
                  <strong>Macao scores 300.87</strong> — over 65× the global average of 4.58. This tiny territory packs 21,645 people/km² with no capacity to grow outward.
                </div>
              </Card>
              <Card title="Top 10 — Population Density (per km²)" sub="People living per square kilometre of land area">
                {TOP_DENSITY.map(([c, v]) => (
                  <HBar key={c} label={c} value={v} max={27000}
                    color={v > 10000 ? '#ef4444' : v > 3000 ? '#f59e0b' : '#8b5cf6'} />
                ))}
                <div className="mt-3 p-3 rounded-xl text-[11px] bg-purple-50 dark:bg-purple-900/20 border border-purple-100 dark:border-purple-800 text-purple-700 dark:text-purple-400">
                  <strong>Monaco: 26,337/km²</strong> — the densest territory on Earth. The global average is just 57/km².
                </div>
              </Card>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <Card title="Top 10 Fastest Growing Countries" sub="Annual population growth rate (%) — 8 of 10 are in Africa">
                {TOP_GROWTH.map(([c, v]) => (
                  <HBar key={c} label={c} value={v} max={4.2} color="#10b981" suffix="%" />
                ))}
                <div className="mt-3 p-3 rounded-xl text-[11px] bg-green-50 dark:bg-green-900/20 border border-green-100 dark:border-green-800 text-green-700 dark:text-green-400">
                  <strong>8 of 10 fastest-growing countries are in Africa.</strong> Infrastructure investment today is critical to prevent tomorrow's urban crises.
                </div>
              </Card>
              <Card title="Pressure Index Guide — What Each Level Means for SDG 11">
                <div className="space-y-3">
                  {[
                    { range:'Index > 50', label:'Extreme Pressure', color:'#ef4444', desc:'City-states with zero expansion capacity. Only vertical growth and smart-city tech can help.' },
                    { range:'Index 10–50',label:'High Pressure',    color:'#f59e0b', desc:'Dense developing nations. High risk of slum formation, gridlocked transport, and overstretched utilities.' },
                    { range:'Index 1–10', label:'Moderate Pressure',color:'#6366f1', desc:'Average conditions. Proactive zoning and infrastructure planning can prevent escalation.' },
                    { range:'Index < 1',  label:'Low Pressure',     color:'#22c55e', desc:'Sparse countries with growth room. Main risk is unplanned urban sprawl.' },
                  ].map(s => (
                    <div key={s.range} className="flex gap-3 p-3 rounded-xl bg-gray-50 dark:bg-gray-900">
                      <div className="px-2 py-0.5 rounded-md text-[10px] font-bold text-white flex-shrink-0 h-fit mt-0.5" style={{ background: s.color }}>{s.range}</div>
                      <div>
                        <div className="text-xs font-semibold text-gray-700 dark:text-gray-300">{s.label}</div>
                        <div className="text-[11px] text-gray-400 dark:text-gray-500 mt-0.5 leading-relaxed">{s.desc}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          </>
        )}

        {/* ═══════════════════════════════ TAB: MIGRATION ════════════════════ */}
        {tab === 'Migration' && (
          <>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <Card title="Top 10 Migration Inflow Countries" sub="Net migrants received — adds direct urban pressure">
                {TOP_MIGRATION_IN.map(([c, v]) => (
                  <HBar key={c} label={c} value={v} max={1000000} color="#06b6d4" />
                ))}
                <div className="mt-3 p-3 rounded-xl text-[11px] bg-cyan-50 dark:bg-cyan-900/20 border border-cyan-100 dark:border-cyan-800 text-cyan-700 dark:text-cyan-400">
                  <strong>USA receives 954,806 net migrants</strong> — the most globally. This directly pressures New York, LA, Houston, and other major cities.
                </div>
              </Card>
              <Card title="Top 10 Migration Outflow Countries" sub="Net migrants departing — brain drain and urban decline risk">
                {TOP_MIGRATION_OUT.map(([c, v]) => (
                  <HBar key={c} label={c} value={v} max={700000} color="#f97316" />
                ))}
                <div className="mt-3 p-3 rounded-xl text-[11px] bg-orange-50 dark:bg-orange-900/20 border border-orange-100 dark:border-orange-800 text-orange-700 dark:text-orange-400">
                  <strong>Venezuela (−653K)</strong> reflects economic collapse. <strong>Syria (−427K)</strong> reflects conflict. Both represent humanitarian crises with severe urban consequences.
                </div>
              </Card>
            </div>
            <Card title="Migration & SDG 11 — Policy Implications" sub="How migration flows shape the sustainable cities challenge">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                <Insight icon={ArrowUpRight}   color="#06b6d4" title="Cities Under Inflow Pressure"    text="Rapid arrivals demand housing, schools, and transport at scale. Without planning, informal settlements grow and inequality rises — core SDG 11 threats." />
                <Insight icon={ArrowDownRight} color="#f97316" title="Urban Decline from Outflows"    text="Venezuela, India, China lose hundreds of thousands annually. Depopulation leaves cities with aging infrastructure and shrinking tax bases." />
                <Insight icon={Globe}          color="#8b5cf6" title="Global Migration Is Balanced"   text="Total global net migration is only +1,263. Migration redistributes people — it does not grow global urban population on its own." />
                <Insight icon={AlertTriangle}  color="#ef4444" title="Conflict-Driven Displacement"   text="Syria's −427K outflow is conflict-driven. Receiving cities — in Turkey, Jordan, Germany — all appear in the top inflow list as a direct result." />
                <Insight icon={TrendingUp}     color="#10b981" title="Economic Migration & Growth"    text="USA, Germany, and UK attract skilled workers, boosting urban economies. Side effect: rising housing costs can displace lower-income residents." />
                <Insight icon={Building2}      color="#f59e0b" title="Policy Implication for SDG 11" text="Cities need migration-aware master plans. SDG 11 requires inclusive, safe, resilient cities — integrating migrants from day one is essential." />
              </div>
            </Card>
          </>
        )}

        {/* ══════════════════════════════ TAB: POPULATION ════════════════════ */}
        {tab === 'Population' && (
          <>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <Card title="Top 10 Most Populous Countries" sub="These nations shape global urban trends">
                {TOP_POP.map(([c, v]) => (
                  <HBar key={c} label={c} value={v} max={1.5e9} color="#6366f1" />
                ))}
                <div className="mt-3 p-3 rounded-xl text-[11px] bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-100 dark:border-indigo-800 text-indigo-700 dark:text-indigo-400">
                  <strong>China (1.44B) and India (1.38B)</strong> together hold 36% of the world's population. India is projected to overtake China as most populous by 2027.
                </div>
              </Card>
              <Card title="Fertility Rate vs Urbanisation — Demographic Transition" sub="Hover dots to explore · dot size = population">
                <ScatterPlot dark={dark} />
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mt-4">
                  <Insight icon={TrendingUp} color="#f97316" title="Africa: High Fertility, Low Urban"  text="DR Congo (6.0), Angola (5.6), Nigeria (5.4) grow fast with low urban %. Infrastructure is being outpaced." />
                  <Insight icon={Building2}  color="#6366f1" title="Asia: Post-Transition"             text="Japan (1.4) and South Korea (1.1) are highly urban with very low fertility — ageing city populations ahead." />
                  <Insight icon={Globe}      color="#10b981" title="The Core Pattern"                  text="As countries urbanise, fertility drops. Investing in urban education and women's empowerment accelerates this shift." />
                </div>
              </Card>
            </div>
          </>
        )}

        {/* ══════════════════════════════ TAB: DATA TABLE ════════════════════ */}
        {tab === 'Data Table' && (
          <Card title="Country Data Table" sub="Top 15 countries by population — all key metrics in one view">
            <DataTable />
          </Card>
        )}

        {/* ── FOOTER ────────────────────────────────────────────────────────── */}
        <footer className="pt-4 border-t border-gray-200 dark:border-gray-700 flex flex-col sm:flex-row justify-between items-center gap-2 text-[11px] text-gray-400">
          <div>
            <span className="font-semibold text-gray-600 dark:text-gray-300">Synergy Team</span>
            {' '}· Women Techsters Bootcamp 5.0 · Category 1 · Demo Day: 25 March 2026
          </div>
          <span className="bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 px-2.5 py-1 rounded-full border border-purple-200 dark:border-purple-800">
            ✦ AI-assisted analysis via Claude (Anthropic)
          </span>
        </footer>
      </main>
    </div>
  )
}
