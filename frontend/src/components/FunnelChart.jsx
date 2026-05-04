import React from 'react'

const GOLD = ['#d4af37','#c8a430','#b89228','#a07818','#856010']

export default function FunnelChart({ stageCounts, stages }) {
  if (!stageCounts || !stages) return null
  const values = stages.map(s => stageCounts[s]?.total || 0)
  const max = values[0] || 1

  return (
    <div>
      {stages.map((stage, i) => {
        const pct = Math.round((values[i] / max) * 100)
        const conv = i > 0 && values[i - 1] > 0 ? Math.round((values[i] / values[i - 1]) * 100) : null
        const cc = conv >= 60 ? '#d4af37' : conv >= 40 ? '#b89228' : '#3a3020'
        const cbg = conv >= 60 ? 'rgba(212,175,55,0.08)' : conv >= 40 ? 'rgba(184,146,40,0.08)' : 'rgba(58,48,32,0.2)'

        return (
          <div key={stage} style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
            <div style={{ fontSize: '10px', color: 'var(--text-3)', width: '120px', flexShrink: 0, textAlign: 'right', letterSpacing: '0.02em', fontWeight: 300 }}>
              {stage.length > 18 ? stage.slice(0, 18) + '…' : stage}
            </div>
            <div style={{ flex: 1, height: '2px', background: '#111', borderRadius: '1px', overflow: 'hidden' }}>
              <div style={{ height: '100%', width: `${pct}%`, background: GOLD[i], borderRadius: '1px', transition: 'width 0.6s ease' }} />
            </div>
            <div style={{ fontSize: '12px', fontWeight: 400, color: 'var(--text)', width: '24px', textAlign: 'right', letterSpacing: '-0.01em' }}>
              {values[i]}
            </div>
            {conv !== null
              ? <div style={{ fontSize: '9px', fontWeight: 500, padding: '2px 7px', borderRadius: '3px', width: '44px', textAlign: 'center', letterSpacing: '0.04em', color: cc, background: cbg }}>{conv}%</div>
              : <div style={{ width: '44px' }} />
            }
          </div>
        )
      })}
    </div>
  )
}
