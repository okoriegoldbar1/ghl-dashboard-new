import React from 'react'

const STAGE_COLORS = ['#6c5ce7','#00cec9','#00b894','#fdcb6e','#e17055']

export default function FunnelChart({ stageCounts, stages }) {
  if (!stageCounts || !stages) return null

  const values = stages.map(s => stageCounts[s]?.total || 0)
  const max = values[0] || 1

  return (
    <div>
      {stages.map((stage, i) => {
        const val = values[i]
        const pct = Math.round((val / max) * 100)
        const conv = i > 0 && values[i - 1] > 0
          ? Math.round((val / values[i - 1]) * 100)
          : null

        return (
          <div key={stage} style={{ marginBottom: '14px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
              <span style={{ fontSize: '12px', color: 'var(--text-2)', maxWidth: '200px' }}>{stage}</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                {conv !== null && (
                  <span style={{
                    fontSize: '10px', fontWeight: 600,
                    color: conv >= 60 ? 'var(--green)' : conv >= 40 ? 'var(--amber)' : 'var(--red)',
                    background: conv >= 60 ? 'rgba(0,184,148,0.1)' : conv >= 40 ? 'rgba(253,203,110,0.1)' : 'rgba(214,48,49,0.1)',
                    padding: '2px 7px', borderRadius: '20px',
                  }}>
                    {conv}% conv.
                  </span>
                )}
                <span style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text)', fontFamily: 'var(--font-display)', minWidth: '28px', textAlign: 'right' }}>
                  {val}
                </span>
              </div>
            </div>
            <div style={{ height: '8px', background: 'var(--bg-4)', borderRadius: '4px', overflow: 'hidden' }}>
              <div style={{
                height: '100%',
                width: `${pct}%`,
                background: STAGE_COLORS[i],
                borderRadius: '4px',
                transition: 'width 0.6s ease',
              }} />
            </div>
          </div>
        )
      })}
    </div>
  )
}
