// ui.jsx  —  Shared reusable UI components
import { useState, useEffect } from 'react'

// ── Format helpers ────────────────────────────────────────────────────────────
export const fmt    = (n) => n >= 1e9 ? (n/1e9).toFixed(2)+'B' : n >= 1e6 ? (n/1e6).toFixed(1)+'M' : n >= 1e3 ? (n/1e3).toFixed(0)+'K' : String(n)
export const fmtPop = (n) => n >= 1e9 ? (n/1e9).toFixed(2)+'B' : (n/1e6).toFixed(0)+'M'
const clamp = (v, mn, mx) => Math.max(mn, Math.min(mx, v))

// ── Animated number counter ───────────────────────────────────────────────────
export function AnimNum({ value, decimals = 0 }) {
  const [display, setDisplay] = useState(0)
  useEffect(() => {
    let start
    const end = parseFloat(value)
    const step = (ts) => {
      if (!start) start = ts
      const p = Math.min((ts - start) / 1400, 1)
      const ease = 1 - Math.pow(1 - p, 3)
      setDisplay(parseFloat((ease * end).toFixed(decimals)))
      if (p < 1) requestAnimationFrame(step)
      else setDisplay(end)
    }
    requestAnimationFrame(step)
  }, [value, decimals])
  return <>{display.toLocaleString(undefined, { minimumFractionDigits: decimals, maximumFractionDigits: decimals })}</>
}

// ── Horizontal animated progress bar ─────────────────────────────────────────
export function HBar({ label, value, max, color, suffix = '' }) {
  const [w, setW] = useState(0)
  useEffect(() => { const t = setTimeout(() => setW(clamp((value / max) * 100, 0, 100)), 150); return () => clearTimeout(t) }, [value, max])
  return (
    <div className="mb-2.5">
      <div className="flex justify-between text-xs mb-1">
        <span className="truncate max-w-[148px] text-gray-600 dark:text-gray-300">{label}</span>
        <span className="font-semibold ml-2 whitespace-nowrap text-gray-700 dark:text-gray-200">
          {value > 999 ? fmt(value) : value}{suffix}
        </span>
      </div>
      <div className="h-2 rounded-full bg-gray-100 dark:bg-gray-700 overflow-hidden">
        <div className="h-full rounded-full transition-all duration-1000 ease-out" style={{ width: w + '%', background: color }} />
      </div>
    </div>
  )
}

// ── Donut chart (pure SVG) ────────────────────────────────────────────────────
export function Donut({ data, colors, size = 120 }) {
  const total = Object.values(data).reduce((a, b) => a + b, 0)
  let cum = 0
  const r = 40; const cx = 60; const cy = 60
  const segs = Object.entries(data).map(([label, val], i) => {
    const pct = val / total
    const sa = cum * 2 * Math.PI - Math.PI / 2
    cum += pct
    const ea = cum * 2 * Math.PI - Math.PI / 2
    const x1 = cx + r * Math.cos(sa); const y1 = cy + r * Math.sin(sa)
    const x2 = cx + r * Math.cos(ea); const y2 = cy + r * Math.sin(ea)
    return { label, val, pct, path: `M${cx} ${cy} L${x1} ${y1} A${r} ${r} 0 ${pct > 0.5 ? 1 : 0} 1 ${x2} ${y2}Z`, color: colors[i] }
  })
  return (
    <div className="flex items-center gap-5 flex-wrap">
      <svg width={size} height={size} viewBox="0 0 120 120" className="flex-shrink-0">
        {segs.map((s, i) => <path key={i} d={s.path} fill={s.color} className="hover:opacity-90 transition-opacity cursor-default" />)}
        <circle cx="60" cy="60" r="26" className="fill-white dark:fill-gray-800" />
        <text x="60" y="63" textAnchor="middle" fontSize="9" fontWeight="700" className="fill-gray-600 dark:fill-gray-300">{total}</text>
      </svg>
      <div className="flex flex-col gap-1.5 text-xs">
        {segs.map((s, i) => (
          <div key={i} className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-sm flex-shrink-0" style={{ background: s.color }} />
            <span className="text-gray-500 dark:text-gray-400">{s.label}</span>
            <span className="font-semibold text-gray-700 dark:text-gray-200 ml-0.5">{s.val}</span>
            <span className="text-gray-400">({(s.pct * 100).toFixed(1)}%)</span>
          </div>
        ))}
      </div>
    </div>
  )
}

// ── KPI card ─────────────────────────────────────────────────────────────────
export function KpiCard({ icon: Icon, label, value, sub, color, delay = 0 }) {
  const [visible, setVisible] = useState(false)
  useEffect(() => { const t = setTimeout(() => setVisible(true), delay); return () => clearTimeout(t) }, [delay])
  return (
    <div className={`rounded-2xl p-4 border transition-all duration-500
      bg-white dark:bg-gray-800 border-gray-100 dark:border-gray-700 shadow-sm
      hover:shadow-md hover:-translate-y-0.5
      ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3'}`}>
      <div className="p-2 rounded-xl w-fit mb-3" style={{ background: color + '18' }}>
        <Icon size={17} style={{ color }} />
      </div>
      <div className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-0.5 leading-none">{value}</div>
      <div className="text-[10px] font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-widest mt-1">{label}</div>
      {sub && <div className="text-[11px] text-gray-400 dark:text-gray-500 mt-1">{sub}</div>}
    </div>
  )
}

// ── Section card ──────────────────────────────────────────────────────────────
export function Card({ title, sub, children, className = '' }) {
  return (
    <div className={`bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm p-5 ${className}`}>
      <div className="mb-4">
        <h3 className="font-bold text-gray-800 dark:text-gray-100 text-sm leading-tight">{title}</h3>
        {sub && <p className="text-[11px] text-gray-400 dark:text-gray-500 mt-1">{sub}</p>}
      </div>
      {children}
    </div>
  )
}

// ── Insight pill ──────────────────────────────────────────────────────────────
export function Insight({ icon: Icon, color, title, text }) {
  return (
    <div className="flex gap-3 p-3 rounded-xl border border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/60">
      <div className="p-1.5 rounded-lg flex-shrink-0 mt-0.5" style={{ background: color + '1a' }}>
        <Icon size={13} style={{ color }} />
      </div>
      <div>
        <div className="text-[11px] font-semibold text-gray-700 dark:text-gray-300 mb-0.5">{title}</div>
        <div className="text-[11px] text-gray-500 dark:text-gray-400 leading-relaxed">{text}</div>
      </div>
    </div>
  )
}

// ── Risk badge ────────────────────────────────────────────────────────────────
export function RiskBadge({ risk }) {
  const cls = risk === 'High Risk'
    ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
    : risk === 'Medium Risk'
    ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'
    : 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
  return <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${cls}`}>{risk}</span>
}
