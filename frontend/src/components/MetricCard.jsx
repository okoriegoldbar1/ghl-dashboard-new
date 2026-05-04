import React from 'react'

export default function MetricCard({ label, value, sub, accent, icon }) {
  return (
    <div style={{
      background: 'var(--bg-3)',
      border: '1px solid var(--border)',
      borderRadius: 'var(--radius)',
      padding: '20px',
      position: 'relative',
      overflow: 'hidden',
      transition: 'border-color 0.2s',
    }}
    onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--border-strong)'}
    onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border)'}
    >
      {accent && (
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0, height: '2px',
          background: accent,
        }} />
      )}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <div style={{ fontSize: '11px', fontWeight: 500, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '8px', fontFamily: 'var(--font-display)' }}>
            {label}
          </div>
          <div style={{ fontSize: '32px', fontWeight: 700, color: 'var(--text)', fontFamily: 'var(--font-display)', lineHeight: 1 }}>
            {value ?? '—'}
          </div>
          {sub && (
            <div style={{ fontSize: '12px', color: 'var(--text-2)', marginTop: '6px' }}>
              {sub}
            </div>
          )}
        </div>
        {icon && (
          <div style={{ color: accent || 'var(--text-3)', opacity: 0.6, marginTop: '2px' }}>
            {icon}
          </div>
        )}
      </div>
    </div>
  )
}
