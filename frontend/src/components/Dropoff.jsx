import React from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

const TT = { background: '#1a1a1a', border: '1px solid rgba(212,175,55,0.2)', borderRadius: '6px', fontSize: '11px', color: '#fff' }

function Card({ title, children, style = {} }) {
  return (
    <div style={{ background: '#141414', border: '1px solid rgba(212,175,55,0.1)', borderRadius: '8px', padding: '18px', ...style }}>
      {title && <div style={{ fontSize: '10px', fontWeight: 600, color: '#555', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '16px', paddingBottom: '10px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>{title}</div>}
      {children}
    </div>
  )
}

export default function Dropoff({ data }) {
  const stages = data?.stages || []
  const stageCounts = data?.stageCounts || {}
  const totals = stages.map(s => stageCounts[s]?.total || 0)
  const totalApplicants = data?.totalLeads || 0

  const transitions = stages.slice(0, -1).map((s, i) => ({
    label: `${s} → ${stages[i+1]}`,
    shortLabel: `Stage ${i+1} → ${i+2}`,
    from: totals[i],
    to: totals[i+1],
    drop: totals[i] > 0 ? Math.round(((totals[i] - totals[i+1]) / totals[i]) * 100) : 0,
    lost: totals[i] - totals[i+1],
  }))

  const biggestDrop = transitions.reduce((max, t) => t.drop > max.drop ? t : max, { drop: 0, label: 'N/A' })
  const totalLost = totalApplicants - (totals[totals.length - 1] || 0)
  const lostPct = totalApplicants > 0 ? Math.round((totalLost / totalApplicants) * 100) : 0

  // Source breakdown per stage
  const sources = ['Meta Ads', 'Indeed', 'OnlineJobs.ph']
  const sourceStageData = stages.map(s => {
    const row = { stage: s.length > 12 ? s.slice(0,12)+'…' : s }
    sources.forEach(src => { row[src] = stageCounts[s]?.[src] || 0 })
    return row
  })

  // Conversion % of total per stage for bar chart
  const conversionData = stages.map((s, i) => ({
    stage: s.length > 14 ? s.slice(0,14)+'…' : s,
    pct: totalApplicants > 0 ? Math.round((totals[i] / totalApplicants) * 100) : 0,
    count: totals[i],
  }))

  const hasData = totalApplicants > 0

  return (
    <div>
      <div style={{ marginBottom: '4px', fontSize: '16px', fontWeight: 300, letterSpacing: '-0.01em', color: '#fff' }}>Drop-off Analysis</div>
      <div style={{ fontSize: '12px', color: '#555', marginBottom: '18px' }}>Where leads are leaving your pipeline — filtered by selected period</div>

      {!hasData && (
        <div style={{ background: '#141414', border: '1px solid rgba(212,175,55,0.1)', borderRadius: '8px', padding: '32px', textAlign: 'center' }}>
          <div style={{ fontSize: '13px', color: '#555' }}>No data yet for the selected period</div>
          <div style={{ fontSize: '11px', color: '#333', marginTop: '6px' }}>Move leads through your GHL pipeline and drop-off data will appear here</div>
        </div>
      )}

      {hasData && (
        <>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '8px', marginBottom: '14px' }}>
            {[
              { label: 'Biggest Drop-off', val: biggestDrop.label || 'N/A', sub: `${biggestDrop.drop}% don't advance`, accent: '#d4af37' },
              { label: 'Total Leads Lost', val: totalLost, sub: `${lostPct}% never convert`, accent: '#b89228' },
              { label: 'Overall Conversion', val: `${totalApplicants > 0 ? Math.round(((totals[totals.length-1]||0)/totalApplicants)*100) : 0}%`, sub: 'applicant to matched', accent: '#856010' },
            ].map(k => (
              <div key={k.label} style={{ background: '#141414', border: '1px solid rgba(212,175,55,0.1)', borderRadius: '8px', padding: '14px', position: 'relative', overflow: 'hidden' }}>
                <div style={{ position: 'absolute', top: 0, left: 12, right: 12, height: '1px', background: k.accent }} />
                <div style={{ fontSize: '9px', fontWeight: 600, color: '#555', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '8px' }}>{k.label}</div>
                <div style={{ fontSize: k.label === 'Biggest Drop-off' ? '12px' : '24px', fontWeight: 300, color: '#fff', lineHeight: 1.2 }}>{k.val}</div>
                <div style={{ fontSize: '11px', color: '#555', marginTop: '5px' }}>{k.sub}</div>
              </div>
            ))}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '10px' }}>
            <Card title="Drop-off per stage transition">
              {transitions.map(t => {
                const c = t.drop >= 50 ? '#d4af37' : t.drop >= 30 ? '#b89228' : '#555'
                return (
                  <div key={t.label} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '9px 0', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                    <div style={{ fontSize: '10px', fontWeight: 400, color: '#b0b0b0', flex: 1, lineHeight: 1.4 }}>{t.label}</div>
                    <div style={{ width: '70px', height: '2px', background: '#1a1a1a', borderRadius: '1px' }}>
                      <div style={{ height: '100%', width: `${t.drop}%`, background: c, borderRadius: '1px' }} />
                    </div>
                    <div style={{ fontSize: '12px', fontWeight: 500, color: c, width: '34px', textAlign: 'right' }}>{t.drop}%</div>
                    <div style={{ fontSize: '10px', color: '#444', width: '46px', textAlign: 'right' }}>{t.lost} lost</div>
                  </div>
                )
              })}
            </Card>

            <Card title="% of applicants reaching each stage">
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={conversionData} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(212,175,55,0.05)" horizontal={false} />
                  <XAxis type="number" tick={{ fill: '#555', fontSize: 10 }} axisLine={false} tickLine={false} unit="%" domain={[0, 100]} />
                  <YAxis type="category" dataKey="stage" tick={{ fill: '#888', fontSize: 9 }} axisLine={false} tickLine={false} width={90} />
                  <Tooltip contentStyle={TT} formatter={(v, n, p) => [`${v}% (${p.payload.count} leads)`, '']} />
                  <Bar dataKey="pct" name="% of total" fill="#d4af37" radius={[0,3,3,0]} />
                </BarChart>
              </ResponsiveContainer>
            </Card>
          </div>

          <Card title="Leads per stage by source">
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={sourceStageData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(212,175,55,0.05)" />
                <XAxis dataKey="stage" tick={{ fill: '#555', fontSize: 9 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: '#555', fontSize: 10 }} axisLine={false} tickLine={false} allowDecimals={false} />
                <Tooltip contentStyle={TT} />
                <Bar dataKey="Meta Ads" fill="#d4af37" stackId="a" />
                <Bar dataKey="Indeed" fill="#b89228" stackId="a" />
                <Bar dataKey="OnlineJobs.ph" fill="#856010" stackId="a" radius={[2,2,0,0]} />
              </BarChart>
            </ResponsiveContainer>
            <div style={{ display: 'flex', gap: '14px', marginTop: '10px' }}>
              {[['Meta Ads','#d4af37'],['Indeed','#b89228'],['OnlineJobs.ph','#856010']].map(([n,c]) => (
                <span key={n} style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '10px', color: '#555' }}>
                  <span style={{ width: '8px', height: '8px', borderRadius: '2px', background: c }} />{n}
                </span>
              ))}
            </div>
          </Card>
        </>
      )}
    </div>
  )
}
