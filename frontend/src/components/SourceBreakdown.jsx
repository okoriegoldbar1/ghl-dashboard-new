import React from 'react'
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts'

const SOURCE_COLORS = {
  'Meta Ads': '#e17055',
  'Indeed': '#00b894',
  'OnlineJobs.ph': '#fdcb6e',
}

export default function SourceBreakdown({ sourceTotals }) {
  if (!sourceTotals) return null

  const total = Object.values(sourceTotals).reduce((a, b) => a + b, 0)
  const data = Object.entries(sourceTotals).map(([name, value]) => ({ name, value }))

  return (
    <div>
      <div style={{ height: '180px', marginBottom: '16px' }}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie data={data} cx="50%" cy="50%" innerRadius={55} outerRadius={80} paddingAngle={3} dataKey="value">
              {data.map((entry) => (
                <Cell key={entry.name} fill={SOURCE_COLORS[entry.name] || '#6c5ce7'} stroke="transparent" />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{ background: 'var(--bg-3)', border: '1px solid var(--border-strong)', borderRadius: '8px', fontSize: '12px', color: 'var(--text)' }}
              formatter={(v) => [v, '']}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {data.map(({ name, value }) => {
          const pct = total > 0 ? Math.round((value / total) * 100) : 0
          return (
            <div key={name} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: SOURCE_COLORS[name], flexShrink: 0 }} />
              <span style={{ flex: 1, fontSize: '12px', color: 'var(--text-2)' }}>{name}</span>
              <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text)', fontFamily: 'var(--font-display)' }}>{value}</span>
              <span style={{ fontSize: '11px', color: 'var(--text-3)', width: '32px', textAlign: 'right' }}>{pct}%</span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
