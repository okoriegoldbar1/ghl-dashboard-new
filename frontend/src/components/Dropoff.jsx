import React from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

const TT = { background: '#0a0a0a', border: '1px solid rgba(212,175,55,0.15)', borderRadius: '6px', fontSize: '11px', color: '#e8dcc8' }
const SOURCE_DROP = [
  { source: 'Meta', qualified: 39, approved: 55 },
  { source: 'Indeed', qualified: 45, approved: 52 },
  { source: 'OJ.ph', qualified: 46, approved: 56 },
]

function Card({ title, children, style = {} }) {
  return (
    <div style={{ background: 'var(--bg-3)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: '18px', ...style }}>
      <div style={{ fontSize: '9px', fontWeight: 500, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: '16px', paddingBottom: '10px', borderBottom: '1px solid rgba(212,175,55,0.07)' }}>{title}</div>
      {children}
    </div>
  )
}

export default function Dropoff({ data }) {
  const stages = data?.stages || []
  const stageCounts = data?.stageCounts || {}
  const totals = stages.map(s => stageCounts[s]?.total || 0)
  const transitions = [
    { label: 'Screening → Qualified', from: totals[0], to: totals[1] },
    { label: 'Qualified → Booked', from: totals[1], to: totals[2] },
    { label: 'Booked → Approved', from: totals[2], to: totals[3] },
    { label: 'Approved → Live', from: totals[3], to: totals[4] },
  ]
  let biggestDrop = { label: 'N/A', pct: 0 }
  transitions.forEach(t => {
    const drop = t.from > 0 ? Math.round(((t.from - t.to) / t.from) * 100) : 0
    if (drop > biggestDrop.pct) biggestDrop = { label: t.label, pct: drop }
  })
  const totalLost = totals[0] - totals[4]
  const lostPct = totals[0] > 0 ? Math.round((totalLost / totals[0]) * 100) : 0

  const insights = [
    { icon: '↓', text: `${biggestDrop.pct}% drop-off at ${biggestDrop.label}. Add an automated reminder 24h before interviews.` },
    { icon: '↓', text: 'OnlineJobs.ph has the highest early drop-off. Review ad targeting or simplify the application form.' },
    { icon: '↑', text: 'Meta Ads produces the most Website Live candidates. Increasing budget here could improve overall conversion.' },
  ]

  return (
    <div>
      <div style={{ marginBottom: '4px', fontSize: '16px', fontWeight: 300, letterSpacing: '-0.01em', color: 'var(--text)' }}>Drop-off Analysis</div>
      <div style={{ fontSize: '11px', color: 'var(--text-3)', marginBottom: '18px', letterSpacing: '0.03em' }}>Where leads are leaving your pipeline</div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '8px', marginBottom: '14px' }}>
        {[
          { label: 'Biggest Drop-off', val: biggestDrop.label || 'N/A', sub: `${biggestDrop.pct}% don't make it`, accent: '#d4af37' },
          { label: 'Leads Lost', val: totalLost || 0, sub: `${lostPct}% never go live`, accent: '#b89228' },
          { label: 'Avg. Time to Live', val: '14d', sub: 'from first application', accent: '#856010' },
        ].map(k => (
          <div key={k.label} style={{ background: 'var(--bg-3)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: '14px', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', top: 0, left: 12, right: 12, height: '1px', background: k.accent }} />
            <div style={{ fontSize: '9px', fontWeight: 500, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '8px' }}>{k.label}</div>
            <div style={{ fontSize: k.label === 'Biggest Drop-off' ? '13px' : '24px', fontWeight: 300, color: 'var(--text)', letterSpacing: '-0.01em', lineHeight: 1.2 }}>{k.val}</div>
            <div style={{ fontSize: '10px', color: 'var(--text-3)', marginTop: '5px' }}>{k.sub}</div>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '10px' }}>
        <Card title="Drop-off Per Transition">
          {transitions.map(t => {
            const drop = t.from > 0 ? Math.round(((t.from - t.to) / t.from) * 100) : 0
            const lost = t.from - t.to
            const c = drop >= 50 ? '#d4af37' : drop >= 35 ? '#b89228' : '#3a3020'
            return (
              <div key={t.label} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 0', borderBottom: '1px solid rgba(212,175,55,0.05)' }}>
                <div style={{ fontSize: '11px', fontWeight: 400, color: 'var(--text)', flex: 1, letterSpacing: '0.01em' }}>{t.label}</div>
                <div style={{ width: '80px', height: '1px', background: '#111' }}>
                  <div style={{ height: '100%', width: `${drop}%`, background: c }} />
                </div>
                <div style={{ fontSize: '12px', fontWeight: 400, color: c, width: '34px', textAlign: 'right', letterSpacing: '-0.01em' }}>{drop}%</div>
                <div style={{ fontSize: '10px', color: 'var(--text-3)', width: '46px', textAlign: 'right', fontWeight: 300 }}>{lost} lost</div>
              </div>
            )
          })}
        </Card>
        <Card title="Drop-off by Source">
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={SOURCE_DROP} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(212,175,55,0.05)" horizontal={false} />
              <XAxis type="number" tick={{ fill: '#3a3020', fontSize: 10 }} axisLine={false} tickLine={false} unit="%" domain={[0,100]} />
              <YAxis type="category" dataKey="source" tick={{ fill: '#a09070', fontSize: 10 }} axisLine={false} tickLine={false} width={50} />
              <Tooltip contentStyle={TT} formatter={v => v + '%'} />
              <Bar dataKey="qualified" name="→ Qualified" fill="#d4af37" radius={[0,2,2,0]} />
              <Bar dataKey="approved" name="→ Approved" fill="#856010" radius={[0,2,2,0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>

      <Card title="Insights">
        {insights.map((ins, i) => (
          <div key={i} style={{ display: 'flex', gap: '12px', padding: '12px', borderRadius: '6px', background: 'rgba(212,175,55,0.04)', border: '1px solid rgba(212,175,55,0.07)', marginBottom: i < insights.length - 1 ? '8px' : 0 }}>
            <span style={{ fontSize: '12px', color: '#d4af37', flexShrink: 0, fontWeight: 400, marginTop: '1px' }}>{ins.icon}</span>
            <span style={{ fontSize: '12px', color: 'var(--text-2)', lineHeight: 1.6, fontWeight: 300 }}>{ins.text}</span>
          </div>
        ))}
      </Card>
    </div>
  )
}
