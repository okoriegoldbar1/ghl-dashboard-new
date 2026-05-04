import React from 'react'
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts'

const SOURCE_COLORS = { 'Meta Ads': '#d4af37', 'Indeed': '#b89228', 'OnlineJobs.ph': '#856010' }

const TOOLTIP_STYLE = {
  background: '#0a0a0a', border: '1px solid rgba(212,175,55,0.15)',
  borderRadius: '6px', fontSize: '11px', color: '#e8dcc8',
}

export default function SourceBreakdown({ sourceTotals }) {
  if (!sourceTotals) return null
  const total = Object.values(sourceTotals).reduce((a, b) => a + b, 0)
  const data = Object.entries(sourceTotals).map(([name, value]) => ({ name, value }))

  return (
    <div>
      {data.map(({ name, value }) => {
        const pct = total > 0 ? Math.round((value / total) * 100) : 0
        return (
          <div key={name} style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '13px' }}>
            <div style={{ width: '4px', height: '4px', borderRadius: '50%', background: SOURCE_COLORS[name], flexShrink: 0 }} />
            <span style={{ flex: 1, fontSize: '11px', color: 'var(--text-2)', fontWeight: 300, letterSpacing: '0.02em' }}>{name}</span>
            <div style={{ width: '64px', height: '1px', background: '#111' }}>
              <div style={{ height: '100%', width: `${pct}%`, background: SOURCE_COLORS[name] }} />
            </div>
            <span style={{ fontSize: '12px', fontWeight: 400, color: 'var(--text)', width: '22px', textAlign: 'right', letterSpacing: '-0.01em' }}>{value}</span>
            <span style={{ fontSize: '10px', color: 'var(--text-3)', width: '28px', textAlign: 'right' }}>{pct}%</span>
          </div>
        )
      })}
      <div style={{ height: '130px', marginTop: '16px', paddingTop: '14px', borderTop: '1px solid rgba(212,175,55,0.07)' }}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie data={data} cx="50%" cy="50%" innerRadius={38} outerRadius={56} paddingAngle={2} dataKey="value">
              {data.map(entry => <Cell key={entry.name} fill={SOURCE_COLORS[entry.name] || '#d4af37'} stroke="transparent" />)}
            </Pie>
            <Tooltip contentStyle={TOOLTIP_STYLE} formatter={v => [v, '']} />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
