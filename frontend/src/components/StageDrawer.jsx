import React, { useEffect, useState } from 'react'

const API_BASE = import.meta.env.VITE_API_URL || '/api'
const SOURCE_COLORS = { 'Meta Ads': '#d4af37', 'Indeed': '#b89228', 'OnlineJobs.ph': '#856010' }

// Map short display labels → full GHL stage names
const LABEL_TO_STAGE = {
  'App. Review':          'Application Review',
  'Group Interview Ready':'Ready for Group Interview',
  'Interview Booked':     'Group Interview Booked',
  'Show – Interview':     'Show – Group Interview',
  'Academy Approved':     'Academy Approved',
  'Website Live':         'Website Live',
  '__all__':              '__all__',
}

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

export default function StageDrawer({ stage, leads, onClose, onLeadDeleted }) {
  const [deleting, setDeleting] = useState(null)
  const [deleted, setDeleted] = useState([])
  const [confirmId, setConfirmId] = useState(null)

  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [onClose])

  const isAll = stage === '__all__'

  // Resolve the full GHL stage name from the short display label
  const fullStageName = LABEL_TO_STAGE[stage] || stage

  const stageLeads = (leads || []).filter(l => {
    if (deleted.includes(l.contactId)) return false
    if (isAll) return true
    const leadStage = (l.currentStage || '').toLowerCase().trim()
    const target = fullStageName.toLowerCase().trim()
    return leadStage === target
  })

  async function handleDelete(contactId) {
    setDeleting(contactId)
    try {
      await fetch(`${API_BASE}/delete-lead?contactId=${encodeURIComponent(contactId)}`, { method: 'DELETE' })
      setDeleted(prev => [...prev, contactId])
      setConfirmId(null)
      if (onLeadDeleted) onLeadDeleted()
    } catch (e) {
      console.error('Delete failed:', e)
    } finally {
      setDeleting(null)
    }
  }

  const displayTitle = isAll ? 'All Applicants' : (LABEL_TO_STAGE[stage] || stage)

  return (
    <>
      {/* Backdrop */}
      <div onClick={onClose} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.65)', zIndex: 200 }} />

      {/* Drawer */}
      <div style={{ position: 'fixed', top: 0, right: 0, bottom: 0, width: '440px', background: '#0f0f0f', borderLeft: '1px solid rgba(212,175,55,0.15)', zIndex: 201, display: 'flex', flexDirection: 'column', fontFamily: "'Inter', system-ui, sans-serif" }}>

        {/* Header */}
        <div style={{ padding: '20px 24px', borderBottom: '1px solid rgba(255,255,255,0.06)', flexShrink: 0 }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
            <div>
              <div style={{ fontSize: '9px', fontWeight: 600, color: '#555', textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: '5px' }}>Stage</div>
              <div style={{ fontSize: '16px', fontWeight: 400, color: '#fff', letterSpacing: '-0.01em' }}>{displayTitle}</div>
              <div style={{ fontSize: '12px', color: '#555', marginTop: '4px' }}>
                <span style={{ color: '#d4af37', fontWeight: 500 }}>{stageLeads.length}</span> {isAll ? 'total applicants in selected period' : `lead${stageLeads.length !== 1 ? 's' : ''} currently here`}
              </div>
              {/* Source mini bar */}
              {stageLeads.length > 0 && (
                <div style={{ display: 'flex', gap: '14px', marginTop: '10px' }}>
                  {['Meta Ads', 'Indeed', 'OnlineJobs.ph'].map(src => {
                    const count = stageLeads.filter(l => l.source === src).length
                    if (!count) return null
                    return (
                      <div key={src} style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                        <div style={{ width: '5px', height: '5px', borderRadius: '50%', background: SOURCE_COLORS[src] }} />
                        <span style={{ fontSize: '11px', color: '#666' }}>{src.split(' ')[0]}</span>
                        <span style={{ fontSize: '12px', fontWeight: 500, color: '#fff' }}>{count}</span>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
            <button onClick={onClose} style={{ background: 'transparent', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '6px', width: '32px', height: '32px', color: '#666', cursor: 'pointer', fontSize: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Inter', system-ui, sans-serif", flexShrink: 0 }}>✕</button>
          </div>
        </div>

        {/* Lead list */}
        <div style={{ flex: 1, overflowY: 'auto' }}>
          {stageLeads.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '48px 24px', color: '#444' }}>
              <div style={{ fontSize: '28px', marginBottom: '10px', opacity: 0.2 }}>○</div>
              <div style={{ fontSize: '13px' }}>No leads in this stage</div>
              <div style={{ fontSize: '11px', color: '#333', marginTop: '5px' }}>Leads appear here as they move through the pipeline</div>
            </div>
          ) : (
            stageLeads.map(lead => (
              <div key={lead.contactId} style={{ padding: '12px 24px', borderBottom: '1px solid rgba(255,255,255,0.04)', transition: 'background .15s' }}
                onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.02)'}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ width: '36px', height: '36px', borderRadius: '50%', flexShrink: 0, border: `1px solid ${SOURCE_COLORS[lead.source] || '#d4af37'}44`, background: `${SOURCE_COLORS[lead.source] || '#d4af37'}11`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', fontWeight: 600, color: SOURCE_COLORS[lead.source] || '#d4af37', letterSpacing: '0.04em' }}>
                    {initials(lead.name)}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: '13px', fontWeight: 500, color: '#fff', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{lead.name || 'Unknown'}</div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '5px', marginTop: '3px' }}>
                      <div style={{ width: '4px', height: '4px', borderRadius: '50%', background: SOURCE_COLORS[lead.source] || '#555' }} />
                      <span style={{ fontSize: '11px', color: '#666' }}>{lead.source || 'Unknown source'}</span>
                    </div>
                  </div>
                  <div style={{ textAlign: 'right', flexShrink: 0 }}>
                    <div style={{ fontSize: '11px', color: '#b0b0b0' }}>{formatDate(lead.createdAt)}</div>
                    <div style={{ fontSize: '10px', color: '#444', marginTop: '2px' }}>{timeAgo(lead.updatedAt)}</div>
                  </div>
                </div>

                {/* Delete */}
                <div style={{ marginTop: '8px', display: 'flex', justifyContent: 'flex-end' }}>
                  {confirmId === lead.contactId ? (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ fontSize: '11px', color: '#888' }}>Delete this lead?</span>
                      <button onClick={() => handleDelete(lead.contactId)} disabled={deleting === lead.contactId}
                        style={{ fontSize: '10px', background: 'rgba(220,50,50,0.15)', border: '1px solid rgba(220,50,50,0.3)', borderRadius: '4px', color: '#e05555', padding: '3px 10px', cursor: 'pointer', fontFamily: "'Inter', system-ui, sans-serif", fontWeight: 600 }}>
                        {deleting === lead.contactId ? 'Deleting…' : 'Yes, delete'}
                      </button>
                      <button onClick={() => setConfirmId(null)}
                        style={{ fontSize: '10px', background: 'transparent', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '4px', color: '#555', padding: '3px 10px', cursor: 'pointer', fontFamily: "'Inter', system-ui, sans-serif" }}>Cancel</button>
                    </div>
                  ) : (
                    <button onClick={() => setConfirmId(lead.contactId)}
                      style={{ fontSize: '10px', background: 'transparent', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '4px', color: '#444', padding: '3px 10px', cursor: 'pointer', fontFamily: "'Inter', system-ui, sans-serif", letterSpacing: '0.04em', transition: 'all .15s' }}
                      onMouseEnter={e => { e.target.style.borderColor = 'rgba(220,50,50,0.3)'; e.target.style.color = '#e05555' }}
                      onMouseLeave={e => { e.target.style.borderColor = 'rgba(255,255,255,0.07)'; e.target.style.color = '#444' }}
                    >Delete lead</button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div style={{ padding: '12px 24px', borderTop: '1px solid rgba(255,255,255,0.05)', flexShrink: 0, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: '10px', color: '#333', letterSpacing: '0.06em', textTransform: 'uppercase' }}>Esc to close</span>
          <button onClick={onClose} style={{ fontSize: '10px', background: 'transparent', border: '1px solid rgba(212,175,55,0.2)', borderRadius: '5px', color: '#888', padding: '6px 14px', cursor: 'pointer', fontFamily: "'Inter', system-ui, sans-serif", letterSpacing: '0.06em', textTransform: 'uppercase', fontWeight: 500 }}>Close</button>
        </div>
      </div>
    </>
  )
}
