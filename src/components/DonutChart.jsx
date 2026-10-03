import { usd } from '../lib/format'
import { PrivacyValue } from './PrivacyMode'

/**
 * Grafico de anillos simplificado.
 * data: [{ id, label, value, color }]
 */
export default function DonutChart({ data = [], total, centerLabel = 'Gasto del mes' }) {
  const sum = total ?? data.reduce((a, d) => a + d.value, 0)
  const size = 176
  const stroke = 22
  const radius = (size - stroke) / 2
  const circ = 2 * Math.PI * radius
  const gap = data.length > 1 ? 0.012 : 0 // separacion entre segmentos

  let offset = 0
  const segments = data
    .filter((d) => d.value > 0)
    .map((d) => {
      const frac = sum > 0 ? d.value / sum : 0
      const seg = {
        ...d,
        frac,
        dash: Math.max(0, (frac - gap) * circ),
        offset: offset * circ,
      }
      offset += frac
      return seg
    })

  return (
    <div className="flex flex-col items-center">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="-rotate-90">
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="#ede9fe"
            strokeWidth={stroke}
          />
          {segments.map((s) => (
            <circle
              key={s.id}
              cx={size / 2}
              cy={size / 2}
              r={radius}
              fill="none"
              stroke={s.color}
              strokeWidth={stroke}
              strokeLinecap="round"
              strokeDasharray={`${s.dash} ${circ - s.dash}`}
              strokeDashoffset={-s.offset}
            />
          ))}
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-xs text-ink/40">{centerLabel}</span>
          <span className="text-2xl font-extrabold text-ink"><PrivacyValue value={usd(sum)} /></span>
        </div>
      </div>
    </div>
  )
}
