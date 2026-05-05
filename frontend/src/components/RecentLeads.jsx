import React, { useState } from 'react'

const SOURCE_COLORS = { 'Meta Ads': '#d4af37', 'Indeed': '#b89228', 'OnlineJobs.ph': '#856010' }
const STAGE_COLORS = {
  'Application Review': '#856010',
  'Ready for Group Interview': '#a07818',
  'Group Interview Booked': '#b89228',
  'Show – Group Interview': '#c8a430',
  'Academy Approved': '#d4af37',
  'Website Live': '#d4af37',
  'Offer Accepted': '#d4af37',
}
const STAGE_BG = {
  'Application Review': 'rgba(133,96,16,0.15)',
  'Ready for Group Interview': 'rgba(160,120,24,0.15)',
  'Group Interview Booked': 'rgba(184,146,40,0.15)',
  'Show – Group Interview': 'rgba(200,164,48,0.15)',
  'Academy Approved': 'rgba(212,175,55,0.15)',
  'Website Live': 'rgba(212,175,55,0.15)',
  'Offer Accepted': 'rgba(212,175,55,0.18)',
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

function initials(name) {
  return (name || '?').split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase()
}

export default function RecentLeads({ leads }) {
  const [showAll, setShowAll] = useState(false)

  if (!leads?.length) return (
    <div style={{ textAlign: 'center', padding: '32px', color: '#444', fontSize: '13px' }}>
      No leads yet — connect your GHL webhook to see live data
    </div>
  )

  const visible = showAll ? leads : leads.slice(0, 10)
  const hasMore = leads.length > 10

  return (
    <div>
      {visible.map(lead => (
        <div key={lead.contactId} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '10px 0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
          <div style={{ width: '32px', height: '32px', borderRadius: '50%', border: `1px solid ${SOURCE_COLORS[lead.source] || '#d4af37'}44`, background: `${SOURCE_COLORS[lead.source] || '#d4af37'}11`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', fontWeight: 600, color: SOURCE_COLORS[lead.source] || '#d4af37', flexShrink: 0 }}>
            {initials(lead.name)}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: '13px', fontWeight: 500, color: '#fff', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{lead.name || 'Unknown'}</div>
            <div style={{ fontSize: '11px', color: '#555', marginTop: '1px' }}>{lead.source}</div>
          </div>
          <div style={{ flexShrink: 0, textAlign: 'right' }}>
            <div style={{ fontSize: '10px', fontWeight: 500, padding: '2px 8px', borderRadius: '4px', color: STAGE_COLORS[lead.currentStage] || '#d4af37', background: STAGE_BG[lead.currentStage] || 'rgba(212,175,55,0.1)', marginBottom: '3px', whiteSpace: 'nowrap' }}>
              {lead.currentStage}
            </div>
            <div style={{ fontSize: '10px', color: '#444' }}>{timeAgo(lead.updatedAt)}</div>
          </div>
        </div>
      ))}

      {hasMore && (
        <div style={{ paddingTop: '14px', textAlign: 'center' }}>
          <button onClick={() => setShowAll(v => !v)} style={{
            background: 'transparent', border: '1px solid rgba(212,175,55,0.2)',
            borderRadius: '6px', padding: '8px 20px', color: '#d4af37',
            fontSize: '11px', fontWeight: 500, cursor: 'pointer',
            fontFamily: "'Inter', system-ui, sans-serif",
            letterSpacing: '0.06em', textTransform: 'uppercase',
            transition: 'all .15s',
          }}
          onMouseEnter={e => e.target.style.background = 'rgba(212,175,55,0.08)'}
          onMouseLeave={e => e.target.style.background = 'transparent'}
          >
            {showAll ? `Show less` : `Show all ${leads.length} leads`}
          </button>
        </div>
      )}
    </div>
  )
}
