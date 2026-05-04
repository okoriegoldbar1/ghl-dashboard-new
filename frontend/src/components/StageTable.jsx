import React from 'react'

const SOURCE_COLORS = { 'Meta Ads': '#d4af37', 'Indeed': '#b89228', 'OnlineJobs.ph': '#856010' }

export default function StageTable({ stageCounts, stages, sources }) {
  if (!stageCounts || !stages) return null
  return (
    <div style={{ overflowX: 'auto' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '11px' }}>
        <thead>
          <tr>
            <th style={{ textAlign: 'left', padding: '8px 10px', color: 'var(--text-3)', fontWeight: 500, fontSize: '9px', textTransform: 'uppercase', letterSpacing: '0.1em', borderBottom: '1px solid rgba(212,175,55,0.08)' }}>Stage</th>
            {sources.map(src => (
              <th key={src} style={{ padding: '8px 10px', color: SOURCE_COLORS[src] || 'var(--text-3)', fontWeight: 500, fontSize: '9px', textTransform: 'uppercase', letterSpacing: '0.1em', borderBottom: '1px solid rgba(212,175,55,0.08)', textAlign: 'center' }}>{src}</th>
            ))}
            <th style={{ padding: '8px 10px', color: 'var(--text-3)', fontWeight: 500, fontSize: '9px', textTransform: 'uppercase', letterSpacing: '0.1em', borderBottom: '1px solid rgba(212,175,55,0.08)', textAlign: 'center' }}>Total</th>
          </tr>
        </thead>
        <tbody>
          {stages.map(stage => {
            const row = stageCounts[stage] || {}
            return (
              <tr key={stage} style={{ borderBottom: '1px solid rgba(212,175,55,0.04)', transition: 'background 0.15s' }}
                onMouseEnter={e => e.currentTarget.style.background = 'rgba(212,175,55,0.03)'}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
              >
                <td style={{ padding: '10px', color: 'var(--text)', fontWeight: 400 }}>{stage}</td>
                {sources.map(src => (
                  <td key={src} style={{ padding: '10px', color: 'var(--text-2)', textAlign: 'center', fontWeight: 300 }}>{row[src] || 0}</td>
                ))}
                <td style={{ padding: '10px', fontWeight: 500, color: '#d4af37', textAlign: 'center', letterSpacing: '-0.01em' }}>{row.total || 0}</td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
