import React from 'react'

export default function MetricCard({ label, value, sub, accent, onClick }) {
  return (
    <div
      onClick={onClick}
      style={{
        background: '#141414',
        border: '1px solid rgba(212,175,55,0.1)',
        borderRadius: '8px',
        padding: '14px 12px 12px',
        position: 'relative',
        overflow: 'hidden',
        transition: 'border-color 0.2s, background 0.2s',
        cursor: onClick ? 'pointer' : 'default',
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100px',
      }}
      onMouseEnter={e => {
        e.currentTarget.style.borderColor = 'rgba(212,175,55,0.35)'
        if (onClick) e.currentTarget.style.background = '#1a1a1a'
      }}
      onMouseLeave={e => {
        e.currentTarget.style.borderColor = 'rgba(212,175,55,0.1)'
        e.currentTarget.style.background = '#141414'
      }}
    >
      {accent && <div style={{ position: 'absolute', top: 0, left: 16, right: 16, height: '1px', background: accent }} />}
      <div style={{ fontSize: '9px', fontWeight: 600, color: '#666', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '8px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{label}</div>
      <div style={{ fontSize: '32px', fontWeight: 300, color: '#fff', letterSpacing: '-0.02em', lineHeight: 1, flex: 1 }}>{value ?? '—'}</div>
      {sub && <div style={{ fontSize: '10px', color: '#555', marginTop: '6px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{sub}</div>}
      {onClick && <div style={{ fontSize: '9px', color: 'rgba(212,175,55,0.5)', fontWeight: 500, letterSpacing: '0.05em', marginTop: '4px' }}>View leads →</div>}
    </div>
  )
}
