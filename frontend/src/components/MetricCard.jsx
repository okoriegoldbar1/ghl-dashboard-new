import React from 'react'

export default function MetricCard({ label, value, sub, accent }) {
  return (
    <div style={{
      background: 'var(--bg-3)',
      border: '1px solid var(--border)',
      borderRadius: 'var(--radius)',
      padding: '16px',
      position: 'relative',
      overflow: 'hidden',
      transition: 'border-color 0.2s',
    }}
    onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(212,175,55,0.3)'}
    onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(212,175,55,0.12)'}
    >
      {accent && <div style={{ position: 'absolute', top: 0, left: 16, right: 16, height: '1px', background: accent }} />}
      <div style={{ fontSize: '10px', fontWeight: 500, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '10px' }}>
        {label}
      </div>
      <div style={{ fontSize: '30px', fontWeight: 300, color: 'var(--text)', letterSpacing: '-0.02em', lineHeight: 1 }}>
        {value ?? '—'}
      </div>
      {sub && <div style={{ fontSize: '11px', color: 'var(--text-2)', marginTop: '7px' }}>{sub}</div>}
    </div>
  )
}
