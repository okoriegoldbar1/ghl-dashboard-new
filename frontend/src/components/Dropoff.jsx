import React from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

const TOOLTIP_STYLE = {
  background: '#0f0f0f',
  border: '1px solid rgba(212,175,55,0.2)',
  borderRadius: '8px',
  fontSize: '11px',
  color: '#f0e6c8',
}

const SOURCE_DROP_DATA = [
  { source: 'Meta Ads', qualified: 39, booked: 38, approved: 55, live: 32 },
  { source: 'Indeed', qualified: 45, booked: 38, approved: 52, live: 36 },
  { source: 'OJ.ph', qualified: 46, booked: 33, approved: 56, live: 38 },
]

function Card({ title, children, style = {} }) {
  return (
    <div style={{ background: 'var(--bg-2)', border: '1px solid var(--border)', borderRadius: '10px', padding: '16px', ...style }}>
      <div style={{ fontSize: '10px', fontWeight: 700, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '14px' }}>{title}</div>
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
    biggestDrop.pct > 0 && {
      icon: '⚠️',
      bg: 'rgba(212,175,55,0.08)',
      text: `<strong>${biggestDrop.pct}% drop-off</strong> at ${biggestDrop.label}. Consider adding an automated reminder sequence 24h before interviews.`,
    },
    {
      icon: '📉',
      bg: 'rgba(184,149,42,0.08)',
      text: '<strong>OnlineJobs.ph</strong> has the highest early drop-off at Application Screening. Review ad targeting or simplify the application form.',
    },
    {
      icon: '✅',
      bg: 'rgba(138,110,26,0.08)',
      text: '<strong>Meta Ads</strong> produces the most Website Live candidates. Increasing Meta budget could improve overall conversion rate.',
    },
  ].filter(Boolean)

  return (
    <div>
      <div style={{ marginBottom: '4px', fontSize: '18px', fontWeight: 800, fontFamily: 'var(--font-display)', color: 'var(--text)' }}>Drop-off Analysis</div>
      <div style={{ fontSize: '12px', color: 'var(--text-3)', marginBottom: '16px' }}>Where leads are ghosting your pipeline</div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px', marginBottom: '14px' }}>
        {[
          { label: 'Biggest drop-off', val: biggestDrop.label || 'N/A', sub: `${biggestDrop.pct}% don't make it`, accent: '#d4af37' },
          { label: 'Total leads lost', val: totalLost || 0, sub: `${lostPct}% never go live`, accent: '#c9a227' },
          { label: 'Avg. time to live', val: '14d', sub: 'from first application', accent: '#b8952a' },
        ].map((k, i) => (
          <div key={k.label} style={{ background: 'var(--bg-3)', border: '1px solid var(--border)', borderRadius: '10px', padding: '14px', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '2px', background: k.accent }} />
            <div style={{ fontSize: '10px', color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: '7px', fontFamily: 'var(--font-display)', fontWeight: 600 }}>{k.label}</div>
            <div style={{ fontSize: i === 0 ? '14px' : '24px', fontWeight: 800, color: 'var(--text)', fontFamily: 'var(--font-display)', lineHeight: 1.2 }}>{k.val}</div>
            <div style={{ fontSize: '10px', color: 'var(--text-3)', marginTop: '5px' }}>{k.sub}</div>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '10px' }}>
        <Card title="Drop-off per transition">
          {transitions.map(t => {
            const drop = t.from > 0 ? Math.round(((t.from - t.to) / t.from) * 100) : 0
            const lost = t.from - t.to
            const c = drop >= 50 ? '#d63031' : drop >= 35 ? '#b8952a' : '#d4af37'
            return (
              <div key={t.label} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 12px', borderRadius: '8px', background: '#0a0a0a', border: '1px solid rgba(212,175,55,0.07)', marginBottom: '8px' }}>
                <div style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text)', flex: 1 }}>{t.label}</div>
                <div style={{ width: '80px', height: '6px', background: '#1a1508', borderRadius: '3px', overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${drop}%`, background: c, borderRadius: '3px' }} />
                </div>
                <div style={{ fontSize: '12px', fontWeight: 700, color: c, width: '36px', textAlign: 'right' }}>{drop}%</div>
                <div style={{ fontSize: '10px', color: 'var(--text-3)', width: '50px', textAlign: 'right' }}>{lost} lost</div>
              </div>
            )
          })}
        </Card>

        <Card title="Drop-off rate by source">
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={SOURCE_DROP_DATA} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(212,175,55,0.06)" horizontal={false} />
              <XAxis type="number" tick={{ fill: '#5a5040', fontSize: 10 }} axisLine={false} tickLine={false} unit="%" domain={[0, 100]} />
              <YAxis type="category" dataKey="source" tick={{ fill: '#9a8a5a', fontSize: 10 }} axisLine={false} tickLine={false} width={70} />
              <Tooltip contentStyle={TOOLTIP_STYLE} formatter={v => v + '%'} />
              <Bar dataKey="qualified" name="→ Qualified" fill="#d4af37" radius={[0, 3, 3, 0]} />
              <Bar dataKey="approved" name="→ Approved" fill="#8a6e1a" radius={[0, 3, 3, 0]} />
            </BarChart>
          </ResponsiveContainer>
          <div style={{ display: 'flex', gap: '12px', marginTop: '4px' }}>
            {[['→ Qualified','#d4af37'],['→ Approved','#8a6e1a']].map(([n,c]) => (
              <span key={n} style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '11px', color: 'var(--text-3)' }}>
                <span style={{ width: '10px', height: '10px', borderRadius: '2px', background: c }} />{n}
              </span>
            ))}
          </div>
        </Card>
      </div>

      <Card title="Actionable Insights">
        {insights.map((ins, i) => (
          <div key={i} style={{ display: 'flex', gap: '10px', padding: '12px', borderRadius: '8px', background: ins.bg, marginBottom: i < insights.length - 1 ? '8px' : 0 }}>
            <span style={{ fontSize: '14px', flexShrink: 0 }}>{ins.icon}</span>
            <span style={{ fontSize: '12px', color: 'var(--text-2)', lineHeight: 1.6 }} dangerouslySetInnerHTML={{ __html: ins.text }} />
          </div>
        ))}
      </Card>
    </div>
  )
}
