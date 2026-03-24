// ScatterPlot.jsx — Population vs Fertility Rate (matches Power BI dashboard)
// Y axis: Population · X axis: Fertility Rate · Dot colour = region

import { useState } from 'react'
import { SCATTER_DATA } from '../data.js'

const W = 340
const H = 220
const PAD_L = 48   // left (Y-axis labels)
const PAD_R = 18
const PAD_T = 16
const PAD_B = 38   // bottom (X-axis labels)

const POP_MAX = 1.44e9  // China ~1.44B

// Map fertility (0.5–7) → x pixel
const toX = (f) =>
  PAD_L + ((f - 0.5) / 6.5) * (W - PAD_L - PAD_R)

// Map population (0–1.5B) → y pixel  (high pop = top)
const toY = (pop) =>
  PAD_T + (1 - pop / 1.5e9) * (H - PAD_T - PAD_B)

// Region colour
const regionColor = (c) => {
  const africa = [
    "Nigeria","Ethiopia","Tanzania","Uganda","Angola","DR Congo",
    "Kenya","Mozambique","Sudan","South Africa","Ghana","Somalia",
    "Niger","Mali","Burkina Faso","Senegal","Rwanda","Guinea",
  ]
  const asia = [
    "China","India","Indonesia","Pakistan","Bangladesh","Japan",
    "Vietnam","Philippines","Iran","South Korea","Turkey","Myanmar",
    "Thailand","Malaysia","Uzbekistan","Saudi Arabia","Iraq","Afghanistan",
  ]
  if (africa.includes(c)) return "#f97316"   // orange
  if (asia.includes(c))   return "#6366f1"   // indigo
  return "#06b6d4"                           // cyan
}

// Y-axis tick labels (billions / millions)
const fmtPop = (n) =>
  n >= 1e9 ? (n / 1e9).toFixed(1) + 'B' :
  n >= 1e6 ? (n / 1e6).toFixed(0) + 'M' : String(n)

const Y_TICKS = [0, 0.5e9, 1.0e9, 1.5e9]
const X_TICKS = [1, 2, 3, 4, 5, 6]

export default function ScatterPlot({ dark }) {
  const [tip, setTip] = useState(null)

  const gridColor  = dark ? '#374151' : '#e5e7eb'
  const labelColor = dark ? '#6b7280' : '#9ca3af'
  const axisColor  = dark ? '#4b5563' : '#d1d5db'

  return (
    <div className="relative select-none">
      <svg
        width="100%"
        viewBox={`0 0 ${W} ${H}`}
        className="overflow-visible"
      >
        {/* ── Grid lines ─────────────────────────────────────────────────── */}
        {Y_TICKS.map(pop => (
          <g key={pop}>
            <line
              x1={PAD_L} y1={toY(pop)}
              x2={W - PAD_R} y2={toY(pop)}
              stroke={gridColor} strokeWidth="0.5" strokeDasharray="3,3"
            />
            <text
              x={PAD_L - 5} y={toY(pop) + 3.5}
              fontSize="7" fill={labelColor} textAnchor="end"
            >
              {fmtPop(pop)}
            </text>
          </g>
        ))}

        {X_TICKS.map(f => (
          <g key={f}>
            <line
              x1={toX(f)} y1={PAD_T}
              x2={toX(f)} y2={H - PAD_B}
              stroke={gridColor} strokeWidth="0.5" strokeDasharray="3,3"
            />
            <text
              x={toX(f)} y={H - PAD_B + 11}
              fontSize="7" fill={labelColor} textAnchor="middle"
            >
              {f}
            </text>
          </g>
        ))}

        {/* ── Axes ───────────────────────────────────────────────────────── */}
        <line
          x1={PAD_L} y1={PAD_T} x2={PAD_L} y2={H - PAD_B}
          stroke={axisColor} strokeWidth="0.8"
        />
        <line
          x1={PAD_L} y1={H - PAD_B} x2={W - PAD_R} y2={H - PAD_B}
          stroke={axisColor} strokeWidth="0.8"
        />

        {/* ── Axis labels ────────────────────────────────────────────────── */}
        <text
          x={PAD_L + (W - PAD_L - PAD_R) / 2}
          y={H - 3}
          fontSize="8" fill={labelColor} textAnchor="middle"
        >
          Sum of Fertility Rate
        </text>
        <text
          x={11} y={PAD_T + (H - PAD_T - PAD_B) / 2}
          fontSize="8" fill={labelColor} textAnchor="middle"
          transform={`rotate(-90, 11, ${PAD_T + (H - PAD_T - PAD_B) / 2})`}
        >
          Sum of Population
        </text>

        {/* ── Dots ───────────────────────────────────────────────────────── */}
        {SCATTER_DATA.map((d, i) => {
          const r   = 3 + (d.pop / POP_MAX) * 10
          const col = regionColor(d.country)
          const cx  = toX(d.fertility)
          const cy  = toY(d.pop)

          return (
            <circle
              key={i}
              cx={cx} cy={cy} r={r}
              fill={col} fillOpacity="0.72"
              stroke={col} strokeWidth="0.8"
              className="cursor-pointer transition-all duration-150 hover:fill-opacity-100"
              onMouseEnter={e => setTip({
                country:   d.country,
                fertility: d.fertility,
                pop:       d.pop,
                urban:     d.urban,
                mx: e.clientX,
                my: e.clientY,
              })}
              onMouseLeave={() => setTip(null)}
            />
          )
        })}
      </svg>

      {/* ── Tooltip ──────────────────────────────────────────────────────── */}
      {tip && (
        <div
          className="fixed z-50 pointer-events-none rounded-xl border px-3 py-2 text-xs shadow-xl
            bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-600"
          style={{ left: tip.mx + 14, top: tip.my - 56 }}
        >
          <div className="font-bold text-gray-800 dark:text-gray-100 mb-0.5">
            {tip.country}
          </div>
          <div className="text-gray-500 dark:text-gray-400 space-y-0.5">
            <div>Fertility: <span className="font-semibold text-gray-700 dark:text-gray-200">{tip.fertility}</span></div>
            <div>Population: <span className="font-semibold text-gray-700 dark:text-gray-200">
              {tip.pop >= 1e9 ? (tip.pop / 1e9).toFixed(2) + 'B' : (tip.pop / 1e6).toFixed(1) + 'M'}
            </span></div>
            <div>Urban: <span className="font-semibold text-gray-700 dark:text-gray-200">{tip.urban}%</span></div>
          </div>
        </div>
      )}

      {/* ── Legend ───────────────────────────────────────────────────────── */}
      <div className="flex flex-wrap gap-3 mt-2 text-[11px]">
        {[
          ["Africa",  "#f97316"],
          ["Asia",    "#6366f1"],
          ["Other",   "#06b6d4"],
        ].map(([label, color]) => (
          <div key={label} className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full" style={{ background: color }} />
            <span className="text-gray-400 dark:text-gray-500">{label}</span>
          </div>
        ))}
        <span className="text-gray-300 dark:text-gray-600">· Dot size = population</span>
      </div>
    </div>
  )
}