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
function initials(n) { return (n||'?').split(' ').map(x=>x[0]).slice(0,2).join('').toUpperCase() }

export default function Team() {
  const [team, setTeam] = useState(INITIAL_TEAM)
  const [showInvite, setShowInvite] = useState(false)
  const [form, setForm] = useState({ name: '', email: '', role: 'Viewer' })

  function handleInvite() {
    if (!form.email || !form.name) return
    setTeam(prev => [...prev, { id: Date.now(), ...form, last: 'Never' }])
    setForm({ name: '', email: '', role: 'Viewer' }); setShowInvite(false)
  }

  const inputStyle = { background: '#0a0a0a', border: '1px solid rgba(212,175,55,0.1)', borderRadius: '5px', padding: '7px 10px', fontSize: '11px', color: 'var(--text)', fontFamily: 'var(--font-body)', outline: 'none', fontWeight: 300, width: '100%' }

  return (
    <div>
      <div style={{ marginBottom: '4px', fontSize: '16px', fontWeight: 300, letterSpacing: '-0.01em', color: 'var(--text)' }}>Team Access</div>
      <div style={{ fontSize: '11px', color: 'var(--text-3)', marginBottom: '18px', letterSpacing: '0.03em' }}>Manage who can view this dashboard and their permissions</div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '8px', marginBottom: '14px' }}>
        {[
          { label: 'Members', val: team.length, sub: `${team.filter(m=>m.role==='Admin').length} admin`, accent: '#d4af37' },
          { label: 'Last Login', val: 'Today', sub: 'Sarah K. 11:24 AM', accent: '#b89228' },
          { label: 'Access Roles', val: '3', sub: 'Admin, Manager, Viewer', accent: '#856010' },
        ].map(k => (
          <div key={k.label} style={{ background: 'var(--bg-3)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: '14px', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', top: 0, left: 12, right: 12, height: '1px', background: k.accent }} />
            <div style={{ fontSize: '9px', fontWeight: 500, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '8px' }}>{k.label}</div>
            <div style={{ fontSize: '24px', fontWeight: 300, color: 'var(--text)', letterSpacing: '-0.02em', lineHeight: 1 }}>{k.val}</div>
            <div style={{ fontSize: '10px', color: 'var(--text-3)', marginTop: '5px' }}>{k.sub}</div>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '10px' }}>
        {team.map(member => (
          <div key={member.id} style={{ background: 'var(--bg-3)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: '14px', display: 'flex', alignItems: 'center', gap: '12px', transition: 'border-color .15s' }}
            onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(212,175,55,0.2)'}
            onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(212,175,55,0.08)'}
          >
            <div style={{ width: '34px', height: '34px', borderRadius: '50%', border: '1px solid rgba(212,175,55,0.2)', color: '#d4af37', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', fontWeight: 600, flexShrink: 0, letterSpacing: '0.04em' }}>
              {initials(member.name)}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: '12px', fontWeight: 400, color: 'var(--text)', letterSpacing: '0.01em' }}>{member.name}</div>
              <div style={{ fontSize: '10px', color: 'var(--text-3)', fontWeight: 300, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{member.email}</div>
              <div style={{ fontSize: '9px', fontWeight: 500, padding: '2px 7px', borderRadius: '3px', background: 'rgba(212,175,55,0.07)', color: '#d4af37', display: 'inline-block', marginTop: '4px', letterSpacing: '0.06em', textTransform: 'uppercase' }}>{member.role}</div>
            </div>
            <div style={{ textAlign: 'right', flexShrink: 0 }}>
              <div style={{ fontSize: '9px', color: 'var(--text-3)', letterSpacing: '0.04em' }}>Last seen</div>
              <div style={{ fontSize: '10px', color: 'var(--text-2)', marginTop: '2px', fontWeight: 300 }}>{member.last}</div>
              {team.length > 1 && <button onClick={() => setTeam(prev => prev.filter(m => m.id !== member.id))} style={{ marginTop: '5px', fontSize: '9px', background: 'transparent', border: '1px solid rgba(212,175,55,0.1)', borderRadius: '3px', color: 'var(--text-3)', padding: '2px 7px', cursor: 'pointer', fontFamily: 'var(--font-body)', letterSpacing: '0.04em' }}>Remove</button>}
            </div>
          </div>
        ))}
      </div>

      {showInvite ? (
        <div style={{ background: 'var(--bg-3)', border: '1px solid rgba(212,175,55,0.2)', borderRadius: 'var(--radius)', padding: '16px', marginBottom: '10px' }}>
          <div style={{ fontSize: '11px', fontWeight: 500, color: 'var(--text)', marginBottom: '12px', letterSpacing: '0.04em' }}>Invite team member</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr auto auto', gap: '8px', alignItems: 'end' }}>
            <div>
              <div style={{ fontSize: '9px', color: 'var(--text-3)', marginBottom: '5px', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 500 }}>Full name</div>
              <input value={form.name} onChange={e => setForm(p => ({...p,name:e.target.value}))} placeholder="Jane Smith" style={inputStyle} />
            </div>
            <div>
              <div style={{ fontSize: '9px', color: 'var(--text-3)', marginBottom: '5px', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 500 }}>Email</div>
              <input value={form.email} onChange={e => setForm(p => ({...p,email:e.target.value}))} placeholder="jane@company.com" style={inputStyle} />
            </div>
            <div>
              <div style={{ fontSize: '9px', color: 'var(--text-3)', marginBottom: '5px', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 500 }}>Role</div>
              <select value={form.role} onChange={e => setForm(p => ({...p,role:e.target.value}))} style={{ ...inputStyle, width: 'auto' }}>
                {ROLES.map(r => <option key={r}>{r}</option>)}
              </select>
            </div>
            <div style={{ display: 'flex', gap: '6px' }}>
              <button onClick={handleInvite} style={{ padding: '7px 14px', background: '#d4af37', border: 'none', borderRadius: '5px', color: '#060606', fontWeight: 600, fontSize: '11px', cursor: 'pointer', fontFamily: 'var(--font-body)', letterSpacing: '0.04em' }}>Add</button>
              <button onClick={() => setShowInvite(false)} style={{ padding: '7px 10px', background: 'transparent', border: '1px solid var(--border)', borderRadius: '5px', color: 'var(--text-3)', fontSize: '11px', cursor: 'pointer', fontFamily: 'var(--font-body)' }}>Cancel</button>
            </div>
          </div>
        </div>
      ) : (
        <button onClick={() => setShowInvite(true)} style={{ width: '100%', background: 'transparent', border: '1px dashed rgba(212,175,55,0.2)', borderRadius: 'var(--radius)', padding: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', color: 'var(--text-3)', fontSize: '11px', cursor: 'pointer', fontFamily: 'var(--font-body)', transition: 'all .15s', marginBottom: '10px', letterSpacing: '0.06em', textTransform: 'uppercase', fontWeight: 500 }}
          onMouseEnter={e => { e.currentTarget.style.borderColor='rgba(212,175,55,0.4)'; e.currentTarget.style.color='#d4af37'; }}
          onMouseLeave={e => { e.currentTarget.style.borderColor='rgba(212,175,55,0.2)'; e.currentTarget.style.color='var(--text-3)'; }}
        >+ Invite Member</button>
      )}

      <div style={{ background: 'var(--bg-3)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: '18px' }}>
        <div style={{ fontSize: '9px', fontWeight: 500, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: '14px', paddingBottom: '10px', borderBottom: '1px solid rgba(212,175,55,0.07)' }}>Access Levels</div>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '11px' }}>
          <thead>
            <tr>
              <th style={{ textAlign: 'left', padding: '6px 10px', fontSize: '9px', color: 'var(--text-3)', fontWeight: 500, borderBottom: '1px solid var(--border)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Role</th>
              {Object.keys(ROLE_PERMS.Admin).map(p => (
                <th key={p} style={{ padding: '6px 10px', fontSize: '9px', color: 'var(--text-3)', fontWeight: 500, borderBottom: '1px solid var(--border)', textAlign: 'center', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{p}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {ROLES.map(role => (
              <tr key={role} style={{ borderBottom: '1px solid rgba(212,175,55,0.04)' }}>
                <td style={{ padding: '10px', color: 'var(--text)', fontWeight: 400 }}>{role}</td>
                {Object.values(ROLE_PERMS[role]).map((has, i) => (
                  <td key={i} style={{ padding: '10px', textAlign: 'center', color: has ? '#d4af37' : 'var(--text-3)', fontWeight: has ? 500 : 300 }}>{has ? '✓' : '—'}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
