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
        const cc = conv >= 60 ? '#d4af37' : conv >= 40 ? '#b89228' : '#666'
        const cbg = conv >= 60 ? 'rgba(212,175,55,0.1)' : conv >= 40 ? 'rgba(184,146,40,0.1)' : 'rgba(100,100,100,0.1)'
        return (
          <div key={stage} style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
            <div style={{ fontSize: '11px', color: 'var(--text-2)', width: '130px', flexShrink: 0, textAlign: 'right' }}>
              {stage.length > 20 ? stage.slice(0, 20) + '…' : stage}
            </div>
            <div style={{ flex: 1, height: '3px', background: 'var(--bg-4)', borderRadius: '2px', overflow: 'hidden' }}>
              <div style={{ height: '100%', width: `${pct}%`, background: GOLD[i], borderRadius: '2px', transition: 'width 0.6s ease' }} />
            </div>
            <div style={{ fontSize: '13px', fontWeight: 500, color: 'var(--text)', width: '28px', textAlign: 'right' }}>
              {values[i]}
            </div>
            {conv !== null
              ? <div style={{ fontSize: '10px', fontWeight: 500, padding: '2px 7px', borderRadius: '4px', width: '46px', textAlign: 'center', color: cc, background: cbg }}>{conv}%</div>
              : <div style={{ width: '46px' }} />
            }
          </div>
        )
      })}
    </div>
  )
}
