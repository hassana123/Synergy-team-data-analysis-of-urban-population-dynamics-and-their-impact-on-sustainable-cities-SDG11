// FullDataPreview.jsx — All 235 countries, full data preview tab
// Drop this component into your project alongside allCountriesData.js
// Usage: import FullDataPreview from './components/FullDataPreview'
//        Then add it as a new tab in App.jsx

import { useState, useMemo, useRef } from 'react'
import { ALL_COUNTRIES } from '../allCountriesData.js'
import {
  Search, Download, ChevronUp, ChevronDown, ChevronsUpDown,
  SlidersHorizontal, X, Filter, Globe, BarChart3, AlertTriangle,
  TrendingUp, Users, RefreshCcw,
} from 'lucide-react'

// ── Helpers ──────────────────────────────────────────────────────────────────
const fmtPop = (n) => n >= 1e9 ? (n / 1e9).toFixed(2) + 'B' : n >= 1e6 ? (n / 1e6).toFixed(1) + 'M' : n >= 1e3 ? (n / 1e3).toFixed(0) + 'K' : String(n)
const fmtNum = (n) => typeof n === 'number' ? n.toLocaleString() : n

const RISK_STYLE = {
  'High Risk':   'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300 border border-red-200 dark:border-red-700',
  'Medium Risk': 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300 border border-amber-200 dark:border-amber-700',
  'Low Risk':    'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-700',
}
const URBAN_STYLE = {
  'Highly Urban':    'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300',
  'Moderately Urban':'bg-cyan-100 text-cyan-700 dark:bg-cyan-900/40 dark:text-cyan-300',
  'Low Urban':       'bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300',
}

// pressure colour ramp
const pressureColor = (v) => {
  if (v > 50) return '#ef4444'
  if (v > 15) return '#f97316'
  if (v > 5)  return '#f59e0b'
  if (v > 0)  return '#6366f1'
  return '#94a3b8'
}

// mini inline bar
const MiniBar = ({ value, max, color }) => {
  const pct = Math.max(0, Math.min(100, (value / max) * 100))
  return (
    <div className="flex items-center gap-1.5">
      <div className="w-14 h-1.5 rounded-full bg-gray-100 dark:bg-gray-700 overflow-hidden flex-shrink-0">
        <div className="h-full rounded-full transition-all duration-300" style={{ width: pct + '%', background: color }} />
      </div>
      <span className="text-gray-600 dark:text-gray-400 tabular-nums">{value}%</span>
    </div>
  )
}

// ── Column definitions ────────────────────────────────────────────────────────
const COLS = [
  { key: 'country',        label: 'Country',      w: 'min-w-[140px]', sticky: true },
  { key: 'population',     label: 'Population',   w: 'min-w-[100px]' },
  { key: 'yearly_change',  label: 'Growth %',     w: 'min-w-[90px]'  },
  { key: 'density',        label: 'Density /km²', w: 'min-w-[100px]' },
  { key: 'urban_pct',      label: 'Urban %',      w: 'min-w-[120px]' },
  { key: 'fertility',      label: 'Fertility',    w: 'min-w-[80px]'  },
  { key: 'median_age',     label: 'Median Age',   w: 'min-w-[90px]'  },
  { key: 'migrants_net',   label: 'Net Migration',w: 'min-w-[110px]' },
  { key: 'pressure_index', label: 'Pressure Idx', w: 'min-w-[110px]' },
  { key: 'world_share',    label: 'World Share',  w: 'min-w-[100px]' },
  { key: 'risk',           label: 'Risk Level',   w: 'min-w-[110px]' },
  { key: 'urban_level',    label: 'Urban Level',  w: 'min-w-[130px]' },
  { key: 'pop_category',   label: 'Pop Category', w: 'min-w-[120px]' },
]

const PAGE_SIZES = [20, 50, 100, 235]

const RISK_OPTIONS    = ['All', 'High Risk', 'Medium Risk', 'Low Risk']
const URBAN_OPTIONS   = ['All', 'Highly Urban', 'Moderately Urban', 'Low Urban']
const POP_OPTIONS     = ['All', 'High Population', 'Medium Population', 'Low Population']

