import React from 'react'

const SOURCE_COLORS = {
  'Meta Ads': '#e17055',
  'Indeed': '#00b894',
  'OnlineJobs.ph': '#fdcb6e',
}

export default function StageTable({ stageCounts, stages, sources }) {
  if (!stageCounts || !stages) return null

  return (
    <div style={{ overflowX: 'auto' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px' }}>
        <thead>
          <tr>
            <th style={{ textAlign: 'left', padding: '8px 12px', color: 'var(--text-3)', fontWeight: 500, fontFamily: 'var(--font-display)', fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.08em', borderBottom: '1px solid var(--border)' }}>
              Stage
            </th>
            {sources.map(src => (
              <th key={src} style={{ padding: '8px 12px', color: SOURCE_COLORS[src] || 'var(--text-2)', fontWeight: 500, fontFamily: 'var(--font-display)', fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.08em', borderBottom: '1px solid var(--border)', textAlign: 'center' }}>
                {src}
              </th>
            ))}
            <th style={{ padding: '8px 12px', color: 'var(--text-3)', fontWeight: 500, fontFamily: 'var(--font-display)', fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.08em', borderBottom: '1px solid var(--border)', textAlign: 'center' }}>
              Total
            </th>
          </tr>
        </thead>
        <tbody>
          {stages.map((stage, i) => {
            const row = stageCounts[stage] || {}
            const total = row.total || 0
            return (
              <tr key={stage}
                style={{ borderBottom: '1px solid var(--border)', transition: 'background 0.15s' }}
                onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-4)'}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
              >
                <td style={{ padding: '12px 12px', color: 'var(--text)', fontWeight: 500 }}>{stage}</td>
                {sources.map(src => (
                  <td key={src} style={{ padding: '12px 12px', color: 'var(--text-2)', textAlign: 'center' }}>
                    {row[src] || 0}
                  </td>
                ))}
                <td style={{ padding: '12px 12px', fontWeight: 700, color: 'var(--text)', textAlign: 'center', fontFamily: 'var(--font-display)' }}>
                  {total}
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
