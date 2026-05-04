import React from 'react'

const SOURCE_COLORS = {
  'Meta Ads': '#e17055',
  'Indeed': '#00b894',
  'OnlineJobs.ph': '#fdcb6e',
}

const STAGE_COLORS = {
  'Application Screening': '#6c5ce7',
  'Qualified for Group Interview': '#00cec9',
  'Group Interview Booked': '#00b894',
  'Approved for Academy': '#fdcb6e',
  'Website Live': '#e17055',
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
  if (!leads?.length) return (
    <div style={{ textAlign: 'center', padding: '32px', color: 'var(--text-3)', fontSize: '13px' }}>
      No leads yet — connect your GHL webhook to see live data
    </div>
  )

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
      {leads.map((lead) => (
        <div key={lead.contactId} style={{
          display: 'flex', alignItems: 'center', gap: '12px',
          padding: '10px 12px', borderRadius: 'var(--radius-sm)',
          transition: 'background 0.15s', cursor: 'default',
        }}
        onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-4)'}
        onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
        >
          <div style={{
            width: '32px', height: '32px', borderRadius: '50%',
            background: SOURCE_COLORS[lead.source] ? `${SOURCE_COLORS[lead.source]}22` : 'var(--bg-4)',
            border: `1px solid ${SOURCE_COLORS[lead.source] || 'var(--border)'}44`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '11px', fontWeight: 700, color: SOURCE_COLORS[lead.source] || 'var(--text-2)',
            flexShrink: 0,
          }}>
            {initials(lead.name)}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: '13px', fontWeight: 500, color: 'var(--text)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {lead.name || 'Unknown'}
            </div>
            <div style={{ fontSize: '11px', color: 'var(--text-3)' }}>{lead.source}</div>
          </div>
          <div style={{ flexShrink: 0, textAlign: 'right' }}>
            <div style={{
              fontSize: '10px', padding: '2px 8px', borderRadius: '20px',
              background: STAGE_COLORS[lead.currentStage] ? `${STAGE_COLORS[lead.currentStage]}18` : 'var(--bg-4)',
              color: STAGE_COLORS[lead.currentStage] || 'var(--text-2)',
              fontWeight: 500, marginBottom: '2px',
            }}>
              {lead.currentStage}
            </div>
            <div style={{ fontSize: '10px', color: 'var(--text-3)' }}>{timeAgo(lead.updatedAt)}</div>
          </div>
        </div>
      ))}
    </div>
  )
}
