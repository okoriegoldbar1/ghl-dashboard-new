import React from 'react'
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts'

const SOURCE_COLORS = { 'Meta Ads': '#d4af37', 'Indeed': '#b89228', 'OnlineJobs.ph': '#856010' }
const TT = { background: '#1a1a1a', border: '1px solid rgba(212,175,55,0.2)', borderRadius: '6px', fontSize: '12px', color: '#fff' }

export default function SourceBreakdown({ sourceTotals }) {
  if (!sourceTotals) return null
  const total = Object.values(sourceTotals).reduce((a, b) => a + b, 0)
  const data = Object.entries(sourceTotals).map(([name, value]) => ({ name, value }))

  return (
    <div>
      {data.map(({ name, value }) => {
        const pct = total > 0 ? Math.round((value / total) * 100) : 0
        return (
          <div key={name} style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
            <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: SOURCE_COLORS[name], flexShrink: 0 }} />
            <span style={{ flex: 1, fontSize: '12px', color: 'var(--text-2)' }}>{name}</span>
            <span style={{ fontSize: '13px', fontWeight: 500, color: 'var(--text)' }}>{value}</span>
            <span style={{ fontSize: '11px', color: 'var(--text-3)', width: '32px', textAlign: 'right' }}>{pct}%</span>
          </div>
        )
      })}
      <div style={{ height: '140px', marginTop: '14px', paddingTop: '14px', borderTop: '1px solid rgba(212,175,55,0.08)' }}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie data={data} cx="50%" cy="50%" innerRadius={38} outerRadius={56} paddingAngle={2} dataKey="value">
              {data.map(entry => <Cell key={entry.name} fill={SOURCE_COLORS[entry.name] || '#d4af37'} stroke="transparent" />)}
            </Pie>
            <Tooltip contentStyle={TT} formatter={v => [v, '']} />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