// ── CSV Export ────────────────────────────────────────────────────────────────
const exportCSV = (rows) => {
  const headers = ['Country','Population','Growth %','Density/km²','Urban %','Fertility','Median Age','Net Migration','Pressure Index','World Share %','Risk Level','Urban Level','Pop Category']
  const lines = [headers.join(','), ...rows.map(r =>
    [r.country, r.population, r.yearly_change, r.density, r.urban_pct, r.fertility, r.median_age, r.migrants_net, r.pressure_index, r.world_share, r.risk, r.urban_level, r.pop_category].join(',')
  )]
  const blob = new Blob([lines.join('\n')], { type: 'text/csv' })
  const url  = URL.createObjectURL(blob)
  const a    = document.createElement('a'); a.href = url; a.download = 'world_population_clean.csv'; a.click()
  URL.revokeObjectURL(url)
}

// ── Summary stat card ─────────────────────────────────────────────────────────
const StatPill = ({ icon: Icon, label, value, color }) => (
  <div className="flex items-center gap-2 px-3 py-2 rounded-xl border bg-white dark:bg-gray-800 border-gray-100 dark:border-gray-700 shadow-sm">
    <div className="p-1 rounded-lg" style={{ background: color + '18' }}>
      <Icon size={12} style={{ color }} />
    </div>
    <div>
      <div className="text-[10px] font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wide">{label}</div>
      <div className="text-xs font-bold text-gray-700 dark:text-gray-200 leading-tight">{value}</div>
    </div>
  </div>
)

