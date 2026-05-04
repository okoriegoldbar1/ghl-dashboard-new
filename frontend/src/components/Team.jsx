import React, { useState } from 'react'

const INITIAL_TEAM = [
  { id: 1, name: 'Alex Johnson', role: 'Admin', email: 'alex@company.com', last: 'Today 2:41 PM' },
  { id: 2, name: 'Sarah Kim', role: 'Admin', email: 'sarah@company.com', last: 'Today 11:24 AM' },
  { id: 3, name: 'Marcus Webb', role: 'Manager', email: 'marcus@company.com', last: 'Yesterday' },
  { id: 4, name: 'Priya Patel', role: 'Viewer', email: 'priya@company.com', last: 'May 2' },
]

const ROLES = ['Admin', 'Manager', 'Viewer']
const ROLE_PERMS = {
  Admin:   { Overview: true, Pipeline: true, 'Ad Spend': true, Trends: true, 'Drop-off': true, Team: true },
  Manager: { Overview: true, Pipeline: true, 'Ad Spend': true, Trends: true, 'Drop-off': true, Team: false },
  Viewer:  { Overview: true, Pipeline: true, 'Ad Spend': false, Trends: true, 'Drop-off': false, Team: false },
}

function initials(name) {
  return (name || '?').split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase()
}

