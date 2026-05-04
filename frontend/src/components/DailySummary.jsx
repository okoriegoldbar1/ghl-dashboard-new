import React from 'react'

const RANGE_LABELS = { daily:'Today', weekly:'This Week', biweekly:'Last 14 Days', monthly:'This Month', all:'All Time' }

export default function DailySummary({ data, range = 'daily' }) {
  if (!data) return null
  const stages = data.stages || []
  const stageCounts = data.stageCounts || {}
  const totals = stages.map(s => stageCounts[s]?.total || 0)
  const sourceTotals = data.sourceTotals || {}
  const overallConv = totals[0] > 0 ? Math.round((totals[4] / totals[0]) * 100) : 0
  const topSource = Object.entries(sourceTotals).sort((a, b) => b[1] - a[1])[0]
  let biggestDrop = { label: 'N/A', pct: 0 }
  const transitions = [
    { label: 'Screening → Qualified', from: totals[0], to: totals[1] },
    { label: 'Qualified → Booked', from: totals[1], to: totals[2] },
    { label: 'Booked → Approved', from: totals[2], to: totals[3] },
    { label: 'Approved → Live', from: totals[3], to: totals[4] },
  ]
  transitions.forEach(t => {
    const drop = t.from > 0 ? Math.round(((t.from - t.to) / t.from) * 100) : 0
    if (drop > biggestDrop.pct) biggestDrop = { label: t.label, pct: drop }
  })
  const periodLabel = RANGE_LABELS[range] || 'Selected Period'
  const today = new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })

  return (
    <div style={{ border: '1px solid rgba(212,175,55,0.2)', borderRadius: '8px', padding: '20px 24px', marginBottom: '20px', display: 'grid', gridTemplateColumns: '1fr auto', gap: '20px', alignItems: 'center', background: '#0f0f0f' }}>
      <div>
        <div style={{ fontSize: '10px', fontWeight: 600, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: '8px' }}>
          {periodLabel} Summary — {today}
        </div>
        <div style={{ fontSize: '14px', color: 'var(--text-2)', lineHeight: 1.7, fontWeight: 400 }}>
          {totals[0] > 0
            ? <><strong style={{ color: '#fff', fontWeight: 600 }}>{totals[0]} leads</strong> created {range === 'daily' ? 'today' : range === 'weekly' ? 'this week' : 'in this period'}.{' '}
                {topSource && <><strong style={{ color: '#d4af37', fontWeight: 600 }}>{topSource[0]}</strong> is the top source.</>}{' '}
                <strong style={{ color: '#fff', fontWeight: 600 }}>{totals[4]}</strong> reached Website Live.{' '}
                {biggestDrop.pct > 0 && <>Drop-off highest at <strong style={{ color: '#fff', fontWeight: 600 }}>{biggestDrop.label}</strong> ({biggestDrop.pct}%).</>}
              </>
            : <span style={{ color: 'var(--text-3)' }}>No leads created {range === 'daily' ? 'today' : 'in this period'} yet.</span>
          }
        </div>
      </div>
      <div style={{ display: 'flex', gap: '28px', flexShrink: 0 }}>
        {[{ val: totals[0], label: 'Leads' }, { val: totals[4], label: 'Live' }, { val: overallConv + '%', label: 'Conv.' }].map(({ val, label }) => (
          <div key={label} style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '30px', fontWeight: 300, color: '#d4af37', letterSpacing: '-0.02em', lineHeight: 1 }}>{val}</div>
            <div style={{ fontSize: '10px', color: 'var(--text-3)', marginTop: '4px', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 600 }}>{label}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
