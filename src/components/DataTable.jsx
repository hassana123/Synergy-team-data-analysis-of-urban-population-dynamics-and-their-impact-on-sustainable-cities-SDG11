import { useState } from 'react'
import { ChevronUp, ChevronDown } from 'lucide-react'
import { TABLE_DATA } from '../data.js'
import { fmtPop, RiskBadge } from './ui.jsx'

const COLS = [
  { key: 'country',    label: 'Country'      },
  { key: 'population', label: 'Population'   },
  { key: 'growth',     label: 'Growth %'     },
  { key: 'density',    label: 'Density/km²'  },
  { key: 'urban',      label: 'Urban %'      },
  { key: 'pressure',   label: 'Pressure'     },
  { key: 'risk',       label: 'Risk'         },
  { key: 'level',      label: 'Urban Level'  },
]

export default function DataTable() {
  const [sortCol, setSortCol] = useState('population')
  const [sortDir, setSortDir] = useState('desc')
  const [search, setSearch]   = useState('')

  const toggleSort = (col) => {
    if (sortCol === col) setSortDir(d => d === 'asc' ? 'desc' : 'asc')
    else { setSortCol(col); setSortDir('desc') }
  }

  const rows = [...TABLE_DATA]
    .filter(r => r.country.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => {
      const va = a[sortCol]; const vb = b[sortCol]
      return sortDir === 'asc' ? (va > vb ? 1 : -1) : (va < vb ? 1 : -1)
    })

  return (
    <div>
      {/* Search */}
      <input
        value={search} onChange={e => setSearch(e.target.value)}
        placeholder="Search countries…"
        className="mb-4 w-full sm:w-64 px-3 py-2 text-xs rounded-xl border
          border-gray-200 dark:border-gray-700
          bg-white dark:bg-gray-900
          text-gray-700 dark:text-gray-300
          placeholder-gray-400 dark:placeholder-gray-600
          focus:outline-none focus:ring-2 focus:ring-indigo-400"
      />

      <div className="overflow-x-auto rounded-xl border border-gray-100 dark:border-gray-700 scrollbar-thin">
        <table className="w-full text-xs min-w-[700px]">
          <thead>
            <tr className="bg-gray-50 dark:bg-gray-900 border-b border-gray-100 dark:border-gray-700">
              {COLS.map(({ key, label }) => (
                <th key={key} onClick={() => toggleSort(key)}
                  className="px-3 py-2.5 text-left font-semibold text-gray-500 dark:text-gray-400
                    cursor-pointer whitespace-nowrap select-none
                    hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                  <div className="flex items-center gap-1">
                    {label}
                    {sortCol === key
                      ? (sortDir === 'asc' ? <ChevronUp size={10} /> : <ChevronDown size={10} />)
                      : <span className="w-2.5 inline-block" />}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((r, i) => (
              <tr key={r.country}
                className={`border-b border-gray-50 dark:border-gray-800 transition-colors
                  hover:bg-indigo-50/40 dark:hover:bg-indigo-900/10
                  ${i % 2 === 1 ? 'bg-gray-50/40 dark:bg-gray-900/30' : ''}`}>
                <td className="px-3 py-2.5 font-semibold text-gray-800 dark:text-gray-200 whitespace-nowrap">{r.country}</td>
                <td className="px-3 py-2.5 text-gray-600 dark:text-gray-400">{fmtPop(r.population)}</td>
                <td className="px-3 py-2.5 font-semibold">
                  <span className={r.growth < 0 ? 'text-red-500' : r.growth > 2 ? 'text-orange-500' : 'text-green-600 dark:text-green-400'}>
                    {r.growth > 0 ? '+' : ''}{r.growth}%
                  </span>
                </td>
                <td className="px-3 py-2.5 text-gray-600 dark:text-gray-400">{r.density.toLocaleString()}</td>
                <td className="px-3 py-2.5">
                  <div className="flex items-center gap-2">
                    <div className="w-12 h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                      <div className="h-full bg-indigo-500 rounded-full" style={{ width: r.urban + '%' }} />
                    </div>
                    <span className="text-gray-600 dark:text-gray-400">{r.urban}%</span>
                  </div>
                </td>
                <td className="px-3 py-2.5 font-mono text-gray-600 dark:text-gray-400">{r.pressure}</td>
                <td className="px-3 py-2.5"><RiskBadge risk={r.risk} /></td>
                <td className="px-3 py-2.5 text-gray-500 dark:text-gray-400 whitespace-nowrap">{r.level}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="mt-2 text-[11px] text-gray-400">{rows.length} countries · Click any column header to sort</p>
    </div>
  )
}