export default function Team() {
  const [team, setTeam] = useState(INITIAL_TEAM)
  const [showInvite, setShowInvite] = useState(false)
  const [inviteEmail, setInviteEmail] = useState('')
  const [inviteRole, setInviteRole] = useState('Viewer')
  const [inviteName, setInviteName] = useState('')

  const admins = team.filter(m => m.role === 'Admin').length
  const viewers = team.filter(m => m.role !== 'Admin').length

  function handleInvite() {
    if (!inviteEmail || !inviteName) return
    setTeam(prev => [...prev, { id: Date.now(), name: inviteName, role: inviteRole, email: inviteEmail, last: 'Never' }])
    setInviteEmail(''); setInviteName(''); setShowInvite(false)
  }

  function removeUser(id) {
    setTeam(prev => prev.filter(m => m.id !== id))
  }

  return (
    <div>
      <div style={{ marginBottom: '4px', fontSize: '18px', fontWeight: 800, fontFamily: 'var(--font-display)', color: 'var(--text)' }}>Team Access</div>
      <div style={{ fontSize: '12px', color: 'var(--text-3)', marginBottom: '16px' }}>Manage who can view this dashboard and their permission level</div>

      {/* KPIs */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px', marginBottom: '14px' }}>
        {[
          { label: 'Team Members', val: team.length, sub: `${admins} admin · ${viewers} other`, accent: '#d4af37' },
          { label: 'Last Login', val: 'Today', sub: 'Sarah K. · 11:24 AM', accent: '#c9a227' },
          { label: 'Access Roles', val: '3', sub: 'Admin, Manager, Viewer', accent: '#b8952a' },
        ].map(k => (
          <div key={k.label} style={{ background: 'var(--bg-3)', border: '1px solid var(--border)', borderRadius: '10px', padding: '14px', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '2px', background: k.accent }} />
            <div style={{ fontSize: '10px', color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: '7px', fontFamily: 'var(--font-display)', fontWeight: 600 }}>{k.label}</div>
            <div style={{ fontSize: '24px', fontWeight: 800, color: 'var(--text)', fontFamily: 'var(--font-display)', lineHeight: 1 }}>{k.val}</div>
            <div style={{ fontSize: '10px', color: 'var(--text-3)', marginTop: '5px' }}>{k.sub}</div>
          </div>
        ))}
      </div>

      {/* Team grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '10px' }}>
        {team.map((member, i) => (
          <div key={member.id} style={{ background: '#0a0a0a', border: '1px solid var(--border)', borderRadius: '10px', padding: '14px', display: 'flex', alignItems: 'center', gap: '12px', transition: 'border-color .15s' }}
            onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(212,175,55,0.25)'}
            onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(212,175,55,0.1)'}
          >
            <div style={{ width: '38px', height: '38px', borderRadius: '50%', background: `rgba(212,175,55,${0.08 + i * 0.03})`, border: '1px solid rgba(212,175,55,0.2)', color: '#d4af37', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '13px', fontWeight: 800, flexShrink: 0 }}>
              {initials(member.name)}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text)' }}>{member.name}</div>
              <div style={{ fontSize: '10px', color: 'var(--text-3)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{member.email}</div>
              <div style={{ fontSize: '9px', fontWeight: 600, padding: '2px 8px', borderRadius: '20px', background: 'rgba(212,175,55,0.1)', color: '#d4af37', display: 'inline-block', marginTop: '4px' }}>{member.role}</div>
            </div>
            <div style={{ textAlign: 'right', flexShrink: 0 }}>
              <div style={{ fontSize: '9px', color: 'var(--text-3)' }}>Last seen</div>
              <div style={{ fontSize: '10px', color: 'var(--text-2)', marginTop: '2px' }}>{member.last}</div>
              {team.length > 1 && (
                <button onClick={() => removeUser(member.id)} style={{ marginTop: '6px', fontSize: '9px', background: 'transparent', border: '1px solid rgba(212,175,55,0.12)', borderRadius: '4px', color: 'var(--text-3)', padding: '2px 7px', cursor: 'pointer', fontFamily: 'var(--font-body)' }}>Remove</button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Invite form */}
      {showInvite ? (
        <div style={{ background: 'var(--bg-2)', border: '1px solid rgba(212,175,55,0.25)', borderRadius: '10px', padding: '16px', marginBottom: '10px' }}>
          <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text)', marginBottom: '12px' }}>Invite team member</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr auto auto', gap: '8px', alignItems: 'end' }}>
            <div>
              <div style={{ fontSize: '10px', color: 'var(--text-3)', marginBottom: '5px' }}>Full name</div>
              <input value={inviteName} onChange={e => setInviteName(e.target.value)} placeholder="Jane Smith"
                style={{ width: '100%', background: '#141414', border: '1px solid rgba(212,175,55,0.15)', borderRadius: '7px', padding: '7px 10px', fontSize: '12px', color: 'var(--text)', fontFamily: 'var(--font-body)', outline: 'none' }} />
            </div>
            <div>
              <div style={{ fontSize: '10px', color: 'var(--text-3)', marginBottom: '5px' }}>Email</div>
              <input value={inviteEmail} onChange={e => setInviteEmail(e.target.value)} placeholder="jane@company.com"
                style={{ width: '100%', background: '#141414', border: '1px solid rgba(212,175,55,0.15)', borderRadius: '7px', padding: '7px 10px', fontSize: '12px', color: 'var(--text)', fontFamily: 'var(--font-body)', outline: 'none' }} />
            </div>
            <div>
              <div style={{ fontSize: '10px', color: 'var(--text-3)', marginBottom: '5px' }}>Role</div>
              <select value={inviteRole} onChange={e => setInviteRole(e.target.value)}
                style={{ background: '#141414', border: '1px solid rgba(212,175,55,0.15)', borderRadius: '7px', padding: '7px 10px', fontSize: '12px', color: 'var(--text)', fontFamily: 'var(--font-body)', outline: 'none', cursor: 'pointer' }}>
                {ROLES.map(r => <option key={r} value={r}>{r}</option>)}
              </select>
            </div>
            <div style={{ display: 'flex', gap: '6px' }}>
              <button onClick={handleInvite} style={{ padding: '7px 14px', background: '#d4af37', border: 'none', borderRadius: '7px', color: '#080808', fontWeight: 700, fontSize: '12px', cursor: 'pointer', fontFamily: 'var(--font-body)' }}>Add</button>
              <button onClick={() => setShowInvite(false)} style={{ padding: '7px 10px', background: 'transparent', border: '1px solid var(--border)', borderRadius: '7px', color: 'var(--text-3)', fontSize: '12px', cursor: 'pointer', fontFamily: 'var(--font-body)' }}>Cancel</button>
            </div>
          </div>
        </div>
      ) : (
        <button onClick={() => setShowInvite(true)} style={{ width: '100%', background: 'transparent', border: '1px dashed rgba(212,175,55,0.25)', borderRadius: '10px', padding: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', color: 'var(--text-3)', fontSize: '12px', cursor: 'pointer', fontFamily: 'var(--font-body)', transition: 'all .15s', marginBottom: '10px' }}
          onMouseEnter={e => { e.currentTarget.style.borderColor='rgba(212,175,55,0.5)'; e.currentTarget.style.color='#d4af37'; }}
          onMouseLeave={e => { e.currentTarget.style.borderColor='rgba(212,175,55,0.25)'; e.currentTarget.style.color='var(--text-3)'; }}
        >+ Invite team member</button>
      )}

      {/* Permissions table */}
      <div style={{ background: 'var(--bg-2)', border: '1px solid var(--border)', borderRadius: '10px', padding: '16px' }}>
        <div style={{ fontSize: '10px', fontWeight: 700, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '14px' }}>Access Levels</div>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px' }}>
          <thead>
            <tr>
              <th style={{ textAlign: 'left', padding: '6px 10px', fontSize: '10px', color: 'var(--text-3)', fontWeight: 600, borderBottom: '1px solid var(--border)' }}>Role</th>
              {Object.keys(ROLE_PERMS.Admin).map(p => (
                <th key={p} style={{ padding: '6px 10px', fontSize: '10px', color: 'var(--text-3)', fontWeight: 600, borderBottom: '1px solid var(--border)', textAlign: 'center' }}>{p}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {ROLES.map(role => (
              <tr key={role} style={{ borderBottom: '1px solid rgba(212,175,55,0.06)' }}>
                <td style={{ padding: '10px', color: 'var(--text)', fontWeight: 500 }}>{role}</td>
                {Object.values(ROLE_PERMS[role]).map((has, i) => (
                  <td key={i} style={{ padding: '10px', textAlign: 'center', color: has ? '#d4af37' : 'var(--text-3)' }}>{has ? '✓' : '—'}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
