import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { formatMonthKey } from '@/utils/advancedMetrics'
import { formatScore } from '@/utils/formatters'

const WIDTH = 720
const HEIGHT = 240
const PADDING = { top: 24, right: 24, bottom: 32, left: 40 }

export function ScoreEvolutionChart({ history = [], metric = 'score', label = 'Score' }) {
  const [hoverIdx, setHoverIdx] = useState(null)

  const data = useMemo(() => {
    return [...history]
      .sort((a, b) => a.monthKey.localeCompare(b.monthKey))
      .map(h => ({ monthKey: h.monthKey, value: h[metric] ?? 0 }))
  }, [history, metric])

  if (data.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-slate-500 text-sm">
        <p>Sem dados históricos ainda.</p>
        <p className="text-xs mt-1">O gráfico aparecerá após o primeiro fechamento de mês.</p>
      </div>
    )
  }

  const innerW = WIDTH - PADDING.left - PADDING.right
  const innerH = HEIGHT - PADDING.top - PADDING.bottom

  const minVal = Math.min(0, ...data.map(d => d.value))
  const maxVal = Math.max(100, ...data.map(d => d.value)) * 1.1

  const xStep = data.length > 1 ? innerW / (data.length - 1) : 0
  const yScale = v => PADDING.top + innerH - ((v - minVal) / (maxVal - minVal)) * innerH
  const xPos = i => PADDING.left + (data.length > 1 ? i * xStep : innerW / 2)

  const points = data.map((d, i) => ({ x: xPos(i), y: yScale(d.value), ...d }))
  const linePath = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ')
  const areaPath = `${linePath} L ${points[points.length - 1].x} ${HEIGHT - PADDING.bottom} L ${points[0].x} ${HEIGHT - PADDING.bottom} Z`

  const yTicks = [0, 25, 50, 75, 100].filter(t => t >= minVal && t <= maxVal)

  return (
    <div className="relative w-full overflow-x-auto">
      <svg viewBox={`0 0 ${WIDTH} ${HEIGHT}`} className="w-full h-auto" preserveAspectRatio="xMidYMid meet">
        <defs>
          <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#f97316" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#f97316" stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* Y grid lines */}
        {yTicks.map(t => (
          <g key={t}>
            <line
              x1={PADDING.left} x2={WIDTH - PADDING.right}
              y1={yScale(t)} y2={yScale(t)}
              stroke="rgba(255,255,255,0.06)" strokeDasharray="3 4"
            />
            <text x={PADDING.left - 8} y={yScale(t) + 4} fontSize="10" fill="#64748b" textAnchor="end">
              {t}
            </text>
          </g>
        ))}

        {/* Area */}
        <motion.path
          d={areaPath}
          fill="url(#areaGrad)"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
        />

        {/* Line */}
        <motion.path
          d={linePath}
          fill="none"
          stroke="#f97316"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1, ease: 'easeOut' }}
        />

        {/* Dots */}
        {points.map((p, i) => (
          <g
            key={i}
            onMouseEnter={() => setHoverIdx(i)}
            onMouseLeave={() => setHoverIdx(null)}
            className="cursor-pointer"
          >
            <circle cx={p.x} cy={p.y} r="14" fill="transparent" />
            <motion.circle
              cx={p.x} cy={p.y} r={hoverIdx === i ? 6 : 4}
              fill="#f97316"
              stroke="#0f172a" strokeWidth="2"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.5 + i * 0.05 }}
            />
            <text x={p.x} y={HEIGHT - PADDING.bottom + 18} fontSize="10" fill="#94a3b8" textAnchor="middle">
              {formatMonthKey(p.monthKey)}
            </text>
          </g>
        ))}

        {/* Tooltip */}
        {hoverIdx !== null && (
          <g>
            <rect
              x={points[hoverIdx].x - 50}
              y={points[hoverIdx].y - 44}
              width="100" height="34" rx="6"
              fill="#0f172a" stroke="#f97316" strokeOpacity="0.4"
            />
            <text
              x={points[hoverIdx].x} y={points[hoverIdx].y - 28}
              fontSize="9" fill="#94a3b8" textAnchor="middle"
            >
              {formatMonthKey(points[hoverIdx].monthKey)}
            </text>
            <text
              x={points[hoverIdx].x} y={points[hoverIdx].y - 15}
              fontSize="12" fontWeight="700" fill="#f97316" textAnchor="middle"
            >
              {label}: {formatScore(points[hoverIdx].value)}
            </text>
          </g>
        )}
      </svg>
    </div>
  )
}