// ── Filter chip ───────────────────────────────────────────────────────────────
const FilterSelect = ({ label, value, options, onChange }) => (
  <div className="flex flex-col gap-1">
    <span className="text-[10px] font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wide">{label}</span>
    <div className="flex flex-wrap gap-1">
      {options.map(o => (
        <button key={o} onClick={() => onChange(o === value ? 'All' : o)}
          className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold border transition-all duration-150
            ${value === o && o !== 'All'
              ? 'bg-indigo-500 text-white border-indigo-500 shadow-sm'
              : 'bg-gray-50 dark:bg-gray-800 text-gray-500 dark:text-gray-400 border-gray-200 dark:border-gray-700 hover:border-indigo-300 dark:hover:border-indigo-600'
            }`}>
          {o === 'All' ? '✕ All' : o}
        </button>
      ))}
    </div>
  </div>
)

// ── Main Component ────────────────────────────────────────────────────────────
export default function FullDataPreview() {
  const [search,      setSearch]      = useState('')
  const [sortCol,     setSortCol]     = useState('population')
  const [sortDir,     setSortDir]     = useState('desc')
  const [page,        setPage]        = useState(1)
  const [pageSize,    setPageSize]    = useState(20)
  const [riskFilter,  setRiskFilter]  = useState('All')
  const [urbanFilter, setUrbanFilter] = useState('All')
  const [popFilter,   setPopFilter]   = useState('All')
  const [showFilters, setShowFilters] = useState(false)
  const tableRef = useRef(null)

  const toggleSort = (col) => {
    if (sortCol === col) setSortDir(d => d === 'asc' ? 'desc' : 'asc')
    else { setSortCol(col); setSortDir('desc') }
    setPage(1)
  }

  const SortIcon = ({ col }) => {
    if (sortCol !== col) return <ChevronsUpDown size={10} className="text-gray-300 dark:text-gray-600 flex-shrink-0" />
    return sortDir === 'asc'
      ? <ChevronUp   size={10} className="text-indigo-500 flex-shrink-0" />
      : <ChevronDown size={10} className="text-indigo-500 flex-shrink-0" />
  }

  // filtered + sorted data
  const filtered = useMemo(() => {
    const q = search.toLowerCase()
    return [...ALL_COUNTRIES]
      .filter(r => r.country.toLowerCase().includes(q))
      .filter(r => riskFilter  === 'All' || r.risk         === riskFilter)
      .filter(r => urbanFilter === 'All' || r.urban_level  === urbanFilter)
      .filter(r => popFilter   === 'All' || r.pop_category === popFilter)
      .sort((a, b) => {
        const va = a[sortCol]; const vb = b[sortCol]
        const order = typeof va === 'string'
          ? va.localeCompare(vb)
          : (va > vb ? 1 : va < vb ? -1 : 0)
        return sortDir === 'asc' ? order : -order
      })
  }, [search, sortCol, sortDir, riskFilter, urbanFilter, popFilter])

  const totalPages  = Math.ceil(filtered.length / pageSize)
  const pageRows    = filtered.slice((page - 1) * pageSize, page * pageSize)
  const activeFilters = [riskFilter, urbanFilter, popFilter].filter(f => f !== 'All').length

  const resetAll = () => {
    setSearch(''); setRiskFilter('All'); setUrbanFilter('All')
    setPopFilter('All'); setPage(1); setSortCol('population'); setSortDir('desc')
  }

  // derive summary stats from filtered set
  const stats = useMemo(() => ({
    total:     filtered.length,
    highRisk:  filtered.filter(r => r.risk === 'High Risk').length,
    avgGrowth: (filtered.reduce((s, r) => s + r.yearly_change, 0) / filtered.length).toFixed(2),
    maxPressure: Math.max(...filtered.map(r => r.pressure_index)).toFixed(1),
  }), [filtered])

  return (
    <div className="space-y-4">

      {/* ── TOP BANNER ──────────────────────────────────────────────────────── */}
      <div className="rounded-2xl bg-gradient-to-r from-slate-800 via-indigo-900 to-slate-800 p-5 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10"
          style={{ backgroundImage: 'radial-gradient(circle at 20% 50%, #818cf8 0%, transparent 50%), radial-gradient(circle at 80% 20%, #06b6d4 0%, transparent 40%)' }} />
        <div className="relative flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-indigo-300 mb-1">Clean Dataset Preview</p>
            <h2 className="text-lg font-bold leading-tight">All 235 Countries · 16 Indicators</h2>
            <p className="text-xs text-gray-400 mt-1">Source: <span className="text-indigo-300 font-medium">Share_cleaned_data_set_world_population_by_country.xlsx</span> · Sheet: Clean_world_population</p>
          </div>
          <div className="flex flex-wrap gap-2 text-[11px]">
            {[['235','Countries'],['16','Indicators'],['1 Sheet','Cleaned']].map(([n, l]) => (
              <div key={l} className="bg-white/10 rounded-xl px-3 py-2 text-center backdrop-blur-sm">
                <div className="font-bold text-sm text-white">{n}</div>
                <div className="text-gray-300 text-[10px]">{l}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── STATS ROW ───────────────────────────────────────────────────────── */}
      <div className="flex flex-wrap gap-2">
        <StatPill icon={Globe}        label="Showing"        value={`${stats.total} countries`} color="#6366f1" />
        <StatPill icon={AlertTriangle}label="High Risk"      value={`${stats.highRisk} countries`} color="#ef4444" />
        <StatPill icon={TrendingUp}   label="Avg Growth"     value={`${stats.avgGrowth}%/yr`} color="#10b981" />
        <StatPill icon={BarChart3}    label="Max Pressure"   value={stats.maxPressure} color="#f59e0b" />
        <StatPill icon={Users}        label="Filtered Rows"  value={`${(page - 1) * pageSize + 1}–${Math.min(page * pageSize, filtered.length)} of ${filtered.length}`} color="#8b5cf6" />
      </div>

      {/* ── CONTROLS ────────────────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row gap-2 sm:items-center sm:justify-between">
        {/* Search */}
        <div className="relative flex-1 max-w-xs">
          <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            value={search} onChange={e => { setSearch(e.target.value); setPage(1) }}
            placeholder="Search any country…"
            className="w-full pl-8 pr-8 py-2 text-xs rounded-xl border
              border-gray-200 dark:border-gray-700
              bg-white dark:bg-gray-900
              text-gray-700 dark:text-gray-300
              placeholder-gray-400 dark:placeholder-gray-600
              focus:outline-none focus:ring-2 focus:ring-indigo-400 transition-all"
          />
          {search && (
            <button onClick={() => { setSearch(''); setPage(1) }}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors">
              <X size={12} />
            </button>
          )}
        </div>

        {/* Right-side controls */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Filter toggle */}
          <button onClick={() => setShowFilters(v => !v)}
            className={`flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-xl border transition-all
              ${showFilters
                ? 'bg-indigo-500 text-white border-indigo-500 shadow-sm'
                : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 border-gray-200 dark:border-gray-700 hover:border-indigo-300 dark:hover:border-indigo-600'
              }`}>
            <SlidersHorizontal size={12} />
            Filters
            {activeFilters > 0 && (
              <span className="ml-0.5 bg-white/30 text-white px-1.5 rounded-full text-[10px] font-bold">{activeFilters}</span>
            )}
          </button>

          {/* Reset */}
          {(search || activeFilters > 0) && (
            <button onClick={resetAll}
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-xl border
                bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 border-red-200 dark:border-red-800
                hover:bg-red-100 dark:hover:bg-red-900/40 transition-all">
              <RefreshCcw size={11} />
              Reset
            </button>
          )}

          {/* Page size */}
          <div className="flex items-center gap-1">
            <span className="text-[11px] text-gray-400 dark:text-gray-500 whitespace-nowrap">Rows:</span>
            <select value={pageSize} onChange={e => { setPageSize(+e.target.value); setPage(1) }}
              className="text-xs rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900
                text-gray-700 dark:text-gray-300 px-2 py-1.5 focus:outline-none focus:ring-2 focus:ring-indigo-400">
              {PAGE_SIZES.map(s => <option key={s} value={s}>{s === 235 ? 'All' : s}</option>)}
            </select>
          </div>

          {/* Export */}
          <button onClick={() => exportCSV(filtered)}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-xl border
              bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400
              border-emerald-200 dark:border-emerald-800
              hover:bg-emerald-100 dark:hover:bg-emerald-900/40 transition-all">
            <Download size={12} />
            Export CSV
          </button>
        </div>
      </div>

      {/* ── FILTER PANEL ────────────────────────────────────────────────────── */}
      {showFilters && (
        <div className="rounded-2xl border border-indigo-100 dark:border-indigo-900/50 bg-indigo-50/40 dark:bg-indigo-900/10 p-4">
          <div className="flex items-center gap-2 mb-3">
            <Filter size={12} className="text-indigo-500" />
            <span className="text-xs font-bold text-gray-700 dark:text-gray-300">Filter by Category</span>
            {activeFilters > 0 && (
              <span className="ml-auto text-[11px] text-gray-400">{filtered.length} results</span>
            )}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <FilterSelect label="Risk Level"   value={riskFilter}  options={RISK_OPTIONS}  onChange={v => { setRiskFilter(v);  setPage(1) }} />
            <FilterSelect label="Urban Level"  value={urbanFilter} options={URBAN_OPTIONS} onChange={v => { setUrbanFilter(v); setPage(1) }} />
            <FilterSelect label="Pop Category" value={popFilter}   options={POP_OPTIONS}   onChange={v => { setPopFilter(v);   setPage(1) }} />
          </div>
        </div>
      )}

      {/* ── TABLE ───────────────────────────────────────────────────────────── */}
      <div ref={tableRef} className="rounded-2xl border border-gray-100 dark:border-gray-700 overflow-auto shadow-sm">
        <table className="w-full text-xs" style={{ minWidth: '1200px' }}>

          {/* thead */}
          <thead className="sticky top-0 z-20">
            <tr className="bg-gray-50/95 dark:bg-gray-900/95 backdrop-blur-sm border-b border-gray-200 dark:border-gray-700">
              {COLS.map(({ key, label, w, sticky }) => (
                <th key={key}
                  onClick={() => toggleSort(key)}
                  className={`px-3 py-3 text-left font-semibold text-gray-500 dark:text-gray-400 cursor-pointer
                    select-none whitespace-nowrap hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors ${w}
                    ${sticky ? 'sticky left-0 bg-gray-50/95 dark:bg-gray-900/95 backdrop-blur-sm z-10 border-r border-gray-100 dark:border-gray-800' : ''}`}>
                  <div className="flex items-center gap-1">
                    {label}
                    <SortIcon col={key} />
                  </div>
                </th>
              ))}
            </tr>
          </thead>

          {/* tbody */}
          <tbody>
            {pageRows.length === 0 && (
              <tr>
                <td colSpan={COLS.length} className="px-4 py-12 text-center text-gray-400 dark:text-gray-500 text-sm">
                  No countries match your search or filters.
                </td>
              </tr>
            )}
            {pageRows.map((r, i) => (
              <tr key={r.country}
                className={`border-b border-gray-50 dark:border-gray-800/60 transition-colors
                  hover:bg-indigo-50/50 dark:hover:bg-indigo-900/10
                  ${i % 2 === 1 ? 'bg-gray-50/30 dark:bg-gray-900/20' : ''}`}>

                {/* Country — sticky */}
                <td className="px-3 py-2.5 sticky left-0 bg-inherit border-r border-gray-100 dark:border-gray-800 z-10">
                  <span className="font-semibold text-gray-800 dark:text-gray-100 whitespace-nowrap">{r.country}</span>
                </td>

                {/* Population */}
                <td className="px-3 py-2.5">
                  <span className="font-mono text-gray-700 dark:text-gray-300 font-semibold">{fmtPop(r.population)}</span>
                </td>

                {/* Growth % — colour-coded */}
                <td className="px-3 py-2.5">
                  <span className={`font-semibold tabular-nums ${
                    r.yearly_change < 0 ? 'text-red-500 dark:text-red-400' :
                    r.yearly_change > 3 ? 'text-orange-500 dark:text-orange-400' :
                    r.yearly_change > 1.5 ? 'text-amber-600 dark:text-amber-400' :
                    'text-emerald-600 dark:text-emerald-400'
                  }`}>
                    {r.yearly_change > 0 ? '+' : ''}{r.yearly_change}%
                  </span>
                </td>

                {/* Density */}
                <td className="px-3 py-2.5">
                  <span className={`tabular-nums font-mono ${r.density > 5000 ? 'text-red-600 dark:text-red-400 font-bold' : r.density > 1000 ? 'text-orange-600 dark:text-orange-400' : 'text-gray-600 dark:text-gray-400'}`}>
                    {fmtNum(r.density)}
                  </span>
                </td>

                {/* Urban % — mini bar */}
                <td className="px-3 py-2.5">
                  {r.urban_pct > 0
                    ? <MiniBar value={r.urban_pct} max={100} color={r.urban_pct > 75 ? '#6366f1' : r.urban_pct > 50 ? '#06b6d4' : '#f97316'} />
                    : <span className="text-gray-300 dark:text-gray-600 text-[10px]">n/a</span>
                  }
                </td>

                {/* Fertility */}
                <td className="px-3 py-2.5">
                  {r.fertility > 0
                    ? <span className={`tabular-nums font-semibold ${r.fertility > 5 ? 'text-red-500' : r.fertility > 3 ? 'text-orange-500' : r.fertility < 1.5 ? 'text-indigo-500' : 'text-gray-600 dark:text-gray-400'}`}>{r.fertility}</span>
                    : <span className="text-gray-300 dark:text-gray-600 text-[10px]">—</span>
                  }
                </td>

                {/* Median Age */}
                <td className="px-3 py-2.5 text-gray-600 dark:text-gray-400 tabular-nums">
                  {r.median_age > 0 ? r.median_age : <span className="text-gray-300 dark:text-gray-600 text-[10px]">—</span>}
                </td>

                {/* Net Migration — colour + sign */}
                <td className="px-3 py-2.5">
                  <span className={`font-semibold tabular-nums text-[11px] ${r.migrants_net > 0 ? 'text-cyan-600 dark:text-cyan-400' : r.migrants_net < 0 ? 'text-rose-500 dark:text-rose-400' : 'text-gray-400'}`}>
                    {r.migrants_net > 0 ? '+' : ''}{fmtNum(r.migrants_net)}
                  </span>
                </td>

                {/* Pressure Index — coloured badge */}
                <td className="px-3 py-2.5">
                  <span className="inline-flex items-center px-2 py-0.5 rounded-lg text-[11px] font-bold text-white"
                    style={{ background: pressureColor(r.pressure_index) }}>
                    {r.pressure_index > 0 ? r.pressure_index.toFixed(1) : r.pressure_index.toFixed(2)}
                  </span>
                </td>

                {/* World Share */}
                <td className="px-3 py-2.5 tabular-nums text-gray-500 dark:text-gray-400 text-[11px]">
                  {r.world_share > 0 ? r.world_share.toFixed(2) + '%' : '<0.01%'}
                </td>

                {/* Risk Badge */}
                <td className="px-3 py-2.5">
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold whitespace-nowrap ${RISK_STYLE[r.risk] || 'bg-gray-100 text-gray-500'}`}>
                    {r.risk}
                  </span>
                </td>

                {/* Urban Level */}
                <td className="px-3 py-2.5">
                  <span className={`px-2 py-0.5 rounded-lg text-[10px] font-semibold whitespace-nowrap ${URBAN_STYLE[r.urban_level] || 'bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400'}`}>
                    {r.urban_level}
                  </span>
                </td>

                {/* Pop Category */}
                <td className="px-3 py-2.5">
                  <span className={`text-[11px] font-semibold whitespace-nowrap ${
                    r.pop_category === 'High Population'   ? 'text-red-600 dark:text-red-400' :
                    r.pop_category === 'Medium Population' ? 'text-indigo-600 dark:text-indigo-400' :
                    'text-gray-500 dark:text-gray-400'
                  }`}>{r.pop_category}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ── PAGINATION ──────────────────────────────────────────────────────── */}
      {totalPages > 1 && (
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pt-1">
          <p className="text-[11px] text-gray-400 dark:text-gray-500">
            Showing <span className="font-semibold text-gray-600 dark:text-gray-400">{(page - 1) * pageSize + 1}–{Math.min(page * pageSize, filtered.length)}</span> of{' '}
            <span className="font-semibold text-gray-600 dark:text-gray-400">{filtered.length}</span> countries
          </p>
          <div className="flex items-center gap-1 flex-wrap">
            <button disabled={page === 1} onClick={() => setPage(1)}
              className="px-2.5 py-1.5 text-[11px] font-semibold rounded-lg border border-gray-200 dark:border-gray-700
                text-gray-500 dark:text-gray-400 disabled:opacity-40 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
              ««
            </button>
            <button disabled={page === 1} onClick={() => setPage(p => p - 1)}
              className="px-2.5 py-1.5 text-[11px] font-semibold rounded-lg border border-gray-200 dark:border-gray-700
                text-gray-500 dark:text-gray-400 disabled:opacity-40 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
              ‹ Prev
            </button>

            {/* Page number pills */}
            {Array.from({ length: totalPages }, (_, i) => i + 1)
              .filter(p => p === 1 || p === totalPages || Math.abs(p - page) <= 2)
              .reduce((acc, p, idx, arr) => {
                if (idx > 0 && arr[idx - 1] !== p - 1) acc.push('…')
                acc.push(p); return acc
              }, [])
              .map((p, idx) => p === '…'
                ? <span key={`ellipsis-${idx}`} className="px-1 text-gray-400 text-[11px]">…</span>
                : (
                  <button key={p} onClick={() => setPage(p)}
                    className={`w-8 h-7 text-[11px] font-bold rounded-lg border transition-all
                      ${page === p
                        ? 'bg-indigo-500 text-white border-indigo-500 shadow-sm'
                        : 'border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800'
                      }`}>
                    {p}
                  </button>
                )
              )
            }

            <button disabled={page === totalPages} onClick={() => setPage(p => p + 1)}
              className="px-2.5 py-1.5 text-[11px] font-semibold rounded-lg border border-gray-200 dark:border-gray-700
                text-gray-500 dark:text-gray-400 disabled:opacity-40 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
              Next ›
            </button>
            <button disabled={page === totalPages} onClick={() => setPage(totalPages)}
              className="px-2.5 py-1.5 text-[11px] font-semibold rounded-lg border border-gray-200 dark:border-gray-700
                text-gray-500 dark:text-gray-400 disabled:opacity-40 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
              »»
            </button>
          </div>
        </div>
      )}

      {/* ── COLUMN LEGEND ───────────────────────────────────────────────────── */}
      <div className="rounded-2xl border border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-900/30 p-4">
        <p className="text-[11px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-3">Column Guide</p>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 text-[11px]">
          {[
            ['Growth %',       'Annual population growth rate'],
            ['Density /km²',   'People per square kilometre'],
            ['Urban %',        'Share living in urban areas'],
            ['Fertility',      'Average births per woman'],
            ['Median Age',     'Middle age of the population'],
            ['Net Migration',  '+in  /  −out (per year)'],
            ['Pressure Index', 'Urban stress score (higher = worse)'],
            ['World Share',    '% of total global population'],
          ].map(([col, desc]) => (
            <div key={col} className="flex gap-2">
              <span className="font-bold text-gray-700 dark:text-gray-300 whitespace-nowrap">{col}:</span>
              <span className="text-gray-400 dark:text-gray-500">{desc}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}