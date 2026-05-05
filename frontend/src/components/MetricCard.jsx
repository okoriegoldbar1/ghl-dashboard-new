import React from 'react'

export default function MetricCard({ label, value, sub, accent, onClick }) {
  return (
    <div
      onClick={onClick}
      style={{
        background: '#141414',
        border: '1px solid rgba(212,175,55,0.1)',
        borderRadius: '8px',
        padding: '16px',
        position: 'relative',
        overflow: 'hidden',
        transition: 'border-color 0.2s, background 0.2s',
        cursor: onClick ? 'pointer' : 'default',
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
      <div style={{ fontSize: '10px', fontWeight: 600, color: '#666', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '10px' }}>
        {label}
      </div>
      <div style={{ fontSize: '30px', fontWeight: 300, color: '#fff', letterSpacing: '-0.02em', lineHeight: 1 }}>
        {value ?? '—'}
      </div>
      {sub && <div style={{ fontSize: '11px', color: '#666', marginTop: '7px' }}>{sub}</div>}
      {onClick && (
        <div style={{ position: 'absolute', bottom: '10px', right: '12px', fontSize: '9px', color: 'rgba(212,175,55,0.4)', fontWeight: 500, letterSpacing: '0.06em', textTransform: 'uppercase' }}>
          View leads →
        </div>
      )}
    </div>
  )
}
