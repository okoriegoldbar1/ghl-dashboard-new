import React from 'react'

const SOURCE_COLORS = { 'Meta Ads': '#d4af37', 'Indeed': '#b89228', 'OnlineJobs.ph': '#856010' }

export default function StageTable({ stageCounts, stages, sources }) {
  if (!stageCounts || !stages) return null
  return (
    <div style={{ overflowX: 'auto' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px' }}>
        <thead>
          <tr>
            <th style={{ textAlign: 'left', padding: '8px 12px', color: 'var(--text-3)', fontWeight: 600, fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.08em', borderBottom: '1px solid rgba(255,255,255,0.07)' }}>Stage</th>
            {sources.map(src => (
              <th key={src} style={{ padding: '8px 12px', color: SOURCE_COLORS[src] || 'var(--text-2)', fontWeight: 600, fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.08em', borderBottom: '1px solid rgba(255,255,255,0.07)', textAlign: 'center' }}>{src}</th>
            ))}
            <th style={{ padding: '8px 12px', color: 'var(--text-3)', fontWeight: 600, fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.08em', borderBottom: '1px solid rgba(255,255,255,0.07)', textAlign: 'center' }}>Total</th>
          </tr>
        </thead>
        <tbody>
          {stages.map(stage => {
            const row = stageCounts[stage] || {}
            return (
              <tr key={stage} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)', transition: 'background 0.15s' }}
                onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.03)'}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
              >
                <td style={{ padding: '10px 12px', color: 'var(--text)', fontWeight: 500 }}>{stage}</td>
                {sources.map(src => (
                  <td key={src} style={{ padding: '10px 12px', color: 'var(--text-2)', textAlign: 'center' }}>{row[src] || 0}</td>
                ))}
                <td style={{ padding: '10px 12px', fontWeight: 600, color: '#d4af37', textAlign: 'center' }}>{row.total || 0}</td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
