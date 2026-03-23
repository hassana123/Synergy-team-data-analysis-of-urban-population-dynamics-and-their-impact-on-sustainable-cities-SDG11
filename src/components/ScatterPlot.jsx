import { useState } from 'react'
import { SCATTER_DATA } from '../data.js'

const W = 340; const H = 210; const PAD = 38
const toX = (v) => PAD + ((v - 1) / 5.5) * (W - PAD * 2)
const toY = (v) => H - PAD - ((v / 100)) * (H - PAD * 2)
const POP_MAX = 1.44e9

const regionColor = (c) => {
  const africa = ["Nigeria","Ethiopia","Tanzania","Uganda","Angola","DR Congo","Ghana","Mozambique","Sudan","South Africa"]
  const asia   = ["China","India","Indonesia","Pakistan","Bangladesh","Japan","Vietnam","Philippines","Iran","South Korea"]
  if (africa.includes(c)) return "#f97316"
  if (asia.includes(c))   return "#6366f1"
  return "#06b6d4"
}

export default function ScatterPlot({ dark }) {
  const [tip, setTip] = useState(null)

  const gridColor  = dark ? '#374151' : '#e5e7eb'
  const labelColor = dark ? '#6b7280' : '#9ca3af'

  return (
    <div className="relative">
      <svg width="100%" viewBox={`0 0 ${W} ${H}`} className="overflow-visible">
        {/* Grid lines */}
        {[20,40,60,80].map(y => (
          <g key={y}>
            <line x1={PAD} y1={toY(y)} x2={W-PAD} y2={toY(y)} stroke={gridColor} strokeWidth="0.5" />
            <text x={PAD-5} y={toY(y)+3} fontSize="7" fill={labelColor} textAnchor="end">{y}%</text>
          </g>
        ))}
        {[2,3,4,5,6].map(x => (
          <g key={x}>
            <line x1={toX(x)} y1={PAD} x2={toX(x)} y2={H-PAD} stroke={gridColor} strokeWidth="0.5" />
            <text x={toX(x)} y={H-PAD+10} fontSize="7" fill={labelColor} textAnchor="middle">{x}</text>
          </g>
        ))}
        {/* Axis labels */}
        <text x={W/2} y={H-1} fontSize="8" fill={labelColor} textAnchor="middle">Fertility Rate</text>
        <text x={11} y={H/2} fontSize="8" fill={labelColor} textAnchor="middle" transform={`rotate(-90,11,${H/2})`}>Urban %</text>

        {/* Dots */}
        {SCATTER_DATA.map((d, i) => {
          const r = 3 + (d.pop / POP_MAX) * 11
          const col = regionColor(d.country)
          return (
            <circle key={i}
              cx={toX(d.fertility)} cy={toY(d.urban)} r={r}
              fill={col} fillOpacity="0.72" stroke={col} strokeWidth="0.8"
              className="cursor-pointer transition-all duration-150 hover:fill-opacity-100"
              onMouseEnter={e => setTip({ ...d, mx: e.clientX, my: e.clientY })}
              onMouseLeave={() => setTip(null)}
            />
          )
        })}
      </svg>

      {/* Tooltip */}
      {tip && (
        <div className="fixed z-50 pointer-events-none rounded-xl border px-3 py-2 text-xs shadow-xl
          bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-600"
          style={{ left: tip.mx + 14, top: tip.my - 44 }}>
          <div className="font-bold text-gray-800 dark:text-gray-100">{tip.country}</div>
          <div className="text-gray-500 dark:text-gray-400">Fertility: {tip.fertility} · Urban: {tip.urban}%</div>
        </div>
      )}

      {/* Legend */}
      <div className="flex flex-wrap gap-3 mt-2 text-[11px]">
        {[["Africa","#f97316"],["Asia","#6366f1"],["Other","#06b6d4"]].map(([l,c]) => (
          <div key={l} className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full" style={{ background: c }} />
            <span className="text-gray-400 dark:text-gray-500">{l}</span>
          </div>
        ))}
        <span className="text-gray-300 dark:text-gray-600">· Dot size = population</span>
      </div>
    </div>
  )
}
