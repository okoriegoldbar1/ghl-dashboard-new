import React from 'react'

export default function DailySummary({ data }) {
  if (!data) return null

  const stages = data.stages || []
  const stageCounts = data.stageCounts || {}
  const totals = stages.map(s => stageCounts[s]?.total || 0)
  const sourceTotals = data.sourceTotals || {}

  const today = new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })
  const topSource = Object.entries(sourceTotals).sort((a, b) => b[1] - a[1])[0]
  const overallConv = totals[0] > 0 ? Math.round((totals[4] / totals[0]) * 100) : 0

  // find biggest drop-off
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

  return (
    <div style={{
      background: 'linear-gradient(135deg, #1a1200 0%, #0f0c00 100%)',
      border: '1px solid rgba(212,175,55,0.25)',
      borderRadius: '10px',
      padding: '16px 20px',
      marginBottom: '14px',
      display: 'grid',
      gridTemplateColumns: '1fr auto',
      gap: '16px',
      alignItems: 'center',
    }}>
      <div>
        <div style={{ fontSize: '10px', color: '#7a6a30', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '6px', fontFamily: 'var(--font-display)' }}>
          Daily Summary · {today}
        </div>
        <div style={{ fontSize: '13px', color: '#f0e6c8', lineHeight: 1.6 }}>
          {totals[0] > 0
            ? <>
                <strong style={{ color: '#d4af37' }}>{totals[0]} leads</strong> in the pipeline.{' '}
                {topSource && <><strong style={{ color: '#d4af37' }}>{topSource[0]}</strong> is your top source with <strong style={{ color: '#d4af37' }}>{topSource[1]} leads</strong>.</>}{' '}
                <strong style={{ color: '#d4af37' }}>{totals[4]} candidates</strong> reached Website Live.{' '}
                Drop-off is highest at <strong style={{ color: '#d4af37' }}>{biggestDrop.label}</strong> ({biggestDrop.pct}%).
              </>
            : 'No leads yet — connect your GHL webhook to see live data here.'
          }
        </div>
      </div>
      <div style={{ display: 'flex', gap: '20px', flexShrink: 0 }}>
        {[
          { val: totals[0], label: 'Total' },
          { val: totals[4], label: 'Live' },
          { val: overallConv + '%', label: 'Conv.' },
        ].map(({ val, label }) => (
          <div key={label} style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '22px', fontWeight: 800, color: '#d4af37', lineHeight: 1, fontFamily: 'var(--font-display)' }}>{val}</div>
            <div style={{ fontSize: '9px', color: '#5a5040', marginTop: '3px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{label}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
