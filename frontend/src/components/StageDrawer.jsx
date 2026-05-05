import React, { useEffect } from 'react'

const SOURCE_COLORS = { 'Meta Ads': '#d4af37', 'Indeed': '#b89228', 'OnlineJobs.ph': '#856010' }

function initials(name) {
  return (name || '?').split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase()
}

function timeAgo(iso) {
  if (!iso) return ''
  const diff = Date.now() - new Date(iso).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return 'just now'
  if (mins < 60) return `${mins}m ago`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `${hrs}h ago`
  return `${Math.floor(hrs / 24)}d ago`
}

function formatDate(iso) {
  if (!iso) return ''
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

export default function StageDrawer({ stage, leads, onClose }) {
  // Close on Escape key
  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [onClose])

  const stageLeads = (leads || []).filter(l => 
    (l.currentStage || '').toLowerCase() === (stage || '').toLowerCase()
  )

  return (
    <>
      {/* Backdrop */}
      <div onClick={onClose} style={{
        position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)',
        zIndex: 200, transition: 'opacity .2s',
      }} />

      {/* Drawer */}
      <div style={{
        position: 'fixed', top: 0, right: 0, bottom: 0, width: '420px',
        background: '#0f0f0f', borderLeft: '1px solid rgba(212,175,55,0.15)',
        zIndex: 201, display: 'flex', flexDirection: 'column',
        fontFamily: "'Inter', system-ui, sans-serif",
      }}>
        {/* Header */}
        <div style={{ padding: '20px 24px', borderBottom: '1px solid rgba(255,255,255,0.07)', display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexShrink: 0 }}>
          <div>
            <div style={{ fontSize: '9px', fontWeight: 600, color: '#555', textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: '6px' }}>Stage</div>
            <div style={{ fontSize: '16px', fontWeight: 400, color: '#fff', letterSpacing: '-0.01em' }}>{stage}</div>
            <div style={{ fontSize: '12px', color: '#666', marginTop: '4px' }}>
              <span style={{ color: '#d4af37', fontWeight: 500 }}>{stageLeads.length}</span> lead{stageLeads.length !== 1 ? 's' : ''} currently in this stage
            </div>
          </div>
          <button onClick={onClose} style={{
            background: 'transparent', border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: '6px', width: '32px', height: '32px', color: '#666',
            cursor: 'pointer', fontSize: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontFamily: "'Inter', system-ui, sans-serif", flexShrink: 0,
          }}>✕</button>
        </div>

        {/* Source breakdown mini bar */}
        {stageLeads.length > 0 && (
          <div style={{ padding: '12px 24px', borderBottom: '1px solid rgba(255,255,255,0.05)', display: 'flex', gap: '16px', flexShrink: 0 }}>
            {['Meta Ads', 'Indeed', 'OnlineJobs.ph'].map(src => {
              const count = stageLeads.filter(l => l.source === src).length
              if (count === 0) return null
              return (
                <div key={src} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: SOURCE_COLORS[src] }} />
                  <span style={{ fontSize: '11px', color: '#888' }}>{src.split(' ')[0]}</span>
                  <span style={{ fontSize: '12px', fontWeight: 500, color: '#fff' }}>{count}</span>
                </div>
              )
            })}
          </div>
        )}

        {/* Lead list */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '8px 0' }}>
          {stageLeads.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '48px 24px', color: '#444' }}>
              <div style={{ fontSize: '32px', marginBottom: '12px', opacity: 0.3 }}>○</div>
              <div style={{ fontSize: '13px' }}>No leads in this stage</div>
              <div style={{ fontSize: '11px', color: '#333', marginTop: '6px' }}>Leads will appear here as they move through the pipeline</div>
            </div>
          ) : (
            stageLeads.map(lead => (
              <div key={lead.contactId} style={{
                display: 'flex', alignItems: 'center', gap: '12px',
                padding: '12px 24px', borderBottom: '1px solid rgba(255,255,255,0.04)',
                transition: 'background .15s',
              }}
              onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.03)'}
              onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
              >
                {/* Avatar */}
                <div style={{
                  width: '36px', height: '36px', borderRadius: '50%', flexShrink: 0,
                  border: `1px solid ${SOURCE_COLORS[lead.source] || '#d4af37'}44`,
                  background: `${SOURCE_COLORS[lead.source] || '#d4af37'}11`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '11px', fontWeight: 600, color: SOURCE_COLORS[lead.source] || '#d4af37',
                  letterSpacing: '0.04em',
                }}>
                  {initials(lead.name)}
                </div>

                {/* Info */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: '13px', fontWeight: 500, color: '#fff', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {lead.name || 'Unknown'}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '3px' }}>
                    <div style={{ width: '5px', height: '5px', borderRadius: '50%', background: SOURCE_COLORS[lead.source] || '#555', flexShrink: 0 }} />
                    <span style={{ fontSize: '11px', color: '#666' }}>{lead.source || 'Unknown source'}</span>
                  </div>
                </div>

                {/* Dates */}
                <div style={{ textAlign: 'right', flexShrink: 0 }}>
                  <div style={{ fontSize: '11px', color: '#b0b0b0' }}>{formatDate(lead.createdAt)}</div>
                  <div style={{ fontSize: '10px', color: '#444', marginTop: '2px' }}>moved {timeAgo(lead.updatedAt)}</div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div style={{ padding: '14px 24px', borderTop: '1px solid rgba(255,255,255,0.05)', flexShrink: 0, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: '10px', color: '#333', letterSpacing: '0.06em', textTransform: 'uppercase' }}>Press Esc to close</span>
          <button onClick={onClose} style={{ fontSize: '11px', background: 'transparent', border: '1px solid rgba(212,175,55,0.2)', borderRadius: '5px', color: '#888', padding: '6px 14px', cursor: 'pointer', fontFamily: "'Inter', system-ui, sans-serif", letterSpacing: '0.06em', textTransform: 'uppercase', fontWeight: 500 }}>Close</button>
        </div>
      </div>
    </>
  )
}
