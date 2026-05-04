import React, { useState } from 'react'

export default function AccessGate({ onEnter }) {
  const [key, setKey] = useState('')
  const [error, setError] = useState(false)

  function handleSubmit(e) {
    e.preventDefault()
    if (!key.trim()) return
    // Navigate to same page with key in URL
    window.location.href = `${window.location.pathname}?key=${key.trim()}`
  }

  return (
    <div style={{
      minHeight: '100vh', background: '#0a0a0a',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontFamily: "'Inter', system-ui, sans-serif",
    }}>
      <div style={{ width: '100%', maxWidth: '380px', padding: '0 24px' }}>

        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '48px', justifyContent: 'center' }}>
          <div style={{ width: '36px', height: '36px', border: '1.5px solid #d4af37', borderRadius: '9px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="14" height="14" viewBox="0 0 12 12" fill="none">
              <path d="M6 1L11 3.5V8.5L6 11L1 8.5V3.5L6 1Z" stroke="#d4af37" strokeWidth="1" fill="none"/>
            </svg>
          </div>
          <div>
            <div style={{ fontSize: '13px', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#fff', lineHeight: 1.2 }}>GHL Pipeline</div>
            <div style={{ fontSize: '9px', color: '#666', letterSpacing: '0.12em', textTransform: 'uppercase', fontWeight: 500 }}>Reporting Dashboard</div>
          </div>
        </div>

        {/* Card */}
        <div style={{ background: '#141414', border: '1px solid rgba(212,175,55,0.15)', borderRadius: '12px', padding: '32px' }}>
          <div style={{ fontSize: '18px', fontWeight: 300, color: '#fff', marginBottom: '6px', letterSpacing: '-0.01em' }}>Enter access key</div>
          <div style={{ fontSize: '12px', color: '#666', marginBottom: '28px', lineHeight: 1.6 }}>
            Enter your access key to view the dashboard. Contact your admin if you don't have one.
          </div>

          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '16px' }}>
              <input
                type="password"
                value={key}
                onChange={e => { setKey(e.target.value); setError(false) }}
                placeholder="Enter access key"
                autoFocus
                style={{
                  width: '100%', background: '#0a0a0a',
                  border: `1px solid ${error ? 'rgba(220,50,50,0.5)' : 'rgba(212,175,55,0.15)'}`,
                  borderRadius: '6px', padding: '11px 14px',
                  fontSize: '13px', color: '#fff',
                  fontFamily: "'Inter', system-ui, sans-serif",
                  outline: 'none', letterSpacing: '0.1em',
                  transition: 'border-color 0.2s',
                }}
                onFocus={e => e.target.style.borderColor = 'rgba(212,175,55,0.4)'}
                onBlur={e => e.target.style.borderColor = error ? 'rgba(220,50,50,0.5)' : 'rgba(212,175,55,0.15)'}
              />
              {error && <div style={{ fontSize: '11px', color: '#e05555', marginTop: '6px' }}>Invalid access key. Please try again.</div>}
            </div>
            <button type="submit" style={{
              width: '100%', background: '#d4af37', border: 'none',
              borderRadius: '6px', padding: '11px',
              fontSize: '12px', fontWeight: 600, color: '#0a0a0a',
              cursor: 'pointer', fontFamily: "'Inter', system-ui, sans-serif",
              letterSpacing: '0.08em', textTransform: 'uppercase',
              transition: 'opacity 0.15s',
            }}
            onMouseEnter={e => e.target.style.opacity = '0.9'}
            onMouseLeave={e => e.target.style.opacity = '1'}
            >
              Access Dashboard
            </button>
          </form>
        </div>

        <div style={{ textAlign: 'center', marginTop: '20px', fontSize: '11px', color: '#333' }}>
          Secured · GHL Pipeline Dashboard
        </div>
      </div>
    </div>
  )
}
